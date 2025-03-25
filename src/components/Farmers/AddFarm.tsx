import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { AddFarmForm } from "../forms/farmerforms/AddFarmForm";
import { LocateFixed } from "lucide-react";

export function AddFarm() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-[#E7B35A] flex items-center gap-1 rounded-md px-2">
          <LocateFixed />
          <span >Add Farm location</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle className="text-black text-2xl font-semibold">Add Farm</DialogTitle>
        </DialogHeader>
        <AddFarmForm />
      </DialogContent>
    </Dialog>
  );
}
