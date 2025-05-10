import Footer from "@/components/globals/Footer";
import Header from "@/components/globals/ew/Header";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LocateFixed } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "@/hooks/use-auth";
import useUserProfile from "@/hooks/use-profile";

const actions = [
  {
    name: (
      <Link to="/approve-kyc" className="text-black/80 hover:none">
        Approve Farmers
      </Link>
    ),
    description: "Review pending KYC submissions.",
    imageUrl: "/images/approve-farmer.png",
  },
  {
    name: (
      <Link to="/approve-farm" className="text-black/80 hover:none">
        Approval Farm
      </Link>
    ),
    description: "Review farm registrations for compliance",
    imageUrl: "/images/coffeeleaf.png",
  },
  {
    name: (
      <Link to="/approve-harvests" className="text-black/80 hover:none">
        Review Harvests
      </Link>
    ),
    description: "Check and approve submitted harvests",
    imageUrl: "/images/Check.png",
  },
  {
    name: "Start Inspection",
    description: "Conduct farm compliance inspections",
    imageUrl: "/images/reports.png",
  },
  {
    name: "Reports",
    description: "Download summary reports",
    imageUrl: "/images/inspect.png",
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
  const { profile } = useUserProfile(authToken);

  // Get initials for avatar
  const getInitials = (): string => {
    if (profile && profile.firstName && profile.lastName) {
      return `${profile.firstName.charAt(0)}${profile.lastName.charAt(0)}`;
    }
    return "JK"; // Fallback to default initials
  };

  return (
    <section
      className="min-h-screen"
      style={{
        background: "linear-gradient(to bottom, #112D3E 50%, #F6F9FF 50%)",
      }}
    >
      <Header />
      <section className="px-20 py-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="w-12 h-12">
              <AvatarFallback className="bg-gray-400 text-white font-bold">
                {getInitials()}
              </AvatarFallback>
            </Avatar>
            <div>
              <span className="text-[#C0C9DDE5]">Greetings,</span>
              <br />
              <span className="font-semibold text-xl text-white">
                {profile
                  ? `${profile.firstName} ${profile.lastName}`
                  : "Julius Kayongo"}
              </span>
            </div>
          </div>
          <div>
            <Button
              className="bg-[#E7B35A] flex items-center gap-1 rounded-md px-2"
              onClick={() => navigate("/add-farm")}
            >
              <LocateFixed />
              <span>{profile?.location || "Makindye–Sabagabo"}</span>
            </Button>
          </div>
        </div>

        {/* Metrics Summary Cards */}
        <div className="grid grid-cols-3 gap-4 mt-10">
          {/* Pending KYC */}
          <div className="bg-white rounded-md p-6 shadow-sm flex items-center gap-4">
            <img
              src="/images/pending-kyc.png"
              alt="Pending KYC"
              className="w-10 h-10"
            />
            <div>
              <p className="text-sm text-[#5C6474]">Pending KYC</p>
              <p className="text-xl font-semibold text-[#222222]">50 farmers</p>
            </div>
          </div>

          {/* Pending Farms */}
          <div className="bg-white rounded-md p-6 shadow-sm flex items-center gap-4">
            <img
              src="/images/pending-farms.png"
              alt="Pending Farms"
              className="w-10 h-10"
            />
            <div>
              <p className="text-sm text-[#5C6474]">Pending Farms</p>
              <p className="text-xl font-semibold text-[#222222]">
                30 registrations
              </p>
            </div>
          </div>

          {/* Inspections Due */}
          <div className="bg-white rounded-md p-6 shadow-sm flex items-center gap-4">
            <img
              src="/images/inspection-due.png"
              alt="Inspections Due"
              className="w-10 h-10"
            />
            <div>
              <p className="text-sm text-[#5C6474]">Inspections Due</p>
              <p className="text-xl font-semibold text-[#222222]">3 farms</p>
            </div>
          </div>
        </div>

        <section className="mt-16">
          <span className="font-semibold text-xl text-white">
            Quick Actions
          </span>
          <div className="grid lg:grid-cols-3 gap-5 mt-5 mb-10">
            {actions.map((action, index) => (
              <div
                key={index}
                className="bg-white flex flex-col items-center rounded-[10px] max-w-[370px] max-h-[237px] justify-center py-3 shadow-sm"
              >
                <div className="object-cover h-20 w-20 flex justify-center items-center">
                  <img src={action.imageUrl} alt={action.description} />
                </div>
                <span className="font-semibold text-xl text-[#222222]">
                  {action.name}
                </span>
                <span className="font-normal text-sm text-[#5C6474]">
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

export default DashboardPage;
