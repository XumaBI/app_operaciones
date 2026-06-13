import "../../../styles/Login.css";
import { useState } from "react";
import { useAuth } from "../../../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);

  const handleLogin = async () => {
    if (enviando) return;
    setError("");
    setEnviando(true);
    try {
      await login(username.trim(), password);
    } catch (err) {
      const status = (err as { response?: { status?: number } })?.response
        ?.status;
      if (status === 401) {
        setError("Usuario o contraseña incorrecta");
      } else {
        setError("No se pudo iniciar sesión. Intenta de nuevo.");
      }
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        {/* Cabecera con la marca */}
        <div className="login-header">
          <div className="login-logo">
            <img src="/xuma-blanco.svg" alt="Logo Xuma" />
          </div>
          <div className="login-welcome">
            <div className="login-welcome-icon">
              <img src="/iconoinforme.svg" alt="" />
            </div>
            <h2>App Operaciones y Analítica</h2>
            <p>
              Bienvenido(a) a la app de informes de Xuma Insurtech. Por favor,
              utiliza este recurso de manera responsable. Si tienes dudas,
              escríbenos a <b>support-bi@xuma.la</b>
            </p>
          </div>
        </div>

        {/* Formulario */}
        <form
          className="login-body"
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}
        >
          <h3 className="login-title">Autenticación</h3>

          <label className="login-field">
            <span className="login-label">Usuario</span>
            <div className="login-input-wrap">
              <UserIcon />
              <input
                type="text"
                id="username"
                placeholder="Ingresa tu usuario"
                autoComplete="username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={enviando}
              />
            </div>
          </label>

          <label className="login-field">
            <span className="login-label">Contraseña</span>
            <div className="login-input-wrap">
              <LockIcon />
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Ingresa tu contraseña"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={enviando}
              />
              <button
                type="button"
                className="login-toggle"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={
                  showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                }
                title={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                tabIndex={-1}
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
          </label>

          {error && (
            <div className="login-error" role="alert">
              <ErrorIcon />
              <span>{error}</span>
            </div>
          )}

          <button type="submit" className="login-submit" disabled={enviando}>
            {enviando ? (
              <>
                <span className="login-spinner" />
                Ingresando…
              </>
            ) : (
              "Ingresar"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

/* ── Íconos (SVG inline, sin dependencias) ──────────────────────────────────── */

function UserIcon() {
  return (
    <svg
      className="login-icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg
      className="login-icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c6.5 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
      <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3.5 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
      <line x1="2" y1="2" x2="22" y2="22" />
      <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
    </svg>
  );
}

function ErrorIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}
