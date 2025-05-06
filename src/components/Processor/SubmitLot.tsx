import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DialogDescription } from "@radix-ui/react-dialog";
import { SubmitLotForm } from "../forms/processorforms/SubmitLotForm";
import { PreviewLot } from "./PreviewLot";
import { useLocation } from "react-router-dom";
import { Button } from "../ui/button";
import useAuth from "@/hooks/use-auth";
import { API_URL } from "@/lib/routes";
import { useToast } from "@/components/ui/use-toast";

export function SubmitLot() {
  const [step, setCurrentStep] = useState(1);
  const [lotData, setLotData] = useState<{

    batches: { _id: string; batchId: string; totalWeight: number }[];
    exporterFacility: string;
    comments: string;
    totalWeight: string;
  }>({
    batches: [],
    exporterFacility: "",
    comments: "",
    totalWeight: "",
  });
  const { authToken } = useAuth();
  const { toast } = useToast();
  const location = useLocation();
  const { pathname } = location;
  const [isSubmitting, setIsSubmitting] = useState(false); 

  const handleNextStep = () => {
    setCurrentStep((prevStep) => prevStep + 1);
  };

  const handlePreviousStep = () => {
    setCurrentStep((prevStep) => prevStep - 1);
  };

  const handleSubmitLot = async () => {
    setIsSubmitting(true); 
    try {
      const response = await fetch(`${API_URL}lots/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({

          batchIds: lotData.batches.map((b) => b.batchId),
          exporterFacility: lotData.exporterFacility,
          comments: lotData.comments,
          totalOutputWeight: parseFloat(lotData.totalWeight),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit lot");
      }

      toast({
        title: "Success",
        description: "Lot submitted successfully!",
      });
      setCurrentStep(1);
    } catch (error) {
      console.error("Error submitting lot:", error);
      toast({
        title: "Error",
        description: "Failed to submit lot. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
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
            {step === 1 ? "Submit Lot" : "Preview Lot"}
          </DialogTitle>
          <DialogDescription>
            {step === 1
              ? "Ensure you selected the correct batches. This action cannot be undone."
              : "This will be logged and can’t be changed. Confirm all details."}
          </DialogDescription>
        </DialogHeader>
        {step === 1 && (
          <SubmitLotForm handleNext={handleNextStep} setLotData={setLotData} />
        )}
        {step === 2 && (
          <PreviewLot
            isSubmitting={isSubmitting} 
            handlePrevious={handlePreviousStep}
            data={lotData}
            handleSubmit={handleSubmitLot}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}