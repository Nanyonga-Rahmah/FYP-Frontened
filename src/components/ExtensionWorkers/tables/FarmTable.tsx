// FarmTable.tsx
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
import ReviewFarmerModal from "../modals/ReviewFarmerModal";

const farmers = [
  {
    name: "Mary Nantongo",
    phone: "+256771234567",
    email: "mary12@gmail.com",
    idNumber: "CF981092793G9K",
    subcounty: "Makindye-Ssabagabo",
    status: "Pending",
    date: "Mar 1, 2026",
  },
  {
    name: "Mary Nantongo",
    phone: "+256771234567",
    email: "mary12@gmail.com",
    idNumber: "CF981092793G9K",
    subcounty: "Makindye-Ssabagabo",
    status: "Rejected",
    date: "Mar 1, 2026",
  },
  {
    name: "Mary Nantongo",
    phone: "+256771234567",
    email: "mary12@gmail.com",
    idNumber: "CF981092793G9K",
    subcounty: "Makindye-Ssabagabo",
    status: "Approved",
    date: "Mar 1, 2026",
  },
];

function Filters() {
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

function Rows() {
  const [selectedFarmer, setSelectedFarmer] = useState<any | null>(null);

  const getStatusBadge = (status: string) => {
    const base = "text-white text-xs px-3 py-1 rounded-full";
    if (status === "Approved") return `${base} bg-[#3AB85E]`;
    if (status === "Rejected") return `${base} bg-[#FF5C5C]`;
    return `${base} bg-[#339DFF]`;
  };

  return (
    <div className="w-full">
      {selectedFarmer && (
        <ReviewFarmerModal
          farmer={selectedFarmer}
          mode={selectedFarmer.status === "Pending" ? "review" : "view"}
          onClose={() => setSelectedFarmer(null)}
        />
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
          {farmers.map((farmer, index) => (
            <tr key={index} className="border-t border-white">
              <td className="px-6 py-4 font-semibold">Green Valley Coffee Farm</td>
              <td className="px-6 py-4">Bombo, Luweero</td>
              <td className="px-6 py-4">5 Acres</td>
              <td className="px-6 py-4">{farmer.name}</td>
              <td className="px-6 py-4">
                <span className={getStatusBadge(farmer.status)}>{farmer.status}</span>
              </td>
              <td className="px-6 py-4">{farmer.date}</td>
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
                      onClick={() => setSelectedFarmer(farmer)}
                    >
                      {farmer.status === "Pending" ? "Review farm" : "View farm"}
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
        <Button className="bg-[#E7B35A] hover:bg-[#e0a844] text-white px-4">
          Next Page
        </Button>
      </div>
    </div>
  );
}

const FarmTable = {
  Filters,
  Rows,
};

export default FarmTable;
