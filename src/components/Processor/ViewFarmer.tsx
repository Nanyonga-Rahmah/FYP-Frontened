import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import axios from "axios";
import useAuth from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { API_URL } from "@/lib/routes";

interface FarmerDetailsProps {
  farmerId: string;
}

interface TimelineEvent {
  type: string;
  description: string;
  time: string;
}

interface FarmerDetail {
  userId: string;
  name: string;
  phone: string;
  email: string;
  membershipNumber: string;
  subcounty: string;
  cooperative: string;
  passportPhoto: string;
  nationalIdPhoto: string;
  nationalIdNumber: string;
  timeline: TimelineEvent[];
}

export function FarmerDetailsModal({
  farmerId,
}: FarmerDetailsProps): JSX.Element {
  const [open, setOpen] = useState<boolean>(false);
  const [farmer, setFarmer] = useState<FarmerDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { authToken } = useAuth();

  useEffect(() => {
    const fetchFarmerDetails = async (): Promise<void> => {
      if (!open || !farmerId) return;

      try {
        setLoading(true);
        setError(null);

        const response = await axios.get(`${API_URL}user/${farmerId}`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        if (response.data.success) {
          setFarmer(response.data.user);
        } else {
          setError("Failed to fetch farmer details");
        }
      } catch (err) {
        setError(
          (err as Error).message ||
            "An error occurred while fetching farmer details"
        );
        console.error("Error fetching farmer details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFarmerDetails();
  }, [farmerId, authToken, open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="w-full text-left justify-start"
          onClick={() => setOpen(true)}
        >
          View Farmer
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl rounded-lg p-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-10">
            <Loader2 className="h-10 w-10 text-gray-400 animate-spin mb-4" />
            <p className="text-gray-500">Loading farmer details...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-10">
            <p className="text-red-500 mb-2">{error}</p>
            <Button variant="outline" size="sm" onClick={() => setOpen(false)}>
              Close
            </Button>
          </div>
        ) : farmer ? (
          <>
            <span className="text-2xl font-semibold text-center">
              Farmer Details
            </span>
            <div className="space-y-4 text-gray-700 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-gray-500">UserID</div>
                <div className="font-semibold">{farmer.userId}</div>

                <div className="text-gray-500">Name</div>
                <div className="font-semibold">{farmer.name}</div>

                <div className="text-gray-500">Phone</div>
                <div className="font-semibold">{farmer.phone}</div>

                <div className="text-gray-500">Email</div>
                <div className="font-semibold">{farmer.email}</div>

                <div className="text-gray-500">
                  Cooperative membership number
                </div>
                <div className="font-semibold">{farmer.membershipNumber}</div>

                <div className="text-gray-500">Sub-county</div>
                <div className="font-semibold">{farmer.subcounty}</div>

                <div className="text-gray-500">Cooperative</div>
                <div className="font-semibold">{farmer.cooperative}</div>
              </div>

              {/* Passport Size Photo */}
              <div className="mt-6">
                <div className="text-gray-500 mb-1">Passport size Photo</div>
                <div className="border rounded-lg p-2 flex items-center gap-2 text-sm text-gray-700">
                  📎 {farmer.passportPhoto || "Photo not available"}
                </div>
              </div>

              {/* Timeline */}
              <div className="mt-6">
                <Accordion type="single" collapsible>
                  <AccordionItem value="timeline">
                    <AccordionTrigger className="text-gray-900 font-semibold">
                      Timeline
                    </AccordionTrigger>

                    <AccordionContent>
                      <div className="flex flex-col gap-4 text-sm mt-2">
                        {farmer?.timeline.map(
                          (event: TimelineEvent, index: number) => (
                            <div
                              key={index}
                              className="flex justify-between items-center"
                            >
                              <div className="flex items-center gap-2">
                                <span
                                  className={`h-3 w-3 rounded-full ${
                                    event.type === "created"
                                      ? "bg-blue-500"
                                      : "bg-green-500"
                                  }`}
                                ></span>
                                <span>{event.description}</span>
                              </div>
                              <span className="text-gray-500 text-xs">
                                {event.time}
                              </span>
                            </div>
                          )
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-10">
            <p className="text-gray-500">No farmer details available</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
