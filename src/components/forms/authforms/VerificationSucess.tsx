import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useNavigate } from "react-router-dom";

function VerificationSucess() {
  const navigate = useNavigate();

  const HandleClick = () => {
    navigate("/login");
  };
  return (
    <div className="flex items-center justify-center flex-col gap-1">
      <div className="rounded-full flex items-center justify-center p-2 bg-[#43B75D]">
        <Check className="text-white h-9 w-9 font-bold" />
      </div>
      <p className="font-bold text-[#222222] text-2xl">
        Your account has been successfully verified!
      </p>
      <p className="text-[#838383] font-normal text-sm">
        You can now log in to your account
      </p>
      <Button className="px-6 my-3 bg-[#112D3E]" onClick={HandleClick}>
        Login
      </Button>
    </div>
  );
}

export default VerificationSucess;
