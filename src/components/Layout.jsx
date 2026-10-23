import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { IconBars, IconHome, IconUsers } from "./Icons.jsx";
import avatar from "../assets/avatar.jpg";

const enlaces = [
  { to: "/inicio", texto: "Inicio", icono: <IconHome /> },
  { to: "/estudiantes", texto: "Estudiantes", icono: <IconUsers /> },
  { to: "/reportes", texto: "Reportes", icono: <IconBars /> },
  { to: "/horario", texto: "Horario", icono: <IconBars /> },
];

export default function Layout({ onLogout }) {
  const navigate = useNavigate();
  const cerrarSesion = () => {
    onLogout();
    navigate("/", { replace: true });
  };

  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="sidebar__brand">Control Académico</div>
        <nav className="sidebar__nav">
          {enlaces.map(({ to, texto, icono }) => (
            <NavLink key={to} to={to} className={({ isActive }) => "nav-item" + (isActive ? " is-active" : "")}>
              {icono}
              <span>{texto}</span>
            </NavLink>
          ))}
          <button type="button" className="nav-item" onClick={cerrarSesion}>
            <IconBars />
            <span>Cerrar sesion</span>
          </button>
        </nav>
      </aside>

      <div className="shell__main">
        <header className="topbar">
          <strong>Control Académico</strong>
          <div className="topbar__user">
            <span>Jose García</span>
            <img src={avatar} alt="Foto de perfil de Jose García" />
          </div>
        </header>
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
