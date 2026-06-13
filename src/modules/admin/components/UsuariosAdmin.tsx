import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Chip from "@mui/material/Chip";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";

import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import LockResetIcon from "@mui/icons-material/LockReset";

import {
  listarUsuarios,
  crearUsuario,
  actualizarDatosUsuario,
  cambiarClave,
} from "../api/adminApi";
import type { AdminUsuario } from "../types";
import {
  pageSx,
  campoSx,
  dialogPaperSx,
  botonPrimario,
  botonTexto,
} from "./adminUi";

type Modo =
  | { tipo: "crear" }
  | { tipo: "editar"; usuario: AdminUsuario }
  | { tipo: "clave"; usuario: AdminUsuario }
  | null;

export default function UsuariosAdmin() {
  const [usuarios, setUsuarios] = useState<AdminUsuario[]>([]);
  const [cargando, setCargando] = useState(true);
  const [modo, setModo] = useState<Modo>(null);

  const recargar = () => {
    setCargando(true);
    listarUsuarios()
      .then(setUsuarios)
      .finally(() => setCargando(false));
  };

  useEffect(recargar, []);

  return (
    <Box sx={pageSx}>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={0.5}>
        <Typography variant="h5" fontWeight={600}>
          Usuarios y contraseñas
        </Typography>
        <Button
          variant="contained"
          startIcon={<PersonAddAltIcon />}
          onClick={() => setModo({ tipo: "crear" })}
          sx={botonPrimario}
        >
          Nuevo usuario
        </Button>
      </Box>
      <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.45)", mb: 4 }}>
        Crea usuarios, edita sus datos y restablece contraseñas. Las asignaciones
        de acceso se gestionan en la sección Asignaciones.
      </Typography>

      {cargando ? (
        <Box display="flex" alignItems="center" gap={1.5} sx={{ color: "rgba(255,255,255,0.45)" }}>
          <CircularProgress size={18} sx={{ color: "#5fd0f0" }} />
          Cargando usuarios…
        </Box>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {usuarios.map((u) => (
            <Box
              key={u.usuario}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                p: "12px 16px",
                borderRadius: 2,
                border: "1px solid rgba(255,255,255,0.07)",
                background: "rgba(255,255,255,0.02)",
              }}
            >
              <Box flex={1} minWidth={0}>
                <Typography variant="body2" fontWeight={600}>
                  {u.nombre}
                </Typography>
                <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.4)" }}>
                  @{u.usuario}
                </Typography>
              </Box>
              <Chip
                label={`${u.permisos.length} acceso${u.permisos.length !== 1 ? "s" : ""}`}
                size="small"
                sx={{
                  bgcolor: "rgba(12,135,176,0.16)",
                  color: "#5fd0f0",
                  fontWeight: 600,
                  fontSize: "11px",
                }}
              />
              <Tooltip title="Editar datos">
                <IconButton
                  size="small"
                  onClick={() => setModo({ tipo: "editar", usuario: u })}
                  sx={{ color: "rgba(255,255,255,0.5)", "&:hover": { color: "white" } }}
                >
                  <EditOutlinedIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Cambiar contraseña">
                <IconButton
                  size="small"
                  onClick={() => setModo({ tipo: "clave", usuario: u })}
                  sx={{ color: "rgba(255,255,255,0.5)", "&:hover": { color: "#5fd0f0" } }}
                >
                  <LockResetIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          ))}
        </Box>
      )}

      {modo?.tipo === "crear" && (
        <DialogUsuario
          onClose={() => setModo(null)}
          onGuardado={() => {
            setModo(null);
            recargar();
          }}
        />
      )}
      {modo?.tipo === "editar" && (
        <DialogEditar
          usuario={modo.usuario}
          onClose={() => setModo(null)}
          onGuardado={() => {
            setModo(null);
            recargar();
          }}
        />
      )}
      {modo?.tipo === "clave" && (
        <DialogClave usuario={modo.usuario} onClose={() => setModo(null)} />
      )}
    </Box>
  );
}

