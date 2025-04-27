import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DialogDescription } from "@radix-ui/react-dialog";
import { SubmitLotForm } from "../forms/processorforms/SubmitLotForm";
import { useState } from "react";
import { PreviewLot } from "./PreviewLot";
import { useLocation } from "react-router-dom";
import { Button } from "../ui/button";

// interface EditFarmProps {
//   farmId?: string;
// }

export function SubmitLot() {
  const [step, setCurrentStep] = useState(1);
  const [BatchData, setBatchData] = useState({
    batches: [],
    exporterfacility: [],
    comments: "",
  });

  const location = useLocation();
  const { pathname } = location;

  const handleNextStep = () => {
    setCurrentStep((prevStep) => prevStep + 1);
  };

  const handlePreviousStep = () => {
    setCurrentStep((prevStep) => prevStep - 1);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {pathname === "/processor/view-lots" ? (
          <Button className="bg-[#E7B35A] text-white hover:bg-[#d6a64e]">
            + Submit Lot
          </Button>
        ) : (
          <span className="cursor-pointer">Submit Lot</span>
        )}
      </DialogTrigger>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle className="text-black text-2xl font-semibold">
            {step === 1 ? "Submit lot" : "Preview lot"}
          </DialogTitle>
          <DialogDescription>
            {step === 1
              ? `Ensure you received this farmer's batch. This action cannot be
       undone.`
              : `This will be logged and can’t be changed. Confirm all details.`}
          </DialogDescription>
        </DialogHeader>
        {step === 1 && (
          <SubmitLotForm
            handleNext={handleNextStep}
            setBatchData={setBatchData}
          />
        )}

        {step === 2 && (
          <PreviewLot handlePrevious={handlePreviousStep} data={BatchData} />
        )}
      </DialogContent>
    </Dialog>
  );
}
