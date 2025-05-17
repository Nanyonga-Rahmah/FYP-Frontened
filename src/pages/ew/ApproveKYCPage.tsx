import { useState, useEffect } from "react";
import Header from "@/components/globals/Header";
import Footer from "@/components/globals/Footer";
import {
  FarmerTableFilters,
  FarmerTableRows,
} from "@/components/ExtensionWorkers/tables/FarmerTable";
import { ExporterTableRows } from "@/components/ExtensionWorkers/tables/ExporterTable";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LocateFixed } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AllUsers } from "@/lib/routes";
import useAuth from "@/hooks/use-auth";
import useUserProfile from "@/hooks/use-profile";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProcessorTableRows } from "@/components/ExtensionWorkers/tables/ProcesssorTable";

type User = {
  _id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  role: string;
  kyc: {
    nationalIdNumber: string;
    nationalIdPhoto: string;
    passportSizePhoto: string;
    cooperativeLocation: string;
    status: string;
    submittedAt: string;
    processedAt?: string;
    adminNotes?: string;
    blockchainTxHash?: string;
  };
  blockchainAddress?: string;
  encryptedPrivateKey?: string;
  farmerInfo?: {
    cooperativeMembershipNumber?: string;
  };
  processorInfo?: {
    facilityName?: string;
    licenseNumber?: string;
  };
  exporterInfo?: {
    companyName?: string;
    licenseNumber?: string;
  };
};

function ApproveKYCPage() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalUsers, setTotalUsers] = useState(0);
  const { authToken } = useAuth();
  const { profile, loading: profileLoading } = useUserProfile(authToken);

  // Add role filter state
  const [selectedRole, setSelectedRole] = useState("farmer");

  // Get initials for avatar
  const getInitials = (): string => {
    if (profile && profile.firstName && profile.lastName) {
      return `${profile.firstName.charAt(0)}${profile.lastName.charAt(0)}`;
    }
    return "JK"; // Fallback to default initials
  };

  useEffect(() => {
    const fetchUsersData = async () => {
      try {
        setLoading(true);
        const response = await fetch(AllUsers, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        setUsers(data.users || []);

        // Initially filter by farmer role
        const initialFiltered = (data.users || []).filter(
          (user: User) => user.role === "farmer"
        );

        setFilteredUsers(initialFiltered);
        setTotalUsers(initialFiltered.length);
      } catch (error) {
        console.error("Error fetching users data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsersData();
  }, [authToken]);

  // Apply role filter when it changes
  useEffect(() => {
    const filteredByRole = users.filter((user) => user.role === selectedRole);
    setFilteredUsers(filteredByRole);
    setTotalUsers(filteredByRole.length);
  }, [selectedRole, users]);

  const handleFilter = ({
    search,
    status,
    startDate,
    endDate,
  }: {
    search: string;
    status: string;
    startDate: string;
    endDate: string;
  }) => {
    // First filter by selected role
    let results = users.filter((user) => user.role === selectedRole);

    if (search) {
      const searchLower = search.toLowerCase();
      results = results.filter(
        (user) =>
          `${user.firstName} ${user.lastName}`
            .toLowerCase()
            .includes(searchLower) ||
          user.email.toLowerCase().includes(searchLower) ||
          user.phone.includes(search) ||
          user.kyc.nationalIdNumber.includes(search) ||
          (user.processorInfo?.facilityName &&
            user.processorInfo.facilityName
              .toLowerCase()
              .includes(searchLower)) ||
          (user.exporterInfo?.companyName &&
            user.exporterInfo.companyName.toLowerCase().includes(searchLower))
      );
    }

    if (status && status !== "all") {
      results = results.filter(
        (user) => user.kyc.status.toLowerCase() === status.toLowerCase()
      );
    }

    if (startDate) {
      const start = new Date(startDate);
      results = results.filter(
        (user) => new Date(user.kyc.submittedAt) >= start
      );
    }

    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59);
      results = results.filter((user) => new Date(user.kyc.submittedAt) <= end);
    }

    setFilteredUsers(results);
    setTotalUsers(results.length);
  };

  const handleStatusUpdate = (
    userId: string,
    status: string,
    adminNotes: string
  ) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user._id === userId
          ? { ...user, kyc: { ...user.kyc, status, adminNotes } }
          : user
      )
    );

    setFilteredUsers((prevUsers) =>
      prevUsers.map((user) =>
        user._id === userId
          ? { ...user, kyc: { ...user.kyc, status, adminNotes } }
          : user
      )
    );
  };

  // Render user table based on selected role
  const renderUserTable = () => {
    if (loading) {
      return (
        <div className="text-center py-8">
          <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading data...</p>
        </div>
      );
    }

    if (filteredUsers.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500">
          No {selectedRole}s found matching your filters
        </div>
      );
    }

    switch (selectedRole) {
      case "farmer":
        return (
          <FarmerTableRows
            farmers={filteredUsers as any}
            onStatusUpdate={handleStatusUpdate}
          />
        );
      case "processor":
        return (
          <ProcessorTableRows
            processors={filteredUsers as any}
            onStatusUpdate={handleStatusUpdate}
          />
        );
      case "exporter":
        return (
          <ExporterTableRows
            exporters={filteredUsers as any}
            onStatusUpdate={handleStatusUpdate}
          />
        );
      default:
        return null;
    }
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
        {/* Greeting & Location */}
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
                {profileLoading
                  ? "Loading..."
                  : profile && profile.firstName
                    ? `${profile.firstName} ${profile.lastName}`
                    : "Julius Kayongo"}
              </span>
            </div>
          </div>
          <div>
            <Button
              className="bg-[#E7B35A] flex items-center gap-1 rounded-md px-2 text-white hover:bg-[#d9a34d]"
              onClick={() => navigate("/add-farm")}
            >
              <LocateFixed size={18} />
              <span>{profile?.location || "Makindye– Sabagabo"}</span>
            </Button>
          </div>
        </div>

        {/* Role Filter */}
        <div className="flex justify-end items-center mt-8">
          <Select value={selectedRole} onValueChange={setSelectedRole}>
            <SelectTrigger className="w-48 bg-white text-gray-800">
              <SelectValue placeholder="Select Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="farmer">Farmers</SelectItem>
              <SelectItem value="processor">Processors</SelectItem>
              <SelectItem value="exporter">Exporters</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex justify-between items-center mt-4 bg-[#112D3E] py-6 text-white px-4 rounded-t-md">
          <h2 className="text-lg font-semibold">
            {selectedRole === "farmer"
              ? "Farmers"
              : selectedRole === "processor"
                ? "Processors"
                : "Exporters"}
            ({totalUsers})
          </h2>

          <FarmerTableFilters onFilter={handleFilter} />
        </div>

        <div className="border-blue-400 border-t-0 rounded-b-md bg-white px-4 pb-4 pt-2 border border-b-0">
          {renderUserTable()}
        </div>
      </section>
      <section className="fixed bottom-0 w-full">
        <Footer />
      </section>
    </section>
  );
}

export default ApproveKYCPage;
