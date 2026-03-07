import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { Sidebar } from "./shared/components/layout/Sidebar/Sidebar";
import Login from "./shared/components/layout/Login";
import Home from "./shared/components/layout/Home";
import Informe from "./modules/informes/components/Informe";
import { Header } from "./shared/components/layout/Header";
import Ejecucion from "./modules/ingesta/components/Ejecucion";

import { AuthContext } from "./context/AuthContext";
import type { Usuario } from "./context/AuthContext";

import "./styles/App.css";

export function App() {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [isClosed, setIsClosed] = useState(false);

  const handleLogout = () => {
    setUsuario(null);
  };

  return (
    <AuthContext.Provider value={{ usuario }}>
      <div className="container-app">

        {!usuario ? (
          <Login alIniciarSesion={(usuario) => setUsuario(usuario)} />
        ) : (
          <>
            <Header
              userName={usuario.usuario}
              nombre={usuario.nombre}
              onLogout={handleLogout}
              isClosed={isClosed}
              onToggleSidebar={() => setIsClosed(!isClosed)}
            />

            <div className="body-app">
              <Sidebar
                permisosSecciones={usuario.permisosSecciones}
                permisosGrupo={usuario.permisosGrupo}
                permisosInformes={usuario.permisosInformes}
                isClosed={isClosed}
                onExpandir={() => setIsClosed(false)}
              />

              <div className="content">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/informe/:id" element={<Informe />} />

                  {/* Módulo de Ingesta */}
                  <Route
                    path="/componente/Ejecucion"
                    element={<Ejecucion />}
                  />
                </Routes>
              </div>
            </div>
          </>
        )}
      </div>
    </AuthContext.Provider>
  );
}
