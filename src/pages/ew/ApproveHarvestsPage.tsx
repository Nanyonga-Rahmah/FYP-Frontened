import Header from "@/components/globals/ew/Header";
import Footer from "@/components/globals/Footer";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LocateFixed } from "lucide-react";
import HarvestsTable from "@/components/ExtensionWorkers/tables/HarvestsTable";

function ApproveHarvestsPage() {
   

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
                    <Button className="bg-[#E7B35A] flex items-center gap-1 rounded-md px-2">
                        <LocateFixed />
                        <span>Makindye– Sabagabo</span>
                    </Button>
                </div>

                {/* Tabs and Filter */}
                <div className="bg-[#112D3E] rounded-t-md mt-12">
                    <div className="flex justify-between items-center px-6 py-5 border-b border-[#2E4653]">
                        <div className="flex gap-10 text-white text-sm font-medium">
                            <span className="border-b-2 border-[#E7B35A] pb-2">Harvests (5)</span>
                            <span className="text-[#C0C9DDE5]">Requests (0)</span>
                        </div>
                        <HarvestsTable.Filters />
                    </div>

                    {/* Table */}
                    <div className="border border-blue-400 rounded-t-md border-t-0 rounded-b-md bg-white px-4 pb-4 pt-2">
                        <HarvestsTable.Rows />
                    </div>
                </div>
            </section>
            <section className="fixed bottom-0 w-full">
                <Footer />
            </section>    </section>
    );
}

export default ApproveHarvestsPage;
