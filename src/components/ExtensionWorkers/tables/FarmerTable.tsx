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
import ViewFarmerModal from "../modals/ViewFarmerModal";
import ReviewFarmerModal from "../modals/ReviewFarmerModal";
import { AllUsers } from "@/lib/routes";
import useAuth from "@/hooks/use-auth";

export type Farmer = {
  _id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  cooperativeMembershipNumber?: string;
  kyc: {
    nationalIdNumber: string;
    nationalIdPhoto: string;
    passportSizePhoto: string;
    cooperativeLocation: string;
    status: string;
    submittedAt: string;
    processedAt?: string;
    adminNotes?: string;
    blockchainTxHash?: string;
  };
  blockchainAddress?: string;
  encryptedPrivateKey?: string;
  role: string;
};

export type FilterParams = {
  search: string;
  status: string;
  startDate: string;
  endDate: string;
};

interface FarmerTableFiltersProps {
  onFilter: (filters: FilterParams) => void;
}

export function FarmerTableFilters({ onFilter }: FarmerTableFiltersProps) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    onFilter({
      search: value,
      status: status === "all" ? "" : status,
      startDate,
      endDate,
    });
  };

  const handleStatusChange = (value: string) => {
    setStatus(value);
    onFilter({
      search,
      status: value === "all" ? "" : value,
      startDate,
      endDate,
    });
  };

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setStartDate(value);
    onFilter({
      search,
      status: status === "all" ? "" : status,
      startDate: value,
      endDate,
    });
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEndDate(value);
    onFilter({
      search,
      status: status === "all" ? "" : status,
      startDate,
      endDate: value,
    });
  };

  return (
    <div className="flex gap-3 items-center">
      <Input
        placeholder="Search"
        className="w-48 h-10 text-white bg-transparent border border-white rounded-md placeholder-white text-sm"
        value={search}
        onChange={handleSearchChange}
      />
      <Select value={status} onValueChange={handleStatusChange}>
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
        onChange={handleStartDateChange}
        className="h-10 w-[150px] border border-white rounded-md bg-transparent text-white text-sm"
      />
      <span className="text-white text-sm">to</span>
      <Input
        type="date"
        value={endDate}
        onChange={handleEndDateChange}
        className="h-10 w-[150px] border border-white rounded-md bg-transparent text-white text-sm"
      />
    </div>
  );
}

interface FarmerTableRowsProps {
  farmers: Farmer[];
  onStatusUpdate?: (userId: string, status: string, adminNotes: string) => void;
}

export function FarmerTableRows({
  farmers = [],
  onStatusUpdate,
}: FarmerTableRowsProps) {
  const [selectedFarmer, setSelectedFarmer] = useState<Farmer | null>(null);
  const [viewMode, setViewMode] = useState<"review" | "view" | null>(null);

  const getStatusBadge = (status: string) => {
    const base = "text-white text-xs px-3 py-1 rounded-full";
    switch (status.toLowerCase()) {
      case "pending":
        return `${base} bg-[#339DFF]`;
      case "approved":
        return `${base} bg-[#3AB85E]`;
      case "rejected":
        return `${base} bg-[#FF5C5C]`;
      default:
        return base;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };
  const {authToken} = useAuth()

  const handleUpdateKycStatus = async (
    userId: string,
    status: string,
    adminNotes: string
  ) => {
    try {
      const response = await fetch(`${AllUsers}${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          status,
          adminNotes,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      if (onStatusUpdate) {
        onStatusUpdate(userId, status, adminNotes);
      }

      setSelectedFarmer(null);
      setViewMode(null);
    } catch (error) {
      console.error("Error updating KYC status:", error);
    }
  };
  if (!farmers || farmers.length === 0) {
    return (
      <div className="w-full text-center py-8">No farmers data available</div>
    );
  }

  return (
    <div className="w-full bg-white rounded-md">
      {selectedFarmer && viewMode === "review" && (
        <ReviewFarmerModal
          farmer={selectedFarmer}
          onClose={() => {
            setSelectedFarmer(null);
            setViewMode(null);
          }}
          onSubmit={(status, notes) =>
            handleUpdateKycStatus(selectedFarmer._id, status, notes)
          }
        />
      )}

      {selectedFarmer && viewMode === "view" && (
        <ViewFarmerModal
          farmer={selectedFarmer}
          onClose={() => {
            setSelectedFarmer(null);
            setViewMode(null);
          }}
        />
      )}

      <table className="w-full text-sm">
        <thead className="bg-white text-[#5C6474] border-b border-white">
          <tr>
            <th className="text-left px-6 py-3">Name</th>
            <th className="text-left px-6 py-3">Contacts</th>
            <th className="text-left px-6 py-3">ID number</th>
            <th className="text-left px-6 py-3">Subcounty</th>
            <th className="text-left px-6 py-3">Status</th>
            <th className="text-left px-6 py-3">Date submitted</th>
            <th className="text-left px-6 py-3"></th>
          </tr>
        </thead>
        <tbody className="text-[#222]">
          {farmers.map((farmer, index) => (
            <tr key={index} className="border-t border-white">
              <td className="px-6 py-4 font-semibold">{`${farmer.firstName} ${farmer.lastName}`}</td>
              <td className="px-6 py-4">
                <div className="font-bold text-sm">{farmer.phone}</div>
                <div className="text-xs text-[#5C6474]">{farmer.email}</div>
              </td>
              <td className="px-6 py-4">{farmer.kyc.nationalIdNumber}</td>
              <td className="px-6 py-4">{farmer.kyc.cooperativeLocation}</td>
              <td className="px-6 py-4">
                <span className={getStatusBadge(farmer.kyc.status)}>
                  {farmer.kyc.status.charAt(0).toUpperCase() +
                    farmer.kyc.status.slice(1)}
                </span>
              </td>
              <td className="px-6 py-4">
                {formatDate(farmer.kyc.submittedAt)}
              </td>
              <td className="px-6 py-4 relative">
                <div className="relative">
                  <button
                    onClick={() => {
                      const allMenus =
                        document.querySelectorAll('[id^="menu-"]');
                      allMenus.forEach((menu) => menu.classList.add("hidden"));

                      const currentMenu = document.getElementById(
                        `menu-${index}`
                      );
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
                        console.log("clicked", farmer);
                        const currentFarmer = farmer;
                        setSelectedFarmer(currentFarmer);
                        setViewMode(
                          currentFarmer.kyc.status.toLowerCase() === "pending"
                            ? "review"
                            : "view"
                        );
                      }}
                    >
                      {farmer.kyc.status.toLowerCase() === "pending"
                        ? "Review farmer"
                        : "View farmer"}
                    </div>
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-center items-center px-6 py-4 border-t border-white">
        <span className="text-sm text-gray-500 mr-4">
          Page 1 of {Math.ceil(farmers.length / 10)}
        </span>
        <Button className="bg-[#E7B35A] hover:bg-[#e0a844] text-white px-4">
          Next Page
        </Button>
      </div>
    </div>
  );
}
