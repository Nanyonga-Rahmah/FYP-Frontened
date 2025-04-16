import { Link } from "react-router-dom";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bell, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
function Header() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/");
  };
  return (
    <header className="flex items-center justify-between border-b py-2.5 px-8 border-[#485165]">
      <div
        className="flex items-center gap-2 cursor-pointer"
        onClick={handleClick}
      >
        <div className="h-5 w-5 object-cover">
          <img src="/logos/header-logo.png" alt="Coffee" />
        </div>
        <span className="text-xl font-extrabold text-white mb-2">
          coffichain
        </span>
      </div>

      <div className="flex items-center gap-3">
        <Link to="/ew-dashboard" className="text-[#C0C9DD]">
          Home
        </Link>
        <Link to="/kyc-approvals" className="text-[#C0C9DD]">
          KYC Approvals
        </Link>
        <Link to="/farm-approvals" className="text-[#C0C9DD]">
          Farm Approvals
        </Link>
        <Link to="/farmers" className="text-[#C0C9DD]">
          Farmers
        </Link>
        <Link to="/support" className="text-[#C0C9DD]">
          Support
        </Link>
      </div>

      <div className="flex items-center gap-3">
        <Search className="h-4 w-4 text-white" />

        <Bell className="h-4 w-4 text-white" />
        <Avatar className="h-7 w-7 text-sm">
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}

export default Header;
