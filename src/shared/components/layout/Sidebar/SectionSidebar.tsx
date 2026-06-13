import { useEffect, useMemo, useState } from "react";
import { GroupSidebar } from "./GrupoSidebar";

type Informe = {
  name: string;
  path: string;
  type?: "informe" | "componente";
};

type Group = {
  name: string;
  path: string;
  iconPath: string;
  informes: Informe[];
};

type SectionProps = {
  title: string;
  iconPath: string;
  grupos: Group[];
  activeLeaf?: string | null;
  onNavigate?: () => void;
};

export function SectionSidebar({
  title,
  iconPath,
  grupos,
  activeLeaf,
  onNavigate,
}: SectionProps) {
  const hasActive = useMemo(
    () =>
      grupos.some((g) => g.informes.some((i) => i.path === activeLeaf)),
    [grupos, activeLeaf]
  );

  const [open, setOpen] = useState(hasActive);

  // Auto-expande la sección que contiene la ruta activa.
  useEffect(() => {
    if (hasActive) setOpen(true);
  }, [hasActive]);

  return (
    <div className="section">
      <button
        type="button"
        className={`section-header ${hasActive ? "has-active" : ""}`}
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <span className="section-icono">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d={iconPath} />
          </svg>
        </span>
        <span className="section-titulo">{title}</span>
        <svg
          className={`section-chevron ${open ? "open" : ""}`}
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M7 10l5 5 5-5z" fill="currentColor" />
        </svg>
      </button>

      <div className={`collapsible ${open ? "open" : ""}`}>
        <div className="collapsible-inner">
          <div className="section-groups">
            {grupos.map((g) => (
              <GroupSidebar
                key={g.name}
                title={g.name}
                iconPath={g.iconPath}
                informes={g.informes}
                activeLeaf={activeLeaf}
                onNavigate={onNavigate}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
