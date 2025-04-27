import Footer from "@/components/globals/Footer";
import Header from "@/components/globals/exporter/Header";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LocateFixed } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const actions = [
  {
    name: (
      <Link to="/export-consignment" className="text-black/80 hover:none">
        Export Consignment
      </Link>
    ),
    description: "Begin exporting your lots",
    imageUrl: "/images/export-consignment.png",
  },
  // {
  //   name: <SubmitBatch />,
  //   description: "Share your batch for compliance review.",
  //   imageUrl: "/images/coffeebatch.png",
  // },

  {
    name: (
      <Link to="/confirm-consignment" className="text-black/80 hover:none">
        Mark as Delivered
      </Link>
    ),
    description: "confirm when lots are delivered",
    imageUrl: "/images/mak-delivered.png",
  },


  {
    name: (
      <Link to="/view-lots" className="text-black/80 hover:none">
        View Lots
      </Link>),
    description: "See and manage new deliveries",
    imageUrl: "/images/view-lots.png",
  },

  {
    name: "View Consignments",
    description: "See processors who work with you",
    imageUrl: "/images/view-consignment.png",
  },

  {
    name: "Reports",
    description: "Download summary reports",
    imageUrl: "/images/inspect.png",
  },

  // {
  //   name: (
  //     <Link to="/view-batch" className="text-black/80 hover:none">
  //       Batch History
  //     </Link>
  //   ),
  //   description: "View records of all submitted batches",
  //   imageUrl: "/images/history.png",
  // },
  // {
  //   name: (
  //     <Link to="/view-farms" className="text-black/80 hover:none">
  //       Farm Details
  //     </Link>
  //   ),
  //   description: "Review your farm location and data",
  //   imageUrl: "/images/farm-details.png",
  // },
  {
    name: "Help Center",
    description: "Resolve issues, learn EU compliance",
    imageUrl: "/images/help-center.png",
  },
];
function ExporterDashboardPage() {
  const navigate = useNavigate();
  return (
    <section
      className="min-h-screen"
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
                  Rahmah Akello
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
              <span>Kabarole, Uganda</span>
            </Button>
          </div>
        </div>

        {/* Metrics Summary Cards */}
        <div className="grid grid-cols-3 gap-4 mt-10">
          {/* Pending Delivery */}
          <div className="bg-white rounded-md p-6 shadow-sm flex items-center gap-4">
            <img src="/images/pending.png" alt="Pending Lots" className="w-10 h-10" />
            <div>
              <p className="text-sm text-[#5C6474]">Pending Delivery</p>
              <p className="text-xl font-semibold text-[#222222]">2 lots</p>
            </div>
          </div>

          {/* Delivered Lots */}
          <div className="bg-white rounded-md p-6 shadow-sm flex items-center gap-4">
            <img src="/images/delivered.png" alt="Delivered" className="w-10 h-10" />
            <div>
              <p className="text-sm text-[#5C6474]">Delivered </p>
              <p className="text-xl font-semibold text-[#222222]">10 lots</p>
            </div>
          </div>

          {/* Inspections Due */}
          <div className="bg-white rounded-md p-6 shadow-sm flex items-center gap-4">
            <img src="/images/exported.png" alt="Inspections Due" className="w-10 h-10" />
            <div>
              <p className="text-sm text-[#5C6474]">Exported</p>
              <p className="text-xl font-semibold text-[#222222]">3 consignments</p>
            </div>
          </div>
        </div>



        <section className="mt-16">
          <span className="font-semibold text-xl text-white ">
            Quick Actions
          </span>

          <div className="grid lg:grid-cols-3 gap-5 mt-5 mb-10">
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
        </section>
      </section>
      <section className="fixed bottom-0 w-full">
        <Footer />
      </section>
    </section>
  );
}

export default ExporterDashboardPage;
