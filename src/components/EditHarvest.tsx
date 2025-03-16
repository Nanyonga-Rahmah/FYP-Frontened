import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { EditFarmForm } from "./forms/EditFarmForm";
import { EditHarvestForm } from "./forms/EditHarvestForm";

export function EditHarvest() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <span className=" cursor-pointer">Edit </span>
      </DialogTrigger>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle>Edit Harvest</DialogTitle>
        </DialogHeader>
        <EditHarvestForm />
      </DialogContent>
    </Dialog>
  );
}
