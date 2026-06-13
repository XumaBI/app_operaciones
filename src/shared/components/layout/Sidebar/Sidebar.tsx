import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import "../../../../styles/sidebar.css";
import { filtrarMenuPorPermisos } from "./menuData";
import { SectionSidebar } from "./SectionSidebar";
import { SidebarCollapsed } from "./SidebarCollapsed";
import { useIsMobile } from "../../../hooks/useIsMobile";

type SidebarProps = {
  permisosInformes: string[];
  isClosed: boolean;
  onExpandir: () => void;
  onCerrar: () => void;
};

// De "/informe/ejecucion-promigas" o "/componente/Ejecucion" extrae la hoja activa.
function leafDePath(pathname: string): string | null {
  const partes = pathname.split("/").filter(Boolean);
  return partes.length >= 2 ? partes[1] : null;
}

export function Sidebar({
  permisosInformes,
  isClosed,
  onExpandir,
  onCerrar,
}: SidebarProps) {
  const isMobile = useIsMobile();
  const location = useLocation();
  const activeLeaf = leafDePath(location.pathname);

  const secciones = useMemo(
    () => filtrarMenuPorPermisos(permisosInformes),
    [permisosInformes]
  );

  const lista = (onNavigate?: () => void) =>
    secciones.map((s) => (
      <SectionSidebar
        key={s.name}
        title={s.name}
        iconPath={s.iconPath}
        grupos={s.grupos}
        activeLeaf={activeLeaf}
        onNavigate={onNavigate}
      />
    ));

  // ── Móvil: drawer superpuesto con backdrop ──────────────────────────────
  if (isMobile) {
    const abierto = !isClosed;
    return (
      <>
        <div
          className={`sidebar-overlay ${abierto ? "show" : ""}`}
          onClick={onCerrar}
          aria-hidden="true"
        />
        <aside className={`sidebar sidebar-drawer ${abierto ? "open" : ""}`}>
          <div className="sidebar-content">{lista(onCerrar)}</div>
        </aside>
      </>
    );
  }

  // ── Escritorio contraído: rail de iconos con flyout ─────────────────────
  if (isClosed) {
    return (
      <SidebarCollapsed
        permisosInformes={permisosInformes}
        onExpandir={onExpandir}
        activeLeaf={activeLeaf}
      />
    );
  }

  // ── Escritorio expandido ────────────────────────────────────────────────
  return (
    <aside className="sidebar">
      <div className="sidebar-content">{lista()}</div>
    </aside>
  );
}
