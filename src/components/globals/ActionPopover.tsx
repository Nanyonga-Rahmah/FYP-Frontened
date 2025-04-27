import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { MoreVertical } from "lucide-react";
import { RemoveFarm } from "../Farmers/RemoveFarm";
import { EditFarm } from "../Farmers/EditFarm";
import { ViewFarm } from "../Farmers/ViewFarm";
import { useLocation } from "react-router-dom";
import { ViewHarvest } from "../Farmers/ViewHarvest";
import { EditHarvest } from "../Farmers/EditHarvest";
import { RemoveHarvest } from "../Farmers/RemoveHarvest";

interface ActionProps {
  farmId?: string;
  status?: string;
}

export function PopoverDemo({ farmId, status }: ActionProps) {
  const location = useLocation();
  const { pathname } = location;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <MoreVertical className="relative text-black cursor-pointer" />
      </PopoverTrigger>
      <PopoverContent className="w-44 flex flex-col gap-2 absolute right-2">
        {pathname === "/view-farms" && (
          <>
            <ViewFarm />
            <EditFarm />
            <span>Transfer Ownership</span>
            <RemoveFarm />
          </>
        )}

        {pathname === "/view-harvests" && (
          <>
            <ViewHarvest harvestId={farmId} />
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
