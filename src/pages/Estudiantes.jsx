import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { IconChevron } from "../components/Icons.jsx";
import { carreras, semestres } from "../data/estudiantes.js";

const API_URL =
  "https://my.api.mockaroo.com/alumnos.json?key=ce026c10";

const LIMITES = [10, 20, 40, 50];

function normalizarParaCorreo(texto) {
  return String(texto ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ".")
    .replace(/^\.+|\.+$/g, "");
}

function generarCorreo(nombre, apellido, id) {
  const nombreBase = normalizarParaCorreo(nombre || "alumno");
  const apellidoBase = normalizarParaCorreo(apellido || "estudiante");
  const identificador = normalizarParaCorreo(id || "registro") || "registro";
  return `${nombreBase}.${apellidoBase}.${identificador}@alumnos.example.com`;
}

function adaptarAlumno(alumno, indice = 0) {
  // Se usan los nombres reales configurados en Mockaroo; no se inventan localmente.
  const nombrePila = String(alumno.first_name ?? "").trim();
  const apellido = String(alumno.last_name ?? "").trim();
  const nombre = `${nombrePila} ${apellido}`.trim() || "Nombre no disponible";
  const id = alumno.id ?? indice + 1;

  return {
    ...alumno,
    id,
    nombre,
    // Correo generado a partir del nombre, apellido e ID del registro.
    correo: generarCorreo(nombrePila, apellido, id),
    carrera: String(alumno.carrera ?? "Sin carrera"),
    semestre: Number(alumno.semestre ?? 1),
  };
}

const FORMULARIO_VACIO = {
  nombre: "",
  correo: "",
  carrera: "",
  semestre: "1",
};

