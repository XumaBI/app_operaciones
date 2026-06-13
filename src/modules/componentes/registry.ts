import { lazy } from "react";
import type { ComponentType } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// Registro de componentes navegables (elementos type: "componente").
//
// Un "componente" es código React real: para que exista debe estar listado AQUÍ
// y desplegado. La BD/el panel admin NO pueden crear componentes nuevos; solo
// pueden ubicar/asignar uno ya registrado. Esta es la única fuente de verdad de
// qué componentes existen en el front.
//
// Para añadir uno nuevo: codifícalo, regístralo aquí (id + label + import) y
// despliega. Después, desde Configuración → Elementos se "enchufa" al menú.
// ─────────────────────────────────────────────────────────────────────────────

export type ComponenteDef = {
  id: string; // = path del elemento; debe ser único
  label: string; // nombre sugerido al registrarlo en el menú
  cargar: () => Promise<{ default: ComponentType }>;
};

export const COMPONENTES_REGISTRO: ComponenteDef[] = [
  {
    id: "Ejecucion",
    label: "Cierres de Distribuidora",
    cargar: () => import("../ingesta/components/Ejecucion"),
  },
  {
    id: "admin-usuarios",
    label: "Usuarios y contraseñas",
    cargar: () => import("../admin/components/UsuariosAdmin"),
  },
  {
    id: "admin-elementos",
    label: "Informes y elementos",
    cargar: () => import("../admin/components/ElementosAdmin"),
  },
  {
    id: "admin-asignaciones",
    label: "Asignación de accesos",
    cargar: () => import("../admin/components/AsignacionesAdmin"),
  },
  {
    id: "admin-estructura",
    label: "Estructura del menú",
    cargar: () => import("../admin/components/EstructuraAdmin"),
  },
];

// Mapa id → componente lazy, para el router (/componente/:id).
export const COMPONENTES: Record<string, ComponentType> = Object.fromEntries(
  COMPONENTES_REGISTRO.map((c) => [c.id, lazy(c.cargar)])
);

// Lista ligera (id + label) para el panel admin, sin cargar el código.
export const COMPONENTES_DISPONIBLES = COMPONENTES_REGISTRO.map(
  ({ id, label }) => ({ id, label })
);
