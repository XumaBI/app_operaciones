import { NavLink } from "react-router-dom";

type ItemProps = {
  title: string;
  path: string;
  type?: "informe" | "componente";
  onNavigate?: () => void;
};

export function ItemSidebar({
  title,
  path,
  type = "informe",
  onNavigate,
}: ItemProps) {
  const destino =
    type === "informe" ? `/informe/${path}` : `/componente/${path}`;

  return (
    <NavLink
      to={destino}
      onClick={onNavigate}
      className={({ isActive }) =>
        `sidebar-item ${isActive ? "active" : ""}`
      }
    >
      {title}
    </NavLink>
  );
}
