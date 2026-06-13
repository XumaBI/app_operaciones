import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="route-fallback">
      <div className="route-fallback-code">404</div>
      <h2>Página no encontrada</h2>
      <p>La ruta que intentas abrir no existe o no tienes acceso a ella.</p>
      <Link to="/" className="route-fallback-btn">
        Volver al inicio
      </Link>
    </div>
  );
}
