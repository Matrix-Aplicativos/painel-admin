"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface GraficoClientesProps {
  dados: { status: boolean }[];
}

export default function GraficoClientes({ dados }: GraficoClientesProps) {
  // 1. Calcula os totais dinamicamente
  const ativos = dados.filter((c) => c.status).length;
  const inativos = dados.filter((c) => !c.status).length;

  const chartData = [
    { name: "Ativos", value: ativos },
    { name: "Inativos", value: inativos },
  ];

  const COLORS = ["#22c55e", "#ef4444"]; // Verde e Vermelho

  return (
    <div
      style={{
        width: "100%",
        height: 300,
        backgroundColor: "var(--modal-bg-color)",
        borderRadius: "8px",
        border: "1px solid var(--wrapper-border-color)",
        padding: "20px",
        marginBottom: "20px",
      }}
    >
      <h3
        style={{
          fontSize: "16px",
          fontWeight: "bold",
          color: "var(--header-text-color)",
          marginBottom: "10px",
        }}
      >
        Status da Base
      </h3>

      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "var(--modal-bg-color)",
              borderRadius: "8px",
              border: "1px solid var(--wrapper-border-color)",
            }}
            itemStyle={{ color: "var(--header-text-color)" }}
          />
          <Legend verticalAlign="bottom" height={36} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
