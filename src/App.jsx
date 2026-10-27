import { useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import Login from "./pages/Login.jsx";
import Inicio from "./pages/Inicio.jsx";
import Estudiantes from "./pages/Estudiantes.jsx";
import InformacionAcademica from "./pages/InformacionAcademica.jsx";

const Pendiente = ({ titulo }) => (
  <section className="page">
    <h1 className="page__title">{titulo}</h1>
    <p className="page__sub">Esta sección aún no está disponible.</p>
  </section>
);

function leerUsuarioGuardado() {
  const guardado =
    localStorage.getItem("user") || sessionStorage.getItem("user");

  if (!guardado) {
    return null;
  }

  try {
    return JSON.parse(guardado);
  } catch {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    return null;
  }
}

export default function App() {
  // Leer el objeto completo del usuario si ya estaba guardado
  const [usuario, setUsuario] = useState(leerUsuarioGuardado);

  const entrar = (userData) => {
    localStorage.removeItem("estadisticasInicio");
    setUsuario(userData); // Guardar el objeto completo del usuario
  };

  const salir = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("usuario");
    localStorage.removeItem("estadisticasInicio");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    setUsuario(null);
  };

  return (
    <Routes>
      <Route path="/" element={usuario ? <Navigate to="/inicio" replace /> : <Login onLogin={entrar} />} />
      <Route element={usuario ? <Layout usuario={usuario} onLogout={salir} /> : <Navigate to="/" replace />}>
        <Route path="/inicio" element={<Inicio />} />
        <Route path="/estudiantes" element={<Estudiantes />} />
        <Route path="/informacion" element={<InformacionAcademica />} />
        <Route path="/reportes" element={<Pendiente titulo="Reportes" />} />
        <Route path="/horario" element={<Pendiente titulo="Horario" />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
