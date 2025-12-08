"use client";

import {
  FiTrendingUp,
  FiUsers,
  FiDollarSign,
  FiAlertCircle,
} from "react-icons/fi";

export default function HomePage() {
  const stats = [
    {
      label: "Total de Clientes",
      valor: "1.240",
      icon: <FiUsers size={24} />,
      color: "#1769e3",
    },
    {
      label: "Faturamento Hoje",
      valor: "R$ 12.450,00",
      icon: <FiDollarSign size={24} />,
      color: "#28a745",
    },
    {
      label: "Novas Integrações",
      valor: "5",
      icon: <FiTrendingUp size={24} />,
      color: "#ffc107",
    },
    {
      label: "Vencimentos Hoje",
      valor: "3",
      icon: <FiAlertCircle size={24} />,
      color: "#dc3545",
    },
  ];

  const atividadesRecentes = [
    {
      id: 1,
      cliente: "Empresa Solar Ltda",
      acao: "Pagamento Confirmado",
      data: "10:30",
    },
    {
      id: 2,
      cliente: "Tech Solutions",
      acao: "Integração Hubspot",
      data: "09:15",
    },
    {
      id: 3,
      cliente: "Mercado Central",
      acao: "Novo Pedido #1029",
      data: "08:45",
    },
    { id: 4, cliente: "Padaria do João", acao: "Boleto Gerado", data: "Ontem" },
    {
      id: 5,
      cliente: "Logística Express",
      acao: "Chamado Aberto",
      data: "Ontem",
    },
  ];

  return (
    <div style={{ color: "var(--header-text-color)" }}>
      <h1
        style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "20px" }}
      >
        Visão Geral
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "20px",
          marginBottom: "30px",
        }}
      >
        {stats.map((stat, index) => (
          <div
            key={index}
            style={{
              backgroundColor: "var(--modal-bg-color)",
              border: "1px solid var(--wrapper-border-color)",
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
                  color: "var(--text-placeholder-color)",
                }}
              >
                {stat.label}
              </p>
              <h3
                style={{
                  fontSize: "24px",
                  fontWeight: "bold",
                  margin: "5px 0",
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
              }}
            >
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
          gap: "20px",
        }}
      >
        <div
          style={{
            backgroundColor: "var(--modal-bg-color)",
            border: "1px solid var(--wrapper-border-color)",
            borderRadius: "8px",
            padding: "20px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
          }}
        >
          <h3 style={{ marginBottom: "15px", fontWeight: "600" }}>
            Últimas Atividades
          </h3>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr
                style={{
                  borderBottom: "1px solid var(--wrapper-border-color)",
                  textAlign: "left",
                }}
              >
                <th
                  style={{
                    padding: "10px 0",
                    color: "var(--text-placeholder-color)",
                    fontSize: "14px",
                  }}
                >
                  Cliente
                </th>
                <th
                  style={{
                    padding: "10px 0",
                    color: "var(--text-placeholder-color)",
                    fontSize: "14px",
                  }}
                >
                  Ação
                </th>
                <th
                  style={{
                    padding: "10px 0",
                    color: "var(--text-placeholder-color)",
                    fontSize: "14px",
                    textAlign: "right",
                  }}
                >
                  Data
                </th>
              </tr>
            </thead>
            <tbody>
              {atividadesRecentes.map((item) => (
                <tr
                  key={item.id}
                  style={{
                    borderBottom: "1px solid var(--wrapper-border-color)",
                  }}
                >
                  <td style={{ padding: "12px 0", fontWeight: "500" }}>
                    {item.cliente}
                  </td>
                  <td
                    style={{
                      padding: "12px 0",
                      fontSize: "14px",
                      color: "var(--text-secondary-color)",
                    }}
                  >
                    {item.acao}
                  </td>
                  <td
                    style={{
                      padding: "12px 0",
                      textAlign: "right",
                      fontSize: "12px",
                      color: "var(--text-placeholder-color)",
                    }}
                  >
                    {item.data}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div
          style={{
            backgroundColor: "var(--button-active-bg-color)",
            color: "var(--button-active-text-color)",
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
          <p style={{ fontSize: "16px", marginBottom: "25px", opacity: 0.9 }}>
            Você tem 3 vencimentos pendentes para hoje e 5 novas integrações
            aguardando configuração.
          </p>
          <button
            style={{
              backgroundColor: "white",
              color: "var(--button-active-bg-color)",
              border: "none",
              padding: "10px 20px",
              borderRadius: "4px",
              fontWeight: "bold",
              cursor: "pointer",
              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
            }}
          >
            Ver Relatórios
          </button>
        </div>
      </div>
    </div>
  );
}
