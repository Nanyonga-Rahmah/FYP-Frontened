import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MarkDeliveredForm } from "../forms/processorforms/MarkdeliveredForm";
import { DialogDescription } from "@radix-ui/react-dialog";
import { Button } from "../ui/button";

// interface EditFarmProps {
//   farmId?: string;
// }

export function MarkDelivered() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="text-white bg-[#112D3E] ">
          Mark Delivered
        </Button>
      </DialogTrigger>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle className="text-black text-2xl font-semibold">
            Confirm Delivery
          </DialogTitle>
          <DialogDescription>
            Ensure you received this farmer's batch. This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        <MarkDeliveredForm />
      </DialogContent>
    </Dialog>
  );
}
