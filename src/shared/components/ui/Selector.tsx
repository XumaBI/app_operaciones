import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";

export interface Option<T> {
  value: T;
  label: string;
}

interface DropdownProps<T> {
  label: string;
  options: Option<T>[];
  value: T | null;
  onChange: (value: T) => void;
  disabled?: boolean;
  fullWidth?: boolean;
}

function Dropdown<T extends string | number>({
  label,
  options,
  value,
  onChange,
  disabled = false,
  fullWidth = true,
}: DropdownProps<T>) {
  return (
    <FormControl fullWidth={fullWidth} size="small" disabled={disabled}>
      <InputLabel
        shrink
        sx={{
          color: "white",
          fontSize: "12px",
        }}
      >
        {label}
      </InputLabel>

      <Select
        value={value ?? ""}
        label={label}
        onChange={(e) => onChange(e.target.value as T)}
        displayEmpty
        sx={{
          color: "white",
          borderColor: "white",
          "& .MuiSelect-select": {
            fontSize: "12px",
            paddingTop: "5px",
            paddingBottom: "5px",
          },
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "rgba(255, 255, 255, 0.3)",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "white",
          },
          "& .MuiSvgIcon-root": { color: "white" },
        }}
        MenuProps={{
          PaperProps: {
            sx: {
              "& .MuiMenuItem-root": {
                fontSize: "12px",
                paddingTop: "4px",
                paddingBottom: "4px",
              },
            },
          },
        }}
      >
        {/* Placeholder */}
        <MenuItem value="">
          <em style={{ color: "gray" }}>Selecciona una opción</em>
        </MenuItem>

        {options.map((opt) => (
          <MenuItem key={opt.value} value={opt.value}>
            {opt.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default Dropdown;
