import { useEffect, useMemo, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import CircularProgress from "@mui/material/CircularProgress";

import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import InsertChartOutlinedIcon from "@mui/icons-material/InsertChartOutlined";
import WidgetsOutlinedIcon from "@mui/icons-material/WidgetsOutlined";

import {
  listarElementos,
  crearElemento,
  listarUsuarios,
  guardarPermisos,
} from "../api/adminApi";
import type { AdminUsuario, Elemento, NuevoElemento } from "../types";
import { pageSx, campoSx, dialogPaperSx, botonPrimario, botonTexto } from "./adminUi";
import { SelectorUbicacion } from "./SelectorUbicacion";
import { COMPONENTES_DISPONIBLES } from "../../componentes/registry";

export default function ElementosAdmin() {
  const [elementos, setElementos] = useState<Elemento[]>([]);
  const [cargando, setCargando] = useState(true);
  const [dialogo, setDialogo] = useState(false);

  const recargar = () => {
    setCargando(true);
    listarElementos()
      .then(setElementos)
      .finally(() => setCargando(false));
  };

  useEffect(recargar, []);

  // Agrupa por sección para una lectura más clara del catálogo.
  const porSeccion = useMemo(() => {
    const mapa = new Map<string, Elemento[]>();
    for (const el of elementos) {
      const arr = mapa.get(el.seccion) ?? [];
      arr.push(el);
      mapa.set(el.seccion, arr);
    }
    return [...mapa.entries()];
  }, [elementos]);

  return (
    <Box sx={pageSx}>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={0.5}>
        <Typography variant="h5" fontWeight={600}>
          Informes y elementos
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddCircleOutlineIcon />}
          onClick={() => setDialogo(true)}
          sx={botonPrimario}
        >
          Nuevo elemento
        </Button>
      </Box>
      <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.45)", mb: 4 }}>
        Catálogo de informes (embebidos) y componentes (herramientas) disponibles
        en la app. Lo que crees aquí podrá asignarse a los usuarios.
      </Typography>

      {cargando ? (
        <Box display="flex" alignItems="center" gap={1.5} sx={{ color: "rgba(255,255,255,0.45)" }}>
          <CircularProgress size={18} sx={{ color: "#5fd0f0" }} />
          Cargando elementos…
        </Box>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {porSeccion.map(([seccion, items]) => (
            <Box key={seccion}>
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
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mt: 1 }}>
                {items.map((el) => (
                  <Box
                    key={el.path}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                      p: "10px 14px",
                      borderRadius: 2,
                      border: "1px solid rgba(255,255,255,0.07)",
                      background: "rgba(255,255,255,0.02)",
                    }}
                  >
                    {el.type === "informe" ? (
                      <InsertChartOutlinedIcon sx={{ color: "#5fd0f0", fontSize: 20 }} />
                    ) : (
                      <WidgetsOutlinedIcon sx={{ color: "#e8943a", fontSize: 20 }} />
                    )}
                    <Box flex={1} minWidth={0}>
                      <Typography variant="body2" fontWeight={600}>
                        {el.name}
                      </Typography>
                      <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.4)" }}>
                        {el.grupo} · {el.path}
                      </Typography>
                    </Box>
                    <Chip
                      label={el.type}
                      size="small"
                      sx={{
                        bgcolor:
                          el.type === "informe"
                            ? "rgba(12,135,176,0.16)"
                            : "rgba(232,148,58,0.16)",
                        color: el.type === "informe" ? "#5fd0f0" : "#e8943a",
                        fontWeight: 600,
                        fontSize: "10px",
                        textTransform: "uppercase",
                      }}
                    />
                  </Box>
                ))}
              </Box>
            </Box>
          ))}
        </Box>
      )}

      {dialogo && (
        <DialogElemento
          // Componentes registrados en el front que aún no están en el menú.
          disponibles={COMPONENTES_DISPONIBLES.filter(
            (c) => !elementos.some((e) => e.path === c.id)
          )}
          onClose={() => setDialogo(false)}
          onGuardado={() => {
            setDialogo(false);
            recargar();
          }}
        />
      )}
    </Box>
  );
}

