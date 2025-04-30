import { useState, useEffect } from "react";
import Header from "@/components/globals/exporter/Header";
import Footer from "@/components/globals/Footer";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CalendarIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useAuth from "@/hooks/use-auth";
import { API_URL } from "@/lib/routes";

interface Consignment {
  id: string;
  lotDetails: string;
  submittedDate: string;
  status: "Exported";
}

function ConsignmentPage() {
  const navigate = useNavigate();
  const [consignments, setConsignments] = useState<Consignment[]>([]);
  const [filteredConsignments, setFilteredConsignments] = useState<
    Consignment[]
  >([]);
  const setLoading = useState(true)[1];
  const [searchTerm, setSearchTerm] = useState("");
  const {authToken} = useAuth()

  useEffect(() => {
    const fetchConsignments = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}exporter/consignments`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`
          },
        });

        const data = await response.json();
        if (response.ok) {
          const parsed: Consignment[] = data.map((item: any) => ({
            id: item.id,
            lotDetails: item.lotDetails,
            submittedDate: new Date(item.submittedDate).toLocaleDateString(
              "en-US",
              {
                month: "short",
                day: "numeric",
                year: "numeric",
              }
            ),
            status: item.status,
          }));
          setConsignments(parsed);
          setFilteredConsignments(parsed);
        } else {
          console.error("Failed to fetch consignments:", data.error);
        }
      } catch (err) {
        console.error("Error fetching consignments:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchConsignments();
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    setFilteredConsignments(
      consignments.filter(
        (item) =>
          item.id.toLowerCase().includes(term.toLowerCase()) ||
          item.lotDetails.toLowerCase().includes(term.toLowerCase())
      )
    );
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
            <Avatar>
              <AvatarFallback>MN</AvatarFallback>
            </Avatar>
            <div>
              <span className="text-[#C0C9DDE5]">Greetings,</span>
              <br />
              <span className="font-semibold text-xl text-white">
                Mary Nantongo
              </span>
            </div>
          </div>
          <Button className="bg-[#F7A144] rounded-md px-4 text-white">
            + Export Consignment
          </Button>
        </div>

        <div className="rounded-t-md mt-12 pt-12">
          <div className="flex justify-between items-center px-6 pt-6">
            <h2 className="text-white text-xl font-semibold">
              Consignment History
            </h2>
            <div className="flex items-center gap-3">
              <Input
                placeholder="Search"
                value={searchTerm}
                onChange={handleSearchChange}
                className="bg-[#0F2A38] text-white w-48 border border-gray-300 rounded-md px-3 py-2"
              />
              <Button
                variant="outline"
                className="bg-[#0F2A38] text-white border border-gray-300 rounded-md flex items-center gap-2 px-4"
              >
                <CalendarIcon className="w-4 h-4" />
                11 Nov - 12 Nov
              </Button>
            </div>
          </div>
        </div>

        <div className="px-6 pt-10">
          <div className="grid grid-cols-3 gap-6">
            {filteredConsignments.map((item, idx) => (
              <div
                key={idx}
                className="bg-white rounded-lg border border-gray-200 shadow-sm p-5 flex flex-col gap-4"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm text-black">
                    {item.id}
                  </span>
                  <span className="px-3 py-1 text-white rounded-full text-xs font-semibold bg-[#6F42C1C9]">
                    Exported
                  </span>
                </div>
                <div className="text-sm flex flex-col gap-1 text-gray-700">
                  <p className="flex items-center gap-2">
                    <img
                      src="/images/arabica.png"
                      alt="Lots"
                      className="w-4 h-4"
                    />
                    {item.lotDetails}
                  </p>
                  <p className="flex items-center gap-2">
                    <img
                      src="/images/calendar.png"
                      alt="Calendar"
                      className="w-4 h-4"
                    />
                    Submitted: {item.submittedDate}
                  </p>
                </div>
                <Button
                  variant="outline"
                  className="w-full border border-gray-300 text-[#0F2A38]"
                  onClick={() =>
                    navigate(`/view-consignment-details/${item.id}`)
                  }
                >
                  View Details
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="fixed bottom-0 w-full">
        <Footer />
      </section>
    </section>
  );
}

export default ConsignmentPage;
