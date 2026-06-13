import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import type { Dominio } from "./menuData";
import { SectionSidebar } from "./SectionSidebar";

type DominioRailProps = {
  dominios: Dominio[];
  activeDominioId: string | null;
  activeLeaf?: string | null;
  onSelect: (id: string) => void;
  onNavigate?: () => void;
  // Se invoca al pulsar Inicio (además de navegar al Home).
  onHome?: () => void;
  // Solo se muestra el flyout cuando el panel de secciones no está visible.
  enableFlyout?: boolean;
};

type HoverState = { dominio: Dominio; x: number; y: number };

// Primer nivel de navegación: rail de iconos de dominio siempre visible. Al pasar
// el cursor despliega un flyout con las secciones de ese dominio (sin navegar);
// el click selecciona el dominio y abre el panel.
export function DominioRail({
  dominios,
  activeDominioId,
  activeLeaf,
  onSelect,
  onNavigate,
  onHome,
  enableFlyout = true,
}: DominioRailProps) {
  const [hovered, setHovered] = useState<HoverState | null>(null);
  const hoverActivoRef = useRef(false);
  const leaveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const homeActivo = location.pathname === "/";

  // No es un dominio: es un acceso directo al Home. Limpia la selección de
  // dominio para que el Home no deje ningún dominio activo.
  const irHome = () => {
    navigate("/");
    onHome?.();
    onNavigate?.();
  };

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
    dominio: Dominio
  ) => {
    if (!enableFlyout) return;
    limpiarTimeout();
    const rect = e.currentTarget.getBoundingClientRect();
    // Altura estimada del flyout para mantenerlo dentro de la pantalla.
    const altoEstimado = Math.min(
      window.innerHeight * 0.7,
      56 + dominio.secciones.length * 48
    );
    const y = Math.min(rect.top, window.innerHeight - altoEstimado - 12);
    setHovered({ dominio, x: rect.right + 8, y: Math.max(8, y) });
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
        <div
          className={`sidebar-icon ${homeActivo ? "has-active" : ""}`}
          onClick={irHome}
        >
          <svg viewBox="0 0 24 24" className="sidebar-icon-svg" aria-hidden="true">
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
          </svg>
          <span className="sidebar-icon-label">Inicio</span>
        </div>
        <div className="sidebar-rail-sep" />

        {dominios.map((d) => (
          <div
            key={d.id}
            className={`sidebar-icon ${d.id === activeDominioId ? "has-active" : ""}`}
            onClick={() => onSelect(d.id)}
            onMouseEnter={(e) => handleMouseEnter(e, d)}
            onMouseLeave={programarCierre}
          >
            <svg viewBox="0 0 24 24" className="sidebar-icon-svg" aria-hidden="true">
              <path d={d.iconPath} />
            </svg>
            <span className="sidebar-icon-label">{d.name}</span>
          </div>
        ))}
      </div>

      {enableFlyout && hovered && (
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
          <div className="hover-box-header">{hovered.dominio.name}</div>
          <div className="hover-box-content">
            {hovered.dominio.secciones.map((s) => (
              <SectionSidebar
                key={s.name}
                title={s.name}
                iconPath={s.iconPath}
                grupos={s.grupos}
                activeLeaf={activeLeaf}
                onNavigate={() => {
                  setHovered(null);
                  onNavigate?.();
                }}
              />
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}
