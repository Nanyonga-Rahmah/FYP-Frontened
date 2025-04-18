import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { EditFarmForm } from "../forms/farmerforms/EditFarmForm";
interface EditFarmProps {
  farmId?: string;
}

export function EditFarm({farmId}: EditFarmProps ) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <span className=" cursor-pointer">Edit </span>
      </DialogTrigger>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle  className="text-black text-2xl font-semibold">Edit Farm</DialogTitle>
        </DialogHeader>
        <EditFarmForm />
      </DialogContent>
    </Dialog>
  );
}
