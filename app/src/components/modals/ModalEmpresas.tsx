"use client";

import { useState } from "react";
import styles from "./ModalEmpresas.module.css"; // Copie o CSS do ModalMunicipio
import { FiX, FiSearch, FiPlus } from "react-icons/fi";
import PaginationControls from "../PaginationControls";

// Mock Empresas Disponíveis
const MOCK_EMPRESAS_DISPONIVEIS = [
  {
    id: 101,
    razao: "Empresa Alpha Ltda",
    cnpj: "00.000.000/0001-01",
    cidade: "São Paulo - SP",
  },
  {
    id: 102,
    razao: "Comércio Beta S.A.",
    cnpj: "11.111.111/0001-01",
    cidade: "Rio de Janeiro - RJ",
  },
  {
    id: 103,
    razao: "Loja Gamma",
    cnpj: "22.222.222/0001-01",
    cidade: "Cuiabá - MT",
  },
  {
    id: 104,
    razao: "Indústria Delta",
    cnpj: "33.333.333/0001-01",
    cidade: "Curitiba - PR",
  },
  {
    id: 105,
    razao: "Tech Solutions",
    cnpj: "44.444.444/0001-01",
    cidade: "Belo Horizonte - MG",
  },
];

interface ModalVincularEmpresaProps {
  isOpen: boolean;
  onClose: () => void;
  onVincular: (empresa: any) => void;
}

export default function ModalVincularEmpresa({
  isOpen,
  onClose,
  onVincular,
}: ModalVincularEmpresaProps) {
  const [busca, setBusca] = useState("");
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [porPagina, setPorPagina] = useState(5);

  if (!isOpen) return null;

  // Filtro
  const dadosFiltrados = MOCK_EMPRESAS_DISPONIVEIS.filter(
    (e) =>
      e.razao.toLowerCase().includes(busca.toLowerCase()) ||
      e.cnpj.includes(busca)
  );

  return (
    <div className={styles.overlay}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>VINCULAR EMPRESA</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <FiX />
          </button>
        </div>

        {/* Filtros */}
        <div className={styles.filtersRow}>
          <div className={styles.inputGroup} style={{ flex: 2 }}>
            <label>Buscar</label>
            <input
              type="text"
              placeholder="Razão Social ou CNPJ"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </div>
          <button className={styles.btnSearch}>
            Buscar <FiSearch />
          </button>
        </div>

        {/* Tabela */}
        <div className={styles.tableContainer}>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Razão Social</th>
                  <th>CNPJ</th>
                  <th>Cidade</th>
                  <th style={{ textAlign: "center", width: "100px" }}>Ação</th>
                </tr>
              </thead>
              <tbody>
                {dadosFiltrados.map((emp) => (
                  <tr key={emp.id}>
                    <td>{emp.razao}</td>
                    <td>{emp.cnpj}</td>
                    <td>{emp.cidade}</td>
                    <td style={{ textAlign: "center" }}>
                      <button
                        className={styles.btnSelect}
                        onClick={() => {
                          onVincular(emp);
                          onClose();
                        }}
                      >
                        Vincular
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Paginação */}
        <div style={{ marginTop: "0", flexShrink: 0 }}>
          <PaginationControls
            paginaAtual={paginaAtual}
            totalPaginas={1}
            totalElementos={dadosFiltrados.length}
            porPagina={porPagina}
            onPageChange={setPaginaAtual}
            onItemsPerPageChange={setPorPagina}
            itemsPerPageOptions={[5, 10]}
          />
        </div>
      </div>
    </div>
  );
}
