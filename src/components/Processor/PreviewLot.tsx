import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface PreviewLotProps {
  handlePrevious: () => void;
  handleSubmit: () => void;
  isSubmitting: boolean;
  data: {
    batches: Array<{
      _id: string;
      batchId: string;
      totalWeight: number;
    }>;
    exporterFacility: string;
    comments: string;
    totalWeight: string;
  };
}

export function PreviewLot({
  handlePrevious,
  handleSubmit,
  isSubmitting,
  data,
}: PreviewLotProps) {
  
  return (
    <div className="mt-6 space-y-6 text-sm text-gray-700">
      <div className="flex justify-between">
        <div className="text-gray-500">Selected Batches</div>
        <div className="text-right space-y-1">
          {data.batches.map((batch) => (
            <div
              key={batch._id}
              className="flex justify-end items-center gap-2"
            >
              <span className="text-black font-medium">{batch.batchId}</span>
              <span className="text-gray-500">{batch.totalWeight}kg</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-between">
        <div className="text-gray-500">Total Weight</div>
        <div className="text-black font-medium">{data.totalWeight}kg</div>
      </div>

      <div className="flex justify-between">
        <div className="text-gray-500">Exporter Facility</div>
        <div className="text-black font-medium">
          {data.exporterFacility ? (
            <span>{data.exporterFacility}</span>
          ) : (
            "Not specified"
          )}
        </div>
      </div>

      <div className="flex justify-between">
        <div className="text-gray-500">Comments</div>
        <div className="text-black font-medium">
          {data.comments || "No comments provided"}
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 mt-8">
        <Button
          variant="outline"
          className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-100"
          onClick={handlePrevious}
        >
          Back
        </Button>
        <Button
          className="flex-1 bg-[#112D3E] text-white hover:bg-[#002020]"
          onClick={handleSubmit}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            "Confirm Submission"
          )}
        </Button>
      </div>
    </div>
  );
}
