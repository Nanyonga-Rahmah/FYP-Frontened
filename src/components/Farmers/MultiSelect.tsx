import React, { useState } from "react";
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
} from "@/components/ui/command"; // Ensure the Command component is available from ShadCN or your project
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
interface MultiSelectProps {
  options: string[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  label: string;
}

const MultiSelect: React.FC<MultiSelectProps> = ({
  options,
  selectedValues,
  onChange,
  label,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSelection = (value: string) => {
    const updatedValues = selectedValues.includes(value)
      ? selectedValues.filter((item) => item !== value)
      : [...selectedValues, value];
    onChange(updatedValues);
  };

  const handleButtonClick = (e: React.MouseEvent) => {
    // Prevent form submission behavior
    e.preventDefault();
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative">
      <label className="block text-[#222222] text-sm font-semibold mb-2">
        {label}
      </label>
      <Button
        variant="outline"
        className="w-full justify-start"
        onClick={handleButtonClick}
      >
        {selectedValues.length > 0
          ? selectedValues.join(", ")
          : "Select options"}

        {selectedValues.length === 0 && <ChevronDown className="ml-auto" />}
      </Button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-2 bg-white border border-gray-300 shadow-lg rounded-md">
          <Command>
            <CommandInput placeholder="Search varieties..." />
            <CommandList>
              {options.map((option, index) => (
                <CommandItem
                  key={index}
                  onSelect={() => toggleSelection(option)}
                  className={`p-2 cursor-pointer hover:bg-gray-200 ${
                    selectedValues.includes(option) ? "bg-gray-100" : ""
                  }`}
                >
                  {option}
                  {selectedValues.includes(option) && (
                    <span className="ml-auto text-green-600">Selected</span>
                  )}
                </CommandItem>
              ))}
            </CommandList>
          </Command>
        </div>
      )}
    </div>
  );
};

export default MultiSelect;
