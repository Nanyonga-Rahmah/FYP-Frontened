import { useState, useEffect } from "react";
import { PopoverDemo } from "@/components/globals/ActionPopover";
import { AddHarvest } from "@/components/Farmers/AddHarvest";
import Footer from "@/components/globals/Footer";
import Header from "@/components/globals/Header";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Calendar1, MapPin, Sprout, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { AllHarvests } from "@/lib/routes";
import useAuth from "@/hooks/use-auth";
import useUserProfile from "@/hooks/use-profile";

interface Harvest {
  _id: string;
  coffeeVariety: string;
  weight: number;
  harvestPeriod: {
    start: string;
    end: string;
  };
  farm: {
    _id: string;
    farmName: string;
    location: string;
    farmSize: number;
  };
  status: "pending" | "approved" | "rejected";
  isFlagged: boolean;
  cultivationMethods: string[];
  createdAt: string;
  blockchainTxHash?: string;
}

export const checkBadgeStatus = (status: string) => {
  switch (status) {
    case "approved":
      return "bg-[#43B75D] text-white";
    case "pending":
      return "bg-blue-500 text-white";
    case "rejected":
      return "bg-red-500 text-white";
    case "submitted":
      return "bg-[#43B75D] text-white";
    case "Not submitted":
      return "bg-[#D9D9D9] text-[#656565]";
    default:
      return "bg-[#D9D9D9] text-[#656565]";
  }
};

function ViewHarvestsPage() {
  const [harvests, setHarvests] = useState<Harvest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { authToken } = useAuth();
  const { profile, loading: profileLoading } = useUserProfile(authToken);

  useEffect(() => {
    const fetchHarvests = async () => {
      setLoading(true);
      try {
        const response = await fetch(AllHarvests, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setHarvests(data);
      } catch (err: any) {
        setError(err.message || "Failed to fetch harvests");
        console.error("Error fetching harvests:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHarvests();
  }, [authToken]);

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM d, yyyy");
    } catch (e) {
      return "Invalid date";
    }
  };

  const getHarvestDisplayId = (id: string, index: number) => {
    const suffix = id ? id.slice(-3) : String(index + 1).padStart(3, "0");
    return `HRV-${suffix}`;
  };

  const mapStatusForUI = (status: string, isFlagged: boolean) => {
    if (isFlagged) return "pending";
    if (status === "approved") return "submitted";
    if (status === "pending") return "Not submitted";
    return status;
  };

  const getInitials = (): string => {
    if (profile && profile.firstName && profile.lastName) {
      return `${profile.firstName.charAt(0)}${profile.lastName.charAt(0)}`;
    }
    return "MN";
  };

  return (
    <section
      className="min-h-screen flex flex-col"
      style={{
        background: "linear-gradient(to bottom, #112D3E 45%, #F6F9FF 45%)",
      }}
    >
      <Header />
      <section className="lg:px-[5vw] px-[4vw] py-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 mb-4 md:mb-0">
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
            <div>
              <span className="text-[#C0C9DDE5] text-sm">Greetings,</span>
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

        <section className="mt-16 lg:mt-[15vh]">
          <div className="flex items-center justify-between mb-5">
            <span className="font-semibold text-xl text-white">
              Harvest records
            </span>

            <div>
              <AddHarvest />
            </div>
          </div>

          {loading ? (
            <div className="text-center text-white py-10">
              Loading harvests...
            </div>
          ) : error ? (
            <div className="text-center text-red-400 py-10">Error: {error}</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-5 mb-10">
              {harvests.length > 0 ? (
                harvests.map((harvest, index) => {
                  const displayStatus = mapStatusForUI(
                    harvest.status,
                    harvest.isFlagged
                  );

                  return (
                    <div
                      key={harvest._id}
                      className="bg-white flex flex-col max-w-[370px] max-h-[237px] rounded-[10px] py-1 px-3 shadow-sm"
                    >
                      <div className="flex flex-col py-2.5">
                        <div className="flex items-center justify-between ">
                          <span className="font-semibold text-xl text-black">
                            {getHarvestDisplayId(harvest._id, index)}
                          </span>

                          <span
                            className={`px-2 py-1 text-xs rounded-3xl capitalize ${checkBadgeStatus(displayStatus)}`}
                          >
                            {displayStatus}
                          </span>
                        </div>

                        <div className="flex items-center my-1 gap-1 text-black">
                          <Sprout size={16} />
                          <span>
                            {harvest.coffeeVariety} ({harvest.weight} kg)
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex flex-col gap-1 ">
                            <span className="font-normal text-sm flex items-center gap-1 text-[#5C6474]">
                              <MapPin size={10} />
                              {harvest.farm.location} ({harvest.farm.farmSize}{" "}
                              Acres)
                            </span>

                            <div className="flex items-center gap-1">
                              <Calendar1 size={15} />
                              <span className="text-[#838383]">Harvested:</span>
                              <span className="text-[#202020]">
                                {formatDate(harvest.harvestPeriod.start)} -{" "}
                                {formatDate(harvest.harvestPeriod.end)}
                              </span>
                            </div>
                          </div>

                          <div className="flex justify-end">
                            <PopoverDemo
                              farmId={harvest._id}
                              status={displayStatus}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="col-span-full text-center py-10 bg-white/20 rounded-lg">
                  <p className="text-gray-700">
                    You haven't recorded any harvests yet.
                  </p>
                </div>
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
export default ViewHarvestsPage;
