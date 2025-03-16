import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { MoreHorizontal } from "lucide-react";
import { RemoveFarm } from "./RemoveFarm";
import { EditFarm } from "./EditFarm";
import { ViewFarm } from "./ViewFarm";
import { useLocation } from "react-router-dom";
import { ViewHarvest } from "./ViewHarvest";
import { EditHarvest } from "./EditHarvest";
import { RemoveHarvest } from "./RemoveHarvest";

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
