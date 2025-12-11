"use client";

import { useState } from "react";
import { FiPlus, FiSearch } from "react-icons/fi";
import styles from "@/app/src/components/Tabelas.module.css";
import PaginationControls from "@/app/src/components/PaginationControls";
import useGetVersaoMovix from "@/app/src/hooks/VersaoMovix/useGetVersaoMovix";
import ModalVersaoMovix from "@/app/src/components/modals/ModalVersaoMovix";

export default function VersaoMovixPage() {
  const [buscaVersao, setBuscaVersao] = useState("");
  const [buscaPlataforma, setBuscaPlataforma] = useState("");
  const [filtroVersao, setFiltroVersao] = useState("");
  const [filtroPlataforma, setFiltroPlataforma] = useState("");
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [porPagina, setPorPagina] = useState(20);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const { versoes, pagination, loading, error, refetch } = useGetVersaoMovix({
    pagina: paginaAtual,
    porPagina: porPagina,
    versao: filtroVersao,
    plataforma: filtroPlataforma,
    orderBy: "dataCadastro",
    direction: "desc",
  });

  const handleNovo = () => {
    setSelectedId(null);
    setIsModalOpen(true);
  };

  const handleVerDetalhes = (id: number) => {
    setSelectedId(id);
    setIsModalOpen(true);
  };

  const handleSearch = () => {
    setPaginaAtual(1);
    setFiltroVersao(buscaVersao);
    setFiltroPlataforma(buscaPlataforma);
    setTimeout(() => refetch(), 0);
  };

  const handleSuccess = () => {
    refetch();
  };

  const formatData = (dataIso: string) => {
    if (!dataIso) return "-";
    return new Date(dataIso).toLocaleDateString("pt-BR");
  };

  const formatPlataforma = (valor: string) => {
    if (valor === "1") return "ANDROID";
    if (valor === "2") return "IOS";
    return valor;
  };

  const renderSearchSection = () => (
    <div className={styles.searchContainer}>
      <div
        style={{
          display: "flex",
          gap: "10px",
          flex: 1,
          alignItems: "flex-end",
        }}
      >
        <div className={styles.inputWrapper}>
          <label
            style={{
              fontSize: "12px",
              color: "#666",
              marginBottom: "4px",
              display: "block",
            }}
          >
            Versão
          </label>
          <input
            type="text"
            placeholder="X.X.X"
            value={buscaVersao}
            onChange={(e) => setBuscaVersao(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            style={{
              padding: "8px",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          />
        </div>

        <div className={styles.inputWrapper}>
          <label
            style={{
              fontSize: "12px",
              color: "#666",
              marginBottom: "4px",
              display: "block",
            }}
          >
            Plataforma
          </label>
          <select
            value={buscaPlataforma}
            onChange={(e) => setBuscaPlataforma(e.target.value)}
            style={{
              padding: "8px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              minWidth: "150px",
            }}
          >
            <option value="">Selecione</option>
            <option value="1">ANDROID</option>
            <option value="2">IOS</option>
          </select>
        </div>

        <button
          className={styles.primaryButton}
          onClick={handleSearch}
          style={{
            backgroundColor: "#1769e3",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            gap: "5px",
          }}
        >
          Buscar <FiSearch color="#fff" />
        </button>
      </div>

      <div className={styles.searchActions}>
        <button className={styles.primaryButton} onClick={handleNovo}>
          Nova Versão <FiPlus size={18} />
        </button>
      </div>
    </div>
  );

  const renderTableContent = () => {
    if (loading) {
      return (
        <div style={{ padding: 20, textAlign: "center" }}>
          Carregando versões...
        </div>
      );
    }

    if (error) {
      return (
        <div style={{ padding: 20, textAlign: "center", color: "red" }}>
          {error}
        </div>
      );
    }

    return (
      <>
        <div className={styles.tableScroll}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Versão</th>
                <th>Plataforma</th>
                <th>Att. Obrigatória</th>
                <th>Data Cadastro</th>
                <th className={styles.actionsCell}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {versoes.map((item) => (
                <tr key={item.codVersao}>
                  <td>{item.stringVersao}</td>
                  <td>{formatPlataforma(item.plataforma)}</td>
                  <td>
                    <span
                      style={{
                        color: item.atualizacaoObrigatoria ? "#00d16d" : "#666",
                        fontWeight: "bold",
                        fontSize: "12px",
                      }}
                    >
                      {item.atualizacaoObrigatoria ? "SIM" : "NÃO"}
                    </span>
                  </td>
                  <td>{formatData(item.dataCadastro)}</td>
                  <td className={styles.actionsCell}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <button
                        className={styles.btnDetails}
                        onClick={() => handleVerDetalhes(item.codVersao)}
                      >
                        Ver detalhes
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {versoes.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center", padding: 20 }}>
                    Nenhum registro encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {pagination && (
          <PaginationControls
            paginaAtual={pagination.paginaAtual}
            totalPaginas={pagination.qtdPaginas}
            totalElementos={pagination.qtdElementos}
            porPagina={porPagina}
            onPageChange={setPaginaAtual}
            onItemsPerPageChange={setPorPagina}
          />
        )}
      </>
    );
  };

  return (
    <div className={styles.container}>
      <ModalVersaoMovix
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        idVersao={selectedId}
        onSuccess={handleSuccess}
      />

      <h1 className={styles.title}>VERSIONAMENTO MOVIX</h1>
      {renderSearchSection()}
      <div className={styles.tableContainer}>{renderTableContent()}</div>
    </div>
  );
}
