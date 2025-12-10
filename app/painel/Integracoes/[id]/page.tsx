"use client";

import styles from "../DetalhesIntegracao.module.css";
import tableStyles from "@/app/src/components/Tabelas.module.css";
import {
  FiEdit2,
  FiTrash2,
  FiCheck,
  FiSearch,
  FiPlus,
  FiAlertCircle,
  FiX,
} from "react-icons/fi";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import PaginationControls from "@/app/src/components/PaginationControls";
import ModalNovaEmpresa from "@/app/src/components/modals/ModalNovaEmpresa";
import useGetIntegracaoById from "@/app/src/hooks/Integracao/useGetIntegracaoById";
import useGetEmpresa from "@/app/src/hooks/Empresa/useGetEmpresa";
import useDeleteIntegracao from "@/app/src/hooks/Integracao/useDeleteIntegracao";

export default function IntegrationDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const idIntegracao = Number(params.id);

  const [paginaAtual, setPaginaAtual] = useState(1);
  const [porPagina, setPorPagina] = useState(20);
  const [isNewCompanyModalOpen, setIsNewCompanyModalOpen] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [formDataIntegracao, setFormDataIntegracao] = useState<any>({});

  const [filtroRazao, setFiltroRazao] = useState("");
  const [filtroCnpj, setFiltroCnpj] = useState("");
  const [filtroCidade, setFiltroCidade] = useState("");

  const {
    integracao,
    loading: loadingIntegracao,
    error: errorIntegracao,
  } = useGetIntegracaoById(idIntegracao);

  const { deleteIntegracao, loading: loadingDelete } = useDeleteIntegracao();

  const {
    empresas,
    pagination,
    loading: loadingEmpresas,
    refetch: refetchEmpresas,
  } = useGetEmpresa({
    codIntegracao: idIntegracao,
    pagina: paginaAtual,
    porPagina: porPagina,
    razaoSocial: filtroRazao,
    cnpj: filtroCnpj,
    cidade: filtroCidade,
  });

  useEffect(() => {
    if (integracao) {
      setFormDataIntegracao({
        descricao: integracao.descricao,
        maxEmpresas: integracao.maxEmpresas,
      });
    }
  }, [integracao]);

  const handleVerDetalhesEmpresa = (empresaId: number) => {
    router.push(`/painel/Integracoes/${idIntegracao}/Empresa/${empresaId}`);
  };

  const handleNovaEmpresa = () => {
    setIsNewCompanyModalOpen(true);
  };
  const handleEmpresaSalvaComSucesso = () => {
    refetchEmpresas(); 
  };

  const handleBuscarEmpresas = () => {
    setPaginaAtual(1);
    refetchEmpresas();
  };

  const handleEditar = () => {
    setIsEditing(true);
  };

  const handleCancelarEdicao = () => {
    setIsEditing(false);
    if (integracao) {
      setFormDataIntegracao({
        descricao: integracao.descricao,
        maxEmpresas: integracao.maxEmpresas,
      });
    }
  };

  const handleSalvarEdicao = () => {
    console.log("Salvar Edição Integração:", formDataIntegracao);
    setIsEditing(false);
  };

  const handleExcluir = async () => {
    const confirmacao = window.confirm(
      "Deseja realmente excluir esta integração? Todas as empresas vinculadas podem ser afetadas."
    );

    if (confirmacao) {
      const sucesso = await deleteIntegracao(idIntegracao);
      if (sucesso) {
        alert("Integração excluída com sucesso!");
        router.push("/painel/Integracoes");
      }
    }
  };

  if (loadingIntegracao)
    return (
      <div className={styles.container}>
        <p>Carregando detalhes...</p>
      </div>
    );
  if (errorIntegracao || !integracao)
    return (
      <div className={styles.container}>
        <p>Erro ao carregar integração.</p>
      </div>
    );

  return (
    <div className={styles.container}>
      <ModalNovaEmpresa
        isOpen={isNewCompanyModalOpen}
        onClose={() => setIsNewCompanyModalOpen(false)}
        codIntegracao={idIntegracao}
        onSuccess={handleEmpresaSalvaComSucesso}
      />

      <div className={styles.header}>
        <h1 className={styles.title}>{integracao.descricao?.toUpperCase()}</h1>
        <span
          className={`${styles.statusBadge} ${
            integracao.ativo ? styles.statusCompleted : styles.statusPending
          }`}
          style={{
            backgroundColor: integracao.ativo ? "#e6fffa" : "#fff5f5",
            color: integracao.ativo ? "#2c7a7b" : "#c53030",
          }}
        >
          {integracao.ativo ? "ATIVO" : "INATIVO"}
        </span>
      </div>

      <div className={styles.topGrid}>
        <div>
          <div className={styles.sectionTitle}>Dados de Cadastro</div>
          <div className={styles.formGroup}>
            <div className={styles.inputWrapper}>
              <label>Descrição</label>
              <input
                type="text"
                value={formDataIntegracao.descricao || ""}
                disabled={!isEditing}
                onChange={(e) =>
                  setFormDataIntegracao({
                    ...formDataIntegracao,
                    descricao: e.target.value,
                  })
                }
              />
            </div>

            <div className={styles.inputRow}>
              <div className={styles.inputWrapper}>
                <label>CNPJ</label>
                <input
                  type="text"
                  defaultValue={integracao.cnpj || ""}
                  disabled
                />
              </div>
              <div
                className={styles.inputWrapper}
                style={{ maxWidth: "150px" }}
              >
                <label>Max. Empresas</label>
                <input
                  type="number"
                  value={formDataIntegracao.maxEmpresas || 0}
                  disabled={!isEditing}
                  onChange={(e) =>
                    setFormDataIntegracao({
                      ...formDataIntegracao,
                      maxEmpresas: Number(e.target.value),
                    })
                  }
                />
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className={styles.sectionTitle}>Usuário Responsável</div>
          <div className={styles.formGroup}>
            <div className={styles.inputWrapper}>
              <label>Login / Nome</label>
              <input
                type="text"
                defaultValue={
                  integracao.responsavel?.login || integracao.responsavel?.nome
                }
                disabled
                style={{ backgroundColor: "#f9f9f9" }}
              />
            </div>
            <div className={styles.userActions}>
              <button
                className={`${styles.btn} ${styles.btnBlue}`}
                disabled={loadingDelete || isEditing}
              >
                Alterar Senha <FiEdit2 />
              </button>
              <button
                className={`${styles.btn} ${styles.btnRed}`}
                disabled={loadingDelete || isEditing}
              >
                {integracao.responsavel?.ativo ? "Desativar" : "Ativar"}{" "}
                <FiAlertCircle />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.mainActions}>
        {!isEditing ? (
          <div className={styles.actionRow}>
            <button
              className={`${styles.btn} ${styles.btnBlue}`}
              onClick={handleEditar}
              disabled={loadingDelete}
            >
              Editar <FiEdit2 />
            </button>
            <button
              className={`${styles.btn} ${styles.btnRed}`}
              onClick={handleExcluir}
              disabled={loadingDelete}
            >
              {loadingDelete ? "Excluindo..." : "Excluir"} <FiTrash2 />
            </button>
          </div>
        ) : (
          <div className={styles.actionRow}>
            <button
              className={`${styles.btn} ${styles.btnGreen}`}
              onClick={handleSalvarEdicao}
            >
              Salvar <FiCheck />
            </button>
            <button
              className={`${styles.btn} ${styles.btnRed}`}
              onClick={handleCancelarEdicao}
            >
              Voltar <FiX />
            </button>
          </div>
        )}
      </div>

      <div className={styles.companiesSection}>
        <div className={styles.sectionTitle}>Empresas Vinculadas</div>

        <div className={styles.filtersRow}>
          <div className={styles.inputWrapper}>
            <label>Razão Social</label>
            <input
              type="text"
              placeholder="Buscar por Razão"
              value={filtroRazao}
              onChange={(e) => setFiltroRazao(e.target.value)}
            />
          </div>
          <div className={styles.inputWrapper}>
            <label>CNPJ</label>
            <input
              type="text"
              placeholder="Buscar por CNPJ"
              value={filtroCnpj}
              onChange={(e) => setFiltroCnpj(e.target.value)}
            />
          </div>
          <div className={styles.inputWrapper}>
            <label>Cidade</label>
            <input
              type="text"
              placeholder="Buscar por Cidade"
              value={filtroCidade}
              onChange={(e) => setFiltroCidade(e.target.value)}
            />
          </div>

          <button
            className={`${styles.btn} ${styles.btnBlue}`}
            style={{ marginLeft: "10px" }}
            onClick={handleBuscarEmpresas}
          >
            Buscar <FiSearch />
          </button>
          <button
            className={tableStyles.primaryButton}
            onClick={handleNovaEmpresa}
          >
            Novo <FiPlus size={18} />
          </button>
        </div>

        <div
          className={styles.innerTableContainer}
          style={{ display: "flex", flexDirection: "column" }}
        >
          <div style={{ overflowX: "auto", width: "100%", flexGrow: 1 }}>
            <table className={tableStyles.table}>
              <thead>
                <tr>
                  <th>Razão Social</th>
                  <th>CNPJ</th>
                  <th>Cidade</th>
                  <th>Bairro</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {loadingEmpresas && (
                  <tr>
                    <td colSpan={6} style={{ textAlign: "center" }}>
                      Carregando empresas...
                    </td>
                  </tr>
                )}
                {!loadingEmpresas &&
                  empresas.map((emp) => (
                    <tr key={emp.codEmpresa}>
                      <td>{emp.razaoSocial}</td>
                      <td>{emp.cnpj}</td>
                      <td>
                        {emp.municipio?.nome} - {emp.municipio?.uf}
                      </td>
                      <td>{emp.bairro}</td>
                      <td>
                        <span
                          className={`${tableStyles.statusBadge} ${
                            emp.ativo
                              ? tableStyles.statusCompleted
                              : tableStyles.statusNotStarted
                          }`}
                        >
                          {emp.ativo ? "ATIVO" : "INATIVO"}
                        </span>
                      </td>
                      <td>
                        <button
                          className={tableStyles.btnDetails}
                          onClick={() =>
                            handleVerDetalhesEmpresa(emp.codEmpresa)
                          }
                        >
                          Ver detalhes
                        </button>
                      </td>
                    </tr>
                  ))}
                {!loadingEmpresas && empresas.length === 0 && (
                  <tr>
                    <td colSpan={6} style={{ textAlign: "center" }}>
                      Nenhuma empresa encontrada.
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
        </div>
      </div>
    </div>
  );
}
