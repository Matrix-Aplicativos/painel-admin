"use client";

import { useState } from "react";
import styles from "./ModalMunicipio.module.css";
import { FiX, FiSearch } from "react-icons/fi";
import PaginationControls from "../PaginationControls"; // Reutilizando a paginação global

// Mock de Municípios
const MOCK_MUNICIPIOS = [
  { id: 1, nome: "Cuiabá", uf: "MT" },
  { id: 2, nome: "Várzea Grande", uf: "MT" },
  { id: 3, nome: "Rondonópolis", uf: "MT" },
  { id: 4, nome: "Sinop", uf: "MT" },
  { id: 5, nome: "São Paulo", uf: "SP" },
  { id: 6, nome: "Rio de Janeiro", uf: "RJ" },
];

interface ModalMunicipioProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (cidade: string) => void; // Retorna a cidade selecionada
}

export default function ModalMunicipio({
  isOpen,
  onClose,
  onSelect,
}: ModalMunicipioProps) {
  const [busca, setBusca] = useState("");
  const [uf, setUf] = useState("");

  // Paginação
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [porPagina, setPorPagina] = useState(5);

  if (!isOpen) return null;

  // Filtro Local
  const dadosFiltrados = MOCK_MUNICIPIOS.filter(
    (m) =>
      m.nome.toLowerCase().includes(busca.toLowerCase()) &&
      (uf ? m.uf === uf : true)
  );

  const handleSelecionar = (cidade: string, estado: string) => {
    onSelect(`${cidade} - ${estado}`);
    onClose();
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <h2 className={styles.title}>SELECIONAR MUNICÍPIO</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <FiX />
          </button>
        </div>

        {/* Filtros */}
        <div className={styles.filtersRow}>
          <div className={styles.inputGroup} style={{ flex: 2 }}>
            <label>Nome</label>
            <input
              type="text"
              placeholder="Nome da Cidade"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </div>
          <div className={styles.inputGroup} style={{ flex: 1 }}>
            <label>UF</label>
            <select value={uf} onChange={(e) => setUf(e.target.value)}>
              <option value="">Todas</option>
              <option value="MT">MT</option>
              <option value="SP">SP</option>
              <option value="RJ">RJ</option>
            </select>
          </div>
          <button className={styles.btnSearch}>
            Buscar <FiSearch />
          </button>
        </div>

        {/* Tabela */}
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Nome</th>
                <th>UF</th>
                <th style={{ width: "120px", textAlign: "center" }}>Ação</th>
              </tr>
            </thead>
            <tbody>
              {dadosFiltrados.map((item) => (
                <tr key={item.id}>
                  <td>{item.nome}</td>
                  <td>{item.uf}</td>
                  <td style={{ textAlign: "center" }}>
                    <button
                      className={styles.btnSelect}
                      onClick={() => handleSelecionar(item.nome, item.uf)}
                    >
                      Selecionar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Paginação */}
        <div style={{ marginTop: "auto" }}>
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
