export default function StatCard({ titulo, valor, detalle }) {
  return (
    <article className="stat-card">
      <p className="stat-card__valor">{valor}</p>
      <h3 className="stat-card__titulo">{titulo}</h3>
      {detalle && <p className="stat-card__detalle">{detalle}</p>}
    </article>
  );
}
