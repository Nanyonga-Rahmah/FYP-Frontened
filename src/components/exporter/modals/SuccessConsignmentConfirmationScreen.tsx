"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { QRCode } from "react-qrcode-logo"; // Assuming you will use react-qrcode-logo or another QR code generator
import { format } from "date-fns";

export function SuccessConsignmentConfirmationScreen({
  consignmentData,
  onDownloadQRCode,
  onDownloadReport,
  onClose,
}: {
  consignmentData: any;
  onDownloadQRCode: () => void;
  onDownloadReport: () => void;
  onClose: () => void;
}) {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-lg p-6 overflow-y-auto max-h-[90vh]">

         {/* Custom Image for Success */}
         <div className="flex justify-center mt-4 mb-2">
            <img
              src="/images/sucess-consignment.png"
              alt="Success"
              className="w-12 h-12" // Adjust the size of your image
            />
          </div>

        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-black">
            Consignment Successfully Submitted!
          </DialogTitle>

          <p className="text-sm text-gray-500 mt-1">
            Consignment #<span className="font-semibold">{consignmentData?.id}</span> has been submitted successfully.
          </p>
        </DialogHeader>

        <div className="flex flex-col gap-4 mt-6">
          {/* Consignment ID */}
          <div className="flex justify-between">
            <span className="font-medium text-[#0F2A38]">Consignment ID</span>
            <span className="text-black">{consignmentData?.id || "-"}</span>
          </div>

          <Separator />

          {/* Export Volume */}
          <div className="flex justify-between">
            <span className="font-medium text-[#0F2A38]">Export Volume</span>
            <span className="text-black">{consignmentData?.exportVolume || "-"} kg</span>
          </div>

          {/* Destination Country */}
          <div className="flex justify-between">
            <span className="font-medium text-[#0F2A38]">Destination Country</span>
            <span className="text-black">{consignmentData?.destinationCountry || "-"}</span>
          </div>

          {/* Export Date */}
          <div className="flex justify-between">
            <span className="font-medium text-[#0F2A38]">Export Date</span>
            <span className="text-black">
              {consignmentData?.exportDate
                ? format(new Date(consignmentData.exportDate), "PPP")
                : "-"}
            </span>
          </div>

          {/* Comments */}
          <div className="flex justify-between">
            <span className="font-medium text-[#0F2A38]">Comments</span>
            <span className="text-black">{consignmentData?.comments || "-"}</span>
          </div>

          <Separator />

          {/* QR Code Section */}
          <div className="flex flex-col items-center">
            <QRCode
              value={consignmentData?.qrCodeValue || ""}  // QR code value based on consignment data
              size={128} // Size of the QR code
              logoImage="/images/logo.png" // Optional: If you want to add a logo in the center of the QR code
              logoWidth={40} // Size of the logo inside the QR code
              logoHeight={40} // Size of the logo inside the QR code
              fgColor="#0F2A38" // QR Code foreground color
              bgColor="#ffffff" // QR Code background color
            />
            <p className="text-center mt-2 font-medium text-[#0F2A38]">
              Scan to view consignment details
            </p>
            <Button className="mt-4" onClick={onDownloadQRCode}>
              Download Consignment QR Code
            </Button>
          </div>

          <Separator />

          {/* Action Buttons */}
          <div className="flex justify-between gap-4 mt-6 text-black">
            <Button variant="outline" className="w-1/2 text-black" onClick={onClose}>
              Close
            </Button>
            <Button className="w-1/2 bg-[#0F2A38] text-white" onClick={onDownloadReport}>
              Download Report
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
