import { useCallback, useEffect, useState } from "react";
import { obtenerEstudiantes } from "../services/estudiantesApi.js";

export default function useEstudiantes() {
  const [estudiantes, setEstudiantes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const cargarEstudiantes = useCallback(async (signal) => {
    setCargando(true);
    setError("");

    try {
      const datos = await obtenerEstudiantes({ signal });
      setEstudiantes(datos);
    } catch (err) {
      if (err.name !== "AbortError") {
        setError(err.message || "No se pudieron cargar los estudiantes.");
      }
    } finally {
      if (!signal?.aborted) {
        setCargando(false);
      }
    }
  }, []);

  useEffect(() => {
    const controlador = new AbortController();
    cargarEstudiantes(controlador.signal);

    return () => controlador.abort();
  }, [cargarEstudiantes]);

  const recargarEstudiantes = useCallback(() => {
    cargarEstudiantes();
  }, [cargarEstudiantes]);

  const agregarEstudiante = useCallback((estudiante) => {
    setEstudiantes((lista) => [estudiante, ...lista]);
  }, []);

  const actualizarEstudiante = useCallback((id, datos) => {
    setEstudiantes((lista) =>
      lista.map((estudiante) =>
        estudiante.id === id ? { ...estudiante, ...datos } : estudiante
      )
    );
  }, []);

  const eliminarEstudiante = useCallback((id) => {
    setEstudiantes((lista) =>
      lista.filter((estudiante) => estudiante.id !== id)
    );
  }, []);

  return {
    estudiantes,
    cargando,
    error,
    recargarEstudiantes,
    agregarEstudiante,
    actualizarEstudiante,
    eliminarEstudiante,
  };
}
