import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "@/hooks/use-auth";
import useUserProfile from "@/hooks/use-profile";
import { FarmerFarms } from "@/lib/routes";
import { Farm } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { checkBadgeStatus } from "./ViewHarvets";

function SelectFarm() {
  const navigate = useNavigate();
  const [farms, setFarms] = useState<Farm[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showMore, setShowMore] = useState(false);
  const { authToken } = useAuth();
  const { profile } = useUserProfile(authToken);

  // Fetch the user's farms
  useEffect(() => {
    const fetchFarms = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(FarmerFarms, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`, // Include auth token in headers
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: Farm[] = await response.json();
        setFarms(data); // Set farms data from the response
      } catch (err: any) {
        setError(err.message || "Failed to fetch farms");
        console.error("Error fetching farms:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFarms();
  }, [authToken]);

  // Handle farm selection to view details
  const handleFarmSelect = (farmId: string) => {
    localStorage.setItem("FarmId", farmId);
    navigate(`/dashboard`);
  };

  if (loading) {
    return <div className="text-center">Loading farms...</div>;
  }

  if (error) {
    return <div className="text-center">Error: {error}</div>;
  }

  return (
    <div className=" flex items-center justify-center flex-col min-h-screen">
      <div>
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-[#2F4F4F]">
            Welcome, {profile?.firstName}!
          </h1>
          <p className="text-[15px] text-gray-700 mt-2">
            It seems like you have many farms. Please choose the one you'd like
            to access.
          </p>
        </div>

        <div className="flex flex-col gap-2 ">
          {farms.slice(0, showMore ? farms.length : 2).map((farm) => (
            <div
              key={farm._id}
              className="bg-white p-4 rounded-lg flex justify-between gap-4 shadow-md hover:shadow-xl transition"
            >
              <div className="flex items-center gap-2">
                <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                  <span className="text-lg text-white">{farm.farmName[0]}</span>
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-[#2F4F4F]">
                    {farm.farmName}
                  </h3>
                  <p className="text-sm text-gray-600">{farm.location}</p>
                  <p className="text-sm text-gray-500">Area: {farm.area} sqm</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`capitalize rounded-full text-sm w-min px-2 ${checkBadgeStatus(farm.status)}`}
                >
                  {farm.status}
                </span>
                <Button
                  className="mt-2 text-black"
                  variant="outline"
                  onClick={() => handleFarmSelect(farm._id)}
                >
                  Access Farm
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-4">
          <Button
            variant="link"
            onClick={() => setShowMore(!showMore)}
            className="text-blue-600 hover:text-blue-800"
          >
            {showMore ? "View Less" : "View More"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default SelectFarm;
