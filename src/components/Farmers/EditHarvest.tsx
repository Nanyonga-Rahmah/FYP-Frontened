import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { EditHarvestForm } from "../forms/farmerforms/EditHarvestForm";
interface EditHarvestProps {
  farmId?: string;
}

export function EditHarvest({ farmId }: EditHarvestProps) {
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
