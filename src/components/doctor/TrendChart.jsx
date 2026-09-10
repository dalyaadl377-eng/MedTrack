import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const COLORS = ["#35d3d6", "#e8a545", "#8b7ef2", "#3fd68b", "#ef5a63"];

export default function TrendChart({ data, lines, height = 260, showLegend = false }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 5, right: 10, left: -15, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#17293a" vertical={false} />
        <XAxis dataKey="month" stroke="#62788a" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#62788a" fontSize={12} tickLine={false} axisLine={false} />
        <Tooltip
          contentStyle={{ background: "#08111c", border: "1px solid #17293a", borderRadius: 10, fontSize: 12 }}
          labelStyle={{ color: "#eef4f8" }}
        />
        {showLegend && <Legend wrapperStyle={{ fontSize: 12 }} />}
        {lines.map((l, i) => (
          <Line
            key={l.key}
            type="monotone"
            dataKey={l.key}
            name={l.label || l.key}
            stroke={l.color || COLORS[i % COLORS.length]}
            strokeWidth={2.5}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
