import { useEffect, useState } from "react";
import GradesChart from "../components/GradesChart";
import StatCard from "../components/StatCard";
import useEstadisticasAcademicas from "../hooks/useEstadisticasAcademicas.js";
import {
  calcularResumen,
  obtenerAlumnos,
  promedioPorMateria,
} from "../services/dashboardService";
import "../components/dashboard.css";

export default function InformacionAcademica() {
  const {
    estadisticas,
    cargando: cargandoEstadisticas,
    error: errorEstadisticas,
    recargarEstadisticas,
  } = useEstadisticasAcademicas();
  const [alumnosRespaldo, setAlumnosRespaldo] = useState([]);

  useEffect(() => {
    obtenerAlumnos().then(({ alumnos: datos }) => {
      setAlumnosRespaldo(datos);
    });
  }, []);

  const usarRespaldo =
    Boolean(errorEstadisticas) && alumnosRespaldo.length > 0;
  const resumen =
    estadisticas?.resumen ??
    (usarRespaldo ? calcularResumen(alumnosRespaldo) : null);
  const promediosMateria =
    estadisticas?.promediosMateria ??
    (usarRespaldo ? promedioPorMateria(alumnosRespaldo) : []);

  return (
    <div className="dashboard">
      {cargandoEstadisticas && (
        <p className="page__sub" role="status">
          Cargando estadísticas desde la API…
        </p>
      )}

      {errorEstadisticas && (
        <div className="error-api" role="alert">
          <p>{errorEstadisticas}</p>
          <p>Se muestran datos calculados localmente.</p>
          <button type="button" onClick={recargarEstadisticas}>
            Reintentar
          </button>
        </div>
      )}

      <div className="stats">
        <StatCard
          titulo="Registros"
          valor={resumen?.registros ?? "—"}
          detalle="Alumnos con calificación"
        />
        <StatCard
          titulo="Promedio general"
          valor={resumen?.promedio ?? "—"}
          detalle="Escala de 0 a 10"
        />
        <StatCard
          titulo="Asistencia"
          valor={resumen ? `${resumen.asistencia}%` : "—"}
          detalle="Promedio del grupo"
        />
        <StatCard
          titulo="Aprobación"
          valor={resumen ? `${resumen.aprobacion}%` : "—"}
          detalle="Calificación mínima: 6"
        />
      </div>

      {promediosMateria.length > 0 ? (
        <GradesChart datos={promediosMateria} />
      ) : (
        <section className="panel">
          <h2>Promedio por materia</h2>
          <p className="page__sub" role="status">
            {cargandoEstadisticas
              ? "Cargando datos de la gráfica…"
              : "No hay datos disponibles para la gráfica."}
          </p>
        </section>
      )}
    </div>
  );
}
