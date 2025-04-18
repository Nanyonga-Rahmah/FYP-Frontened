import { Button } from "@/components/ui/button";
import {  TriangleAlert } from "lucide-react";

function VerificationFailure() {
  return (
    <div className="flex items-center justify-center flex-col gap-1">
      <div className="rounded-full flex items-center justify-center bg-[#EE443F] p-2">
        <TriangleAlert className="text-white h-9 w-9 font-bold"  />
      </div>
      <p className="tetx-[#000000E5] text-2xl font-bold">
        This link is expired or already used.
      </p>
      <p className="font-normal text-[#838383]">
        Request a new verification link instead
      </p>
      <Button className="text-white font-semibold px-5 my-3 bg-[#112D3E]">
        Resend verification link
      </Button>
    </div>
  );
}

export default VerificationFailure;
