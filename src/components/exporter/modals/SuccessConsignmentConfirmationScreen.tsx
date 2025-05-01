"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { QRCodeSVG } from "qrcode.react"; 
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
            className="w-12 h-12" 
          />
        </div>

        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-black">
            Consignment Successfully Submitted!
          </DialogTitle>

          <p className="text-sm text-gray-500 mt-1">
            Consignment #
            <span className="font-semibold">{consignmentData?.id}</span> has
            been submitted successfully.
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
            <span className="text-black">
              {consignmentData?.exportVolume || "-"} kg
            </span>
          </div>

          {/* Destination Country */}
          <div className="flex justify-between">
            <span className="font-medium text-[#0F2A38]">
              Destination Country
            </span>
            <span className="text-black">
              {consignmentData?.destinationCountry || "-"}
            </span>
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
            <span className="text-black">
              {consignmentData?.comments || "-"}
            </span>
          </div>

          <Separator />

          <div className="flex flex-col items-center">
            <div className="relative">
              <QRCodeSVG
                value={
                  consignmentData?.qrCodeValue || consignmentData?.id || ""
                }
                size={128}
                bgColor="#FFFFFF"
                fgColor="#0F2A38"
                level="H"
              />

              {/* Logo overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white p-1 rounded-sm">
                  <img
                    src="/images/logo.png"
                    alt="Logo"
                    className="w-10 h-10"
                    style={{
                      objectFit: "contain",
                    }}
                  />
                </div>
              </div>
            </div>

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
            <Button
              variant="outline"
              className="w-1/2 text-black"
              onClick={onClose}
            >
              Close
            </Button>
            <Button
              className="w-1/2 bg-[#0F2A38] text-white"
              onClick={onDownloadReport}
            >
              Download Report
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
