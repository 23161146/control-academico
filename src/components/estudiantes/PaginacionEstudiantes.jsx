import { IconChevron } from "../Icons.jsx";

export default function PaginacionEstudiantes({
  paginaActual,
  totalPaginas,
  porPagina,
  limites,
  onCambiarLimite,
  onIrAPagina,
}) {
  return (
    <footer className="paginacion">
      <label className="paginacion__tam">
        Mostrar{" "}
        <span className="select select--sm">
          <select
            aria-label="Registros por página"
            value={porPagina}
            onChange={(evento) => onCambiarLimite(Number(evento.target.value))}
          >
            {limites.map((cantidad) => (
              <option key={cantidad} value={cantidad}>
                {cantidad} registros
              </option>
            ))}
          </select>
          <IconChevron />
        </span>{" "}
        por página.
      </label>

      <nav className="paginacion__nav" aria-label="Paginación">
        <button
          type="button"
          disabled={paginaActual <= 1}
          onClick={() => onIrAPagina(paginaActual - 1)}
          aria-label="Página anterior"
        >
          ‹
        </button>

        {Array.from({ length: totalPaginas }, (_, indice) => indice + 1).map(
          (numero) => (
            <button
              key={numero}
              type="button"
              className={numero === paginaActual ? "is-active" : ""}
              aria-current={numero === paginaActual ? "page" : undefined}
              onClick={() => onIrAPagina(numero)}
            >
              {numero}
            </button>
          )
        )}

        <button
          type="button"
          disabled={paginaActual >= totalPaginas}
          onClick={() => onIrAPagina(paginaActual + 1)}
          aria-label="Página siguiente"
        >
          ›
        </button>
      </nav>
    </footer>
  );
}
