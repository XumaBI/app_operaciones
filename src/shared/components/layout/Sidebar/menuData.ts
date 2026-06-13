import { iconoPath } from "./iconos";

export type Informe = {
  name: string;
  path: string;
  type: "informe" | "componente";
};

export type Grupo = {
  name: string;
  iconPath: string;
  path: string;
  type?: "informe" | "componente"; // opcional: solo algunos grupos la usan
  informes: Informe[];
};

export type Seccion = {
  name: string;
  iconPath: string;
  path: string;
  grupos: Grupo[];
};

// Primer nivel de la navegación: un dominio agrupa secciones afines y se
// muestra como icono en el rail. Añadir un dominio nuevo = un objeto más aquí.
export type Dominio = {
  id: string;
  name: string;
  iconPath: string;
  // Si está presente, el dominio es protegido: solo aparece (completo, sin podar
  // hojas) cuando el usuario tiene este permiso. Ej. el panel de Configuración.
  requierePermiso?: string;
  secciones: Seccion[];
};

const ICON_INFORME =
  "M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8zm2 16H8v-2h8zm0-4H8v-2h8zm-3-5V3.5L18.5 9z";

export const MENU_DATA: Dominio[] = [
  // 🔹 DOMINIO INFORMES
  {
    id: "informes",
    name: "Informes",
    iconPath: "M4 9h4v11H4zm12 4h4v7h-4zm-6-9h4v16h-4z",
    secciones: [
      {
        name: "Inf. de Operación",
        iconPath: "M4 9h4v11H4zm12 4h4v7h-4zm-6-9h4v16h-4z",
        path: "/Operaciones",
        grupos: [
          {
            name: "Ejecución Global",
            iconPath: ICON_INFORME,
            path: "ejecucion-global",
            informes: [
              { name: "Ejecución Promigas", path: "ejecucion-promigas", type: "informe" },
              { name: "Ejecución Vanti", path: "ejecucion-vanti", type: "informe" },
              { name: "Ejecución Parcial", path: "ejecucion-parcial", type: "informe" },
              { name: "Ejecución Controladas", path: "controladas", type: "informe" },
              { name: "Ejecución Relacionadas", path: "relacionadas", type: "informe" },
            ],
          },
          {
            name: "Ejecución Distribuidora",
            iconPath: ICON_INFORME,
            path: "ejecucion-distribuidora",
            informes: [
              { name: "Caribe", path: "caribe", type: "informe" },
              { name: "Guajira", path: "guajira", type: "informe" },
              { name: "Efigas", path: "efigas", type: "informe" },
              { name: "Surtigas", path: "surtigas", type: "informe" },
              { name: "GDO", path: "gdo", type: "informe" },
              { name: "CEO", path: "ceo", type: "informe" },
            ],
          },
          {
            name: "Ejecución Aseguradora",
            iconPath: ICON_INFORME,
            path: "ejecucion-aseguradora",
            informes: [
              { name: "HDI", path: "hdi", type: "informe" },
              { name: "ALFA", path: "alfa", type: "informe" },
              { name: "IKE", path: "ike", type: "informe" },
              { name: "GNP", path: "gnp", type: "informe" },
            ],
          },
          {
            name: "Revisión",
            iconPath: ICON_INFORME,
            path: "revision",
            type: "informe",
            informes: [
              { name: "Revisión Ejecución", path: "revision-ejecucion", type: "informe" },
              { name: "Revisión Cargue", path: "revision-cargue", type: "informe" },
            ],
          },
          {
            name: "Comercial",
            iconPath: ICON_INFORME,
            path: "comercial",
            informes: [
              { name: "Informe de Cargues", path: "informe-cargues", type: "informe" },
              { name: "Informe 360°", path: "informe360", type: "informe" },
            ],
          },
        ],
      },

      {
        name: "Inf. Inteligencia de Canales",
        iconPath: "M4 9h4v11H4zm12 4h4v7h-4zm-6-9h4v16h-4z",
        path: "/IntelicenciaCanales",
        grupos: [
          {
            name: "Canal Digital",
            iconPath: ICON_INFORME,
            path: "canal-digital",
            informes: [
              { name: "Global", path: "digital-global", type: "informe" },
              { name: "Caribe", path: "digital-caribe", type: "informe" },
              { name: "Efigas", path: "digital-efigas", type: "informe" },
              { name: "GDO", path: "digital-gdo", type: "informe" },
              { name: "Surtigas", path: "digital-surtigas", type: "informe" },
            ],
          },
        ],
      },

      {
        name: "Inf. Ejecución Comercial",
        iconPath: "M4 9h4v11H4zm12 4h4v7h-4zm-6-9h4v16h-4z",
        path: "/EjecucionComercial",
        grupos: [
          {
            name: "Ejecucion Distribuidora",
            iconPath: ICON_INFORME,
            path: "ejecucion-comercial-gaseras",
            informes: [
              { name: "Gases del Caribe", path: "comercial-caribe", type: "informe" },
              { name: "Gases de Occidente", path: "comercial-gdo", type: "informe" },
              { name: "Efigas", path: "comercial-efigas", type: "informe" },
              { name: "CEO", path: "comercial-ceo", type: "informe" },
              { name: "Surtigas", path: "comercial-surtigas", type: "informe" },
            ],
          },
          {
            name: "Ejecucion Aseguradora",
            iconPath: ICON_INFORME,
            path: "ejecucion-comercial-aseguradora",
            informes: [
              { name: "HDI", path: "comercial-hdi", type: "informe" },
              { name: "ALFA", path: "comercial-alfa", type: "informe" },
              { name: "IKE", path: "comercial-ike", type: "informe" }
            ],
          },
        ],
      },

      {
        name: "Inf. Experiencia al cliente",
        iconPath: "M4 9h4v11H4zm12 4h4v7h-4zm-6-9h4v16h-4z",
        path: "/cx",
        grupos: [
          {
            name: "PQRS",
            iconPath: ICON_INFORME,
            path: "pqrs",
            informes: [
              { name: "Vanti", path: "pqrs-vanti", type: "informe" },
              { name: "Promigas", path: "pqrs-promigas", type: "informe" },
            ],
          },
        ],
      },
    ],
  },

  // 🔹 DOMINIO INGESTA DE DATOS
  {
    id: "ingesta",
    name: "Ingesta",
    iconPath: "M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z",
    secciones: [
      {
        name: "Ingesta de Datos",
        iconPath: "M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z",
        path: "/Ingesta",
        grupos: [
          {
            name: "Operaciones",
            iconPath: "M3 3h18v2H3zm0 4h18v2H3zm0 4h18v2H3zm0 4h12v2H3zm0 4h8v2H3z",
            path: "ingesta-operaciones",
            informes: [
              { name: "Cierres de Distribuidora", path: "Ejecucion", type: "componente" },
            ],
          },
        ],
      },
    ],
  },

  // 🔹 DOMINIO CONFIGURACIÓN (protegido: requiere permiso "config-admin")
  {
    id: "configuracion",
    name: "Configuración",
    iconPath:
      "M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z",
    requierePermiso: "config-admin",
    secciones: [
      {
        name: "Usuarios",
        iconPath:
          "M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z",
        path: "/config/usuarios",
        grupos: [
          {
            name: "Gestión de usuarios",
            iconPath:
              "M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z",
            path: "config-usuarios-grupo",
            informes: [
              { name: "Usuarios y contraseñas", path: "admin-usuarios", type: "componente" },
            ],
          },
        ],
      },
      {
        name: "Elementos",
        iconPath: ICON_INFORME,
        path: "/config/elementos",
        grupos: [
          {
            name: "Catálogo de informes y elementos",
            iconPath: ICON_INFORME,
            path: "config-elementos-grupo",
            informes: [
              { name: "Informes y elementos", path: "admin-elementos", type: "componente" },
            ],
          },
        ],
      },
      {
        name: "Asignaciones",
        iconPath:
          "M12.65 10C11.83 7.67 9.61 6 7 6c-3.31 0-6 2.69-6 6s2.69 6 6 6c2.61 0 4.83-1.67 5.65-4H17v4h4v-4h2v-4H12.65zM7 14c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z",
        path: "/config/asignaciones",
        grupos: [
          {
            name: "Permisos por usuario",
            iconPath:
              "M12.65 10C11.83 7.67 9.61 6 7 6c-3.31 0-6 2.69-6 6s2.69 6 6 6c2.61 0 4.83-1.67 5.65-4H17v4h4v-4h2v-4H12.65zM7 14c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z",
            path: "config-asignaciones-grupo",
            informes: [
              { name: "Asignación de accesos", path: "admin-asignaciones", type: "componente" },
            ],
          },
        ],
      },
      {
        name: "Estructura",
        iconPath: "M3 3h18v2H3zm0 4h18v2H3zm0 4h18v2H3zm0 4h12v2H3zm0 4h8v2H3z",
        path: "/config/estructura",
        grupos: [
          {
            name: "Secciones y grupos",
            iconPath: "M3 3h18v2H3zm0 4h18v2H3zm0 4h18v2H3zm0 4h12v2H3zm0 4h8v2H3z",
            path: "config-estructura-grupo",
            informes: [
              { name: "Estructura del menú", path: "admin-estructura", type: "componente" },
            ],
          },
        ],
      },
    ],
  },
];

