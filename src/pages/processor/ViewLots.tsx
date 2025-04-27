import { useState } from "react";
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
import { Calendar } from "@/components/ui/calendar"; // If you use it for date selection
import { DateRange } from "react-day-picker";
import { SubmitLot } from "@/components/Processor/SubmitLot";
import { useNavigate } from "react-router-dom";

const lots = [
  {
    id: "LT-001",
    batches: "BH-001, BH-002 (100kg)",
    date: "Nov 30, 2026",
    status: "Submitted",
  },
  {
    id: "LT-001",
    batches: "BH-001, BH-002 (100kg)",
    date: "Nov 30, 2026",
    status: "Delivered",
  },
  {
    id: "LT-001",
    batches: "BH-001, BH-002 (100kg)",
    date: "Nov 30, 2026",
    status: "Exported",
  },
  {
    id: "LT-001",
    batches: "BH-001, BH-002 (100kg)",
    date: "Nov 30, 2026",
    status: "Exported",
  },
  {
    id: "LT-001",
    batches: "BH-001, BH-002 (100kg)",
    date: "Nov 30, 2026",
    status: "Submitted",
  },
  {
    id: "LT-001",
    batches: "BH-001, BH-002 (100kg)",
    date: "Nov 30, 2026",
    status: "Delivered",
  },
];

const statusColors: Record<string, string> = {
  Submitted: "bg-green-100 text-green-700",
  Delivered: "bg-blue-100 text-blue-700",
  Exported: "bg-purple-100 text-purple-700",
};

function LotHistoryPage() {
  const [date, setDate] = useState<DateRange | undefined>();
  const navigate = useNavigate();
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
              <AvatarFallback className="text-xl">MN</AvatarFallback>
            </Avatar>
            <div>
              <span className="text-[#C0C9DDE5] text-sm">Greetings,</span>
              <br />
              <span className="font-semibold text-xl text-white">
                Mary Nantongo
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
                  11 Nov - 12 Nov
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {lots.map((lot, index) => (
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
                    <CalendarDays className="h-4 w-4" />
                    <span>Submitted: {lot.date}</span>
                  </div>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[lot.status]}`}
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
      </div>

      <Footer />
    </section>
  );
}
export default LotHistoryPage;
