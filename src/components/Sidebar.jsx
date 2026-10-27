import { NavLink } from "react-router-dom";
import { IconBars, IconHome, IconUsers } from "./Icons.jsx";

const enlaces = [
  { to: "/inicio", texto: "Inicio", icono: <IconHome /> },
  { to: "/estudiantes", texto: "Estudiantes", icono: <IconUsers /> },
  { to: "/informacion", texto: "Información académica", icono: <IconBars /> },
  { to: "/reportes", texto: "Reportes", icono: <IconBars /> },
  { to: "/horario", texto: "Horario", icono: <IconBars /> },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar__brand">SITUA</div>
      <nav className="sidebar__nav" aria-label="Navegación principal">
        {enlaces.map(({ to, texto, icono }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              "nav-item" + (isActive ? " is-active" : "")
            }
          >
            {icono}
            <span>{texto}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
