import { useState } from "react";
import { MoreHorizontal, LocateFixed } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Header from "@/components/globals/Header";
import Footer from "@/components/globals/Footer";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { FarmerDetailsModal } from "@/components/Processor/ViewFarmer";

function ViewFarmersPage() {
  const [farmers] = useState([
    {
      name: "Mary Nantongo",
      phone: "+25671234567",
      email: "mary12@gmail.com",
      subcounty: "Makindye-Ssabagabo",
      farms: "Green Coffee farm, XYZ Farm",
    },
    {
      name: "Mary Nantongo",
      phone: "+25671234567",
      email: "mary12@gmail.com",
      subcounty: "Makindye-Ssabagabo",
      farms: "Green Coffee farm, XYZ Farm",
    },
    {
      name: "Mary Nantongo",
      phone: "+25671234567",
      email: "mary12@gmail.com",
      subcounty: "Makindye-Ssabagabo",
      farms: "Green Coffee farm, XYZ Farm",
    },
    {
      name: "Mary Nantongo",
      phone: "+25671234567",
      email: "mary12@gmail.com",
      subcounty: "Makindye-Ssabagabo",
      farms: "Green Coffee farm, XYZ Farm",
    },
    {
      name: "Mary Nantongo",
      phone: "+25671234567",
      email: "mary12@gmail.com",
      subcounty: "Makindye-Ssabagabo",
      farms: "Green Coffee farm, XYZ Farm",
    },
  ]);

  return (
    <section
      className="min-h-screen flex flex-col"
      style={{
        background: "linear-gradient(to bottom, #112D3E 45%, #F6F9FF 45%)",
      }}
    >
      <Header />

      {/* Top Section */}
      <div className="px-4 md:px-10 lg:px-20 py-10 flex-grow">
        <div className="flex items-center justify-between mb-10">
          {/* Greeting */}
          <div className="flex items-center gap-3">
            <Avatar className="w-12 h-12">
              <AvatarFallback className="text-xl">BO</AvatarFallback>
            </Avatar>
            <div>
              <span className="text-[#C0C9DDE5] text-sm">Greetings,</span>
              <br />
              <span className="font-semibold text-xl text-white">
                Brian Opio
              </span>
            </div>
          </div>

          {/* Processor Info */}
          <div className="bg-[#E7B35A] flex flex-col rounded-md text-white py-1 px-2">
            <span>ABC Coffee Processing Ltd</span>
            <div className="flex items-center">
              <LocateFixed className="h-4 w-4" />
              <span>Kabarole, Uganda</span>
            </div>
          </div>
        </div>

        {/* Title and Actions */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-white">Farmers (5)</h1>

          <div className="flex gap-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Search"
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm w-64 focus:outline-none"
              />
              <svg
                className="w-4 h-4 absolute top-3 left-3 text-gray-400"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1116.65 16.65z"
                />
              </svg>
            </div>

            <Button
              variant="outline"
              className="flex items-center gap-2 rounded-lg border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              11 Nov - 12 Nov
            </Button>
          </div>
        </div>

        {/* Farmers Table */}
        <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left py-3 px-4 font-semibold text-gray-600">
                  Name
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-600">
                  Contacts
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-600">
                  Subcounty
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-600">
                  Farms
                </th>
                <th className="py-3 px-4"></th>
              </tr>
            </thead>
            <tbody>
              {farmers.map((farmer, idx) => (
                <tr
                  key={idx}
                  className="border-t hover:bg-gray-50 transition-colors"
                >
                  <td className="py-1 px-4">{farmer.name}</td>
                  <td className="py-1 px-4">
                    <div className="flex flex-col">
                      <span>{farmer.phone}</span>
                      <span className="text-xs text-gray-500">
                        {farmer.email}
                      </span>
                    </div>
                  </td>
                  <td className=" py-1 px-4">{farmer.subcounty}</td>
                  <td className="py-1 px-4">{farmer.farms}</td>
                  <td className=" py-1 px-4">
                    <Popover>
                      <PopoverTrigger>
                        <MoreHorizontal className="h-4 w-4" />
                      </PopoverTrigger>
                      <PopoverContent className="w-32 p-2">
                        <FarmerDetailsModal />
                      </PopoverContent>
                    </Popover>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-center gap-10 text-gray-500 text-sm mt-6">
          <div>Page 1 of 50</div>
          <Button
            variant="default"
            className="bg-[#E7B35A] text-white hover:bg-[#d6a64e]"
          >
            Next Page →
          </Button>
        </div>
      </div>

      <Footer />
    </section>
  );
}
export default ViewFarmersPage;
