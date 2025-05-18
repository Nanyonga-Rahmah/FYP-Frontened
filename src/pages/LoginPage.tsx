import { LoginForm } from "@/components/forms/authforms/LogInForm";
import Logo from "@/components/globals/Logo";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/signup");
  };
  return (
    <div className="flex justify-center items-center min-h-screen ">
      <div className="border rounded-xl md:w-[500px]  w-[90vw]   flex flex-col justify-center items-center p-3 gap-2 bg-[#FFFFFF] border-[#F0F0F0]">
        <Logo />

        <span className="text-2xl font-bold text-[#222222]">Log in to continue</span>
        <LoginForm />

        <span className="text-sm font-normal text-[#202020]">
          Don’t have an account?
          <span onClick={handleClick} className="text-[#112D3E] cursor-pointer">
            Register Now
          </span>
        </span>
      </div>
    </div>
  );
}

export default LoginPage;
