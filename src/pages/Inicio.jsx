import { useEffect, useState } from "react";
import { carreras, estudiantesPorCarrera } from "../data/estudiantes.js";

const API_TOTAL = "https://dumbapis.com/number?min=860&max=872";
const API_ACTIVOS = "https://dumbapis.com/number?min=780&max=820";
const API_GRAFICA = "https://www.randomnumberapi.com/api/v1.0/random?min=70&max=221&count=7";
const CACHE_KEY = "estadisticasInicio";
const MAX = 240;
const ticks = [240, 180, 120, 60, 0];
const colores = ["#D3F4EE", "#B4EDE3", "#73CDBC", "#43B1A5", "#3E9790", "#237571", "#1C4543"];

let consultaCompletada = false;

function leerCache() {
  try {
    const guardado = localStorage.getItem(CACHE_KEY);
    return guardado ? JSON.parse(guardado) : null;
  } catch {
    return null;
  }
}

function guardarCache(datos) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(datos));
  } catch {
    return;
  }
}

const Stat = ({ titulo, valor, detalle }) => (
  <article className="stat">
    <h3>{titulo}</h3>
    <strong>{valor}</strong>
    <p>{detalle}</p>
  </article>
);

export default function Inicio() {
  const [total, setTotal] = useState(() => leerCache()?.total ?? null);
  const [activos, setActivos] = useState(() => leerCache()?.activos ?? null);
  const [grafica, setGrafica] = useState(() => leerCache()?.grafica ?? estudiantesPorCarrera);
  const [error, setError] = useState(false);

  useEffect(() => {
    const cache = leerCache();

    if (consultaCompletada && cache?.grafica) {
      return undefined;
    }

    const controlador = new AbortController();
    let nuevoTotal = null;
    let nuevosActivos = null;
    let nuevaGrafica = null;

    const guardar = () => {
      if (nuevoTotal !== null && nuevosActivos !== null && nuevaGrafica !== null) {
        guardarCache({ total: nuevoTotal, activos: nuevosActivos, grafica: nuevaGrafica });
        consultaCompletada = true;
      }
    };

    fetch(API_TOTAL, { signal: controlador.signal })
      .then((response) => {
        if (!response.ok) {
          throw new Error("No se pudo obtener el total de estudiantes.");
        }
        return response.json();
      })
      .then((data) => {
        nuevoTotal = data.result;
        setTotal(data.result);
        guardar();
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          setError(true);
        }
      });

    fetch(API_ACTIVOS, { signal: controlador.signal })
      .then((response) => {
        if (!response.ok) {
          throw new Error("No se pudieron obtener los estudiantes activos.");
        }
        return response.json();
      })
      .then((data) => {
        nuevosActivos = data.result;
        setActivos(data.result);
        guardar();
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          setError(true);
        }
      });

    fetch(API_GRAFICA, { signal: controlador.signal })
      .then((response) => {
        if (!response.ok) {
          throw new Error("No se pudieron obtener los datos de la gráfica.");
        }
        return response.json();
      })
      .then((data) => {
        nuevaGrafica = data;
        setGrafica(data);
        guardar();
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          setError(true);
        }
      });

    return () => controlador.abort();
  }, []);

  return (
    <section className="page page--inicio">
      <h1 className="page__title">Bienvenido</h1>
      <p className="page__sub">Aquí puedes consultar un resumen de información acerca de los estudiantes</p>

      <div className="stats">
        <Stat titulo="Total de estudiantes" valor={total ?? "—"} detalle="Estudiantes registrados" />
        <Stat titulo="Estudiantes activos" valor={activos ?? "—"} detalle="Estudiantes cursando este semestre" />
      </div>

      {error && <p className="page__sub" role="alert">No se pudieron cargar algunas estadísticas.</p>}

      <article className="card chart">
        <h2>Estudiantes por carrera</h2>
        <p className="page__sub">Distribución de estudiantes inscritos por programa académico</p>

        <div className="chart__area" role="img" aria-label="Gráfica de barras de estudiantes por carrera">
          <div className="chart__axis">
            {ticks.map((t) => <span key={t}>{t}</span>)}
          </div>
          <div className="chart__plot">
            {ticks.map((t) => <i key={t} className="chart__grid" style={{ bottom: `${(t / MAX) * 100}%` }} />)}
            <div className="chart__bars">
              {carreras.map((c, i) => {
                const valor = grafica[i] ?? 0;
                return (
                  <div className="chart__col" key={c}>
                    <div className="chart__bar" title={`${c}: ${valor}`} style={{ height: `${(valor / MAX) * 100}%`, background: colores[i] }} />
                  </div>
                );
              })}
            </div>
          </div>
          <div className="chart__labels">
            {carreras.map((c) => <span key={c}>{c}</span>)}
          </div>
        </div>
      </article>
    </section>
  );
}
