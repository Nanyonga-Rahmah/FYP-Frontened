"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { SuccessConsignmentConfirmationScreen } from "@/components/exporter/modals/SuccessConsignmentConfirmationScreen";

export function PreviewConsignmentModal({
  open,
  onOpenChange,
  consignmentData,
  onBack,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  consignmentData: any;
  onBack: () => void;
  onConfirm: () => void;
}) {
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false); // State to handle success modal

  const handleConfirm = () => {
    onConfirm(); // Call onConfirm passed as prop (this may handle additional logic)
    setIsSuccessModalOpen(true); // Open success modal after confirmation
  };

  const handleDownloadQRCode = () => {
    // Add logic for QR Code download
    console.log("Downloading QR Code...");
  };

  const handleDownloadReport = () => {
    // Add logic for report download
    console.log("Downloading Report...");
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-lg p-6 overflow-y-auto max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-black">Preview consignment</DialogTitle>
            <p className="text-sm text-gray-500 mt-1">
              This will be logged and can't be changed. Confirm all details.
            </p>
          </DialogHeader>

          <div className="flex flex-col gap-4 mt-6 text-sm text-gray-700">
            {/* Selected lots */}
            <div>
              <p className="text-xs font-medium text-gray-400">Selected lots</p>
              <div className="flex flex-col gap-1 mt-1">
                <span className="text-[#0F2A38]">{consignmentData?.lot || "-"}</span>
              </div>
            </div>

            <Separator />

            {/* Export Volume */}
            <div className="flex justify-between">
              <span className="font-medium text-[#0F2A38]">Export volume</span>
              <span>{consignmentData?.exportVolume || "-"} kg</span>
            </div>

            {/* Destination Country */}
            <div className="flex justify-between">
              <span className="font-medium text-[#0F2A38]">Destination country</span>
              <span>{consignmentData?.destinationCountry || "-"}</span>
            </div>

            {/* UCDA Permit Number */}
            <div className="flex justify-between">
              <span className="font-medium text-[#0F2A38]">UCDA Export permit number</span>
              <span>{consignmentData?.permitNumber || "-"}</span>
            </div>

            {/* Export Date */}
            <div className="flex justify-between">
              <span className="font-medium text-[#0F2A38]">Export date</span>
              <span>
                {consignmentData?.exportDate
                  ? format(new Date(consignmentData.exportDate), "PPP")
                  : "-"}
              </span>
            </div>

            {/* Shipping Details */}
            <div className="flex flex-col gap-1">
              <span className="font-medium text-[#0F2A38]">Shipping details</span>
              <span className="text-black">{consignmentData?.shippingDetails || "-"}</span>
            </div>

            {/* Quality Notes */}
            <div className="flex flex-col gap-1">
              <span className="font-medium text-[#0F2A38]">Quality notes</span>
              <span className="text-black">{consignmentData?.qualityNotes || "-"}</span>
            </div>

            {/* Certificate of Origin */}
            {consignmentData?.certificateFileName && (
              <div className="flex flex-col gap-1">
                <span className="font-medium text-[#0F2A38]">Certificate of origin</span>
                <div className="flex items-center gap-2">
                  <img src="/images/file-icon.png" alt="File" className="w-4 h-4" />
                  <span className="text-gray-600">{consignmentData?.certificateFileName}</span>
                </div>
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-between gap-4 mt-6 text-black">
            <Button variant="outline" className="w-1/2" onClick={onBack}>
              Back
            </Button>
            <Button className="w-1/2 bg-[#0F2A38] text-white" onClick={handleConfirm}>
              Confirm submission
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Success Modal */}
      {isSuccessModalOpen && (
        <SuccessConsignmentConfirmationScreen
          consignmentData={consignmentData}
          onDownloadQRCode={handleDownloadQRCode}
          onDownloadReport={handleDownloadReport}
          onClose={() => setIsSuccessModalOpen(false)} // Close Success modal
        />
      )}
    </>
  );
}
