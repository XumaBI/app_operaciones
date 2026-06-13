import { Suspense, lazy, useEffect, useState } from "react";
import type { ComponentType } from "react";
import {
  Routes,
  Route,
  useNavigate,
  useParams,
  useLocation,
} from "react-router-dom";
import { Sidebar } from "./shared/components/layout/Sidebar/Sidebar";
import Login from "./shared/components/layout/Login";
import Home from "./shared/components/layout/Home";
import NotFound from "./shared/components/layout/NotFound";
import { Header } from "./shared/components/layout/Header";

import { useAuth } from "./context/auth-context";

import "./styles/App.css";

// Carga diferida de los módulos pesados.
const Informe = lazy(() => import("./modules/informes/components/Informe"));
const Ejecucion = lazy(() => import("./modules/ingesta/components/Ejecucion"));

// Registro de componentes navegables (type: "componente" en menuData).
// Para añadir uno nuevo basta con registrarlo aquí.
const COMPONENTES: Record<string, ComponentType> = {
  Ejecucion,
};

// Resuelve /componente/:id contra el registro; si no existe, muestra 404.
function ComponenteHost() {
  const { id } = useParams<{ id: string }>();
  const Comp = id ? COMPONENTES[id] : undefined;
  return Comp ? <Comp /> : <NotFound />;
}

// Lleva el scroll del contenedor de contenido al inicio en cada cambio de ruta.
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    document.querySelector(".content")?.scrollTo({ top: 0 });
  }, [pathname]);
  return null;
}

export function App() {
  const { usuario, cargando, logout } = useAuth();
  // En móvil el sidebar arranca cerrado (drawer oculto); en escritorio, abierto.
  const [isClosed, setIsClosed] = useState(
    () => typeof window !== "undefined" && window.innerWidth <= 768
  );
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  if (cargando) {
    return (
      <div className="container-app">
        <p className="route-loading">Cargando…</p>
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
            onLogout={handleLogout}
            isClosed={isClosed}
            onToggleSidebar={() => setIsClosed((v) => !v)}
          />

          <div className="body-app">
            <Sidebar
              permisosInformes={usuario.permisosInformes}
              isClosed={isClosed}
              onExpandir={() => setIsClosed(false)}
              onCerrar={() => setIsClosed(true)}
            />

            <div className="content">
              <ScrollToTop />
              <Suspense
                fallback={<div className="route-loading">Cargando…</div>}
              >
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/informe/:id" element={<Informe />} />
                  <Route path="/componente/:id" element={<ComponenteHost />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
