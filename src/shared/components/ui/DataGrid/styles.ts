// styles.ts
import { styled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import { QuickFilter } from "@mui/x-data-grid";

export const StyledQuickFilter = styled(QuickFilter)({
  display: "grid",
  alignItems: "center",
  marginLeft: "auto",
  "--trigger-width": "40px",
  minWidth: 0,
});

export const StyledTextField = styled(TextField)<{ expanded: boolean }>(
  ({ theme, expanded }) => ({
    gridArea: "1 / 1",
    overflowX: "clip",
    width: expanded ? 260 : "var(--trigger-width)",
    minWidth: 0,
    maxWidth: "100%",
    boxSizing: "border-box",
    opacity: expanded ? 1 : 0,
    transition: theme.transitions.create(["width", "opacity"]),
  })
);


