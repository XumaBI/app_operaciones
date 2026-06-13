import { useEffect, useState } from "react";

/**
 * Devuelve true cuando el viewport coincide con la media query (móvil por defecto).
 * Inicializa de forma síncrona para evitar parpadeos en el primer render.
 */
export function useIsMobile(query = "(max-width: 768px)") {
  const [matches, setMatches] = useState(
    () => typeof window !== "undefined" && window.matchMedia(query).matches
  );

  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    onChange();
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}
