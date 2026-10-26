import localData from "../data/alumnos.json";

// Si defines VITE_API_URL en un archivo .env (por ejemplo la URL de Mockaroo),
// se usa esa API. Si no existe o falla, se usan los datos locales.
const API_URL = import.meta.env.VITE_API_URL;

const CAMPOS = ["matricula", "nombre", "materia", "calificacion", "asistencia"];

// Revisa que la respuesta sea un arreglo con las columnas que usa la tabla.
function esValido(datos) {
  return (
    Array.isArray(datos) &&
    datos.length > 0 &&
    CAMPOS.every((c) => c in datos[0])
  );
}

export async function getAlumnos() {
  if (!API_URL) return localData;
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const datos = (await res.json()).map((a) => ({
      ...a,
      calificacion: Number(a.calificacion),
      asistencia: Number(a.asistencia),
      semestre: Number(a.semestre),
    }));
    if (!esValido(datos)) {
      throw new Error("La API no devuelve las columnas esperadas (revisa el esquema en Mockaroo)");
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