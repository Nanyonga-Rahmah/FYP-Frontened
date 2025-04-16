import ExporterKYCForms from "@/components/forms/authforms/ExtensionWorker/KYCForms";
import { ExporterSignUpForm } from "@/components/forms/authforms/ExtensionWorker/SignUpForm";
import Logo from "@/components/globals/Logo";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Progress } from "@/components/ui/progress";
import { z } from "zod";

// Match schema used in ExporterSignUpForm
const SignUpSchema = z.object({
  fullName: z
    .string()
    .min(2, { message: "Full name is required." })
    .regex(/^[a-zA-Z\s'-]+$/, {
      message: "Full name can only contain letters, spaces, apostrophes, and hyphens.",
    }),
  role: z.string().min(2, { message: "Role is required." }),
  email: z.string().min(2, { message: "Email is required." }).email(),
  phone: z.string(),
  password: z.string().min(2, { message: "Password is required." }),
  maaifEmpId: z.string().min(2, { message: "MAAIF Id Number is required." }),
  location: z.string().nonempty({ message: "Location is required." }),
});

type SignUpData = z.infer<typeof SignUpSchema>;

function ExporterSignUpPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [signUpData, setSignUpData] = useState<SignUpData | null>(null);
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/login");
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      {currentStep === 1 && (
        <div className="border rounded-xl flex flex-col xl:w-[560px] w-[90vw] p-3 gap-2 bg-[#FFFFFF] border-[#F0F0F0]">
          <div className="flex flex-col items-center justify-center">
            <Logo />
            <span className="text-2xl font-bold text-[#222222]">
              Sign up to get started
            </span>
          </div>
          <div className="flex justify-between gap-4">
            <Progress value={100} />
            <Progress value={0} />
          </div>
          <ExporterSignUpForm
            onNext={(data) => {
              setSignUpData(data);
              setCurrentStep(2);
            }}
          />
          <span className="text-sm font-normal text-[#202020] text-center">
            Already have an account?{" "}
            <span
              onClick={handleClick}
              className="text-[#112D3E] cursor-pointer font-medium"
            >
              Log In
            </span>
          </span>
        </div>
      )}

      {currentStep === 2 && signUpData && (
        <div className="border rounded-xl flex flex-col items-center justify-center xl:w-[560px] w-[90vw] p-3 gap-2 bg-[#FFFFFF] border-[#F0F0F0]">
          <div className="flex flex-col items-center justify-center">
            <Logo />
            <span className="text-2xl font-bold text-center text-[#222222]">
              Complete your KYC
            </span>
          </div>
          <span className="text-sm font-medium text-[#222222]">
            We need to verify your identity. Submit now and wait for approval.
          </span>
          <div className="flex justify-between gap-5 w-full">
            <Progress value={100} />
            <Progress value={100} />
          </div>
          <ExporterKYCForms
            handlePrevious={() => setCurrentStep(1)}
            signUpData={signUpData}
          />
        </div>
      )}
    </div>
  );
}

export default ExporterSignUpPage;
