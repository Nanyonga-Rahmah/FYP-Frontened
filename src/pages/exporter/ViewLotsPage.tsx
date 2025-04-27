import { useState, useEffect } from "react";
import Header from "@/components/globals/exporter/Header";
import Footer from "@/components/globals/Footer";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LocateFixed } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { CalendarIcon} from "lucide-react";
// import useAuth from "@/hooks/use-auth";

interface Lot {
    id: string;
    type: string;
    processor: string;
    submittedDate: string;
    status: "Submitted" | "Delivered" | "Exported";
}

function ViewLotsPage() {
    const navigate = useNavigate();
    const [lots, setLots] = useState<Lot[]>([]);
    const [filteredLots, setFilteredLots] = useState<Lot[]>([]);
    const setLoading = useState(true)[1];  // Only use the setter function
    const [activeTab, setActiveTab] = useState("All");
    const [searchTerm, setSearchTerm] = useState("");
    // const { authToken } = useAuth();

    useEffect(() => {
        const fetchLots = async () => {
            try {
                setLoading(true);
                const dummyLots: Lot[] = [
                    { id: "LT-001", type: "Arabica, Robusta (100 kg)", processor: "Green Coffee Processors", submittedDate: "Nov 30, 2026", status: "Submitted" },
                    { id: "LT-001", type: "Arabica, Robusta (100 kg)", processor: "Green Coffee Processors", submittedDate: "Nov 30, 2026", status: "Delivered" },
                    { id: "LT-001", type: "Arabica, Robusta (100 kg)", processor: "Green Coffee Processors", submittedDate: "Nov 30, 2026", status: "Submitted" },
                    { id: "LT-001", type: "Arabica, Robusta (100 kg)", processor: "Green Coffee Processors", submittedDate: "Nov 30, 2026", status: "Exported" },
                    { id: "LT-001", type: "Arabica, Robusta (100 kg)", processor: "Green Coffee Processors", submittedDate: "Nov 30, 2026", status: "Delivered" },
                    { id: "LT-001", type: "Arabica, Robusta (100 kg)", processor: "Green Coffee Processors", submittedDate: "Nov 30, 2026", status: "Exported" },
                ];

                setLots(dummyLots);
                setFilteredLots(dummyLots);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchLots();
    }, []);

    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
        if (tab === "All") {
            setFilteredLots(lots);
        } else {
            setFilteredLots(lots.filter((lot) => lot.status === tab));
        }
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const term = e.target.value;
        setSearchTerm(term);
        setFilteredLots(
            lots.filter(
                (lot) =>
                    lot.id.toLowerCase().includes(term.toLowerCase()) ||
                    lot.type.toLowerCase().includes(term.toLowerCase()) ||
                    lot.processor.toLowerCase().includes(term.toLowerCase())
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
                {/* GREETING */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Avatar>
                            <AvatarFallback>RA</AvatarFallback>
                        </Avatar>
                        <div>
                            <span className="text-[#C0C9DDE5]">Greetings,</span>
                            <br />
                            <span className="font-semibold text-xl text-white">
                                Rahmah Akello
                            </span>
                        </div>
                    </div>
                    <div>
                        <Button
                            className="bg-[#E7B35A] flex items-center gap-1 rounded-md px-2"
                            onClick={() => navigate("/add-farm")}
                        >
                            <LocateFixed />
                            <span>ABC Coffee Exporters</span>
                        </Button>
                    </div>
                </div>

                {/* TABS + SEARCH */}
                <div className="rounded-t-md mt-12">
                    <div className="flex justify-between items-center px-6 pt-6">
                        <h2 className="text-white text-xl font-semibold">Lot History</h2>
                        <div className="flex items-center gap-3">
                            <Input
                                placeholder="Search"
                                value={searchTerm}
                                onChange={handleSearchChange}
                                className="bg-[#0F2A38]  text-white w-48 border border-gray-300 rounded-md px-3 py-2"
                            />
                            <Button
                                variant="outline"
                                className="bg-[#0F2A38]  text-white border border-gray-300 rounded-md flex items-center gap-2 px-4"
                            >
                                <CalendarIcon className="w-4 h-4" />
                                11 Nov - 12 Nov
                            </Button>
                        </div>
                    </div>

                    {/* TABS */}
                    <div className="flex gap-8 text-white text-sm font-medium px-6 mt-6">
                        {["All", "Delivered", "Submitted", "Exported"].map((tab) => (
                            <button
                                key={tab}
                                className={`pb-3 ${activeTab === tab
                                    ? "border-b-2 border-[#0F2A38] text-black bg-white"
                                    : "text-white bg-transparent"
                                    }`}
                                onClick={() => handleTabChange(tab)}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                {/* LOT CARDS */}
                <div className="px-6 pt-10">
                    <div className="grid grid-cols-3 gap-6">
                        {filteredLots.map((lot, idx) => (
                            <div
                                key={idx}
                                className="bg-white rounded-lg border border-gray-200 shadow-sm p-5 flex flex-col gap-4"
                            >
                                <div className="flex items-center justify-between">
                                    <span className="font-semibold text-sm text-black">{lot.id}</span>
                                    <span
                                        className={`px-3 py-1 text-white rounded-full text-xs font-semibold ${lot.status === "Submitted"
                                            ? "bg-[#43B75D] "
                                            : lot.status === "Delivered"
                                                ? "bg-[#1A8DF9] "
                                                : "bg-[#6F42C1C9]"
                                            }`}
                                    >
                                        {lot.status}
                                    </span>
                                </div>
                                <div className="text-sm flex flex-col gap-1">
                                    <p className="flex items-center gap-2 text-gray-700">
                                        <img src="/images/arabica.png" alt="Location" className="w-4 h-4" />
                                        {lot.type}
                                    </p>
                                    <p className="flex items-center gap-2 text-gray-700">
                                        <img src="/images/user.png" alt="Processor" className="w-4 h-4" />
                                        Processor: {lot.processor}
                                    </p>
                                    <p className="flex items-center gap-2 text-gray-700">
                                        <img src="/images/calendar.png" alt="Submitted Date" className="w-4 h-4" />
                                        Submitted: {lot.submittedDate}
                                    </p>
                                </div>

                                {lot.status === "Submitted" ? (
                                    <Button
                                        variant="outline"
                                        className="w-full border border-gray-300 text-[#0F2A38]"
                                    >
                                        Mark Delivered
                                    </Button>
                                ) : (
                                    <Button
  variant="outline"
  className="w-full border border-gray-300 text-[#0F2A38]"
  onClick={() => navigate(`/view-lot-details/${lot.id}`)}
>
  View Details
</Button>

                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <section className="fixed bottom-0 w-full">
                <Footer />
            </section>
        </section>
    );
}

export default ViewLotsPage;
