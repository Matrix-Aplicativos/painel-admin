"use client";

import { useState } from "react";
import styles from "../../../../src/components/Tabelas.module.css";
import { FiEdit, FiTrash2, FiPlus, FiArrowLeft } from "react-icons/fi";
import Link from "next/link";
import { useParams } from "next/navigation";

// MOCK DE PARCELAS
const MOCK_PARCELAS = [
  {
    id: 101,
    parcela: 1,
    valor: 1000.0,
    vencimento: "10/10/2025",
    tipo: "Ativação",
    pago: true,
    dataPagamento: "09/10/2025",
  },
  {
    id: 102,
    parcela: 2,
    valor: 1000.0,
    vencimento: "10/11/2025",
    tipo: "Ativação",
    pago: true,
    dataPagamento: "09/11/2025",
  },
  {
    id: 103,
    parcela: 3,
    valor: 1000.0,
    vencimento: "10/12/2025",
    tipo: "Ativação",
    pago: false,
    dataPagamento: "-",
  },
  {
    id: 104,
    parcela: 1,
    valor: 1000.0,
    vencimento: "10/01/2026",
    tipo: "Ativação",
    pago: false,
    dataPagamento: "-",
  },
];

export default function ParcelasPage() {
  const params = useParams();
  const idCliente = params.id;
  const [dados] = useState(MOCK_PARCELAS);

  return (
    <div className={styles.container}>
      <div style={{ marginBottom: "20px", marginTop: '20px' }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
            <Link
              href={`/painel/Clientes/${idCliente}`}
              style={{ color: "#333", display: "flex", alignItems: "center" }}
            >
              <FiArrowLeft size={24} />
            </Link>
            <h1 className={styles.title} style={{ marginBottom: 0 }}>
              RAZÃO SOCIAL DO CLIENTE
            </h1>
          </div>

          <button
            className={styles.primaryButton}
          >
            <FiPlus size={18} /> Novo 
          </button>
        </div>
      </div>

      <div className={styles.tableContainer}>
        <div className={styles.tableScroll}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Nº Parcela</th>
                <th>Valor</th>
                <th>Data Vencimento</th>
                <th>Tipo</th>
                <th>Pago</th>
                <th>Data Pagamento</th>
                <th className={styles.actionsCell}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {dados.map((item) => (
                <tr key={item.id}>
                  <td>{item.parcela}</td>
                  <td>
                    {item.valor.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </td>
                  <td>{item.vencimento}</td>
                  <td>{item.tipo}</td>
                  <td>
                    <span
                      style={{
                        color: item.pago ? "#00e676" : "#ff4444",
                        fontWeight: "bold",
                        textTransform: "uppercase",
                      }}
                    >
                      {item.pago ? "SIM" : "NÃO"}
                    </span>
                  </td>
                  <td>{item.dataPagamento}</td>
                  <td className={styles.actionsCell}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        gap: "5px",
                      }}
                    >
                      <button
                        className={styles.actionButton}
                        style={{ padding: "8px", minWidth: "auto" }}
                        title="Editar"
                      >
                        <FiEdit size={18} />
                      </button>

                      <button
                        className={styles.deleteButton}
                        style={{ padding: "8px" }}
                        title="Excluir"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
