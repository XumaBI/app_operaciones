import { useRef, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../../../styles/Login.css";
import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { SinAcceso } from "./SinAcceso";

function Informe() {
  const { usuario } = useContext(AuthContext);
  const { id } = useParams<{ id: string }>();
  const url = id ? usuario?.informes?.[id] : null;

  const contenedorRef = useRef<HTMLDivElement | null>(null);
  const [isFull, setIsFull] = useState(false);

  useEffect(() => {
    const onFullScreenChange = () => {
      setIsFull(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", onFullScreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", onFullScreenChange);
  }, []);

  if (!usuario) {
    return (
      <h2 style={{ textAlign: "center", marginTop: "2rem" }}>
        Debe iniciar sesión para ver este informe
      </h2>
    );
  }

  if (!url) {
    return <SinAcceso />;
  }

  const toggleFullScreen = () => {
    const el = contenedorRef.current;
    if (!el) return;

    if (!document.fullscreenElement) {
      el.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <div className="iframe" ref={contenedorRef}>
      <button className="fullscreen-btn" onClick={toggleFullScreen}>
        {isFull ? "Salir" : "Expandir"}
      </button>

      <iframe
        title={id}
        src={url}
        frameBorder="0"
        allowFullScreen
      />
    </div>
  );
}

export default Informe;
