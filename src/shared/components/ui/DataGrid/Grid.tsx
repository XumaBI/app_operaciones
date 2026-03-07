import { useState, useEffect } from "react";
import axios from "axios";

import Box from "@mui/material/Box";
import GlobalStyles from "@mui/material/GlobalStyles";
import { ThemeProvider } from "@mui/material/styles";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

import { darkTheme } from "./theme";
import CustomToolbar from "./CustomToolbar";

interface CustomGridProps {
  title?: string;
  columns: GridColDef[];
  apiUrl?: string;
  data?: any[];
  onRowsUpdate?: (rows: any[]) => void;
}

export default function Grid({
  title,
  columns,
  apiUrl,
  data,
  onRowsUpdate,
}: CustomGridProps) {
  const [rows, setRows] = useState<any[]>(data || []);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!apiUrl) return;

    setLoading(true);

    axios
      .get<any[]>(apiUrl)
      .then((res) => setRows(res.data))
      .catch((err) => console.error("Error al cargar los datos:", err))
      .finally(() => setLoading(false));
  }, [apiUrl]);

  useEffect(() => {
    if (Array.isArray(data)) {
      setRows(data);
    }
  }, [data]);

  const handleCellEditCommit = (params: any) => {
    const { id, field, value } = params;

    setRows((prevRows) => {
      const updatedRows = prevRows.map((row) => {
        if (row.id !== id) return row;

        const parsedValue =
          field === "cantidad" || field === "prima" || field === "ebitda"
            ? value === "" || value === null
              ? null
              : Number(value)
            : value;

        return { ...row, [field]: parsedValue };
      });

      onRowsUpdate?.(updatedRows);
      return updatedRows;
    });
  };

  const dataGridProps = {
    rows,
    columns,
    loading,

    rowHeight: 40,
    columnHeaderHeight: 45,

    initialState: {
      pagination: { paginationModel: { pageSize: 10, page: 0 } },
    },
    pageSizeOptions: [10, 50, 100],

    slots: { toolbar: CustomToolbar },
    showToolbar: true,

    onCellEditCommit: handleCellEditCommit,

    sx: {
      bgcolor: "background.paper",
      color: "text.primary",
      border: "none",
      minWidth: 0,

      "& .MuiDataGrid-virtualScroller": { minWidth: 0 },

      "& .MuiDataGrid-cell": {
        borderBottom: "1px solid rgba(255, 255, 255, 0)",
        minWidth: 0,
      },

      "& .MuiDataGrid-mainContent": {
        borderRadius: 3,
        border: "1px solid rgba(102, 102, 102, 1)",
        fontSize: "12px",
      },

      "& .MuiDataGrid-toolbarContainer": { minHeight: "45px" },

      "& .MuiDataGrid-toolbar": {
        backgroundColor: "rgba(16, 19, 24, 1)",
        border: "none",
      },

      "& .MuiDataGrid-columnHeader": {
        backgroundColor: "rgba(16, 19, 24, 1)",
      },

      "& .MuiTablePagination-root": {
        fontSize: "12px",
        color: "#e4e4e4ff",
      },

      "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows":
        { fontSize: "12px" },

      "& .MuiTablePagination-actions button": {
        color: "#e4e4e4ff",
      },
    },
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <GlobalStyles
        styles={(theme: any) => ({
          ".MuiDataGrid-panel, .MuiDataGrid-paper, .MuiDataGrid-panelContent, .MuiDataGrid-panelWrapper":
            {
              color: theme.palette.text.primary + " !important",
              backgroundColor: "rgba(21, 28, 39, 1) !important",
            },

          ".MuiDataGrid-panel .MuiTypography-root, \
           .MuiDataGrid-panel .MuiFormControlLabel-label, \
           .MuiDataGrid-panel .MuiButton-root": {
            color: theme.palette.text.primary + " !important",
            fontSize: "12px !important",
          },

          ".MuiDataGrid-panel .MuiInputBase-input": {
            color: theme.palette.text.primary + " !important",
          },

          ".MuiDataGrid-panel input::placeholder": {
            color: "rgba(228,228,228,0.7) !important",
            opacity: 1,
          },

          ".MuiDataGrid-menu .MuiListItemText-root .MuiTypography-root": {
            fontSize: "12px !important",
            lineHeight: 1.4,
          },
        })}
      />

      <Box
        sx={{
          height: "100%",
          width: "100%",
          bgcolor: "background.default",
          minWidth: 0,
          overflow: "hidden",
          boxSizing: "border-box",
        }}
      >
        {title && (
          <h2 style={{ color: "white", margin: 0, marginBottom: 12 }}>
            {title}
          </h2>
        )}

        <DataGrid {...(dataGridProps as any)} />
      </Box>
    </ThemeProvider>
  );
}
