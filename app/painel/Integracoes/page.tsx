"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "@/app/src/components/Tabelas.module.css";
import { FiLink, FiPlus, FiSearch } from "react-icons/fi"; // Importando FiSearch
import ModalIntegracao from "@/app/src/components/modals/ModalIntegracao";
// import SearchBar from "@/app/src/components/SearchBar"; // Não vamos mais usar
import PaginationControls from "@/app/src/components/PaginationControls";
import useGetIntegracao from "@/app/src/hooks/Integracao/useGetIntegracao";

export default function IntegracoesPage() {
  const router = useRouter();

  // Estados dos Inputs (Visuais)
  const [buscaDescricao, setBuscaDescricao] = useState("");
  const [buscaCnpj, setBuscaCnpj] = useState("");

  // Estados dos Filtros (Hook)
  const [filtroDescricao, setFiltroDescricao] = useState("");
  const [filtroCnpj, setFiltroCnpj] = useState("");

  const [paginaAtual, setPaginaAtual] = useState(1);
  const [porPagina, setPorPagina] = useState(20);

  const [isModalOpen, setIsModalOpen] = useState(false);

  // Hook recebe os estados de "filtro", não os de "busca" direta
  const { integracoes, loading, error, refetch } = useGetIntegracao({
    pagina: paginaAtual,
    porPagina: porPagina,
    descricao: filtroDescricao, // <--- Aqui
    cnpj: filtroCnpj, // <--- Aqui
    direction: "desc",
    orderBy: "codIntegracao",
  });

  const responseData = integracoes as any;

  const listaIntegracoes = responseData?.conteudo || [];
  const totalElementos = responseData?.qtdElementos || 0;
  const totalPaginas = responseData?.qtdPaginas || 1;

  const handleVerDetalhes = (id: number) => {
    router.push(`/painel/Integracoes/${id}`);
  };

  const handleNovaIntegracao = () => {
    setIsModalOpen(true);
  };

  const handleSuccessSave = () => {
    setIsModalOpen(false);
    refetch();
  };

  // Handler do Botão Buscar
  const handleSearch = () => {
    setPaginaAtual(1);
    setFiltroDescricao(buscaDescricao);
    setFiltroCnpj(buscaCnpj);
    // setTimeout para garantir que o react tenha atualizado o state antes do refetch manual
    // embora o hook tenha useEffect, isso força caso os parametros sejam iguais
    setTimeout(() => refetch(), 0);
  };

  return (
    <div className={styles.container}>
      <ModalIntegracao
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSaveSuccess={handleSuccessSave}
        initialData={null}
      />

      <h1 className={styles.title}>INTEGRAÇÕES</h1>

      {/* SEARCH CONTAINER COM 2 INPUTS */}
      <div className={styles.searchContainer}>
        <div
          style={{
            display: "flex",
            gap: "30px",
            flex: 1,
            alignItems: "flex-end",
          }}
        >
          {/* Input Descrição */}
          <div className={styles.inputWrapper}>
            <label
              style={{
                fontSize: "12px",
                color: "#666",
                marginBottom: "4px",
                display: "block",
              }}
            >
              Descrição
            </label>
            <input
              type="text"
              placeholder="Buscar por Descrição"
              value={buscaDescricao}
              onChange={(e) => setBuscaDescricao(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              style={{
                padding: "8px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                width: "100%",
              }}
            />
          </div>

          {/* Input CNPJ */}
          <div className={styles.inputWrapper}>
            <label
              style={{
                fontSize: "12px",
                color: "#666",
                marginBottom: "4px",
                display: "block",
              }}
            >
              CNPJ
            </label>
            <input
              type="text"
              placeholder="Buscar por CNPJ"
              value={buscaCnpj}
              onChange={(e) => setBuscaCnpj(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              style={{
                padding: "8px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                width: "100%",
              }}
            />
          </div>

          {/* Botão Buscar */}
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
          <button
            className={styles.primaryButton}
            onClick={handleNovaIntegracao}
          >
            Nova Integração <FiPlus size={18} />
          </button>
        </div>
      </div>

      <div className={styles.tableContainer}>
        {loading ? (
          <div style={{ padding: 20, textAlign: "center" }}>
            Carregando integrações...
          </div>
        ) : error ? (
          <div style={{ padding: 20, textAlign: "center", color: "red" }}>
            Erro ao carregar dados.
          </div>
        ) : (
          <>
            <div className={styles.tableScroll}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Descrição</th>
                    <th>CNPJ</th>
                    <th>Max. Empresas</th>
                    <th>Status</th>
                    <th className={styles.actionsCell}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {listaIntegracoes.map((item: any) => (
                    <tr key={item.codIntegracao}>
                      <td
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        <FiLink color="#1769e3" /> {item.descricao}
                      </td>

                      <td>{item.cnpj || item.responsavel?.login || "-"}</td>

                      <td>{item.maxEmpresas}</td>
                      <td>
                        <span
                          className={`${styles.statusBadge} ${
                            item.ativo
                              ? styles.statusCompleted
                              : styles.statusNotStarted
                          }`}
                        >
                          {item.ativo ? "ATIVO" : "INATIVO"}
                        </span>
                      </td>
                      <td className={styles.actionsCell}>
                        <div
                          style={{ display: "flex", justifyContent: "center" }}
                        >
                          <button
                            className={styles.btnDetails}
                            onClick={() =>
                              handleVerDetalhes(item.codIntegracao)
                            }
                          >
                            Ver detalhes
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {listaIntegracoes.length === 0 && (
                    <tr>
                      <td
                        colSpan={5}
                        style={{ textAlign: "center", padding: 20 }}
                      >
                        Nenhum registro encontrado.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <PaginationControls
              paginaAtual={paginaAtual}
              totalPaginas={totalPaginas}
              totalElementos={totalElementos}
              porPagina={porPagina}
              onPageChange={setPaginaAtual}
              onItemsPerPageChange={setPorPagina}
            />
          </>
        )}
      </div>
    </div>
  );
}
