import Footer from "@/components/globals/Footer";
import Header from "@/components/globals/Header";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarDays, Search, User, LocateFixed } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { DateRange } from "react-day-picker";
import { Link } from "react-router-dom";
import { API_URL } from "@/lib/routes";
import useAuth from "@/hooks/use-auth";
import { useToast } from "@/components/ui/use-toast";

interface Batch {
  id: string;
  status: string;
  coffeeTypes: string;
  farmer: string;
  date: string;
  totalWeight?: number;
  dateReceived?: string | null;
  receiptNotes?: string;
  blockchainStatus?: string;
}

const statusColors: Record<string, string> = {
  Submitted: "bg-green-100 text-green-700",
  Delivered: "bg-blue-100 text-blue-700",
  Processed: "bg-orange-100 text-orange-700",
  Exported: "bg-purple-100 text-purple-700",
  Received: "bg-blue-100 text-blue-700",
};

function BatchHistory() {
  const [date, setDate] = useState<DateRange | undefined>();
  const [selectedTab, setSelectedTab] = useState("All");
  const [batches, setBatches] = useState<Batch[]>([]);
  const [filteredBatches, setFilteredBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { authToken } = useAuth();
  const { toast } = useToast();
  const [user] = useState({
    firstName: "Mary",
    lastName: "Nantongo",
  });

  const tabs = ["All", "Submitted", "Received", "Processed", "Exported"];

  useEffect(() => {
    const fetchBatches = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}batches/processor/batch`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch batches");
        }

        const data = await response.json();
        console.log("Batches data:", data);
        setBatches(data);
        setFilteredBatches(data);
      } catch (error) {
        console.error("Error fetching batches:", error);
        toast({
          title: "Error",
          description: "Failed to fetch batches. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    const fetchUserProfile = async () => {
      try {
        // Implement your actual API call here
        // const response = await fetch(`${API_URL}user/profile`, {
        //   headers: {
        //     Authorization: `Bearer ${authToken}`,
        //   },
        // });
        // const data = await response.json();
        // setUser(data);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchBatches();
    fetchUserProfile();
  }, [authToken, toast]);

  useEffect(() => {
    let filtered = batches;

    if (selectedTab !== "All") {
      filtered = filtered.filter((batch) => batch.status === selectedTab);
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (batch) =>
          batch.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          batch.farmer.toLowerCase().includes(searchTerm.toLowerCase()) ||
          batch.coffeeTypes.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (date?.from && date?.to) {
      filtered = filtered.filter((batch) => {
        const batchDate = new Date(batch.date);
        return batchDate >= date.from! && batchDate <= date.to!;
      });
    }

    setFilteredBatches(filtered);
  }, [selectedTab, searchTerm, date, batches]);

  const handleTabClick = (tab: string) => {
    setSelectedTab(tab);
  };

  return (
    <section
      className="min-h-screen flex flex-col"
      style={{
        background: "linear-gradient(to bottom, #112D3E 45%, #F6F9FF 45%)",
      }}
    >
      <Header />
      <section className="px-4 md:px-10 lg:px-20 py-10 flex-grow">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 mb-4 md:mb-0">
            <Avatar className="w-12 h-12">
              <AvatarFallback className="text-xl">
                {user.firstName.charAt(0)}
                {user.lastName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <span className="text-[#C0C9DDE5] text-sm">Greetings,</span>
              <br />
              <span className="font-semibold text-xl text-white">
                {user.firstName} {user.lastName}
              </span>
            </div>
          </div>

          <div className="bg-[#E7B35A] flex flex-col rounded-md text-white py-1 px-2">
            <span>ABC Coffee Processing Ltd</span>

            <div className="flex items-center">
              <LocateFixed />
              <span>Kabarole, Uganda</span>
            </div>
          </div>
        </div>
        {/* Title */}

        <div className="flex items-center justify-between my-10">
          <h1 className="text-2xl font-semibold text-white">Batch History</h1>

          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search"
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm w-64 focus:outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 rounded-lg border-gray-300 text-gray-700 hover:bg-gray-100"
                  >
                    <CalendarDays className="h-4 w-4" />
                    {date?.from && date?.to ? (
                      <span>
                        {format(date.from, "dd MMM")} -{" "}
                        {format(date.to, "dd MMM yyyy")}
                      </span>
                    ) : (
                      <span>Select date range</span>
                    )}
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
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <div className="flex gap-2">
            {tabs.map((filter) => (
              <p
                key={filter}
                onClick={() => handleTabClick(filter)}
                className={` ${selectedTab === filter ? "rounded-[8px] bg-white text-[#112D3E] px-2 py-1" : "bg-none text-white"} text-sm cursor-pointer`}
              >
                {filter}
              </p>
            ))}
          </div>
        </div>

        {/* Batch Cards */}
        {loading ? (
          <div className="text-center text-white py-10">
            <p>Loading batches...</p>
          </div>
        ) : filteredBatches.length === 0 ? (
          <div className="text-center text-white py-10">
            <p>
              No batches found{searchTerm ? " for your search" : ""}
              {selectedTab !== "All" ? ` with status "${selectedTab}"` : ""}.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBatches.map((batch, index) => (
              <div
                key={index}
                className="border bg-[#FFFFFF] rounded-lg p-4 shadow-sm flex flex-col gap-4"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      {batch.id}
                    </h2>
                    <p className="text-sm text-gray-600">{batch.coffeeTypes}</p>
                    <div className="flex items-center gap-1 text-sm text-gray-600 mt-2">
                      <User className="h-4 w-4" />
                      <span>Farmer: {batch.farmer}</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                      <CalendarDays className="h-4 w-4" />
                      <span>Submitted: {batch.date}</span>
                    </div>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[batch.status] || "bg-gray-100 text-gray-700"}`}
                  >
                    {batch.status}
                  </span>
                </div>

                <div className="mt-auto">
                  {batch.status === "Received" ? (
                    <Link
                      to={`/processor/process-batch/${batch.id}`}
                      className="w-full"
                    >
                      <Button
                        variant="outline"
                        className="w-full border-gray-300 text-gray-700 hover:bg-gray-100"
                      >
                        Process Batch
                      </Button>
                    </Link>
                  ) : (
                    <Link
                      to={`/#/processor/view-batchDetails/${batch.id}`}
                      className="w-full"
                    >
                      <Button
                        variant="outline"
                        className="w-full border-gray-300 text-gray-700 hover:bg-gray-100"
                      >
                        View Details
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
      <section className="">
        <Footer />
      </section>
    </section>
  );
}
export default BatchHistory;
