import { useNavigate } from "react-router-dom";
import { Footprints } from "lucide-react";
import { Button } from "../ui/button";

interface RegisterFarmProps {
  handlenext: () => void;
  onclose: () => void;
}
function RegisterFarm({ handlenext,onclose }: RegisterFarmProps) {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col justify-center items-center">
      <div className="flex items-center flex-col p-4 justify-center w-full rounded-md bg-[#FAFAFA]">
        <div className="w-[150px] h-[150px] rounded-full">
          <img
            src="/images/farm-image.png"
            alt="Farm"
            className="object-cover"
          />
        </div>
        <p className="text-[#585962] font-medium text-[15px]">Walk your farm’s perimeter to mark its location. </p>
      </div>

      <Button onClick={handlenext} className="w-full mt-3">
        <Footprints />
        Start Walking
      </Button>
      <Button
        variant={"outline"}
        className="border text-[#222222] w-full mt-3"
        onClick={() => {
          navigate("/dashboard");
          onclose(); 
        }}
      >
        Back to Dashboard
      </Button>
    </div>
  );
}

export default RegisterFarm;
