import { useState, useEffect } from "react";
import Header from "@/components/globals/exporter/Header";
import Footer from "@/components/globals/Footer";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { CalendarIcon } from "lucide-react";
import useAuth from "@/hooks/use-auth";
import useUserProfile from "@/hooks/use-profile";
import { API_URL } from "@/lib/routes";
import { ConfirmDeliveryForm } from "@/components/exporter/modals/ConfirmDeliveryModal";
import { useToast } from "@/components/ui/use-toast";

interface Lot {
  id: string;
  type: string;
  processor: string;
  submittedDate: string;
  status: "Submitted" | "Delivered" | "Exported";
}

function ViewLotsPage() {
  const navigate = useNavigate();
  const [lots, setLots] = useState<Lot[]>([]);
  const [filteredLots, setFilteredLots] = useState<Lot[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const { authToken } = useAuth();
  const { profile } = useUserProfile(authToken);
  const [confirmDeliveryOpen, setConfirmDeliveryOpen] = useState(false);
  const [selectedLotId, setSelectedLotId] = useState<string>("");
  const { toast } = useToast();

  const fetchLots = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}exporter/lots`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Failed to fetch lots");

      // Check if the API is returning an array
      const lotsArray = Array.isArray(data) ? data : [];

      const mappedLots: Lot[] = lotsArray.map((lot: any) => ({
        id: lot.lotId || lot.id,
        type: `${lot.type || "Mixed Batch (40kg)"} `,
        processor:
          lot.processorName ||
          lot.processor ||
          (lot.processorId?.firstName && lot.processorId?.lastName
            ? `${lot.processorId.firstName} ${lot.processorId.lastName}`
            : "Unknown"),
        submittedDate: new Date(
          lot.creationDate || lot.submittedDate
        ).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        status:
          lot.status === "created"
            ? "Submitted"
            : lot.status === "export_approved"
              ? "Delivered"
              : lot.status === "exported"
                ? "Exported"
                : "Submitted",
      }));

      setLots(mappedLots);
      setFilteredLots(mappedLots);
    } catch (err) {
      console.error("Error fetching lots:", err);
      toast({
        title: "Error",
        description: "Failed to fetch lots. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLots();
  }, [authToken]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab === "All") {
      setFilteredLots(lots);
    } else {
      setFilteredLots(lots.filter((lot) => lot.status === tab));
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    setFilteredLots(
      lots.filter(
        (lot) =>
          lot.id.toLowerCase().includes(term.toLowerCase()) ||
          lot.type.toLowerCase().includes(term.toLowerCase()) ||
          lot.processor.toLowerCase().includes(term.toLowerCase())
      )
    );
  };

  const handleConfirmDelivery = (lotId: string) => {
    setSelectedLotId(lotId);
    setConfirmDeliveryOpen(true);
  };

  const handleDeliverySuccess = () => {
    // Refresh the lots data
    fetchLots();
    toast({
      title: "Success",
      description: "Lot marked as delivered successfully.",
    });
  };

  // Get initials for avatar
  const getInitials = (): string => {
    if (profile && profile.firstName && profile.lastName) {
      return `${profile.firstName.charAt(0)}${profile.lastName.charAt(0)}`;
    }
    return "RA"; // Fallback to default initials
  };

  return (
    <section
      className="min-h-screen"
      style={{
        background: "linear-gradient(to bottom, #112D3E 50%, #F6F9FF 50%)",
      }}
    >
      <Header />
      <section className="px-20 py-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="w-12 h-12">
              <AvatarFallback className="bg-gray-400 text-white font-bold">
                {getInitials()}
              </AvatarFallback>
            </Avatar>
            <div>
              <span className="text-[#C0C9DDE5]">Greetings,</span>
              <br />
              <span className="font-semibold text-xl text-white">
                {profile
                  ? `${profile.firstName} ${profile.lastName}`
                  : "Rahmah Akello"}
              </span>
            </div>
          </div>
          <div>
            <Button className="bg-[#E7B35A] text-white rounded-md px-4 py-2">
              ABC Coffee Exporters Ltd
            </Button>
          </div>
        </div>

        <div className="rounded-t-md mt-12">
          <div className="flex justify-between items-center px-6 pt-6">
            <h2 className="text-white text-xl font-semibold">Lot History</h2>
            <div className="flex items-center gap-3">
              <Input
                placeholder="Search"
                value={searchTerm}
                onChange={handleSearchChange}
                className="bg-[#0F2A38] text-white w-48 border border-gray-300 rounded-md px-3 py-2"
              />
              <Button
                variant="outline"
                className="bg-[#0F2A38] text-white border border-gray-300 rounded-md flex items-center gap-2 px-4"
              >
                <CalendarIcon className="w-4 h-4" />
                11 Nov - 12 Nov
              </Button>
            </div>
          </div>

          <div className="flex gap-8 text-white text-sm font-medium px-6 mt-6">
            {["All", "Delivered", "Submitted", "Exported"].map((tab) => (
              <button
                key={tab}
                className={`pb-3 ${
                  activeTab === tab
                    ? "border-b-2 border-[#0F2A38] text-black bg-white"
                    : "text-white bg-transparent"
                }`}
                onClick={() => handleTabChange(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="px-6 pt-10">
          {loading ? (
            <div className="flex justify-center py-10">
              <p className="text-white">Loading lots...</p>
            </div>
          ) : filteredLots.length === 0 ? (
            <div className="flex justify-center py-10">
              <p className="text-white">No lots found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-6">
              {filteredLots.map((lot, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-lg border border-gray-200 shadow-sm p-5 flex flex-col gap-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm text-black">
                      {lot.id}
                    </span>
                    <span
                      className={`px-3 py-1 text-white rounded-full text-xs font-semibold ${
                        lot.status === "Submitted"
                          ? "bg-[#43B75D]"
                          : lot.status === "Delivered"
                            ? "bg-[#1A8DF9]"
                            : "bg-[#6F42C1C9]"
                      }`}
                    >
                      {lot.status}
                    </span>
                  </div>
                  <div className="text-sm flex flex-col gap-1">
                    <p className="flex items-center gap-2 text-gray-700">
                      <img
                        src="/images/arabica.png"
                        alt="Type"
                        className="w-4 h-4"
                      />
                      {lot.type}
                    </p>
                    <p className="flex items-center gap-2 text-gray-700">
                      <img
                        src="/images/user.png"
                        alt="Processor"
                        className="w-4 h-4"
                      />
                      Processor: {lot.processor}
                    </p>
                    <p className="flex items-center gap-2 text-gray-700">
                      <img
                        src="/images/calendar.png"
                        alt="Submitted Date"
                        className="w-4 h-4"
                      />
                      Submitted: {lot.submittedDate}
                    </p>
                  </div>

                  {lot.status === "Submitted" ? (
                    <Button
                      variant="outline"
                      className="w-full border border-gray-300 text-[#0F2A38]"
                      onClick={() => handleConfirmDelivery(lot.id)}
                    >
                      Mark Delivered
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      className="w-full border border-gray-300 text-[#0F2A38]"
                      onClick={() => navigate(`/view-lot-details/${lot.id}`)}
                    >
                      View Details
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="fixed bottom-0 w-full">
        <ConfirmDeliveryForm
          open={confirmDeliveryOpen}
          onClose={() => setConfirmDeliveryOpen(false)}
          lotId={selectedLotId}
          onSuccess={handleDeliverySuccess}
        />

        <Footer />
      </section>
    </section>
  );
}

export default ViewLotsPage;