// Poda el menú según los permisos de hoja del usuario: un grupo solo aparece si
// tiene al menos una hoja permitida, una sección solo si tiene al menos un grupo
// visible, y un dominio solo si tiene al menos una sección visible. La jerarquía
// vive aquí (front); la BD solo guarda los permisos de hoja.
//
// Excepción: un dominio con `requierePermiso` (protegido, ej. Configuración) no
// se poda por hoja — aparece completo solo si el usuario tiene ese permiso.
export function filtrarDominiosPorPermisos(permisosInformes: string[]): Dominio[] {
  const permitidos = new Set(permisosInformes);
  const resultado: Dominio[] = [];

  for (const dominio of MENU_DATA) {
    if (dominio.requierePermiso) {
      if (permitidos.has(dominio.requierePermiso)) resultado.push(dominio);
      continue;
    }

    const secciones = dominio.secciones
      .map((seccion) => ({
        ...seccion,
        grupos: seccion.grupos
          .map((grupo) => ({
            ...grupo,
            informes: grupo.informes.filter((i) => permitidos.has(i.path)),
          }))
          .filter((grupo) => grupo.informes.length > 0),
      }))
      .filter((seccion) => seccion.grupos.length > 0);

    if (secciones.length > 0) resultado.push({ ...dominio, secciones });
  }

  return resultado;
}

