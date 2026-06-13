import { SectionSidebar } from "./SectionSidebar";
import type { Seccion } from "./menuData";

type SidebarProps = {
  secciones: Seccion[];
  activeLeaf?: string | null;
  onNavigate?: () => void;
};

// Panel de secciones del dominio activo. La jerarquía visible es de 2 niveles:
// sección (acordeón) → grupo → item. El primer nivel (dominio) vive en el rail.
export function Sidebar({ secciones, activeLeaf, onNavigate }: SidebarProps) {
  return (
    <aside className="sidebar">
      <div className="sidebar-content">
        {secciones.map((s) => (
          <SectionSidebar
            key={s.name}
            title={s.name}
            iconPath={s.iconPath}
            grupos={s.grupos}
            activeLeaf={activeLeaf}
            onNavigate={onNavigate}
          />
        ))}
      </div>
    </aside>
  );
}
