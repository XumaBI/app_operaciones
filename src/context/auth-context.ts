import { createContext, useContext } from "react";
import type { DominioApi } from "../shared/components/layout/Sidebar/menuData";

export type Usuario = {
  nombre: string;
  usuario: string;
  permisosInformes: string[];
  informes: Record<string, string>; // codigo -> url, solo los permitidos
  // Árbol de navegación servido por el backend (Fase 1 menú dinámico). Mientras
  // el backend no lo entregue, queda undefined y el front cae al menú local.
  menu?: DominioApi[];
};

export type AuthContextType = {
  usuario: Usuario | null;
  cargando: boolean;
  login: (usuario: string, clave: string) => Promise<void>;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType>({
  usuario: null,
  cargando: true,
  login: async () => {},
  logout: () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}
