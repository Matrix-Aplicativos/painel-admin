"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "@/app/src/components/Tabelas.module.css";
import { FiLink, FiPlus } from "react-icons/fi";
import ModalIntegracao from "@/app/src/components/modals/ModalIntegracao";
import SearchBar from "@/app/src/components/SearchBar";
import PaginationControls from "@/app/src/components/PaginationControls";
import useGetIntegracao from "@/app/src/hooks/Integracao/useGetIntegracao";

export default function IntegracoesPage() {
  const router = useRouter();
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [porPagina, setPorPagina] = useState(20);
  const [busca, setBusca] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);

  const { integracoes, loading, error, refetch } = useGetIntegracao({
    pagina: paginaAtual,
    porPagina: porPagina,
    descricao: busca,
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

  const handleSearch = (valor: string) => {
    setBusca(valor);
    setPaginaAtual(1);
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

      <div className={styles.searchContainer}>
        <SearchBar
          placeholder="Buscar Integração ou CNPJ"
          onSearch={handleSearch}
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

                      <td>{item.responsavel?.login || "-"}</td>

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
