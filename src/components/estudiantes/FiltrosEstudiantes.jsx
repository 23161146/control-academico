import { IconChevron } from "../Icons.jsx";

export default function FiltrosEstudiantes({
  busqueda,
  carrera,
  semestre,
  carreras,
  semestres,
  onBusquedaChange,
  onCarreraChange,
  onSemestreChange,
}) {
  return (
    <div className="filtros">
      <input
        className="campo campo--buscar"
        type="search"
        placeholder="Buscar por nombre o correo"
        aria-label="Buscar estudiante"
        value={busqueda}
        onChange={onBusquedaChange}
      />

      <div className="select">
        <select
          aria-label="Filtrar por carrera"
          value={carrera}
          onChange={onCarreraChange}
        >
          <option value="">Todas las carreras</option>
          {carreras.map((opcion) => (
            <option key={opcion} value={opcion}>
              {opcion}
            </option>
          ))}
        </select>
        <IconChevron />
      </div>

      <div className="select">
        <select
          aria-label="Filtrar por semestre"
          value={semestre}
          onChange={onSemestreChange}
        >
          <option value="">Todos los semestres</option>
          {semestres.map((opcion) => (
            <option key={opcion} value={opcion}>
              {opcion}° semestre
            </option>
          ))}
        </select>
        <IconChevron />
      </div>
    </div>
  );
}
