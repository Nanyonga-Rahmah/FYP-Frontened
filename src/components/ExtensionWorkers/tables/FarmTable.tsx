import { useState, useEffect } from "react";
import { MoreHorizontal } from "lucide-react";
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

export interface Farm {
  _id?: string;
  farmName: string;
  location: string;
  farmSize: number;
  status: string;
  createdAt: string;
  farmerId?: {
    firstName: string;
    lastName: string;
    email?: string;
    blockchainAddress?: string;
  };
  numberofTrees?: number;
  latitude?: number;
  longitude?: number;
  polygon?: {
    type: string;
    coordinates: number[][][];
  };
  area?: number;
  perimeter?: number;
  cultivationMethods?: string[];
  certifications?: string[];
  documents?: {
    name: string;
    url: string;
    mimetype?: string;
  }[];
  yearEstablished?: string;
  adminNotes?: string;
  updatedAt?: string;
  isDeleted?: boolean;
}

interface FiltersProps {
  onFilterChange: (filters: {
    search: string;
    status: string;
    startDate: string;
    endDate: string;
  }) => void;
}

interface RowsProps {
  farms: Farm[];
  loading: boolean;
  error: string | null;
}

export function Filters({ onFilterChange }: FiltersProps) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    onFilterChange({ search, status, startDate, endDate });
  }, [search, status, startDate, endDate, onFilterChange]);

  return (
    <div className="flex gap-3 items-center">
      <Input
        placeholder="Search"
        className="w-48 h-10 text-white bg-transparent border border-white rounded-md placeholder-white text-sm"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <Select onValueChange={(value) => setStatus(value)}>
        <SelectTrigger className="w-[120px] h-10 text-white bg-transparent border border-white text-sm">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
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

export function Rows({ farms, loading, error }: RowsProps) {
  const [selectedFarm, setSelectedFarm] = useState<Farm | null>(null);
  const [modalType, setModalType] = useState<"view" | "review" | null>(null);
  const [openDropdownIndex, setOpenDropdownIndex] = useState<number | null>(
    null
  );

  const getStatusBadge = (status: string) => {
    const base = "text-white text-xs px-3 py-1 rounded-full";
    if (status === "approved") return `${base} bg-[#3AB85E]`;
    if (status === "rejected") return `${base} bg-[#FF5C5C]`;
    return `${base} bg-[#339DFF]`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (loading) return <div className="text-center py-6">Loading farms...</div>;
  if (error)
    return <div className="text-center py-6 text-red-500">Error: {error}</div>;

  return (
    <div className="w-full">
      {selectedFarm && modalType === "view" && (
        <ViewFarmModal
          farm={selectedFarm}
          onClose={() => setSelectedFarm(null)}
        />
      )}
      {selectedFarm && modalType === "review" && (
        <ReviewFarmModal
          farm={selectedFarm}
          onClose={() => setSelectedFarm(null)}
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
          {farms.length === 0 ? (
            <tr>
              <td colSpan={7} className="text-center py-6">
                No farms found
              </td>
            </tr>
          ) : (
            farms.map((farm, index) => (
              <tr key={farm._id || index} className="border-t border-white">
                <td className="px-6 py-4 font-semibold">{farm.farmName}</td>
                <td className="px-6 py-4">{farm.location}</td>
                <td className="px-6 py-4">{farm.farmSize} Acres</td>
                <td className="px-6 py-4">
                  {farm.farmerId?.firstName} {farm.farmerId?.lastName}
                </td>
                <td className="px-6 py-4">
                  <span className={getStatusBadge(farm.status)}>
                    {farm.status.charAt(0).toUpperCase() + farm.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4">{formatDate(farm.createdAt)}</td>
                <td className="px-6 py-4 relative">
                  <div className="relative">
                    <button
                      onClick={() =>
                        setOpenDropdownIndex((prev) =>
                          prev === index ? null : index
                        )
                      }
                      className="p-2 rounded bg-white hover:bg-gray-100 focus:outline-none"
                    >
                      <MoreHorizontal className="w-5 h-5 text-black" />
                    </button>

                    {openDropdownIndex === index && (
                      <div
                        className="absolute right-0 mt-2 z-10 bg-white border border-gray-200 rounded shadow-md w-36"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div
                          className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                          onClick={() => {
                            setSelectedFarm(farm);
                            setModalType(
                              farm.status === "pending" ? "view" : "review"
                            );
                            setOpenDropdownIndex(null);
                          }}
                        >
                          {farm.status === "pending"
                            ? "View farm"
                            : "Review farm"}
                        </div>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))
          )}
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
