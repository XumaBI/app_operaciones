import { createTheme } from "@mui/material/styles";
import { esES } from "@mui/x-data-grid/locales";

export const darkTheme = createTheme(
  {
    palette: {
      mode: "dark",
      background: {
        default: "rgba(0, 0, 0, 0)",
        paper: "rgba(12, 16, 23, 1)",
      },
      text: {
        primary: "#e4e4e4ff",
      },
    },
  },
  esES
);

