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

import { AddFarmForm } from "./forms/AddFarmForm";
import { LocateFixed } from "lucide-react";

export function AddFarm() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-[#E7B35A] flex items-center gap-1 rounded-md px-2">
          <LocateFixed />
          <span>Add Farm location</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle>Add Farm</DialogTitle>
        </DialogHeader>
        <AddFarmForm />
      </DialogContent>
    </Dialog>
  );
}
