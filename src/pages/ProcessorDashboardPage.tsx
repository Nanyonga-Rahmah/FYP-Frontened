import { SubmitBatch } from "@/components/Farmers/SubmitHarvest";
import Footer from "@/components/globals/Footer";
import Header from "@/components/globals/Header";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LocateFixed, Sprout } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const actions = [
  {
    name: "Start Processing",
    description: "Begin processing your batches.",
    imageUrl: "/images/processing.png",
  },
  {
    name: <SubmitBatch />,
    description: "Confirm when batches are delivered.",
    imageUrl: "/images/delivered.png",
  },
  {
    name: "Submit Consignment",
    description: "Share your processed batches for export.",
    imageUrl: "/images/growth.png",
  },

  {
    name: (
      <Link to="/view-batch" className="text-black/80 hover:none">
        View Farms
      </Link>
    ),
    description: "See farmers who work with you",
    imageUrl: "/images/view-farmers.png",
  },
  {
    name: (
      <Link to="/view-farms" className="text-black/80 hover:none">
        Reports
      </Link>
    ),
    description: "Download summary reports",
    imageUrl: "/images/reports.png",
  },
  {
    name: "Help Center",
    description: "Resolve issues, learn EU compliance",
    imageUrl: "/images/help-center.png",
  },
];
function ProcessorDashboardPage() {
  const navigate = useNavigate();
  return (
    <section
      className="min-h-screen"
      //   style={{
      //     background: "linear-gradient(to bottom, #112D3E 50%, #F6F9FF 50%)",
      //   }}
    >
      {" "}
      <div className="bg-[#112D3E]">
        <Header />
        <div className="px-20 py-10 h-[40vh] flex flex-col  ">
          <div className="flex items-center justify-between ">
            <div className="flex items-center gap-3">
              <Avatar>
                {/* <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" /> */}
                <AvatarFallback>BO</AvatarFallback>
              </Avatar>
              <div className="flex">
                <div>
                  <span className="text-[#C0C9DDE5]">Greetings,</span>
                  <br />
                  <span className="font-semibold text-xl text-white">
                    Brian Opio
                  </span>
                </div>
              </div>
            </div>

            <div>
              <Button
                className="bg-[#E7B35A] flex flex-col rounded-md px-2"
                onClick={() => {
                  navigate("/add-farm");
                }}
              >
                <span>ABC Coffee Processing Ltd</span>

                <div className="flex items-center">
                  <LocateFixed />
                  <span>Kabarole, Uganda</span>
                </div>
              </Button>
            </div>
          </div>
          <div className="rounded-md bg-white grid grid-cols-3 mx-40 my-5">
            <div className="flex flex-col  border-r py-3 px-5">
              <div className="flex items-center gap-1">
                <div className="rounded-full bg-[#43B75D]  p-1">
                <Sprout className="text-white h-4 w-4" />
                </div>
                <span>Pending Delivery</span>
              </div>
              <span className="font-semibold text-[#09090B] mx-8">2 batches</span>
            </div>
            <div className="flex flex-col  border-r py-3 px-5">
              <div className="flex items-center gap-1">
                <div className="rounded-full bg-[#1A8DF9] p-1">
                  <Sprout className="text-white h-4 w-4" />
                </div>
                <span>Delivered</span>
              </div>
              <span className="font-semibold text-[#09090B] mx-8">2 batches</span>
            </div>
            <div className="flex flex-col  py-3 px-5">
              <div className="flex items-center gap-1">
                <div className="rounded-full bg-[#E67E22]  p-1">
                <Sprout className="text-white h-4 w-4" />
                </div>
                <span>Processed</span>
              </div>
              <span className="font-semibold text-[#09090B] mx-8">2 batches</span>
            </div>
          </div>

          <div className="flex flex-col justify-end h-40 ">
            <span className="font-semibold text-xl  text-white ">
              Quick Actions
            </span>
          </div>
        </div>
      </div>
      <div className="grid lg:grid-cols-3 px-20 py-5 gap-5 bg-[#F6F9FF] ">
        {actions.map((action, index) => (
          <div
            key={index}
            className="bg-white flex flex-col items-center rounded-[10px] max-w-[370px] max-h-[237px] justify-center py-3 shadow-sm"
          >
            <div className="object-cover h-20 w-20  flex justify-center items-center  ">
              <img src={action.imageUrl} alt={action.description} />
            </div>
            <span className="font-semibold text-xl text-[#222222]">
              {action.name}
            </span>
            <span className="font-normal tetx-sm text-[#5C6474]">
              {action.description}
            </span>
          </div>
        ))}
      </div>
      <section className="w-full">
        <Footer />
      </section>
    </section>
  );
}

export default ProcessorDashboardPage;
