"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface FluxoItem {
  valor: number;
  tipo: string; // 'entrada' | 'saida'
}

interface GraficoFluxoProps {
  dados: FluxoItem[];
}

export default function GraficoFluxo({ dados }: GraficoFluxoProps) {
  // 1. Agrega os valores
  const totalEntradas = dados
    .filter((d) => d.valor > 0)
    .reduce((acc, curr) => acc + curr.valor, 0);

  const totalSaidas = dados
    .filter((d) => d.valor < 0)
    .reduce((acc, curr) => acc + Math.abs(curr.valor), 0); // Pega valor absoluto para o gráfico ficar bonito para cima

  const chartData = [
    { name: "Entradas", valor: totalEntradas, tipo: "entrada" },
    { name: "Saídas", valor: totalSaidas, tipo: "saida" },
  ];

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
        Resumo Financeiro
      </h3>

      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            horizontal={true}
            vertical={false}
            stroke="var(--wrapper-border-color)"
          />
          <XAxis type="number" hide />
          <YAxis
            type="category"
            dataKey="name"
            width={80}
            tick={{ fill: "var(--header-text-color)" }}
          />
          <Tooltip
            cursor={{ fill: "transparent" }}
            contentStyle={{
              backgroundColor: "var(--modal-bg-color)",
              borderRadius: "8px",
              border: "1px solid var(--wrapper-border-color)",
            }}
            formatter={(value: number) =>
              value.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })
            }
          />
          <Bar dataKey="valor" radius={[0, 4, 4, 0]} barSize={40}>
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.tipo === "entrada" ? "#22c55e" : "#ef4444"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
