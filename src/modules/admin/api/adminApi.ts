import apiClient from "../../../api/apiClient";
import { MENU_DATA } from "../../../shared/components/layout/Sidebar/menuData";
import type {
  ActualizarElemento,
  AdminUsuario,
  DominioJerarquia,
  Elemento,
  GrupoJerarquia,
  NuevoElemento,
  NuevoUsuario,
  SeccionJerarquia,
} from "../types";

// ─────────────────────────────────────────────────────────────────────────────
// Capa de administración (dominio Configuración).
//
// El backend todavía no expone los endpoints /admin/*; mientras tanto, todas las
// funciones operan contra un store en memoria (USAR_MOCK = true). Cada función
// documenta el endpoint real que deberá implementar el backend. Cuando estén
// listos, poner USAR_MOCK = false y se ejecutará la rama real con apiClient.
//
// Contrato propuesto:
//   GET    /admin/usuarios                     -> AdminUsuario[]
//   POST   /admin/usuarios                     {usuario,nombre,clave} -> AdminUsuario
//   PATCH  /admin/usuarios/:usuario            {nombre} -> AdminUsuario
//   POST   /admin/usuarios/:usuario/clave      {clave} -> 204
//   GET    /admin/elementos                    -> Elemento[]
//   POST   /admin/elementos                    NuevoElemento -> Elemento
//   PATCH  /admin/elementos/:path              ActualizarElemento -> Elemento
//   PUT    /admin/usuarios/:usuario/permisos   {permisos:string[]} -> AdminUsuario
//   --- Jerarquía (Fase 2) ---
//   GET    /admin/jerarquia                     -> DominioJerarquia[]
//   POST   /admin/secciones                     {dominioId,nombre,icono} -> SeccionJerarquia
//   POST   /admin/grupos                        {seccionId,nombre,icono} -> GrupoJerarquia
//   --- Jerarquía: edición/orden (Fase 2b) ---
//   PATCH  /admin/secciones/:id                 {nombre,icono} -> SeccionJerarquia
//   DELETE /admin/secciones/:id                 -> 204
//   PATCH  /admin/grupos/:id                     {nombre,icono} -> GrupoJerarquia
//   DELETE /admin/grupos/:id                     -> 204
//   PUT    /admin/dominios/:id/secciones/orden  {orden:number[]} -> 204
//   PUT    /admin/secciones/:id/grupos/orden     {orden:number[]} -> 204
// ─────────────────────────────────────────────────────────────────────────────

export const USAR_MOCK = false;

// ── Semilla del store mock ──────────────────────────────────────────────────
function elementosDesdeMenu(): Elemento[] {
  const out: Elemento[] = [];
  for (const dominio of MENU_DATA) {
    if (dominio.requierePermiso) continue; // los elementos admin no se asignan
    for (const seccion of dominio.secciones) {
      for (const grupo of seccion.grupos) {
        for (const inf of grupo.informes) {
          out.push({
            name: inf.name,
            path: inf.path,
            type: inf.type,
            seccion: seccion.name,
            grupo: grupo.name,
          });
        }
      }
    }
  }
  return out;
}

let mockElementos: Elemento[] = elementosDesdeMenu();

let mockUsuarios: AdminUsuario[] = [
  {
    usuario: "admin",
    nombre: "Administrador",
    permisos: mockElementos.map((e) => e.path),
  },
  {
    usuario: "caribe.ops",
    nombre: "Especialista Caribe",
    permisos: ["caribe", "comercial-caribe", "digital-caribe"],
  },
  {
    usuario: "guajira.ops",
    nombre: "Especialista Guajira",
    permisos: ["guajira"],
  },
];

// Secuencia para ids numéricos del mock (en BD real son SERIAL).
let _seq = 100;
const nuevoId = () => ++_seq;

function jerarquiaDesdeMenu(): DominioJerarquia[] {
  return MENU_DATA.filter((d) => !d.requierePermiso).map((d) => ({
    id: nuevoId(),
    codigo: d.id,
    nombre: d.name,
    icono: "grafico",
    secciones: d.secciones.map((s) => ({
      id: nuevoId(),
      nombre: s.name,
      icono: "grafico",
      grupos: s.grupos.map((g) => ({
        id: nuevoId(),
        nombre: g.name,
        icono: "documento",
      })),
    })),
  }));
}

let mockJerarquia: DominioJerarquia[] = jerarquiaDesdeMenu();

// Resuelve un grupo a los nombres de su sección y grupo (para el catálogo plano).
function ubicacionDeGrupo(
  grupoId: number
): { seccion: string; grupo: string } | null {
  for (const d of mockJerarquia) {
    for (const s of d.secciones) {
      for (const g of s.grupos) {
        if (g.id === grupoId) return { seccion: s.nombre, grupo: g.nombre };
      }
    }
  }
  return null;
}

// Simula la latencia de red para que los estados de carga sean realistas.
const delay = <T,>(valor: T, ms = 280): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(valor), ms));

const clonar = <T,>(v: T): T => JSON.parse(JSON.stringify(v));

