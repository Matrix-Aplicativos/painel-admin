"use client";

import { useState } from "react";
import { FiX, FiSearch } from "react-icons/fi";
import styles from "./ModalMunicipio.module.css";
import PaginationControls from "../PaginationControls";
import useGetMunicipio, {
  MunicipioItem,
} from "../../hooks/Municipio/useGetMunicipio";

interface ModalMunicipioProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (cidade: MunicipioItem) => void;
}

export default function ModalMunicipio({
  isOpen,
  onClose,
  onSelect,
}: ModalMunicipioProps) {
  //Declaração de todos os useStates
  const [busca, setBusca] = useState("");
  const [uf, setUf] = useState("");
  const [filtroNome, setFiltroNome] = useState("");
  const [filtroUf, setFiltroUf] = useState("");
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [porPagina, setPorPagina] = useState(20);

  //Declaração de Funções e Lógica
  const { municipios, pagination, loading, refetch } = useGetMunicipio({
    pagina: paginaAtual,
    porPagina: porPagina,
    nome: filtroNome,
    uf: filtroUf,
  });

  const UFS = [
    "AC",
    "AL",
    "AP",
    "AM",
    "BA",
    "CE",
    "DF",
    "ES",
    "GO",
    "MA",
    "MT",
    "MS",
    "MG",
    "PA",
    "PB",
    "PR",
    "PE",
    "PI",
    "RJ",
    "RN",
    "RS",
    "RO",
    "RR",
    "SC",
    "SP",
    "SE",
    "TO",
  ];

  const handleBuscar = () => {
    setPaginaAtual(1);
    setFiltroNome(busca);
    setFiltroUf(uf);
    setTimeout(() => refetch(), 0);
  };

  const handleSelecionar = (item: MunicipioItem) => {
    onSelect(item);
    onClose();
  };

  //Declaração de Funções de renderização
  const renderHeader = () => (
    <div className={styles.header}>
      <h2 className={styles.title}>SELECIONAR MUNICÍPIO</h2>
      <button className={styles.closeButton} onClick={onClose}>
        <FiX />
      </button>
    </div>
  );

  const renderFilters = () => (
    <div className={styles.filtersRow}>
      <div className={styles.inputGroup} style={{ flex: 2 }}>
        <label>Nome</label>
        <input
          type="text"
          placeholder="Nome da Cidade"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleBuscar()}
        />
      </div>
      <div className={styles.inputGroup} style={{ flex: 1 }}>
        <label>UF</label>
        <select value={uf} onChange={(e) => setUf(e.target.value)}>
          <option value="">Todas</option>
          {UFS.map((estado) => (
            <option key={estado} value={estado}>
              {estado}
            </option>
          ))}
        </select>
      </div>
      <button className={styles.btnSearch} onClick={handleBuscar}>
        Buscar <FiSearch />
      </button>
    </div>
  );

  const renderTable = () => (
    <div
      className={styles.tableContainer}
      style={{
        maxHeight: "60vh",
        overflowY: "auto",
        marginTop: "10px",
        borderBottom: "1px solid #eee",
      }}
    >
      <table className={styles.table}>
        <thead
          style={{
            position: "sticky",
            top: 0,
            zIndex: 1,
            backgroundColor: "#fff",
          }}
        >
          <tr>
            <th>Cód. IBGE</th>
            <th>Nome</th>
            <th>UF</th>
            <th style={{ width: "120px", textAlign: "center" }}>Ação</th>
          </tr>
        </thead>
        <tbody>
          {loading && (
            <tr>
              <td colSpan={4} style={{ textAlign: "center", padding: "20px" }}>
                Carregando municípios...
              </td>
            </tr>
          )}

          {!loading && municipios.length === 0 && (
            <tr>
              <td colSpan={4} style={{ textAlign: "center", padding: "20px" }}>
                Nenhum município encontrado.
              </td>
            </tr>
          )}

          {!loading &&
            municipios.map((item) => (
              <tr key={item.codMunicipioIbge}>
                <td>{item.codMunicipioIbge}</td>
                <td>{item.nome}</td>
                <td>{item.uf}</td>
                <td style={{ textAlign: "center" }}>
                  <button
                    className={styles.btnSelect}
                    onClick={() => handleSelecionar(item)}
                  >
                    Selecionar
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );

  const renderPagination = () => {
    if (!pagination) return null;
    return (
      <div style={{ marginTop: "15px", flexShrink: 0 }}>
        <PaginationControls
          paginaAtual={pagination.paginaAtual}
          totalPaginas={pagination.qtdPaginas}
          totalElementos={pagination.qtdElementos}
          porPagina={porPagina}
          onPageChange={setPaginaAtual}
          onItemsPerPageChange={(val) => {
            setPorPagina(val);
            setPaginaAtual(1);
          }}
          itemsPerPageOptions={[20, 50, 100]}
        />
      </div>
    );
  };

  //Return
  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.container}>
        {renderHeader()}
        {renderFilters()}
        {renderTable()}
        {renderPagination()}
      </div>
    </div>
  );
}
