import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import "../../../../styles/sidebar.css";
import { filtrarDominiosPorPermisos, arbolDesdeApi } from "./menuData";
import type { Dominio, DominioApi } from "./menuData";
import { DominioRail } from "./DominioRail";
import { Sidebar } from "./Sidebar";
import { useIsMobile } from "../../../hooks/useIsMobile";

type NavegacionProps = {
  permisosInformes: string[];
  // Árbol servido por el backend; si viene, manda sobre el menú local.
  menu?: DominioApi[];
  isClosed: boolean;
  onExpandir: () => void;
  onCerrar: () => void;
};

// De "/informe/ejecucion-promigas" o "/componente/Ejecucion" extrae la hoja activa.
function leafDePath(pathname: string): string | null {
  const partes = pathname.split("/").filter(Boolean);
  return partes.length >= 2 ? partes[1] : null;
}

// Devuelve el id del dominio que contiene la hoja activa, o null si ninguna.
function dominioDeLeaf(dominios: Dominio[], leaf: string | null): string | null {
  if (!leaf) return null;
  for (const d of dominios) {
    for (const s of d.secciones) {
      for (const g of s.grupos) {
        if (g.informes.some((i) => i.path === leaf)) return d.id;
      }
    }
  }
  return null;
}

export function Navegacion({
  permisosInformes,
  menu,
  isClosed,
  onExpandir,
  onCerrar,
}: NavegacionProps) {
  const isMobile = useIsMobile();
  const location = useLocation();
  const activeLeaf = leafDePath(location.pathname);

  const dominios = useMemo(
    () =>
      menu ? arbolDesdeApi(menu) : filtrarDominiosPorPermisos(permisosInformes),
    [menu, permisosInformes]
  );

  const dominioDeRuta = dominioDeLeaf(dominios, activeLeaf);

  // Dominio seleccionado manualmente desde el rail; null hasta la primera elección.
  const [dominioSel, setDominioSel] = useState<string | null>(null);

  // Sincroniza la selección cuando navegas a una hoja de otro dominio.
  useEffect(() => {
    if (dominioDeRuta) setDominioSel(dominioDeRuta);
  }, [dominioDeRuta]);

  // Sin selección ni ruta que lo indique, NO hay dominio activo por defecto: tras
  // el login se ve solo el rail (con Inicio), no el primer dominio expandido.
  const activeId = dominioSel ?? dominioDeRuta ?? null;
  const dominioActivo = activeId
    ? dominios.find((d) => d.id === activeId) ?? null
    : null;
  const secciones = dominioActivo?.secciones ?? [];

  const limpiarDominio = () => setDominioSel(null);

  // ── Móvil: drawer con rail + panel (este último solo si hay dominio activo) ─
  if (isMobile) {
    const abierto = !isClosed;
    return (
      <>
        <div
          className={`sidebar-overlay ${abierto ? "show" : ""}`}
          onClick={onCerrar}
          aria-hidden="true"
        />
        <div className={`nav-drawer ${abierto ? "open" : ""}`}>
          <DominioRail
            dominios={dominios}
            activeDominioId={activeId}
            activeLeaf={activeLeaf}
            onSelect={(id) => setDominioSel(activeId === id ? null : id)}
            onHome={limpiarDominio}
            onNavigate={onCerrar}
            enableFlyout={false}
          />
          {dominioActivo && (
            <Sidebar secciones={secciones} activeLeaf={activeLeaf} onNavigate={onCerrar} />
          )}
        </div>
      </>
    );
  }

  // ── Escritorio: el rail siempre; el panel solo si hay un dominio activo y no
  // está colapsado. Sin panel visible, el rail despliega el flyout al hover.
  // El panel se renderiza siempre (contenedor .nav-panel) para animar su
  // apertura/cierre por ancho; al hacer click en una hoja se contrae animado. ──
  const mostrarPanel = !isClosed && !!dominioActivo;
  return (
    <div className="nav-shell">
      <DominioRail
        dominios={dominios}
        activeDominioId={activeId}
        activeLeaf={activeLeaf}
        onSelect={(id) => {
          if (mostrarPanel && id === activeId) {
            // Click sobre el dominio ya activo → cierra el panel y quita el
            // estado activo (en Home no queda ningún dominio resaltado).
            onCerrar();
            setDominioSel(null);
          } else {
            setDominioSel(id);
            onExpandir();
          }
        }}
        onHome={limpiarDominio}
        enableFlyout={!mostrarPanel}
      />
      <div className={`nav-panel ${mostrarPanel ? "open" : "closed"}`}>
        {dominioActivo && (
          <Sidebar secciones={secciones} activeLeaf={activeLeaf} onNavigate={onCerrar} />
        )}
      </div>
    </div>
  );
}
