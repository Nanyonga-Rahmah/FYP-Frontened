import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { MoreHorizontal } from "lucide-react";
import { RemoveFarm } from "../Farmers/RemoveFarm";
import { EditFarm } from "../Farmers/EditFarm";
import { ViewFarm } from "../Farmers/ViewFarm";
import { useLocation } from "react-router-dom";
import { ViewHarvest } from "../Farmers/ViewHarvest";
import { EditHarvest } from "../Farmers/EditHarvest";
import { RemoveHarvest } from "../Farmers/RemoveHarvest";

interface ActionProps {
  status?: string;
}

export function PopoverDemo({ status }: ActionProps) {
  const location = useLocation();
  const { pathname } = location;
  return (
    <Popover>
      <PopoverTrigger asChild>
        <MoreHorizontal className="relative" />
      </PopoverTrigger>
      <PopoverContent className="w-32 flex flex-col gap-2 absolute right-2">
        {pathname === "/view-farms" && (
          <>
            <ViewFarm />
            <EditFarm />
            <RemoveFarm />
          </>
        )}

        {pathname === "/view-harvests" && (
          <>
            <ViewHarvest />
            {status !== "submitted" && (
              <>
                <EditHarvest />
                <RemoveHarvest />
              </>
            )}
          </>
        )}
      </PopoverContent>
    </Popover>
  );
}
