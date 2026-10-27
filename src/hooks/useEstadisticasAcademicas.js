import { useCallback, useEffect, useState } from "react";
import { obtenerEstadisticasAcademicas } from "../services/informacionAcademicaService.js";

export default function useEstadisticasAcademicas() {
  const [estadisticas, setEstadisticas] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const cargarEstadisticas = useCallback(async (signal) => {
    setCargando(true);
    setError("");

    try {
      const datos = await obtenerEstadisticasAcademicas({ signal });
      setEstadisticas(datos);
    } catch (err) {
      if (err.name !== "AbortError") {
        setEstadisticas(null);
        setError(
          err.message || "No se pudieron cargar las estadísticas académicas."
        );
      }
    } finally {
      if (!signal?.aborted) {
        setCargando(false);
      }
    }
  }, []);

  useEffect(() => {
    const controlador = new AbortController();
    cargarEstadisticas(controlador.signal);

    return () => controlador.abort();
  }, [cargarEstadisticas]);

  const recargarEstadisticas = useCallback(() => {
    cargarEstadisticas();
  }, [cargarEstadisticas]);

  return {
    estadisticas,
    cargando,
    error,
    recargarEstadisticas,
  };
}
