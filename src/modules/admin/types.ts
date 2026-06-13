// Modelos del panel de Configuración. Reflejan el contrato que el backend
// expondrá bajo /admin/* (ver adminApi.ts).

export type AdminUsuario = {
  usuario: string;
  nombre: string;
  permisos: string[]; // paths de elementos asignados al usuario
};

export type Elemento = {
  name: string;
  path: string; // identificador único (slug del informe o id del componente)
  type: "informe" | "componente";
  url?: string; // destino embebido para informes (Power BI, etc.)
  seccion: string;
  grupo: string;
};

export type NuevoUsuario = {
  usuario: string;
  nombre: string;
  clave: string;
};

export type NuevoElemento = {
  name: string;
  path: string;
  type: "informe" | "componente";
  url?: string;
  grupoId: number; // grupo destino dentro de la jerarquía
};

// ── Jerarquía de navegación (Fase 2) ─────────────────────────────────────────
// Árbol completo (sin filtrar por permisos) que consume el panel admin para
// ubicar elementos nuevos. Los ids son numéricos (PK de la BD).
export type GrupoJerarquia = {
  id: number;
  nombre: string;
  icono: string;
};

export type SeccionJerarquia = {
  id: number;
  nombre: string;
  icono: string;
  grupos: GrupoJerarquia[];
};

export type DominioJerarquia = {
  id: number;
  codigo: string;
  nombre: string;
  icono: string;
  secciones: SeccionJerarquia[];
};
