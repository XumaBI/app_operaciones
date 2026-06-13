import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";

import { listarJerarquia, crearSeccion, crearGrupo } from "../api/adminApi";
import type { DominioJerarquia } from "../types";
import { ICONOS } from "../../../shared/components/layout/Sidebar/iconos";
import { campoSx, botonTexto } from "./adminUi";

const ICONO_OPCIONES = Object.keys(ICONOS);

// Selector encadenado dominio → sección → grupo con creación inline de sección y
// grupo. Notifica al padre el grupoId destino (o null si la selección no está
// completa). Es la pieza que permite ubicar un elemento nuevo desde la UI.
export function SelectorUbicacion({
  onChange,
}: {
  onChange: (grupoId: number | null) => void;
}) {
  const [jerarquia, setJerarquia] = useState<DominioJerarquia[]>([]);
  const [dominioId, setDominioId] = useState<number | "">("");
  const [seccionId, setSeccionId] = useState<number | "">("");
  const [grupoId, setGrupoId] = useState<number | "">("");

  const [creandoSeccion, setCreandoSeccion] = useState(false);
  const [nombreSeccion, setNombreSeccion] = useState("");
  const [iconoSeccion, setIconoSeccion] = useState("grafico");

  const [creandoGrupo, setCreandoGrupo] = useState(false);
  const [nombreGrupo, setNombreGrupo] = useState("");
  const [iconoGrupo, setIconoGrupo] = useState("documento");

  const recargar = () => listarJerarquia().then(setJerarquia);
  useEffect(() => {
    recargar();
  }, []);

  const dominio = jerarquia.find((d) => d.id === dominioId) ?? null;
  const seccion = dominio?.secciones.find((s) => s.id === seccionId) ?? null;

  const elegirDominio = (id: number) => {
    setDominioId(id);
    setSeccionId("");
    setGrupoId("");
    setCreandoSeccion(false);
    setCreandoGrupo(false);
    onChange(null);
  };

  const elegirSeccion = (id: number) => {
    setSeccionId(id);
    setGrupoId("");
    setCreandoGrupo(false);
    onChange(null);
  };

  const elegirGrupo = (id: number) => {
    setGrupoId(id);
    onChange(id);
  };

  const confirmarSeccion = async () => {
    if (!dominioId || !nombreSeccion.trim()) return;
    const s = await crearSeccion({
      dominioId: Number(dominioId),
      nombre: nombreSeccion.trim(),
      icono: iconoSeccion,
    });
    await recargar();
    setCreandoSeccion(false);
    setNombreSeccion("");
    setSeccionId(s.id);
    setGrupoId("");
    onChange(null);
  };

  const confirmarGrupo = async () => {
    if (!seccionId || !nombreGrupo.trim()) return;
    const g = await crearGrupo({
      seccionId: Number(seccionId),
      nombre: nombreGrupo.trim(),
      icono: iconoGrupo,
    });
    await recargar();
    setCreandoGrupo(false);
    setNombreGrupo("");
    setGrupoId(g.id);
    onChange(g.id);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
      <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.4)", fontWeight: 600 }}>
        Ubicación en el menú
      </Typography>

      {/* Dominio */}
      <TextField
        select
        label="Dominio"
        value={dominioId}
        onChange={(e) => elegirDominio(Number(e.target.value))}
        sx={campoSx}
        fullWidth
      >
        {jerarquia.map((d) => (
          <MenuItem key={d.id} value={d.id}>
            {d.nombre}
          </MenuItem>
        ))}
      </TextField>

      {/* Sección */}
      {dominio && !creandoSeccion && (
        <Box display="flex" gap={1} alignItems="flex-start">
          <TextField
            select
            label="Sección"
            value={seccionId}
            onChange={(e) => elegirSeccion(Number(e.target.value))}
            sx={campoSx}
            fullWidth
          >
            {dominio.secciones.map((s) => (
              <MenuItem key={s.id} value={s.id}>
                {s.nombre}
              </MenuItem>
            ))}
          </TextField>
          <Button
            startIcon={<AddIcon />}
            onClick={() => setCreandoSeccion(true)}
            sx={{ ...botonTexto, mt: 1, whiteSpace: "nowrap" }}
          >
            Nueva
          </Button>
        </Box>
      )}
      {dominio && creandoSeccion && (
        <FormCrear
          titulo="Nueva sección"
          nombre={nombreSeccion}
          setNombre={setNombreSeccion}
          icono={iconoSeccion}
          setIcono={setIconoSeccion}
          onConfirmar={confirmarSeccion}
          onCancelar={() => setCreandoSeccion(false)}
        />
      )}

      {/* Grupo */}
      {seccion && !creandoGrupo && (
        <Box display="flex" gap={1} alignItems="flex-start">
          <TextField
            select
            label="Grupo"
            value={grupoId}
            onChange={(e) => elegirGrupo(Number(e.target.value))}
            sx={campoSx}
            fullWidth
          >
            {seccion.grupos.map((g) => (
              <MenuItem key={g.id} value={g.id}>
                {g.nombre}
              </MenuItem>
            ))}
          </TextField>
          <Button
            startIcon={<AddIcon />}
            onClick={() => setCreandoGrupo(true)}
            sx={{ ...botonTexto, mt: 1, whiteSpace: "nowrap" }}
          >
            Nuevo
          </Button>
        </Box>
      )}
      {seccion && creandoGrupo && (
        <FormCrear
          titulo="Nuevo grupo"
          nombre={nombreGrupo}
          setNombre={setNombreGrupo}
          icono={iconoGrupo}
          setIcono={setIconoGrupo}
          onConfirmar={confirmarGrupo}
          onCancelar={() => setCreandoGrupo(false)}
        />
      )}
    </Box>
  );
}

