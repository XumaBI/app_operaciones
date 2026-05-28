import "../../../styles/Login.css";
import { useState } from "react";
import { useAuth } from "../../../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);

  const handleLogin = async () => {
    if (enviando) return;
    setError("");
    setEnviando(true);
    try {
      await login(username.trim(), password);
    } catch (err: any) {
      if (err?.response?.status === 401) {
        setError("Usuario o contraseña incorrecta");
      } else {
        setError("No se pudo iniciar sesión. Intenta de nuevo.");
      }
    } finally {
      setEnviando(false);
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
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                disabled={enviando}
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
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                disabled={enviando}
              />
            </div>

            <div className="login-box">
              <button onClick={handleLogin} disabled={enviando}>
                {enviando ? "Ingresando…" : "Ingresar"}
              </button>
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
