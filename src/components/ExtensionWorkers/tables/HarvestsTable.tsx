import { useState } from "react";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ViewHarvestsModal from "../modals/ViewHarvestsModal";
import ReviewHarvestsModal from "../modals/ReviewHarvestsModal";

const harvests = [
    {
      id: "HRV-001",
      farm: "Mirembe Maria Coffee Farm",
      farmId: "Farm #123",
      location: "123 Main St, Kampala, Uganda",
      coordinates: "(0.3424, 32.4543, 0.900, 83.099)",
      perimeter: "1200m",
      area: "5 Acre",
      coffeeVariety: "Arabica, Robusta",
      bags: "200 bags",
      expectedYield: "100 bags max",
      dateOfPlanting: "Nov 30, 2026",
      harvestPeriod: "Nov 30, 2026 - Jan 30, 2027",
      dateAdded: "Nov 30, 2027, 11:00PM",
      methods: ["Weeding", "Mulching"],
      farmer: "Mary Nantongo",
      image: "Coffee.jpg",
      status: "Flagged",
      auditLogs: [
        {
          text: "Harvest HRV-001 added by Jane Smith",
          date: "2025-03-28 10:30:15",
          type: "added",
        },
        {
          text: "Farm #789 approved by John Doe",
          date: "2025-03-28 11:30:05",
          type: "approved",
        },
      ],
    },
    {
      id: "HRV-002",
      farm: "Sunset Coffee Estate",
      farmId: "Farm #212",
      location: "Mbale, Uganda",
      coordinates: "(0.4000, 33.2000)",
      perimeter: "980m",
      area: "3 Acre",
      coffeeVariety: "Arabica",
      bags: "150 bags",
      expectedYield: "120 bags max",
      dateOfPlanting: "Oct 10, 2026",
      harvestPeriod: "Nov 1, 2026 - Jan 1, 2027",
      dateAdded: "Nov 10, 2027, 10:00AM",
      methods: ["Organic farming"],
      farmer: "James Sserugo",
      image: "Harvest2.jpg",
      status: "Approved",
      auditLogs: [
        {
          text: "Harvest HRV-002 approved by Lucy K",
          date: "2025-03-29 09:00:00",
          type: "approved",
        },
      ],
    },
    {
      id: "HRV-003",
      farm: "Green Hills Estate",
      farmId: "Farm #245",
      location: "Fort Portal, Uganda",
      coordinates: "(0.5432, 30.1234)",
      perimeter: "1500m",
      area: "6 Acre",
      coffeeVariety: "Robusta",
      bags: "180 bags",
      expectedYield: "150 bags max",
      dateOfPlanting: "Sep 15, 2026",
      harvestPeriod: "Nov 15, 2026 - Feb 1, 2027",
      dateAdded: "Dec 1, 2027, 9:45AM",
      methods: ["Shade growing"],
      farmer: "Sarah Nabisere",
      image: "GreenHills.jpg",
      status: "Flagged",
      auditLogs: [
        {
          text: "Harvest HRV-003 flagged by Julius",
          date: "2025-04-01 08:00:00",
          type: "flagged",
        },
      ],
    },
    {
      id: "HRV-004",
      farm: "Bugisu High Land Farm",
      farmId: "Farm #318",
      location: "Mbale, Eastern Uganda",
      coordinates: "(0.6821, 33.5011)",
      perimeter: "1100m",
      area: "4 Acre",
      coffeeVariety: "Arabica",
      bags: "100 bags",
      expectedYield: "95 bags max",
      dateOfPlanting: "Oct 1, 2026",
      harvestPeriod: "Dec 1, 2026 - Jan 30, 2027",
      dateAdded: "Dec 15, 2027, 2:30PM",
      methods: ["Intercropping"],
      farmer: "Ronald Mugisha",
      image: "BugisuFarm.jpg",
      status: "Pending",
      auditLogs: [
        {
          text: "Harvest HRV-004 added by Admin",
          date: "2025-04-02 13:22:00",
          type: "added",
        },
      ],
    },
  ];
  
