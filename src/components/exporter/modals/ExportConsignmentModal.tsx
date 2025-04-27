"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Upload } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

export function ExportConsignmentModal({
  open,
  onOpenChange,
  onContinue,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onContinue: (data: any) => void;
}) {
  const [selectedLot, setSelectedLot] = useState<string>("");
  const [destinationCountry, setDestinationCountry] = useState<string>("");
  const [permitNumber, setPermitNumber] = useState<string>("");
  const [productType, setProductType] = useState<string>("");
  const [hsCode, setHsCode] = useState<string>("");
  const [tradeName, setTradeName] = useState<string>("");
  const [exportDate, setExportDate] = useState<Date | undefined>();
  const [exportVolume, setExportVolume] = useState<string>("");
  const [shippingDetails, setShippingDetails] = useState<string>("");
  const [qualityNotes, setQualityNotes] = useState<string>("");
  const [certificateFile, setCertificateFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setCertificateFile(e.target.files[0]);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg p-6 overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-black">Export consignment</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 mt-4">
          {/* Select Lots */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Select lots</label>
            <Select onValueChange={setSelectedLot}>
              <SelectTrigger>
                <SelectValue placeholder="Select lot record" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="LT-001">LT-001</SelectItem>
                <SelectItem value="LT-002">LT-002</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Destination Country */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Destination country</label>
            <Select onValueChange={setDestinationCountry}>
              <SelectTrigger>
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Germany">Germany</SelectItem>
                <SelectItem value="USA">USA</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* UCDA Export Permit Number */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">UCDA Export permit number</label>
            <Input value={permitNumber} onChange={(e) => setPermitNumber(e.target.value)} placeholder="Enter permit number" />
          </div>

          {/* Product Type */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Product type</label>
            <Input value={productType} onChange={(e) => setProductType(e.target.value)} placeholder="Enter product type" />
          </div>

          {/* HS Code */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">HS Code</label>
            <Input value={hsCode} onChange={(e) => setHsCode(e.target.value)} placeholder="Enter HS code" />
          </div>

          {/* Trade Name */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Trade Name</label>
            <Input value={tradeName} onChange={(e) => setTradeName(e.target.value)} placeholder="Enter trade name" />
          </div>

          {/* Export Date and Export Volume */}
          <div className="flex gap-4">
            <div className="flex flex-col gap-1 w-1/2">
              <label className="text-sm font-medium text-gray-700">Export date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal text-black"
                  >
                    {exportDate ? format(exportDate, "PPP") : <span className="text-gray-400">Pick a date</span>}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="start" className="p-0">
                  <Calendar mode="single" selected={exportDate} onSelect={setExportDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex flex-col gap-1 w-1/2">
              <label className="text-sm font-medium text-gray-700">Export volume (kg)</label>
              <Input value={exportVolume} onChange={(e) => setExportVolume(e.target.value)} placeholder="Enter weight" />
            </div>
          </div>

          {/* Shipping Details */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Shipping details</label>
            <Textarea className="text-black" value={shippingDetails} onChange={(e) => setShippingDetails(e.target.value)} placeholder="Write here" />
          </div>

          {/* Quality Notes */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Quality notes</label>
            <Textarea className="text-black" value={qualityNotes} onChange={(e) => setQualityNotes(e.target.value)} placeholder="Write here" />
          </div>

          {/* Certificate of Origin */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Certificate of origin</label>
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-md p-6 text-center relative">
              <Upload className="w-8 h-8 text-gray-400 mb-2" />
              <p className="text-gray-600 text-sm">Choose Files to upload</p>
              <p className="text-xs text-gray-400 mt-1">Accepted formats: JPG, PNG. Max size: 5MB</p>
              <Input
                type="file"
                multiple
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={handleFileChange}
              />
              {certificateFile && (
                <p className="mt-2 text-sm text-gray-600">{certificateFile.name}</p>
              )}
            </div>
          </div>

          {/* Continue Button */}
          <Button
            className="w-full mt-2 bg-[#0F2A38] text-white"
            onClick={() => {
              onContinue({
                lot: selectedLot,
                destinationCountry,
                permitNumber,
                productType,
                hsCode,
                tradeName,
                exportDate: exportDate || null,
                exportVolume,
                shippingDetails,
                qualityNotes,
                certificateFileName: certificateFile?.name || "",
              });
            }}
          >
            Continue
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
