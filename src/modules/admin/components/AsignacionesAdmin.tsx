import { useEffect, useMemo, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";

import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

import { listarUsuarios, listarElementos, guardarPermisos } from "../api/adminApi";
import type { AdminUsuario, Elemento } from "../types";
import { pageSx, campoSx, botonPrimario } from "./adminUi";

export default function AsignacionesAdmin() {
  const [usuarios, setUsuarios] = useState<AdminUsuario[]>([]);
  const [elementos, setElementos] = useState<Elemento[]>([]);
  const [cargando, setCargando] = useState(true);

  const [seleccion, setSeleccion] = useState("");
  const [asignados, setAsignados] = useState<Set<string>>(new Set());
  const [guardando, setGuardando] = useState(false);
  const [guardado, setGuardado] = useState(false);

  useEffect(() => {
    Promise.all([listarUsuarios(), listarElementos()])
      .then(([us, els]) => {
        setUsuarios(us);
        setElementos(els);
      })
      .finally(() => setCargando(false));
  }, []);

  const usuarioActual = usuarios.find((u) => u.usuario === seleccion) ?? null;

  // Al elegir usuario, carga sus permisos actuales en el set editable.
  const elegirUsuario = (usuario: string) => {
    setSeleccion(usuario);
    setGuardado(false);
    const u = usuarios.find((x) => x.usuario === usuario);
    setAsignados(new Set(u?.permisos ?? []));
  };

  const toggle = (path: string) => {
    setGuardado(false);
    setAsignados((prev) => {
      const next = new Set(prev);
      if (next.has(path)) next.delete(path);
      else next.add(path);
      return next;
    });
  };

  const porSeccion = useMemo(() => {
    const mapa = new Map<string, Elemento[]>();
    for (const el of elementos) {
      const arr = mapa.get(el.seccion) ?? [];
      arr.push(el);
      mapa.set(el.seccion, arr);
    }
    return [...mapa.entries()];
  }, [elementos]);

  // ¿Cambió algo respecto al estado guardado del usuario?
  const haCambiado = useMemo(() => {
    if (!usuarioActual) return false;
    const original = new Set(usuarioActual.permisos);
    if (original.size !== asignados.size) return true;
    for (const p of asignados) if (!original.has(p)) return true;
    return false;
  }, [usuarioActual, asignados]);

  const guardar = async () => {
    if (!usuarioActual) return;
    setGuardando(true);
    const actualizado = await guardarPermisos(usuarioActual.usuario, [...asignados]);
    setUsuarios((prev) =>
      prev.map((u) => (u.usuario === actualizado.usuario ? actualizado : u))
    );
    setGuardando(false);
    setGuardado(true);
  };

  const toggleSeccion = (items: Elemento[], activar: boolean) => {
    setGuardado(false);
    setAsignados((prev) => {
      const next = new Set(prev);
      for (const el of items) {
        if (activar) next.add(el.path);
        else next.delete(el.path);
      }
      return next;
    });
  };

  return (
    <Box sx={pageSx}>
      <Typography variant="h5" fontWeight={600} mb={0.5}>
        Asignación de accesos
      </Typography>
      <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.45)", mb: 4 }}>
        Selecciona un usuario y marca los elementos a los que tendrá acceso. Los
        cambios se aplican al guardar.
      </Typography>

      {cargando ? (
        <Box display="flex" alignItems="center" gap={1.5} sx={{ color: "rgba(255,255,255,0.45)" }}>
          <CircularProgress size={18} sx={{ color: "#5fd0f0" }} />
          Cargando…
        </Box>
      ) : (
        <>
          <Box display="flex" alignItems="center" gap={2} mb={3} sx={{ maxWidth: 520 }}>
            <TextField
              select
              label="Usuario"
              value={seleccion}
              onChange={(e) => elegirUsuario(e.target.value)}
              sx={campoSx}
              fullWidth
            >
              {usuarios.map((u) => (
                <MenuItem key={u.usuario} value={u.usuario}>
                  {u.nombre} (@{u.usuario})
                </MenuItem>
              ))}
            </TextField>
            {usuarioActual && (
              <Chip
                label={`${asignados.size} asignado${asignados.size !== 1 ? "s" : ""}`}
                size="small"
                sx={{
                  bgcolor: "rgba(12,135,176,0.16)",
                  color: "#5fd0f0",
                  fontWeight: 600,
                  fontSize: "11px",
                }}
              />
            )}
          </Box>

          {usuarioActual ? (
            <>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
                {porSeccion.map(([seccion, items]) => {
                  const todos = items.every((el) => asignados.has(el.path));
                  return (
                    <Box key={seccion}>
                      <Box display="flex" alignItems="center" justifyContent="space-between">
                        <Typography
                          variant="caption"
                          sx={{
                            color: "rgba(255,255,255,0.4)",
                            fontWeight: 600,
                            textTransform: "uppercase",
                            letterSpacing: "0.5px",
                          }}
                        >
                          {seccion}
                        </Typography>
                        <Button
                          size="small"
                          onClick={() => toggleSeccion(items, !todos)}
                          sx={{
                            textTransform: "none",
                            fontSize: "11px",
                            color: "rgba(255,255,255,0.5)",
                            "&:hover": { color: "#5fd0f0" },
                          }}
                        >
                          {todos ? "Quitar todos" : "Asignar todos"}
                        </Button>
                      </Box>
                      <Box
                        sx={{
                          display: "grid",
                          gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
                          gap: 0.5,
                          mt: 0.5,
                        }}
                      >
                        {items.map((el) => (
                          <FormControlLabel
                            key={el.path}
                            control={
                              <Checkbox
                                checked={asignados.has(el.path)}
                                onChange={() => toggle(el.path)}
                                sx={{
                                  color: "rgba(255,255,255,0.3)",
                                  "&.Mui-checked": { color: "#0c87b0" },
                                }}
                              />
                            }
                            label={
                              <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.8)" }}>
                                {el.name}
                              </Typography>
                            }
                          />
                        ))}
                      </Box>
                    </Box>
                  );
                })}
              </Box>

              <Divider sx={{ my: 3, borderColor: "rgba(255,255,255,0.06)" }} />

              <Box display="flex" alignItems="center" justifyContent="flex-end" gap={2}>
                {guardado && (
                  <Box display="flex" alignItems="center" gap={0.7} sx={{ color: "#5AE280" }}>
                    <CheckCircleOutlineIcon fontSize="small" />
                    <Typography variant="caption" fontWeight={600}>
                      Accesos actualizados
                    </Typography>
                  </Box>
                )}
                <Button
                  variant="contained"
                  startIcon={<SaveOutlinedIcon />}
                  disabled={!haCambiado || guardando}
                  onClick={guardar}
                  sx={botonPrimario}
                >
                  {guardando ? "Guardando…" : "Guardar cambios"}
                </Button>
              </Box>
            </>
          ) : (
            <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.35)" }}>
              Selecciona un usuario para ver y editar sus accesos.
            </Typography>
          )}
        </>
      )}
    </Box>
  );
}
