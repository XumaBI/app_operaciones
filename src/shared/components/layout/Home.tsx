import '../../../styles/Home.css';

export default function Home() {
  return (

    <div className="contenedor-bienvenida">
      <div className="Mensaje-bienvenida">
        <h1>Bienvenido al Panel Principal</h1>
        <p>Este panel centraliza la información clave para la gestión en <strong>Xuma Insurtech</strong>.
          <br />Utilízalo de forma responsable. Si necesitas ayuda, escríbenos a <a href="mailto:support-bi@xuma.la?subject=Soporte%20Panel%20BI"><strong>support-bi@xuma.la</strong></a></p>
      </div>

      <img
        src="/Fondo-Home.svg"
        alt="Fondo"
        className="imagen-bienvenida"
      />
    </div>

  );
}
