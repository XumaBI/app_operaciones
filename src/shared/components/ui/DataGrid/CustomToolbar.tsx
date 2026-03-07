// CustomToolbar.tsx
import * as React from "react";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";

import InputAdornment from "@mui/material/InputAdornment";

import {
  Toolbar,
  ToolbarButton,
  ExportCsv,
  ExportPrint,
  QuickFilterTrigger,
  QuickFilterControl,
  QuickFilterClear,
} from "@mui/x-data-grid";

import FileDownloadIcon from "@mui/icons-material/FileDownload";
import PrintIcon from "@mui/icons-material/Print";
import SearchIcon from "@mui/icons-material/Search";
import CancelIcon from "@mui/icons-material/Cancel";

import { StyledQuickFilter, StyledTextField } from "./styles";

export default function CustomToolbar() {
  return (
    <Toolbar>
      <Tooltip title="Descargar CSV">
        <ExportCsv render={<ToolbarButton />}>
          <FileDownloadIcon fontSize="small" />
        </ExportCsv>
      </Tooltip>

      <Tooltip title="Imprimir">
        <ExportPrint render={<ToolbarButton />}>
          <PrintIcon fontSize="small" />
        </ExportPrint>
      </Tooltip>

      <StyledQuickFilter>
        <QuickFilterTrigger
          render={(triggerProps, state) => {
            const { ref, ...rest } = triggerProps as {
              ref?: React.Ref<HTMLButtonElement>;
            } & Record<string, any>;

            return (
              <Tooltip title="Buscar">
                <Box
                  sx={{
                    gridArea: "1 / 1",
                    zIndex: 1,
                    opacity: state.expanded ? 0 : 1,
                    pointerEvents: state.expanded ? "none" : "auto",
                    transition: (theme) => theme.transitions.create("opacity"),
                  }}
                >
                  <ToolbarButton
                    {...(rest as Record<string, any>)}
                    ref={ref as React.Ref<HTMLButtonElement>}
                    color="default"
                    aria-disabled={state.expanded}
                  >
                    <SearchIcon fontSize="small" />
                  </ToolbarButton>
                </Box>
              </Tooltip>
            );
          }}
        />

        <QuickFilterControl
          render={({ ref, ...controlProps }, state) => (
            <StyledTextField
              {...(controlProps as Record<string, any>)}
              expanded={state.expanded}
              inputRef={ref as React.Ref<HTMLInputElement>}
              aria-label="Buscar"
              placeholder="Buscar..."
              size="small"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" />
                    </InputAdornment>
                  ),
                  endAdornment: state.value ? (
                    <InputAdornment position="end">
                      <QuickFilterClear
                        edge="end"
                        size="small"
                        aria-label="Limpiar búsqueda"
                        material={{ sx: { marginRight: -0.75 } }}
                      >
                        <CancelIcon fontSize="small" />
                      </QuickFilterClear>
                    </InputAdornment>
                  ) : null,
                  ...(controlProps.slotProps?.input ?? {}),
                },
                ...(controlProps.slotProps ?? {}),
              }}
            />
          )}
        />
      </StyledQuickFilter>
    </Toolbar>
  );
}

