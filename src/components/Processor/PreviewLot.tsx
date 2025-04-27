import { Button } from "@/components/ui/button";

interface PreviewBatchProps {
  handlePrevious: () => void;
  data: any;
}
export function PreviewLot({ handlePrevious, data }: PreviewBatchProps) {
  console.log("PreviewBatch data", data);
  return (
    <>
      <div className="mt-6 space-y-6 text-sm text-gray-700">
        <div className="flex justify-between">
          <div className="text-gray-500">Selected batches</div>
          <div className="text-right space-y-1">
            <div className="flex justify-end items-center gap-2">
              <span className="text-black font-medium">BH-001</span>
              <span className="text-gray-500">10 bags</span>
            </div>
            <div className="flex justify-end items-center gap-2">
              <span className="text-black font-medium">BH-001</span>
              <span className="text-gray-500">10 bags</span>
            </div>
          </div>
        </div>

        <div className="flex justify-between">
          <div className="text-gray-500">Total bags</div>
          <div className="text-black font-medium">{data.weight}</div>
        </div>

        <div className="flex justify-between">
          <div className="text-gray-500">Exporter facilities</div>
          <div className="text-right space-y-1">
            {data?.exporterfacility.map((unit: string, index: number) => (
              <div key={index} className="text-black font-medium">
                {unit}
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-between">
          <div className="text-gray-500">Comments</div>
          <div className="text-black font-medium">{data.comments}</div>
        </div>

        <div className="flex items-center justify-between gap-4 mt-8">
          <Button
            variant="outline"
            className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-100"
            onClick={handlePrevious}
          >
            Back
          </Button>
          <Button className="flex-1 bg-[#112D3E] text-white hover:bg-[#002020]">
            Confirm submission
          </Button>
        </div>
      </div>
    </>
  );
}
