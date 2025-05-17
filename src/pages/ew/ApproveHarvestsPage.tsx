import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import HarvestsTable from "@/components/ExtensionWorkers/tables/HarvestsTable";
import { AllHarvests } from "@/lib/routes";
import Header from "@/components/globals/Header";
import Footer from "@/components/globals/Footer";
import useAuth from "@/hooks/use-auth";
import useUserProfile from "@/hooks/use-profile";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface Harvest {
  _id: string;
  farm: {
    farmName: string;
    location: string;
  } | null;
  farmerId: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  } | null;
  weight: number;
  status: string;
  createdAt: string;
}

function ApproveHarvestsPage() {
  const [harvests, setHarvests] = useState<Harvest[]>([]);
  const [filteredHarvests, setFilteredHarvests] = useState<Harvest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    startDate: "",
    endDate: "",
  });
  const { authToken } = useAuth();
  const { profile } = useUserProfile(authToken);

  // Get initials for avatar
  const getInitials = (): string => {
    if (profile && profile.firstName && profile.lastName) {
      return `${profile.firstName.charAt(0)}${profile.lastName.charAt(0)}`;
    }
    return "JK"; 
  };

  useEffect(() => {
    const fetchHarvests = async () => {
      try {
        const response = await fetch(`${AllHarvests}/flagged/harvests`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        });
        const data = await response.json();
        if (response.ok) {
          setHarvests(data);
        } else {
          setError(data.error || "An error occurred while fetching harvests.");
        }
      } catch (err) {
        setError("Failed to fetch harvests. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchHarvests();
  }, [authToken]);

  useEffect(() => {
    const applyFilters = () => {
      let filtered = harvests;

      if (filters.search) {
        filtered = filtered.filter((harvest) =>
          harvest.farm?.farmName
            .toLowerCase()
            .includes(filters.search.toLowerCase())
        );
      }

      if (filters.status !== "all") {
        filtered = filtered.filter(
          (harvest) => harvest.status === filters.status
        );
      }

      if (filters.startDate && filters.endDate) {
        filtered = filtered.filter(
          (harvest) =>
            new Date(harvest.createdAt) >= new Date(filters.startDate) &&
            new Date(harvest.createdAt) <= new Date(filters.endDate)
        );
      }

      setFilteredHarvests(filtered);
    };

    applyFilters();
  }, [filters, harvests]);

  const handleApprove = async (harvestId: string) => {
    try {
      const response = await fetch(
        `${AllHarvests}/${harvestId}/approve-flagged`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      const data = await response.json();
      if (response.ok) {
        setFilteredHarvests((prevHarvests) =>
          prevHarvests.map((harvest) =>
            harvest._id === harvestId
              ? { ...harvest, status: "Approved" }
              : harvest
          )
        );

        setHarvests((prevHarvests) =>
          prevHarvests.map((harvest) =>
            harvest._id === harvestId
              ? { ...harvest, status: "Approved" }
              : harvest
          )
        );
      } else {
        setError(data.error || "Failed to approve harvest.");
      }
    } catch (err) {
      setError("Failed to approve harvest. Please try again.");
    }
  };

  const handleView = (harvestId: string) => {
    console.log(`View harvest ${harvestId}`);
  };

  const handleReview = (harvestId: string) => {
    console.log(`Review harvest ${harvestId}`);
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
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="w-12 h-12">
              <AvatarFallback className="bg-gray-400 text-white font-bold">
                {getInitials()}
              </AvatarFallback>
            </Avatar>
            <div>
              <span className="text-[#C0C9DDE5]">Greetings,</span>
              <br />
              <span className="font-semibold text-xl text-white">
                {profile
                  ? `${profile.firstName} ${profile.lastName}`
                  : "Julius Kayongo"}
              </span>
            </div>
          </div>
          <Button className="bg-[#E7B35A] flex items-center gap-1 rounded-md px-2">
            <span>{profile?.location || "Makindye–Sabagabo"}</span>
          </Button>
        </div>

        <div className="bg-[#112D3E] rounded-t-md mt-12">
          <div className="flex justify-between items-center px-6 py-5 border-b border-[#2E4653]">
            <div className="flex gap-10 text-white text-sm font-medium">
              <span className="border-b-2 border-[#E7B35A] pb-2">
                Harvests ({filteredHarvests.length})
              </span>
            </div>
            <HarvestsTable.Filters onFilterChange={setFilters} />
          </div>

          {/* Table */}
          <div className="border border-blue-400 rounded-t-md border-t-0 rounded-b-md bg-white px-4 pb-4 pt-2">
            {loading ? (
              <div>Loading...</div>
            ) : error ? (
              <div>{error}</div>
            ) : (
              <HarvestsTable.Rows
                harvests={filteredHarvests}
                onApprove={handleApprove}
                onView={handleView}
                onReview={handleReview}
              />
            )}
          </div>
        </div>
      </section>
      <section className="fixed bottom-0 w-full">
        <Footer />
      </section>
    </section>
  );
}

export default ApproveHarvestsPage;