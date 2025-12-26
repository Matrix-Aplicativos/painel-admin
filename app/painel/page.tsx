"use client";

import {
  FiTrendingUp,
  FiUsers,
  FiDollarSign,
  FiAlertCircle,
  FiActivity, // Icone generico para lista vazia
} from "react-icons/fi";
import Link from "next/link";

// Hooks
import useGetDashboardStats from "@/app/src/hooks/Dashboard/useGetDashboardStats";
import useGetRecentActivities from "@/app/src/hooks/Dashboard/useGetRecentActivities";

export default function HomePage() {
  const { stats, loading: loadingStats } = useGetDashboardStats();
  const { atividades, loading: loadingActivities } = useGetRecentActivities();

  // Função auxiliar de formatação monetária
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(val);
  };

  const cardsData = [
    {
      label: "Total de Clientes",
      valor: loadingStats ? "..." : stats.totalClientes,
      icon: <FiUsers size={24} />,
      color: "#1769e3",
    },
    {
      label: "Faturamento Hoje",
      valor: loadingStats ? "..." : formatCurrency(stats.faturamentoHoje),
      icon: <FiDollarSign size={24} />,
      color: "#28a745",
    },
    {
      label: "Integrações Ativas",
      valor: loadingStats ? "..." : stats.novasIntegracoes,
      icon: <FiTrendingUp size={24} />,
      color: "#ffc107",
    },
    {
      label: "Vencimentos Hoje",
      valor: loadingStats ? "..." : stats.vencimentosHoje,
      icon: <FiAlertCircle size={24} />,
      color: "#dc3545",
    },
  ];

  return (
    <div style={{ color: "var(--header-text-color)", paddingBottom: "40px" }}>
      {/* HEADER */}
      <h1
        style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "20px" }}
      >
        Visão Geral
      </h1>

      {/* CARDS GRID */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "20px",
          marginBottom: "30px",
        }}
      >
        {cardsData.map((stat, index) => (
          <div
            key={index}
            style={{
              backgroundColor: "var(--modal-bg-color, #fff)", // fallback para branco se variavel falhar
              border: "1px solid var(--wrapper-border-color, #e0e0e0)",
              padding: "20px",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
            }}
          >
            <div>
              <p
                style={{
                  fontSize: "14px",
                  color: "var(--text-placeholder-color, #888)",
                }}
              >
                {stat.label}
              </p>
              <h3
                style={{
                  fontSize: "24px",
                  fontWeight: "bold",
                  margin: "5px 0",
                  color: "#333",
                }}
              >
                {stat.valor}
              </h3>
            </div>
            <div
              style={{
                backgroundColor: `${stat.color}20`,
                color: stat.color,
                padding: "10px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      {/* SEÇÃO INFERIOR GRID */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
          gap: "20px",
        }}
      >
        {/* TABELA DE ATIVIDADES RECENTES */}
        <div
          style={{
            backgroundColor: "var(--modal-bg-color, #fff)",
            border: "1px solid var(--wrapper-border-color, #e0e0e0)",
            borderRadius: "8px",
            padding: "20px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
            minHeight: "300px",
          }}
        >
          <h3
            style={{ marginBottom: "15px", fontWeight: "600", color: "#333" }}
          >
            Últimas Atividades
          </h3>

          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr
                style={{
                  borderBottom: "1px solid var(--wrapper-border-color, #eee)",
                  textAlign: "left",
                }}
              >
                <th
                  style={{
                    padding: "10px 0",
                    color: "#888",
                    fontSize: "14px",
                    fontWeight: 500,
                  }}
                >
                  Origem
                </th>
                <th
                  style={{
                    padding: "10px 0",
                    color: "#888",
                    fontSize: "14px",
                    fontWeight: 500,
                  }}
                >
                  Descrição
                </th>
                <th
                  style={{
                    padding: "10px 0",
                    color: "#888",
                    fontSize: "14px",
                    fontWeight: 500,
                    textAlign: "right",
                  }}
                >
                  Data
                </th>
              </tr>
            </thead>
            <tbody>
              {loadingActivities ? (
                <tr>
                  <td
                    colSpan={3}
                    style={{
                      padding: "20px",
                      textAlign: "center",
                      color: "#999",
                    }}
                  >
                    Carregando atividades...
                  </td>
                </tr>
              ) : atividades.length === 0 ? (
                <tr>
                  <td
                    colSpan={3}
                    style={{
                      padding: "40px",
                      textAlign: "center",
                      color: "#999",
                    }}
                  >
                    <FiActivity
                      size={30}
                      style={{
                        marginBottom: 10,
                        display: "block",
                        margin: "0 auto",
                      }}
                    />
                    Nenhuma atividade recente registrada.
                  </td>
                </tr>
              ) : (
                atividades.map((item) => (
                  <tr
                    key={item.id}
                    style={{ borderBottom: "1px solid #f0f0f0" }}
                  >
                    <td
                      style={{
                        padding: "12px 0",
                        fontWeight: "500",
                        color: "#333",
                      }}
                    >
                      {item.titulo}
                    </td>
                    <td
                      style={{
                        padding: "12px 0",
                        fontSize: "14px",
                        color: "#666",
                      }}
                    >
                      {item.acao}
                    </td>
                    <td
                      style={{
                        padding: "12px 0",
                        textAlign: "right",
                        fontSize: "12px",
                        color: "#999",
                      }}
                    >
                      {item.data}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* CARD DE BOAS VINDAS / AÇÃO */}
        <div
          style={{
            backgroundColor: "var(--button-active-bg-color, #1769e3)", // Cor primária
            color: "#fff",
            borderRadius: "8px",
            padding: "30px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "flex-start",
            boxShadow: "0 4px 10px rgba(23, 105, 227, 0.3)",
          }}
        >
          <h2
            style={{
              fontSize: "28px",
              fontWeight: "bold",
              marginBottom: "10px",
            }}
          >
            Bem-vindo de volta!
          </h2>

          <p
            style={{
              fontSize: "16px",
              marginBottom: "25px",
              opacity: 0.9,
              lineHeight: "1.5",
            }}
          >
            Você tem <strong>{stats.vencimentosHoje} vencimentos</strong>{" "}
            pendentes para hoje e o faturamento do dia está em{" "}
            <strong>{formatCurrency(stats.faturamentoHoje)}</strong>.
          </p>

          <div style={{ display: "flex", gap: "10px" }}>
            <Link href="/painel/FluxoCaixa">
              <button
                style={{
                  backgroundColor: "white",
                  color: "#1769e3",
                  border: "none",
                  padding: "10px 20px",
                  borderRadius: "4px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                }}
              >
                Ver Financeiro
              </button>
            </Link>
            <Link href="/painel/Vencimentos">
              <button
                style={{
                  backgroundColor: "rgba(255,255,255,0.2)",
                  color: "white",
                  border: "1px solid rgba(255,255,255,0.4)",
                  padding: "10px 20px",
                  borderRadius: "4px",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                Ver Vencimentos
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
