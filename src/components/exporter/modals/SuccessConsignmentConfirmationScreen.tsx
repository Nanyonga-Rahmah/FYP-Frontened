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
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";

interface SuccessConsignmentConfirmationScreenProps {
  consignmentData: any;
  onDownloadQRCode: () => void;
  onDownloadReport: () => void;
  onClose: () => void;
}

export function SuccessConsignmentConfirmationScreen({
  consignmentData,
  onDownloadQRCode,
  onDownloadReport,
  onClose,
}: SuccessConsignmentConfirmationScreenProps) {
  const [open, setOpen] = useState(true);
  const { toast } = useToast();

  // Debug consignment data
  useEffect(() => {
    console.log("Success screen consignment data:", consignmentData);
  }, [consignmentData]);

  const handleClose = () => {
    setOpen(false);
    onClose();
  };

  // Get the consignment ID using fallbacks
  const getConsignmentId = () => {
    return (
      consignmentData?.consignmentId ||
      consignmentData?.id ||
      "CS-" + Math.floor(Math.random() * 1000000)
    );
  };

  // Generate QR code value
  const qrCodeValue =
    consignmentData?.qrCodeUrl ||
    consignmentData?.qrCodeValue ||
    `${window.location.origin}/track/consignment/${getConsignmentId()}`;

  const handleQRDownload = () => {
    try {
      onDownloadQRCode();
    } catch (error) {
      console.error("Error downloading QR code:", error);
      toast({
        title: "Error",
        description: "Could not download QR code. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleReportDownload = () => {
    try {
      onDownloadReport();
    } catch (error) {
      console.error("Error downloading report:", error);
      toast({
        title: "Error",
        description: "Could not download report. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
            <span className="font-semibold">{getConsignmentId()}</span> has been
            submitted successfully.
          </p>
        </DialogHeader>

        <div className="flex flex-col gap-4 mt-6">
          {/* Consignment ID */}
          <div className="flex justify-between">
            <span className="font-medium text-[#0F2A38]">Consignment ID</span>
            <span className="text-black">{getConsignmentId()}</span>
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

          {/* Destination Port - if available */}
          {consignmentData?.destinationPort && (
            <div className="flex justify-between">
              <span className="font-medium text-[#0F2A38]">
                Destination Port
              </span>
              <span className="text-black">
                {consignmentData.destinationPort}
              </span>
            </div>
          )}

          {/* Export Date */}
          <div className="flex justify-between">
            <span className="font-medium text-[#0F2A38]">Export Date</span>
            <span className="text-black">
              {consignmentData?.exportDate
                ? format(new Date(consignmentData.exportDate), "PPP")
                : "-"}
            </span>
          </div>

          {/* Comments/Notes - using multiple possible field names */}
          <div className="flex justify-between">
            <span className="font-medium text-[#0F2A38]">Notes</span>
            <span className="text-black">
              {consignmentData?.comments ||
                consignmentData?.qualityNotes ||
                consignmentData?.notes ||
                "-"}
            </span>
          </div>

          <Separator />

          {/* QR Code Section */}
          <div className="flex flex-col items-center">
            <div className="relative">
              <QRCodeSVG
                value={qrCodeValue}
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
            <Button className="mt-4" onClick={handleQRDownload}>
              Download Consignment QR Code
            </Button>
          </div>

          <Separator />

          {/* Action Buttons */}
          <div className="flex justify-between gap-4 mt-6 text-black">
            <Button
              variant="outline"
              className="w-1/2 text-black"
              onClick={handleClose}
            >
              Close
            </Button>
            <Button
              className="w-1/2 bg-[#0F2A38] text-white"
              onClick={handleReportDownload}
            >
              Download Report
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
