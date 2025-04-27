import { useState, useEffect, useCallback } from "react";
import Header from "@/components/globals/ew/Header";
import Footer from "@/components/globals/Footer";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LocateFixed } from "lucide-react";
import { useNavigate } from "react-router-dom";
import FarmTable from "@/components/ExtensionWorkers/tables/FarmTable";
import { FarmAdmin } from "@/lib/routes";
import useAuth from "@/hooks/use-auth";

interface Farm {
  _id?: string;
  farmName: string;
  location: string;
  farmSize: number;
  status: string;
  createdAt: string;
  farmerId?: {
    firstName: string;
    lastName: string;
  };
}

function ApproveFarmPage() {
  const navigate = useNavigate();
  const [farms, setFarms] = useState<Farm[]>([]);
  const [filteredFarms, setFilteredFarms] = useState<Farm[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [farmCount, setFarmCount] = useState(0);
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    startDate: "",
    endDate: "",
  });
  const { authToken } = useAuth();

  useEffect(() => {
    const fetchFarms = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${FarmAdmin}pending-creations`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        });
        if (!response.ok) throw new Error("Failed to fetch farms");
        const data = await response.json();
        setFarms(data);
        setFilteredFarms(data);
        setFarmCount(data.length);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchFarms();
  }, []);

  const handleFilterChange = useCallback(
    (newFilters: typeof filters) => {
      setFilters(newFilters);
      let results = [...farms];

      if (newFilters.search) {
        const searchTerm = newFilters.search.toLowerCase();
        results = results.filter(
          (farm) =>
            farm.farmName?.toLowerCase().includes(searchTerm) ||
            farm.location?.toLowerCase().includes(searchTerm) ||
            farm.farmerId?.firstName?.toLowerCase().includes(searchTerm) ||
            farm.farmerId?.lastName?.toLowerCase().includes(searchTerm)
        );
      }

      if (newFilters.status && newFilters.status !== "all") {
        results = results.filter((farm) => farm.status === newFilters.status);
      }

      const start = newFilters.startDate
        ? new Date(newFilters.startDate)
        : null;
      const end = newFilters.endDate ? new Date(newFilters.endDate) : null;
      if (end) end.setHours(23, 59, 59);

      results = results.filter((farm) => {
        const date = new Date(farm.createdAt);
        return (!start || date >= start) && (!end || date <= end);
      });

      setFilteredFarms(results);
    },
    [farms]
  );

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
            <Avatar>
              <AvatarFallback>MN</AvatarFallback>
            </Avatar>
            <div>
              <span className="text-[#C0C9DDE5]">Greetings,</span>
              <br />
              <span className="font-semibold text-xl text-white">
                Julius Kayongo
              </span>
            </div>
          </div>
          <div>
            <Button
              className="bg-[#E7B35A] flex items-center gap-1 rounded-md px-2"
              onClick={() => navigate("/add-farm")}
            >
              {" "}
              <LocateFixed /> <span>Makindye– Sabagabo</span>{" "}
            </Button>
          </div>
        </div>

        <div className="bg-[#112D3E] rounded-t-md mt-12">
          <div className="flex justify-between items-center px-6 py-5 border-b border-[#2E4653]">
            <div className="flex gap-10 text-white text-sm font-medium">
              <span className="border-b-2 border-[#E7B35A] pb-2">
                Farms ({farmCount})
              </span>
              <span className="text-[#C0C9DDE5]">Requests (0)</span>
            </div>
            {/* @ts-ignore */}
            <FarmTable.Filters onFilterChange={handleFilterChange} />
          </div>
          <div className="border border-blue-400 rounded-t-md border-t-0 rounded-b-md bg-white px-4 pb-4 pt-2">
            {/* @ts-ignore */}
            <FarmTable.Rows
              farms={filteredFarms}
              loading={loading}
              error={error}
            />
          </div>
        </div>
      </section>
      <section className="fixed bottom-0 w-full">
        <Footer />
      </section>
    </section>
  );

}
export default ApproveFarmPage;
