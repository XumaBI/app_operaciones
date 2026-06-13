import { useCallback, useEffect, useRef, useState } from "react";
import apiClient from "../../../api/apiClient";

// Estados que puede reportar el DAG de Airflow + estados locales del flujo.
export type EstadoCierre =
  | "idle" // aún no se ha lanzado
  | "lanzando" // POST en curso, todavía no hay dag_run_id
  | "queued" // encolado en Airflow
  | "running" // ejecutándose
  | "success" // terminó OK
  | "failed" // terminó con error
  | "error"; // fallo de red / API (no del DAG)

export interface CierreParams {
  distribuidora: string; // cod de la distribuidora (p.ej. "GDO")
  aseguradora: string; // cod de la aseguradora (p.ej. "ALF")
  periodo: string; // año-mes (p.ej. "2026-05")
}

interface EjecutarResponse {
  dag_run_id: string;
}

interface EstadoResponse {
  estado: EstadoCierre;
}

const INTERVALO_POLLING_MS = 5000;
const ESTADOS_FINALES: EstadoCierre[] = ["success", "failed", "error"];

/**
 * Encapsula el disparo del DAG de cierres y el sondeo de su estado.
 *
 * - `ejecutar` lanza el cierre (POST) y arranca el polling cada 5s.
 * - `estado` refleja el último estado conocido del DAG.
 * - El intervalo se limpia solo al terminar, al desmontar o al volver a lanzar.
 */
export function useCierre() {
  const [estado, setEstado] = useState<EstadoCierre>("idle");
  const [dagRunId, setDagRunId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const detenerPolling = useCallback(() => {
    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Limpieza al desmontar el componente.
  useEffect(() => detenerPolling, [detenerPolling]);

  const consultarEstado = useCallback(
    async (runId: string) => {
      try {
        const res = await apiClient.get<EstadoResponse>(
          `/cierres/estado/${runId}`
        );
        const nuevo = res.data.estado;
        setEstado(nuevo);
        if (ESTADOS_FINALES.includes(nuevo)) detenerPolling();
      } catch {
        setEstado("error");
        setError("No se pudo consultar el estado del cierre.");
        detenerPolling();
      }
    },
    [detenerPolling]
  );

  const ejecutar = useCallback(
    async (params: CierreParams) => {
      detenerPolling();
      setError(null);
      setDagRunId(null);
      setEstado("lanzando");

      try {
        const res = await apiClient.post<EjecutarResponse>(
          "/cierres/ejecutar",
          params
        );
        const runId = res.data.dag_run_id;
        if (!runId) {
          setEstado("error");
          setError("La API no devolvió un identificador de ejecución.");
          return;
        }

        setDagRunId(runId);
        setEstado("queued");

        // Sondeo periódico hasta que el DAG llegue a un estado final.
        timerRef.current = setInterval(() => {
          consultarEstado(runId);
        }, INTERVALO_POLLING_MS);
      } catch {
        setEstado("error");
        setError("No se pudo iniciar el cierre.");
      }
    },
    [consultarEstado, detenerPolling]
  );

  const reset = useCallback(() => {
    detenerPolling();
    setEstado("idle");
    setDagRunId(null);
    setError(null);
  }, [detenerPolling]);

  const enProceso =
    estado === "lanzando" || estado === "queued" || estado === "running";

  return { estado, dagRunId, error, enProceso, ejecutar, reset };
}
