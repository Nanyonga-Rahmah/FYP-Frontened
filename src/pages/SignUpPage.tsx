import KYCForms from "@/components/forms/authforms/KYCForms";
import { SignUpForm } from "@/components/forms/authforms/SignUpForm";
import Logo from "@/components/globals/Logo";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Progress } from "@/components/ui/progress";
import { z } from "zod";

const SignUpSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  role: z.string(),
  email: z.string().email(),
  phone: z.string(),
  password: z.string(),
  nationalIdNumber: z.string().optional(),
  cooperativeMembershipNumber: z.string().optional(),
  cooperativeLocation: z.string().optional(),
  companyName: z.string().optional(),
  facilityName: z.string().optional(),
  licenseNumber: z.string().optional(),
});

type SignUpData = z.infer<typeof SignUpSchema>;

function SignUpPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [signUpData, setSignUpData] = useState<SignUpData | null>(null);
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/login");
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      {currentStep === 1 && (
        <div className="border rounded-xl flex flex-col xl:w-[560px] w-[98vw] px-5  py-3 gap-2 bg-[#FFFFFF] border-[#F0F0F0]">
          <div className="flex flex-col items-center justify-center">
            <Logo />
            <span className="text-2xl font-bold text-[#222222]">
              Signup to get started
            </span>
          </div>
          <div className="flex justify-between gap-4">
            <Progress value={100} />
            <Progress value={0} />
          </div>
          <SignUpForm
            onNext={(data) => {
              setSignUpData(data);
              setCurrentStep(2);
            }}
          />
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
        <div className="border rounded-xl flex flex-col  xl:w-[560px] px-5 w-[98vw] py-3 gap-2 bg-[#FFFFFF] border-[#F0F0F0]">
          <div className="flex flex-col items-center justify-center">
            <Logo />
            <span className="text-2xl font-bold text-center text-[#222222]">
              Complete your KYC
            </span>
          </div>
          <span className="text-sm font-medium text-center text-[#222222]">
            We need to verify your identity. Submit now and wait for approval.
          </span>
          <div className="flex justify-between gap-5 w-full">
            <Progress value={100} />
            <Progress value={100} />
          </div>

          <KYCForms
            handlePrevious={() => setCurrentStep(1)}
            signUpData={signUpData!}
          />
        </div>
      )}
    </div>
  );
}

export default SignUpPage;
