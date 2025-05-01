import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { API_URL } from "@/lib/routes";
import useAuth from "@/hooks/use-auth";

interface ConfirmDeliveryFormProps {
  open: boolean;
  onClose: () => void;
  lotId: string;
  onSuccess: () => void;
}

export function ConfirmDeliveryForm({
  open,
  onClose,
  lotId,
  onSuccess,
}: ConfirmDeliveryFormProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );
  const [receivedWeight, setReceivedWeight] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const { toast } = useToast();
  const { authToken } = useAuth();

  const handleSubmit = async () => {
    if (!receivedWeight) {
      toast({
        title: "Error",
        description: "Please enter received weight",
        variant: "destructive",
      });
      return;
    }

    if (!selectedDate) {
      toast({
        title: "Error",
        description: "Please select a date",
        variant: "destructive",
      });
      return;
    }

    if (!notes) {
      toast({
        title: "Error",
        description: "Please enter notes",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_URL}exporter/confirm-receipt`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          lotId,
          receivedWeight: parseFloat(receivedWeight),
          dateReceived: selectedDate.toISOString(),
          notes,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to confirm lot receipt");
      }

      toast({
        title: "Success",
        description: "Lot has been successfully marked as delivered",
      });

      setReceivedWeight("");
      setNotes("");
      setSelectedDate(new Date());

      onClose();
      onSuccess();
    } catch (error) {
      console.error("Error confirming lot receipt:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to confirm lot receipt",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-black">
            Confirm Delivery
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            Ensure you received this processor's lot. This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 mt-4">
          {/* Received weight */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              Received weight (kg) *
            </label>
            <Input
              placeholder="Enter weight"
              value={receivedWeight}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9.]/g, "");
                setReceivedWeight(value);
              }}
              type="text"
            />
          </div>

          {/* Date received */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              Date received *
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="justify-start text-left font-normal w-full"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Notes */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Notes *</label>
            <Textarea
              placeholder="Write here"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter className="flex justify-between mt-6">
          <DialogClose asChild>
            <Button
              variant="outline"
              className="w-1/2 text-black"
              disabled={loading}
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            className="w-1/2 bg-[#0F2A38] text-white"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Processing..." : "Mark Delivered"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
