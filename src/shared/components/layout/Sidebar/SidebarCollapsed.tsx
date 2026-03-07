import React, { useState } from "react";
import "../../../../styles/sidebar.css";
import { MENU_DATA, Seccion } from "./menuData";
import { GroupSidebar } from "./GrupoSidebar";

type SidebarCollapsedProps = {
  permisosSecciones: string[];
  permisosGrupo?: string[];
  permisosInformes: string[];
  onExpandir: () => void;
};

export function SidebarCollapsed({
  permisosSecciones,
  permisosInformes = [],
  onExpandir,
}: SidebarCollapsedProps) {
  const [hovered, setHovered] = useState<{
    seccion: Seccion;
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);

  const [isHoverBoxActive, setIsHoverBoxActive] = useState(false);
  const [leaveTimeout, setLeaveTimeout] = useState<ReturnType<typeof setTimeout> | null>(null);

  const seccionesFiltradas = MENU_DATA.filter((s) =>
    permisosSecciones.includes(s.path.replace("/", ""))
  );

  const handleMouseEnter = (
    e: React.MouseEvent<HTMLDivElement>,
    seccion: Seccion
  ) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setHovered({
      seccion,
      x: rect.right + 8,
      y: rect.top,
      width: rect.width,
      height: rect.height,
    });
    if (leaveTimeout) clearTimeout(leaveTimeout);
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!hovered) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const { clientX, clientY } = e;

    const saliendoPorDerecha =
      clientX > rect.right && clientY >= rect.top && clientY <= rect.bottom;

    if (saliendoPorDerecha) return;

    const timeout = setTimeout(() => {
      if (!isHoverBoxActive) setHovered(null);
    }, 200);

    setLeaveTimeout(timeout);
  };

  return (
    <div className="sidebar sidebar-collapsed">
      <div className="sidebar-content">
        {seccionesFiltradas.map((s) => (
          <div
            key={s.name}
            className="sidebar-icon"
            onClick={onExpandir}
            onMouseEnter={(e) => handleMouseEnter(e, s)}
            onMouseLeave={handleMouseLeave}
          >
            <svg viewBox="0 0 24 24" className="sidebar-icon-svg">
              <path d={s.iconPath}></path>
            </svg>
            <div className="sidebar-icon-label">{s.name}</div>
          </div>
        ))}
      </div>

      {hovered && (
        <div
          className="hover-box" style={{position: "fixed", left: hovered.x, top: hovered.y,}}
          onMouseEnter={() => {
            if (leaveTimeout) clearTimeout(leaveTimeout); setIsHoverBoxActive(true);}}
          onMouseLeave={() => {setIsHoverBoxActive(false); setHovered(null);}}
        >
          <div className="hover-box-header">
            <strong>{hovered.seccion.name}</strong>
          </div>

          <div className="hover-box-content">
            {hovered.seccion.grupos.map((g) => (
              <GroupSidebar
                key={g.name}
                title={g.name}
                iconPath={g.iconPath}
                informes={g.informes}
                permisosInformes={permisosInformes}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
