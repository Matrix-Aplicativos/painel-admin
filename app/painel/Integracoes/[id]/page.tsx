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
  FiEye,
  FiSlash,
} from "react-icons/fi";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import PaginationControls from "@/app/src/components/PaginationControls";
import ModalNovaEmpresa from "@/app/src/components/modals/ModalNovaEmpresa";

// Hooks
import useGetIntegracaoById from "@/app/src/hooks/Integracao/useGetIntegracaoById";
import useGetEmpresa from "@/app/src/hooks/Empresa/useGetEmpresa";
import useDeleteIntegracao from "@/app/src/hooks/Integracao/useDeleteIntegracao";
import usePostIntegracao, {
  IntegracaoPayload,
} from "@/app/src/hooks/Integracao/usePostIntegracao";

export default function IntegrationDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const idIntegracao = Number(params.id);

  // --- Estados de Paginação ---
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [porPagina, setPorPagina] = useState(20);

  // --- Estados de Controle Visual ---
  const [isNewCompanyModalOpen, setIsNewCompanyModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // --- Estado do Formulário (Dados para Edição) ---
  const [formDataIntegracao, setFormDataIntegracao] = useState({
    descricao: "",
    cnpj: "",
    maxEmpresas: 0,
    login: "",
    senha: "", // Opcional, apenas se for editar
  });

  // --- Estados de Filtro (Empresas) ---
  const [filtroRazao, setFiltroRazao] = useState("");
  const [filtroCnpj, setFiltroCnpj] = useState("");
  const [filtroCidade, setFiltroCidade] = useState("");
  const [queryRazao, setQueryRazao] = useState("");
  const [queryCnpj, setQueryCnpj] = useState("");
  const [queryCidade, setQueryCidade] = useState("");

  // --- HOOKS ---
  const {
    integracao,
    loading: loadingIntegracao,
    error: errorIntegracao,
    refetch: refetchIntegracao, // Importante para atualizar após salvar
  } = useGetIntegracaoById(idIntegracao);

  const { deleteIntegracao, loading: loadingDelete } = useDeleteIntegracao();

  // Hook de Salvar/Editar
  const { createIntegracao, loading: loadingSave } = usePostIntegracao();

  const {
    empresas,
    pagination,
    loading: loadingEmpresas,
    refetch: refetchEmpresas,
  } = useGetEmpresa({
    codIntegracao: idIntegracao,
    pagina: paginaAtual,
    porPagina: porPagina,
    razaoSocial: queryRazao,
    cnpj: queryCnpj,
    cidade: queryCidade,
  });

  // --- Efeito: Carregar dados no Form ---
  useEffect(() => {
    if (integracao) {
      setFormDataIntegracao({
        descricao: integracao.descricao || "",
        cnpj: integracao.responsavel?.login || "",
        maxEmpresas: integracao.maxEmpresas || 0,
        login: integracao.responsavel?.login || "",
        senha: "", // Senha vem vazia
      });
    }
  }, [integracao]);

  const handleBuscarEmpresas = () => {
    setPaginaAtual(1);
    setQueryRazao(filtroRazao);
    setQueryCnpj(filtroCnpj);
    setQueryCidade(filtroCidade);
    setTimeout(() => refetchEmpresas(), 0);
  };

  const handleEditar = () => {
    setIsEditing(true);
  };

  const handleCancelarEdicao = () => {
    setIsEditing(false);
    setShowPassword(false);
    // Reseta form para os dados originais do GET
    if (integracao) {
      setFormDataIntegracao({
        descricao: integracao.descricao || "",
        cnpj: integracao.responsavel?.login || "",
        maxEmpresas: integracao.maxEmpresas || 0,
        login: integracao.responsavel?.login || "",
        senha: "",
      });
    }
  };

  const handleSalvarEdicao = async () => {
    // Monta o Payload conforme a interface IntegracaoPayload
    const payload: IntegracaoPayload = {
      codIntegracao: idIntegracao, // ID para indicar edição
      descricao: formDataIntegracao.descricao,
      cnpj: formDataIntegracao.cnpj,
      maxEmpresas: formDataIntegracao.maxEmpresas,
      usuario: {
        nomeUsuario: formDataIntegracao.login,
        senha: formDataIntegracao.senha || undefined,
      },
      ativo: integracao?.ativo ?? true,
    };

    const sucesso = await createIntegracao(payload);

    if (sucesso) {
      alert("Integração salva com sucesso!");
      setIsEditing(false);
      refetchIntegracao(); // Atualiza os dados na tela
    }
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

  // Funções de Empresa
  const handleVerDetalhesEmpresa = (empresaId: number) => {
    router.push(`/painel/Integracoes/${idIntegracao}/Empresa/${empresaId}`);
  };
  const handleNovaEmpresa = () => setIsNewCompanyModalOpen(true);
  const handleEmpresaSalvaComSucesso = () => refetchEmpresas();

  // --- Renderização ---

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
            {/* DESCRIÇÃO */}
            <div className={styles.inputWrapper}>
              <label>Descrição</label>
              <input
                type="text"
                value={formDataIntegracao.descricao}
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
              {/* CNPJ */}
              <div className={styles.inputWrapper}>
                <label>CNPJ</label>
                <input
                  type="text"
                  value={formDataIntegracao.cnpj}
                  disabled={!isEditing}
                  onChange={(e) =>
                    setFormDataIntegracao({
                      ...formDataIntegracao,
                      cnpj: e.target.value,
                    })
                  }
                />
              </div>

              {/* MAX EMPRESAS */}
              <div
                className={styles.inputWrapper}
                style={{ maxWidth: "150px" }}
              >
                <label>Max. Empresas</label>
                <input
                  type="number"
                  value={formDataIntegracao.maxEmpresas}
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
            {/* NOME (APENAS LEITURA - Vem do GET) */}
            <div className={styles.inputWrapper}>
              <label>Nome</label>
              <input
                type="text"
                defaultValue={integracao.responsavel?.nome || ""}
                disabled
                style={{ backgroundColor: "#f9f9f9" }}
              />
            </div>

            {isEditing && (
              <div className={styles.inputWrapper}>
                <label>Nova Senha (Opcional)</label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Deixe em branco para manter"
                    value={formDataIntegracao.senha}
                    onChange={(e) =>
                      setFormDataIntegracao({
                        ...formDataIntegracao,
                        senha: e.target.value,
                      })
                    }
                    style={{ width: "95%" }}
                  />
                  <div
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: "absolute",
                      right: 10,
                      top: "50%",
                      transform: "translateY(-50%)",
                      cursor: "pointer",
                      color: "#666",
                    }}
                  >
                    {showPassword ? <FiSlash /> : <FiEye />}
                  </div>
                </div>
              </div>
            )}

            {!isEditing && (
              <div className={styles.userActions}>
                <button
                  className={`${styles.btn} ${styles.btnBlue}`}
                  disabled={loadingDelete}
                  onClick={() => {
                    setIsEditing(true);
                  }}
                >
                  Alterar Senha <FiEdit2 />
                </button>
                <button
                  className={`${styles.btn} ${styles.btnRed}`}
                  disabled={loadingDelete}
                >
                  {integracao.responsavel?.ativo ? "Desativar" : "Ativar"}{" "}
                  <FiAlertCircle />
                </button>
              </div>
            )}
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
              disabled={loadingSave}
            >
              {loadingSave ? "Salvando..." : "Salvar"} <FiCheck />
            </button>
            <button
              className={`${styles.btn} ${styles.btnRed}`}
              onClick={handleCancelarEdicao}
              disabled={loadingSave}
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
              onKeyDown={(e) => e.key === "Enter" && handleBuscarEmpresas()}
            />
          </div>
          <div className={styles.inputWrapper}>
            <label>CNPJ</label>
            <input
              type="text"
              placeholder="Buscar por CNPJ"
              value={filtroCnpj}
              onChange={(e) => setFiltroCnpj(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleBuscarEmpresas()}
            />
          </div>
          <div className={styles.inputWrapper}>
            <label>Cidade</label>
            <input
              type="text"
              placeholder="Buscar por Cidade"
              value={filtroCidade}
              onChange={(e) => setFiltroCidade(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleBuscarEmpresas()}
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
