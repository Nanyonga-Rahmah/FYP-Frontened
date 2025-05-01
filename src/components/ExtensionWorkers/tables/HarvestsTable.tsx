import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import ViewHarvestsModal from "../modals/ViewHarvestsModal";
import ReviewHarvestsModal from "../modals/ReviewHarvestsModal";
import { Filters } from "./FarmTable";
import useAuth from "@/hooks/use-auth";
import { API_URL } from "@/lib/routes";

interface Harvest {
  _id: string;
  farm: {
    farmName: string;
    location: string;
  } | null;
  farmerId: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  } | null;
  weight: number;
  status: string;
  createdAt: string;
}


interface RowsProps {
  harvests: Harvest[];
  onApprove: (harvestId: string) => void;
  onView: (harvestId: string) => void;
  onReview: (harvestId: string) => void;
}
export function Rows({ harvests, onApprove}: RowsProps) {
  const [selectedHarvest, setSelectedHarvest] = useState<Harvest | null>(null);
  const [modalType, setModalType] = useState<"view" | "review" | null>(null);
  const { authToken } = useAuth();

  const handleApprove = async (harvestId: string) => {
    try {
      const response = await fetch(
        `${API_URL}/admin/harvests/${harvestId}/approve-flagged`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (response.ok) {
        onApprove(harvestId);
      } else {
        console.error("Failed to approve harvest");
      }
    } catch (error) {
      console.error("Error approving harvest:", error);
    }
  };

  const getStatusBadge = (status: string) => {
    const base = "text-white text-xs px-3 py-1 rounded-full";
    if (status === "Approved" || status === "approved")
      return `${base} bg-[#3AB85E]`;
    if (status === "Flagged" || status === "flagged")
      return `${base} bg-[#E7B35A]`;
    if (status === "Rejected" || status === "rejected")
      return `${base} bg-[#FF5C5C]`;
    return `${base} bg-[#339DFF]`;
  };

  const handleCloseModal = () => {
    setSelectedHarvest(null);
    setModalType(null);
  };

  const handleViewHarvest = (harvest: Harvest) => {
    setSelectedHarvest(harvest);
    setModalType("view");
  };

  const handleReviewHarvest = (harvest: Harvest) => {
    setSelectedHarvest(harvest);
    setModalType("review");
  };

  return (
    <div className="w-full">
      {selectedHarvest && modalType === "view" && (
        <ViewHarvestsModal
          harvest={selectedHarvest}
          onClose={handleCloseModal}
        />
      )}
      {selectedHarvest && modalType === "review" && (
        <ReviewHarvestsModal
          harvest={selectedHarvest}
          onClose={handleCloseModal}
        />
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
          {harvests.map((harvest) => (
            <tr key={harvest._id} className="border-t border-white">
              <td className="px-6 py-4 font-semibold">{harvest._id}</td>
              <td className="px-6 py-4">
                {harvest.farm
                  ? `${harvest.farm.farmName}, ${harvest.farm.location}`
                  : "No Farm"}
              </td>
              <td className="px-6 py-4">
                {harvest.farmerId
                  ? `${harvest.farmerId.firstName} ${harvest.farmerId.lastName}`
                  : "N/A"}
              </td>{" "}
              <td className="px-6 py-4">{harvest.weight}</td>
              <td className="px-6 py-4">
                <span className={getStatusBadge(harvest.status)}>
                  {harvest.status}
                </span>
              </td>
              <td className="px-6 py-4">
                {harvest.createdAt
                  ? new Date(harvest.createdAt).toLocaleDateString()
                  : "N/A"}
              </td>
              <td className="px-6 py-4 relative">
                <div className="relative">
                  <button
                    onClick={() => {
                      const allMenus =
                        document.querySelectorAll('[id^="menu-"]');
                      allMenus.forEach((menu) => menu.classList.add("hidden"));
                      const currentMenu = document.getElementById(
                        `menu-${harvest._id}`
                      );
                      if (currentMenu) {
                        currentMenu.classList.remove("hidden");
                        setTimeout(
                          () => currentMenu.classList.add("hidden"),
                          5000
                        );
                      }
                    }}
                    className="p-2 rounded bg-white hover:bg-gray-100 focus:outline-none"
                  >
                    <MoreHorizontal className="w-5 h-5 text-black" />
                  </button>
                  <div
                    id={`menu-${harvest._id}`}
                    className="absolute right-0 mt-2 z-10 hidden bg-white border border-gray-200 rounded shadow-md w-36"
                  >
                    <div
                      className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleViewHarvest(harvest)}
                    >
                      View harvest
                    </div>
                    {(harvest.status === "Flagged" ||
                      harvest.status === "flagged") && (
                      <div
                        className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleReviewHarvest(harvest)}
                      >
                        Review harvest
                      </div>
                    )}
                  </div>
                </div>
                {(harvest.status === "Flagged" ||
                  harvest.status === "flagged") && (
                  <Button
                    onClick={() => handleApprove(harvest._id)}
                    className="bg-[#3AB85E] text-white"
                  >
                    Approve
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
const HarvestsTable = {
  Filters,
  Rows,
};

export default HarvestsTable;
