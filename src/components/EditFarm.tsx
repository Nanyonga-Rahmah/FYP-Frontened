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
