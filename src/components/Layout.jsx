import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar.jsx";
import Topbar from "./Topbar.jsx";

export default function Layout({ usuario, onLogout }) {
  const navigate = useNavigate();

  const cerrarSesion = () => {
    if (onLogout) {
      onLogout();
    }

    navigate("/", { replace: true });
  };

  return (
    <div className="shell">
      <Sidebar />
      <div className="shell__main">
        <Topbar usuario={usuario} onLogout={cerrarSesion} />
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
