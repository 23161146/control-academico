import { useEffect, useState } from "react";
import StatCard from "../components/StatCard";
import StudentsTable from "../components/StudentsTable";
import GradesChart from "../components/GradesChart";
import { calcularResumen, getAlumnos, promedioPorMateria } from "../services/dashboardService";
import "../components/dashboard.css";

export default function InformacionAcademica() {
  const [alumnos, setAlumnos] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    getAlumnos().then((d) => {
      setAlumnos(d);
      setCargando(false);
    });
  }, []);

  if (cargando) return <p style={{ padding: "1.5rem" }}>Cargando información…</p>;

  const resumen = calcularResumen(alumnos);

  return (
    <div className="dashboard">
      <div className="stats">
        <StatCard titulo="Registros" valor={resumen.total} detalle="Alumnos con calificación" />
        <StatCard titulo="Promedio general" valor={resumen.promedio} detalle="Escala de 0 a 10" />
        <StatCard titulo="Asistencia" valor={`${resumen.asistencia}%`} detalle="Promedio del grupo" />
        <StatCard titulo="Aprobación" valor={`${resumen.aprobacion}%`} detalle="Calificación mínima: 6" />
      </div>
      <GradesChart datos={promedioPorMateria(alumnos)} />
      <StudentsTable alumnos={alumnos} />
    </div>
  );
}
