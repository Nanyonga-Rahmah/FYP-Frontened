// components/modals/RejectFarmerModal.tsx

import { X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onReject: (notes: string) => void;
}

export default function RejectFarmerModal({ isOpen, onClose, onReject }: Props) {
  const [notes, setNotes] = useState("");

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!notes.trim()) return;
    onReject(notes.trim());
    setNotes("");
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg relative">
        <button onClick={onClose} className="absolute top-4 right-4 bg-white">
          <X className="w-5 h-5 text-gray-700" />
        </button>
        <h2 className="text-lg font-semibold text-black mb-2">Reject Farmer?</h2>
        <p className="text-sm text-gray-600 mb-4">
          Are you sure you want to reject this farmer's profile? Please provide a reason.
        </p>
        <div className="mb-4">
          <label className="text-sm font-medium text-black mb-1 block">Notes*</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Write here"
            className="w-full border bg-white rounded-md p-2 text-sm text-black focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none min-h-[100px]"
          />
        </div>
        <div className="flex justify-between mt-4">
          <Button className="text-black" variant="outline" onClick={onClose}>Cancel</Button>
          <Button
            className="bg-red-600 hover:bg-red-700"
            onClick={handleSubmit}
            disabled={!notes.trim()}
          >
            Reject
          </Button>
        </div>
      </div>
    </div>
  );
}
