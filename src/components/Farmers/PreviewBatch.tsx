import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface Processor {
  id: string;
  name: string;
  location: string;
}

interface Document {
  name: string;
  url: string;
  uploadDate?: string;
}

interface Harvest {
  _id: string;
  coffeeVariety: string[];
  weight: number;
  harvestPeriod: {
    start: string;
    end: string;
  };
  farmerId: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  farm: {
    _id: string;
    farmName: string;
    location: string;
  };
  status: string;
  createdAt: string;
}

interface PreviewData {
  farmerId: string;
  farmerInfo: {
    firstName: string;
    lastName: string;
    email: string;
  };
  harvests: Harvest[];
  totalWeight: number;
  documents: Document[];
  dataHash: string;
  submissionDate: string;
}

interface BatchData {
  weight: string;
  processorId: string;
  harvestIds: string[];
  comments?: string;
  documents: Document[];
  previewData: PreviewData;
}

interface PreviewBatchProps {
  handlePrevious: () => void;
  data: BatchData;
  handleConfirm: () => void;
  processors?: Processor[];
  isSubmitting?: boolean;
}

export function PreviewBatch({
  handlePrevious,
  data,
  handleConfirm,
  processors = [],
  isSubmitting = false,
}: PreviewBatchProps): JSX.Element {
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="mt-6 space-y-6 text-sm text-gray-700">
      <h3 className="text-lg font-medium text-black mb-4">
        Preview Batch Details
      </h3>

      <div className="flex justify-between">
        <div className="text-gray-500">Selected harvests</div>
        <div className="text-right space-y-1">
          {data.previewData.harvests.map((harvest, index) => (
            <div key={index} className="flex justify-end items-center gap-2">
              <span className="text-black font-medium">
                {harvest.coffeeVariety.join(", ")}
              </span>
              <span className="text-gray-500">{harvest.weight} Bags</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-between">
        <div className="text-gray-500">Total weight</div>
        <div className="text-black font-medium">{data.weight} Bags</div>
      </div>

      <div className="flex justify-between">
        <div className="text-gray-500">Processing facility</div>
        <div className="text-black font-medium">
          {(() => {
            const processor = processors.find((p) => p.id === data.processorId);
            return processor
              ? `${processor.name} (${processor.location})`
              : data.processorId;
          })()}
        </div>
      </div>

      <div className="flex justify-between">
        <div className="text-gray-500">Farmer</div>
        <div className="text-black font-medium">
          {data.previewData.farmerInfo.firstName}{" "}
          {data.previewData.farmerInfo.lastName}
        </div>
      </div>

      {data.documents?.length > 0 && (
        <div className="flex justify-between">
          <div className="text-gray-500">Documents</div>
          <div className="text-right space-y-1">
            {data.documents.map((doc, index) => (
              <div key={index} className="text-black font-medium">
                {doc.name}
              </div>
            ))}
          </div>
        </div>
      )}

      {data.comments && (
        <div className="flex justify-between">
          <div className="text-gray-500">Comments</div>
          <div className="text-black font-medium max-w-[60%] text-right">
            {data.comments}
          </div>
        </div>
      )}

      <div className="flex justify-between">
        <div className="text-gray-500">Submission Date</div>
        <div className="text-black font-medium">
          {formatDate(data.previewData.submissionDate)}
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 mt-8">
        <Button
          variant="outline"
          className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-100"
          onClick={handlePrevious}
          disabled={isSubmitting}
        >
          Back
        </Button>
        <Button
          className="flex-1 bg-[#112D3E] text-white hover:bg-[#002020]"
          onClick={() => {
            console.log("✅ Confirm button clicked");
            console.log("Batch data being submitted:", data);
            handleConfirm();
          }}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            "Confirm submission"
          )}
        </Button>
      </div>
    </div>
  );
}
