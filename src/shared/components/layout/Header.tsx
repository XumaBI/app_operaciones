import "../../../styles/Header.css";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

type HeadersProps = {
  userName: string;
  nombre: string;
  onLogout: () => void;
  isClosed: boolean;
  onToggleSidebar: () => void;
};

export function Header({
  userName,
  nombre,
  onLogout,
  isClosed,
  onToggleSidebar,
}: HeadersProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  // Cierra el menú al hacer clic fuera o al presionar Escape.
  useEffect(() => {
    if (!menuOpen) return;

    const onClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };

    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  // TODO: conectar cuando existan las vistas de perfil / edición / configuración.
  const proximamente = () => setMenuOpen(false);

  const handleLogout = () => {
    setMenuOpen(false);
    onLogout();
  };

  return (
    <div className="header-body">
      <div className="header-toolbar">
        <div className="header-contenedor">
          <div className="header-menulogo">
            {/* 🔘 Botón para expandir/contraer menú */}
            <div className="expand-menu">
              <button
                className={`header-button-expandir ${isClosed ? "closed-btn" : ""}`}
                onClick={onToggleSidebar}
                aria-label="Mostrar u ocultar menú lateral"
              >
                <svg className="header-svgicon" viewBox="0 0 24 24">
                  <path d="M3 18h18v-2H3zm0-5h18v-2H3zm0-7v2h18V6z"></path>
                </svg>
              </button>
            </div>

            {/* Logo → Home */}
            <Link to="/" className="header-logo-link" aria-label="Ir al inicio">
              <div className="header-contenedor-logo">
                <img
                  src="/xuma-color.svg"
                  alt="Xuma Insurtech"
                  className="header-logo"
                />
              </div>
            </Link>
          </div>

          <div className="header-contenido">
            <div className="header-usuario" ref={menuRef}>
              {/* Disparador del menú de perfil */}
              <button
                className={`header-perfil-trigger ${menuOpen ? "is-open" : ""}`}
                onClick={() => setMenuOpen((v) => !v)}
                aria-haspopup="menu"
                aria-expanded={menuOpen}
              >
                <span className="header-perfil-info">
                  <span className="header-perfil-nombre">{nombre}</span>
                  <span className="header-perfil-rol">Ver perfil</span>
                </span>
                <span className="header-perfil-avatar">
                  <img src="/icono-perfil.svg" alt="" />
                </span>
                <svg
                  className={`header-perfil-chevron ${menuOpen ? "rot" : ""}`}
                  viewBox="0 0 24 24"
                  width="16"
                  height="16"
                >
                  <path d="M7 10l5 5 5-5z" fill="currentColor" />
                </svg>
              </button>

              {/* Menú desplegable */}
              {menuOpen && (
                <div className="header-menu" role="menu">
                  <div className="header-menu-user">
                    <span className="header-menu-avatar">
                      <img src="/icono-perfil.svg" alt="" />
                    </span>
                    <div className="header-menu-user-text">
                      <span className="header-menu-user-nombre">{nombre}</span>
                      <span className="header-menu-user-id">@{userName}</span>
                    </div>
                  </div>

                  <div className="header-menu-divider" />

                  <button
                    className="header-menu-item"
                    role="menuitem"
                    onClick={proximamente}
                  >
                    <ItemIcon path="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10zm0 2c-5.33 0-8 2.67-8 6v1h16v-1c0-3.33-2.67-6-8-6z" />
                    Mi perfil
                  </button>

                  <button
                    className="header-menu-item"
                    role="menuitem"
                    onClick={proximamente}
                  >
                    <ItemIcon path="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                    Modificar mis datos
                  </button>

                  <button
                    className="header-menu-item"
                    role="menuitem"
                    onClick={proximamente}
                  >
                    <ItemIcon path="M19.14 12.94a7.49 7.49 0 0 0 .05-.94 7.49 7.49 0 0 0-.05-.94l2.03-1.58a.5.5 0 0 0 .12-.64l-1.92-3.32a.5.5 0 0 0-.61-.22l-2.39.96a7.03 7.03 0 0 0-1.62-.94l-.36-2.54a.5.5 0 0 0-.5-.42h-3.84a.5.5 0 0 0-.5.42l-.36 2.54c-.59.24-1.13.56-1.62.94l-2.39-.96a.5.5 0 0 0-.61.22L2.74 8.84a.5.5 0 0 0 .12.64l2.03 1.58c-.03.31-.05.62-.05.94 0 .32.02.63.05.94l-2.03 1.58a.5.5 0 0 0-.12.64l1.92 3.32c.14.24.42.33.61.22l2.39-.96c.49.38 1.03.7 1.62.94l.36 2.54a.5.5 0 0 0 .5.42h3.84a.5.5 0 0 0 .5-.42l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.19.11.47.02.61-.22l1.92-3.32a.5.5 0 0 0-.12-.64l-2.03-1.58zM12 15.5A3.5 3.5 0 1 1 12 8.5a3.5 3.5 0 0 1 0 7z" />
                    Configuración
                  </button>

                  <div className="header-menu-divider" />

                  <button
                    className="header-menu-item header-menu-item-danger"
                    role="menuitem"
                    onClick={handleLogout}
                  >
                    <ItemIcon path="M16 13v-2H7V8l-5 4 5 4v-3h9zm3-10H10a2 2 0 0 0-2 2v3h2V5h9v14h-9v-3H8v3a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2z" />
                    Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ItemIcon({ path }: { path: string }) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
      <path d={path} />
    </svg>
  );
}
