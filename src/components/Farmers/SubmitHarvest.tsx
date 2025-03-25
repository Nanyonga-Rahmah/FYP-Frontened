import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { SubmitBatchForm } from "../forms/farmerforms/SubmitBatchForm";
import { useLocation } from "react-router-dom";
import { Plus } from "lucide-react";
import { Button } from "../ui/button";

export function SubmitBatch() {
  const location = useLocation();
  const { pathname } = location;
  return (
    <Dialog>
      <DialogTrigger asChild>
        {pathname === "/view-batch" ? (
          <Button variant={"outline"} className="bg-[#E7B35A] hover:none flex items-center gap-1 rounded-lg px-2 text-white ">
            {" "}
            <span>
              <Plus />
            </span>
            <span>Submit Batch</span>
          </Button>
        ) : (
          <span className="cursor-pointer">Submit coffee batch</span>
        )}
      </DialogTrigger>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle  className="text-black text-2xl font-semibold">Submit coffee batch</DialogTitle>
        </DialogHeader>
        <SubmitBatchForm />
      </DialogContent>
    </Dialog>
  );
}
