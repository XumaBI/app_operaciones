import { useEffect, useRef, useState } from "react";
import "../../../../styles/sidebar.css";
import { filtrarMenuPorPermisos } from "./menuData";
import type { Seccion } from "./menuData";
import { GroupSidebar } from "./GrupoSidebar";

type SidebarCollapsedProps = {
  permisosInformes: string[];
  onExpandir: () => void;
  activeLeaf?: string | null;
};

type HoverState = { seccion: Seccion; x: number; y: number };

export function SidebarCollapsed({
  permisosInformes = [],
  onExpandir,
  activeLeaf,
}: SidebarCollapsedProps) {
  const [hovered, setHovered] = useState<HoverState | null>(null);
  const hoverActivoRef = useRef(false);
  const leaveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const secciones = filtrarMenuPorPermisos(permisosInformes);

  const limpiarTimeout = () => {
    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current);
      leaveTimeoutRef.current = null;
    }
  };

  // Limpieza al desmontar.
  useEffect(() => limpiarTimeout, []);

  const handleMouseEnter = (
    e: React.MouseEvent<HTMLDivElement>,
    seccion: Seccion
  ) => {
    limpiarTimeout();
    const rect = e.currentTarget.getBoundingClientRect();
    // Altura estimada del flyout para mantenerlo dentro de la pantalla.
    const altoEstimado = Math.min(
      window.innerHeight * 0.7,
      56 + seccion.grupos.length * 40
    );
    const y = Math.min(rect.top, window.innerHeight - altoEstimado - 12);
    setHovered({ seccion, x: rect.right + 8, y: Math.max(8, y) });
  };

  const programarCierre = () => {
    limpiarTimeout();
    leaveTimeoutRef.current = setTimeout(() => {
      if (!hoverActivoRef.current) setHovered(null);
    }, 180);
  };

  return (
    <aside className="sidebar sidebar-rail">
      <div className="sidebar-content">
        {secciones.map((s) => {
          const seccionActiva = s.grupos.some((g) =>
            g.informes.some((i) => i.path === activeLeaf)
          );
          return (
            <div
              key={s.name}
              className={`sidebar-icon ${seccionActiva ? "has-active" : ""}`}
              onClick={onExpandir}
              onMouseEnter={(e) => handleMouseEnter(e, s)}
              onMouseLeave={programarCierre}
            >
              <svg viewBox="0 0 24 24" className="sidebar-icon-svg" aria-hidden="true">
                <path d={s.iconPath} />
              </svg>
              <span className="sidebar-icon-label">{s.name}</span>
            </div>
          );
        })}
      </div>

      {hovered && (
        <div
          className="hover-box"
          style={{ left: hovered.x, top: hovered.y }}
          onMouseEnter={() => {
            limpiarTimeout();
            hoverActivoRef.current = true;
          }}
          onMouseLeave={() => {
            hoverActivoRef.current = false;
            setHovered(null);
          }}
        >
          <div className="hover-box-header">{hovered.seccion.name}</div>
          <div className="hover-box-content">
            {hovered.seccion.grupos.map((g) => (
              <GroupSidebar
                key={g.name}
                title={g.name}
                iconPath={g.iconPath}
                informes={g.informes}
                activeLeaf={activeLeaf}
                onNavigate={onExpandir}
              />
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}
