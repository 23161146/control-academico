import { useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import Login from "./pages/Login.jsx";
import Inicio from "./pages/Inicio.jsx";
import Estudiantes from "./pages/Estudiantes.jsx";

const Pendiente = ({ titulo }) => (
  <section className="page">
    <h1 className="page__title">{titulo}</h1>
    <p className="page__sub">Esta sección aún no está disponible.</p>
  </section>
);

export default function App() {
  const [usuario, setUsuario] = useState(() => localStorage.getItem("usuario"));

  const entrar = (correo) => {
    localStorage.setItem("usuario", correo);
    setUsuario(correo);
  };
  const salir = () => {
    localStorage.removeItem("usuario");
    setUsuario(null);
  };

  return (
    <Routes>
      <Route path="/" element={usuario ? <Navigate to="/inicio" replace /> : <Login onLogin={entrar} />} />
      <Route element={usuario ? <Layout onLogout={salir} /> : <Navigate to="/" replace />}>
        <Route path="/inicio" element={<Inicio />} />
        <Route path="/estudiantes" element={<Estudiantes />} />
        <Route path="/reportes" element={<Pendiente titulo="Reportes" />} />
        <Route path="/horario" element={<Pendiente titulo="Horario" />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
