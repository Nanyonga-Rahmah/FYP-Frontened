import { FarmerFarms } from "./routes";

export const fetchMyFarms = async (authToken: string) => {
  const response = await fetch(FarmerFarms, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });
  if (!response.ok) throw new Error("Failed to load farms");
  return await response.json();
};