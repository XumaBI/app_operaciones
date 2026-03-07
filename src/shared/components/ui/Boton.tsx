import Button from "@mui/material/Button";

interface BotonProps {
  label: string;                // Texto del botón
  onClick?: () => void;         // Acción al hacer clic
  color?: "primary" | "secondary" | "success" | "error" | "warning" | "info";
  variant?: "contained" | "outlined" | "text";
  size?: "small" | "medium" | "large";
  icon?: React.ReactNode;       // Si quieres pasar un ícono
  disabled?: boolean;
  fullWidth?: boolean;
  sx?: object;                  // Permite personalizar estilos
}

export default function Boton({
  label,
  onClick,
  color = "primary",
  variant = "contained",
  size = "medium",
  icon,
  disabled = false,
  fullWidth = false,
  sx = {},
}: BotonProps) {
  return (
    <Button
      variant={variant}
      
      color={color}
      size={size}
      onClick={onClick}
      startIcon={icon}
      disabled={disabled}
      fullWidth={fullWidth}
      sx={{
        borderRadius: "10px",
        textTransform: "none",
        fontWeight: 600,
        fontSize: "14px",
        padding: "8px 20px",
        boxShadow:
          variant === "contained" ? "0px 3px 6px rgba(0,0,0,0.2)" : "none",
        "&:hover": {
          transform: "translateY(-2px)",
          transition: "all 0.2s ease",
        },
        ...sx,
      }}
    >
      {label}
    </Button>
  );
}