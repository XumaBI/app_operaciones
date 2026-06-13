import { useEffect, useMemo, useState } from "react";
import { ItemSidebar } from "./ItemSidebar";

type Informe = {
  name: string;
  path: string;
  type?: "informe" | "componente";
};

type GroupProps = {
  title: string;
  iconPath: string;
  informes: Informe[];
  activeLeaf?: string | null;
  onNavigate?: () => void;
};

export function GroupSidebar({
  title,
  iconPath,
  informes,
  activeLeaf,
  onNavigate,
}: GroupProps) {
  const hasActive = useMemo(
    () => informes.some((i) => i.path === activeLeaf),
    [informes, activeLeaf]
  );

  const [open, setOpen] = useState(hasActive);

  // Auto-expande el grupo que contiene la ruta activa.
  useEffect(() => {
    if (hasActive) setOpen(true);
  }, [hasActive]);

  return (
    <div className="group">
      <button
        type="button"
        className="group-header"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <span className="group-header-left">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d={iconPath} />
          </svg>
          <span className="group-title">{title}</span>
        </span>
        <svg
          className={`group-chevron ${open ? "open" : ""}`}
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M8.59 7.41 13.17 12 8.59 16.59 10 18l6-6-6-6z" fill="currentColor" />
        </svg>
      </button>

      <div className={`collapsible ${open ? "open" : ""}`}>
        <div className="collapsible-inner">
          <div className="group-items">
            {informes.map((i) => (
              <ItemSidebar
                key={i.path}
                path={i.path}
                title={i.name}
                type={i.type}
                onNavigate={onNavigate}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
