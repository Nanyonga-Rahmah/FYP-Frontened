import { useEffect, useState } from "react";

type FetchOptions = {
  url: string;
  token?: string;
  dependencies?: any[]; 
};

function useFetchData<T>({ url, token, dependencies = [] }: FetchOptions) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(url, {
          headers: token
            ? {
                Authorization: `Bearer ${token}`,
              }
            : undefined,
        });

        if (!res.ok) {
          throw new Error(`Error ${res.status}: ${res.statusText}`);
        }

        const result = await res.json();
        setData(result);
      } catch (err: any) {
        setError(err.message || "Error fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, dependencies); 

  return { data, loading, error };
}

export default useFetchData;
