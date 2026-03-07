import { TextField } from "@mui/material";
import {
  GridRenderEditCellParams,
} from "@mui/x-data-grid";

/**
 * Editor numérico genérico para DataGrid
 * - Permite solo números
 * - Soporta null
 * - Formatea con separador es-CO
 * - Alinea el texto a la derecha
 */
export function NumericEditInput<T extends number | null>(
  params: GridRenderEditCellParams<any, T>
) {
  const { id, field, api, value } = params;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Remover puntos (separador visual)
    const raw = event.target.value.replace(/\./g, "");

    // Validar solo números
    if (!/^\d*$/.test(raw)) return;

    // Convertir a número o null
    const numericValue = raw === "" ? null : Number(raw);

    // Actualizar DataGrid
    api.setEditCellValue({ id, field, value: numericValue as T });

    // Actualizar visual
    event.target.value = numericValue?.toLocaleString("es-CO") ?? "";
  };

  return (
    <TextField
      fullWidth
      onChange={handleChange}
      defaultValue={value?.toLocaleString("es-CO") ?? ""}
      inputProps={{ style: { textAlign: "right" } }}
    />
  );
}