// ── Usuarios ────────────────────────────────────────────────────────────────
export async function listarUsuarios(): Promise<AdminUsuario[]> {
  if (!USAR_MOCK) {
    const res = await apiClient.get<AdminUsuario[]>("/admin/usuarios");
    return res.data;
  }
  return delay(clonar(mockUsuarios));
}

export async function crearUsuario(input: NuevoUsuario): Promise<AdminUsuario> {
  if (!USAR_MOCK) {
    const res = await apiClient.post<AdminUsuario>("/admin/usuarios", input);
    return res.data;
  }
  if (mockUsuarios.some((u) => u.usuario === input.usuario)) {
    throw new Error("Ya existe un usuario con ese identificador.");
  }
  const nuevo: AdminUsuario = {
    usuario: input.usuario,
    nombre: input.nombre,
    permisos: [],
  };
  mockUsuarios = [...mockUsuarios, nuevo];
  return delay(clonar(nuevo));
}

export async function actualizarDatosUsuario(
  usuario: string,
  datos: { nombre: string }
): Promise<AdminUsuario> {
  if (!USAR_MOCK) {
    const res = await apiClient.patch<AdminUsuario>(
      `/admin/usuarios/${usuario}`,
      datos
    );
    return res.data;
  }
  mockUsuarios = mockUsuarios.map((u) =>
    u.usuario === usuario ? { ...u, nombre: datos.nombre } : u
  );
  const actualizado = mockUsuarios.find((u) => u.usuario === usuario)!;
  return delay(clonar(actualizado));
}

export async function cambiarClave(
  usuario: string,
  clave: string
): Promise<void> {
  if (!USAR_MOCK) {
    await apiClient.post(`/admin/usuarios/${usuario}/clave`, { clave });
    return;
  }
  // En el mock no se persiste la clave; solo simulamos el envío.
  await delay(null);
}

// ── Elementos ─────────────────────────────────────────────────────────────────
export async function listarElementos(): Promise<Elemento[]> {
  if (!USAR_MOCK) {
    const res = await apiClient.get<Elemento[]>("/admin/elementos");
    return res.data;
  }
  return delay(clonar(mockElementos));
}

export async function crearElemento(input: NuevoElemento): Promise<Elemento> {
  if (!USAR_MOCK) {
    const res = await apiClient.post<Elemento>("/admin/elementos", input);
    return res.data;
  }
  if (mockElementos.some((e) => e.path === input.path)) {
    throw new Error("Ya existe un elemento con esa ruta (path).");
  }
  const ubic = ubicacionDeGrupo(input.grupoId);
  if (!ubic) throw new Error("El grupo destino no existe.");
  const nuevo: Elemento = {
    name: input.name,
    path: input.path,
    type: input.type,
    url: input.url,
    seccion: ubic.seccion,
    grupo: ubic.grupo,
  };
  mockElementos = [...mockElementos, nuevo];
  return delay(clonar(nuevo));
}

export async function actualizarElemento(
  path: string,
  datos: ActualizarElemento
): Promise<Elemento> {
  if (!USAR_MOCK) {
    const res = await apiClient.patch<Elemento>(
      `/admin/elementos/${path}`,
      datos
    );
    return res.data;
  }
  const ubic = datos.grupoId != null ? ubicacionDeGrupo(datos.grupoId) : null;
  if (datos.grupoId != null && !ubic) {
    throw new Error("El grupo destino no existe.");
  }
  let actualizado: Elemento | null = null;
  mockElementos = mockElementos.map((e) => {
    if (e.path !== path) return e;
    actualizado = {
      ...e,
      name: datos.name ?? e.name,
      url: datos.url ?? e.url,
      ...(ubic ? { seccion: ubic.seccion, grupo: ubic.grupo } : {}),
    };
    return actualizado;
  });
  if (!actualizado) throw new Error("El elemento no existe.");
  return delay(clonar(actualizado));
}

// ── Jerarquía ─────────────────────────────────────────────────────────────────
export async function listarJerarquia(): Promise<DominioJerarquia[]> {
  if (!USAR_MOCK) {
    const res = await apiClient.get<DominioJerarquia[]>("/admin/jerarquia");
    return res.data;
  }
  return delay(clonar(mockJerarquia));
}

export async function crearSeccion(input: {
  dominioId: number;
  nombre: string;
  icono: string;
}): Promise<SeccionJerarquia> {
  if (!USAR_MOCK) {
    const res = await apiClient.post<SeccionJerarquia>("/admin/secciones", input);
    return res.data;
  }
  const nueva: SeccionJerarquia = {
    id: nuevoId(),
    nombre: input.nombre,
    icono: input.icono,
    grupos: [],
  };
  mockJerarquia = mockJerarquia.map((d) =>
    d.id === input.dominioId
      ? { ...d, secciones: [...d.secciones, nueva] }
      : d
  );
  return delay(clonar(nueva));
}

