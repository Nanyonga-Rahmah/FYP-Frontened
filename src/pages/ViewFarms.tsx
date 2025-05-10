import { useState, useEffect } from "react";
import { PopoverDemo } from "@/components/globals/ActionPopover";
import Footer from "@/components/globals/Footer";
import Header from "@/components/globals/Header";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LocateFixed, MapPin, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AllFarms } from "@/lib/routes";
import { Layer, Line, Stage } from "react-konva";
import { checkBadgeStatus } from "./ViewHarvets";
import useAuth from "@/hooks/use-auth";
import useUserProfile from "@/hooks/use-profile";
import { convertCoordsToCanvasPoints, Farm } from "@/lib/constants";





export const getRandomColor = () => {
  const colors = ["#E7B35A", "#EE443F", "#0C5FA0"];
  return colors[Math.floor(Math.random() * colors.length)];
};

function ViewFarmsPage() {
  const navigate = useNavigate();
  const [farms, setFarms] = useState<Farm[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { authToken } = useAuth();
  const { profile, loading: profileLoading } = useUserProfile(authToken);
  
  useEffect(() => {
    const fetchFarms = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(AllFarms, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        });

        console.log(response);        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: Farm[] = await response.json();
        setFarms(data);
      } catch (err: any) {
        setError(err.message || "Failed to fetch farms");
        console.error("Error fetching farms:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFarms();
  }, [authToken]);

  console.log("--->", farms);

  

  const getInitials = (): string => {
    if (profile && profile.firstName && profile.lastName) {
      return `${profile.firstName.charAt(0)}${profile.lastName.charAt(0)}`;
    }
    return "MN"; 
  };

  return (
    <section
      className="h-screen"
      style={{
        background: "linear-gradient(to bottom, #112D3E 50%, #F6F9FF 50%)",
      }}
    >
      <Header />
      <section className="px-20 py-10">
        <div className="flex items-center justify-between ">
          <div className="flex items-center gap-3">
            <Avatar className="w-12 h-12">
              {profileLoading ? (
                <AvatarFallback className="bg-gray-400 text-white font-bold">
                  <Loader2 className="h-5 w-5 animate-spin text-white" />
                </AvatarFallback>
              ) : (
                <AvatarFallback className="bg-gray-400 text-white font-bold">
                  {getInitials()}
                </AvatarFallback>
              )}
            </Avatar>
            <div className="flex">
              <div>
                <span className="text-[#C0C9DDE5]">Greetings,</span>
                <br />
                <span className="font-semibold text-xl text-white">
                  {profileLoading ? (
                    <span className="inline-block w-32 h-6 bg-gray-300 animate-pulse rounded"></span>
                  ) : profile ? (
                    `${profile.firstName} ${profile.lastName}`
                  ) : (
                    "Mary Nantongo"
                  )}
                </span>
              </div>
            </div>
          </div>

          <div>
            <Button
              className="bg-[#E7B35A] flex items-center gap-1 rounded-md px-2 text-white"
              onClick={() => navigate("/add-farm")}
            >
              <LocateFixed />
              <span>Add Farm location</span>
            </Button>
          </div>
        </div>

        <section className="mt-16">
          <span className="font-semibold text-xl text-white">My Farms</span>

          {loading && (
            <p className="text-white text-center mt-10">Loading farms...</p>
          )}
          {error && (
            <p className="text-red-400 text-center mt-10">Error: {error}</p>
          )}

          {!loading && !error && (
            <div className="grid lg:grid-cols-3 gap-5 mt-5 mb-10">
              {farms.length > 0 ? (
                farms.map((farm, index) => (
                  <div
                    key={index}
                    className="bg-white flex flex-col max-w-[370px] max-h-[237px] rounded-[10px] py-2 px-3 shadow-sm"
                  >
                    <div
                      className={`flex items-center ml-auto capitalize px-2 py-1 rounded-full w-min ${checkBadgeStatus(farm.status)}`}
                    >
                      {farm.status}
                    </div>

                    <div>
                      {farm.polygon && (
                        <div className="h-[100px] flex items-center justify-center overflow-hidden">
                          <Stage width={100} height={100}>
                            <Layer>
                              <Line
                                points={convertCoordsToCanvasPoints(
                                  farm.polygon.coordinates[0],
                                  100,
                                  100
                                )}
                                closed
                                fill="#E7B35A"
                                stroke="#A56D00"
                              />
                            </Layer>
                          </Stage>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center justify-between px-2 py-3">
                      <div className="flex flex-col gap-1">
                        <span className="font-semibold text-xl text-[#222222]">
                          {farm.farmName}
                        </span>
                        <span className="font-normal text-sm flex items-center gap-1 text-[#5C6474]">
                          <MapPin size={10} />
                          {farm.location}
                        </span>
                        <span className="font-normal text-sm text-[#5C6474]">
                          {farm.farmSize} Acres
                        </span>
                      </div>

                      <PopoverDemo farmId={farm._id} />
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-300 col-span-full text-center mt-10">
                  You haven't added any farms yet.
                </p>
              )}
            </div>
          )}
        </section>
      </section>
      <section className="bottom-0 fixed w-full">
        <Footer />
      </section>
    </section>
  );
}

export default ViewFarmsPage;