import { useState, useEffect, useCallback } from "react";

interface UseAutoRefreshOptions<T> {
  url: string;
  method?: "GET" | "POST";
  headers?: HeadersInit;
  body?: BodyInit | null;
  interval?: number; 
  enabled?: boolean;
  transform?: (data: any) => T; 
}

export function useAutoRefresh<T = any>({
  url,
  method = "GET",
  headers = {},
  body = null,
  interval = 30000,
  enabled = true,
  transform,
}: UseAutoRefreshOptions<T>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!enabled) return;

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(url, {
        method,
        headers,
        body,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      setData(transform ? transform(result) : result);
    } catch (err: any) {
      console.error("Error fetching data:", err);
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [url, method, headers, body, transform, enabled]);

  useEffect(() => {
    fetchData();
    if (!enabled || interval <= 0) return;

    const timer = setInterval(fetchData, interval);
    return () => clearInterval(timer);
  }, [fetchData, interval, enabled]);

  return { data, loading, error, refetch: fetchData };
}
