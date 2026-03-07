import * as React from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

interface FechaPickerProps {
  label: string;
  value: any;
  onChange: (value: any) => void;
  format?: string;
  size?: "small" | "medium";
}

const FechaPicker: React.FC<FechaPickerProps> = ({
  label,
  value,
  onChange,
  format = "DD/MM/YYYY",
  size = "small",
}) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        label={label}
        value={value}
        onChange={onChange}
        format={format}
        slotProps={{
          textField: {
            fullWidth: true,
            size,
            sx: { 
                "& .MuiInputBase-input": { fontSize: "12px" },
                "& .MuiInputLabel-root": { 
                    fontSize: "12px",
                    color: "white",
                },
                "& .MuiPickersSectionList-root": { 
                    color: "#ffffff",
                    fontSize: "12px",
                },
                "& .MuiSvgIcon-root, & .MuiButtonBase-root .MuiSvgIcon-root": {
                    color: "white",
                },
                "& .MuiInputBase-root": {
                    color: "white",
                    borderColor: "white",
                },
                "& fieldset": {
                    borderColor: "rgba(255, 255, 255, 0.3)",
                },
                "&:hover fieldset": {
                    borderColor: "white !important",
                },
                "&.Mui-focused fieldset": {
                    borderColor: "white !important", // borde blanco al hacer focus
                },
                "& .MuiOutlinedInput-root.Mui-focused fieldset, & .MuiOutlinedInput-root:hover fieldset, & .MuiOutlinedInput-root fieldset": {
                    borderColor: "white",
                    },
            },
        },

        popper: {
            sx: {
              "& .MuiPaper-root": {
                backgroundColor: "#324a61ff",
                color: "white",
                "& .MuiPickersDay-root": {
                  color: "white",
                },
                "& .MuiPickersDay-root.Mui-selected": {
                  backgroundColor: "white",
                  color: "#123450ff",
                },
              },
            },
          },

        }}
      />
    </LocalizationProvider>
  );
};

export default FechaPicker;
