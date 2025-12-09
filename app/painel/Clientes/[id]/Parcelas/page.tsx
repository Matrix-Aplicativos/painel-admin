"use client";

import { useState } from "react";
import styles from "../../../../src/components/Tabelas.module.css";
import { FiEdit, FiTrash2, FiPlus, FiArrowLeft } from "react-icons/fi";
import Link from "next/link";
import { useParams } from "next/navigation";
import ModalParcela from "@/app/src/components/modals/ModalParcela";
import PaginationControls from "@/app/src/components/PaginationControls";


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
  const [dados, setDados] = useState(MOCK_PARCELAS);

  // Estados do Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [parcelaSelecionada, setParcelaSelecionada] = useState<any>(null);

  // Ações
  const handleNovo = () => {
    setParcelaSelecionada(null); // Garante que o form vem vazio
    setIsModalOpen(true);
  };

  const handleEditar = (item: any) => {
    setParcelaSelecionada(item); // Preenche o form com os dados
    setIsModalOpen(true);
  };

  const handleSalvar = (dadosForm: any) => {
    console.log("Salvando dados:", dadosForm);
    // Aqui entraria a lógica de salvar no backend ou atualizar o estado
    setIsModalOpen(false);
  };

  return (
    <div className={styles.container}>
      {/* Componente Modal Inserido Aqui */}
      <ModalParcela
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSalvar}
        initialData={parcelaSelecionada}
      />

      <div style={{ marginBottom: "20px", marginTop: "20px" }}>
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

          <button className={styles.primaryButton} onClick={handleNovo}>
            Novo <FiPlus size={18} />
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
                    {Number(item.valor).toLocaleString("pt-BR", {
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
                        onClick={() => handleEditar(item)} // <--- Ação de Editar
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

        {/* Adicionei paginação aqui caso tenha esquecido */}
        <PaginationControls
          paginaAtual={1}
          totalPaginas={1}
          totalElementos={dados.length}
          porPagina={20}
          onPageChange={() => {}}
          onItemsPerPageChange={() => {}}
        />
      </div>
    </div>
  );
}
