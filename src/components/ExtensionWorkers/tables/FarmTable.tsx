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
import ViewFarmModal from "../modals/ViewFarmModal";
import ReviewFarmModal from "../modals/ReviewFarmModal";

const farms = [
    {
      name: "Green Valley Coffee Farm",
      location: "Bombo, Luweero",
      size: "5 Acres",
      farmer: "Mary Nantongo",
      phone: "+256771234567",
      email: "mary12@gmail.com",
      idNumber: "CF981092793G9K",
      subcounty: "Makindye-Ssabagabo",
      status: "Pending",
      date: "Mar 1, 2026",
      yearStarted: "2020",
      coffeeTrees: 20 - 100,
      coordinates: "(0.3424, 32.4543)",
      perimeter: "1200m",
      methods: ["Organic"],
      certifications: ["FairTrade"],
      documents: ["FairTrade.pdf"],
      auditLogs: [
        {
          text: "Farm added by Jane Smith",
          date: "2025-03-28 10:30:15",
        },
      ],
    },
    {
      name: "Sunset Arabica Farm",
      location: "Mbale Hills",
      size: "7 Acres",
      farmer: "James Sserugo",
      phone: "+256771234568",
      email: "james@gmail.com",
      idNumber: "CF000000001AA",
      subcounty: "Mbale",
      status: "Approved",
      date: "Feb 20, 2026",
      yearStarted: "2018",
      coffeeTrees: 5 - 20,
      coordinates: "(0.4000, 33.2000)",
      perimeter: "1500m",
      methods: ["Agroforestry"],
      certifications: ["Rainforest Alliance"],
      documents: ["Rainforest.pdf"],
      auditLogs: [
        {
          text: "Farm reviewed by Allan",
          date: "2025-03-20 09:00:00",
        },
      ],
    },
    {
      name: "Riverbend Estate",
      location: "Fort Portal",
      size: "4 Acres",
      farmer: "Sarah Nabisere",
      phone: "+256772222222",
      email: "sarah@coffee.com",
      idNumber: "CF123456789XYZ",
      subcounty: "Fort Portal Central",
      status: "Rejected",
      date: "Jan 10, 2026",
      yearStarted: "2019",
      coffeeTrees: 100 - 300,
      coordinates: "(0.5432, 30.1234)",
      perimeter: "1000m",
      methods: ["Conventional"],
      certifications: ["None"],
      documents: ["LocationMap.pdf"],
      auditLogs: [
        {
          text: "Farm rejected by Peter",
          date: "2025-03-10 15:00:00",
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
          <SelectItem value="approved">Approved</SelectItem>
          <SelectItem value="rejected">Rejected</SelectItem>
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
  const [selectedFarm, setSelectedFarm] = useState<any | null>(null);
  const [modalType, setModalType] = useState<"view" | "review" | null>(null);

  const getStatusBadge = (status: string) => {
    const base = "text-white text-xs px-3 py-1 rounded-full";
    if (status === "Approved") return `${base} bg-[#3AB85E]`;
    if (status === "Rejected") return `${base} bg-[#FF5C5C]`;
    return `${base} bg-[#339DFF]`;
  };

  return (
    <div className="w-full">
      {selectedFarm && modalType === "view" && (
        <ViewFarmModal farm={selectedFarm} onClose={() => setSelectedFarm(null)} />
      )}
      {selectedFarm && modalType === "review" && (
        <ReviewFarmModal farm={selectedFarm} onClose={() => setSelectedFarm(null)} />
      )}

      <table className="w-full text-sm">
        <thead className="bg-white text-[#5C6474] border-b border-white">
          <tr>
            <th className="text-left px-6 py-3">Farm name</th>
            <th className="text-left px-6 py-3">Location</th>
            <th className="text-left px-6 py-3">Farm size</th>
            <th className="text-left px-6 py-3">Farmer</th>
            <th className="text-left px-6 py-3">Status</th>
            <th className="text-left px-6 py-3">Date submitted</th>
            <th></th>
          </tr>
        </thead>
        <tbody className="text-[#222]">
          {farms.map((farm, index) => (
            <tr key={index} className="border-t border-white">
              <td className="px-6 py-4 font-semibold">{farm.name}</td>
              <td className="px-6 py-4">{farm.location}</td>
              <td className="px-6 py-4">{farm.size}</td>
              <td className="px-6 py-4">{farm.farmer}</td>
              <td className="px-6 py-4">
                <span className={getStatusBadge(farm.status)}>{farm.status}</span>
              </td>
              <td className="px-6 py-4">{farm.date}</td>
              <td className="px-6 py-4 relative">
                <div className="relative">
                  <button
                    onClick={() => {
                      const allMenus = document.querySelectorAll('[id^="menu-"]');
                      allMenus.forEach((menu) => menu.classList.add("hidden"));

                      const currentMenu = document.getElementById(`menu-${index}`);
                      if (currentMenu) {
                        currentMenu.classList.remove("hidden");
                        setTimeout(() => {
                          currentMenu.classList.add("hidden");
                        }, 5000);
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
                        setSelectedFarm(farm);
                        setModalType(farm.status === "Pending" ? "view" : "review");
                      }}
                    >
                      {farm.status === "Pending" ? "View farm" : "Review farm"}
                    </div>
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const FarmTable = {
  Filters,
  Rows,
};

export default FarmTable;
