"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "@/app/src/components/Tabelas.module.css";
import { FiLink, FiPlus } from "react-icons/fi";
import SearchBar from "@/app/src/components/SearchBar";
import PaginationControls from "@/app/src/components/PaginationControls";

const MOCK = [
  {
    id: 1,
    descricao: "Integração ERP Protheus",
    cnpj: "12.345.678/0001-90",
    qtd: 3,
    status: true,
  },
  {
    id: 2,
    descricao: "E-commerce VTEX",
    cnpj: "98.765.432/0001-10",
    qtd: 1,
    status: true,
  },
  {
    id: 3,
    descricao: "Sistema SAP",
    cnpj: "44.555.666/0001-22",
    qtd: 5,
    status: false,
  },
  {
    id: 4,
    descricao: "API Bling",
    cnpj: "11.222.333/0001-44",
    qtd: 2,
    status: true,
  },
];

export default function IntegracoesPage() {
  const [dados] = useState(MOCK);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [porPagina, setPorPagina] = useState(20);
  const router = useRouter();

  const handleVerDetalhes = (id: number) => {
    router.push(`/painel/Integracoes/${id}`);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>INTEGRAÇÕES</h1>

      <div className={styles.searchContainer}>
        <SearchBar
          placeholder="Buscar Integração ou CNPJ"
          onSearch={() => {}}
        />
        <div className={styles.searchActions}>
          <button className={styles.primaryButton}>
            <FiPlus size={18} /> Nova Integração
          </button>
        </div>
      </div>

      <div className={styles.tableContainer}>
        <div className={styles.tableScroll}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Descrição</th>
                <th>CNPJ</th>
                <th>Qtd Empresas</th>
                <th>Status</th>
                <th className={styles.actionsCell}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {dados.map((item) => (
                <tr key={item.id}>
                  <td
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <FiLink color="#1769e3" /> {item.descricao}
                  </td>
                  <td>{item.cnpj}</td>
                  <td>{item.qtd}</td>
                  <td>
                    <span
                      className={`${styles.statusBadge} ${
                        item.status
                          ? styles.statusCompleted
                          : styles.statusNotStarted
                      }`}
                    >
                      {item.status ? "ATIVO" : "INATIVO"}
                    </span>
                  </td>
                  <td className={styles.actionsCell}>
                    <div style={{ display: "flex", justifyContent: "center" }}>
                      <button
                        className={styles.btnDetails}
                        onClick={() => handleVerDetalhes(item.id)}
                      >
                        Ver detalhes
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <PaginationControls
          paginaAtual={paginaAtual}
          totalPaginas={1}
          totalElementos={dados.length}
          porPagina={porPagina}
          onPageChange={setPaginaAtual}
          onItemsPerPageChange={setPorPagina}
        />
      </div>
    </div>
  );
}
