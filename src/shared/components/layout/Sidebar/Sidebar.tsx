import "../../../../styles/sidebar.css";
import { MENU_DATA } from "./menuData";
import { SectionSidebar } from "./SectionSidebar";
import { SidebarCollapsed } from "./SidebarCollapsed";

type SidebarProps = {
  permisosSecciones: string[];
  permisosGrupo: string[];
  permisosInformes: string[];
  isClosed: boolean;
  onExpandir: () => void;
};

export function Sidebar({ permisosSecciones, permisosGrupo, permisosInformes, isClosed, onExpandir, }: SidebarProps) {
  if (isClosed) {
    return <SidebarCollapsed permisosSecciones={permisosSecciones} onExpandir={onExpandir} permisosInformes={permisosInformes} />;
  }

  const seccionesFiltradas = MENU_DATA.filter((s) =>
    permisosSecciones.includes(
      s.path.replace("/", "")
    )
  );

  return (
    <div className="sidebar">
      <div className="sidebar-content">
        {seccionesFiltradas.map((s) => (
          <SectionSidebar
            key={s.name}
            title={s.name}
            iconPath={s.iconPath}
            grupos={s.grupos}
            permisosGrupo={permisosGrupo}
            permisosInformes={permisosInformes}
          />
        ))}
      </div>
    </div>
  );
}
