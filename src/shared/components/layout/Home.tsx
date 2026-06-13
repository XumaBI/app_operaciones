import "../../../styles/Home.css";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { filtrarMenuPorPermisos } from "./Sidebar/menuData";

// ── Contenido editorial (avisos / consejos) ────────────────────────────────────
const NOVEDADES = [
  {
    fecha: "10 Jun 2026",
    tag: "Nuevo",
    color: "#0c87b0",
    titulo: "Cierres de Distribuidora automatizados",
    texto:
      "Ya puedes lanzar el cierre de cada gasera desde Ingesta. El proceso valida que los documentos estén completos en el bucket antes de ejecutarse.",
  },
  {
    fecha: "03 Jun 2026",
    tag: "Mejora",
    color: "#22a06b",
    titulo: "Validación de sesión contra base de datos",
    texto:
      "El inicio de sesión ahora valida credenciales y permisos directamente contra la BD para mayor seguridad.",
  },
  {
    fecha: "28 May 2026",
    tag: "Datos",
    color: "#8a5cf6",
    titulo: "Nuevos usuarios por especialista de operaciones",
    texto:
      "Se habilitaron accesos diferenciados para Caribe y Guajira según cada responsable de operación.",
  },
];

const CONSEJOS = [
  "Usa el buscador del menú lateral para llegar más rápido a un informe.",
  "Los informes se pueden ver en pantalla completa con el botón “Expandir”.",
  "Antes de un cierre, confirma que todos los documentos estén cargados.",
];

// ── Iconos inline ───────────────────────────────────────────────────────────────
function Icon({ path, size = 22 }: { path: string; size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor">
      <path d={path} />
    </svg>
  );
}

const ICONS = {
  informe: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z",
  capas: "M12 2 2 7l10 5 10-5-10-5zm0 7.5L4.21 5.6 12 2.3l7.79 3.3L12 9.5zM2 17l10 5 10-5-2.3-1.15L12 19.7 4.3 15.85 2 17zm0-5 10 5 10-5-2.3-1.15L12 14.7 4.3 10.85 2 12z",
  modulo: "M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z",
  componente: "M22 9V7h-2V5a2 2 0 0 0-2-2h-2V1h-2v2h-4V1H8v2H6a2 2 0 0 0-2 2v2H2v2h2v4H2v2h2v2a2 2 0 0 0 2 2h2v2h2v-2h4v2h2v-2h2a2 2 0 0 0 2-2v-2h2v-2h-2V9h2zm-6 8H8V7h8v10z",
  flecha: "M10 17l5-5-5-5v10z",
  reloj: "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm1 11h-4v-2h2V7h2v6z",
  rayo: "M7 2v11h3v9l7-12h-4l4-8z",
  check: "M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z",
  soporte: "M12 1a9 9 0 0 0-9 9v7a3 3 0 0 0 3 3h2v-8H5v-2a7 7 0 0 1 14 0v2h-3v8h2a3 3 0 0 0 3-3v-7a9 9 0 0 0-9-9z",
  libro: "M18 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2zM6 4h5v8l-2.5-1.5L6 12V4z",
};

