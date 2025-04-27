import { useState, useEffect } from "react";
import Header from "@/components/globals/ew/Header";
import Footer from "@/components/globals/Footer";
import {
  FarmerTableFilters,
  FarmerTableRows,
} from "@/components/ExtensionWorkers/tables/FarmerTable";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LocateFixed } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AllUsers } from "@/lib/routes";

type Farmer = {
  _id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  cooperativeMembershipNumber?: string;
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
  role: string;
};

function ApproveKYCPage() {
  const navigate = useNavigate();
  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [filteredFarmers, setFilteredFarmers] = useState<Farmer[]>([]);
  const [loading, setLoading] = useState(true);
  const [adminInfo, setAdminInfo] = useState({
    firstName: "Julius",
    lastName: "Kayongo",
    location: "Makindye– Sabagabo",
  });
  const [totalFarmers, setTotalFarmers] = useState(0);

  useEffect(() => {
    const fetchFarmersData = async () => {
      try {
        setLoading(true);
        const response = await fetch(AllUsers);

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        const farmerUsers = data.users.filter(
          (user: Farmer) => user.role === "farmer"
        );

        setFarmers(farmerUsers);
        setAdminInfo(data)
        setFilteredFarmers(farmerUsers);
        setTotalFarmers(farmerUsers.length);

        // try {
        //   const profileResponse = await fetch("/api/admin/profile");
        //   if (profileResponse.ok) {
        //     const profileData = await profileResponse.json();
        //     if (profileData && profileData.admin) {
        //       setAdminInfo({
        //         firstName: profileData.admin.firstName,
        //         lastName: profileData.admin.lastName,
        //         location: profileData.admin.location || "Makindye– Sabagabo",
        //       });
        //     }
        //   }
        // } catch (profileError) {
        //   console.error("Error fetching admin profile:", profileError);
        // }
      } catch (error) {
        console.error("Error fetching farmers data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFarmersData();
  }, []);

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
    let results = [...farmers];

    if (search) {
      const searchLower = search.toLowerCase();
      results = results.filter(
        (farmer) =>
          `${farmer.firstName} ${farmer.lastName}`
            .toLowerCase()
            .includes(searchLower) ||
          farmer.email.toLowerCase().includes(searchLower) ||
          farmer.phone.includes(search) ||
          farmer.kyc.nationalIdNumber.includes(search)
      );
    }

    if (status) {
      results = results.filter(
        (farmer) => farmer.kyc.status.toLowerCase() === status.toLowerCase()
      );
    }

    if (startDate) {
      const start = new Date(startDate);
      results = results.filter(
        (farmer) => new Date(farmer.kyc.submittedAt) >= start
      );
    }

    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59);
      results = results.filter(
        (farmer) => new Date(farmer.kyc.submittedAt) <= end
      );
    }

    setFilteredFarmers(results);
  };

  const handleStatusUpdate = (
    userId: string,
    status: string,
    adminNotes: string
  ) => {
    setFarmers((prevFarmers) =>
      prevFarmers.map((farmer) =>
        farmer._id === userId
          ? { ...farmer, kyc: { ...farmer.kyc, status, adminNotes } }
          : farmer
      )
    );

    setFilteredFarmers((prevFarmers) =>
      prevFarmers.map((farmer) =>
        farmer._id === userId
          ? { ...farmer, kyc: { ...farmer.kyc, status, adminNotes } }
          : farmer
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
        {/* Greeting & Location */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback>{`${adminInfo.firstName.charAt(0)}${adminInfo.lastName.charAt(0)}`}</AvatarFallback>
            </Avatar>
            <div>
              <span className="text-[#C0C9DDE5]">Greetings,</span>
              <br />
              <span className="font-semibold text-xl text-white">{`${adminInfo.firstName} ${adminInfo.lastName}`}</span>
            </div>
          </div>
          <div>
            <Button
              className="bg-[#E7B35A] flex items-center gap-1 rounded-md px-2"
              onClick={() => navigate("/add-farm")}
            >
              <LocateFixed />
              <span>{adminInfo.location}</span>
            </Button>
          </div>
        </div>

        <div className="flex justify-between items-center mt-12 bg-[#112D3E] py-6 text-white">
          <h2 className="text-lg font-semibold">Farmers ({totalFarmers})</h2>
          <FarmerTableFilters onFilter={handleFilter} />
        </div>

        <div className=" border-blue-400 border-t-0 rounded-b-md bg-white px-4 pb-4 pt-2 rounded-t-md border border-b-0">
          {loading ? (
            <div className="text-center py-8">Loading farmers data...</div>
          ) : (
            <FarmerTableRows
              farmers={filteredFarmers}
              onStatusUpdate={handleStatusUpdate}
            />
          )}
        </div>
      </section>
      <section className="fixed bottom-0 w-full">
        <Footer />
      </section>
    </section>
  );
}

export default ApproveKYCPage;
