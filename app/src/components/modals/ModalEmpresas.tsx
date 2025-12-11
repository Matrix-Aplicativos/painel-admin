"use client";

import { useState } from "react";
import { FiX, FiSearch } from "react-icons/fi";
import styles from "./ModalMunicipio.module.css";
import PaginationControls from "../PaginationControls";
import useGetEmpresa, {
  EmpresaItem,
} from "@/app/src/hooks/Empresa/useGetEmpresa";

interface ModalVincularEmpresaProps {
  isOpen: boolean;
  onClose: () => void;
  onVincular: (empresa: EmpresaItem) => void;
}

export default function ModalVincularEmpresa({
  isOpen,
  onClose,
  onVincular,
}: ModalVincularEmpresaProps) {
  //Declaração de todos os useStates
  const [buscaRazao, setBuscaRazao] = useState("");
  const [buscaCnpj, setBuscaCnpj] = useState("");
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [porPagina, setPorPagina] = useState(20);

  //Declaração de Funções e Lógica
  const { empresas, pagination, loading, refetch } = useGetEmpresa({
    pagina: paginaAtual,
    porPagina: porPagina,
    razaoSocial: buscaRazao,
    cnpj: buscaCnpj,
    orderBy: "razaoSocial",
    direction: "asc",
  });

  const handleBuscar = () => {
    setPaginaAtual(1);
    refetch();
  };

  const handleSelecionar = (item: EmpresaItem) => {
    onVincular(item);
    onClose();
  };

  //Declaração de Funções de renderização
  const renderHeader = () => (
    <div className={styles.header}>
      <h2 className={styles.title}>VINCULAR EMPRESA</h2>
      <button className={styles.closeButton} onClick={onClose}>
        <FiX />
      </button>
    </div>
  );

  const renderFilters = () => (
    <div className={styles.filtersRow}>
      <div className={styles.inputGroup} style={{ flex: 2 }}>
        <label>Razão Social</label>
        <input
          type="text"
          placeholder="Buscar por Razão Social"
          value={buscaRazao}
          onChange={(e) => setBuscaRazao(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleBuscar()}
        />
      </div>
      <div className={styles.inputGroup} style={{ flex: 1 }}>
        <label>CNPJ</label>
        <input
          type="text"
          placeholder="Buscar por CNPJ"
          value={buscaCnpj}
          onChange={(e) => setBuscaCnpj(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleBuscar()}
        />
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
            <th>Cód.</th>
            <th>Razão Social</th>
            <th>CNPJ</th>
            <th>Cidade / UF</th>
            <th style={{ width: "120px", textAlign: "center" }}>Ação</th>
          </tr>
        </thead>
        <tbody>
          {loading && (
            <tr>
              <td colSpan={5} style={{ textAlign: "center", padding: "20px" }}>
                Carregando empresas...
              </td>
            </tr>
          )}

          {!loading && empresas.length === 0 && (
            <tr>
              <td colSpan={5} style={{ textAlign: "center", padding: "20px" }}>
                Nenhuma empresa encontrada.
              </td>
            </tr>
          )}

          {!loading &&
            empresas.map((item) => (
              <tr key={item.codEmpresa}>
                <td>{item.codEmpresa}</td>
                <td>{item.razaoSocial}</td>
                <td>{item.cnpj}</td>
                <td>
                  {item.municipio
                    ? `${item.municipio.nome} - ${item.municipio.uf}`
                    : "-"}
                </td>
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
      <div
        className={styles.container}
        style={{ width: "800px", maxWidth: "95%" }}
      >
        {renderHeader()}
        {renderFilters()}
        {renderTable()}
        {renderPagination()}
      </div>
    </div>
  );
}
