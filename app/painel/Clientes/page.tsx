"use client";
import { useState } from "react";
import { useRouter } from "next/navigation"; // Importar useRouter
import styles from "@/app/src/components/Tabelas.module.css";
import { FiPlus, FiRefreshCw } from "react-icons/fi";
import SearchBar from "@/app/src/components/SearchBar";
import PaginationControls from "@/app/src/components/PaginationControls";

const MOCK = [
  {
    id: 1,
    razao: "Supermercado Modelo Ltda",
    doc: "12.345.678/0001-90",
    status: true,
  },
  {
    id: 2,
    razao: "Tech Soluções S.A.",
    doc: "98.765.432/0001-10",
    status: true,
  },
  { id: 3, razao: "Padaria do João", doc: "111.222.333-44", status: false },
  {
    id: 4,
    razao: "Transportadora Veloz",
    doc: "45.678.901/0001-23",
    status: true,
  },
  { id: 5, razao: "Consultoria ABC", doc: "55.444.333/0001-99", status: true },
  { id: 6, razao: "Mecânica do Zé", doc: "22.333.444-55", status: false },
];

export default function ClientesPage() {
  const [dados] = useState(MOCK);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [porPagina, setPorPagina] = useState(20);
  const router = useRouter(); // Hook de navegação

  const handleVerDetalhes = (id: number) => {
    // Redireciona para a página de detalhes
    router.push(`/painel/Clientes/${id}`);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>CLIENTES</h1>

      <div className={styles.searchContainer}>
        <SearchBar
          placeholder="Buscar por Razão Social ou CPF/CNPJ"
          onSearch={() => {}}
        />
        <div className={styles.searchActions}>
          <button className={styles.primaryButton}>
            <FiPlus size={18} /> Novo Cliente
          </button>
        </div>
      </div>

      <div className={styles.tableContainer}>
        <div className={styles.tableScroll}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Razão Social</th>
                <th>CPF/CNPJ</th>
                <th>Status</th>
                <th className={styles.actionsCell}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {dados.map((cliente) => (
                <tr key={cliente.id}>
                  <td>{cliente.razao}</td>
                  <td>{cliente.doc}</td>
                  <td>
                    <span
                      className={`${styles.statusBadge} ${
                        cliente.status
                          ? styles.statusCompleted
                          : styles.statusNotStarted
                      }`}
                    >
                      {cliente.status ? "ATIVO" : "INATIVO"}
                    </span>
                  </td>
                  <td className={styles.actionsCell}>
                    <div style={{ display: "flex", justifyContent: "center" }}>
                      <button
                        className={styles.btnDetails}
                        onClick={() => handleVerDetalhes(cliente.id)}
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
