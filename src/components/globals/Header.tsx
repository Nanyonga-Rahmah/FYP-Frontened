import { Link, useLocation, useNavigate } from "react-router-dom";
import { Bell, Search } from "lucide-react";
import { PopoverDemo } from "./ActionsPopOver";
import { SheetDemo } from "./MobileNav";

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;

  // Get role from stored user object
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const role = user?.role;

  const handleClick = () => {
    if (role === "processor") navigate("/processor-dashboard");
    else if (role === "admin") navigate("/ew-dashboard");
    else if (role === "exporter") navigate("/exporter-dashboard");
    else if (role === "farmer") navigate("/dashboard");
    else navigate("/");
  };

  const getLinkClasses = (path: string) =>
    pathname === path ? "text-white font-semibold" : "text-[#C0C9DD] hover:text-white";

  return (
    <header className="flex items-center justify-between border-b py-2.5 px-8 border-[#485165]">
      {/* Mobile toggle */}
      <div className="flex md:hidden">
        <SheetDemo />
      </div>

      {/* Logo + click home */}
      <div className="flex items-center gap-2 cursor-pointer" onClick={handleClick}>
        <div className="h-5 w-5 object-cover">
          <img src="/logos/header-logo.png" alt="Coffee" />
        </div>
        <span className="text-xl font-extrabold text-white mb-2">coffichain</span>
      </div>

      {/* Center Nav Links */}
      <div className="hidden md:flex items-center gap-6">
        {role === "farmer" && (
          <>
            <Link to="/dashboard" className={getLinkClasses("/dashboard")}>Home</Link>
            <Link to="/view-harvests" className={getLinkClasses("/view-harvests")}>Harvests</Link>
            <Link to="/view-batch" className={getLinkClasses("/view-batch")}>Coffee Batch</Link>
            <Link to="/support" className={getLinkClasses("/support")}>Support</Link>
          </>
        )}

        {role === "processor" && (
          <>
            <Link to="/processor-dashboard" className={getLinkClasses("/processor-dashboard")}>Home</Link>
            <Link to="/processor/view-batchs" className={getLinkClasses("/processor/view-batchs")}>Coffee Batch</Link>
            <Link to="/processor/view-lots" className={getLinkClasses("/processor/view-lots")}>Lots</Link>
            <Link to="/support" className={getLinkClasses("/support")}>Support</Link>
          </>
        )}

        {role === "exporter" && (
          <>
            <Link to="/exporter-dashboard" className={getLinkClasses("/exporter-dashboard")}>Home</Link>
            <Link to="/view-lots" className={getLinkClasses("/view-coffeelot")}>CoffeeLot</Link>
            <Link to="/view-consignment" className={getLinkClasses("/consignment")}>Consignment</Link>
            <Link to="/support" className={getLinkClasses("/support")}>Support</Link>
          </>
        )}

        {(role === "admin") && (
          <>
            <Link to="/ew-dashboard" className={getLinkClasses("/ew-dashboard")}>Home</Link>
            <Link to="/approve-kyc" className={getLinkClasses("/approve-kyc")}>KYC Approvals</Link>
            <Link to="/approve-farms" className={getLinkClasses("/approve-farms")}>Farm Approvals</Link>
            <Link to="/farmers" className={getLinkClasses("/farmers")}>Farmers</Link>
            <Link to="/support" className={getLinkClasses("/support")}>Support</Link>
          </>
        )}
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3">
        {pathname === "/dashboard" && (
          <>
            <Search className="h-4 w-4 text-white" />
            <Bell className="h-4 w-4 text-white" />
          </>
        )}
        <PopoverDemo />
      </div>
    </header>
  );
}

export default Header;
