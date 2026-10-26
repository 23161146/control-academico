import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export default function GradesChart({ datos }) {
  return (
    <section className="panel">
      <h2>Promedio por materia</h2>
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <BarChart data={datos} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="materia" tick={{ fontSize: 12 }} />
            <YAxis domain={[0, 10]} tick={{ fontSize: 12 }} />
            <Tooltip formatter={(v) => [v, "Promedio"]} />
            <Bar dataKey="promedio" fill="#1f4e5f" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
