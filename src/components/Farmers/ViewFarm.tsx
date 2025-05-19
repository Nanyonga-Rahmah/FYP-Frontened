import { useState, useEffect } from "react";
// import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FileText } from "lucide-react";
import { format } from "date-fns";
import { viewOneFarm } from "@/lib/routes";

import { Stage, Layer, Line } from "react-konva";
import { ScrollArea } from "../ui/scroll-area";
import { checkBadgeStatus } from "@/pages/ViewHarvets";
import useAuth from "@/hooks/use-auth";

interface Document {
  _id: string;
  name: string;
  url: string;
  mimetype?: string;
}

interface ViewFarmProps {
  farmId?: string;
}

export function ViewFarm({ farmId }: ViewFarmProps) {
  const [open, setOpen] = useState(false);
  const [farm, setFarm] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { authToken } = useAuth();

  console.log("------>", `${viewOneFarm}${farmId}`);

  const fetchFarmDetails = async () => {
    if (!farmId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${viewOneFarm}${farmId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });

      console.log(response);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setFarm(data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch farm details");
      console.error("Error fetching farm details:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open && farmId) {
      fetchFarmDetails();
    }
  }, [open, farmId]);

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy, h:mmaaa");
    } catch (e) {
      return "Date unavailable";
    }
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

  console.log("Farm details:", farm);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <span className="cursor-pointer text-sm text-gray-700 hover:text-blue-600">
          View
        </span>
      </DialogTrigger>
    
      <DialogContent className="w-[40vw]">
        {loading ? (
          <div className="py-8 text-center">Loading farm details...</div>
        ) : error ? (
          <div className="py-8 text-center text-red-500">Error: {error}</div>
        ) : farm ? (
          <>
            <h3 className="text-black font-bold text-center text-xl">
              Farm Details
            </h3>

            <ScrollArea className=" overflow-y-auto">
              <div className="flex flex-col gap-2">
                <div className="border border-[#DFA32D] px-4 py-2 rounded-[5px] col-span-2 flex gap-10 bg-[#FFF8EA] ">
                  <div className="h-[100px]">
                    <Stage width={100} height={100}>
                      <Layer>
                        <Line
                          points={convertCoordsToCanvasPoints(
                            farm.polygon.coordinates[0],
                            100,
                            100
                          )}
                          closed
                          fill="#E7B35A"
                          stroke="#A56D00"
                        />
                      </Layer>
                    </Stage>
                  </div>

                  <div className="flex flex-col text-black ">
                    <div className="flex  items-center ">
                      <span className="text-[#202020]"> Location:</span>
                      <span>{farm.location}</span>
                    </div>
                    <div className="flex  items-center">
                      <span className="text-[#202020]"> Coordinates:</span>[
                      {farm.polygon.coordinates[0]
                        .map(
                          ([lat, lng]: [number, number]) =>
                            `${lat.toFixed(2)}, ${lng.toFixed(2)}`
                        )
                        .join(", ")}
                      ]{" "}
                    </div>
                    <div className="flex  items-center">
                      <span className="text-[#202020]"> Perimeter:</span>
                      <span>{farm.perimeter}</span>
                    </div>
                    <div className="flex  items-center">
                      <span className="text-[#202020]"> Area:</span>
                      <span>{farm.area}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-1 space-y-2">
                  <span className="text-[#202020]"> {farm.farmName}</span>
                  <div
                    className={`flex items-center ml-auto capitalize px-2 py-1 rounded-full w-min ${checkBadgeStatus(farm.status)}`}
                  >
                    {farm.status}
                  </div>
                </div>

                <div className="flex items-center justify-between gap-1  space-y-2">
                  <span className="text-[#202020]"> Year farm started</span>
                  <span className="text-[#202020]">
                    {new Date(farm.yearEstablished).getFullYear()}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-1  space-y-2">
                  <span className="text-[#202020]">
                    {" "}
                    Total coffee trees on farm
                  </span>
                  <span className="font-normal text-sm flex items-center gap-1 text-[#202020]">
                    {farm.numberofTrees}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-1  space-y-2">
                  <span className="text-[#202020]"> Cultivation methods</span>
                  <span className="font-normal text-sm flex items-center gap-1 text-[#202020]">
                    {farm.cultivationMethods?.join(", ") || "None specified"}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-1  space-y-2">
                  <span className="text-[#202020]"> Certifications</span>
                  <span className="font-normal text-sm flex items-center gap-1 text-[#202020]">
                    <p>{farm.certifications?.join(", ") || "None"}</p>
                  </span>
                </div>
                <div className="flex items-center justify-between gap-1  space-y-2">
                  <span className="text-[#202020]"> Date added</span>
                  <span className="font-normal text-sm flex items-center gap-1 text-[#202020]">
                    {formatDate(farm.createdAt)}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-1  space-y-2">
                  <span className="text-[#202020]"> Defforestation status</span>
                  <span className="font-normal text-sm flex items-center gap-1 text-[#202020]">
                    {farm.deforestationStatus}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-1  space-y-2">
                  <span className="text-[#202020]">
                    {" "}
                    Defforestation Risk Level added
                  </span>
                  <span className="font-normal text-sm flex items-center gap-1 text-[#202020]">
                    {farm.deforestationRisk}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-1  space-y-2">
                  <span className="text-[#202020]"> Risk Factor</span>
                  <span className="font-normal text-sm flex items-center gap-1 text-[#202020]">
                    {farm.deforestationRisk}
                  </span>
                </div>

                {farm.status === "rejected" && (
                  <div className="flex items-center justify-between gap-1  space-y-2">
                    <span className="text-[#202020]"> Reason</span>
                    <span className="font-normal text-sm flex items-center gap-1 text-[#202020]">
                      {farm.adminNotes}
                    </span>
                  </div>
                )}

                {/* <div className="flex items-center justify-between gap-1">
                <span>Location:</span>
                <span className="font-normal text-sm flex items-center gap-1 text-[#202020]">
                  <MapPin size={10} />
                  {farm.location}
                </span>
              </div> */}

                {farm.documents && farm.documents.length > 0 && (
                  <div>
                    <span className="text-[#222222]">Attachments</span>
                    <span className="ml-2 text-sm text-gray-500">
                      (photos, documents)
                    </span>

                    <div className="flex gap-3 my-2">
                      {farm.documents.map(
                        (document: Document, index: number) => (
                          <div
                            className="border w-full  rounded-[8px] flex  py-2 px-1  gap-1 border-[#D9D9D9]"
                            key={index}
                          >
                            <FileText
                              size={30}
                              className="transform rotate-180 text-black"
                            />
                            <span className="text-[#5C6474] text-xs max-w-[80px] truncate">
                              {document.name}
                            </span>
                            <a
                              href={document.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-blue-500 hover:underline"
                            >
                              View
                            </a>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="text-sm font-medium text-black mb-1">
                    Audit Logs
                  </h3>
                  <div className="text-sm border-l-4 pl-3 border-blue-500 space-y-2">
                    {farm.auditLogs?.map((log: any, index: any) => (
                      <div
                        key={index}
                        className="flex justify-between items-center"
                      >
                        <p className="text-black">
                          <span className="text-blue-500">●</span> {log.text}
                        </p>
                        <p className="text-gray-500 text-xs">{log.date}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollArea>

            <DialogFooter className="flex justify-between">
              {/* <Button
                variant={"outline"}
                className="border-[#D9D9D9] text-[#222222] px-5"
                onClick={() => setOpen(false)}
              >
                Back
              </Button> */}

              {/* <div className="flex items-center gap-2">
                <Button
                  variant={"outline"}
                  className="border-[#D9D9D9] text-[#222222] px-5"
                  onClick={() => setOpen(false)}
                >
                  Edit
                </Button>
                <Button className="bg-[#EE443F] text-white px-5 ml-2">
                  Delete
                </Button>
              </div> */}
            </DialogFooter>
          </>
        ) : (
          <div className="py-8 text-center">No farm data available</div>
        )}
      </DialogContent>
     
    </Dialog>
  );
}
