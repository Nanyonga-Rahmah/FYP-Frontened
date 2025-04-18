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

interface RemoveHarvestProps {
  farmId?: string;
}

export function RemoveHarvest({ farmId }: RemoveHarvestProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <span className="text-[#EE443F] cursor-pointer">Remove </span>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Remove harvest?</DialogTitle>
          <DialogDescription>
            This action is permanent and cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex  justify-between gap-5">
          <Button className="border grow text-black" variant={"outline"}>
            Cancel
          </Button>
          <Button type="submit" className="bg-[#EE443F] grow text-white">
            Remove Harvest
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
