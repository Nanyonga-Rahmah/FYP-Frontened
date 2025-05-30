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
import { FileText } from "lucide-react";
import { AllHarvests } from "@/lib/routes";
import useAuth from "@/hooks/use-auth";
import { ScrollArea } from "../ui/scroll-area";
import { Stage, Layer, Line } from "react-konva";
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

  const getHarvestDisplayId = (id: string) => {
    if (!id) return "HRV-001";
    const suffix = id.slice(-3).padStart(3, "0");
    return `HRV-${suffix}`;
  };

  const getStatus = () => {
    if (!harvest) return;
    if (harvest.status === "approved") return "submitted";
    if (harvest.status === "pending") return "Not submitted";
    return harvest.status;
  };

  const convertCoordsToCanvasPoints = (
    coords: number[][],
    width: number,
    height: number
  ): number[] => {
    const lats = coords.map((c) => c[1]);
    const lngs = coords.map((c) => c[0]);

    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);

    return coords.flatMap(([lng, lat]) => {
      const x = ((lng - minLng) / (maxLng - minLng)) * width;
      const y = height - ((lat - minLat) / (maxLat - minLat)) * height;
      return [x, y];
    });
  };

  const displayHarvest = harvest;
  const coords = displayHarvest?.farm?.polygon?.coordinates?.[0] || [];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <span className="cursor-pointer" onClick={() => setOpen(true)}>
          View
        </span>
      </DialogTrigger>
      <DialogContent className="w-[40vw]">
        {loading ? (
          <div className="py-8 text-center">Loading harvest details...</div>
        ) : error ? (
          <div className="py-8 text-center text-red-500">Error: {error}</div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-5 text-black text-2xl font-semibold">
                {getHarvestDisplayId(harvest?._id)}
              </DialogTitle>
            </DialogHeader>
            <ScrollArea className="h-[400px]">
              <div className="border border-[#DFA32D] px-4 py-2 rounded-[5px] col-span-2 flex gap-10 bg-[#FFF8EA]">
                <div className="h-[100px]">
                  <Stage width={100} height={100}>
                    <Layer>
                      <Line
                        points={convertCoordsToCanvasPoints(coords, 100, 100)}
                        closed
                        fill="#E7B35A"
                        stroke="#A56D00"
                      />
                    </Layer>
                  </Stage>
                </div>

                <div className="flex flex-col text-black">
                  <div className="flex items-center">
                    <span className="text-[#202020]"> Location:</span>
                    <span>{displayHarvest?.farm.location}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-[#202020]"> Coordinates:</span>
                    {Array.isArray(coords) && coords.length > 0 ? (
                      `[${coords
                        .map(([lng, lat]) => `${lat.toFixed(2)}, ${lng.toFixed(2)}`)
                        .join(" | ")}]`
                    ) : (
                      <span className="text-red-500">No coordinates found</span>
                    )}
                  </div>
                  <div className="flex items-center">
                    <span className="text-[#202020]"> Perimeter:</span>
                    <span>{displayHarvest?.farm.perimeter?.toFixed(2)} m</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-[#202020]"> Area:</span>
                    <span>{displayHarvest?.farm.area?.toFixed(2)} sqm</span>
                  </div>
                </div>
              </div>

              {/* Harvest Info */}
              <div className="space-y-2 text-sm mt-4">
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
                  <p>{displayHarvest?.farm.farmName} <span className="text-gray-400">Farm #{displayHarvest?.farm._id}</span></p>

                  <p className="text-gray-500">Coffee variety</p>
                  <p>{displayHarvest?.coffeeVariety?.join(", ")}</p>

                  <p className="text-gray-500">Number of bags</p>
                  <p>{displayHarvest?.weight}</p>

                  <p className="text-gray-500">Date of planting</p>
                  <p>{new Date(displayHarvest?.plantingPeriod?.start).toDateString()}</p>

                  <p className="text-gray-500">Harvest period</p>
                  <p>
                    {new Date(displayHarvest?.harvestPeriod?.start).toDateString()} -
                    {" "}
                    {new Date(displayHarvest?.harvestPeriod?.end).toDateString()}
                  </p>

                  <p className="text-gray-500">Date added</p>
                  <p>{new Date(displayHarvest?.createdAt).toLocaleString()}</p>

                  <p className="text-gray-500">Farming methods</p>
                  <p>{displayHarvest?.cultivationMethods?.join(", ")}</p>
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

              {/* Audit Logs */}
              <Accordion type="single" collapsible className="mt-6 w-full">
                <AccordionItem value="auditLogs">
                  <AccordionTrigger className="font-semibold text-sm">
                    Audit Logs
                  </AccordionTrigger>
                  <AccordionContent className="space-y-2 text-sm mt-2">
                    <p>
                      <span className="text-green-600 font-semibold">● Harvest HRV-001 added</span> by Jane Smith
                      <span className="ml-2 text-gray-500">2025-03-28 10:30:15</span>
                    </p>
                    <p>
                      <span className="text-green-600 font-semibold">● Farm #789 approved</span> by John Doe
                      <span className="ml-2 text-gray-500">2025-03-28 11:30:05</span>
                    </p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </ScrollArea>

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
