import "../../../styles/SinAcceso.css";

type SinAccesoProps = {
  titulo?: string;
  mensaje?: string;
};

export function SinAcceso({
  titulo = "Acceso restringido",
  mensaje = "No cuenta con los permisos necesarios para visualizar este informe."
}: SinAccesoProps) {
  return (
    <div className="sin-acceso-container">
      <div className="sin-acceso-card">
        <img
          src="/icono-restringido.svg"
          alt="Acceso restringido"
          className="sin-acceso-icon"
        />

        <h2>{titulo}</h2>
        <p>{mensaje}</p>

        <span className="sin-acceso-foot">
          Si considera que esto es un error, contacte a
          <b> support-bi@xuma.la</b>
        </span>
      </div>
    </div>
  );
}
