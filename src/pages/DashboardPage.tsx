import { SubmitBatch } from "@/components/Farmers/SubmitHarvest";
import Footer from "@/components/globals/Footer";
import Header from "@/components/globals/Header";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LocateFixed, Loader2, Info, FileWarning } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "@/hooks/use-auth";
import useUserProfile from "@/hooks/use-profile";
import { getInitials } from "@/lib/constants";
import useFarmData from "@/hooks/FarmHook";

const actions = [
  {
    name: (
      <Link to="/view-harvests" className="text-black/80 hover:none">
        Record Harvest
      </Link>
    ),
    description: "Add details about your harvest.",
    imageUrl: "/images/record-harvest.png",
  },
  {
    name: <SubmitBatch />,
    description: "Share your batch for compliance review.",
    imageUrl: "/images/coffeebatch.png",
  },
  {
    name: "Reports",
    description: "Download summary reports.",
    imageUrl: "/images/reports.png",
  },
  {
    name: (
      <Link to="/view-batch" className="text-black/80 hover:none">
        Batch History
      </Link>
    ),
    description: "View records of all submitted batches",
    imageUrl: "/images/history.png",
  },
  {
    name: (
      <Link to="/view-farms" className="text-black/80 hover:none">
        Farm Details
      </Link>
    ),
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
  const navigate = useNavigate();
  const { authToken } = useAuth();
  const { profile, loading: isLoading } = useUserProfile(authToken);
  const farmId = localStorage.getItem("FarmId") || "";
  const { farm } = useFarmData(farmId);

  console.log(farm);

  return (
    <section
      className="min-h-screen"
      style={{
        background: "linear-gradient(to bottom, #112D3E 50%, #F6F9FF 50%)",
      }}
    >
      {" "}
      <Header />
      <section className="lg:px-[5vw] px-[4vw] py-10">
        <div className="flex flex-col lg:pt-[5vh] gap-5 lg:flex-row lg:items-center lg:justify-between ">
          <div className="flex items-center gap-3">
            <Avatar className="w-12 h-12">
              {isLoading ? (
                <AvatarFallback className="bg-gray-400 text-white font-bold">
                  <Loader2 className="h-5 w-5 animate-spin text-white" />
                </AvatarFallback>
              ) : (
                <AvatarFallback className="bg-gray-400 text-white font-bold capitalize">
                  {getInitials(profile)}
                </AvatarFallback>
              )}
            </Avatar>
            <div className="flex">
              <div>
               
                <span className="text-[#C0C9DDE5]">Greetings,</span>
                <br />
                <span className="font-semibold text-xl text-white">
                  {isLoading ? (
                    <span className="inline-block w-32 h-6 bg-gray-300 animate-pulse rounded"></span>
                  ) : profile ? (
                    `${profile.firstName} ${profile.lastName}`
                  ) : (
                    "Mary Nantongo"
                  )}
                </span>
              </div>
            </div>
          </div>

          <div>
            <Button
              className="bg-[#E7B35A] flex items-center gap-1 rounded-md px-2 w-full text-white"
              onClick={() => {
                navigate("/add-farm");
              }}
            >
              <LocateFixed />
              <span>Add Farm location</span>
            </Button>
          </div>
        </div>
        {farm?.status === "pending" && (
          <div className="flex items-center gap-1 bg-[#FFF8EA] border rounded-md py-2 text-sm  lg:w-[70%] font-medium px-3 mt-10 text-[#A56D00] border-dashed border-[#E7B35A]">
            <Info />
            <span>
              Your farm submission is being reviewed. This may take up to 1-2
              days. You will be notified once the process is
              complnserevw101@gmail.comete.
            </span>
          </div>
        )}

        {farm?.status === "rejected" && (
          <div className="flex items-center gap-1 bg-[#FFF8F6] border rounded-md py-2 text-sm lg:w-[70%] font-medium px-3 mt-10 text-[#D32527] border-dashed border-[#EE443F]">
            <FileWarning />
            <span>
              Your farm submission was rejected. Please review the submission
              details and try again.
            </span>
          </div>
        )}

        <section className="mt-16 lg:mt-[20vh]">
          <span className="font-semibold text-xl text-white ">
            Quick Actions
          </span>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-5 mt-5 mb-10">
            {actions.map((action, index) => {
              const isDisabled =
                (farm?.status === "pending" || farm?.status === "rejected") &&
                action.description !== "Review your farm location and data" &&
                action.name !== "Help Center";

              return (
                <div
                  key={index}
                  aria-disabled={isDisabled}
                  className={`bg-white flex flex-col items-center px-3 text-center rounded-[5px] lg:rounded-[10px] lg:max-w-[40vw] max-h-[30vh] justify-center py-3 shadow-sm ${
                    isDisabled
                      ? "pointer-events-none text-opacity-50 opacity-40"
                      : ""
                  }`}
                >
                  <div className="object-cover h-20 w-20 flex justify-center items-center">
                    <img src={action.imageUrl} alt={action.description} />
                  </div>
                  <span className="font-semibold text-xl text-[#222222]">
                    {action.name}
                  </span>
                  <span className="font-normal tetx-sm text-[#5C6474]">
                    {action.description}
                  </span>
                </div>
              );
            })}
          </div>
        </section>
      </section>
      <section className="fixed bottom-0 w-full">
        <Footer />
      </section>
    </section>
  );
}
export default DashboardPage;
