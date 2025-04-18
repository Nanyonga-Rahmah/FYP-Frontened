import Header from "@/components/globals/ew/Header";
import Footer from "@/components/globals/Footer";
import { FarmerTableFilters, FarmerTableRows } from "@/components/ExtensionWorkers/FarmerTable";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LocateFixed } from "lucide-react";
import { useNavigate } from "react-router-dom";

function ApproveKYCPage() {
  const navigate = useNavigate();

  return (
    <section
      className="min-h-screen"
      style={{ background: "linear-gradient(to bottom, #112D3E 50%, #F6F9FF 50%)" }}
    >
      <Header />
      <section className="px-20 py-10">
        {/* Greeting & Location */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback>MN</AvatarFallback>
            </Avatar>
            <div>
              <span className="text-[#C0C9DDE5]">Greetings,</span>
              <br />
              <span className="font-semibold text-xl text-white">Julius Kayongo</span>
            </div>
          </div>
          <div>
            <Button
              className="bg-[#E7B35A] flex items-center gap-1 rounded-md px-2"
              onClick={() => navigate("/add-farm")}
            >
              <LocateFixed />
              <span>Makindye– Sabagabo</span>
            </Button>
          </div>
        </div>

        {/* Table title and filter bar side-by-side */}
        <div className="flex justify-between items-center mt-12 bg-[#112D3E] py-6 text-white">
          <h2 className="text-lg font-semibold">Farmers (5)</h2>
          <FarmerTableFilters />
        </div>

        {/* Table content */}
        <div className="border border-blue-400 border-t-0 rounded-b-md bg-white px-4 pb-4 pt-2 rounded-t-md border border-b-0">
          <FarmerTableRows />
        </div>
      </section>
      <section className="fixed bottom-0 w-full">
        <Footer />
      </section>
    </section>
  );
}

export default ApproveKYCPage;
