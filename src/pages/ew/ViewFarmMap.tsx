import { useEffect, useState } from "react";
import FarmMap from "./ViewFarm";

function ViewEWFarmMap() {
  const [FarmDetails, setFarmDetails] = useState<any>(null);

  useEffect(() => {
    const savedPolygon = localStorage.getItem("ViewedFarm");
    if (savedPolygon) {
      setFarmDetails(JSON.parse(savedPolygon));
    }
  }, []);
  return (
    <div>
      <FarmMap farmData={FarmDetails} />
    </div>
  );
}

export default ViewEWFarmMap;
