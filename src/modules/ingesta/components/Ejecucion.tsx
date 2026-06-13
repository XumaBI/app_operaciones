import { useState, useRef, useEffect } from "react";
import * as XLSX from "xlsx";
import apiClient from "../../../api/apiClient";
import { useFetchData } from "../../../shared/hooks/useFetchData";
import { useCierre } from "../hooks/useCierre";
import type { EstadoCierre } from "../hooks/useCierre";
import Selector from "../../../shared/components/ui/Selector";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import LinearProgress from "@mui/material/LinearProgress";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Chip from "@mui/material/Chip";

import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";

import UploadFileIcon from "@mui/icons-material/UploadFile";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import SendIcon from "@mui/icons-material/Send";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

// ── Types ──────────────────────────────────────────────────────────────────────
interface Distribuidora {
  id: number;
  nombre: string;
  cod: string;
}

interface Aseguradora {
  id: number;
  nombre: string;
  cod: string;
}

interface ArchivoEnBucket {
  filename: string;
  size: number;
  lastModified: string;
}

interface DocTipo {
  label: string;
  slug: string;
}

type EstadoDoc = "idle" | "subiendo" | "exito" | "error";

interface DocState {
  archivo: File | null;
  estado: EstadoDoc;
  progreso: number;
  mensaje: string;
  tamano?: number;
  subidoEn?: string;
}

// ── Config: tipos de documento por distribuidora (cod) ─────────────────────────
const DOCS_CONFIG: Record<string, DocTipo[]> = {
  GDO: [
    { label: "Acta de Liquidación", slug: "ACTA_LIQUIDACION" },
    { label: "Acta de Facturación", slug: "ACTA_FACTURACION" },
    { label: "Órd. Asoc. Liquidación", slug: "ORDENES_LIQUIDACION" },
    { label: "Órd. Asoc. Facturación", slug: "ORDENES_FACTURACION" },
    { label: "Activos", slug: "ACTIVOS" },
    { label: "Cancelaciones", slug: "CANCELACIONES" },
  ],
  CARIBE: [
    { label: "Acta de Liquidación", slug: "ACTA_LIQUIDACION" },
    { label: "Acta de Facturación", slug: "ACTA_FACTURACION" },
    { label: "Órd. Asoc. Liquidación", slug: "ORDENES_LIQUIDACION" },
    { label: "Órd. Asoc. Facturación", slug: "ORDENES_FACTURACION" },
  ],
  EFIGAS: [
    { label: "Acta de Liquidación", slug: "ACTA_LIQUIDACION" },
    { label: "Acta de Facturación", slug: "ACTA_FACTURACION" },
    { label: "Activos", slug: "ACTIVOS" },
  ],
  SURTIGAS: [
    { label: "Acta de Liquidación", slug: "ACTA_LIQUIDACION" },
    { label: "Acta de Facturación", slug: "ACTA_FACTURACION" },
    { label: "Cancelaciones", slug: "CANCELACIONES" },
  ],
  CEO: [
    { label: "Acta de Liquidación", slug: "ACTA_LIQUIDACION" },
    { label: "Acta de Facturación", slug: "ACTA_FACTURACION" },
  ],
  GUAJIRA: [
    { label: "Acta de Liquidación", slug: "ACTA_LIQUIDACION" },
    { label: "Acta de Facturación", slug: "ACTA_FACTURACION" },
  ],
};

// Fallback para distribuidoras sin config explícita
const DEFAULT_DOCS: DocTipo[] = [
  { label: "Acta de Liquidación", slug: "ACTA_LIQUIDACION" },
  { label: "Acta de Facturación", slug: "ACTA_FACTURACION" },
];

// ── Constants ──────────────────────────────────────────────────────────────────
const TIPOS_ACEPTADOS = ".xlsx,.xls,.csv,.txt";

const MESES = Array.from({ length: 12 }, (_, i) => {
  const mes = String(i + 1).padStart(2, "0");
  return { label: `2026-${mes}`, value: `2026-${mes}` };
});