// ── Diálogo: nuevo usuario ────────────────────────────────────────────────────
function DialogUsuario({
  onClose,
  onGuardado,
}: {
  onClose: () => void;
  onGuardado: () => void;
}) {
  const [usuario, setUsuario] = useState("");
  const [nombre, setNombre] = useState("");
  const [clave, setClave] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [guardando, setGuardando] = useState(false);

  const valido = usuario.trim() && nombre.trim() && clave.length >= 4;

  const guardar = async () => {
    if (!valido) return;
    setGuardando(true);
    setError(null);
    try {
      await crearUsuario({ usuario: usuario.trim(), nombre: nombre.trim(), clave });
      onGuardado();
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo crear el usuario.");
      setGuardando(false);
    }
  };

  return (
    <Dialog open onClose={onClose} slotProps={{ paper: { sx: dialogPaperSx } }}>
      <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
        <PersonAddAltIcon sx={{ color: "#5fd0f0" }} />
        Nuevo usuario
      </DialogTitle>
      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
        <TextField
          label="Identificador (usuario)"
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
          sx={campoSx}
          fullWidth
          autoFocus
        />
        <TextField
          label="Nombre completo"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          sx={campoSx}
          fullWidth
        />
        <TextField
          label="Contraseña"
          type="password"
          value={clave}
          onChange={(e) => setClave(e.target.value)}
          helperText="Mínimo 4 caracteres"
          sx={campoSx}
          fullWidth
        />
        {error && (
          <Typography variant="caption" sx={{ color: "#ef4444" }}>
            {error}
          </Typography>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
        <Button onClick={onClose} sx={botonTexto}>
          Cancelar
        </Button>
        <Button
          variant="contained"
          disabled={!valido || guardando}
          onClick={guardar}
          sx={botonPrimario}
        >
          {guardando ? "Creando…" : "Crear usuario"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// ── Diálogo: editar datos ─────────────────────────────────────────────────────
function DialogEditar({
  usuario,
  onClose,
  onGuardado,
}: {
  usuario: AdminUsuario;
  onClose: () => void;
  onGuardado: () => void;
}) {
  const [nombre, setNombre] = useState(usuario.nombre);
  const [guardando, setGuardando] = useState(false);

  const guardar = async () => {
    if (!nombre.trim()) return;
    setGuardando(true);
    await actualizarDatosUsuario(usuario.usuario, { nombre: nombre.trim() });
    onGuardado();
  };

  return (
    <Dialog open onClose={onClose} slotProps={{ paper: { sx: dialogPaperSx } }}>
      <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
        <EditOutlinedIcon sx={{ color: "#5fd0f0" }} />
        Editar datos · @{usuario.usuario}
      </DialogTitle>
      <DialogContent sx={{ pt: 1 }}>
        <TextField
          label="Nombre completo"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          sx={campoSx}
          fullWidth
          autoFocus
        />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
        <Button onClick={onClose} sx={botonTexto}>
          Cancelar
        </Button>
        <Button
          variant="contained"
          disabled={!nombre.trim() || guardando}
          onClick={guardar}
          sx={botonPrimario}
        >
          {guardando ? "Guardando…" : "Guardar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// ── Diálogo: cambiar contraseña ───────────────────────────────────────────────
function DialogClave({
  usuario,
  onClose,
}: {
  usuario: AdminUsuario;
  onClose: () => void;
}) {
  const [clave, setClave] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [listo, setListo] = useState(false);

  const coincide = clave.length >= 4 && clave === confirmar;

  const guardar = async () => {
    if (!coincide) return;
    setGuardando(true);
    await cambiarClave(usuario.usuario, clave);
    setGuardando(false);
    setListo(true);
  };

  return (
    <Dialog open onClose={onClose} slotProps={{ paper: { sx: dialogPaperSx } }}>
      <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
        <LockResetIcon sx={{ color: "#5fd0f0" }} />
        Cambiar contraseña · @{usuario.usuario}
      </DialogTitle>
      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
        {listo ? (
          <Typography variant="body2" sx={{ color: "#5AE280" }}>
            Contraseña actualizada correctamente.
          </Typography>
        ) : (
          <>
            <TextField
              label="Nueva contraseña"
              type="password"
              value={clave}
              onChange={(e) => setClave(e.target.value)}
              sx={campoSx}
              fullWidth
              autoFocus
            />
            <TextField
              label="Confirmar contraseña"
              type="password"
              value={confirmar}
              onChange={(e) => setConfirmar(e.target.value)}
              error={confirmar.length > 0 && clave !== confirmar}
              helperText={
                confirmar.length > 0 && clave !== confirmar
                  ? "Las contraseñas no coinciden"
                  : "Mínimo 4 caracteres"
              }
              sx={campoSx}
              fullWidth
            />
          </>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
        <Button onClick={onClose} sx={botonTexto}>
          {listo ? "Cerrar" : "Cancelar"}
        </Button>
        {!listo && (
          <Button
            variant="contained"
            disabled={!coincide || guardando}
            onClick={guardar}
            sx={botonPrimario}
          >
            {guardando ? "Guardando…" : "Cambiar contraseña"}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
