import { useState, useEffect } from "react";
import apiClient from "../../api/apiClient";

export function useFetchOnDemand<T>(endpoint: string, deps: any[]) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // verificar si todas las dependencias son válidas
    const ready = deps.every(
      (d) => d !== "" && d !== null && d !== undefined
    );

    if (!ready) return;

    const controller = new AbortController();

    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await apiClient.get(endpoint, {
          signal: controller.signal,
        });
        setData(res.data);
      } catch (err: any) {
        if (err.name !== "CanceledError") {
          setError("Error al cargar datos condicionales");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => controller.abort();
  }, deps);

  return { data, loading, error };
}
