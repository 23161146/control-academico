import { carreras, estudiantesPorCarrera } from "../data/estudiantes.js";

const TOTAL = 860;
const ACTIVOS = 852;
const MAX = 240;
const ticks = [240, 180, 120, 60, 0];
const colores = ["#D3F4EE", "#B4EDE3", "#73CDBC", "#43B1A5", "#3E9790", "#237571", "#1C4543"];

const Stat = ({ titulo, valor, detalle }) => (
  <article className="stat">
    <h3>{titulo}</h3>
    <strong>{valor}</strong>
    <p>{detalle}</p>
  </article>
);

export default function Inicio() {
  return (
    <section className="page page--inicio">
      <h1 className="page__title">Bienvenido</h1>
      <p className="page__sub">Aquí puedes consultar un resumen de información acerca de los estudiantes</p>

      <div className="stats">
        <Stat titulo="Total de estudiantes" valor={TOTAL} detalle="Estudiantes registrados" />
        <Stat titulo="Estudiantes activos" valor={ACTIVOS} detalle="Estudiantes cursando este semestre" />
      </div>

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
              {carreras.map((c, i) => (
                <div className="chart__col" key={c}>
                  <div className="chart__bar" title={`${c}: ${estudiantesPorCarrera[i]}`} style={{ height: `${(estudiantesPorCarrera[i] / MAX) * 100}%`, background: colores[i] }} />
                </div>
              ))}
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
