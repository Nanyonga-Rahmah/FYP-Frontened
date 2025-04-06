import { AddFarmForm } from "../forms/farmerforms/AddFarmForm";
import { X } from "lucide-react";
import { useState } from "react";
import RegisterFarm from "./RegisterFarm";
import FarmMap from "./FarmMap";

export function AddFarm() {
  const [open, setOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const handleClose = () => {
    setOpen(false);
  };

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 3));
  };
  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };


  return (
    <div
      className={` min-h-screen flex flex-col bg-white ${currentStep !== 2 && "px-20 py-10"} `}
    >
      {currentStep === 2 && <FarmMap currentStep={2} handleNext={handleNext} />}

      {currentStep !== 2 && (
        <div className="flex   justify-end">
          <X className="h-10 w-10 text-black" />
        </div>
      )}
      {currentStep !== 2 && (
        <div className="flex items-center justify-center my-10">
          <div className="flex flex-col items-center justify-center border border-[#F0F0F0] rounded-lg px-6 py-2 ">
            <div className="flex flex-col gap-4 my-3">
              <h3 className="text-center text-[#222222] font-bold text-xl">
                Register your farm
              </h3>

              {currentStep === 1 && (
                <p className="text-center text-[#838383] text-xs">
                  Step 1/3 - Start
                </p>
              )}

              {currentStep === 3 && (
                <p className="text-center text-[#838383] text-xs">
                  Step 3/3 - Farm details
                </p>
              )}

              <div className="flex justify-center gap-2 w-full">
                {[1, 2, 3].map((step) => (
                  <div
                    key={step}
                    className={`h-2 flex-1 rounded-full ${
                      currentStep >= step ? "bg-[#112D3E]" : "bg-gray-400"
                    }`}
                  />
                ))}
              </div>

              {currentStep === 1 && (
                <RegisterFarm handlenext={handleNext} onclose={handleClose} />
              )}

              {currentStep === 3 && <AddFarmForm handlePrevious={handlePrevious} />}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
