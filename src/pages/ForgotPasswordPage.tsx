import { ForgotPasswordForm } from "@/components/forms/authforms/ForgotPasswordForm";
import Logo from "@/components/globals/Logo";

import { useNavigate } from "react-router-dom";

function ForgotPasswordPage() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/login");
  };
  return (
    <div className="flex justify-center items-center min-h-screen  ">
      <div className="border rounded-xl xl:w-[432px] w-[90vw]  flex flex-col justify-center items-center p-3 gap-2 bg-[#FFFFFF] border-[#F0F0F0]">
        <Logo />

        <span className="text-2xl font-bold text-[#222222]">Forgot password</span>
        <ForgotPasswordForm />

        <span className="text-sm font-normal text-[#202020]">
          Remember password?
          <span onClick={handleClick} className="text-[#112D3E] cursor-pointer">
            Log In
          </span>
        </span>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;
