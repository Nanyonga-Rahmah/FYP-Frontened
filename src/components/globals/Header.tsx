import { Link, useLocation, useNavigate } from "react-router-dom";

import { Bell, Search } from "lucide-react";
import { PopoverDemo } from "./ActionsPopOver";

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { pathname } = location;

  const handleClick = () => {
    if (pathname === "/dashboard") {
      navigate("/dashboard");
    } else if (pathname.startsWith("/processor")) {
      navigate("/processor-dashboard");
    } else if (pathname.startsWith("/ew")) {
      navigate("/ew-dashboard");
    } else {
      navigate("/");
    }
  };

  const getLinkClasses = (path: string) => {
    return pathname === path
      ? "text-white font-semibold"
      : "text-[#C0C9DD] hover:text-white";
  };

  // Helper: detect if processor routes
  const isProcessorPage =
    pathname.startsWith("/processor") ||
    pathname === "/processor-dashboard" ||
    pathname === "/consignment";

  return (
    <header className="flex items-center justify-between border-b py-2.5 px-8 border-[#485165]">
      {/* Logo and App Name */}
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

      {/* Center Section: Navigation Links */}
      <div className="flex items-center gap-6">
        {!isProcessorPage ? (
          // Normal User Navigation
          <>
            <Link to="/dashboard" className={getLinkClasses("/dashboard")}>
              Home
            </Link>
            <Link
              to="/view-harvests"
              className={getLinkClasses("/view-harvests")}
            >
              Harvests
            </Link>
            <Link to="/view-batch" className={getLinkClasses("/view-batch")}>
              Coffee Batch
            </Link>
            <Link to="/support" className={getLinkClasses("/support")}>
              Support
            </Link>
          </>
        ) : (
          // Processor Navigation
          <>
            <Link
              to="/processor-dashboard"
              className={getLinkClasses("/processor-dashboard")}
            >
              Home
            </Link>
            <Link
              to="/processor/view-batchs"
              className={getLinkClasses("/processor/view-batchs")}
            >
              Coffee Batch
            </Link>
            <Link
              to="/processor/view-lots"
              className={getLinkClasses("/processor/view-lots")}
            >
              Lots
            </Link>
            <Link to="/support" className={getLinkClasses("/support")}>
              Support
            </Link>
          </>
        )}
      </div>

      {/* Right Section: Search, Notifications, Avatar */}
      <div className="flex items-center gap-3">
        {/* Only show Search and Notifications on dashboard (normal user) */}
        {pathname === "/dashboard" && (
          <>
            <Search className="h-4 w-4 text-white" />
            <Bell className="h-4 w-4 text-white" />
          </>
        )}

        {/* Always show Avatar */}
        <PopoverDemo/>
      
      </div>
    </header>
  );
}

export default Header;
