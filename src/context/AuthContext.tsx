import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import apiClient, {
  getToken,
  setToken,
  clearToken,
  setOnUnauthorized,
} from "../api/apiClient";

export type Usuario = {
  nombre: string;
  usuario: string;
  permisosInformes: string[];
  informes: Record<string, string>; // codigo -> url, solo los permitidos
};

type LoginResponse = {
  access_token: string;
  usuario: Usuario;
};

type AuthContextType = {
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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    // Si el token expira a mitad de sesión, el interceptor de apiClient nos avisa.
    setOnUnauthorized(() => setUsuario(null));

    const restaurarSesion = async () => {
      if (!getToken()) {
        setCargando(false);
        return;
      }
      try {
        const res = await apiClient.get<Usuario>("/auth/me");
        setUsuario(res.data);
      } catch {
        clearToken();
        setUsuario(null);
      } finally {
        setCargando(false);
      }
    };

    restaurarSesion();
  }, []);

  const login = async (usuarioInput: string, clave: string) => {
    const res = await apiClient.post<LoginResponse>("/auth/login", {
      usuario: usuarioInput,
      clave,
    });
    setToken(res.data.access_token);
    setUsuario(res.data.usuario);
  };

  const logout = () => {
    clearToken();
    setUsuario(null);
  };

  return (
    <AuthContext.Provider value={{ usuario, cargando, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
