export default function ModalEstudiante({
  modal,
  formulario,
  aviso,
  carreras,
  semestres,
  onCerrar,
  onGuardar,
  onFormularioChange,
}) {
  const actualizarCampo = (campo, valor) => {
    onFormularioChange({ ...formulario, [campo]: valor });
  };

  return (
    <div
      className="modal-fondo"
      role="presentation"
      onMouseDown={(evento) => {
        if (evento.target === evento.currentTarget) {
          onCerrar();
        }
      }}
    >
      <section
        className="modal-estudiante"
        role="dialog"
        aria-modal="true"
        aria-labelledby="titulo-modal"
      >
        <div className="modal-estudiante__cabecera">
          <h2 id="titulo-modal">
            {modal.tipo === "nuevo"
              ? "Agregar estudiante"
              : modal.tipo === "ver"
                ? "Detalle del estudiante"
                : "Editar estudiante"}
          </h2>
          <button type="button" aria-label="Cerrar" onClick={onCerrar}>
            ×
          </button>
        </div>

        <form onSubmit={onGuardar} noValidate>
          <label>
            Nombre completo
            <input
              required
              disabled={modal.tipo === "ver"}
              value={formulario.nombre}
              onChange={(evento) =>
                actualizarCampo("nombre", evento.target.value)
              }
            />
          </label>

          <label>
            Correo electrónico
            <input
              required
              type="email"
              disabled={modal.tipo === "ver"}
              value={formulario.correo}
              onChange={(evento) =>
                actualizarCampo("correo", evento.target.value)
              }
            />
          </label>

          <label>
            Carrera
            <select
              disabled={modal.tipo === "ver"}
              value={formulario.carrera}
              onChange={(evento) =>
                actualizarCampo("carrera", evento.target.value)
              }
            >
              {!carreras.includes(formulario.carrera) &&
                formulario.carrera && (
                  <option value={formulario.carrera}>
                    {formulario.carrera}
                  </option>
                )}
              {carreras.map((opcion) => (
                <option key={opcion} value={opcion}>
                  {opcion}
                </option>
              ))}
            </select>
          </label>

          <label>
            Semestre
            <select
              disabled={modal.tipo === "ver"}
              value={formulario.semestre}
              onChange={(evento) =>
                actualizarCampo("semestre", evento.target.value)
              }
            >
              {semestres.map((opcion) => (
                <option key={opcion} value={opcion}>
                  {opcion}° semestre
                </option>
              ))}
            </select>
          </label>

          {aviso && (
            <p className="login__error" role="alert">
              {aviso}
            </p>
          )}

          <div className="modal-estudiante__acciones">
            <button
              type="button"
              className="accion-secundaria"
              onClick={onCerrar}
            >
              Cerrar
            </button>
            {modal.tipo !== "ver" && (
              <button type="submit" className="accion-principal">
                {modal.tipo === "nuevo"
                  ? "Agregar alumno"
                  : "Guardar cambios"}
              </button>
            )}
          </div>
        </form>
      </section>
    </div>
  );
}
