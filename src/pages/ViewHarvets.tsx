import { PopoverDemo } from "@/components/globals/ActionPopover";

import { AddHarvest } from "@/components/Farmers/AddHarvest";
import Footer from "@/components/globals/Footer";
import Header from "@/components/globals/Header";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import { Calendar1, MapPin, Sprout } from "lucide-react";

const harvests = [
  {
    name: "HRV-001",
    location: "Mbale , Uganda",
    size: "25 Hecters",
    status: "Not submitted",
    date: "Nov 20,2026",
    type: "Arabica",
  },
  {
    name: "HRV-001",
    location: "Mbale , Uganda",
    size: "25 Hecters",
    status: "submitted",
    date: "Nov 20,2026",
    type: "Arabica",
  },
  {
    name: "HRV-001",
    location: "Mbale , Uganda",
    size: "25 Hecters",
    status: "Not submitted",
    date: "Nov 20,2026",
    type: "Arabica",
  },
];

export const checkBadgeStatus = (status: string) => {
  if (status === "submitted") {
    return "bg-[#43B75D] , text-white";
  } else if (status === "pending") {
    return "bg-red-700";
  } else {
    return "bg-[#D9D9D9] , text-[#656565]";
  }
};
function ViewHarvestsPage() {
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
        </div>

        <section className="mt-16">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-xl text-white ">
              Harvest records
            </span>

            <div>
              <AddHarvest />
            </div>
          </div>
          <div className="grid lg:grid-cols-3 gap-5 mt-5 mb-10">
            {harvests.map((action, index) => (
              <div
                key={index}
                className="bg-white flex flex-col max-w-[370px] max-h-[237px]  rounded-[10px] py-1  px-3 shadow-sm"
              >
                <div className="flex justify-end">
                  <PopoverDemo status={action.status}  />
                </div>
                <div className="flex flex-col py-2.5 ">
                  <div className="flex items-center gap-4">
                    <span className="font-semibold tetx-xl  text-black  ">{action.name}</span>

                    <span
                      className={`px-2 py-1 text-xs rounded-3xl ${checkBadgeStatus(action.status)} `}
                    >
                      {action.status}
                    </span>
                  </div>

                  <div className="flex items-center my-1 gap-1 text-black">
                    <span>
                      <Sprout size={16} />
                    </span>
                    <span>{action.type} (100kg)</span>
                  </div>
                  <span className="font-normal tetx-sm flex items-center gap-1 text-[#5C6474]">
                    <span>
                      <MapPin size={10} />
                    </span>
                    {action.location}({" "}
                    <span className="font-normal tetx-sm text-[#5C6474]">
                      {action.size}
                    </span>
                    )
                  </span>

                  <div className="flex items-center gap-1">
                    <span>
                      <Calendar1 size={15} />
                    </span>
                    <span className="text-[#838383]">Harvested:</span>
                    <span className="text-[#202020]">{action.date}</span>
                  </div>
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

export default ViewHarvestsPage;
