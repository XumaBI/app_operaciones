import "../../../styles/Login.css";
import { useState } from "react";

const usuarios: Usuario[] = [
  {
    usuario: "admin",
    nombre: "Administrador",
    clave: "Xuma2026*",
    permisosSecciones: ["Operaciones", "IntelicenciaCanales", "EjecucionComercial", "cx", "Ingesta"],
    permisosGrupo: ["ejecucion-global","ejecucion-distribuidora","ejecucion-aseguradora","revision","comercial", "canal-digital", "ejecucion-comercial-gaseras", "ejecucion-comercial-aseguradora", "pqrs", "ingesta-operaciones"],
    permisosInformes: [
      "ejecucion-promigas",
      "ejecucion-vanti",
      "ejecucion-parcial",
      "controladas",
      "relacionadas",
      "caribe",
      "guajira",
      "efigas",
      "surtigas",
      "gdo",
      "ceo",
      "hdi",
      "alfa",
      "ike",
      "gnp",
      "revision-ejecucion",
      "revision-cargue",
      "informe-cargues",
      "informe360",
      "Ejecucion",
      "digital-global",
      "digital-caribe",
      "digital-efigas",
      "digital-gdo",
      "digital-surtigas",
      "comercial-caribe",
      "comercial-occidente",
      "comercial-efigas",
      "comercial-ceo",
      "comercial-gdo",
      "comercial-surtigas",
      "comercial-hdi",
      "comercial-alfa",
      "comercial-ike",
      "pqrs-vanti",
      "pqrs-promigas"
    ]
  },
  {
  usuario: "lmiranda",
  nombre: "Laura Miranda",
  clave: "102217",
  permisosSecciones: ["Operaciones", "IntelicenciaCanales", "EjecucionComercial"],
  permisosGrupo: ["ejecucion-global","ejecucion-distribuidora","ejecucion-aseguradora","revision","comercial"],
  permisosInformes: ["ejecucion-promigas","revision-ejecucion","revision-cargue","informe-cargues","ike","gnp"]
  },
  {
  usuario: "bgonzalez",
  nombre: "Brian Gonzalez",
  clave: "Francia2026",
  permisosSecciones: ["Operaciones", "IntelicenciaCanales", "EjecucionComercial"],
  permisosGrupo: ["ejecucion-global","ejecucion-distribuidora","ejecucion-aseguradora","revision","comercial"],
  permisosInformes: ["ejecucion-promigas","revision-ejecucion","revision-cargue","informe-cargues","ike","gnp"]
  },
  {
  usuario: "jrivero",
  nombre: "Julio Rivero",
  clave: "Xuma2026*JR",
  permisosSecciones: ["Operaciones", "IntelicenciaCanales", "EjecucionComercial"],
  permisosGrupo: ["ejecucion-global","ejecucion-distribuidora","ejecucion-aseguradora","revision","comercial"],
  permisosInformes: ["ejecucion-promigas","revision-ejecucion","revision-cargue","informe-cargues","ike","gnp"]
},

{
  usuario: "wortiz",
  nombre: "Wendy Ortiz",
  clave: "Xuma2026*WO",
  permisosSecciones: ["Operaciones", "IntelicenciaCanales", "EjecucionComercial"],
  permisosGrupo: ["ejecucion-global","ejecucion-distribuidora","ejecucion-aseguradora","revision","comercial"],
  permisosInformes: ["ejecucion-promigas","revision-ejecucion","revision-cargue","informe-cargues","ike","gnp"]
},

{
  usuario: "frada",
  nombre: "Fabian Rada",
  clave: "Xuma2026*FR",
  permisosSecciones: ["Operaciones", "IntelicenciaCanales", "EjecucionComercial"],
  permisosGrupo: ["ejecucion-global","ejecucion-distribuidora","ejecucion-aseguradora","revision","comercial"],
  permisosInformes: ["ejecucion-promigas","revision-ejecucion","revision-cargue","informe-cargues","ike","gnp"]
},

{
  usuario: "spaniagua",
  nombre: "Stephanie Paniagua",
  clave: "Xuma2026*SP",
  permisosSecciones: ["Operaciones", "IntelicenciaCanales", "EjecucionComercial"],
  permisosGrupo: ["ejecucion-global","ejecucion-distribuidora","ejecucion-aseguradora","revision","comercial"],
  permisosInformes: ["ejecucion-promigas","revision-ejecucion","revision-cargue","informe-cargues","ike","gnp"]
},

{
  usuario: "caltahona",
  nombre: "Carlos Altahona",
  clave: "Xuma2026*CA",
  permisosSecciones: ["Operaciones", "IntelicenciaCanales", "EjecucionComercial"],
  permisosGrupo: ["ejecucion-global","ejecucion-distribuidora","ejecucion-aseguradora","revision","comercial"],
  permisosInformes: ["ejecucion-promigas","revision-ejecucion","revision-cargue","informe-cargues","ike","gnp"]
},

{
  usuario: "jthomas",
  nombre: "Johan Thomas",
  clave: "Xuma2026*JT",
  permisosSecciones: ["Operaciones", "IntelicenciaCanales", "EjecucionComercial"],
  permisosGrupo: ["ejecucion-global","ejecucion-distribuidora","ejecucion-aseguradora","revision","comercial"],
  permisosInformes: ["ejecucion-promigas","revision-ejecucion","revision-cargue","informe-cargues","ike","gnp"]
},

{
  usuario: "lgoethe",
  nombre: "Luis Goethe",
  clave: "Xuma2026*LG",
  permisosSecciones: ["Operaciones", "IntelicenciaCanales", "EjecucionComercial"],
  permisosGrupo: ["ejecucion-global","ejecucion-distribuidora","ejecucion-aseguradora","revision","comercial"],
  permisosInformes: ["ejecucion-promigas","revision-ejecucion","revision-cargue","informe-cargues","ike","gnp"]
},
  {
  usuario: "kmendez",
  nombre: "Karol Mendez",
  clave: "mendez2026",
  permisosSecciones: ["IntelicenciaCanales", "EjecucionComercial"],
  permisosGrupo: ["ejecucion-global","comercial", "canal-digital", "ejecucion-comercial-gaseras", "ejecucion-comercial-aseguradora", "pqrs"],
  permisosInformes: [
      "digital-global",
      "digital-caribe",
      "digital-efigas",
      "digital-gdo",
      "digital-surtigas",
      "comercial-caribe",
      "comercial-occidente",
      "comercial-efigas",
      "comercial-ceo",
      "comercial-gdo",
      "comercial-surtigas",
      "comercial-hdi",
      "comercial-alfa",
      "comercial-ike",
    ]
  },
  {
    usuario: "aacebedo",
    nombre: "Andres Acebedo",
    clave: "xuma2025",
    permisosSecciones: ["Operaciones", "IntelicenciaCanales", "EjecucionComercial", "cx", "Ingesta"],
    permisosGrupo: ["ejecucion-global","ejecucion-distribuidora","ejecucion-aseguradora","comercial", "canal-digital", "ejecucion-comercial-gaseras", "ejecucion-comercial-aseguradora", "pqrs", "ingesta-operaciones"],
    permisosInformes: [
      "ejecucion-promigas",
      "ejecucion-parcial",
      "controladas",
      "relacionadas",
      "caribe",
      "guajira",
      "efigas",
      "surtigas",
      "gdo",
      "ceo",
      "hdi",
      "alfa",
      "ike",
      "gnp",
      "revision-ejecucion",
      "revision-cargue",
      "informe-cargues",
      "Ejecucion",
      "digital-global",
      "digital-caribe",
      "digital-efigas",
      "digital-gdo",
      "digital-surtigas",
      "comercial-caribe",
      "comercial-occidente",
      "comercial-efigas",
      "comercial-ceo",
      "comercial-gdo",
      "comercial-surtigas",
      "comercial-hdi",
      "comercial-alfa",
      "comercial-ike",
      "pqrs-vanti",
    ]
  },
  {
    usuario: "emolina",
    nombre: "Elena Molina",
    clave: "comercial2026",
    permisosSecciones: ["Operaciones", "IntelicenciaCanales", "EjecucionComercial", "cx", "Ingesta"],
    permisosGrupo: ["ejecucion-global","ejecucion-distribuidora","ejecucion-aseguradora","comercial", "ingesta-operaciones"],
    permisosInformes: [
      "ejecucion-promigas",
      "ejecucion-parcial",
      "controladas",
      "relacionadas",
      "caribe",
      "guajira",
      "efigas",
      "surtigas",
      "gdo",
      "ceo",
      "hdi",
      "alfa",
      "revision-ejecucion",
      "revision-cargue",
      "informe-cargues",
      "Ejecucion",
      "digital-global",
      "digital-caribe",
      "digital-efigas",
      "digital-gdo",
      "digital-surtigas",
      "comercial-caribe",
      "comercial-occidente",
      "comercial-efigas",
      "comercial-ceo",
      "comercial-gdo",
      "comercial-surtigas",
      "comercial-hdi",
      "comercial-alfa",
      "comercial-ike",
    ]
  },
  {
    usuario: "jgane",
    nombre: "Julian Gane",
    clave: "cx2026",
    permisosSecciones: ["Operaciones", "IntelicenciaCanales", "EjecucionComercial", "cx", "Ingesta"],
    permisosGrupo: ["ejecucion-global","ejecucion-distribuidora","ejecucion-aseguradora","comercial", "ingesta-operaciones"],
    permisosInformes: [
      "ejecucion-promigas",
      "ejecucion-parcial",
      "controladas",
      "relacionadas",
      "caribe",
      "guajira",
      "efigas",
      "surtigas",
      "gdo",
      "ceo",
      "hdi",
      "alfa",
      "revision-ejecucion",
      "revision-cargue",
      "informe-cargues",
      "Ejecucion",
      "digital-global",
      "digital-caribe",
      "digital-efigas",
      "digital-gdo",
      "digital-surtigas",
      "comercial-caribe",
      "comercial-occidente",
      "comercial-efigas",
      "comercial-ceo",
      "comercial-gdo",
      "comercial-surtigas",
      "comercial-hdi",
      "comercial-alfa",
      "comercial-ike",
    ]
  },
  {
    usuario: "cmunera",
    nombre: "Carolina Munera",
    clave: "promi2026",
    permisosSecciones: ["Operaciones"],
    permisosGrupo: ["ejecucion-global","ejecucion-distribuidora","ejecucion-aseguradora"],
    permisosInformes: ["ejecucion-promigas", "ejecucion-parcial", "controladas", "relacionadas", "caribe", "guajira", "efigas", "surtigas", "gdo", "ceo", "hdi", "alfa"]
  },
  {
    usuario: "caribe",
    nombre: "Gases del Caribe S.A.",
    clave: "c914",
    permisosSecciones: ["Operaciones", "IntelicenciaCanales", "EjecucionComercial"],
    permisosGrupo: ["ejecucion-distribuidora", "canal-digital", "ejecucion-comercial-gaseras"],
    permisosInformes: ["caribe", "digital-caribe","comercial-caribe"]
  },
  {
    usuario: "guajira",
    nombre: "Gases de la Guajira S.A.",
    clave: "g236",
    permisosSecciones: ["Operaciones"],
    permisosGrupo: ["ejecucion-distribuidora"],
    permisosInformes: ["guajira"]
  },
  {
    usuario: "efigas",
    nombre: "Efigas Gas Natural S.A.",
    clave: "e741",
    permisosSecciones: ["Operaciones", "IntelicenciaCanales", "EjecucionComercial"],
    permisosGrupo: ["ejecucion-distribuidora", "canal-digital", "ejecucion-comercial-gaseras"],
    permisosInformes: ["efigas", "digital-efigas","comercial-efigas"]
  },
  {
    usuario: "surtigas",
    nombre: "SURTIGAS S.A.",
    clave: "s892",
    permisosSecciones: ["Operaciones", "IntelicenciaCanales", "EjecucionComercial"],
    permisosGrupo: ["ejecucion-distribuidora", "canal-digital", "ejecucion-comercial-gaseras"],
    permisosInformes: ["surtigas", "digital-surtigas","comercial-surtigas"]
  },
  {
    usuario: "gdo",
    nombre: "Gases de Occidente S.A.",
    clave: "g327",
    permisosSecciones: ["Operaciones", "IntelicenciaCanales", "EjecucionComercial"],
    permisosGrupo: ["ejecucion-distribuidora", "canal-digital", "ejecucion-comercial-gaseras"],
    permisosInformes: ["gdo", "digital-gdo", "comercial-gdo"]
  },
  {
    usuario: "ceo",
    nombre: "Compañia Energetica de Occidente S.A.S",
    clave: "c560",
    permisosSecciones: ["Operaciones", "EjecucionComercial"],
    permisosGrupo: ["ejecucion-distribuidora", "ejecucion-comercial-gaseras"],
    permisosInformes: ["ceo", "comercial-ceo"]
  },
  {
    usuario: "hdi",
    nombre: "HDI Seguros Colombia S.A.",
    clave: "235",
    permisosSecciones: ["Operaciones", "EjecucionComercial"],
    permisosGrupo: ["ejecucion-aseguradora", "ejecucion-comercial-aseguradora"],
    permisosInformes: ["hdi", "comercial-hdi"]
  },
  {
    usuario: "alfa",
    nombre: "Seguros Alfa S.A.",
    clave: "674",
    permisosSecciones: ["Operaciones", "EjecucionComercial"],
    permisosGrupo: ["ejecucion-aseguradora", "ejecucion-comercial-aseguradora"],
    permisosInformes: ["alfa", "comercial-alfa"]
  },
  {
    usuario: "gnp",
    nombre: "Grupo Nacional Provincial",
    clave: "428",
    permisosSecciones: ["Operaciones"],
    permisosGrupo: ["ejecucion-aseguradora"],
    permisosInformes: ["gnp"]
  },
  {
    usuario: "ike",
    nombre: "IKE Asistencias",
    clave: "359",
    permisosSecciones: ["Operaciones"],
    permisosGrupo: ["ejecucion-aseguradora"],
    permisosInformes: ["ike"]
  },
];

