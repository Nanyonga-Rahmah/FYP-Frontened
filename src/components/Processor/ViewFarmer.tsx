import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useState } from "react";

const farmer = {
  userId: "U-09M",
  name: "Mary Nantongo",
  phone: "+256771234567",
  email: "mary12@gmail.com",
  membershipNumber: "BG-090mn",
  subcounty: "Makindye-Ssabagabo",
  cooperative: "Bugisu Cooperative Union",
  passportPhoto: "Mary.jpg",
  timeline: [
    {
      type: "created",
      description: "Mary Nantongo #U-09M created account",
      time: "2025-03-28 10:30:15",
    },
    {
      type: "approved",
      description: "Kayongo #U-096 approved Mary",
      time: "2025-03-28 11:30:05",
    },
  ],
};
export function FarmerDetailsModal() {
  const [open, setOpen] = useState(false);

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
        {/* Farmer Info */}

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

            <div className="text-gray-500">Cooperative membership number</div>
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
              📎 {farmer.passportPhoto || "Mary.jpg"}
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
                    {farmer?.timeline.map((event: any, index: number) => (
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
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
