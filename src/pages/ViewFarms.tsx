import { useState, useEffect } from 'react';
import { PopoverDemo } from "@/components/globals/ActionPopover"; 
import Footer from "@/components/globals/Footer";
import Header from "@/components/globals/Header";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LocateFixed, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AllFarms } from '@/lib/routes';

interface Farmer {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface Document {
  _id: string;
  name: string;
  url: string;
  mimetype?: string;
}

interface Farm {
  _id: string;
  farmerId: Farmer;
  numberofTrees: number;
  farmName: string;
  location: string;
  latitude?: number;
  longitude?: number;
  farmSize: number;
  polygon: {
    type: 'Polygon';
    coordinates: number[][][];
  };
  area: number;
  perimeter: number;
  cultivationMethods: string[];
  certifications?: string[];
  documents: Document[];
  yearEstablished?: string;
  isDeleted: boolean;
  status: 'pending' | 'approved' | 'rejected';
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export const getRandomColor = () => {
  const colors = ["#E7B35A", "#EE443F", "#0C5FA0"];
  return colors[Math.floor(Math.random() * colors.length)];
};

function ViewFarmsPage() {
  const navigate = useNavigate();
  const [farms, setFarms] = useState<Farm[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFarms = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(AllFarms, {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: Farm[] = await response.json();
        setFarms(data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch farms');
        console.error("Error fetching farms:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFarms();
  }, []);

  return (
    <section
      className="h-screen"
      style={{
        background: "linear-gradient(to bottom, #112D3E 50%, #F6F9FF 50%)",
      }}
    >
      <Header />
      <section className="px-20 py-10">
        <div className="flex items-center justify-between ">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback>MN</AvatarFallback>
            </Avatar>
            <div className="flex">
              <div>
                <span className="text-[#C0C9DDE5]">Greetings,</span>
                <br />
                <span className="font-semibold text-xl text-white">
                  Mary Nantongo
                </span>
              </div>
            </div>
          </div>

          <div>
            <Button
              className="bg-[#E7B35A] flex items-center gap-1 rounded-md px-2"
              onClick={() => navigate("/add-farm")}
            >
              <LocateFixed />
              <span>Add Farm location</span>
            </Button>
          </div>
        </div>

        <section className="mt-16">
          <span className="font-semibold text-xl text-white">My Farms</span>

          {loading && <p className="text-white text-center mt-10">Loading farms...</p>}
          {error && <p className="text-red-400 text-center mt-10">Error: {error}</p>}

          {!loading && !error && (
            <div className="grid lg:grid-cols-3 gap-5 mt-5 mb-10">
              {farms.length > 0 ? farms.map((farm, index) => (
                <div
                  key={index}
                  className="bg-white flex flex-col max-w-[370px] max-h-[237px] rounded-[10px] py-1 px-3 shadow-sm"
                >
                  <div className="flex justify-end">
                    <PopoverDemo farmId={farm._id} />
                  </div>
                  <div className="flex flex-col items-center py-3">
                    <MapPin size={60} color="#fffafa" fill={getRandomColor()} />
                    <span className="font-semibold text-xl text-[#222222]">
                      {farm.farmName}
                    </span>
                    <span className="font-normal text-sm flex items-center gap-1 text-[#5C6474]">
                      <MapPin size={10} />
                      {farm.location}
                    </span>
                    <span className="font-normal text-sm text-[#5C6474]">
                      {farm.farmSize} Acres
                    </span>
                  </div>
                </div>
              )) : (
                <p className="text-gray-300 col-span-full text-center mt-10">
                  You haven't added any farms yet.
                </p>
              )}
            </div>
          )}
        </section>
      </section>
      <section className="bottom-0 fixed w-full">
        <Footer />
      </section>
    </section>
  );
}

export default ViewFarmsPage;
