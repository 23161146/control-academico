import { useState, useEffect } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { IconBars, IconHome, IconUsers } from "./Icons.jsx";
import avatar from "../assets/avatar.jpg";

const enlaces = [
  { to: "/inicio", texto: "Inicio", icono: <IconHome /> },
  { to: "/estudiantes", texto: "Estudiantes", icono: <IconUsers /> },
  { to: "/informacion", texto: "Información académica", icono: <IconBars /> },
  { to: "/reportes", texto: "Reportes", icono: <IconBars /> },
  { to: "/horario", texto: "Horario", icono: <IconBars /> },
];

// Recibir usuario desde App.jsx
export default function Layout({ usuario, onLogout }) {
  const navigate = useNavigate();

  const cerrarSesion = () => {
    if (onLogout) onLogout();
    navigate("/", { replace: true });
  };

  // Obtener el nombre y la foto de usuario
  const nombreCompleto =
    usuario?.firstName && usuario?.lastName
      ? `${usuario.firstName} ${usuario.lastName}`
      : usuario?.username || "Usuario";

  const fotoPerfil = usuario?.image || avatar;

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
            <span>{nombreCompleto}</span>
            <img src={fotoPerfil} alt={`Foto de perfil de ${nombreCompleto}`} />
          </div>
        </header>
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
