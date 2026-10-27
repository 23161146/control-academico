export default function TablaEstudiantes({
  estudiantes,
  onVer,
  onEditar,
  onEliminar,
}) {
  return (
    <div className="tabla tabla-api">
      <table aria-label="Estudiantes registrados">
        <thead>
          <tr>
            <th scope="col">Nombre</th>
            <th scope="col">Correo</th>
            <th scope="col">Carrera</th>
            <th scope="col">Semestre</th>
            <th scope="col">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {estudiantes.map((estudiante) => (
            <tr key={estudiante.id}>
              <td>{estudiante.nombre}</td>
              <td>{estudiante.correo || "Correo no disponible"}</td>
              <td>{estudiante.carrera}</td>
              <td>{estudiante.semestre}°</td>
              <td className="acciones acciones-api">
                <button
                  type="button"
                  aria-label={`Ver detalles de ${estudiante.nombre}`}
                  onClick={() => onVer(estudiante)}
                >
                  Ver
                </button>
                {" · "}
                <button
                  type="button"
                  aria-label={`Editar a ${estudiante.nombre}`}
                  onClick={() => onEditar(estudiante)}
                >
                  Editar
                </button>
                {" · "}
                <button
                  type="button"
                  className="accion-eliminar"
                  aria-label={`Eliminar a ${estudiante.nombre}`}
                  onClick={() => onEliminar(estudiante)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
          {estudiantes.length === 0 && (
            <tr>
              <td colSpan={5} className="vacio">
                No hay alumnos que coincidan con los filtros.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
