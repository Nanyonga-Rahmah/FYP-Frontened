import KYCForms from "@/components/forms/authforms/KYCForms";
import { SignUpForm } from "@/components/forms/authforms/SignUpForm";
import Logo from "@/components/globals/Logo";
import { useState } from "react";

import { useNavigate } from "react-router-dom";
import { Progress } from "@/components/ui/progress";

function SignUpPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate();

  const HandleNextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const HandlePreviousStep = () => {
    setCurrentStep(1);
  };

  const handleClick = () => {
    navigate("/login");
  };
  return (
    <div className="flex justify-center items-center min-h-screen ">
      {currentStep === 1 && (
        <div className="border  rounded-xl flex flex-col xl:w-[560px] w-[90vw]   p-3 gap-2 bg-[#FFFFFF] border-[#F0F0F0]">
          <div className="flex flex-col items-center justify-center">
            {" "}
            <Logo />
            <span className="text-2xl font-bold text-[#222222]">
              Signup to get started
            </span>
          </div>

          <div className="flex justify-between gap-4">
            <Progress value={100} />
            <Progress value={0} />
          </div>

          <SignUpForm handleNext={HandleNextStep} />

          <span className="text-sm font-normal text-[#202020] text-center">
            Already have an account?
            <span
              onClick={handleClick}
              className="text-[#112D3E] cursor-pointer"
            >
              Log In
            </span>
          </span>
        </div>
      )}

      {currentStep === 2 && (
        <div className="border  rounded-xl flex flex-col xl:w-[560px] w-[90vw]   p-3 gap-2 bg-[#FFFFFF] border-[#F0F0F0]">
          <div className="flex flex-col items-center justify-center">
            {" "}
            <Logo />
            <span className="text-2xl font-bold text-center text-[#222222]">
              Complete your KYC
            </span>
          </div>

          <span className="text-base font-normal text-[#222222]">
            We need to verify your identity. Submit now and wait for approval.
          </span>

          <div className="flex justify-between gap-5">
            <Progress value={100} />
            <Progress value={100} />
          </div>

          <KYCForms handlePrevious={HandlePreviousStep} />
        </div>
      )}
    </div>
  );
}

export default SignUpPage;
