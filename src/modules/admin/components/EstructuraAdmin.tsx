import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";

import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddIcon from "@mui/icons-material/Add";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

import {
  listarJerarquia,
  crearSeccion,
  crearGrupo,
  actualizarSeccion,
  actualizarGrupo,
  eliminarSeccion,
  eliminarGrupo,
  reordenarSecciones,
  reordenarGrupos,
} from "../api/adminApi";
import type { DominioJerarquia } from "../types";
import { ICONOS } from "../../../shared/components/layout/Sidebar/iconos";
import { pageSx, campoSx, dialogPaperSx, botonPrimario, botonTexto } from "./adminUi";

const ICONO_OPCIONES = Object.keys(ICONOS);

type EditState = { tipo: "seccion" | "grupo"; id: number } | null;
type AddState = { tipo: "seccion"; dominioId: number } | { tipo: "grupo"; seccionId: number } | null;
type Confirm = { mensaje: string; accion: () => Promise<void> } | null;

export default function EstructuraAdmin() {
  const [jerarquia, setJerarquia] = useState<DominioJerarquia[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [edit, setEdit] = useState<EditState>(null);
  const [add, setAdd] = useState<AddState>(null);
  const [nombre, setNombre] = useState("");
  const [icono, setIcono] = useState("documento");
  const [confirm, setConfirm] = useState<Confirm>(null);

  const recargar = () => {
    setCargando(true);
    listarJerarquia()
      .then(setJerarquia)
      .finally(() => setCargando(false));
  };

  useEffect(recargar, []);

  const cerrarEdicion = () => {
    setEdit(null);
    setAdd(null);
    setNombre("");
  };

  const abrirEdit = (tipo: "seccion" | "grupo", id: number, n: string, ic: string) => {
    setAdd(null);
    setEdit({ tipo, id });
    setNombre(n);
    setIcono(ic);
  };

  const abrirAdd = (estado: AddState, iconoInicial: string) => {
    setEdit(null);
    setAdd(estado);
    setNombre("");
    setIcono(iconoInicial);
  };

  const ejecutar = async (fn: () => Promise<unknown>) => {
    setError(null);
    try {
      await fn();
      cerrarEdicion();
      recargar();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Operación fallida.");
    }
  };

  const guardarEdit = () =>
    ejecutar(async () => {
      if (!edit || !nombre.trim()) return;
      if (edit.tipo === "seccion")
        await actualizarSeccion(edit.id, { nombre: nombre.trim(), icono });
      else await actualizarGrupo(edit.id, { nombre: nombre.trim(), icono });
    });

  const guardarAdd = () =>
    ejecutar(async () => {
      if (!add || !nombre.trim()) return;
      if (add.tipo === "seccion")
        await crearSeccion({ dominioId: add.dominioId, nombre: nombre.trim(), icono });
      else await crearGrupo({ seccionId: add.seccionId, nombre: nombre.trim(), icono });
    });

  const moverSecciones = (d: DominioJerarquia, idx: number, dir: -1 | 1) => {
    const ids = d.secciones.map((s) => s.id);
    const j = idx + dir;
    if (j < 0 || j >= ids.length) return;
    [ids[idx], ids[j]] = [ids[j], ids[idx]];
    ejecutar(() => reordenarSecciones(d.id, ids));
  };

  const moverGrupos = (seccionId: number, grupos: { id: number }[], idx: number, dir: -1 | 1) => {
    const ids = grupos.map((g) => g.id);
    const j = idx + dir;
    if (j < 0 || j >= ids.length) return;
    [ids[idx], ids[j]] = [ids[j], ids[idx]];
    ejecutar(() => reordenarGrupos(seccionId, ids));
  };

  return (
    <Box sx={pageSx}>
      <Typography variant="h5" fontWeight={600} mb={0.5}>
        Estructura del menú
      </Typography>
      <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.45)", mb: 4 }}>
        Renombra, reordena, elimina o añade secciones y grupos. Los cambios afectan
        cómo se agrupan los elementos en el menú de los usuarios.
      </Typography>

      {error && (
        <Typography variant="caption" sx={{ color: "#ef4444", display: "block", mb: 2 }}>
          {error}
        </Typography>
      )}

      {cargando ? (
        <Box display="flex" alignItems="center" gap={1.5} sx={{ color: "rgba(255,255,255,0.45)" }}>
          <CircularProgress size={18} sx={{ color: "#5fd0f0" }} />
          Cargando estructura…
        </Box>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {jerarquia.map((d) => (
            <Box key={d.id}>
              <Typography
                variant="caption"
                sx={{
                  color: "rgba(255,255,255,0.4)",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                {d.nombre}
              </Typography>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mt: 1 }}>
                {d.secciones.map((s, si) => (
                  <Box
                    key={s.id}
                    sx={{
                      borderRadius: 2,
                      border: "1px solid rgba(255,255,255,0.07)",
                      background: "rgba(255,255,255,0.02)",
                      p: "8px 10px",
                    }}
                  >
                    {/* Fila de sección */}
                    {edit?.tipo === "seccion" && edit.id === s.id ? (
                      <FilaEdicion
                        nombre={nombre}
                        setNombre={setNombre}
                        icono={icono}
                        setIcono={setIcono}
                        onOk={guardarEdit}
                        onCancel={cerrarEdicion}
                      />
                    ) : (
                      <Fila
                        nombre={s.nombre}
                        peso={600}
                        idx={si}
                        total={d.secciones.length}
                        onUp={() => moverSecciones(d, si, -1)}
                        onDown={() => moverSecciones(d, si, 1)}
                        onEdit={() => abrirEdit("seccion", s.id, s.nombre, s.icono)}
                        onDelete={() =>
                          setConfirm({
                            mensaje: `¿Eliminar la sección "${s.nombre}"?`,
                            accion: () => eliminarSeccion(s.id),
                          })
                        }
                      />
                    )}

                    {/* Grupos de la sección */}
                    <Box sx={{ pl: 3, mt: 0.5, display: "flex", flexDirection: "column", gap: 0.5 }}>
                      {s.grupos.map((g, gi) =>
                        edit?.tipo === "grupo" && edit.id === g.id ? (
                          <FilaEdicion
                            key={g.id}
                            nombre={nombre}
                            setNombre={setNombre}
                            icono={icono}
                            setIcono={setIcono}
                            onOk={guardarEdit}
                            onCancel={cerrarEdicion}
                          />
                        ) : (
                          <Fila
                            key={g.id}
                            nombre={g.nombre}
                            peso={400}
                            idx={gi}
                            total={s.grupos.length}
                            onUp={() => moverGrupos(s.id, s.grupos, gi, -1)}
                            onDown={() => moverGrupos(s.id, s.grupos, gi, 1)}
                            onEdit={() => abrirEdit("grupo", g.id, g.nombre, g.icono)}
                            onDelete={() =>
                              setConfirm({
                                mensaje: `¿Eliminar el grupo "${g.nombre}"?`,
                                accion: () => eliminarGrupo(g.id),
                              })
                            }
                          />
                        )
                      )}

                      {add?.tipo === "grupo" && add.seccionId === s.id ? (
                        <FilaEdicion
                          nombre={nombre}
                          setNombre={setNombre}
                          icono={icono}
                          setIcono={setIcono}
                          onOk={guardarAdd}
                          onCancel={cerrarEdicion}
                        />
                      ) : (
                        <Button
                          startIcon={<AddIcon />}
                          onClick={() => abrirAdd({ tipo: "grupo", seccionId: s.id }, "documento")}
                          sx={{ ...botonTexto, alignSelf: "flex-start", fontSize: "12px" }}
                        >
                          Añadir grupo
                        </Button>
                      )}
                    </Box>
                  </Box>
                ))}

                {add?.tipo === "seccion" && add.dominioId === d.id ? (
                  <FilaEdicion
                    nombre={nombre}
                    setNombre={setNombre}
                    icono={icono}
                    setIcono={setIcono}
                    onOk={guardarAdd}
                    onCancel={cerrarEdicion}
                  />
                ) : (
                  <Button
                    startIcon={<AddIcon />}
                    onClick={() => abrirAdd({ tipo: "seccion", dominioId: d.id }, "grafico")}
                    sx={{ ...botonTexto, alignSelf: "flex-start" }}
                  >
                    Añadir sección
                  </Button>
                )}
              </Box>
            </Box>
          ))}
        </Box>
      )}

      {/* Confirmación de borrado */}
      <Dialog
        open={!!confirm}
        onClose={() => setConfirm(null)}
        slotProps={{ paper: { sx: dialogPaperSx } }}
      >
        <DialogTitle>Confirmar</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: "rgba(255,255,255,0.6)" }}>
            {confirm?.mensaje}
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
          <Button onClick={() => setConfirm(null)} sx={botonTexto}>
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              const c = confirm;
              setConfirm(null);
              if (c) ejecutar(c.accion);
            }}
            sx={{ ...botonPrimario, backgroundColor: "#b03a2e", "&:hover": { backgroundColor: "#92302699" } }}
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

