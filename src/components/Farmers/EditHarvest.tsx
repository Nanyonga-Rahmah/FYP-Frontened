import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { EditHarvestForm } from "../forms/farmerforms/EditHarvestForm";

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
