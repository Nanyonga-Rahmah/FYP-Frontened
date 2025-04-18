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
import { Calendar1, FileText, MapPin } from "lucide-react";
import { format } from "date-fns";
import { viewOneFarm } from '@/lib/routes';

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

  const fetchFarmDetails = async () => {
    if (!farmId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${viewOneFarm}${farmId}`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setFarm(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch farm details');
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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <span className="cursor-pointer text-sm text-gray-700 hover:text-blue-600">
          View
        </span>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        {loading ? (
          <div className="py-8 text-center">Loading farm details...</div>
        ) : error ? (
          <div className="py-8 text-center text-red-500">Error: {error}</div>
        ) : farm ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-black text-2xl font-semibold">
                {farm.farmName}
              </DialogTitle>
            </DialogHeader>

            <div className="flex items-center gap-1">
              <span>Location:</span>
              <span className="font-normal text-sm flex items-center gap-1 text-[#202020]">
                <MapPin size={10} />
                {farm.location}
              </span>
            </div>

            <div className="flex gap-20">
              <span>Latitude: <span>{farm.latitude || "N/A"}</span></span>
              <span>Longitude: <span>{farm.longitude || "N/A"}</span></span>
            </div>

            <hr />

            <div className="flex items-center gap-20">
              <div>
                <span className="text-[#838383]">Cultivation methods</span>
                <p>{farm.cultivationMethods?.join(", ") || "None specified"}</p>
              </div>
              <div>
                <span className="text-[#838383]">Certifications</span>
                <p>{farm.certifications?.join(", ") || "None"}</p>
              </div>
            </div>

            <hr />

            <div className="flex items-center gap-1">
              <Calendar1 size={15} />
              <span className="text-[#838383]">Added:</span>
              <span className="text-[#202020]">{formatDate(farm.createdAt)}</span>
            </div>

            {farm.yearEstablished && (
              <div className="flex items-center gap-1">
                <Calendar1 size={15} />
                <span className="text-[#838383]">Year Established:</span>
                <span className="text-[#202020]">
                  {new Date(farm.yearEstablished).getFullYear()}
                </span>
              </div>
            )}

            <hr />

            {farm.documents && farm.documents.length > 0 && (
              <div>
                <span className="text-[#222222]">Attachments</span>
                <span className="ml-2 text-sm text-gray-500">(photos, documents)</span>

                <div className="flex gap-3 my-2">
                  {farm.documents.map((document: Document, index: number) => (
                    <div
                      className="border rounded-xl flex flex-col items-center p-3 gap-1"
                      key={index}
                    >
                      <FileText size={30} className="transform rotate-180" />
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
                  ))}
                </div>
              </div>
            )}

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
        ) : (
          <div className="py-8 text-center">No farm data available</div>
        )}
      </DialogContent>
    </Dialog>
  );
}