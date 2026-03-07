import "../../../styles/Header.css";

type HeadersProps = {
  userName: string;
  nombre: string;
  onLogout: () => void;
  isClosed: boolean;
  onToggleSidebar: () => void;
};

export function Header({ nombre, onLogout, isClosed, onToggleSidebar }: HeadersProps) {
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
              >
                <svg className="header-svgicon" viewBox="0 0 24 24">
                  <path d="M3 18h18v-2H3zm0-5h18v-2H3zm0-7v2h18V6z"></path>
                </svg>
              </button>
            </div>

            <a>
              <div className="header-contenedor-logo">
                <img
                  src="/xuma-color.svg"
                  alt="Xuma Insurtech"
                  className="header-logo"
                />
              </div>
            </a>
          </div>

          <div className="header-contenido">
            <div className="header-usuario">
              <div className="foot">
                <div className="text-foot">
                  <div className="Usuario">{nombre}</div>
                  <div
                    className="cerrar"
                    onClick={onLogout}
                    style={{ cursor: "pointer" }}
                  >
                    Cerrar Sesión
                  </div>
                </div>
                <div className="header-contenedor-imagen-perfil">
                  <img
                    src="/icono-perfil.svg"
                    className="header-imagen-perfil"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
