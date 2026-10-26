import localData from "../data/alumnos.json";

// Si defines VITE_API_URL en un archivo .env (por ejemplo la URL de Mockaroo),
// se usa esa API. Si no existe o falla, se usan los datos locales.
const API_URL = import.meta.env.VITE_API_URL;

// Columnas que debe traer la API (en Mockaroo, el nombre de cada campo).
// "id" y "estatus" son opcionales: si faltan se calculan aquí.
const CAMPOS = ["matricula", "nombre", "carrera", "semestre", "materia", "calificacion", "asistencia"];

// Convierte cada registro al formato que usa la tabla.
function normalizar(datos) {
  return datos.map((a, i) => {
    const calificacion = Number(a.calificacion);
    return {
      ...a,
      id: a.id ?? i + 1,
      calificacion,
      asistencia: Number(a.asistencia),
      semestre: Number(a.semestre),
      estatus: a.estatus ?? (calificacion >= 6 ? "Aprobado" : "Reprobado"),
    };
  });
}

// Revisa que la respuesta sea un arreglo con las columnas esperadas y números válidos.
function esValido(datos) {
  return (
    Array.isArray(datos) &&
    datos.length > 0 &&
    CAMPOS.every((c) => c in datos[0]) &&
    datos.every((a) => !Number.isNaN(a.calificacion) && !Number.isNaN(a.asistencia))
  );
}

export async function getAlumnos() {
  if (!API_URL) return localData;
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const crudos = await res.json();
    if (!Array.isArray(crudos) || crudos.length === 0) {
      throw new Error("La API no devolvió un arreglo de alumnos");
    }
    const datos = normalizar(crudos);
    if (!esValido(datos)) {
      throw new Error(`La API debe devolver las columnas: ${CAMPOS.join(", ")} (revisa el esquema en Mockaroo)`);
    }
    return datos;
  } catch (err) {
    console.warn("No se pudo usar la API, se usan datos locales:", err);
    return localData;
  }
}

export function calcularResumen(alumnos) {
  const total = alumnos.length;
  const promedio = total ? alumnos.reduce((s, a) => s + a.calificacion, 0) / total : 0;
  const asistencia = total ? alumnos.reduce((s, a) => s + a.asistencia, 0) / total : 0;
  const aprobados = alumnos.filter((a) => a.calificacion >= 6).length;
  return {
    total,
    promedio: promedio.toFixed(1),
    asistencia: Math.round(asistencia),
    aprobacion: total ? Math.round((aprobados / total) * 100) : 0,
  };
}

export function promedioPorMateria(alumnos) {
  const acc = {};
  alumnos.forEach((a) => {
    acc[a.materia] ??= { suma: 0, n: 0 };
    acc[a.materia].suma += a.calificacion;
    acc[a.materia].n += 1;
  });
  return Object.entries(acc).map(([materia, { suma, n }]) => ({
    materia,
    promedio: Number((suma / n).toFixed(2)),
  }));
}