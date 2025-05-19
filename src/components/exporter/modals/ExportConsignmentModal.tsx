"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Upload } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import useAuth from "@/hooks/use-auth";
import useUserProfile from "@/hooks/use-profile";
import { API_URL } from "@/lib/routes";
import { useToast } from "@/components/ui/use-toast";

interface Lot {
  _id: string;
  lotId:String;
  status: string;
  type: string;
}

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
  const [destinationPort, setDestinationPort] = useState<string>("");
  const [permitNumber, setPermitNumber] = useState<string>("");
  const [productType, setProductType] = useState<string>("");
  const [hsCode, setHsCode] = useState<string>("");
  const [tradeName, setTradeName] = useState<string>("");
  const [exportDate, setExportDate] = useState<Date | undefined>();
  const [exportVolume, setExportVolume] = useState<string>("");
  const [shippingMethod, setShippingMethod] = useState<string>("");
  const [shippingDetails, setShippingDetails] = useState<string>("");
  const [qualityNotes, setQualityNotes] = useState<string>("");
  const [certificateFile, setCertificateFile] = useState<File | null>(null);
  const [selectedLotWeight, setSelectedLotWeight] = useState<number | null>(
    null
  ); 
  const [lots, setLots] = useState<Lot[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { authToken } = useAuth();
  const { profile } = useUserProfile(authToken);
  const { toast } = useToast();

  const countries = [
    "Germany",
    "Italy",
    "France",
    "Netherlands",
    "Belgium",
    "United Kingdom",
    "United States",
    "Canada",
    "Japan",
    "China",
    "Australia",
    "Switzerland",
    "Spain",
  ];

  const shippingMethods = [
    "Sea Freight",
    "Air Freight",
    "Road Transport",
    "Rail Transport",
  ];

  const ports: Record<string, string[]> = {
    Germany: ["Hamburg", "Bremen", "Rostock"],
    Italy: ["Genoa", "Venice", "Naples"],
    France: ["Marseille", "Le Havre", "Calais"],
    Netherlands: ["Rotterdam", "Amsterdam"],
    Belgium: ["Antwerp", "Zeebrugge"],
    "United Kingdom": ["Felixstowe", "Southampton", "London Gateway"],
    "United States": ["New York", "Los Angeles", "Houston", "Miami"],
    Canada: ["Vancouver", "Montreal", "Halifax"],
    Japan: ["Tokyo", "Yokohama", "Osaka"],
    China: ["Shanghai", "Hong Kong", "Shenzhen"],
    Australia: ["Sydney", "Melbourne", "Brisbane"],
    Switzerland: ["Basel"],
    Spain: ["Barcelona", "Valencia", "Bilbao"],
  };

  // Load form data from localStorage when modal opens
  useEffect(() => {
    if (open) {
      const savedData = localStorage.getItem("exportConsignmentForm");
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        setSelectedLot(parsedData.selectedLot || "");
        setDestinationCountry(parsedData.destinationCountry || "");
        setDestinationPort(parsedData.destinationPort || "");
        setPermitNumber(parsedData.permitNumber || "");
        setProductType(parsedData.productType || "");
        setHsCode(parsedData.hsCode || "");
        setTradeName(parsedData.tradeName || "");
        setExportDate(
          parsedData.exportDate ? new Date(parsedData.exportDate) : undefined
        );
        setExportVolume(parsedData.exportVolume || "");
        setShippingMethod(parsedData.shippingMethod || "");
        setShippingDetails(parsedData.shippingDetails || "");
        setQualityNotes(parsedData.qualityNotes || "");
      }
      fetchLots();
    }
  }, [open, authToken]);

  // Save form data to localStorage whenever it changes
  useEffect(() => {
    const formData = {
      selectedLot,
      destinationCountry,
      destinationPort,
      permitNumber,
      productType,
      hsCode,
      tradeName,
      exportDate: exportDate ? exportDate.toISOString() : null,
      exportVolume,
      shippingMethod,
      shippingDetails,
      qualityNotes,
    };
    localStorage.setItem("exportConsignmentForm", JSON.stringify(formData));
  }, [
    selectedLot,
    destinationCountry,
    destinationPort,
    permitNumber,
    productType,
    hsCode,
    tradeName,
    exportDate,
    exportVolume,
    shippingMethod,
    shippingDetails,
    qualityNotes,
  ]);

  const fetchLots = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}exporter/lots`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch lots");
      }

      const data = await response.json();

      const availableLots = data.filter(
        (lot: any) => lot.status === "Exported" || lot.status === "exported"
      );

      setLots(availableLots);
    } catch (error) {
      console.error("Error fetching lots:", error);
      toast({
        title: "Error",
        description: "Failed to fetch available lots. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
const handleLotChange = (lotId: string) => {
  setSelectedLot(lotId);
  const selectedLotData = lots.find((lot) => lot._id === lotId);

  if (selectedLotData) {
    const weight = parseInt(
      selectedLotData.type.split("(")[1].split("kg")[0].trim()
    );
    setSelectedLotWeight(weight);
    setExportVolume(weight.toString()); 
  }
};
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setCertificateFile(e.target.files[0]);
    }
  };

  const handleContinue = () => {
    if (!selectedLot || !destinationCountry || !exportDate) {
      toast({
        title: "Missing information",
        description:
          "Please fill in all required fields: Lot, Destination Country, and Export Date",
        variant: "destructive",
      });
      return;
    }

    const formData = {
      lotIds: [selectedLot],
      destinationCountry,
      destinationPort,
      permitNumber: profile?.licenseNumber,
      productType,
      hsCode,
      tradeName,
      exportDate: exportDate ? exportDate.toISOString() : null,
      exportVolume: exportVolume ? parseInt(exportVolume) : 0,
      shippingMethod,
      shippingDetails,
      qualityNotes,
      certificateFileName: certificateFile?.name || "",
      certificateFile,
      exporterName: profile?.companyName || "",
    };

    onContinue(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg p-6 overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-black">
            Export consignment
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 mt-4">
          {/* Exporter Name */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              Exporter Name
            </label>
            <Input
              value={profile?.companyName || "Loading..."}
              className="text-black"
            />
          </div>

          {/* Select Lots */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              Select lot
            </label>
            <Select onValueChange={handleLotChange} value={selectedLot}>
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    loading ? "Loading lots..." : "Select lot record"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {lots.length === 0 ? (
                  <SelectItem value="no-lots" disabled>
                    No exported lots available
                  </SelectItem>
                ) : (
                  lots.map((lot) => (
                    <SelectItem key={lot._id} value={lot._id}>
                      {lot.lotId} - {lot.type}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Destination Country */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              Destination country
            </label>
            <Select
              onValueChange={setDestinationCountry}
              value={destinationCountry}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                {countries.map((country) => (
                  <SelectItem key={country} value={country}>
                    {country}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Destination Port - Only show if country is selected */}
          {destinationCountry && (
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">
                Destination port
              </label>
              <Select
                onValueChange={setDestinationPort}
                value={destinationPort}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select port" />
                </SelectTrigger>
                <SelectContent>
                  {ports[destinationCountry]?.map((port) => (
                    <SelectItem key={port} value={port}>
                      {port}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* UCDA Export Permit Number */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              UCDA Export permit number
            </label>
            <Input
              value={profile?.licenseNumber || "Loading..."}
              onChange={(e) => setPermitNumber(e.target.value)}
              placeholder="Enter permit number"
            />
          </div>

          {/* Product Type */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              Product type
            </label>
            <Input
              value={productType}
              onChange={(e) => setProductType(e.target.value)}
              placeholder="Enter product type"
            />
          </div>

          {/* HS Code */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">HS Code</label>
            <Input
              value={hsCode}
              onChange={(e) => setHsCode(e.target.value)}
              placeholder="Enter HS code"
            />
          </div>

          {/* Trade Name */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              Trade Name
            </label>
            <Input
              value={tradeName}
              onChange={(e) => setTradeName(e.target.value)}
              placeholder="Enter trade name"
            />
          </div>

          {/* Export Date and Export Volume */}
          <div className="flex gap-4">
            <div className="flex flex-col gap-1 w-1/2">
              <label className="text-sm font-medium text-gray-700">
                Export date
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal text-black"
                  >
                    {exportDate ? (
                      format(exportDate, "PPP")
                    ) : (
                      <span className="text-gray-400">Pick a date</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="start" className="p-0">
                  <Calendar
                    mode="single"
                    selected={exportDate}
                    onSelect={setExportDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex flex-col gap-1 w-1/2">
              <label className="text-sm font-medium text-gray-700">
                Export volume (kg)
              </label>
              <Input
                value={exportVolume||selectedLotWeight?.toString() || ""}
                onChange={(e) => setExportVolume(e.target.value)}
                disabled
                placeholder="Enter weight"
                type="number"
              />
            </div>
          </div>

          {/* Shipping Method */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              Shipping method
            </label>
            <Select onValueChange={setShippingMethod} value={shippingMethod}>
              <SelectTrigger>
                <SelectValue placeholder="Select shipping method" />
              </SelectTrigger>
              <SelectContent>
                {shippingMethods.map((method) => (
                  <SelectItem key={method} value={method}>
                    {method}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Shipping Details */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              Shipping details
            </label>
            <Textarea
              className="text-black"
              value={shippingDetails}
              onChange={(e) => setShippingDetails(e.target.value)}
              placeholder="Carrier/vessel name, container numbers, etc."
            />
          </div>

          {/* Quality Notes */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              Quality notes
            </label>
            <Textarea
              className="text-black"
              value={qualityNotes}
              onChange={(e) => setQualityNotes(e.target.value)}
              placeholder="Grade, moisture content, screen size, etc."
            />
          </div>

          {/* Certificate of Origin */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              Certificate of origin
            </label>
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-md p-6 text-center relative">
              <Upload className="w-8 h-8 text-gray-400 mb-2" />
              <p className="text-gray-600 text-sm">Choose Files to upload</p>
              <p className="text-xs text-gray-400 mt-1">
                Accepted formats: JPG, PNG, PDF. Max size: 5MB
              </p>
              <Input
                type="file"
                multiple
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={handleFileChange}
              />
              {certificateFile && (
                <p className="mt-2 text-sm text-gray-600">
                  {certificateFile.name}
                </p>
              )}
            </div>
          </div>

          {/* Continue Button */}
          <Button
            className="w-full mt-2 bg-[#0F2A38] text-white"
            onClick={handleContinue}
            disabled={loading}
          >
            {loading ? "Loading..." : "Continue"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}