import { useState, useEffect } from "react";
import { SubmitBatch } from "@/components/Farmers/SubmitHarvest";
import Footer from "@/components/globals/Footer";
import Header from "@/components/globals/Header";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Calendar1, Sprout, Loader2, MapPin } from "lucide-react";
import useAuth from "@/hooks/use-auth";
import useUserProfile from "@/hooks/use-profile";
import { format } from "date-fns";
import axios from "axios";
import { API_URL } from "@/lib/routes";

interface Batch {
  _id: string;
  batchId: string;
  farmerId: string;
  totalWeight: number;
  submissionDate: string;
  status: string;
  documents: Array<{
    name: string;
    url: string;
    uploadDate: string;
  }>;
  harvestIds: Array<{
    _id: string;
    coffeeVariety: string;
    weight: number;
    farm?: {
      farmName: string;
      location: string;
    };
  }>;
  blockchainStatus: string;
}

export const checkBadgeStatus = (status: string) => {
  switch (status) {
    case "export_approved":
    case "processed":
    case "approved":
      return "bg-[#43B75D] text-white";
    case "export_rejected":
    case "rejected":
      return "bg-red-700 text-white";
    case "received":
    case "processing":
      return "bg-blue-500 text-white";
    case "submitted":
      return "bg-yellow-500 text-white";
    default:
      return "bg-[#D9D9D9] text-[#656565]";
  }
};

function ViewBatchPage() {
  const { authToken } = useAuth();
  const { profile, loading: profileLoading } = useUserProfile(authToken);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBatches = async () => {
      try {
        setLoading(true);
        if (!profile?.id) return;

        const response = await axios.get(`${API_URL}batches/`, {
          params: {
            farmerId: profile.id,
            isDeleted: false,
          },
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        if (response.data.success) {
          setBatches(response.data.batches);
        } else {
          setError("Failed to fetch batches");
        }
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "An error occurred while fetching batches"
        );
        console.error("Error fetching batches:", err);
      } finally {
        setLoading(false);
      }
    };

    if (profile?.id) {
      fetchBatches();
    }
  }, [authToken, profile?.id]);

  const getInitials = (): string => {
    if (profile && profile.firstName && profile.lastName) {
      return `${profile.firstName.charAt(0)}${profile.lastName.charAt(0)}`;
    }
    return "MN";
  };

  const formatDate = (dateString: string): string => {
    try {
      return format(new Date(dateString), "MMM d, yyyy");
    } catch (e) {
      return "Invalid date";
    }
  };

  const getCoffeeVariety = (batch: Batch): string => {
    if (!batch.harvestIds || batch.harvestIds.length === 0) {
      return "Unknown";
    }

    // If all harvests have the same variety, return that variety
    const varieties = new Set(batch.harvestIds.map((h) => h.coffeeVariety));
    if (varieties.size === 1) {
      return batch.harvestIds[0].coffeeVariety;
    }

    // Otherwise return mixed
    return "Mixed Varieties";
  };

  return (
    <section
      className="min-h-screen"
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
        </div>

        <section className="mt-16">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-xl text-white ">
              Batch History
            </span>

            <div className="">
              <SubmitBatch />
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center mt-10">
              <Loader2 className="h-10 w-10 text-white animate-spin" />
              <span className="ml-2 text-white">Loading batches...</span>
            </div>
          ) : error ? (
            <div className="text-center text-red-400 py-10">Error: {error}</div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-5 mt-5 mb-10">
              {batches.length > 0 ? (
                batches.map((batch) => (
                  <div
                    key={batch._id}
                    className="bg-white flex flex-col gap-2 text-black max-w-[370px] max-h-[237px] rounded-[10px] py-1 px-10 shadow-sm"
                  >
                    <div className="flex flex-col py-2.5 ">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold tetx-xl">
                          {batch.batchId.substring(
                            batch.batchId.lastIndexOf("-") + 1
                          )}
                        </span>
                        <span
                          className={`px-2 py-1 text-xs rounded-3xl capitalize ${checkBadgeStatus(batch.status)}`}
                        >
                          {batch.status}
                        </span>
                      </div>

                      <div className="flex items-center my-1 gap-1">
                        <span>
                          <Sprout size={16} />
                        </span>
                        <span>
                          {getCoffeeVariety(batch)} ({batch.totalWeight} kg)
                        </span>
                      </div>

                      {batch.harvestIds?.[0]?.farm && (
                        <div className="flex items-center gap-1 text-[#5C6474]">
                          <MapPin size={14} />
                          <span className="text-sm">
                            {batch.harvestIds[0].farm.location}
                          </span>
                        </div>
                      )}

                      <div className="flex items-center gap-1">
                        <span>
                          <Calendar1 size={15} />
                        </span>
                        <span className="text-[#838383]">Submitted:</span>
                        <span className="text-[#202020]">
                          {formatDate(batch.submissionDate)}
                        </span>
                      </div>

                      <Button
                        variant={"outline"}
                        className="my-2"
                        onClick={() =>
                          (window.location.href = `/#/view-batchDetails/${batch._id}`)
                        }
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-3 flex justify-center items-center py-10 bg-white/20 rounded-lg">
                  <p className="text-gray-700">
                    No batches found. Submit a batch to see it here.
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

export default ViewBatchPage;
