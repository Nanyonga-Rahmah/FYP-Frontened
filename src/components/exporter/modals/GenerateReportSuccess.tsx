import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  fileName: string;
  onDownload?: () => void;
}

function GenerateModalSuccess({ open, onClose, fileName, onDownload }: Props) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md px-8 py-6 rounded-lg text-center">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-[#0F2A38]">
            Generate report
          </DialogTitle>
        </DialogHeader>

        <p className="my-6 text-black text-sm">
          {fileName} report is ready for download.
        </p>

        <Button
          onClick={onDownload}
          className="bg-[#0F2A38] text-white px-6 py-2 text-sm flex items-center gap-2 mx-auto"
        >
          <Download className="w-4 h-4" />
          Download PDF
        </Button>
      </DialogContent>
    </Dialog>
  );
}

export default GenerateModalSuccess;
