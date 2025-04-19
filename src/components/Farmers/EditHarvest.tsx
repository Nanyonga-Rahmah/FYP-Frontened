import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { EditHarvestForm } from "../forms/farmerforms/EditHarvestForm";
interface EditHarvestProps {
  harvestId?: string;
}

export function EditHarvest({ harvestId }: EditHarvestProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <span className=" cursor-pointer">Edit </span>
      </DialogTrigger>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle  className="text-black text-2xl font-semibold">Edit Harvest</DialogTitle>
        </DialogHeader>
        <EditHarvestForm />
      </DialogContent>
    </Dialog>
  );
}
