const API_URL = "https://my.api.mockaroo.com/alumnos.json?key=68307140";

function adaptarEstudiante(alumno, indice = 0) {
  const nombrePila = String(alumno.first_name ?? "").trim();
  const apellido = String(alumno.last_name ?? "").trim();
  const nombre = `${nombrePila} ${apellido}`.trim() || "Nombre no disponible";
  const id = alumno.id ?? indice + 1;

  return {
    ...alumno,
    id,
    nombre,
    correo: String(alumno.email ?? "").trim(),
    carrera: String(alumno.carrera ?? "Sin carrera"),
    semestre: Number(alumno.semestre ?? 1),
  };
}

export async function obtenerEstudiantes({ signal } = {}) {
  let respuesta;

  try {
    respuesta = await fetch(API_URL, { signal });
  } catch (error) {
    if (error.name === "AbortError") {
      throw error;
    }

    throw new Error("No se pudo conectar con el servicio de estudiantes.");
  }

  if (!respuesta.ok) {
    throw new Error(`No se pudieron cargar los estudiantes (HTTP ${respuesta.status}).`);
  }

  let datos;

  try {
    datos = await respuesta.json();
  } catch {
    throw new Error("El servicio de estudiantes devolvió una respuesta no válida.");
  }

  if (!Array.isArray(datos)) {
    throw new Error("El servicio de estudiantes no devolvió una lista válida.");
  }

  return datos.map(adaptarEstudiante);
}