// ── Fila de lectura (nombre + controles) ──────────────────────────────────────
function Fila({
  nombre,
  peso,
  idx,
  total,
  onUp,
  onDown,
  onEdit,
  onDelete,
}: {
  nombre: string;
  peso: number;
  idx: number;
  total: number;
  onUp: () => void;
  onDown: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const iconBtn = { color: "rgba(255,255,255,0.45)", "&:hover": { color: "white" } } as const;
  return (
    <Box display="flex" alignItems="center" gap={0.5}>
      <Box display="flex" flexDirection="column">
        <IconButton size="small" disabled={idx === 0} onClick={onUp} sx={{ p: 0.1, ...iconBtn }}>
          <KeyboardArrowUpIcon sx={{ fontSize: 16 }} />
        </IconButton>
        <IconButton
          size="small"
          disabled={idx === total - 1}
          onClick={onDown}
          sx={{ p: 0.1, ...iconBtn }}
        >
          <KeyboardArrowDownIcon sx={{ fontSize: 16 }} />
        </IconButton>
      </Box>
      <Typography variant="body2" sx={{ flex: 1, fontWeight: peso }}>
        {nombre}
      </Typography>
      <Tooltip title="Renombrar">
        <IconButton size="small" onClick={onEdit} sx={iconBtn}>
          <EditOutlinedIcon sx={{ fontSize: 16 }} />
        </IconButton>
      </Tooltip>
      <Tooltip title="Eliminar">
        <IconButton size="small" onClick={onDelete} sx={{ color: "rgba(255,255,255,0.45)", "&:hover": { color: "#ef4444" } }}>
          <DeleteOutlineIcon sx={{ fontSize: 16 }} />
        </IconButton>
      </Tooltip>
    </Box>
  );
}

// ── Fila de edición / alta (nombre + icono + ok/cancel) ───────────────────────
function FilaEdicion({
  nombre,
  setNombre,
  icono,
  setIcono,
  onOk,
  onCancel,
}: {
  nombre: string;
  setNombre: (v: string) => void;
  icono: string;
  setIcono: (v: string) => void;
  onOk: () => void;
  onCancel: () => void;
}) {
  return (
    <Box display="flex" alignItems="center" gap={1} py={0.5}>
      <TextField
        size="small"
        label="Nombre"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onOk()}
        sx={{ ...campoSx, flex: 1 }}
        autoFocus
      />
      <TextField
        size="small"
        select
        label="Icono"
        value={icono}
        onChange={(e) => setIcono(e.target.value)}
        sx={{ ...campoSx, minWidth: 130 }}
      >
        {ICONO_OPCIONES.map((k) => (
          <MenuItem key={k} value={k}>
            {k}
          </MenuItem>
        ))}
      </TextField>
      <IconButton
        size="small"
        disabled={!nombre.trim()}
        onClick={onOk}
        sx={{ color: "#5AE280", "&.Mui-disabled": { color: "rgba(255,255,255,0.2)" } }}
      >
        <CheckIcon sx={{ fontSize: 18 }} />
      </IconButton>
      <IconButton size="small" onClick={onCancel} sx={{ color: "rgba(255,255,255,0.45)" }}>
        <CloseIcon sx={{ fontSize: 18 }} />
      </IconButton>
    </Box>
  );
}
