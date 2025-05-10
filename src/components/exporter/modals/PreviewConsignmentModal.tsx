"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import useAuth from "@/hooks/use-auth";
import { API_URL } from "@/lib/routes";
import { useNavigate } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { SuccessConsignmentConfirmationScreen } from "@/components/exporter/modals/SuccessConsignmentConfirmationScreen";

interface ConsignmentData {
  lotIds?: string[];
  lot?: string;
  destinationCountry: string;
  destinationPort?: string;
  permitNumber?: string;
  productType?: string;
  hsCode?: string;
  tradeName?: string;
  exportDate: string | null;
  exportVolume?: number;
  shippingMethod?: string;
  shippingDetails?: string;
  qualityNotes?: string;
  certificateFileName?: string;
  certificateFile?: File;
}

export function PreviewConsignmentModal({
  open,
  onOpenChange,
  consignmentData,
  onBack,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  consignmentData: ConsignmentData | null;
  onBack: () => void;
  onConfirm: () => void;
}) {
  const [submitting, setSubmitting] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [createdConsignment, setCreatedConsignment] = useState<any>(null);
  const { toast } = useToast();
  const { authToken } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (consignmentData) {
      console.log("Current consignment data:", consignmentData);
    }
  }, [consignmentData]);

  if (!consignmentData) {
    console.log("No consignment data provided");
    return null;
  }

  const getLotId = () => {
    if (consignmentData.lot) {
      return consignmentData.lot;
    }
    if (consignmentData.lotIds && consignmentData.lotIds.length > 0) {
      return consignmentData.lotIds[0];
    }
    return "Unknown Lot";
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);

      const lotIds =
        consignmentData.lotIds ||
        (consignmentData.lot ? [consignmentData.lot] : []);

      const payload = {
        lotIds: lotIds,
        destinationCountry: consignmentData.destinationCountry,
        destinationPort: consignmentData.destinationPort || "",
        exportDate: consignmentData.exportDate,
        shippingMethod: consignmentData.shippingMethod || "",
        notes: consignmentData.qualityNotes || "",
      };

      console.log("Submitting payload:", payload);

      // Send the payload as JSON
      const response = await fetch(`${API_URL}exporter/create-consignment`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json", 
        },
        body: JSON.stringify(payload), 
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create consignment");
      }

      console.log("API response:", data);

      setCreatedConsignment(data.consignment);
      onConfirm();
      setIsSuccessModalOpen(true);

      toast({
        title: "Success",
        description: "Consignment created successfully",
      });
    } catch (error) {
      console.error("Error creating consignment:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to create consignment",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };


  return (
    <>
      <Dialog open={open && !isSuccessModalOpen} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-lg p-6 overflow-y-auto max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-black">
              Preview consignment
            </DialogTitle>
            <p className="text-sm text-gray-500 mt-1">
              This will be logged and can't be changed. Confirm all details.
            </p>
          </DialogHeader>

          <div className="flex flex-col gap-4 mt-6 text-sm text-gray-700">
            {/* Selected lots */}
            <div>
              <p className="text-xs font-medium text-gray-400">Selected lots</p>
              <div className="flex flex-col gap-1 mt-1">
                <span className="text-[#0F2A38]">{getLotId()}</span>
              </div>
            </div>

            <Separator />

            {/* Export Volume */}
            <div className="flex justify-between">
              <span className="font-medium text-[#0F2A38]">Export volume</span>
              <span>{consignmentData.exportVolume || "-"} kg</span>
            </div>

            {/* Destination Country */}
            <div className="flex justify-between">
              <span className="font-medium text-[#0F2A38]">
                Destination country
              </span>
              <span>{consignmentData.destinationCountry || "-"}</span>
            </div>

            {/* Destination Port - if available */}
            {consignmentData.destinationPort && (
              <div className="flex justify-between">
                <span className="font-medium text-[#0F2A38]">
                  Destination port
                </span>
                <span>{consignmentData.destinationPort}</span>
              </div>
            )}

            {/* UCDA Permit Number */}
            <div className="flex justify-between">
              <span className="font-medium text-[#0F2A38]">
                UCDA Export permit number
              </span>
              <span>{consignmentData.permitNumber || "-"}</span>
            </div>

            {/* Export Date */}
            <div className="flex justify-between">
              <span className="font-medium text-[#0F2A38]">Export date</span>
              <span>
                {consignmentData.exportDate
                  ? format(new Date(consignmentData.exportDate), "PPP")
                  : "-"}
              </span>
            </div>

            {/* Product Type - if available */}
            {consignmentData.productType && (
              <div className="flex justify-between">
                <span className="font-medium text-[#0F2A38]">Product type</span>
                <span>{consignmentData.productType}</span>
              </div>
            )}

            {/* HS Code - if available */}
            {consignmentData.hsCode && (
              <div className="flex justify-between">
                <span className="font-medium text-[#0F2A38]">HS Code</span>
                <span>{consignmentData.hsCode}</span>
              </div>
            )}

            {/* Trade Name - if available */}
            {consignmentData.tradeName && (
              <div className="flex justify-between">
                <span className="font-medium text-[#0F2A38]">Trade name</span>
                <span>{consignmentData.tradeName}</span>
              </div>
            )}

            {/* Shipping Method - if available */}
            {consignmentData.shippingMethod && (
              <div className="flex justify-between">
                <span className="font-medium text-[#0F2A38]">
                  Shipping method
                </span>
                <span>{consignmentData.shippingMethod}</span>
              </div>
            )}

            {/* Shipping Details */}
            <div className="flex flex-col gap-1">
              <span className="font-medium text-[#0F2A38]">
                Shipping details
              </span>
              <span className="text-black">
                {consignmentData.shippingDetails || "-"}
              </span>
            </div>

            {/* Quality Notes */}
            <div className="flex flex-col gap-1">
              <span className="font-medium text-[#0F2A38]">Quality notes</span>
              <span className="text-black">
                {consignmentData.qualityNotes || "-"}
              </span>
            </div>

            {/* Certificate of Origin */}
            {consignmentData.certificateFileName && (
              <div className="flex flex-col gap-1">
                <span className="font-medium text-[#0F2A38]">
                  Certificate of origin
                </span>
                <div className="flex items-center gap-2">
                  <img
                    src="/images/file-icon.png"
                    alt="File"
                    className="w-4 h-4"
                  />
                  <span className="text-gray-600">
                    {consignmentData.certificateFileName}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-between gap-4 mt-6 text-black">
            <Button
              variant="outline"
              className="w-1/2"
              onClick={onBack}
              disabled={submitting}
            >
              Back
            </Button>
            <Button
              className="w-1/2 bg-[#0F2A38] text-white"
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting ? "Submitting..." : "Confirm submission"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Success Modal */}
      {isSuccessModalOpen && createdConsignment && (
        <SuccessConsignmentConfirmationScreen
          consignmentData={{
            ...consignmentData,
            id: createdConsignment.consignmentId,
            consignmentId: createdConsignment.consignmentId,
          }}
          onDownloadQRCode={() => {
            // Handle QR code download
            if (createdConsignment.qrCodeImageUrl) {
              window.open(createdConsignment.qrCodeImageUrl, "_blank");
            } else {
              toast({
                title: "Info",
                description: "QR code not available yet",
              });
            }
          }}
          onDownloadReport={() => {
            // Handle report download
            if (createdConsignment.consignmentId) {
              window.open(
                `${API_URL}exporter/consignments/${createdConsignment.consignmentId}/report`,
                "_blank"
              );
            } else {
              toast({
                title: "Info",
                description: "Report not available yet",
              });
            }
          }}
          onClose={() => {
            setIsSuccessModalOpen(false);
            onOpenChange(false);
            navigate("/view-consignment");
          }}
        />
      )}
    </>
  );
}