// ─────────────────────────────────────────────────────────────────────────────
// Árbol entregado por el backend (/auth/me) — Fase 1 menú dinámico.
// El backend lo arma desde la BD ya filtrado por permisos; los iconos viajan
// como CLAVE (ver iconos.ts), no como path SVG.
// ─────────────────────────────────────────────────────────────────────────────
export type InformeApi = {
  name: string;
  path: string;
  type: "informe" | "componente";
};
export type GrupoApi = { name: string; icono: string; informes: InformeApi[] };
export type SeccionApi = { name: string; icono: string; grupos: GrupoApi[] };
export type DominioApi = {
  id: string;
  name: string;
  icono: string;
  requierePermiso?: string | null;
  secciones: SeccionApi[];
};

// Convierte el árbol de la API al modelo de render (resuelve icono→iconPath).
export function arbolDesdeApi(menu: DominioApi[]): Dominio[] {
  return menu.map((d) => ({
    id: d.id,
    name: d.name,
    iconPath: iconoPath(d.icono),
    requierePermiso: d.requierePermiso ?? undefined,
    secciones: d.secciones.map((s) => ({
      name: s.name,
      iconPath: iconoPath(s.icono),
      path: "",
      grupos: s.grupos.map((g) => ({
        name: g.name,
        iconPath: iconoPath(g.icono),
        path: "",
        informes: g.informes,
      })),
    })),
  }));
}
