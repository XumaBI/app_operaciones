import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { Sidebar } from "./shared/components/layout/Sidebar/Sidebar";
import Login from "./shared/components/layout/Login";
import Home from "./shared/components/layout/Home";
import Informe from "./modules/informes/components/Informe";
import { Header } from "./shared/components/layout/Header";
import Ejecucion from "./modules/ingesta/components/Ejecucion";

import { useAuth } from "./context/AuthContext";

import "./styles/App.css";

export function App() {
  const { usuario, cargando, logout } = useAuth();
  const [isClosed, setIsClosed] = useState(false);

  if (cargando) {
    return (
      <div className="container-app">
        <p style={{ color: "white", textAlign: "center", marginTop: "2rem" }}>
          Cargando…
        </p>
      </div>
    );
  }

  return (
    <div className="container-app">
      {!usuario ? (
        <Login />
      ) : (
        <>
          <Header
            userName={usuario.usuario}
            nombre={usuario.nombre}
            onLogout={logout}
            isClosed={isClosed}
            onToggleSidebar={() => setIsClosed(!isClosed)}
          />

          <div className="body-app">
            <Sidebar
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
  );
}