type Usuario = {
  nombre: string;
  usuario: string;
  clave: string;
  permisosSecciones: string[];
  permisosGrupo: string[];
  permisosInformes: string[];
};

type LoginProps = {
  alIniciarSesion: (usuario: Usuario) => void;
};

export default function Login({ alIniciarSesion }: LoginProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    const encontrado = usuarios.find(
      (u) => u.usuario === username && u.clave === password
    );

    if (encontrado) {
      alIniciarSesion(encontrado);
    } else {
      setError("Usuario o contraseña incorrecta");
    }
  };

  return (
    <div id="login-container-vh">
      <div id="login-container">
        <div id="login">
          <div className="header">
            <div className="logo">
              <img src="/xuma-blanco.svg" alt="Logo-Xuma" />
            </div>
            <div className="welcome">
              <div className="icono">
                <img src="/iconoinforme.svg" alt="Icono" />
              </div>
              <h2>Informe de Ejecución</h2>
              <p>
                Bienvenido(a) a la app de informes de Xuma Insurtech. Por favor, utiliza este
                recurso de manera responsable. Si tienes dudas, puedes contactarnos
                a <b>support-bi@xuma.la</b>
              </p>
            </div>
          </div>

          <div className="box">
            <div className="login-box">
              <span className="Titulo-box">Autenticación</span>
            </div>

            <div className="login-box">
              <input
                type="text"
                id="username"
                placeholder="Usuario"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="login-box">
              <input
                type="password"
                id="password"
                placeholder="Contraseña"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="login-box">
              <button onClick={handleLogin}>Ingresar</button>
            </div>

            {error && (
              <div className="login-box">
                <p style={{ color: "red" }}>{error}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
