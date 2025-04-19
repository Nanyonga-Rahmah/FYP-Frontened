// components/modals/ApproveFarmModal.tsx

import { X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onApprove: (notes: string) => void;
}

export default function ApproveFarmModal({ isOpen, onClose, onApprove }: Props) {
  const [notes, setNotes] = useState("");

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!notes.trim()) return;
    onApprove(notes.trim());
    setNotes(""); // clear after submit
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg relative">
        <button onClick={onClose} className="absolute top-4 right-4 bg-white">
          <X className="w-5 h-5 text-gray-700" />
        </button>
        <h2 className="text-lg font-semibold text-black mb-2">Approve Farm ?</h2>
        <p className="text-sm text-gray-600 mb-4">
          Are you sure you want to approve this farm profile This action cannot be undone.
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
            className="bg-green-600 hover:bg-green-700"
            onClick={handleSubmit}
            disabled={!notes.trim()}
          >
            Approve
          </Button>
        </div>
      </div>
    </div>
  );
}
