import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar"; 
import { format } from "date-fns"; // For formatting dates
import { CalendarIcon } from "lucide-react"; 
import { useState } from "react";


interface ConfirmDeliveryFormProps {
  open: boolean;
  onClose: () => void;
}

export function ConfirmDeliveryForm({ open, onClose }: ConfirmDeliveryFormProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-black">Confirm Delivery</DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            Ensure you received this processor's lot. This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 mt-4">
          {/* Received weight */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Received weight (kg)</label>
            <Input placeholder="Enter weight" />
          </div>

         {/* Date received */}
<div className="flex flex-col gap-1">
  <label className="text-sm font-medium text-gray-700">Date received</label>
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
            <Textarea placeholder="Write here" />
          </div>
        </div>

        <DialogFooter className="flex justify-between mt-6">
          <DialogClose asChild>
            <Button variant="outline" className="w-1/2 text-black">Cancel</Button>
          </DialogClose>
          <Button className="w-1/2 bg-[#0F2A38] text-white">Mark Delivered</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
