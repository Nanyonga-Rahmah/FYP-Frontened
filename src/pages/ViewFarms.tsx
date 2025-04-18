import { PopoverDemo } from "@/components/globals/ActionPopover";

import Footer from "@/components/globals/Footer";
import Header from "@/components/globals/Header";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import { LocateFixed, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const farms = [
  {
    name: "Green Valley Coffee Farm",
    location: "Mbale , Uganda",
    size: "25 Hecters",
  },
  {
    name: "Green Valley Coffee Farm",
    location: "Mbale , Uganda",
    size: "25 Hecters",
  },
  {
    name: "Green Valley Coffee Farm",
    location: "Mbale , Uganda",
    size: "25 Hecters",
  },
];

export const getRandomColor = () => {
  const colors = ["#E7B35A", "#EE443F", "#0C5FA0"];
  return colors[Math.floor(Math.random() * colors.length)];
};

function ViewFarmsPage() {
  const navigate = useNavigate();
  return (
    <section
      className="h-screen"
      style={{
        background: "linear-gradient(to bottom, #112D3E 50%, #F6F9FF 50%)",
      }}
    >
      {" "}
      <Header />
      <section className="px-20 py-10">
        <div className="flex items-center justify-between ">
          <div className="flex items-center gap-3">
            <Avatar>
              {/* <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" /> */}
              <AvatarFallback>MN</AvatarFallback>
            </Avatar>
            <div className="flex">
              <div>
                <span className="text-[#C0C9DDE5]">Greetings,</span>
                <br />
                <span className="font-semibold text-xl text-white">
                  Mary Nantongo
                </span>
              </div>
            </div>
          </div>

          <div>
            <Button
              className="bg-[#E7B35A] flex items-center gap-1 rounded-md px-2"
              onClick={() => {
                navigate("/add-farm");
              }}
            >
              <LocateFixed />
              <span>Add Farm location</span>
            </Button>
          </div>
        </div>

        <section className="mt-16">
          <span className="font-semibold text-xl text-white ">My Farms</span>

          <div className="grid lg:grid-cols-3 gap-5 mt-5 mb-10">
            {farms.map((action, index) => (
              <div
                key={index}
                className="bg-white flex flex-col max-w-[370px] max-h-[237px]  rounded-[10px] py-1  px-3 shadow-sm"
              >
                <div className="flex justify-end">
                  <PopoverDemo />
                </div>
                <div className="flex flex-col items-center py-3">
                  <div className="">
                    <MapPin size={60} color="#fffafa" fill={getRandomColor()} />
                  </div>
                  <span className="font-semibold tetx-xl text-[#222222]">
                    {action.name}
                  </span>
                  <span className="font-normal tetx-sm flex items-center gap-1 text-[#5C6474]">
                    <span>
                      <MapPin size={10} />
                    </span>
                    {action.location}
                  </span>

                  <span className="font-normal tetx-sm text-[#5C6474]">
                    {action.size}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </section>
      <section className="bottom-0 fixed w-full">
        <Footer />
      </section>
    </section>
  );
}

export default ViewFarmsPage;
