import { Link, useLocation } from "react-router-dom";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { MenuIcon } from "lucide-react";

export function SheetDemo() {
  const location = useLocation();
  const { pathname } = location;

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
    <Sheet>
      <SheetTrigger asChild>
        <MenuIcon className="text-white" />
      </SheetTrigger>
      <SheetContent side={'left'} className="h-[50vh]">
        <div className="flex flex-col  items-center gap-4">
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
      </SheetContent>
    </Sheet>
  );
}
