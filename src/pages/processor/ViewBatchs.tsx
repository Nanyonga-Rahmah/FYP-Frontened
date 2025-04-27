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
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { DateRange } from "react-day-picker";
import { Link } from "react-router-dom";

const batches = [
  {
    id: "BH-001",
    status: "Submitted",
    coffeeTypes: "Arabica, Robusta (100 bags)",
    farmer: "Mary Nantongo",
    date: "Nov 30, 2026",
  },
  {
    id: "BH-001",
    status: "Delivered",
    coffeeTypes: "Arabica, Robusta (100 bags)",
    farmer: "Mary Nantongo",
    date: "Nov 30, 2026",
  },
  {
    id: "BH-001",
    status: "Submitted",
    coffeeTypes: "Arabica, Robusta (100 bags)",
    farmer: "Mary Nantongo",
    date: "Nov 30, 2026",
  },
  {
    id: "BH-001",
    status: "Exported",
    coffeeTypes: "Arabica, Robusta (100 bags)",
    farmer: "Mary Nantongo",
    date: "Nov 30, 2026",
  },
  {
    id: "BH-001",
    status: "Processed",
    coffeeTypes: "Arabica, Robusta (100 bags)",
    farmer: "Mary Nantongo",
    date: "Nov 30, 2026",
  },
  {
    id: "BH-001",
    status: "Exported",
    coffeeTypes: "Arabica, Robusta (100 bags)",
    farmer: "Mary Nantongo",
    date: "Nov 30, 2026",
  },
];

const statusColors: Record<string, string> = {
  Submitted: "bg-green-100 text-green-700",
  Delivered: "bg-blue-100 text-blue-700",
  Processed: "bg-orange-100 text-orange-700",
  Exported: "bg-purple-100 text-purple-700",
};

 function BatchHistory() {
  const [date, setDate] = useState<DateRange | undefined>();

  const [selectedTab, setSelectedTab] = useState("All");

  const tabs = ["All", "Submitted", "Delivered", "Processed", "Exported"];

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
            <div className="">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search"
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm w-64 focus:outline-none"
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {batches
            .filter((batch) => {
              if (selectedTab === "All") return true;
              return batch.status === selectedTab;
            })
            .map((batch, index) => (
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
                    className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[batch.status]}`}
                  >
                    {batch.status}
                  </span>
                </div>

                <div className="mt-auto">
                  {batch.status === "Delivered" ? (
                    <Button
                      variant="outline"
                      className="w-full border-gray-300 text-gray-700 hover:bg-gray-100"
                    >
                      Process Batch
                    </Button>
                  ) : (
                    <Link to={`/processor/view-batchDetails/${batch.id}`} className="w-full">
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
      </section>
      <section className="">
        <Footer />
      </section>
    </section>
  );
}
export default BatchHistory;
