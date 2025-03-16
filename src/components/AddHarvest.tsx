import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { LocateFixed, Plus } from "lucide-react";
import { AddHarvestForm } from "./forms/AddHarvestForm";

export function AddHarvest() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-[#E7B35A] flex items-center gap-1 rounded-md px-2">
          <Plus />
          <span>Add Record</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle>Record Harvest</DialogTitle>
        </DialogHeader>
        <AddHarvestForm />
      </DialogContent>
    </Dialog>
  );
}
