import { useState, useEffect } from "react";
import { CalendarDays, Search } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Header from "@/components/globals/Header";
import Footer from "@/components/globals/Footer";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { DateRange } from "react-day-picker";
import { SubmitLot } from "@/components/Processor/SubmitLot";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import useAuth from "@/hooks/use-auth";
import useUserProfile from "@/hooks/use-profile";
import { API_URL } from "@/lib/routes";

interface Lot {
  id: string;
  batches: string;
  date: string;
  status: "Submitted" | "Delivered" | "Exported";
}

const statusColors: Record<string, string> = {
  Submitted: "bg-green-100 text-green-700",
  Delivered: "bg-blue-100 text-blue-700",
  Exported: "bg-purple-100 text-purple-700",
};

function LotHistoryPage() {
  const [date, setDate] = useState<DateRange | undefined>();
  const [lots, setLots] = useState<Lot[]>([]);
  const [filteredLots, setFilteredLots] = useState<Lot[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const navigate = useNavigate();
  const { toast } = useToast();
  const { authToken } = useAuth();
  const { profile } = useUserProfile(authToken);

  // Get initials for avatar
  const getInitials = (): string => {
    if (profile && profile.firstName && profile.lastName) {
      return `${profile.firstName.charAt(0)}${profile.lastName.charAt(0)}`;
    }
    return "MN"; // Fallback to default initials
  };

  useEffect(() => {
    const fetchLots = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}lots`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch lots");
        }

        const data = await response.json();
        setLots(data);
        setFilteredLots(data);
      } catch (error) {
        console.error("Error fetching lots:", error);
        toast({
          title: "Error",
          description: "Failed to fetch lots. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchLots();
  }, [authToken, toast]);

  // Filter lots based on search term
  useEffect(() => {
    if (searchTerm) {
      const filtered = lots.filter(
        (lot) =>
          lot.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          lot.batches.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredLots(filtered);
    } else {
      setFilteredLots(lots);
    }
  }, [searchTerm, lots]);

  useEffect(() => {
    if (date?.from && date?.to) {
      const fromDate = date.from;
      const toDate = date.to;

      toDate.setDate(toDate.getDate() + 1);

      const filtered = lots.filter((lot) => {
        const lotDate = new Date(lot.date);
        return lotDate >= fromDate && lotDate <= toDate;
      });

      setFilteredLots(filtered);
    }
  }, [date, lots]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <section
      className="min-h-screen flex flex-col"
      style={{
        background: "linear-gradient(to bottom, #112D3E 45%, #F6F9FF 45%)",
      }}
    >
      <Header />

      {/* Main content */}
      <div className="px-4 md:px-10 lg:px-20 py-10 flex-grow">
        {/* Greeting */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
            <Avatar className="w-12 h-12">
              <AvatarFallback className="text-xl bg-gray-400 text-white font-bold">
                {getInitials()}
              </AvatarFallback>
            </Avatar>
            <div>
              <span className="text-[#C0C9DDE5] text-sm">Greetings,</span>
              <br />
              <span className="font-semibold text-xl text-white">
                {profile
                  ? `${profile.firstName} ${profile.lastName}`
                  : "Mary Nantongo"}
              </span>
            </div>
          </div>
        </div>

        {/* Title + Filters */}
        <div className="flex items-center justify-between mb-10">
          <h1 className="text-2xl font-semibold text-white">Lot History</h1>

          <div className="flex items-center gap-2">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search"
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm w-64 focus:outline-none"
                value={searchTerm}
                onChange={handleSearch}
              />
              <Search className="absolute top-2.5 left-3 h-4 w-4 text-gray-400" />
            </div>

            {/* Date Picker */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="flex items-center gap-2 rounded-lg border-gray-300 text-gray-700 hover:bg-gray-100"
                >
                  <CalendarDays className="h-4 w-4" />
                  {date?.from && date?.to
                    ? `${date.from.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })} - ${date.to.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}`
                    : "Filter by date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="range"
                  selected={date}
                  onSelect={setDate}
                  numberOfMonths={2}
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            {/* Submit Batch Button */}
            <SubmitLot />
          </div>
        </div>

        {/* Lot Cards */}
        {loading ? (
          <div className="text-center text-white py-10">
            <p>Loading lots...</p>
          </div>
        ) : filteredLots.length === 0 ? (
          <div className="text-center text-white py-10">
            <p>No lots found. {searchTerm && "Try adjusting your search."}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLots.map((lot, index) => (
              <div
                key={index}
                className="border bg-white rounded-lg p-4 shadow-sm flex flex-col gap-4"
              >
                <div className="flex justify-between items-start">
                  <div className="flex flex-col gap-1">
                    <h2 className="text-lg font-semibold text-gray-900">
                      {lot.id}
                    </h2>
                    <p className="text-sm text-gray-600">{lot.batches}</p>
                    <div className="flex items-center gap-1 text-sm text-gray-600 mt-2">
                      <CalendarDays className="h-41 w-4" />
                      <span>Submitted: {lot.date}</span>
                    </div>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded-full font-medium ${
                      statusColors[lot.status]
                    }`}
                  >
                    {lot.status}
                  </span>
                </div>

                <div className="mt-auto">
                  <Button
                    variant="outline"
                    className="w-full border-gray-300 text-gray-700 hover:bg-gray-100"
                    onClick={() => navigate(`/processor/view-lots/${lot.id}`)}
                  >
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </section>
  );
}

export default LotHistoryPage;
