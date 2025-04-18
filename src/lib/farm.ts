import { AllFarms } from "./routes";

export const fetchMyFarms = async () => {
    const response = await fetch(AllFarms, {
      credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to load farms");
    return await response.json();
  };
  