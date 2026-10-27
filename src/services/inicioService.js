const API_TOTAL = "https://dumbapis.com/number?min=860&max=872";
const API_ACTIVOS = "https://dumbapis.com/number?min=780&max=820";
const API_GRAFICA =
  "https://www.randomnumberapi.com/api/v1.0/random?min=70&max=221&count=7";

async function obtenerJson(url, mensajeError, signal) {
  let respuesta;

  try {
    respuesta = await fetch(url, { signal });
  } catch (error) {
    if (error.name === "AbortError") {
      throw error;
    }

    throw new Error(mensajeError);
  }

  if (!respuesta.ok) {
    throw new Error(`${mensajeError} (HTTP ${respuesta.status}).`);
  }

  try {
    return await respuesta.json();
  } catch {
    throw new Error(`${mensajeError} La respuesta no es válida.`);
  }
}

export async function obtenerTotalEstudiantes({ signal } = {}) {
  const datos = await obtenerJson(
    API_TOTAL,
    "No se pudo obtener el total de estudiantes.",
    signal
  );
  const total = Number(datos?.result);

  if (!Number.isFinite(total)) {
    throw new Error("El servicio no devolvió un total de estudiantes válido.");
  }

  return total;
}

export async function obtenerEstudiantesActivos({ signal } = {}) {
  const datos = await obtenerJson(
    API_ACTIVOS,
    "No se pudieron obtener los estudiantes activos.",
    signal
  );
  const activos = Number(datos?.result);

  if (!Number.isFinite(activos)) {
    throw new Error("El servicio no devolvió un número de activos válido.");
  }

  return activos;
}

export async function obtenerDatosGrafica({ signal } = {}) {
  const datos = await obtenerJson(
    API_GRAFICA,
    "No se pudieron obtener los datos de la gráfica.",
    signal
  );

  if (
    !Array.isArray(datos) ||
    !datos.every((valor) => Number.isFinite(Number(valor)))
  ) {
    throw new Error("El servicio devolvió datos de gráfica no válidos.");
  }

  return datos.map(Number);
}
