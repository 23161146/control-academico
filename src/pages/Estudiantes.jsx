import { useMemo, useState } from "react";
import { IconChevron } from "../components/Icons.jsx";
import { carreras, estudiantes, semestres } from "../data/estudiantes.js";

export default function Estudiantes() {
  const [busqueda, setBusqueda] = useState("");
  const [carrera, setCarrera] = useState("");
  const [semestre, setSemestre] = useState("");
  const [porPagina, setPorPagina] = useState(5);
  const [pagina, setPagina] = useState(1);

  const filtrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    return estudiantes.filter(
      (e) =>
        (!q || e.nombre.toLowerCase().includes(q) || e.correo.toLowerCase().includes(q)) &&
        (!carrera || e.carrera === carrera) &&
        (!semestre || e.semestre === Number(semestre))
    );
  }, [busqueda, carrera, semestre]);

  const totalPaginas = Math.max(1, Math.ceil(filtrados.length / porPagina));
  const actual = Math.min(pagina, totalPaginas);
  const visibles = filtrados.slice((actual - 1) * porPagina, actual * porPagina);

  // Cualquier cambio de filtro regresa a la primera página
  const filtrar = (setter) => (e) => { setter(e.target.value); setPagina(1); };

  return (
    <section className="page page--gris">
      <article className="card tabla-card">
        <h2>Estudiantes registrados</h2>
        <p className="page__sub">Consulta y administra los estudiantes registrados en el sistema</p>

        <div className="filtros">
          <input className="campo campo--buscar" type="search" placeholder="Buscar Estudiante" aria-label="Buscar estudiante" value={busqueda} onChange={filtrar(setBusqueda)} />
          <div className="select">
            <select aria-label="Filtrar por carrera" value={carrera} onChange={filtrar(setCarrera)}>
              <option value="">Todas las carreras</option>
              {carreras.map((c) => <option key={c}>{c}</option>)}
            </select>
            <IconChevron />
          </div>
          <div className="select">
            <select aria-label="Filtrar por semestre" value={semestre} onChange={filtrar(setSemestre)}>
              <option value="">Todos los semestres</option>
              {semestres.map((s) => <option key={s} value={s}>{s}°</option>)}
            </select>
            <IconChevron />
          </div>
        </div>

        <div className="tabla">
          <table>
            <thead>
              <tr><th>Nombre</th><th>Correo</th><th>Carrera</th><th>Semestre</th><th>Acciones</th></tr>
            </thead>
            <tbody>
              {visibles.map((e) => (
                <tr key={e.id}>
                  <td>{e.nombre}</td>
                  <td>{e.correo}</td>
                  <td>{e.carrera}</td>
                  <td>{e.semestre}°</td>
                  <td className="acciones">
                    <button type="button">Ver</button> · <button type="button">Editar</button>
                  </td>
                </tr>
              ))}
              {visibles.length === 0 && (
                <tr><td colSpan="5" className="vacio">No hay estudiantes que coincidan con la búsqueda. Cambia los filtros para ver resultados.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <footer className="paginacion">
          <label className="paginacion__tam">
            Mostrar
            <span className="select select--sm">
              <select value={porPagina} onChange={(e) => { setPorPagina(Number(e.target.value)); setPagina(1); }}>
                {[5, 10, 15].map((n) => <option key={n} value={n}>{n} registros</option>)}
              </select>
              <IconChevron />
            </span>
            por página.
          </label>

          <nav className="paginacion__nav" aria-label="Paginación">
            <button type="button" disabled={actual === 1} onClick={() => setPagina(actual - 1)} aria-label="Página anterior">&lt;</button>
            {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((n) => (
              <button key={n} type="button" className={n === actual ? "is-active" : ""} aria-current={n === actual ? "page" : undefined} onClick={() => setPagina(n)}>{n}</button>
            ))}
            <button type="button" disabled={actual === totalPaginas} onClick={() => setPagina(actual + 1)} aria-label="Página siguiente">&gt;</button>
          </nav>
        </footer>
      </article>
    </section>
  );
}