export async function crearGrupo(input: {
  seccionId: number;
  nombre: string;
  icono: string;
}): Promise<GrupoJerarquia> {
  if (!USAR_MOCK) {
    const res = await apiClient.post<GrupoJerarquia>("/admin/grupos", input);
    return res.data;
  }
  const nuevo: GrupoJerarquia = {
    id: nuevoId(),
    nombre: input.nombre,
    icono: input.icono,
  };
  mockJerarquia = mockJerarquia.map((d) => ({
    ...d,
    secciones: d.secciones.map((s) =>
      s.id === input.seccionId ? { ...s, grupos: [...s.grupos, nuevo] } : s
    ),
  }));
  return delay(clonar(nuevo));
}

// ── Jerarquía: edición / eliminación / reordenamiento (Fase 2b) ───────────────
export async function actualizarSeccion(
  id: number,
  datos: { nombre: string; icono: string }
): Promise<SeccionJerarquia> {
  if (!USAR_MOCK) {
    const res = await apiClient.patch<SeccionJerarquia>(
      `/admin/secciones/${id}`,
      datos
    );
    return res.data;
  }
  let actualizada: SeccionJerarquia | null = null;
  mockJerarquia = mockJerarquia.map((d) => ({
    ...d,
    secciones: d.secciones.map((s) => {
      if (s.id !== id) return s;
      actualizada = { ...s, nombre: datos.nombre, icono: datos.icono };
      return actualizada;
    }),
  }));
  if (!actualizada) throw new Error("La sección no existe.");
  return delay(clonar(actualizada));
}

export async function eliminarSeccion(id: number): Promise<void> {
  if (!USAR_MOCK) {
    await apiClient.delete(`/admin/secciones/${id}`);
    return;
  }
  const sec = mockJerarquia
    .flatMap((d) => d.secciones)
    .find((s) => s.id === id);
  if (sec && sec.grupos.length > 0) {
    throw new Error("No se puede eliminar: la sección tiene grupos.");
  }
  mockJerarquia = mockJerarquia.map((d) => ({
    ...d,
    secciones: d.secciones.filter((s) => s.id !== id),
  }));
  await delay(null);
}

export async function actualizarGrupo(
  id: number,
  datos: { nombre: string; icono: string }
): Promise<GrupoJerarquia> {
  if (!USAR_MOCK) {
    const res = await apiClient.patch<GrupoJerarquia>(`/admin/grupos/${id}`, datos);
    return res.data;
  }
  let actualizado: GrupoJerarquia | null = null;
  mockJerarquia = mockJerarquia.map((d) => ({
    ...d,
    secciones: d.secciones.map((s) => ({
      ...s,
      grupos: s.grupos.map((g) => {
        if (g.id !== id) return g;
        actualizado = { ...g, nombre: datos.nombre, icono: datos.icono };
        return actualizado;
      }),
    })),
  }));
  if (!actualizado) throw new Error("El grupo no existe.");
  return delay(clonar(actualizado));
}

export async function eliminarGrupo(id: number): Promise<void> {
  if (!USAR_MOCK) {
    await apiClient.delete(`/admin/grupos/${id}`);
    return;
  }
  mockJerarquia = mockJerarquia.map((d) => ({
    ...d,
    secciones: d.secciones.map((s) => ({
      ...s,
      grupos: s.grupos.filter((g) => g.id !== id),
    })),
  }));
  await delay(null);
}

// Reordena por id: `orden` es la lista de ids en el nuevo orden.
export async function reordenarSecciones(
  dominioId: number,
  orden: number[]
): Promise<void> {
  if (!USAR_MOCK) {
    await apiClient.put(`/admin/dominios/${dominioId}/secciones/orden`, { orden });
    return;
  }
  mockJerarquia = mockJerarquia.map((d) =>
    d.id === dominioId
      ? {
          ...d,
          secciones: orden
            .map((id) => d.secciones.find((s) => s.id === id))
            .filter((s): s is SeccionJerarquia => Boolean(s)),
        }
      : d
  );
  await delay(null);
}

export async function reordenarGrupos(
  seccionId: number,
  orden: number[]
): Promise<void> {
  if (!USAR_MOCK) {
    await apiClient.put(`/admin/secciones/${seccionId}/grupos/orden`, { orden });
    return;
  }
  mockJerarquia = mockJerarquia.map((d) => ({
    ...d,
    secciones: d.secciones.map((s) =>
      s.id === seccionId
        ? {
            ...s,
            grupos: orden
              .map((id) => s.grupos.find((g) => g.id === id))
              .filter((g): g is GrupoJerarquia => Boolean(g)),
          }
        : s
    ),
  }));
  await delay(null);
}

// ── Asignaciones ──────────────────────────────────────────────────────────────
export async function guardarPermisos(
  usuario: string,
  permisos: string[]
): Promise<AdminUsuario> {
  if (!USAR_MOCK) {
    const res = await apiClient.put<AdminUsuario>(
      `/admin/usuarios/${usuario}/permisos`,
      { permisos }
    );
    return res.data;
  }
  mockUsuarios = mockUsuarios.map((u) =>
    u.usuario === usuario ? { ...u, permisos: [...permisos] } : u
  );
  const actualizado = mockUsuarios.find((u) => u.usuario === usuario)!;
  return delay(clonar(actualizado));
}
