import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu";
  import { Button } from "@/components/ui/button";
  
  interface Props {
    onSelect: (type: string) => void;
  }
  
  function GenerateReportDropdown({ onSelect }: Props) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="bg-white text-[#0F2A38] border border-gray-300 rounded-md px-4 py-2 text-sm font-medium shadow-sm hover:bg-gray-100">
            Generate report
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[280px] mt-2 rounded-md shadow-lg p-2 space-y-1">
          <DropdownMenuItem
            onClick={() => onSelect("Due Diligence Statement")}
            className="flex flex-col items-start p-2 rounded hover:bg-gray-50 cursor-pointer"
          >
            <span className="text-sm text-[#0F2A38] font-medium">
              Due Diligence Statement
            </span>
            <span className="text-xs text-gray-500">
              (Required for EU compliance)
            </span>
          </DropdownMenuItem>
  
          <DropdownMenuItem
            onClick={() => onSelect("Deforestation assessment")}
            className="flex flex-col items-start p-2 rounded hover:bg-gray-50 cursor-pointer"
          >
            <span className="text-sm text-green-600 font-medium">
              Deforestation assessment
            </span>
            <span className="text-xs text-gray-500">(Check land usage)</span>
          </DropdownMenuItem>
  
          <DropdownMenuItem
            onClick={() => onSelect("Traceability report")}
            className="flex flex-col items-start p-2 rounded hover:bg-gray-50 cursor-pointer"
          >
            <span className="text-sm text-amber-500 font-medium">
              Traceability report
            </span>
            <span className="text-xs text-gray-500">
              (Overview of all activities performed)
            </span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
  
  export default GenerateReportDropdown;  