import { useState, useEffect } from "react";
import { MoreHorizontal, LocateFixed, Loader2 } from "lucide-react";
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
import useAuth from "@/hooks/use-auth";
import useUserProfile from "@/hooks/use-profile";
import axios from "axios";
import { API_URL } from "@/lib/routes";

// Define TypeScript interfaces
interface Farmer {
  id: string;
  name: string;
  phone: string;
  email: string;
  location: string;
  membershipNumber?: string;
}

interface FarmersResponse {
  success: boolean;
  count: number;
  totalPages: number;
  currentPage: number;
  users: Farmer[];
}


function ViewFarmersPage(): JSX.Element {
  const { authToken } = useAuth();
  const { profile } = useUserProfile(authToken);

  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Fetch farmers data from API
  useEffect(() => {
    const fetchFarmers = async (): Promise<void> => {
      try {
        setLoading(true);
        const response = await axios.get<FarmersResponse>(
          `${API_URL}user/role/farmer?page=${currentPage}&limit=10${searchTerm ? `&search=${searchTerm}` : ""}`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );

        if (response.data.success) {
          setFarmers(response.data.users);
          setTotalPages(response.data.totalPages);
        } else {
          setError("Failed to fetch farmers data");
        }
      } catch (err) {
        setError(
          (err as Error).message || "An error occurred while fetching farmers"
        );
        console.error("Error fetching farmers:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFarmers();
  }, [authToken, currentPage, searchTerm]);

  const getInitials = (): string => {
    if (profile && profile.firstName && profile.lastName) {
      return `${profile.firstName.charAt(0)}${profile.lastName.charAt(0)}`;
    }
    return "BO";
  };

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
              <AvatarFallback className="bg-gray-400 text-white font-bold">
                {getInitials()}
              </AvatarFallback>
            </Avatar>
            <div>
              <span className="text-[#C0C9DDE5] text-sm">Greetings,</span>
              <br />
              <span className="font-semibold text-xl text-white">
                {profile
                  ? `${profile.firstName} ${profile.lastName}`
                  : "Brian Opio"}
              </span>
            </div>
          </div>

          {/* Processor Info */}
          <div>
            <Button className="bg-[#E7B35A] flex flex-col rounded-md px-2 text-white">
              <span>ABC Coffee Processing Ltd</span>
              <div className="flex items-center">
                <LocateFixed className="h-4 w-4" />
                <span>Kabarole, Uganda</span>
              </div>
            </Button>
          </div>
        </div>

        {/* Title and Actions */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-white">
            Farmers ({farmers.length})
          </h1>

          <div className="flex gap-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
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
              Filter
            </Button>
          </div>
        </div>

        {/* Farmers Table */}
        <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-10 w-10 text-gray-400 animate-spin" />
              <span className="ml-2 text-gray-500">Loading farmers...</span>
            </div>
          ) : error ? (
            <div className="flex justify-center items-center py-20">
              <p className="text-red-500">{error}</p>
            </div>
          ) : farmers.length === 0 ? (
            <div className="flex justify-center items-center py-20">
              <p className="text-gray-500">No farmers found</p>
            </div>
          ) : (
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
                    Location
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-600">
                    Membership Number
                  </th>
                  <th className="py-3 px-4"></th>
                </tr>
              </thead>
              <tbody>
                {farmers.map((farmer) => (
                  <tr
                    key={farmer.id}
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
                    <td className="py-1 px-4">{farmer.location}</td>
                    <td className="py-1 px-4">
                      {farmer.membershipNumber || "N/A"}
                    </td>
                    <td className="py-1 px-4">
                      <Popover>
                        <PopoverTrigger>
                          <MoreHorizontal className="h-4 w-4" />
                        </PopoverTrigger>
                        <PopoverContent className="w-32 p-2">
                          <FarmerDetailsModal farmerId={farmer.id} />
                        </PopoverContent>
                      </Popover>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-center gap-10 text-gray-500 text-sm mt-6">
          <div>
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              className="border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              ← Previous
            </Button>
            <Button
              variant="default"
              disabled={currentPage >= totalPages}
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              className="bg-[#E7B35A] text-white hover:bg-[#d6a64e]"
            >
              Next →
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </section>
  );
}

export default ViewFarmersPage;
