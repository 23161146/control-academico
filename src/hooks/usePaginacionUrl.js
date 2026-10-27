import { useCallback, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

const LIMITES = [5, 10, 20, 40, 50];
const LIMITE_POR_DEFECTO = 5;

export default function usePaginacionUrl() {
  const [searchParams, setSearchParams] = useSearchParams();

  const pagina = Math.max(
    1,
    Number.parseInt(searchParams.get("page") || "1", 10) || 1
  );
  const limiteUrl = Number.parseInt(
    searchParams.get("limit") || String(LIMITE_POR_DEFECTO),
    10
  );
  const porPagina = LIMITES.includes(limiteUrl)
    ? limiteUrl
    : LIMITE_POR_DEFECTO;

  useEffect(() => {
    if (
      searchParams.get("page") !== String(pagina) ||
      searchParams.get("limit") !== String(porPagina)
    ) {
      setSearchParams(
        { page: String(pagina), limit: String(porPagina) },
        { replace: true }
      );
    }
  }, [pagina, porPagina, searchParams, setSearchParams]);

  const irAPagina = useCallback(
    (numero, limite = porPagina) => {
      setSearchParams({
        page: String(Math.max(1, numero)),
        limit: String(limite),
      });
    },
    [porPagina, setSearchParams]
  );

  return { pagina, porPagina, limites: LIMITES, irAPagina };
}
