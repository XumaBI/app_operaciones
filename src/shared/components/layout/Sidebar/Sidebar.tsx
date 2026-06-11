import "../../../../styles/sidebar.css";
import { filtrarMenuPorPermisos } from "./menuData";
import { SectionSidebar } from "./SectionSidebar";
import { SidebarCollapsed } from "./SidebarCollapsed";

type SidebarProps = {
  permisosInformes: string[];
  isClosed: boolean;
  onExpandir: () => void;
};

export function Sidebar({ permisosInformes, isClosed, onExpandir }: SidebarProps) {
  if (isClosed) {
    return (
      <SidebarCollapsed
        permisosInformes={permisosInformes}
        onExpandir={onExpandir}
      />
    );
  }

  const secciones = filtrarMenuPorPermisos(permisosInformes);

  return (
    <div className="sidebar">
      <div className="sidebar-content">
        {secciones.map((s) => (
          <SectionSidebar
            key={s.name}
            title={s.name}
            iconPath={s.iconPath}
            grupos={s.grupos}
          />
        ))}
      </div>
    </div>
  );
}