export default function Estudiantes() {
  const [searchParams, setSearchParams] = useSearchParams();

  const pagina = Math.max(
    1,
    Number.parseInt(searchParams.get("page") || "1", 10) || 1
  );
  const limiteUrl = Number.parseInt(searchParams.get("limit") || "10", 10);
  const porPagina = LIMITES.includes(limiteUrl) ? limiteUrl : 10;

  const [estudiantes, setEstudiantes] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [carrera, setCarrera] = useState("");
  const [semestre, setSemestre] = useState("");
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [modal, setModal] = useState(null);
  const [formulario, setFormulario] = useState(FORMULARIO_VACIO);
  const [aviso, setAviso] = useState("");
  const [metodo, setMetodo] = useState("PATCH");

  useEffect(() => {
    let activo = true;

    async function cargarAlumnos() {
      setCargando(true);
      setError("");

      try {
        const respuesta = await fetch(API_URL);
        if (!respuesta.ok) {
          throw new Error(`Error HTTP ${respuesta.status}`);
        }

        const datos = await respuesta.json();
        if (!Array.isArray(datos)) {
          throw new Error(
            "La API no devolvió una lista de alumnos en formato JSON."
          );
        }

        if (activo) {
          setEstudiantes(datos.map((alumno, indice) =>
            adaptarAlumno(alumno, indice)
          ));
        }
        console.log("Alumnos recibidos de Mockaroo:", datos);
      } catch (e) {
        console.error("Error al consultar Mockaroo:", e);
        if (activo) {
          setError(`No se pudieron cargar los alumnos. ${e.message}`);
        }
      } finally {
        if (activo) setCargando(false);
      }
    }

    cargarAlumnos();
    return () => {
      activo = false;
    };
  }, []);

  const filtrados = useMemo(() => {
    const consulta = busqueda.trim().toLocaleLowerCase("es");

    return estudiantes.filter((alumno) => {
      const coincideTexto =
        !consulta ||
        alumno.nombre.toLocaleLowerCase("es").includes(consulta) ||
        alumno.correo.toLocaleLowerCase("es").includes(consulta);

      const coincideCarrera = !carrera || alumno.carrera === carrera;
      const coincideSemestre =
        !semestre || String(alumno.semestre) === String(semestre);

      return coincideTexto && coincideCarrera && coincideSemestre;
    });
  }, [estudiantes, busqueda, carrera, semestre]);

  const totalPaginas = Math.max(1, Math.ceil(filtrados.length / porPagina));
  const paginaActual = Math.min(pagina, totalPaginas);
  const visibles = filtrados.slice(
    (paginaActual - 1) * porPagina,
    paginaActual * porPagina
  );

  function irPagina(numero, limite = porPagina) {
    setSearchParams({
      page: String(Math.max(1, numero)),
      limit: String(limite),
    });
  }

  function cambiarFiltro(setter) {
    return (evento) => {
      setter(evento.target.value);
      irPagina(1);
    };
  }

  function abrirNuevo() {
    setFormulario({
      ...FORMULARIO_VACIO,
      carrera: carreras[0] ?? "",
    });
    setMetodo("PATCH");
    setAviso("");
    setModal({ tipo: "nuevo" });
  }

  function abrirDetalle(alumno) {
    setFormulario({
      nombre: alumno.nombre,
      correo: alumno.correo,
      carrera: alumno.carrera,
      semestre: String(alumno.semestre),
    });
    setAviso("");
    setModal({ tipo: "ver", estudiante: alumno });
  }

  function abrirEdicion(alumno) {
    setFormulario({
      nombre: alumno.nombre,
      correo: alumno.correo,
      carrera: alumno.carrera,
      semestre: String(alumno.semestre),
    });
    setMetodo("PATCH");
    setAviso("");
    setModal({ tipo: "editar", estudiante: alumno });
  }

  function cerrarModal() {
    setModal(null);
    setAviso("");
  }

  // Mockaroo se usa aquí como API de lectura. El CRUD se simula localmente.
  function guardar(evento) {
    evento.preventDefault();
    setAviso("");

    const nombre = formulario.nombre.trim();
    const correo = formulario.correo.trim();

    if (!nombre || !correo) {
      setAviso("El nombre y el correo son obligatorios.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
      setAviso("Escribe un correo electrónico válido.");
      return;
    }

    const datos = {
      nombre,
      correo,
      carrera: formulario.carrera || "Sin carrera",
      semestre: Number(formulario.semestre) || 1,
    };

    if (modal.tipo === "nuevo") {
      const nuevo = { ...datos, id: `nuevo-${Date.now()}` };
      setEstudiantes((lista) => [nuevo, ...lista]);
      setModal(null);
      irPagina(1);
      setAviso("Alumno agregado a la tabla local; no se guardó en Mockaroo.");
      return;
    }

    const id = modal.estudiante.id;
    setEstudiantes((lista) =>
      lista.map((alumno) =>
        alumno.id === id ? { ...alumno, ...datos } : alumno
      )
    );
    setModal(null);
    setAviso(
      `Alumno actualizado localmente mediante ${metodo}; no se guardó en Mockaroo.`
    );
  }

  function eliminar(alumno) {
    if (!window.confirm(`¿Deseas eliminar a ${alumno.nombre} de la tabla?`)) {
      return;
    }

    setEstudiantes((lista) =>
      lista.filter((registro) => registro.id !== alumno.id)
    );
    setAviso("Alumno eliminado de la tabla local; Mockaroo no se modificó.");
  }

  return (
    <section className="page page--gris">
      <article className="card tabla-card estudiantes-panel">
        <div className="estudiantes-encabezado">
          <div>
            <h2>Estudiantes registrados</h2>
            <p className="page__sub">
              Datos consultados desde la API de Mockaroo
            </p>
          </div>
          <button className="accion-principal" type="button" onClick={abrirNuevo}>
            + Agregar estudiante
          </button>
        </div>

        {aviso && <p className="aviso-operacion" role="status">{aviso}</p>}

        <div className="filtros">
          <input
            className="campo campo--buscar"
            type="search"
            placeholder="Buscar por nombre o correo"
            aria-label="Buscar estudiante"
            value={busqueda}
            onChange={cambiarFiltro(setBusqueda)}
          />

          <div className="select">
            <select
              aria-label="Filtrar por carrera"
              value={carrera}
              onChange={cambiarFiltro(setCarrera)}
            >
              <option value="">Todas las carreras</option>
              {carreras.map((opcion) => (
                <option key={opcion} value={opcion}>{opcion}</option>
              ))}
            </select>
            <IconChevron />
          </div>

          <div className="select">
            <select
              aria-label="Filtrar por semestre"
              value={semestre}
              onChange={cambiarFiltro(setSemestre)}
            >
              <option value="">Todos los semestres</option>
              {semestres.map((opcion) => (
                <option key={opcion} value={opcion}>{opcion}° semestre</option>
              ))}
            </select>
            <IconChevron />
          </div>
        </div>

        {cargando && (
          <p className="estado-tabla" role="status">Cargando alumnos desde Mockaroo…</p>
        )}

        {!cargando && error && (
          <div className="error-api" role="alert">
            <p>{error}</p>
            <button type="button" onClick={() => window.location.reload()}>
              Reintentar
            </button>
          </div>
        )}

        {!cargando && !error && (
          <>
            <div className="tabla tabla-api">
              <table>
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Correo</th>
                    <th>Género</th>
                    <th>Carrera</th>
                    <th>Semestre</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {visibles.map((alumno) => (
                    <tr key={alumno.id}>
                      <td>{alumno.nombre}</td>
                      <td>{alumno.correo || "Sin correo"}</td>
                      <td>{alumno.gender || "No especificado"}</td>
                      <td>{alumno.carrera}</td>
                      <td>{alumno.semestre}°</td>
                      <td className="acciones acciones-api">
                        <button type="button" onClick={() => abrirDetalle(alumno)}>Ver</button>
                        <button type="button" onClick={() => abrirEdicion(alumno)}>Editar</button>
                        <button
                          type="button"
                          className="accion-eliminar"
                          onClick={() => eliminar(alumno)}
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                  {visibles.length === 0 && (
                    <tr>
                      <td colSpan="6" className="vacio">
                        No hay alumnos que coincidan con los filtros.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <footer className="paginacion">
              <label className="paginacion__tam">
                Mostrar{" "}
                <span className="select select--sm">
                  <select
                    aria-label="Registros por página"
                    value={porPagina}
                    onChange={(evento) => irPagina(1, Number(evento.target.value))}
                  >
                    {LIMITES.map((cantidad) => (
                      <option key={cantidad} value={cantidad}>
                        {cantidad} registros
                      </option>
                    ))}
                  </select>
                  <IconChevron />
                </span>{" "}
                por página · {filtrados.length} registros
              </label>

              <nav className="paginacion__nav" aria-label="Paginación">
                <button
                  type="button"
                  disabled={paginaActual <= 1}
                  onClick={() => irPagina(paginaActual - 1)}
                  aria-label="Página anterior"
                >
                  ‹
                </button>

                {Array.from({ length: totalPaginas }, (_, indice) => indice + 1).map((numero) => (
                  <button
                    key={numero}
                    type="button"
                    className={numero === paginaActual ? "is-active" : ""}
                    aria-current={numero === paginaActual ? "page" : undefined}
                    onClick={() => irPagina(numero)}
                  >
                    {numero}
                  </button>
                ))}

                <button
                  type="button"
                  disabled={paginaActual >= totalPaginas}
                  onClick={() => irPagina(paginaActual + 1)}
                  aria-label="Página siguiente"
                >
                  ›
                </button>
              </nav>
            </footer>

            <p className="nota-api">
              La paginación se refleja en la URL con <code>page</code> y{" "}
              <code>limit</code>. Los nombres y el género proceden de Mockaroo;
              el correo se construye con el nombre, apellido e ID del alumno.
              El CRUD modifica solo esta tabla durante la sesión.
            </p>
          </>
        )}
      </article>

      {modal && (
        <div
          className="modal-fondo"
          role="presentation"
          onMouseDown={(evento) => {
            if (evento.target === evento.currentTarget) cerrarModal();
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
              <button type="button" aria-label="Cerrar" onClick={cerrarModal}>×</button>
            </div>

            <form onSubmit={guardar}>
              <label>
                Nombre completo
                <input
                  required
                  disabled={modal.tipo === "ver"}
                  value={formulario.nombre}
                  onChange={(evento) =>
                    setFormulario({ ...formulario, nombre: evento.target.value })
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
                    setFormulario({ ...formulario, correo: evento.target.value })
                  }
                />
              </label>

              <label>
                Carrera
                <select
                  disabled={modal.tipo === "ver"}
                  value={formulario.carrera}
                  onChange={(evento) =>
                    setFormulario({ ...formulario, carrera: evento.target.value })
                  }
                >
                  {!carreras.includes(formulario.carrera) && formulario.carrera && (
                    <option value={formulario.carrera}>{formulario.carrera}</option>
                  )}
                  {carreras.map((opcion) => (
                    <option key={opcion} value={opcion}>{opcion}</option>
                  ))}
                </select>
              </label>

              <label>
                Semestre
                <select
                  disabled={modal.tipo === "ver"}
                  value={formulario.semestre}
                  onChange={(evento) =>
                    setFormulario({ ...formulario, semestre: evento.target.value })
                  }
                >
                  {semestres.map((opcion) => (
                    <option key={opcion} value={opcion}>{opcion}° semestre</option>
                  ))}
                </select>
              </label>

              {modal.tipo === "editar" && (
                <label>
                  Método de actualización (simulado)
                  <select value={metodo} onChange={(evento) => setMetodo(evento.target.value)}>
                    <option value="PATCH">PATCH · actualizar campos</option>
                    <option value="PUT">PUT · reemplazar registro</option>
                  </select>
                </label>
              )}

              {aviso && <p className="login__error" role="alert">{aviso}</p>}

              <div className="modal-estudiante__acciones">
                <button type="button" className="accion-secundaria" onClick={cerrarModal}>
                  Cerrar
                </button>
                {modal.tipo !== "ver" && (
                  <button type="submit" className="accion-principal">
                    {modal.tipo === "nuevo" ? "Agregar alumno" : `Guardar (${metodo})`}
                  </button>
                )}
              </div>
            </form>
          </section>
        </div>
      )}
    </section>
  );
}
