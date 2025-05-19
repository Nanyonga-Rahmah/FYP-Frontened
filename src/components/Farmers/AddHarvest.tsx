import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Plus } from "lucide-react";
import { AddHarvestForm } from "../forms/farmerforms/AddHarvestForm";
import { useState } from "react";

export function AddHarvest() {
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#E7B35A] flex items-center gap-1 rounded-md px-2">
          <Plus />
          <span>Add Record</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[30vw] md:w-[600px]">
        <DialogHeader>
          <DialogTitle>Record Harvest</DialogTitle>
        </DialogHeader>
        <AddHarvestForm onClose={handleClose} />
      </DialogContent>
    </Dialog>
  );
}
