const API_NUMEROS = "https://www.randomnumberapi.com/api/v1.0/random";

const MATERIAS = [
  "Física",
  "Matemáticas",
  "Inglés",
  "Bases de datos",
  "Programación",
];

async function obtenerNumeros({ min, max, count, signal }) {
  const url = `${API_NUMEROS}?min=${min}&max=${max}&count=${count}`;
  let respuesta;

  try {
    respuesta = await fetch(url, { signal });
  } catch (error) {
    if (error.name === "AbortError") {
      throw error;
    }

    throw new Error(
      "No se pudo conectar con el servicio de estadísticas académicas."
    );
  }

  if (!respuesta.ok) {
    throw new Error(
      `No se pudieron cargar las estadísticas académicas (HTTP ${respuesta.status}).`
    );
  }

  let datos;

  try {
    datos = await respuesta.json();
  } catch {
    throw new Error(
      "El servicio de estadísticas académicas devolvió una respuesta no válida."
    );
  }

  if (
    !Array.isArray(datos) ||
    datos.length < count ||
    !datos.every((valor) => Number.isFinite(Number(valor)))
  ) {
    throw new Error(
      "El servicio de estadísticas académicas devolvió datos incompletos."
    );
  }

  return datos.map(Number);
}

export async function obtenerEstadisticasAcademicas({ signal } = {}) {
  const [
    totalRegistros,
    promedioGeneral,
    asistencia,
    aprobacion,
    promediosMateria,
  ] = await Promise.all([
    obtenerNumeros({ min: 35, max: 60, count: 1, signal }),
    obtenerNumeros({ min: 60, max: 90, count: 1, signal }),
    obtenerNumeros({ min: 70, max: 95, count: 1, signal }),
    obtenerNumeros({ min: 55, max: 95, count: 1, signal }),
    obtenerNumeros({ min: 55, max: 95, count: MATERIAS.length, signal }),
  ]);

  return {
    resumen: {
      registros: totalRegistros[0],
      promedio: (promedioGeneral[0] / 10).toFixed(1),
      asistencia: asistencia[0],
      aprobacion: aprobacion[0],
    },
    promediosMateria: MATERIAS.map((materia, indice) => ({
      materia,
      promedio: Number((promediosMateria[indice] / 10).toFixed(2)),
    })),
  };
}
