"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "@/app/src/components/Tabelas.module.css";
import { FiLink, FiPlus, FiRefreshCw } from "react-icons/fi";
import ModalIntegracao from "@/app/src/components/modals/ModalIntegracao";
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
];

export default function IntegracoesPage() {
  const [dados] = useState(MOCK);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [porPagina, setPorPagina] = useState(20);
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleVerDetalhes = (id: number) => {
    router.push(`/painel/Integracoes/${id}`);
  };

  const handleNovaIntegracao = () => {
    setIsModalOpen(true);
  };

  const handleSalvar = (data: any) => {
    console.log("Salvar Integração:", data);
    setIsModalOpen(false);
  };

  return (
    <div className={styles.container}>
      <ModalIntegracao
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSalvar}
        initialData={null}
      />

      <h1 className={styles.title}>INTEGRAÇÕES</h1>

      <div className={styles.searchContainer}>
        <SearchBar
          placeholder="Buscar Integração ou CNPJ"
          onSearch={() => {}}
        />
        <div className={styles.searchActions}>
          <button
            className={styles.primaryButton}
            onClick={handleNovaIntegracao}
          >
            Nova Integração <FiPlus size={18} />
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
