import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { checkBadgeStatus } from "@/pages/ViewHarvets";
import { Calendar1, FileText, MapPin, Sprout } from "lucide-react";
import { format } from "date-fns";
import { AllHarvests } from "@/lib/routes";
import useAuth from "@/hooks/use-auth";

interface ViewHarvestProps {
  harvestId?: string;
}

export function ViewHarvest({ harvestId }: ViewHarvestProps) {
  const [open, setOpen] = useState(false);
  const [harvest, setHarvest] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { authToken } = useAuth();
  const fetchHarvestDetails = async () => {
    if (!harvestId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${AllHarvests}/${harvestId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setHarvest(data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch harvest details");
      console.error("Error fetching harvest details:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open && harvestId) {
      fetchHarvestDetails();
    }
  }, [open, harvestId]);

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy");
    } catch (e) {
      return "Date unavailable";
    }
  };

  const formatDateTime = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy, h:mmaaa");
    } catch (e) {
      return "Date unavailable";
    }
  };

  const getHarvestDisplayId = (id: string) => {
    if (!id) return "HRV-001";
    const suffix = id.slice(-3).padStart(3, "0");
    return `HRV-${suffix}`;
  };

  const defaultHarvest = {
    name: "HRV-001",
    variety: "Robusta",
    status: "Not submitted",
    weight: "90kg",
    location: "Mbale, Uganda",
    size: "25 Hecters",
    latitude: "0",
    longitude: "0",
    cultivationMethod: "Organic",
    certification: "FairTrade",
    documents: ["fairTrade.pdf", "fairTrade.pdf2"],
    harvestDate: "Nov 20, 2026",
    recordedDate: "Nov 20, 2026, 11:00pm",
  };

  const displayHarvest = harvest || defaultHarvest;

  const getStatus = () => {
    if (!harvest) return defaultHarvest.status;

    if (harvest.status === "approved") return "submitted";
    if (harvest.status === "pending") return "Not submitted";
    return harvest.status;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <span className="cursor-pointer" onClick={() => setOpen(true)}>
          View
        </span>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        {loading ? (
          <div className="py-8 text-center">Loading harvest details...</div>
        ) : error ? (
          <div className="py-8 text-center text-red-500">Error: {error}</div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-5 text-black text-2xl font-semibold">
                {getHarvestDisplayId(harvest?._id)}
                <span
                  className={`px-2 py-1 text-xs rounded-3xl ${checkBadgeStatus(getStatus())} `}
                >
                  {getStatus()}
                </span>
              </DialogTitle>
            </DialogHeader>

            <div className="flex gap-20">
              <span className="flex items-center gap-1">
                <span>
                  <Sprout size={16} />
                </span>
                Variety:{" "}
                <span>{harvest?.coffeeVariety || displayHarvest.variety}</span>
              </span>
              <span>
                Weight:{" "}
                <span>{harvest?.weight || displayHarvest.weight}kg</span>
              </span>
            </div>
            <hr />

            <div className="flex items-center gap-20">
              <div>
                <span className="text-[#838383]">Cultivation methods</span>
                <p>
                  {harvest?.cultivationMethods?.join(", ") ||
                    displayHarvest.cultivationMethod}
                </p>
              </div>

              <div>
                <span className="text-[#838383]">Certifications</span>
                <p>
                  {harvest?.certifications?.join(", ") ||
                    displayHarvest.certification}
                </p>
              </div>
            </div>

            <hr />

            <div className="flex items-center gap-1">
              <span>
                <MapPin size={15} />
              </span>
              <span>Location:</span>
              <span className="font-normal text-sm flex items-center gap-1 text-[#202020]">
                {harvest?.farm?.location || displayHarvest.location}
              </span>
              <span>({harvest?.farm?.farmSize || displayHarvest.size})</span>
            </div>

            <hr />

            <div className="flex items-center gap-1">
              <span>
                <Calendar1 size={15} />
              </span>
              <span className="text-[#838383]">Harvested:</span>
              <span className="text-[#202020]">
                {harvest?.harvestPeriod
                  ? formatDate(harvest.harvestPeriod.start)
                  : displayHarvest.harvestDate}
              </span>
            </div>

            <div className="flex items-center gap-1">
              <span>
                <Calendar1 size={15} />
              </span>
              <span className="text-[#838383]">Recorded:</span>
              <span className="text-[#202020]">
                {harvest?.createdAt
                  ? formatDateTime(harvest.createdAt)
                  : displayHarvest.recordedDate}
              </span>
            </div>

            <hr />

            <div>
              <span className="text-[#222222]">Attachments</span>
              <span>(photos,documents)</span>

              <div className="flex gap-3 my-2">
                {(harvest?.documents || displayHarvest.documents).map(
                  (document: string, index: number) => (
                    <div
                      className="border rounded-xl flex flex-col items-center p-3 gap-1"
                      key={index}
                    >
                      <span>
                        <FileText size={30} className="transform rotate-180" />
                      </span>
                      <span className="text-[#5C6474]">
                        {typeof document === "string"
                          ? document.split("/").pop() || `Document ${index + 1}`
                          : displayHarvest.documents[index]}
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>
            <DialogFooter className="justify-end">
              <Button
                variant={"outline"}
                className="border-[#D9D9D9] text-[#222222] px-5"
                onClick={() => setOpen(false)}
              >
                Close
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