export default function Home() {
  const { usuario } = useAuth();

  // Reloj en vivo
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const secciones = useMemo(
    () => filtrarMenuPorPermisos(usuario?.permisosInformes ?? []),
    [usuario]
  );

  const informesPlanos = useMemo(
    () =>
      secciones.flatMap((s) =>
        s.grupos.flatMap((g) =>
          g.informes.map((i) => ({
            ...i,
            seccion: s.name,
            grupo: g.name,
            icon: g.iconPath,
          }))
        )
      ),
    [secciones]
  );

  const totalInformes = informesPlanos.length;
  const totalSecciones = secciones.length;
  const totalGrupos = secciones.reduce((acc, s) => acc + s.grupos.length, 0);
  const totalComponentes = informesPlanos.filter(
    (i) => i.type === "componente"
  ).length;

  const hora = now.getHours();
  const saludo =
    hora < 12 ? "Buenos días" : hora < 19 ? "Buenas tardes" : "Buenas noches";
  const primerNombre = (usuario?.nombre ?? "Usuario").split(" ")[0];

  const fechaTexto = now.toLocaleDateString("es-CO", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const horaTexto = now.toLocaleTimeString("es-CO", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const accesosRapidos = informesPlanos.slice(0, 6);

  const destino = (path: string, type?: string) =>
    type === "componente" ? `/componente/${path}` : `/informe/${path}`;

  const stats = [
    { label: "Informes disponibles", valor: totalInformes, icon: ICONS.informe, color: "#0c87b0" },
    { label: "Áreas de negocio", valor: totalSecciones, icon: ICONS.capas, color: "#22a06b" },
    { label: "Módulos", valor: totalGrupos, icon: ICONS.modulo, color: "#8a5cf6" },
    { label: "Herramientas", valor: totalComponentes, icon: ICONS.componente, color: "#e8943a" },
  ];

  return (
    <div className="home">
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="home-hero">
        <div className="home-hero-bg" />
        <div className="home-hero-content">
          <span className="home-chip">
            <span className="home-chip-dot" />
            Operaciones y Analítica · Xuma Insurtech
          </span>
          <h1 className="home-hero-title">
            {saludo}, <span>{primerNombre}</span> 👋
          </h1>
          <p className="home-hero-sub">
            Este es tu panel central de operaciones y analítica. Desde aquí
            accedes a los informes, módulos y herramientas habilitados para tu
            perfil.
          </p>

          <div className="home-hero-meta">
            <span className="home-hero-meta-item">
              <Icon path={ICONS.reloj} size={16} />
              {horaTexto}
            </span>
            <span className="home-hero-meta-sep" />
            <span className="home-hero-meta-item home-cap">{fechaTexto}</span>
          </div>

          <div className="home-hero-actions">
            {accesosRapidos[0] && (
              <Link
                to={destino(accesosRapidos[0].path, accesosRapidos[0].type)}
                className="home-btn home-btn-primary"
              >
                <Icon path={ICONS.rayo} size={18} />
                Ir a mi primer informe
              </Link>
            )}
            <a
              href="mailto:support-bi@xuma.la?subject=Soporte%20Panel%20BI"
              className="home-btn home-btn-ghost"
            >
              <Icon path={ICONS.soporte} size={18} />
              Contactar soporte
            </a>
          </div>
        </div>

        <div className="home-hero-art">
          <img src="/Fondo-Home.svg" alt="" />
        </div>
      </section>

      {/* ── KPIs ──────────────────────────────────────────────────────────── */}
      <section className="home-stats">
        {stats.map((s) => (
          <div className="home-stat" key={s.label}>
            <div
              className="home-stat-icon"
              style={{ color: s.color, background: `${s.color}1f` }}
            >
              <Icon path={s.icon} size={22} />
            </div>
            <div className="home-stat-info">
              <span className="home-stat-valor">{s.valor}</span>
              <span className="home-stat-label">{s.label}</span>
            </div>
          </div>
        ))}
      </section>

      {/* ── Cuerpo en dos columnas ────────────────────────────────────────── */}
      <div className="home-cols">
        <div className="home-col-main">
          {/* Accesos rápidos */}
          <section className="home-block">
            <div className="home-block-head">
              <h2>
                <Icon path={ICONS.rayo} size={18} />
                Accesos rápidos
              </h2>
              <span className="home-block-hint">
                {totalInformes} disponibles
              </span>
            </div>

            {accesosRapidos.length > 0 ? (
              <div className="home-quick-grid">
                {accesosRapidos.map((item) => (
                  <Link
                    key={`${item.seccion}-${item.path}`}
                    to={destino(item.path, item.type)}
                    className="home-quick-card"
                  >
                    <div className="home-quick-icon">
                      <Icon path={item.icon} size={20} />
                    </div>
                    <div className="home-quick-text">
                      <span className="home-quick-name">{item.name}</span>
                      <span className="home-quick-sub">{item.seccion}</span>
                    </div>
                    <span className="home-quick-arrow">
                      <Icon path={ICONS.flecha} size={20} />
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="home-empty">
                Aún no tienes informes habilitados. Solicita acceso a tu líder o
                escríbenos a soporte.
              </div>
            )}
          </section>

          {/* Secciones / áreas */}
          <section className="home-block">
            <div className="home-block-head">
              <h2>
                <Icon path={ICONS.capas} size={18} />
                Tus áreas de trabajo
              </h2>
            </div>

            {secciones.length > 0 ? (
              <div className="home-sections">
                {secciones.map((s) => {
                  const nInf = s.grupos.reduce(
                    (a, g) => a + g.informes.length,
                    0
                  );
                  return (
                    <div className="home-section-card" key={s.name}>
                      <div className="home-section-top">
                        <div className="home-section-icon">
                          <Icon path={s.iconPath} size={22} />
                        </div>
                        <div>
                          <h3>{s.name}</h3>
                          <span className="home-section-count">
                            {s.grupos.length} módulo
                            {s.grupos.length !== 1 ? "s" : ""} · {nInf} informe
                            {nInf !== 1 ? "s" : ""}
                          </span>
                        </div>
                      </div>
                      <div className="home-section-tags">
                        {s.grupos.slice(0, 4).map((g) => (
                          <span className="home-tag" key={g.name}>
                            {g.name}
                          </span>
                        ))}
                        {s.grupos.length > 4 && (
                          <span className="home-tag home-tag-more">
                            +{s.grupos.length - 4}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="home-empty">
                No hay áreas habilitadas para tu perfil todavía.
              </div>
            )}
          </section>
        </div>

        {/* ── Columna lateral informativa ─────────────────────────────────── */}
        <aside className="home-col-side">
          {/* Estado del sistema */}
          <div className="home-side-card">
            <div className="home-side-head">
              <h3>Estado del sistema</h3>
              <span className="home-badge home-badge-ok">
                <span className="home-badge-dot" />
                Operativo
              </span>
            </div>
            <ul className="home-status-list">
              <li>
                <span>Portal de informes</span>
                <span className="home-status-ok">
                  <Icon path={ICONS.check} size={14} /> En línea
                </span>
              </li>
              <li>
                <span>Ingesta de datos</span>
                <span className="home-status-ok">
                  <Icon path={ICONS.check} size={14} /> En línea
                </span>
              </li>
              <li>
                <span>Motor de cierres</span>
                <span className="home-status-ok">
                  <Icon path={ICONS.check} size={14} /> En línea
                </span>
              </li>
            </ul>
          </div>

          {/* Novedades */}
          <div className="home-side-card">
            <div className="home-side-head">
              <h3>Novedades</h3>
            </div>
            <ul className="home-news">
              {NOVEDADES.map((n) => (
                <li key={n.titulo} className="home-news-item">
                  <div className="home-news-top">
                    <span
                      className="home-news-tag"
                      style={{ color: n.color, background: `${n.color}1f` }}
                    >
                      {n.tag}
                    </span>
                    <span className="home-news-date">{n.fecha}</span>
                  </div>
                  <span className="home-news-title">{n.titulo}</span>
                  <span className="home-news-text">{n.texto}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Consejos */}
          <div className="home-side-card">
            <div className="home-side-head">
              <h3>
                <Icon path={ICONS.libro} size={16} /> Consejos rápidos
              </h3>
            </div>
            <ul className="home-tips">
              {CONSEJOS.map((c) => (
                <li key={c}>
                  <Icon path={ICONS.check} size={15} />
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>

      {/* ── Footer ────────────────────────────────────────────────────────── */}
      <footer className="home-footer">
        <span>
          ¿Necesitas ayuda? Escríbenos a{" "}
          <a href="mailto:support-bi@xuma.la?subject=Soporte%20Panel%20BI">
            support-bi@xuma.la
          </a>
        </span>
        <span className="home-footer-brand">
          Xuma Insurtech · Operaciones y Analítica
        </span>
      </footer>
    </div>
  );
}