export function Filters() {
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  return (
    <div className="flex gap-3 items-center">
      <Input
        placeholder="Search"
        className="w-48 h-10 text-white bg-transparent border border-white rounded-md placeholder-white text-sm"
        onChange={(e) => setSearch(e.target.value)}
      />
      <Select>
        <SelectTrigger className="w-[120px] h-10 text-white bg-transparent border border-white text-sm">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="flagged">Flagged</SelectItem>
          <SelectItem value="approved">Approved</SelectItem>
        </SelectContent>
      </Select>
      <Input
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        className="h-10 w-[150px] border border-white rounded-md bg-transparent text-white text-sm"
      />
      <span className="text-white text-sm">to</span>
      <Input
        type="date"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
        className="h-10 w-[150px] border border-white rounded-md bg-transparent text-white text-sm"
      />
    </div>
  );
}

export function Rows() {
  const [selectedHarvest, setSelectedHarvest] = useState<any | null>(null);
  const [modalType, setModalType] = useState<"view" | "review" | null>(null);

  const getStatusBadge = (status: string) => {
    const base = "text-white text-xs px-3 py-1 rounded-full";
    if (status === "Approved") return `${base} bg-[#3AB85E]`;
    if (status === "Flagged") return `${base} bg-[#E7B35A]`;
    return `${base} bg-[#339DFF]`; // Pending
  };

  return (
    <div className="w-full">
      {selectedHarvest && modalType === "view" && (
        <ViewHarvestsModal harvest={selectedHarvest} onClose={() => setSelectedHarvest(null)} />
      )}
      {selectedHarvest && modalType === "review" && (
        <ReviewHarvestsModal harvest={selectedHarvest} onClose={() => setSelectedHarvest(null)} />
      )}

      <table className="w-full text-sm">
        <thead className="bg-white text-[#5C6474] border-b border-white">
          <tr>
            <th className="text-left px-6 py-3">Harvest ID</th>
            <th className="text-left px-6 py-3">Farm</th>
            <th className="text-left px-6 py-3">Farmer</th>
            <th className="text-left px-6 py-3">Bags</th>
            <th className="text-left px-6 py-3">Status</th>
            <th className="text-left px-6 py-3">Date submitted</th>
            <th></th>
          </tr>
        </thead>
        <tbody className="text-[#222]">
          {harvests.map((harvest, index) => (
            <tr key={index} className="border-t border-white">
              <td className="px-6 py-4 font-semibold">{harvest.id}</td>
              <td className="px-6 py-4">{harvest.farm}</td>
              <td className="px-6 py-4 underline cursor-pointer">{harvest.farmer}</td>
              <td className="px-6 py-4">{harvest.bags}</td>
              <td className="px-6 py-4">
                <span className={getStatusBadge(harvest.status)}>{harvest.status}</span>
              </td>
              <td className="px-6 py-4">{harvest.auditLogs[0].date}</td>
              <td className="px-6 py-4 relative">
                <div className="relative">
                  <button
                    onClick={() => {
                      const allMenus = document.querySelectorAll('[id^="menu-"]');
                      allMenus.forEach((menu) => menu.classList.add("hidden"));
                      const currentMenu = document.getElementById(`menu-${index}`);
                      if (currentMenu) {
                        currentMenu.classList.remove("hidden");
                        setTimeout(() => currentMenu.classList.add("hidden"), 5000);
                      }
                    }}
                    className="p-2 rounded bg-white hover:bg-gray-100 focus:outline-none"
                  >
                    <MoreHorizontal className="w-5 h-5 text-black" />
                  </button>
                  <div
                    id={`menu-${index}`}
                    className="absolute right-0 mt-2 z-10 hidden bg-white border border-gray-200 rounded shadow-md w-36"
                  >
                    <div
                      className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        setSelectedHarvest(harvest);
                        setModalType(harvest.status === "Flagged" ? "review" : "view");
                      }}
                    >
                      {harvest.status === "Flagged" ? "Review harvest" : "View harvest"}
                    </div>
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-center items-center px-6 py-4 border-t border-white">
        <span className="text-sm text-gray-500 mr-4">Page 1 of 1</span>
        <Button className="bg-[#E7B35A] hover:bg-[#e0a844] text-white px-4">Next Page</Button>
      </div>
    </div>
  );
}

const HarvestsTable = {
  Filters,
  Rows,
};

export default HarvestsTable;
