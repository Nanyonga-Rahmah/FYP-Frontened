export const USER_ROLES = ["Farmer", "Exporter", "Processor"];
export const HARVEST_STATUS =["Pending", "Completed", "Cancelled"];

export const cooperatives = [
    {
      value: "Bugisu Cooperative Union",
      label: "Bugisu Cooperative Union",
    },
    {
      value: "Ankole Coffee Producers Cooperative",
      label: "Ankole Coffee Producers Cooperative",
    },
    {
      value: "Rwenzori Farmers Cooperative Society",
      label: "Rwenzori Farmers Cooperative Society",
    },
    {
      value: "Kapchorwa Coffee Farmers Union",
      label: "Kapchorwa Coffee Farmers Union",
    },
    {
      value: "Kigezi Highland Farmers Cooperative",
      label: "Kigezi Highland Farmers Cooperative",
    },
  ]


 export const subCounties = [
    "Nakawa", "Kawempe", "Rubaga", "Makindye", "Central Division",
    "Nyakayojo", "Buhweju", "Kashari", 
    "Goma", "Mukono Central", 
    
  ];

  export  const getInitials = (profile:any): string => {
    if (profile && profile.firstName && profile.lastName) {
      return `${profile.firstName.charAt(0)}${profile.lastName.charAt(0)}`;
    }
    return "MN";
  };

  export const convertCoordsToCanvasPoints = (
      coords: number[][],
      width: number,
      height: number
    ): number[] => {
      // Get bounds
      const lats = coords.map((c) => c[1]);
      const lngs = coords.map((c) => c[0]);
  
      const minLat = Math.min(...lats);
      const maxLat = Math.max(...lats);
      const minLng = Math.min(...lngs);
      const maxLng = Math.max(...lngs);
  
      return coords.flatMap(([lng, lat]) => {
        const x = ((lng - minLng) / (maxLng - minLng)) * width;
        const y = height - ((lat - minLat) / (maxLat - minLat)) * height;
        return [x, y];
      });
    };

    export interface Farmer {
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

    export interface Farm {
      _id: string;
      farmerId: Farmer;
      numberofTrees: number;
      farmName: string;
      location: string;
      latitude?: number;
      longitude?: number;
      farmSize: number;
      polygon: {
        type: "Polygon";
        coordinates: number[][][];
      };
      area: number;
      perimeter: number;
      cultivationMethods: string[];
      certifications?: string[];
      documents: Document[];
      yearEstablished?: string;
      isDeleted: boolean;
      status: "pending" | "approved" | "rejected";
      adminNotes?: string;
      createdAt: string;
      updatedAt: string;
    }
    