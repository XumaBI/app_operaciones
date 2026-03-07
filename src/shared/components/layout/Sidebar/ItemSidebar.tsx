import { Link } from "react-router-dom";
type ItemProps = {
  title: string;
  path: string;
  type?: "informe" | "componente";
};

export function ItemSidebar({ title, path, type = "informe" }: ItemProps) {
  const destino = type === "informe" ? `/informe/${path}` : `/componente/${path}`;

  return (
    <Link to={destino} className="sidebar-item">
      {title}
    </Link>
  );
}
