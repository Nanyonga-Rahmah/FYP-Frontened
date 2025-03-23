import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { EditFarmForm } from "../forms/farmerforms/EditFarmForm";

export function EditFarm() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <span className=" cursor-pointer">Edit </span>
      </DialogTrigger>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle>Edit Farm</DialogTitle>
        </DialogHeader>
        <EditFarmForm />
      </DialogContent>
    </Dialog>
  );
}
