import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import useAuth from "@/hooks/use-auth";
import useUserProfile from "@/hooks/use-profile";
import { getInitials } from "@/lib/constants";
import { LogOut, Settings, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function PopoverDemo() {
  const { authToken } = useAuth();
  const { profile, loading: isLoading } = useUserProfile(authToken);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("Token");
    localStorage.removeItem("userData");
    localStorage.removeItem("user");

    setTimeout(() => {
      navigate("/login", { replace: true });
    }, 1000); // Simulate a delay for logout
    // Implement your logout logic here
  };
  return (
    <Popover>
      <PopoverTrigger asChild className="cursor-pointer relative">
        <Avatar className="h-7 w-7 text-sm">
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </PopoverTrigger>

      {isLoading ? (
        ""
      ) : (
        <>
          <PopoverContent className="mt-4 w-44 space-y-1 -right-4 absolute px-0">
            <div className=" border-b border-b-slate-200 pb-2 flex items-center gap-2 px-2">
              <Avatar>
                <AvatarFallback className="bg-gray-400 text-white text-sm  font-bold capitalize">
                  {getInitials(profile)}
                </AvatarFallback>
              </Avatar>

              <div className="flex flex-col text-[13px]">
                <span className="capitalize">
                  {profile && profile.firstName + " " + profile.lastName}
                </span>
                <span className="capitalize">{profile && profile.role}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 px-2 py-1">
              <User className="h-4 w-4" />
              <span className="text-sm font-medium leading-none">
                My Account
              </span>
            </div>
            <div className="flex items-center gap-2 px-2">
              <Settings className="h-4 w-4" />
              <span className="text-sm font-medium leading-none">Settings</span>
            </div>

            <div
              className="flex items-center gap-2 px-2 py-1 cursor-pointer"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              <span className="text-sm font-medium leading-none text-destructive">
                Logout
              </span>
            </div>
          </PopoverContent>
        </>
      )}
    </Popover>
  );
}
