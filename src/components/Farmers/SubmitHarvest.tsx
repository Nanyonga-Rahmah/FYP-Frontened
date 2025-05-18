import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { SubmitBatchForm } from "../forms/farmerforms/SubmitBatchForm";
import { useLocation } from "react-router-dom";
import { Plus, Check } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";
import { PreviewBatch } from "./PreviewBatch";
import { toast } from "@/hooks/use-toast";
import { API_URL } from "@/lib/routes";
import useAuth from "@/hooks/use-auth";

export function SubmitBatch() {
  const [step, setCurrentStep] = useState(1);
  const [, setIsSubmitting] = useState(false);
  const [processors] = useState([]);
  const { authToken } = useAuth();
  const [batchId, setBatchId] = useState("");
  const [blockchainStatus, setBlockchainStatus] = useState("");

  const [batchData, setBatchData] = useState({
    weight: "",
    processorId: "",
    harvestIds: [],
    comments: "",
    documents: [],
    previewData: {
      farmerId: "",
      farmerInfo: {
        firstName: "",
        lastName: "",
        email: "",
      },
      harvests: [],
      totalWeight: 0,
      documents: [],
      dataHash: "",
      submissionDate: "",
    },
  });

  const location = useLocation();
  const { pathname } = location;

  const handleNextStep = () => {
    setCurrentStep((prevStep) => prevStep + 1);
  };

  const handlePreviousStep = () => {
    setCurrentStep((prevStep) => prevStep - 1);
  };

  const handleConfirmSubmission = async () => {
    setIsSubmitting(true);
    console.log("Final batch data for submission:", batchData);

    try {
      const payload = {
        processorId: batchData.processorId,
        harvestIds: batchData.harvestIds,
        weight: parseInt(batchData.weight),
        comments: batchData.comments || "",
        documents: batchData.documents.map((doc: { name: string; url: string }) => ({
          name: doc.name,
          url: doc.url,
        })),
      };

      console.log("Submitting batch with payload:", payload);

      // Make the actual API call to the backend
      const response = await fetch(`${API_URL}batches/confirm`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to submit batch");
      }

      const result = await response.json();
      console.log("Batch submission result:", result);

      // Store the batch ID and blockchain status for the confirmation screen
      if (result.batch) {
        setBatchId(result.batch.batchId || "");
        setBlockchainStatus(result.batch.blockchainStatus || "pending");
      }

      setIsSubmitting(false);
      toast({
        title: "Success!",
        description: result.message || "Batch submitted successfully.",
        variant: "default",
      });
      setCurrentStep(3); // Move to confirmation step
    } catch (error) {
      console.error("Error submitting batch:", error);
      setIsSubmitting(false);
      toast({
        variant: "destructive",
        title: "Submission Error",
        description:
          error instanceof Error ? error.message : "Something went wrong",
      });
    }
  };
  const handleReset = () => {
    setCurrentStep(1);
    setBatchData({
      weight: "",
      processorId: "",
      harvestIds: [],
      comments: "",
      documents: [],
      previewData: {
        farmerId: "",
        farmerInfo: {
          firstName: "",
          lastName: "",
          email: "",
        },
        harvests: [],
        totalWeight: 0,
        documents: [],
        dataHash: "",
        submissionDate: "",
      },
    });
  };

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          {pathname === "/view-batch" ? (
            <Button
              variant={"outline"}
              className="bg-[#E7B35A] hover:none flex items-center gap-1 rounded-lg px-2 text-white"
            >
              <span>
                <Plus />
              </span>
              <span>Submit Batch</span>
            </Button>
          ) : (
            <span className="cursor-pointer">Submit coffee batch</span>
          )}
        </DialogTrigger>
        <DialogContent className="md:w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-black text-2xl font-semibold">
              {step === 1 && "Submit coffee batch"}
              {step === 2 && "Preview batch"}
              {step === 3 && "Submission Confirmation"}
            </DialogTitle>
          </DialogHeader>

          {step === 1 && (
            <SubmitBatchForm
              handleNext={handleNextStep}
              setBatchData={setBatchData}
            />
          )}

          {step === 2 && (
            <PreviewBatch
              handlePrevious={handlePreviousStep}
              data={batchData}
              handleConfirm={handleConfirmSubmission}
              processors={processors}
            />
          )}

          {step === 3 && (
            <div className="mt-6 space-y-6 text-sm">
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="bg-green-100 p-3 rounded-full mb-4">
                  <Check className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-green-600 mb-2">
                  Batch Submitted Successfully!
                </h3>
                <p className="text-gray-600 mb-6 max-w-md">
                  Your coffee batch has been submitted and is now being
                  processed. You can track its status in your dashboard.
                </p>

                <div className="bg-gray-50 rounded-lg p-4 w-full mb-6">
                  <div className="flex justify-between mb-3">
                    <span className="text-gray-500">Batch ID:</span>
                    <span className="font-medium">
                      {batchId || `BCH-${Date.now().toString().slice(-6)}`}
                    </span>
                  </div>
                  <div className="flex justify-between mb-3">
                    <span className="text-gray-500">Total Weight:</span>
                    <span className="font-medium">{batchData.weight} Bags</span>
                  </div>
                  <div className="flex justify-between mb-3">
                    <span className="text-gray-500">Blockchain Status:</span>
                    <span
                      className={`font-medium ${
                        blockchainStatus === "confirmed"
                          ? "text-green-600"
                          : blockchainStatus === "failed"
                            ? "text-red-600"
                            : "text-yellow-600"
                      }`}
                    >
                      {blockchainStatus.charAt(0).toUpperCase() +
                        blockchainStatus.slice(1) || "Pending"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Submission Date:</span>
                    <span className="font-medium">
                      {new Date().toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </div>

                <Button
                  className="w-full bg-[#112D3E] text-white hover:bg-[#002020]"
                  onClick={handleReset}
                >
                  Submit Another Batch
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
