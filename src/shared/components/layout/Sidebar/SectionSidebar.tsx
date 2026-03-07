import { useState } from "react";
import { GroupSidebar } from "./GrupoSidebar";

type Group = {
  name: string;
  path: string;
  iconPath: string;
  informes: { name: string; path: string; type?: "informe" | "componente" }[];
};

type SectionProps = {
  title: string;
  iconPath: string;
  grupos: Group[];
  permisosGrupo: string[];
  permisosInformes: string[];
};

export function SectionSidebar({
  title,
  iconPath,
  grupos,
  permisosGrupo,
  permisosInformes,
}: SectionProps) {
  const [open, setOpen] = useState(false);

  const gruposFiltrados = grupos.filter((g) =>
    permisosGrupo.includes(g.path)
  );

  return (
    <div className="section">
      <div className="sidebar-header" onClick={() => setOpen(!open)}>
        <div className="section-icono">
          <svg viewBox="0 0 24 24">
            <path d={iconPath}></path>
          </svg>
        </div>
        <div className="section-titulo">{title}</div>

        <div className={`arrow ${open ? "open" : ""}`}>
        </div>
      </div>

      <div
        className={`section-groups ${open ? "open" : "closed"}`}
        style={{
          maxHeight: open ? "1000px" : "0",
          overflow: "hidden",
          transition: "max-height 0.3s ease-in-out",
        }}
      >
        {gruposFiltrados.map((g) => (
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
  );
}
