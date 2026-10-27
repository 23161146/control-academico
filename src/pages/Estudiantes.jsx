import { useMemo, useState } from "react";
import { carreras, semestres } from "../data/estudiantes.js";
import FiltrosEstudiantes from "../components/estudiantes/FiltrosEstudiantes.jsx";
import ModalEstudiante from "../components/estudiantes/ModalEstudiante.jsx";
import PaginacionEstudiantes from "../components/estudiantes/PaginacionEstudiantes.jsx";
import TablaEstudiantes from "../components/estudiantes/TablaEstudiantes.jsx";
import useEstudiantes from "../hooks/useEstudiantes.js";
import usePaginacionUrl from "../hooks/usePaginacionUrl.js";
import { confirmarEliminacion, mostrarAlertaExito } from "../utils/alertas.js";

const FORMULARIO_VACIO = {
  nombre: "",
  correo: "",
  carrera: "",
  semestre: "1",
};

export default function Estudiantes() {
  const {
    estudiantes,
    cargando,
    error,
    recargarEstudiantes,
    agregarEstudiante,
    actualizarEstudiante,
    eliminarEstudiante,
  } = useEstudiantes();
  const { pagina, porPagina, limites, irAPagina } = usePaginacionUrl();

  const [busqueda, setBusqueda] = useState("");
  const [carreraSeleccionada, setCarreraSeleccionada] = useState("");
  const [semestreSeleccionado, setSemestreSeleccionado] = useState("");
  const [modalEstudiante, setModalEstudiante] = useState(null);
  const [formulario, setFormulario] = useState(FORMULARIO_VACIO);
  const [mensaje, setMensaje] = useState("");

  const carrerasDisponibles = useMemo(
    () =>
      [...new Set(estudiantes.map((estudiante) => estudiante.carrera))]
        .filter(Boolean)
        .sort((a, b) => a.localeCompare(b, "es")),
    [estudiantes],
  );

  const estudiantesFiltrados = useMemo(() => {
    const consulta = busqueda.trim().toLocaleLowerCase("es");

    return estudiantes.filter((estudiante) => {
      const coincideTexto =
        !consulta ||
        estudiante.nombre.toLocaleLowerCase("es").includes(consulta) ||
        estudiante.correo.toLocaleLowerCase("es").includes(consulta);

      const coincideCarrera = !carreraSeleccionada || estudiante.carrera === carreraSeleccionada;
      const coincideSemestre = !semestreSeleccionado || String(estudiante.semestre) === String(semestreSeleccionado);

      return coincideTexto && coincideCarrera && coincideSemestre;
    });
  }, [estudiantes, busqueda, carreraSeleccionada, semestreSeleccionado]);

  const totalPaginas = Math.max(1, Math.ceil(estudiantesFiltrados.length / porPagina));
  const paginaActual = Math.min(pagina, totalPaginas);
  const estudiantesVisibles = estudiantesFiltrados.slice((paginaActual - 1) * porPagina, paginaActual * porPagina);

  function cambiarFiltro(actualizarFiltro) {
    return (evento) => {
      actualizarFiltro(evento.target.value);

      if (pagina !== 1) {
        irAPagina(1);
      }
    };
  }

  function cambiarLimitePorPagina(limite) {
    irAPagina(1, limite);
  }

  function abrirModalNuevo() {
    setFormulario({
      ...FORMULARIO_VACIO,
      carrera: carreras[0] ?? "",
    });
    setMensaje("");
    setModalEstudiante({ tipo: "nuevo" });
  }

  function abrirModalDetalle(estudiante) {
    setFormulario({
      nombre: estudiante.nombre,
      correo: estudiante.correo,
      carrera: estudiante.carrera,
      semestre: String(estudiante.semestre),
    });
    setMensaje("");
    setModalEstudiante({ tipo: "ver", estudiante });
  }

  function abrirModalEdicion(estudiante) {
    setFormulario({
      nombre: estudiante.nombre,
      correo: estudiante.correo,
      carrera: estudiante.carrera,
      semestre: String(estudiante.semestre),
    });
    setMensaje("");
    setModalEstudiante({ tipo: "editar", estudiante });
  }

  function cerrarModal() {
    setModalEstudiante(null);
    setMensaje("");
  }

  function guardarEstudiante(evento) {
    evento.preventDefault();
    setMensaje("");

    const nombre = formulario.nombre.trim();
    const correo = formulario.correo.trim();

    if (!nombre || !correo) {
      setMensaje("El nombre y el correo son obligatorios.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
      setMensaje("Escribe un correo electrónico válido.");
      return;
    }

    const datosEstudiante = {
      nombre,
      correo,
      carrera: formulario.carrera || "Sin carrera",
      semestre: Number(formulario.semestre) || 1,
    };

    if (modalEstudiante.tipo === "nuevo") {
      const nuevoEstudiante = {
        ...datosEstudiante,
        id: `nuevo-${Date.now()}`,
      };

      agregarEstudiante(nuevoEstudiante);
      setModalEstudiante(null);
      irAPagina(1);
      mostrarAlertaExito("Estudiante agregado", "Se agregó correctamente.");
      return;
    }

    actualizarEstudiante(modalEstudiante.estudiante.id, datosEstudiante);
    setModalEstudiante(null);
    mostrarAlertaExito("Estudiante actualizado", "Se actualizó correctamente.");
  }

  async function manejarEliminarEstudiante(estudiante) {
    const confirmado = await confirmarEliminacion(estudiante.nombre);

    if (!confirmado) {
      return;
    }

    eliminarEstudiante(estudiante.id);
    mostrarAlertaExito("Estudiante eliminado", "Se eliminó correctamente.");
  }

  return (
    <section className="page page--gris">
      <article className="card tabla-card estudiantes-panel">
        <div className="estudiantes-encabezado">
          <div>
            <h2>Estudiantes registrados</h2>
            <p className="page__sub">Consulta y administra los estudiantes registrados en el sistema</p>
          </div>
          <button className="accion-principal" type="button" onClick={abrirModalNuevo}>
            + Agregar estudiante
          </button>
        </div>

        <FiltrosEstudiantes
          busqueda={busqueda}
          carrera={carreraSeleccionada}
          semestre={semestreSeleccionado}
          carreras={carrerasDisponibles}
          semestres={semestres}
          onBusquedaChange={cambiarFiltro(setBusqueda)}
          onCarreraChange={cambiarFiltro(setCarreraSeleccionada)}
          onSemestreChange={cambiarFiltro(setSemestreSeleccionado)}
        />

        {cargando && (
          <p className="estado-tabla" role="status">
            Cargando alumnos desde Mockaroo…
          </p>
        )}

        {!cargando && error && (
          <div className="error-api" role="alert">
            <p>{error}</p>
            <button type="button" onClick={recargarEstudiantes}>
              Reintentar
            </button>
          </div>
        )}

        {!cargando && !error && (
          <>
            <TablaEstudiantes
              estudiantes={estudiantesVisibles}
              onVer={abrirModalDetalle}
              onEditar={abrirModalEdicion}
              onEliminar={manejarEliminarEstudiante}
            />
            <PaginacionEstudiantes
              paginaActual={paginaActual}
              totalPaginas={totalPaginas}
              porPagina={porPagina}
              limites={limites}
              onCambiarLimite={cambiarLimitePorPagina}
              onIrAPagina={irAPagina}
            />
          </>
        )}
      </article>

      {modalEstudiante && (
        <ModalEstudiante
          modal={modalEstudiante}
          formulario={formulario}
          aviso={mensaje}
          carreras={carreras}
          semestres={semestres}
          onCerrar={cerrarModal}
          onGuardar={guardarEstudiante}
          onFormularioChange={setFormulario}
        />
      )}
    </section>
  );
}
