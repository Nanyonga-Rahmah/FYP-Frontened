import { Farm } from '@/lib/constants';
import { viewOneFarm } from '@/lib/routes';
import { useState, useEffect } from 'react';
import useAuth from './use-auth';



const useFarmData = (farmId: string) => {
  const [farm, setFarm] = useState<Farm | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { authToken } = useAuth();


  useEffect(() => {
    const fetchFarmData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${viewOneFarm}${farmId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const data: Farm = await response.json();
        setFarm(data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch farm data');
        console.error('Error fetching farm data:', err);
      } finally {
        setLoading(false);
      }
    };

    if (farmId) {
      fetchFarmData();
    }
  }, [farmId, authToken]);

  return { farm, loading, error };
};

export default useFarmData;
