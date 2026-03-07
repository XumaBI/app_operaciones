import { useEffect, useState } from "react";
import apiClient from "../../api/apiClient";

export function useFetchData<T>(endpoint: string) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await apiClient.get(endpoint);
        const raw = res.data;
        setData(Array.isArray(raw) ? raw : []);
      } catch (err) {
        setError("Error al cargar los datos");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [endpoint]);

  return { data, loading, error };
}
