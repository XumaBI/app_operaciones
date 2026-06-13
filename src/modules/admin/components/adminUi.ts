import type { SxProps, Theme } from "@mui/material/styles";

// Estilos compartidos del panel de Configuración, alineados con el tema oscuro
// del resto de la app (ver Ejecucion.tsx / sidebar.css).

export const pageSx: SxProps<Theme> = {
  p: "40px 32px",
  maxWidth: 920,
  color: "white",
};

// Campo de texto sobre fondo oscuro.
export const campoSx: SxProps<Theme> = {
  "& .MuiInputBase-root": { color: "white" },
  "& .MuiInputBase-input": { color: "white" },
  "& .MuiInputLabel-root": { color: "rgba(255,255,255,0.5)" },
  "& .MuiInputLabel-root.Mui-focused": { color: "#5fd0f0" },
  "& .MuiFormHelperText-root": { color: "rgba(255,255,255,0.35)" },
  "& .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255,255,255,0.15)" },
  "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255,255,255,0.3)" },
  "& .Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#0c87b0" },
};

export const dialogPaperSx: SxProps<Theme> = {
  backgroundColor: "#151c27",
  color: "white",
  borderRadius: 2,
  minWidth: 460,
  border: "1px solid rgba(255,255,255,0.07)",
};

export const botonPrimario: SxProps<Theme> = {
  backgroundColor: "#0c87b0",
  textTransform: "none",
  fontWeight: 600,
  px: 2.5,
  "&:hover": { backgroundColor: "#0a6e90" },
  "&.Mui-disabled": {
    backgroundColor: "rgba(12,135,176,0.15)",
    color: "rgba(255,255,255,0.25)",
  },
};

export const botonTexto: SxProps<Theme> = {
  textTransform: "none",
  color: "rgba(255,255,255,0.5)",
  "&:hover": { color: "white" },
};
