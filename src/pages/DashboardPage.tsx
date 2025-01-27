import Footer from "@/components/globals/Footer";
import Header from "@/components/globals/Header";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LocateFixed } from "lucide-react";

const actions = [
  {
    name: "Record Harvest",
    description: "Add details about your harvest.",
    imageUrl: "/images/record-harvest.png",
  },
  {
    name: "Submit Coffee Batch",
    description: "Share your batch for compliance review.",
    imageUrl: "/images/coffeebatch.png",
  },
  {
    name: "Reports",
    description: "Download summary reports.",
    imageUrl: "/images/reports.png",
  },

  {
    name: "Batch History",
    description: "View records of all submitted batches",
    imageUrl: "/images/history.png",
  },
  {
    name: "Farm Details",
    description: "Review your farm location and data",
    imageUrl: "/images/farm-details.png",
  },
  {
    name: "Help Center",
    description: "Resolve issues, learn EU compliance",
    imageUrl: "/images/help-center.png",
  },
];
function DashboardPage() {
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
            <Button className="bg-[#E7B35A] flex items-center gap-1 rounded-md px-2">
              <LocateFixed />
              <span>Add Farm location</span>
            </Button>
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
                className="bg-white flex flex-col items-center rounded-[10px] justify-center py-3 shadow-sm"
              >
                <div className="object-cover h-16 w-16 ">
                  <img src={action.imageUrl} alt={action.name} />
                </div>
                <span className="font-semibold tetx-xl">{action.name}</span>
                <span className="font-normal tetx-sm text-[#5C6474]">
                  {action.description}
                </span>
              </div>
            ))}
          </div>
        </section>
      </section>
      <Footer />
    </section>
  );
}

export default DashboardPage;
