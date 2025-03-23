import { SignUpForm } from "@/components/forms/authforms/SignUpForm";
import Logo from "@/components/globals/Logo";

import { useNavigate } from "react-router-dom";

function SignUpPage() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/login");
  };
  return (
    <div className="flex justify-center items-center min-h-screen ">
      <div className="border  rounded-xl flex flex-col justify-center items-center p-3 gap-2 bg-[#FFFFFF] border-[#F0F0F0]">
        <Logo />

        <span className="text-2xl font-bold #222222">Signup to get started</span>
        <SignUpForm />

        <span className="text-sm font-normal text-[#202020]">
          Already have an account?
          <span onClick={handleClick} className="text-[#112D3E] cursor-pointer">
            Log In
          </span>
        </span>
      </div>
    </div>
  );
}

export default SignUpPage;
