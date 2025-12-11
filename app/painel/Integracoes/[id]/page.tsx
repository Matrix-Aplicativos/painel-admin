"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
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
import styles from "../DetalhesIntegracao.module.css";
import tableStyles from "@/app/src/components/Tabelas.module.css";
import PaginationControls from "@/app/src/components/PaginationControls";
import ModalNovaEmpresa from "@/app/src/components/modals/ModalNovaEmpresa";
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

  //Declaração de todos os useStates
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [porPagina, setPorPagina] = useState(20);
  const [isNewCompanyModalOpen, setIsNewCompanyModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formDataIntegracao, setFormDataIntegracao] = useState({
    descricao: "",
    cnpj: "",
    maxEmpresas: 0,
    login: "",
    senha: "",
  });
  const [filtroRazao, setFiltroRazao] = useState("");
  const [filtroCnpj, setFiltroCnpj] = useState("");
  const [filtroCidade, setFiltroCidade] = useState("");
  const [queryRazao, setQueryRazao] = useState("");
  const [queryCnpj, setQueryCnpj] = useState("");
  const [queryCidade, setQueryCidade] = useState("");

  //Declaração de Funções e Lógica
  const {
    integracao,
    loading: loadingIntegracao,
    error: errorIntegracao,
    refetch: refetchIntegracao,
  } = useGetIntegracaoById(idIntegracao);

  const { deleteIntegracao, loading: loadingDelete } = useDeleteIntegracao();
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

  useEffect(() => {
    if (integracao) {
      setFormDataIntegracao({
        descricao: integracao.descricao || "",
        cnpj: integracao.responsavel?.login || "",
        maxEmpresas: integracao.maxEmpresas || 0,
        login: integracao.responsavel?.login || "",
        senha: "",
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
    const payload: IntegracaoPayload = {
      codIntegracao: idIntegracao,
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
      refetchIntegracao();
    }
  };

  // --- NOVA FUNÇÃO: Toggle Ativo/Inativo ---
  const handleToggleAtivo = async () => {
    if (!integracao) return;

    const novoStatus = !integracao.ativo;
    const acao = novoStatus ? "ativar" : "desativar";

    const confirmacao = window.confirm(
      `Deseja realmente ${acao} esta integração?`
    );

    if (confirmacao) {
      // Montamos o payload com os dados atuais, mas com o status invertido
      const payload: IntegracaoPayload = {
        codIntegracao: idIntegracao,
        descricao: integracao.descricao,
        // Atenção: Aqui usamos os dados originais da integração para não perder nada,
        // a não ser que você queira usar o formDataIntegracao (caso tenha editado algo sem salvar).
        // Por segurança, para apenas trocar o status, melhor usar os dados que já estão salvos (integracao).
        cnpj: integracao.responsavel?.login || "", // ou integracao.cnpj se existir
        maxEmpresas: integracao.maxEmpresas,
        usuario: {
          nomeUsuario: integracao.responsavel?.login,
          // Senha não precisa enviar se não mudou
        },
        ativo: novoStatus, // <--- O PULO DO GATO ESTÁ AQUI
      };

      const sucesso = await createIntegracao(payload);

      if (sucesso) {
        // alert(`Integração ${novoStatus ? "ativada" : "desativada"} com sucesso!`);
        refetchIntegracao();
      }
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

  const handleVerDetalhesEmpresa = (empresaId: number) => {
    router.push(`/painel/Integracoes/${idIntegracao}/Empresa/${empresaId}`);
  };

  const handleNovaEmpresa = () => setIsNewCompanyModalOpen(true);
  const handleEmpresaSalvaComSucesso = () => refetchEmpresas();

  //Declaração de Funções de renderização
  const renderHeader = () => (
    <div className={styles.header}>
      <h1 className={styles.title}>{integracao?.descricao?.toUpperCase()}</h1>
      <span
        className={`${styles.statusBadge} ${
          integracao?.ativo ? styles.statusCompleted : styles.statusPending
        }`}
        style={{
          backgroundColor: integracao?.ativo ? "#e6fffa" : "#fff5f5",
          color: integracao?.ativo ? "#2c7a7b" : "#c53030",
        }}
      >
        {integracao?.ativo ? "ATIVO" : "INATIVO"}
      </span>
    </div>
  );

  const renderDadosCadastro = () => (
    <div>
      <div className={styles.sectionTitle}>Dados de Cadastro</div>
      <div className={styles.formGroup}>
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

          <div className={styles.inputWrapper} style={{ maxWidth: "150px" }}>
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
  );

  const renderUsuarioResponsavel = () => (
    <div>
      <div className={styles.sectionTitle}>Usuário Responsável</div>
      <div className={styles.formGroup}>
        <div className={styles.inputWrapper}>
          <label>Nome</label>
          <input
            type="text"
            defaultValue={integracao?.responsavel?.nome || ""}
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
              onClick={() => setIsEditing(true)}
            >
              Alterar Senha <FiEdit2 />
            </button>

            {/* BOTÃO TOGGLE ATIVO/INATIVO */}
            <button
              className={`${styles.btn} ${
                integracao?.ativo ? styles.btnRed : styles.btnGreen
              }`}
              disabled={loadingDelete || loadingSave}
              onClick={handleToggleAtivo}
            >
              {integracao?.ativo ? "Desativar" : "Ativar"} <FiAlertCircle />
            </button>
          </div>
        )}
      </div>
    </div>
  );

  // ... (Resto do código: renderMainActions, renderCompaniesSection e return) ...
  // Mantive o resto igual pois só alteramos a lógica do botão e a função de toggle.

  const renderMainActions = () => (
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
  );

  const renderCompaniesSection = () => (
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
                        onClick={() => handleVerDetalhesEmpresa(emp.codEmpresa)}
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
  );

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

      {renderHeader()}

      <div className={styles.topGrid}>
        {renderDadosCadastro()}
        {renderUsuarioResponsavel()}
      </div>

      {renderMainActions()}
      {renderCompaniesSection()}
    </div>
  );
}