// Mini-formulario inline para crear sección o grupo (nombre + icono).
function FormCrear({
  titulo,
  nombre,
  setNombre,
  icono,
  setIcono,
  onConfirmar,
  onCancelar,
}: {
  titulo: string;
  nombre: string;
  setNombre: (v: string) => void;
  icono: string;
  setIcono: (v: string) => void;
  onConfirmar: () => void;
  onCancelar: () => void;
}) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 1.5,
        p: "12px 14px",
        borderRadius: 2,
        border: "1px solid rgba(95,208,240,0.3)",
        background: "rgba(12,135,176,0.06)",
      }}
    >
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Typography variant="caption" sx={{ color: "#5fd0f0", fontWeight: 600 }}>
          {titulo}
        </Typography>
        <CloseIcon
          onClick={onCancelar}
          sx={{
            fontSize: 16,
            cursor: "pointer",
            color: "rgba(255,255,255,0.4)",
            "&:hover": { color: "white" },
          }}
        />
      </Box>
      <Box display="flex" gap={1.5}>
        <TextField
          label="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          sx={campoSx}
          fullWidth
          autoFocus
        />
        <TextField
          select
          label="Icono"
          value={icono}
          onChange={(e) => setIcono(e.target.value)}
          sx={{ ...campoSx, minWidth: 140 }}
        >
          {ICONO_OPCIONES.map((k) => (
            <MenuItem key={k} value={k}>
              {k}
            </MenuItem>
          ))}
        </TextField>
      </Box>
      <Box display="flex" justifyContent="flex-end">
        <Button
          variant="contained"
          size="small"
          disabled={!nombre.trim()}
          onClick={onConfirmar}
          sx={{
            backgroundColor: "#0c87b0",
            textTransform: "none",
            fontWeight: 600,
            "&:hover": { backgroundColor: "#0a6e90" },
            "&.Mui-disabled": {
              backgroundColor: "rgba(12,135,176,0.15)",
              color: "rgba(255,255,255,0.25)",
            },
          }}
        >
          Crear
        </Button>
      </Box>
    </Box>
  );
}
