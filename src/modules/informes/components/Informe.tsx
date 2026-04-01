import { useRef, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../../../styles/Login.css";
import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { SinAcceso } from "./SinAcceso";



const informes: Record<string, string> = {
  // Ejecucion Global
  "ejecucion-promigas": "https://app.powerbi.com/view?r=eyJrIjoiYjQ5ZjQyYWEtZGEyMS00NTE1LWI4YmMtYTk3ZGY2NDdiN2RmIiwidCI6ImEzNmEzYmJkLTY5ZGQtNDgzNS04NTIyLTRiOTQ0MmM5YTE3NCIsImMiOjR9",
  "ejecucion-vanti": "https://app.powerbi.com/view?r=eyJrIjoiMjNjZjQwYzktMjE2Mi00ODVhLTlmODMtMTk0MGEzYTU0YTczIiwidCI6ImEzNmEzYmJkLTY5ZGQtNDgzNS04NTIyLTRiOTQ0MmM5YTE3NCIsImMiOjR9",
  "ejecucion-parcial": "https://app.powerbi.com/view?r=eyJrIjoiNWY3OWNjZDEtZDI4YS00OGQ2LWI2MmQtNjdmZmNmMjQyNDUwIiwidCI6ImEzNmEzYmJkLTY5ZGQtNDgzNS04NTIyLTRiOTQ0MmM5YTE3NCIsImMiOjR9",
  "controladas":  "https://app.powerbi.com/view?r=eyJrIjoiNjJmMTFkZjQtOTNlMC00NTgzLWE0MDktMTljYzIwYjliNDRlIiwidCI6ImEzNmEzYmJkLTY5ZGQtNDgzNS04NTIyLTRiOTQ0MmM5YTE3NCIsImMiOjR9",
  "relacionadas": "https://app.powerbi.com/view?r=eyJrIjoiOTVkYTVmODAtNDZmYy00NTZhLWFlYmMtZGU5NGZlNDg4NmVlIiwidCI6ImEzNmEzYmJkLTY5ZGQtNDgzNS04NTIyLTRiOTQ0MmM5YTE3NCIsImMiOjR9",

  // Ejecucion Distribuidoras
  "caribe": "https://app.powerbi.com/view?r=eyJrIjoiZmI3ZmRhZGItNTIxNy00MWM4LTk5ZTYtNmQxMmE5NGQ0ZTg4IiwidCI6ImEzNmEzYmJkLTY5ZGQtNDgzNS04NTIyLTRiOTQ0MmM5YTE3NCIsImMiOjR9",
  "guajira": "https://app.powerbi.com/view?r=eyJrIjoiZDlkYWFmMGMtNjEyOC00NjZlLThjZmMtYzk1N2NjODYxNzY2IiwidCI6ImEzNmEzYmJkLTY5ZGQtNDgzNS04NTIyLTRiOTQ0MmM5YTE3NCIsImMiOjR9",
  "efigas": "https://app.powerbi.com/view?r=eyJrIjoiNTE4ODcxMTQtODZkNS00NjY4LWEzY2UtZjlmNGM0MDQ0NmM5IiwidCI6ImEzNmEzYmJkLTY5ZGQtNDgzNS04NTIyLTRiOTQ0MmM5YTE3NCIsImMiOjR9",
  "surtigas": "https://app.powerbi.com/view?r=eyJrIjoiODEzNTI1NmItMTZiYi00YjUwLTk2NDQtMDgxMjA1YmE0ZWRhIiwidCI6ImEzNmEzYmJkLTY5ZGQtNDgzNS04NTIyLTRiOTQ0MmM5YTE3NCIsImMiOjR9",
  "gdo": "https://app.powerbi.com/view?r=eyJrIjoiMWUyNGYwNzgtZThkOS00NzJiLWI1NDktN2JjOWYzODY4MTNkIiwidCI6ImEzNmEzYmJkLTY5ZGQtNDgzNS04NTIyLTRiOTQ0MmM5YTE3NCIsImMiOjR9",
  "ceo": "https://app.powerbi.com/view?r=eyJrIjoiNGRiNWFjMTAtNzYxZS00ZWFiLWIyYWQtNWVjOTM1ZGNlYzFhIiwidCI6ImEzNmEzYmJkLTY5ZGQtNDgzNS04NTIyLTRiOTQ0MmM5YTE3NCIsImMiOjR9",

  // Ejecucion Aseguradoras
  "hdi": "https://app.powerbi.com/view?r=eyJrIjoiZTFjODIyY2MtNTA3ZC00ZWNlLWJlNmYtMWVjMDkyMmU2ZDIzIiwidCI6ImEzNmEzYmJkLTY5ZGQtNDgzNS04NTIyLTRiOTQ0MmM5YTE3NCIsImMiOjR9",
  "alfa": "https://app.powerbi.com/view?r=eyJrIjoiNjg4ZTQ4ZTktODljMS00ODg5LWE5MmQtNGJlOWMwNDRiYTczIiwidCI6ImEzNmEzYmJkLTY5ZGQtNDgzNS04NTIyLTRiOTQ0MmM5YTE3NCIsImMiOjR9",
  "ike": "https://app.powerbi.com/view?r=eyJrIjoiYTNjYzI1MTMtMWMwMy00ZDNlLTg4OWMtNjU2MDA4ZTJjMTlhIiwidCI6ImEzNmEzYmJkLTY5ZGQtNDgzNS04NTIyLTRiOTQ0MmM5YTE3NCIsImMiOjR9",
  "gnp": "https://app.powerbi.com/view?r=eyJrIjoiMzNhNmFmZTItYjQxMi00YWJmLTgwMmUtZTY2MzhiZjVhMmU5IiwidCI6ImEzNmEzYmJkLTY5ZGQtNDgzNS04NTIyLTRiOTQ0MmM5YTE3NCIsImMiOjR9",

  // Revisión
  "revision-ejecucion": "https://app.powerbi.com/view?r=eyJrIjoiNGQ1MzcxMDYtMDg5ZC00ZGNhLTg5ZDAtYzJjZjhiNTg5YzVlIiwidCI6ImEzNmEzYmJkLTY5ZGQtNDgzNS04NTIyLTRiOTQ0MmM5YTE3NCIsImMiOjR9",
  "revision-cargue": "https://app.powerbi.com/view?r=eyJrIjoiOWNiNzNlYmEtNGNiZC00OWViLTllODEtZDU1NDZmYTJjOTIwIiwidCI6ImEzNmEzYmJkLTY5ZGQtNDgzNS04NTIyLTRiOTQ0MmM5YTE3NCIsImMiOjR9",

  // Comercial
  "informe-cargues": "https://app.powerbi.com/view?r=eyJrIjoiZDJhNjJmMmUtOWI1OC00YzE3LTljMzYtYjMxNmRiZjQyN2RjIiwidCI6ImEzNmEzYmJkLTY5ZGQtNDgzNS04NTIyLTRiOTQ0MmM5YTE3NCIsImMiOjR9",
  "informe360": "https://app.powerbi.com/view?r=XXXXXX10",

  // Digital
  "digital-global": "https://app.powerbi.com/view?r=eyJrIjoiMmM4OTI4NjgtZTc4ZS00YWU0LWE4YTYtODljM2I0ZTY0YzdjIiwidCI6ImEzNmEzYmJkLTY5ZGQtNDgzNS04NTIyLTRiOTQ0MmM5YTE3NCIsImMiOjR9",
  "digital-caribe": "https://app.powerbi.com/view?r=eyJrIjoiNTM3YWQxMjctZWFjNS00NzlmLTg1NmQtYjdkYjM0OTRhMDgyIiwidCI6ImEzNmEzYmJkLTY5ZGQtNDgzNS04NTIyLTRiOTQ0MmM5YTE3NCIsImMiOjR9",
  "digital-efigas": "https://app.powerbi.com/view?r=eyJrIjoiMTYzNDZhNGQtMWZmYS00OGUzLWE5ODctZWY0ZjgyMGI1NWQ2IiwidCI6ImEzNmEzYmJkLTY5ZGQtNDgzNS04NTIyLTRiOTQ0MmM5YTE3NCIsImMiOjR9",
  "digital-gdo": "https://app.powerbi.com/view?r=eyJrIjoiODFlODZlNDQtMTM5Ny00YzEwLWJmODgtNzE5MGRlNGJkYzYwIiwidCI6ImEzNmEzYmJkLTY5ZGQtNDgzNS04NTIyLTRiOTQ0MmM5YTE3NCIsImMiOjR9",
  "digital-surtigas": "https://app.powerbi.com/view?r=eyJrIjoiYjZjZWRjZWYtZjgzYi00NWM3LWFiMjEtNjZkMTVmNjNmYmFkIiwidCI6ImEzNmEzYmJkLTY5ZGQtNDgzNS04NTIyLTRiOTQ0MmM5YTE3NCIsImMiOjR9",

  //Ejecucion Comercial
  "comercial-caribe": "https://app.powerbi.com/view?r=eyJrIjoiNjhlYzMwNGUtMTVhZC00NzAyLTkwYmMtMjZlOWIzNGQ4OTA0IiwidCI6ImEzNmEzYmJkLTY5ZGQtNDgzNS04NTIyLTRiOTQ0MmM5YTE3NCIsImMiOjR9",
  "comercial-gdo": "https://app.powerbi.com/view?r=eyJrIjoiYzQ0MWJmMjItNTgzYS00ZGZkLWJlZjQtOTc4OWRhYmVmNzkwIiwidCI6ImEzNmEzYmJkLTY5ZGQtNDgzNS04NTIyLTRiOTQ0MmM5YTE3NCIsImMiOjR9",
  "comercial-efigas": "https://app.powerbi.com/view?r=eyJrIjoiNDA4ZTM4ODYtNmNkYS00MjI4LTgwMzQtMmI1ZTUyOTYzZDk5IiwidCI6ImEzNmEzYmJkLTY5ZGQtNDgzNS04NTIyLTRiOTQ0MmM5YTE3NCIsImMiOjR9",
  "comercial-ceo": "https://app.powerbi.com/view?r=eyJrIjoiYjNlZmYxNjgtMzZhNy00MTRhLWEyOGQtYTE2Nzk5MWRkNjMxIiwidCI6ImEzNmEzYmJkLTY5ZGQtNDgzNS04NTIyLTRiOTQ0MmM5YTE3NCIsImMiOjR9&disablecdnExpiration=1751404315",
  "comercial-surtigas": "https://app.powerbi.com/view?r=eyJrIjoiNjFiNDcxMmItNjAzZi00MGUzLWEyZmEtZThmZDRkODg2YjQ0IiwidCI6ImEzNmEzYmJkLTY5ZGQtNDgzNS04NTIyLTRiOTQ0MmM5YTE3NCIsImMiOjR9&disablecdnExpiration=1751404315",

  "comercial-hdi": "https://app.powerbi.com/view?r=eyJrIjoiNzljY2UzZWUtNzRjOC00Y2MwLTlmMmMtNzdkMzk2YTg4MTVmIiwidCI6ImEzNmEzYmJkLTY5ZGQtNDgzNS04NTIyLTRiOTQ0MmM5YTE3NCIsImMiOjR9",
  "comercial-alfa": "https://app.powerbi.com/view?r=eyJrIjoiNGNmMWNkNWYtMjRiNC00Njc2LWJiNDAtYzUzNDQ4Y2Y2ZDRkIiwidCI6ImEzNmEzYmJkLTY5ZGQtNDgzNS04NTIyLTRiOTQ0MmM5YTE3NCIsImMiOjR9",
  "comercial-ike": "https://app.powerbi.com/view?r=eyJrIjoiMjMwMGRhY2ItZTU5Yy00MmYxLWFmZTEtNWVkMGQ5ZWQyYzhkIiwidCI6ImEzNmEzYmJkLTY5ZGQtNDgzNS04NTIyLTRiOTQ0MmM5YTE3NCIsImMiOjR9",

  //Growth y CX
  "pqrs-vanti": "https://app.powerbi.com/view?r=eyJrIjoiMmQ1M2E4ODItZDhjNS00MGM4LWJiZjMtNjM3YzhiOTgxYjc0IiwidCI6ImEzNmEzYmJkLTY5ZGQtNDgzNS04NTIyLTRiOTQ0MmM5YTE3NCIsImMiOjR9"
};

function Informe() {
  const { usuario } = useContext(AuthContext);
  const { id } = useParams<{ id: string }>();
  const url = id ? informes[id] : null;

  if (!usuario) {
    return (
      <h2 style={{ textAlign: "center", marginTop: "2rem" }}>
        Debe iniciar sesión para ver este informe
      </h2>
    );
  }

  if (!url) {
    return (
      <h2 style={{ textAlign: "center", marginTop: "2rem" }}>
        Informe no encontrado
      </h2>
    );
  }

  if (!usuario.permisosInformes.includes(id!)) {
    return (
      <SinAcceso />
    );
  }

  const contenedorRef = useRef<HTMLDivElement | null>(null);
  const [isFull, setIsFull] = useState(false);

  const toggleFullScreen = () => {
    const el = contenedorRef.current;
    if (!el) return;

    if (!document.fullscreenElement) {
      el.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    const onFullScreenChange = () => {
      setIsFull(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", onFullScreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", onFullScreenChange);
  }, []);

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