// ── Helpers ────────────────────────────────────────────────────────────────────
function formatearPeso(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function getExtension(nombre: string): string {
  return nombre.split(".").pop()?.toLowerCase() ?? "";
}

const EXTENSIONES_EXCEL = ["xlsx", "xls"];

async function convertirACsv(archivo: File): Promise<File> {
  const ext = getExtension(archivo.name);
  if (!EXTENSIONES_EXCEL.includes(ext)) return archivo;

  const buffer = await archivo.arrayBuffer();
  const wb = XLSX.read(buffer, { type: "array" });
  const hoja = wb.Sheets[wb.SheetNames[0]];
  const csv = XLSX.utils.sheet_to_csv(hoja, { FS: ";" });

  const nombreCsv = archivo.name.replace(/\.[^.]+$/, ".csv");
  return new File([csv], nombreCsv, { type: "text/csv" });
}

function getDocsTipo(cod: string): DocTipo[] {
  return DOCS_CONFIG[cod.toUpperCase()] ?? DEFAULT_DOCS;
}

function crearEstadoInicial(docs: DocTipo[]): Record<string, DocState> {
  return Object.fromEntries(
    docs.map((d) => [
      d.slug,
      { archivo: null, estado: "idle" as EstadoDoc, progreso: 0, mensaje: "" },
    ])
  );
}

function formatearFechaCorta(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yy = String(d.getFullYear()).slice(-2);
  const hh = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  return `${dd}/${mm}/${yy} ${hh}:${min}`;
}

// Presentación (texto + color) para cada estado del cierre.
const CIERRE_DISPLAY: Record<
  Exclude<EstadoCierre, "idle">,
  { texto: string; color: string }
> = {
  lanzando: { texto: "Lanzando cierre…", color: "#5AB0E2" },
  queued: { texto: "En cola…", color: "#5AB0E2" },
  running: { texto: "Ejecutando cierre…", color: "#f59e0b" },
  success: { texto: "Cierre completado", color: "#5AE280" },
  failed: { texto: "El cierre falló", color: "#ef4444" },
  error: { texto: "Error de conexión", color: "#ef4444" },
};

// ── Component ──────────────────────────────────────────────────────────────────
export default function Ejecucion() {
  const { data: distribuidoras, loading: loadingDist } =
    useFetchData<Distribuidora>("/distribuidora/");
  const { data: aseguradoras, loading: loadingAseg } =
    useFetchData<Aseguradora>("/aseguradora/");

  const [distribuidoraObj, setDistribuidoraObj] =
    useState<Distribuidora | null>(null);
  const [aseguradoraObj, setAseguradoraObj] =
    useState<Aseguradora | null>(null);
  const [anioMes, setAnioMes] = useState<string>("");
  const [docEstados, setDocEstados] = useState<Record<string, DocState>>({});
  const [draggingSlug, setDraggingSlug] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [cargandoListado, setCargandoListado] = useState(false);
  const [confirmCierreOpen, setConfirmCierreOpen] = useState(false);

  const {
    estado: estadoCierre,
    enProceso: cierreEnProceso,
    error: errorCierre,
    ejecutar: ejecutarCierre,
    reset: resetCierre,
  } = useCierre();

  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  // ── Derived ──────────────────────────────────────────────────────────────────
  const docsTipos = distribuidoraObj ? getDocsTipo(distribuidoraObj.cod) : [];

  const archivosListos = docsTipos.filter(
    (d) =>
      !!docEstados[d.slug]?.archivo &&
      docEstados[d.slug]?.estado !== "exito"
  );

  const archivosExitosos = docsTipos.filter(
    (d) => docEstados[d.slug]?.estado === "exito"
  );

  const enviando = docsTipos.some(
    (d) => docEstados[d.slug]?.estado === "subiendo"
  );

  const hayArchivosParaEnviar =
    archivosListos.length > 0 &&
    !!anioMes &&
    !!aseguradoraObj &&
    !enviando;

  // El cierre solo se habilita cuando TODOS los documentos requeridos ya están
  // en el bucket (estado "exito") y el contexto está completo.
  const todosCompletos =
    docsTipos.length > 0 &&
    archivosExitosos.length === docsTipos.length &&
    !!aseguradoraObj &&
    !!anioMes;

  const puedeEjecutarCierre =
    todosCompletos && !enviando && !cierreEnProceso && estadoCierre !== "success";

  const opcionesDistribuidora = distribuidoras.map((d) => ({
    label: d.nombre,
    value: d.nombre,
  }));

  const opcionesAseguradora = aseguradoras.map((a) => ({
    label: a.nombre,
    value: a.nombre,
  }));

  // ── Handlers ──────────────────────────────────────────────────────────────────
  const actualizarDoc = (slug: string, partial: Partial<DocState>) => {
    setDocEstados((prev) => ({
      ...prev,
      [slug]: { ...prev[slug], ...partial },
    }));
  };

  const handleSeleccionarDistribuidora = (nombre: string) => {
    const dist = distribuidoras.find((d) => d.nombre === nombre) ?? null;
    setDistribuidoraObj(dist);
  };

  const handleSeleccionarAseguradora = (nombre: string) => {
    const aseg = aseguradoras.find((a) => a.nombre === nombre) ?? null;
    setAseguradoraObj(aseg);
  };

  // Cuando cambia el contexto (distribuidora, aseguradora o período):
  // - Resetea las tarjetas a estado inicial
  // - Si los tres están seleccionados, consulta los archivos ya subidos al bucket
  //   y marca como "exito" los slugs que ya existen
  useEffect(() => {
    // Cualquier cambio de contexto invalida un cierre anterior.
    resetCierre();

    if (!distribuidoraObj) {
      setDocEstados({});
      return;
    }

    const docs = getDocsTipo(distribuidoraObj.cod);
    setDocEstados(crearEstadoInicial(docs));

    if (!aseguradoraObj || !anioMes) return;

    const controller = new AbortController();
    setCargandoListado(true);

    const folder = `cierres/${distribuidoraObj.cod}/${aseguradoraObj.cod}/${anioMes}`;

    apiClient
      .get<ArchivoEnBucket[]>("/archivos/list", {
        params: { folder },
        signal: controller.signal,
      })
      .then((res) => {
        const archivos = Array.isArray(res.data) ? res.data : [];
        setDocEstados((prev) => {
          const next = { ...prev };
          for (const doc of docs) {
            const match = archivos.find((f) =>
              f.filename.startsWith(`${doc.slug}-`)
            );
            if (match) {
              next[doc.slug] = {
                archivo: null,
                estado: "exito",
                progreso: 100,
                mensaje: "",
                tamano: match.size,
                subidoEn: match.lastModified,
              };
            }
          }
          return next;
        });
      })
      .catch((err) => {
        if (err?.name === "CanceledError" || err?.code === "ERR_CANCELED")
          return;
        // Falla silenciosa: si no podemos consultar, el usuario igual puede subir.
      })
      .finally(() => setCargandoListado(false));

    return () => controller.abort();
  }, [distribuidoraObj, aseguradoraObj, anioMes, resetCierre]);

  const handleFileSelect = (slug: string, file: File) => {
    actualizarDoc(slug, { archivo: file, estado: "idle", progreso: 0, mensaje: "" });
  };

  const handleFileRemove = (slug: string) => {
    actualizarDoc(slug, { archivo: null, estado: "idle", progreso: 0, mensaje: "" });
  };

  const handleEnviarTodos = async () => {
    if (!distribuidoraObj || !aseguradoraObj || !anioMes) return;
    setConfirmOpen(false);

    const paraEnviar = docsTipos.filter(
      (d) =>
        !!docEstados[d.slug]?.archivo &&
        docEstados[d.slug]?.estado !== "exito"
    );

    await Promise.allSettled(
      paraEnviar.map(async (doc) => {
        const archivoOriginal = docEstados[doc.slug].archivo!;
        const archivo = await convertirACsv(archivoOriginal);
        const nombreFinal = `${doc.slug}-${distribuidoraObj.cod}-${aseguradoraObj.cod}-${anioMes}.${getExtension(archivo.name)}`;
        const archivoRenombrado = new File([archivo], nombreFinal, {
          type: archivo.type,
        });
        const formData = new FormData();
        formData.append("file", archivoRenombrado);
        formData.append(
          "folder",
          `cierres/${distribuidoraObj.cod}/${aseguradoraObj.cod}/${anioMes}`
        );

        actualizarDoc(doc.slug, { estado: "subiendo", progreso: 0 });

        try {
          await apiClient.post("/archivos/upload", formData, {
            headers: { "Content-Type": "multipart/form-data" },
            onUploadProgress: (e) => {
              if (e.total)
                actualizarDoc(doc.slug, {
                  progreso: Math.round((e.loaded * 100) / e.total),
                });
            },
          });
          actualizarDoc(doc.slug, {
            estado: "exito",
            progreso: 100,
            tamano: archivo.size,
            subidoEn: new Date().toISOString(),
          });
        } catch {
          actualizarDoc(doc.slug, {
            estado: "error",
            mensaje: "Error al enviar.",
          });
        }
      })
    );
  };

  const handleEjecutarCierre = () => {
    if (!distribuidoraObj || !aseguradoraObj || !anioMes) return;
    setConfirmCierreOpen(false);
    ejecutarCierre({
      distribuidora: distribuidoraObj.cod,
      aseguradora: aseguradoraObj.cod,
      periodo: anioMes,
    });
  };

  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    <Box sx={{ p: "40px 32px", maxWidth: 920, color: "white" }}>
      {/* Header */}
      <Typography variant="h5" fontWeight={600} mb={0.5}>
        Carga de archivos
      </Typography>
      <Typography
        variant="body2"
        sx={{ color: "rgba(255,255,255,0.45)", mb: 4 }}
      >
        Selecciona la distribuidora, la aseguradora y el período para ver los
        documentos requeridos.
      </Typography>

      {/* Selectors */}
      <Box display="flex" gap={2} mb={4} sx={{ maxWidth: 720 }}>
        <Box flex={1}>
          <Selector
            label="Distribuidora"
            options={opcionesDistribuidora}
            value={distribuidoraObj?.nombre ?? ""}
            onChange={handleSeleccionarDistribuidora}
            disabled={loadingDist || enviando}
          />
        </Box>
        <Box flex={1}>
          <Selector
            label="Aseguradora"
            options={opcionesAseguradora}
            value={aseguradoraObj?.nombre ?? ""}
            onChange={handleSeleccionarAseguradora}
            disabled={loadingAseg || enviando}
          />
        </Box>
        <Box flex={1}>
          <Selector
            label="Año-Mes"
            options={MESES}
            value={anioMes}
            onChange={setAnioMes}
            disabled={enviando}
          />
        </Box>
      </Box>

      {/* Document section */}
      {distribuidoraObj && docsTipos.length > 0 && (
        <>
          {/* Section header */}
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            mb={2}
          >
            <Typography
              variant="body2"
              sx={{ color: "rgba(255,255,255,0.4)", fontWeight: 500 }}
            >
              Documentos requeridos —{" "}
              <span style={{ color: "rgba(255,255,255,0.75)" }}>
                {distribuidoraObj.nombre}
              </span>
              {aseguradoraObj && (
                <>
                  {" · "}
                  <span style={{ color: "rgba(255,255,255,0.75)" }}>
                    {aseguradoraObj.nombre}
                  </span>
                </>
              )}
            </Typography>
            <Box display="flex" gap={1} alignItems="center">
              {cargandoListado && (
                <Typography
                  variant="caption"
                  sx={{ color: "rgba(255,255,255,0.35)", fontSize: "11px" }}
                >
                  Consultando…
                </Typography>
              )}
              {archivosExitosos.length > 0 && (
                <Chip
                  label={`${archivosExitosos.length} enviado${archivosExitosos.length > 1 ? "s" : ""}`}
                  size="small"
                  sx={{
                    bgcolor: "rgba(0,167,47,0.15)",
                    color: "#5AE280",
                    fontWeight: 600,
                    fontSize: "11px",
                  }}
                />
              )}
              <Chip
                label={`${archivosListos.length} / ${docsTipos.length} listo${archivosListos.length !== 1 ? "s" : ""}`}
                size="small"
                sx={{
                  bgcolor:
                    archivosListos.length > 0
                      ? "rgba(255,255,255,0.07)"
                      : "rgba(255,255,255,0.03)",
                  color:
                    archivosListos.length > 0
                      ? "rgba(255,255,255,0.65)"
                      : "rgba(255,255,255,0.25)",
                  fontWeight: 600,
                  fontSize: "11px",
                }}
              />
            </Box>
          </Box>

          {/* Cards grid */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))",
              gap: 1.5,
              mb: 3,
            }}
          >
            {docsTipos.map((doc) => {
              const est = docEstados[doc.slug] ?? {
                archivo: null,
                estado: "idle" as EstadoDoc,
                progreso: 0,
                mensaje: "",
              };
              const isDragging = draggingSlug === doc.slug;
              const tieneArchivo = !!est.archivo;
              const clickable =
                est.estado !== "subiendo" && est.estado !== "exito";

              const borderColor =
                est.estado === "exito"
                  ? "rgba(90,226,128,0.5)"
                  : est.estado === "error"
                  ? "rgba(239,68,68,0.45)"
                  : isDragging
                  ? "rgba(255,255,255,0.4)"
                  : tieneArchivo
                  ? "rgba(0,167,47,0.45)"
                  : "rgba(255,255,255,0.07)";

              const bgColor =
                est.estado === "exito"
                  ? "rgba(0,167,47,0.06)"
                  : est.estado === "error"
                  ? "rgba(239,68,68,0.05)"
                  : isDragging
                  ? "rgba(255,255,255,0.06)"
                  : tieneArchivo
                  ? "rgba(0,167,47,0.04)"
                  : "rgba(255,255,255,0.02)";

              return (
                <Box
                  key={doc.slug}
                  onClick={() =>
                    clickable && inputRefs.current[doc.slug]?.click()
                  }
                  onDragOver={(e) => {
                    e.preventDefault();
                    if (clickable) setDraggingSlug(doc.slug);
                  }}
                  onDragLeave={() => setDraggingSlug(null)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDraggingSlug(null);
                    if (!clickable) return;
                    const file = e.dataTransfer.files[0];
                    if (file) handleFileSelect(doc.slug, file);
                  }}
                  sx={{
                    border: "1.5px solid",
                    borderColor,
                    borderRadius: 2,
                    p: "14px 14px 10px",
                    background: bgColor,
                    cursor: clickable ? "pointer" : "default",
                    transition: "all 0.2s",
                    display: "flex",
                    flexDirection: "column",
                    gap: 0.5,
                    minHeight: 150,
                    position: "relative",
                    overflow: "hidden",
                    "&:hover": clickable
                      ? {
                          borderColor:
                            est.estado === "error"
                              ? "rgba(239,68,68,0.65)"
                              : tieneArchivo
                              ? "rgba(0,167,47,0.65)"
                              : "rgba(255,255,255,0.18)",
                          background:
                            est.estado === "error"
                              ? "rgba(239,68,68,0.07)"
                              : tieneArchivo
                              ? "rgba(0,167,47,0.06)"
                              : "rgba(255,255,255,0.04)",
                        }
                      : {},
                  }}
                >
                  {/* Doc type label */}
                  <Typography
                    variant="caption"
                    sx={{
                      color:
                        est.estado === "exito"
                          ? "rgba(90,226,128,0.7)"
                          : est.estado === "error"
                          ? "rgba(239,68,68,0.7)"
                          : "rgba(255,255,255,0.35)",
                      fontWeight: 600,
                      fontSize: "10px",
                      letterSpacing: "0.4px",
                      textTransform: "uppercase",
                      lineHeight: 1.3,
                      mb: 0.5,
                    }}
                  >
                    {doc.label}
                  </Typography>

                  {/* Content area */}
                  <Box
                    flex={1}
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    gap={0.5}
                    py={1}
                  >
                    {est.estado === "exito" ? (
                      <>
                        <CheckCircleOutlineIcon
                          sx={{ fontSize: 30, color: "#5AE280" }}
                        />
                        <Typography
                          variant="caption"
                          sx={{ color: "#5AE280", fontWeight: 600 }}
                        >
                          {est.subidoEn && !est.archivo ? "Ya en bucket" : "Enviado"}
                        </Typography>
                        {est.tamano !== undefined && (
                          <Typography
                            variant="caption"
                            sx={{
                              color: "rgba(255,255,255,0.4)",
                              fontSize: "10px",
                            }}
                          >
                            {formatearPeso(est.tamano)}
                          </Typography>
                        )}
                        {est.subidoEn && (
                          <Typography
                            variant="caption"
                            sx={{
                              color: "rgba(255,255,255,0.25)",
                              fontSize: "10px",
                            }}
                          >
                            {formatearFechaCorta(est.subidoEn)}
                          </Typography>
                        )}
                      </>
                    ) : est.estado === "subiendo" ? (
                      <>
                        <Typography
                          variant="caption"
                          sx={{ color: "rgba(255,255,255,0.45)" }}
                        >
                          Enviando…
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            color: "#5AE280",
                            fontWeight: 700,
                            fontSize: "16px",
                          }}
                        >
                          {est.progreso}%
                        </Typography>
                      </>
                    ) : est.estado === "error" ? (
                      <>
                        <ErrorOutlineIcon
                          sx={{ fontSize: 28, color: "#ef4444" }}
                        />
                        <Typography
                          variant="caption"
                          sx={{
                            color: "rgba(239,68,68,0.85)",
                            textAlign: "center",
                            px: 0.5,
                          }}
                        >
                          {est.mensaje}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            color: "rgba(255,255,255,0.25)",
                            fontSize: "10px",
                          }}
                        >
                          Clic para cambiar archivo
                        </Typography>
                      </>
                    ) : tieneArchivo ? (
                      <>
                        <InsertDriveFileIcon
                          sx={{ fontSize: 28, color: "#5AE280" }}
                        />
                        <Typography
                          variant="caption"
                          title={est.archivo!.name}
                          sx={{
                            color: "rgba(255,255,255,0.8)",
                            fontWeight: 500,
                            textAlign: "center",
                            wordBreak: "break-all",
                            px: 0.5,
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {est.archivo!.name}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            color: "rgba(255,255,255,0.3)",
                            fontSize: "10px",
                          }}
                        >
                          {formatearPeso(est.archivo!.size)}
                        </Typography>
                      </>
                    ) : (
                      <>
                        <UploadFileIcon
                          sx={{
                            fontSize: 28,
                            color: "rgba(255,255,255,0.18)",
                          }}
                        />
                        <Typography
                          variant="caption"
                          sx={{
                            color: "rgba(255,255,255,0.3)",
                            textAlign: "center",
                          }}
                        >
                          Clic o arrastra aquí
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            color: "rgba(255,255,255,0.18)",
                            fontSize: "10px",
                          }}
                        >
                          xlsx · xls · csv · txt
                        </Typography>
                      </>
                    )}
                  </Box>

                  {/* Quitar button */}
                  {tieneArchivo &&
                    est.estado !== "subiendo" &&
                    est.estado !== "exito" && (
                      <Box
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFileRemove(doc.slug);
                        }}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 0.4,
                          color: "rgba(255,255,255,0.22)",
                          cursor: "pointer",
                          mt: 0.5,
                          alignSelf: "flex-start",
                          "&:hover": { color: "rgba(239,68,68,0.7)" },
                          transition: "color 0.15s",
                        }}
                      >
                        <DeleteOutlineIcon sx={{ fontSize: 13 }} />
                        <Typography
                          variant="caption"
                          sx={{ fontSize: "10px" }}
                        >
                          Quitar
                        </Typography>
                      </Box>
                    )}

                  {/* Progress bar */}
                  {est.estado === "subiendo" && (
                    <Box
                      sx={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                      }}
                    >
                      <LinearProgress
                        variant="determinate"
                        value={est.progreso}
                        sx={{
                          height: 3,
                          bgcolor: "rgba(255,255,255,0.06)",
                          "& .MuiLinearProgress-bar": { bgcolor: "#5AE280" },
                        }}
                      />
                    </Box>
                  )}

                  {/* Hidden file input */}
                  <input
                    ref={(el) => {
                      inputRefs.current[doc.slug] = el;
                    }}
                    type="file"
                    accept={TIPOS_ACEPTADOS}
                    style={{ display: "none" }}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileSelect(doc.slug, file);
                      e.target.value = "";
                    }}
                  />
                </Box>
              );
            })}
          </Box>

          {/* Footer bar */}
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            mt={1}
          >
            <Typography
              variant="caption"
              sx={{ color: "rgba(255,255,255,0.25)" }}
            >
              {enviando
                ? "Enviando archivos…"
                : !aseguradoraObj
                ? "Selecciona la aseguradora para habilitar el envío."
                : !anioMes
                ? "Selecciona el período para habilitar el envío."
                : archivosListos.length === 0
                ? "Agrega archivos para continuar."
                : ""}
            </Typography>
            <Button
              variant="contained"
              startIcon={<SendIcon />}
              disabled={!hayArchivosParaEnviar}
              onClick={() => setConfirmOpen(true)}
              sx={{
                backgroundColor: "#00a72f",
                textTransform: "none",
                fontWeight: 600,
                px: 3,
                "&:hover": { backgroundColor: "#008f27" },
                "&.Mui-disabled": {
                  backgroundColor: "rgba(0,167,47,0.15)",
                  color: "rgba(255,255,255,0.25)",
                },
              }}
            >
              {archivosListos.length > 0
                ? `Enviar ${archivosListos.length} archivo${archivosListos.length > 1 ? "s" : ""}`
                : "Enviar archivos"}
            </Button>
          </Box>

          {/* ── Cierre ──────────────────────────────────────────────────── */}
          <Divider sx={{ my: 3, borderColor: "rgba(255,255,255,0.06)" }} />

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 2,
              flexWrap: "wrap",
              p: "16px 18px",
              borderRadius: 2,
              border: "1px solid rgba(255,255,255,0.06)",
              background: "rgba(255,255,255,0.02)",
            }}
          >
            <Box>
              <Typography
                variant="body2"
                sx={{ color: "rgba(255,255,255,0.85)", fontWeight: 600 }}
              >
                Ejecutar cierre
              </Typography>
              <Box
                display="flex"
                alignItems="center"
                gap={0.7}
                mt={0.5}
                sx={{ minHeight: 20 }}
              >
                {estadoCierre !== "idle" ? (
                  <>
                    {cierreEnProceso ? (
                      <CircularProgress
                        size={13}
                        sx={{ color: CIERRE_DISPLAY[estadoCierre].color }}
                      />
                    ) : estadoCierre === "success" ? (
                      <CheckCircleOutlineIcon
                        sx={{ fontSize: 15, color: CIERRE_DISPLAY[estadoCierre].color }}
                      />
                    ) : (
                      <ErrorOutlineIcon
                        sx={{ fontSize: 15, color: CIERRE_DISPLAY[estadoCierre].color }}
                      />
                    )}
                    <Typography
                      variant="caption"
                      sx={{ color: CIERRE_DISPLAY[estadoCierre].color, fontWeight: 600 }}
                    >
                      {errorCierre ?? CIERRE_DISPLAY[estadoCierre].texto}
                    </Typography>
                  </>
                ) : todosCompletos ? (
                  <Typography
                    variant="caption"
                    sx={{ color: "rgba(255,255,255,0.4)" }}
                  >
                    Todos los documentos están en el bucket. Listo para cerrar.
                  </Typography>
                ) : (
                  <Box display="flex" alignItems="center" gap={0.6}>
                    <LockOutlinedIcon
                      sx={{ fontSize: 13, color: "rgba(255,255,255,0.3)" }}
                    />
                    <Typography
                      variant="caption"
                      sx={{ color: "rgba(255,255,255,0.35)" }}
                    >
                      Faltan documentos por subir ({archivosExitosos.length}/
                      {docsTipos.length}).
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>

            <Button
              variant="contained"
              startIcon={
                cierreEnProceso ? (
                  <CircularProgress size={16} sx={{ color: "inherit" }} />
                ) : (
                  <RocketLaunchIcon />
                )
              }
              disabled={!puedeEjecutarCierre}
              onClick={() => setConfirmCierreOpen(true)}
              sx={{
                backgroundColor: "#00a72f",
                textTransform: "none",
                fontWeight: 600,
                px: 3,
                "&:hover": { backgroundColor: "#008f27" },
                "&.Mui-disabled": {
                  backgroundColor: "rgba(0,167,47,0.15)",
                  color: "rgba(255,255,255,0.25)",
                },
              }}
            >
              {cierreEnProceso
                ? "Ejecutando…"
                : estadoCierre === "success"
                ? "Cierre realizado"
                : "Ejecutar cierre"}
            </Button>
          </Box>
        </>
      )}

      {/* Confirmation dialog */}
      <Dialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        slotProps={{
          paper: {
            sx: {
              backgroundColor: "#151c27",
              color: "white",
              borderRadius: 2,
              minWidth: 440,
              border: "1px solid rgba(255,255,255,0.07)",
            },
          },
        }}
      >
        <DialogTitle
          sx={{ display: "flex", alignItems: "center", gap: 1.5, pb: 1 }}
        >
          <WarningAmberIcon sx={{ color: "#f59e0b" }} />
          Confirmar envío
        </DialogTitle>

        <DialogContent>
          <DialogContentText
            sx={{ color: "rgba(255,255,255,0.6)", fontSize: "14px", mb: 2 }}
          >
            Se enviarán los siguientes archivos —{" "}
            <strong style={{ color: "rgba(255,255,255,0.85)" }}>
              {distribuidoraObj?.nombre}
            </strong>{" "}
            ·{" "}
            <strong style={{ color: "rgba(255,255,255,0.85)" }}>
              {aseguradoraObj?.nombre}
            </strong>{" "}
            · {anioMes}:
          </DialogContentText>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {archivosListos.map((doc) => {
              const archivo = docEstados[doc.slug]?.archivo;
              if (!archivo) return null;
              const nombreFinal = `${doc.slug}-${distribuidoraObj?.cod}-${aseguradoraObj?.cod}-${anioMes}.${getExtension(archivo.name)}`;
              return (
                <Box
                  key={doc.slug}
                  sx={{
                    bgcolor: "rgba(255,255,255,0.04)",
                    borderRadius: 1.5,
                    p: "8px 12px",
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      color: "rgba(255,255,255,0.3)",
                      display: "block",
                      mb: 0.3,
                    }}
                  >
                    {doc.label}
                  </Typography>
                  <Typography
                    variant="body2"
                    fontWeight={600}
                    sx={{
                      color: "#5AE280",
                      wordBreak: "break-all",
                      fontSize: "13px",
                    }}
                  >
                    {nombreFinal}
                  </Typography>
                </Box>
              );
            })}
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
          <Button
            onClick={() => setConfirmOpen(false)}
            sx={{
              textTransform: "none",
              color: "rgba(255,255,255,0.5)",
              "&:hover": { color: "white" },
            }}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={handleEnviarTodos}
            sx={{
              textTransform: "none",
              fontWeight: 600,
              backgroundColor: "#00a72f",
              "&:hover": { backgroundColor: "#008f27" },
            }}
          >
            Sí, enviar todos
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirmación de cierre */}
      <Dialog
        open={confirmCierreOpen}
        onClose={() => setConfirmCierreOpen(false)}
        slotProps={{
          paper: {
            sx: {
              backgroundColor: "#151c27",
              color: "white",
              borderRadius: 2,
              minWidth: 440,
              border: "1px solid rgba(255,255,255,0.07)",
            },
          },
        }}
      >
        <DialogTitle
          sx={{ display: "flex", alignItems: "center", gap: 1.5, pb: 1 }}
        >
          <RocketLaunchIcon sx={{ color: "#00a72f" }} />
          Ejecutar cierre
        </DialogTitle>

        <DialogContent>
          <DialogContentText
            sx={{ color: "rgba(255,255,255,0.6)", fontSize: "14px" }}
          >
            Se lanzará el proceso de cierre en Airflow para —{" "}
            <strong style={{ color: "rgba(255,255,255,0.85)" }}>
              {distribuidoraObj?.nombre}
            </strong>{" "}
            ·{" "}
            <strong style={{ color: "rgba(255,255,255,0.85)" }}>
              {aseguradoraObj?.nombre}
            </strong>{" "}
            · {anioMes}. Esta acción procesa los {docsTipos.length} documentos
            cargados en el bucket.
          </DialogContentText>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
          <Button
            onClick={() => setConfirmCierreOpen(false)}
            sx={{
              textTransform: "none",
              color: "rgba(255,255,255,0.5)",
              "&:hover": { color: "white" },
            }}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={handleEjecutarCierre}
            sx={{
              textTransform: "none",
              fontWeight: 600,
              backgroundColor: "#00a72f",
              "&:hover": { backgroundColor: "#008f27" },
            }}
          >
            Sí, ejecutar cierre
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}