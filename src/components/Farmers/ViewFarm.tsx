import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,

  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {  Calendar1, FileText, MapPin } from "lucide-react";

export function ViewFarm() {
  const farm = {
    name: "Mountainside Organic Coffee",
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
          <DialogTitle>Mountainside Organic Coffee</DialogTitle>
        </DialogHeader>

        <div className="flex items-center gap-1">
          <span>Location:</span>
          <span className="font-normal tetx-sm flex items-center gap-1 text-[#202020]">
            <span>
              <MapPin size={10} />
            </span>
            {farm.location}
          </span>
        </div>

        <div className="flex gap-20">
          <span>
            Latitude: <span>{farm.latitude}</span>
          </span>
          <span>
            Longitude: <span>{farm.longitude}</span>
          </span>
        </div>
        <hr />

        <div className="flex items-center gap-20">
          <div>
            <span className="text-[#838383]">Cultivation methods</span>
            <p>{farm.cultivationMethod}</p>
          </div>

          <div>
            <span className="text-[#838383]">Certifications</span>
            <p>{farm.certification}</p>
          </div>
        </div>

        <hr />

        <div className="flex items-center gap-1">
          <span>
            <Calendar1 size={15} />
          </span>
          <span className="text-[#838383]">Added:</span>
          <span className="text-[#202020]">Nov 20, 2026, 11:00pm</span>
        </div>

        <hr />

        <div>
          <span className="text-[#222222]">Attachments</span>
          <span>(photos,documents)</span>

          <div className="flex gap-3 my-2">
            {farm.documents.map((document, index) => (
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
          <Button variant={"outline"} className="border-[#D9D9D9] text-[#222222] px-5 ">Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
