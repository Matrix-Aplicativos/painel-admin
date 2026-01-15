"use client";

import React, { useMemo } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

interface DashboardFluxoProps {
  transacoes: any[];
  currentDate: Date;
  viewMode: "mensal" | "anual";
  onDateChange: (date: Date) => void;
  onViewModeChange: (mode: "mensal" | "anual") => void;
}

export default function DashboardFluxo({
  transacoes,
  currentDate,
  viewMode,
  onDateChange,
  onViewModeChange,
}: DashboardFluxoProps) {
  const handlePrev = () => {
    const newDate = new Date(currentDate);
    if (viewMode === "mensal") {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setFullYear(newDate.getFullYear() - 1);
    }
    onDateChange(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(currentDate);
    if (viewMode === "mensal") {
      newDate.setMonth(newDate.getMonth() + 1);
    } else {
      newDate.setFullYear(newDate.getFullYear() + 1);
    }
    onDateChange(newDate);
  };

  const formatTitle = () => {
    if (viewMode === "mensal") {
      return currentDate
        .toLocaleDateString("pt-BR", { month: "long", year: "numeric" })
        .toUpperCase();
    }
    return currentDate.getFullYear().toString();
  };

  const { chartData, kpis, saldoGeral } = useMemo(() => {
    let receitaPeriodo = 0;
    let despesaPeriodo = 0;
    let saldoTotalAcumulado = 0;

    const rawDataMap: Record<
      number,
      { name: string; receita: number; despesa: number }
    > = {};

    if (viewMode === "mensal") {
      const daysInMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        0
      ).getDate();
      for (let i = 1; i <= daysInMonth; i++) {
        rawDataMap[i] = { name: i.toString(), receita: 0, despesa: 0 };
      }
    } else {
      const meses = [
        "Jan",
        "Fev",
        "Mar",
        "Abr",
        "Mai",
        "Jun",
        "Jul",
        "Ago",
        "Set",
        "Out",
        "Nov",
        "Dez",
      ];
      meses.forEach((m, idx) => {
        rawDataMap[idx] = { name: m, receita: 0, despesa: 0 };
      });
    }

    transacoes.forEach((item) => {
      const val = Number(item.valor);
      saldoTotalAcumulado += val;

      if (!item.datapagamento) return;

      const dataStr = String(item.datapagamento); 
      const [anoStr, mesStr, diaStr] = dataStr.split("T")[0].split("-");

      const d = new Date(
        Number(anoStr),
        Number(mesStr) - 1,
        Number(diaStr),
        12,
        0,
        0
      );

      // --------------------------------

      let isInPeriod = false;
      let key = -1;

      if (viewMode === "mensal") {
        if (
          d.getMonth() === currentDate.getMonth() &&
          d.getFullYear() === currentDate.getFullYear()
        ) {
          isInPeriod = true;
          key = d.getDate();
        }
      } else {
        if (d.getFullYear() === currentDate.getFullYear()) {
          isInPeriod = true;
          key = d.getMonth();
        }
      }

      if (isInPeriod && rawDataMap[key]) {
        if (val > 0) {
          receitaPeriodo += val;
          rawDataMap[key].receita += val;
        } else {
          const absVal = Math.abs(val);
          despesaPeriodo += absVal;
          rawDataMap[key].despesa += absVal;
        }
      }
    });

    const sortedKeys = Object.keys(rawDataMap)
      .map(Number)
      .sort((a, b) => a - b);

    let acumReceita = 0;
    let acumDespesa = 0;

    const cumulativeChartData = sortedKeys.map((key) => {
      const item = rawDataMap[key];

      acumReceita += item.receita;
      acumDespesa += item.despesa;

      return {
        name: item.name,
        receita: acumReceita,
        despesa: acumDespesa,
      };
    });

    return {
      chartData: cumulativeChartData,
      kpis: {
        receitas: receitaPeriodo,
        despesas: despesaPeriodo,
        resultadoLiquido: receitaPeriodo - despesaPeriodo,
      },
      saldoGeral: saldoTotalAcumulado,
    };
  }, [transacoes, currentDate, viewMode]);

  const toBRL = (val: number) =>
    val.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  return (
    <div
      style={{
        backgroundColor: "#fff",
        borderRadius: "8px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        padding: "20px",
        marginBottom: "20px",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
          flexWrap: "wrap",
          gap: 10,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <button onClick={handlePrev} style={btnNavStyle}>
            <FiChevronLeft size={24} color="#1769e3" />
          </button>
          <h2
            style={{
              fontSize: "1.2rem",
              fontWeight: "bold",
              margin: 0,
              minWidth: 180,
              textAlign: "center",
            }}
          >
            {formatTitle()}
          </h2>
          <button onClick={handleNext} style={btnNavStyle}>
            <FiChevronRight size={24} color="#1769e3" />
          </button>
        </div>

        <div
          style={{
            display: "flex",
            backgroundColor: "#f0f2f5",
            borderRadius: "6px",
            padding: "4px",
          }}
        >
          <button
            onClick={() => onViewModeChange("mensal")}
            style={viewMode === "mensal" ? btnActiveStyle : btnInactiveStyle}
          >
            Visão Mensal
          </button>
          <button
            onClick={() => onViewModeChange("anual")}
            style={viewMode === "anual" ? btnActiveStyle : btnInactiveStyle}
          >
            Visão Anual
          </button>
        </div>
      </div>

      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <LineChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#eee"
            />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 12, fill: "#888" }}
              axisLine={false}
              tickLine={false}
            />

            <YAxis
              tick={{ fontSize: 12, fill: "#888" }}
              axisLine={false}
              tickLine={false}
              width={80}
              tickFormatter={(value) => `R$ ${value}`}
            />

            <Tooltip
              formatter={(value: any) => toBRL(Number(value || 0))}
              contentStyle={{
                borderRadius: 8,
                border: "none",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}
            />
            <Legend verticalAlign="top" height={36} />

            <Line
              type="monotone"
              dataKey="receita"
              name="Receitas"
              stroke="#2ecc71"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="despesa"
              name="Despesas"
              stroke="#e74c3c"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",

          marginTop: "20px",
          justifyContent: "space-between",
        }}
      >
        <KpiCard
          label="Caixa Total"
          value={saldoGeral}
          color={saldoGeral >= 0 ? "#1769e3" : "#e74c3c"}
          isBold
        />
        <KpiCard
          label="Receitas no Período"
          value={kpis.receitas}
          color="#2ecc71"
        />
        <KpiCard
          label="Despesas no Período"
          value={kpis.despesas}
          color="#e74c3c"
          prefix="-"
        />
        <KpiCard
          label="Líquido do Período"
          value={kpis.resultadoLiquido}
          color={kpis.resultadoLiquido >= 0 ? "#2ecc71" : "#e74c3c"}
        />
      </div>
    </div>
  );
}

const KpiCard = ({ label, value, color, prefix = "", isBold = false }: any) => (
  <div style={{ padding: "15px", textAlign: "center" }}>
    <p style={{ fontSize: "14px", color: "#666", marginBottom: "5px" }}>
      {label}
    </p>
    <p
      style={{ fontSize: "24px", color: color, fontWeight: isBold ? 700 : 500 }}
    >
      {prefix}{" "}
      {value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
    </p>
  </div>
);

const btnNavStyle = {
  background: "none",
  border: "none",
  cursor: "pointer",
  padding: "5px",
  display: "flex",
  alignItems: "center",
};
const btnActiveStyle = {
  padding: "6px 16px",
  backgroundColor: "#1769e3",
  color: "#fff",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
  fontSize: "13px",
  fontWeight: 600,
};
const btnInactiveStyle = {
  padding: "6px 16px",
  backgroundColor: "transparent",
  color: "#666",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
  fontSize: "13px",
};
