import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

export default function DonutChart({ data, height = 220, centerLabel, centerValue }) {
  return (
    <div className="relative" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius="62%"
            outerRadius="90%"
            paddingAngle={2}
            stroke="none"
          >
            {data.map((d) => (
              <Cell key={d.name} fill={d.color || "#17b9c4"} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ background: "#08111c", border: "1px solid #17293a", borderRadius: 10, fontSize: 12 }}
          />
        </PieChart>
      </ResponsiveContainer>
      {(centerLabel || centerValue) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-2xl font-semibold" style={{ fontFamily: "var(--font-display)" }}>
            {centerValue}
          </span>
          <span className="text-xs text-mist-500">{centerLabel}</span>
        </div>
      )}
    </div>
  );
}
