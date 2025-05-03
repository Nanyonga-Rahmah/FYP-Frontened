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
import {  FileText } from "lucide-react";
// import { format } from "date-fns";
import { AllHarvests } from "@/lib/routes";
import useAuth from "@/hooks/use-auth";
import { ScrollArea } from "../ui/scroll-area";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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

  // const formatDate = (dateString: string) => {
  //   try {
  //     return format(new Date(dateString), "MMM dd, yyyy");
  //   } catch (e) {
  //     return "Date unavailable";
  //   }
  // };

  // const formatDateTime = (dateString: string) => {
  //   try {
  //     return format(new Date(dateString), "MMM dd, yyyy, h:mmaaa");
  //   } catch (e) {
  //     return "Date unavailable";
  //   }
  // };

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

  console.log("Harvest details:", displayHarvest);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <span className="cursor-pointer" onClick={() => setOpen(true)}>
          View
        </span>
      </DialogTrigger>
      <DialogContent className="">
        {loading ? (
          <div className="py-8 text-center">Loading harvest details...</div>
        ) : error ? (
          <div className="py-8 text-center text-red-500">Error: {error}</div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-5 text-black text-2xl font-semibold"></DialogTitle>
            </DialogHeader>
            <ScrollArea className="h-[400px] ">
              <div className=" border-yellow-400 rounded-md p-4 mb-6 bg-yellow-50 text-sm">
                <div className="grid grid-cols-2 gap-y-2">
                  <p className="text-gray-500">Location</p>
                  <p>123 Main St, Kampala, Uganda</p>
                  <p className="text-gray-500">Coordinates</p>
                  <p>(0.3424, 32.4543)</p>
                  <p className="text-gray-500">Perimeter</p>
                  <p className="text-blue-600">1200m</p>
                  <p className="text-gray-500">Area</p>
                  <p className="text-blue-600">5 Acre</p>
                </div>
              </div>

              {/* Harvest info */}
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-lg text-black">
                    {getHarvestDisplayId(harvest?._id)}
                  </p>
                  <span
                    className={`${checkBadgeStatus(getStatus())} capitalize text-white px-3 py-1 rounded-full text-xs`}
                  >
                    {displayHarvest?.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-y-3 text-gray-700">
                  <p className="text-gray-500">Farm</p>
                  <p>
                    Mirembe Maria Coffee Farm{" "}
                    <span className="text-gray-400">Farm #123</span>
                  </p>

                  <p className="text-gray-500">Coffee variety</p>
                  <p>{displayHarvest?.variety}</p>

                  <p className="text-gray-500">Number of bags</p>
                  <p>200</p>

                  <p className="text-gray-500">Date of planting</p>
                  <p>Nov 30, 2026</p>

                  <p className="text-gray-500">Harvest period</p>
                  <p>Nov 30, 2026 - Jan 30, 2027</p>

                  <p className="text-gray-500">Date added</p>
                  <p>Nov 30, 2027, 11:00PM</p>

                  <p className="text-gray-500">Farming methods</p>
                  <p>Weeding, Mulching</p>
                </div>
              </div>

              {/* Image */}
              <div className="mt-6">
                <p className="text-sm font-medium mb-2">Images of harvest</p>
                <div className="border rounded-md p-3 flex items-center gap-2 text-sm text-gray-700 bg-gray-50">
                  <FileText className="w-5 h-5" />
                  <span>Coffee.jpg</span>
                </div>
              </div>

              {/* Audit logs */}
              <Accordion type="single" collapsible className="mt-6 w-full">
                <AccordionItem value="auditLogs">
                  <AccordionTrigger className="font-semibold text-sm">
                    Audit Logs
                  </AccordionTrigger>
                  <AccordionContent className="space-y-2 text-sm mt-2">
                    <p>
                      <span className="text-green-600 font-semibold">
                        ● Harvest HRV-001 added
                      </span>{" "}
                      by Jane Smith
                      <span className="ml-2 text-gray-500">
                        2025-03-28 10:30:15
                      </span>
                    </p>
                    <p>
                      <span className="text-green-600 font-semibold">
                        ● Farm #789 approved
                      </span>{" "}
                      by John Doe
                      <span className="ml-2 text-gray-500">
                        2025-03-28 11:30:05
                      </span>
                    </p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </ScrollArea>

            {/* Documents */}
            <DialogFooter className="mt-6 justify-between">
              <Button variant="outline">Close</Button>
              <div className="flex gap-2">
                <Button variant="destructive">Delete</Button>
                <Button>Edit</Button>
              </div>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
