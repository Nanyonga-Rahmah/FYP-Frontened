import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useState } from "react";


interface Props {
    open: boolean;
    onClose: () => void;
    selectedType: string;
    onSuccess: (meta: { name: string; type: string }) => void;
}

function GenerateReportModal({
    open,
    onClose,
    selectedType,
    onSuccess,
}: Props) {
    const [consignment, setConsignment] = useState("CS-001");
    const [reportName, setReportName] = useState("Coffee 2024 Report");
    const [reportType, setReportType] = useState(selectedType);


    const handleGenerate = () => {
        onClose();
        onSuccess({ name: reportName, type: reportType });
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-md px-8 py-6 rounded-lg">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-[#0F2A38] mb-4">
                        Generate report
                    </DialogTitle>
                </DialogHeader>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-[#0F2A38] mb-1">
                        Report type
                    </label>
                    <Select defaultValue={reportType} onValueChange={setReportType}>
                        <SelectTrigger className="w-full bg-white border border-gray-300 rounded-md">
                            <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Due Diligence Statement">
                                Due Diligence Statement
                            </SelectItem>
                            <SelectItem value="Deforestation assessment">
                                Deforestation assessment
                            </SelectItem>
                            <SelectItem value="Traceability report">
                                Traceability report
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-[#0F2A38] mb-1">
                        Select consignment
                    </label>
                    <Select onValueChange={setConsignment} defaultValue={consignment}>
                        <SelectTrigger className="w-full bg-white border border-gray-300 rounded-md">
                            <SelectValue placeholder="Select consignment record" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="CS-001">CS-001</SelectItem>
                            <SelectItem value="CS-002">CS-002</SelectItem>
                            <SelectItem value="CS-003">CS-003</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-[#0F2A38] mb-1">
                        Report name{" "}
                        <span className="text-gray-400 text-sm">(Descriptive name)</span>
                    </label>
                    <Input
                        value={reportName}
                        onChange={(e) => setReportName(e.target.value)}
                        className="w-full bg-white border border-gray-300 rounded-md"
                    />
                </div>

                <Button
                    className="w-full bg-[#0F2A38] text-white"
                    onClick={handleGenerate}
                >
                    Generate report
                </Button>
            </DialogContent>
        </Dialog>
    );
}

export default GenerateReportModal;
