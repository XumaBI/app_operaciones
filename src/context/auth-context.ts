import { createContext, useContext } from "react";

export type Usuario = {
  nombre: string;
  usuario: string;
  permisosInformes: string[];
  informes: Record<string, string>; // codigo -> url, solo los permitidos
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