// ── Diálogo: nuevo elemento ───────────────────────────────────────────────────
function DialogElemento({
  disponibles,
  onClose,
  onGuardado,
}: {
  disponibles: { id: string; label: string }[];
  onClose: () => void;
  onGuardado: () => void;
}) {
  const [name, setName] = useState("");
  const [path, setPath] = useState("");
  const [type, setType] = useState<"informe" | "componente">("informe");
  const [url, setUrl] = useState("");
  const [grupoId, setGrupoId] = useState<number | null>(null);
  const [usuarios, setUsuarios] = useState<AdminUsuario[]>([]);
  const [asignarA, setAsignarA] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [guardando, setGuardando] = useState(false);

  // Usuarios disponibles para asignar el elemento recién creado.
  useEffect(() => {
    listarUsuarios().then(setUsuarios);
  }, []);

  // Al cambiar de tipo, el "path" cambia de significado (slug libre vs id de
  // componente registrado), así que se limpia.
  const cambiarTipo = (t: "informe" | "componente") => {
    setType(t);
    setPath("");
    setUrl("");
  };

  // Selecciona un componente registrado: fija el path y, si no hay nombre, lo
  // prerellena con la etiqueta sugerida.
  const elegirComponente = (id: string) => {
    setPath(id);
    if (!name.trim()) {
      const def = disponibles.find((c) => c.id === id);
      if (def) setName(def.label);
    }
  };

  const valido =
    name.trim() &&
    path.trim() &&
    grupoId !== null &&
    (type === "componente" || url.trim());

  const guardar = async () => {
    if (!valido || grupoId === null) return;
    setGuardando(true);
    setError(null);
    const codigo = path.trim();
    const input: NuevoElemento = {
      name: name.trim(),
      path: codigo,
      type,
      grupoId,
      ...(type === "informe" ? { url: url.trim() } : {}),
    };
    try {
      await crearElemento(input);
      // Asigna el nuevo elemento a los usuarios seleccionados (añade el path a
      // sus permisos sin tocar el resto).
      await Promise.all(
        asignarA.map((u) => {
          const usuario = usuarios.find((x) => x.usuario === u);
          if (!usuario) return Promise.resolve();
          const permisos = [...new Set([...usuario.permisos, codigo])];
          return guardarPermisos(u, permisos);
        })
      );
      onGuardado();
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo crear el elemento.");
      setGuardando(false);
    }
  };

  return (
    <Dialog open onClose={onClose} slotProps={{ paper: { sx: dialogPaperSx } }}>
      <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
        <AddCircleOutlineIcon sx={{ color: "#5fd0f0" }} />
        Nuevo elemento
      </DialogTitle>
      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
        <TextField
          select
          label="Tipo"
          value={type}
          onChange={(e) => cambiarTipo(e.target.value as "informe" | "componente")}
          sx={campoSx}
          fullWidth
        >
          <MenuItem value="informe">Informe (embebido por URL)</MenuItem>
          <MenuItem value="componente">Componente (herramienta del front)</MenuItem>
        </TextField>

        {type === "componente" ? (
          disponibles.length > 0 ? (
            <TextField
              select
              label="Componente"
              value={path}
              onChange={(e) => elegirComponente(e.target.value)}
              helperText="Solo componentes ya desplegados en el front y aún sin registrar."
              sx={campoSx}
              fullWidth
            >
              {disponibles.map((c) => (
                <MenuItem key={c.id} value={c.id}>
                  {c.label} ({c.id})
                </MenuItem>
              ))}
            </TextField>
          ) : (
            <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.5)" }}>
              No hay componentes nuevos por registrar. Para añadir uno, primero
              debe programarse y desplegarse en el front.
            </Typography>
          )
        ) : (
          <>
            <TextField
              label="Path (slug único)"
              value={path}
              onChange={(e) => setPath(e.target.value)}
              helperText="Identificador único del informe, ej. ejecucion-promigas."
              sx={campoSx}
              fullWidth
            />
            <TextField
              label="URL del informe"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              sx={campoSx}
              fullWidth
            />
          </>
        )}

        <TextField
          label="Nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
          sx={campoSx}
          fullWidth
        />

        <SelectorUbicacion onChange={setGrupoId} />

        <TextField
          select
          label="Asignar a usuarios (opcional)"
          value={asignarA}
          onChange={(e) =>
            setAsignarA(
              typeof e.target.value === "string"
                ? e.target.value.split(",")
                : (e.target.value as unknown as string[])
            )
          }
          sx={campoSx}
          fullWidth
          slotProps={{
            select: {
              multiple: true,
              renderValue: (sel) =>
                (sel as string[]).length === 0
                  ? "Ninguno"
                  : `${(sel as string[]).length} usuario(s)`,
            },
          }}
          helperText="Concede acceso a este elemento al crearlo."
        >
          {usuarios.map((u) => (
            <MenuItem key={u.usuario} value={u.usuario}>
              {u.nombre} (@{u.usuario})
            </MenuItem>
          ))}
        </TextField>
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
          {guardando ? "Creando…" : "Crear elemento"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
