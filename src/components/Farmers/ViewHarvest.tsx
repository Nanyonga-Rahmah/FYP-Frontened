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

export function ViewHarvest() {
  const harvest = {
    name: "HRV-001",
    variety: "Robusta",
    status: "Not submitted",
    weight: "90kg",
    location: "Mbale , Uganda",
    size: "25 Hecters",
    latitude: "0",
    longitude: "0",
    cultivationMethod: "Organic",
    certification: "FairTrade",
    documents: ["fairTrade.pdf", "fairTrade.pdf2"],
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <span className=" cursor-pointer">View </span>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-5  text-black text-2xl font-semibold">
            {harvest.name}

            <span
              className={`px-2 py-1 text-xs rounded-3xl ${checkBadgeStatus(harvest.status)} `}
            >
              {harvest.status}
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="flex gap-20">
          <span className="flex items-center gap-1">
            <span>
              <Sprout size={16} />
            </span>
            Variety: <span>{harvest.variety}</span>
          </span>
          <span>
            Weight: <span>{harvest.weight}</span>
          </span>
        </div>
        <hr />

        <div className="flex items-center gap-20">
          <div>
            <span className="text-[#838383]">Cultivation methods</span>
            <p>{harvest.cultivationMethod}</p>
          </div>

          <div>
            <span className="text-[#838383]">Certifications</span>
            <p>{harvest.certification}</p>
          </div>
        </div>

        <hr />

        <div className="flex items-center gap-1">
          <span>
            <MapPin size={15} />
          </span>
          <span>Location:</span>
          <span className="font-normal tetx-sm flex items-center gap-1 text-[#202020]">
            {harvest.location}
          </span>
          <span>(15 Hectres)</span>
        </div>

        <hr />

        <div className="flex items-center gap-1">
          <span>
            <Calendar1 size={15} />
          </span>
          <span className="text-[#838383]">Harvested:</span>
          <span className="text-[#202020]">Nov 20, 2026</span>
        </div>

        <div className="flex items-center gap-1">
          <span>
            <Calendar1 size={15} />
          </span>
          <span className="text-[#838383]">Recorded:</span>
          <span className="text-[#202020]">Nov 20, 2026, 11:00pm</span>
        </div>

        <hr />

        <div>
          <span className="text-[#222222]">Attachments</span>
          <span>(photos,documents)</span>

          <div className="flex gap-3 my-2">
            {harvest.documents.map((document, index) => (
              <div
                className="border rounded-xl flex flex-col items-center p-3 gap-1"
                key={index}
              >
                <span>
                  <FileText size={30} className="transform rotate-180" />
                </span>
                <span className="text-[#5C6474]">{document}</span>
              </div>
            ))}
          </div>
        </div>
        <DialogFooter className="justify-end">
          <Button
            variant={"outline"}
            className="border-[#D9D9D9] text-[#222222] px-5 "
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
