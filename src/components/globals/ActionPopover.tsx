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
  farmId?: string;
  status?: string;
}

export function PopoverDemo({ farmId, status }: ActionProps) {
  const location = useLocation();
  const { pathname } = location;
  
  return (
    <Popover>
      <PopoverTrigger asChild>
        <MoreHorizontal className="relative text-black cursor-pointer" />
      </PopoverTrigger>
      <PopoverContent className="w-32 flex flex-col gap-2 absolute right-2">
        {pathname === "/view-farms" && (
          <>
            <ViewFarm farmId={farmId} />
            <EditFarm farmId={farmId} />
            <RemoveFarm farmId={farmId} />
          </>
        )}

        {pathname === "/view-harvests" && (
          <>
            <ViewHarvest harvestId={farmId} />
            {status !== "submitted" && (
              <>
                <EditHarvest harvestId={farmId} />
                <RemoveHarvest harvestId={farmId} />
              </>
            )}
          </>
        )}
      </PopoverContent>
    </Popover>
  );
}