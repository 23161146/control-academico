import { useMemo, useState } from "react";

const COLUMNAS = [
  { key: "matricula", label: "Matrícula" },
  { key: "nombre", label: "Alumno" },
  { key: "carrera", label: "Carrera" },
  { key: "semestre", label: "Semestre" },
  { key: "materia", label: "Materia" },
  { key: "calificacion", label: "Calificación" },
  { key: "asistencia", label: "Asistencia" },
  { key: "estatus", label: "Estatus" },
];
const POR_PAGINA = 8;

export default function StudentsTable({ alumnos }) {
  const [busqueda, setBusqueda] = useState("");
  const [orden, setOrden] = useState({ key: "nombre", asc: true });
  const [pagina, setPagina] = useState(1);

  const filtrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    const lista = q
      ? alumnos.filter((a) =>
          [a.nombre, a.matricula, a.carrera, a.materia].some((v) =>
            String(v).toLowerCase().includes(q)
          )
        )
      : [...alumnos];
    lista.sort((a, b) => {
      const x = a[orden.key];
      const y = b[orden.key];
      const r = typeof x === "number" ? x - y : String(x).localeCompare(String(y), "es");
      return orden.asc ? r : -r;
    });
    return lista;
  }, [alumnos, busqueda, orden]);

  const totalPaginas = Math.max(1, Math.ceil(filtrados.length / POR_PAGINA));
  const visibles = filtrados.slice((pagina - 1) * POR_PAGINA, pagina * POR_PAGINA);

  const ordenarPor = (key) => {
    setOrden((o) => ({ key, asc: o.key === key ? !o.asc : true }));
    setPagina(1);
  };

  return (
    <section className="panel">
      <div className="panel__encabezado">
        <h2>Calificaciones por alumno</h2>
        <input
          type="search"
          className="buscador"
          placeholder="Buscar por nombre, matrícula o materia"
          value={busqueda}
          onChange={(e) => {
            setBusqueda(e.target.value);
            setPagina(1);
          }}
        />
      </div>

      <div className="tabla-scroll">
        <table className="tabla">
          <thead>
            <tr>
              {COLUMNAS.map((c) => (
                <th key={c.key} aria-sort={orden.key === c.key ? (orden.asc ? "ascending" : "descending") : "none"}>
                  <button type="button" onClick={() => ordenarPor(c.key)}>
                    {c.label}
                    {orden.key === c.key ? (orden.asc ? " ▲" : " ▼") : ""}
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visibles.length === 0 ? (
              <tr>
                <td colSpan={COLUMNAS.length} className="tabla__vacia">
                  No hay resultados. Prueba con otra búsqueda.
                </td>
              </tr>
            ) : (
              visibles.map((a) => (
                <tr key={a.id}>
                  <td>{a.matricula}</td>
                  <td>{a.nombre}</td>
                  <td>{a.carrera}</td>
                  <td>{a.semestre}</td>
                  <td>{a.materia}</td>
                  <td>{a.calificacion.toFixed(1)}</td>
                  <td>{a.asistencia}%</td>
                  <td>
                    <span className={`etiqueta etiqueta--${a.estatus === "Aprobado" ? "ok" : "no"}`}>
                      {a.estatus}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="paginacion">
        <span>
          {filtrados.length} registros · Página {pagina} de {totalPaginas}
        </span>
        <div>
          <button type="button" disabled={pagina === 1} onClick={() => setPagina((p) => p - 1)}>
            Anterior
          </button>
          <button type="button" disabled={pagina === totalPaginas} onClick={() => setPagina((p) => p + 1)}>
            Siguiente
          </button>
        </div>
      </div>
    </section>
  );
}
