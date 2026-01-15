"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  FiEdit2,
  FiTrash2,
  FiCheck,
  FiAlertCircle,
  FiRefreshCw,
  FiPlus,
  FiX,
  FiUserCheck,
  FiArrowLeft, // <--- Importado aqui
} from "react-icons/fi";
import styles from "../DetalhesUsuario.module.css";
import tableStyles from "@/app/src/components/Tabelas.module.css";
import PaginationControls from "@/app/src/components/PaginationControls";

// --- MODAIS ---
import ModalNovoCargo from "@/app/src/components/modals/ModalNovoCargo";
import ModalNovoFuncionario from "@/app/src/components/modals/ModalNovoFuncionario";
import ModalVincularEmpresa from "@/app/src/components/modals/ModalEmpresas";

// --- HOOKS E AXIOS ---
import useGetUsuarioById, {
  UsuarioDetalhe,
} from "@/app/src/hooks/Usuario/useGetUsuarioById";
import useDeleteUsuario from "@/app/src/hooks/Usuario/useDeleteUsuario";
import usePostUsuario from "@/app/src/hooks/Usuario/usePostUsuario";
import usePostResetarSenha from "@/app/src/hooks/Usuario/usePostResetarSenha";
import usePostUsuarioEmpresa from "@/app/src/hooks/Usuario/usePostUsuarioEmpresa";
import useDeleteUsuarioEmpresa from "@/app/src/hooks/Usuario/useDeleteUsuarioEmpresa";
import useGetCargo, { CargoItem } from "@/app/src/hooks/Cargo/useGetCargo";
import axiosInstance from "@/app/src/hooks/axiosInstance";

export default function UserDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);

  const { usuario, loading, error, refetch } = useGetUsuarioById(id);

  const {
    cargos,
    loading: loadingCargos,
    refetch: refetchCargos,
  } = useGetCargo({
    pagina: 1,
    porPagina: 100,
    direction: "asc",
    orderBy: "nome",
  });

  const { cargosMovix, cargosFdv, cargosOutros } = useMemo(() => {
    const movix: CargoItem[] = [];
    const fdv: CargoItem[] = [];
    const outros: CargoItem[] = [];
    const listaCargos = cargos || [];

    listaCargos.forEach((cargo) => {
      const nome = cargo.nome.toUpperCase();
      if (nome.includes("MOVIX")) {
        movix.push(cargo);
      } else if (nome.includes("FDV")) {
        fdv.push(cargo);
      } else {
        outros.push(cargo);
      }
    });

    return { cargosMovix: movix, cargosFdv: fdv, cargosOutros: outros };
  }, [cargos]);

  const { deleteUsuario, loading: loadingDelete } = useDeleteUsuario();
  const { createUsuario, loading: loadingSave } = usePostUsuario();
  const { resetarSenha, loading: loadingReset } = usePostResetarSenha();
  const { vincularUsuarioEmpresa, loading: loadingVincular } =
    usePostUsuarioEmpresa();
  const { desvincularUsuarioEmpresa, loading: loadingDesvincular } =
    useDeleteUsuarioEmpresa();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<UsuarioDetalhe>>({});
  const [selectedCargos, setSelectedCargos] = useState<number[]>([]);

  const [paginaAtual, setPaginaAtual] = useState(1);
  const [porPagina, setPorPagina] = useState(20);

  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
  const [isFuncionarioModalOpen, setIsFuncionarioModalOpen] = useState(false);

  const [showDecisionModal, setShowDecisionModal] = useState(false);
  const [tempFuncionario, setTempFuncionario] = useState<any>(null);

  const [selectedCompanyId, setSelectedCompanyId] = useState<number | string>(
    ""
  );
  const [existingFuncionario, setExistingFuncionario] = useState<any>(null);

  useEffect(() => {
    if (usuario) {
      setFormData({
        codUsuario: usuario.codUsuario,
        nome: usuario.nome,
        login: usuario.login,
        email: usuario.email,
        ativo: usuario.ativo,
      });

      if (usuario.cargos && Array.isArray(usuario.cargos)) {
        const cargosIds = usuario.cargos.map((c) => c.codCargo);
        setSelectedCargos(cargosIds);
      }
    }
  }, [usuario]);

  const handleInputChange = (field: keyof UsuarioDetalhe, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleEdit = () => setIsEditing(true);

  const handleCancelEdit = () => {
    setIsEditing(false);
    if (usuario) {
      setFormData(usuario);
      if (usuario.cargos) {
        setSelectedCargos(usuario.cargos.map((c) => c.codCargo));
      }
    }
  };

  const handleSaveEdit = async () => {
    const payload: any = {
      codUsuario: id,
      nome: formData.nome || "",
      email: formData.email || "",
      login: formData.login || "",
      primeiroAcesso: usuario?.primeiroAcesso || false,
      ativo: formData.ativo !== undefined ? formData.ativo : true,
      cargos: selectedCargos,
    };

    const sucesso = await createUsuario(payload);
    if (sucesso) {
      alert("Usuário atualizado com sucesso!");
      setIsEditing(false);
      refetch();
    }
  };

  const handleToggleAtivo = async () => {
    if (!usuario) return;
    const novoStatus = !usuario.ativo;
    const acao = novoStatus ? "ativar" : "desativar";

    if (confirm(`Deseja realmente ${acao} este usuário?`)) {
      const payload: any = {
        codUsuario: id,
        nome: usuario.nome,
        email: usuario.email,
        login: usuario.login,
        primeiroAcesso: usuario.primeiroAcesso,
        ativo: novoStatus,
        cargos: selectedCargos,
      };
      const sucesso = await createUsuario(payload);
      if (sucesso) refetch();
    }
  };

  const handleResetPassword = async () => {
    if (!usuario?.login) return;
    if (
      confirm(
        `Deseja resetar a senha? A nova senha será os 3 primeiros dígitos do login.`
      )
    ) {
      if (await resetarSenha(usuario.login))
        alert("Senha resetada com sucesso!");
    }
  };

  const handleDeleteUser = async () => {
    if (confirm("Deseja realmente excluir este usuário?")) {
      if (await deleteUsuario(id)) router.push("/painel/Usuarios");
    }
  };

  const handleToggleCargo = (codCargo: number) => {
    if (!isEditing) return;
    setSelectedCargos((prev) => {
      if (prev.includes(codCargo)) return prev.filter((id) => id !== codCargo);
      return [...prev, codCargo];
    });
  };

  const handleCargoSuccess = () => {
    setIsRoleModalOpen(false);
    refetchCargos();
  };

  const handleSelectCompany = async (empresa: any) => {
    setIsCompanyModalOpen(false);
    setSelectedCompanyId(empresa.codEmpresa);

    try {
      const response = await axiosInstance.get(
        `/usuario/funcionario/${id}/${empresa.codEmpresa}`
      );
      const funcionariosEncontrados = response.data;

      if (funcionariosEncontrados && funcionariosEncontrados.length > 0) {
        setTempFuncionario(funcionariosEncontrados[0]);
        setShowDecisionModal(true);
      } else {
        setExistingFuncionario(null);
        setIsFuncionarioModalOpen(true);
      }
    } catch (err) {
      console.error("Erro ao verificar funcionário:", err);
      setExistingFuncionario(null);
      setIsFuncionarioModalOpen(true);
    }
  };

  const handleProceedEdit = () => {
    setShowDecisionModal(false);
    setExistingFuncionario(tempFuncionario);
    setIsFuncionarioModalOpen(true);
  };
  const handleProceedKeep = async () => {
    setShowDecisionModal(false);

    const payload = {
      codUsuario: usuario?.codUsuario,
      codEmpresa: Number(selectedCompanyId),
      ativo: true,
      cadastroFuncionario: {
        codFuncionario: tempFuncionario.codFuncionario,
        codEmpresa: tempFuncionario.codEmpresa,
        codFuncionarioErp: tempFuncionario.codFuncionarioErp,
        nome: tempFuncionario.nome,
        cpf: tempFuncionario.cpf,
        email: tempFuncionario.email,
        ativo: true,
      },
    };

    const sucesso = await vincularUsuarioEmpresa(payload);

    if (sucesso) {
      alert("Vínculo realizado com sucesso!");
      refetch();
    }
  };

  const handleSaveFuncionario = async (dadosModal: any) => {
    const idEmpresaVinculo = Number(selectedCompanyId);

    const idEmpresaFuncionario = !isNaN(dadosModal.codEmpresa)
      ? Number(dadosModal.codEmpresa)
      : idEmpresaVinculo;

    const cpfLimpo = dadosModal.cpf ? dadosModal.cpf.replace(/\D/g, "") : "";

    if (!usuario || !idEmpresaVinculo) return;

    let cadastroPayload;

    if (existingFuncionario) {
      cadastroPayload = {
        codFuncionario: existingFuncionario.codFuncionario,
        codEmpresa: idEmpresaFuncionario,
        codFuncionarioErp: dadosModal.codErp,
        nome: dadosModal.nome,
        cpf: cpfLimpo, 
        email: dadosModal.email,
        ativo: true,
      };
    } else {
      cadastroPayload = {
        codFuncionario: null,
        codEmpresa: idEmpresaFuncionario,
        codFuncionarioErp: dadosModal.codErp,
        nome: dadosModal.nome,
        cpf: cpfLimpo, 
        email: dadosModal.email,
        ativo: true,
      };
    }

    const payload = {
      codUsuario: usuario.codUsuario,
      codEmpresa: idEmpresaVinculo,
      ativo: true,
      cadastroFuncionario: cadastroPayload,
    };

    const sucesso = await vincularUsuarioEmpresa(payload);

    if (sucesso) {
      alert("Operação realizada com sucesso!");
      setIsFuncionarioModalOpen(false);
      setExistingFuncionario(null);
      refetch();
    }
  };

  const handleUnlinkCompany = async (codEmpresa: number) => {
    if (confirm("Remover o vínculo com esta empresa?")) {
      if (await desvincularUsuarioEmpresa(id, codEmpresa)) refetch();
    }
  };

  if (loading)
    return (
      <div className={styles.container}>
        <p>Carregando dados...</p>
      </div>
    );
  if (error || !usuario)
    return (
      <div className={styles.container}>
        <p>Erro ao carregar usuário.</p>
      </div>
    );

  const listaEmpresas = usuario.empresas || [];
  const totalEmpresas = listaEmpresas.length;
  const empresasPaginadas = listaEmpresas.slice(
    (paginaAtual - 1) * porPagina,
    paginaAtual * porPagina
  );

  const renderCargoColumn = (lista: CargoItem[]) => {
    if (lista.length === 0)
      return (
        <p style={{ fontSize: "12px", color: "#999", fontStyle: "italic" }}>
          Nenhum cargo.
        </p>
      );
    return lista.map((cargo) => (
      <label key={cargo.codCargo} className={styles.checkboxItem}>
        <input
          type="checkbox"
          checked={selectedCargos.includes(cargo.codCargo)}
          onChange={() => handleToggleCargo(cargo.codCargo)}
          disabled={!isEditing}
        />
        {cargo.nome
          .replace("ROLE_", "")
          .replace("MOVIX_", "")
          .replace("FDV_", "")
          .replaceAll("_", " ")}
      </label>
    ));
  };

  return (
    <div className={styles.container}>
      <ModalNovoCargo
        isOpen={isRoleModalOpen}
        onClose={() => setIsRoleModalOpen(false)}
        onSuccess={handleCargoSuccess}
      />
      <ModalVincularEmpresa
        isOpen={isCompanyModalOpen}
        onClose={() => setIsCompanyModalOpen(false)}
        onVincular={handleSelectCompany}
      />
      <ModalNovoFuncionario
        isOpen={isFuncionarioModalOpen}
        onClose={() => setIsFuncionarioModalOpen(false)}
        onSave={handleSaveFuncionario}
        empresaId={selectedCompanyId}
        initialData={existingFuncionario}
      />

      {showDecisionModal && tempFuncionario && (
        <div
          className={styles.overlay}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            className={styles.modalContent}
            style={{
              backgroundColor: "white",
              padding: "25px",
              borderRadius: "8px",
              width: "400px",
              maxWidth: "90%",
              boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
            }}
          >
            <div style={{ textAlign: "center", marginBottom: "20px" }}>
              <FiUserCheck
                size={48}
                color="#007bff"
                style={{ marginBottom: "10px" }}
              />
              <h3
                style={{ fontSize: "18px", fontWeight: "bold", color: "#333" }}
              >
                Mensagem de Cadastro Encontrado
              </h3>
              <p style={{ color: "#666", marginTop: "10px" }}>
                Encontramos o funcionário{" "}
                <strong>{tempFuncionario.nome}</strong> vinculado a esta
                empresa. Deseja editar os dados ou usar o cadastro existente?
              </p>
            </div>

            <div
              style={{ display: "flex", gap: "10px", justifyContent: "center" }}
            >
              <button
                className={styles.btn}
                style={{
                  backgroundColor: "#17e381",
                  color: "white",
                  border: "none",
                  padding: "10px 20px",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
                onClick={handleProceedKeep}
              >
                Vincular sem editar
              </button>
              <button
                className={styles.btn}
                style={{
                  backgroundColor: "#007bff",
                  color: "white",
                  border: "none",
                  padding: "10px 20px",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
                onClick={handleProceedEdit}
              >
                Editar Cadastro
              </button>
            </div>

            <button
              onClick={() => setShowDecisionModal(false)}
              style={{
                marginTop: "15px",
                background: "none",
                border: "none",
                color: "#999",
                cursor: "pointer",
                width: "100%",
              }}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* HEADER */}
      <div className={styles.header}>
        <div className={styles.titleArea}>
          <div>
            <button
              onClick={() => router.push("/painel/Usuarios")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#000",
                fontSize: "14px",
                padding: "0",
              }}
              onMouseOver={(e) => (e.currentTarget.style.color = "#000")}
              onMouseOut={(e) => (e.currentTarget.style.color = "#000")}
            >
              <FiArrowLeft size={24} />
            </button>
          </div>
          <h1 className={styles.title}>{usuario.nome?.toUpperCase()}</h1>
          <span
            className={`${styles.statusBadge} ${
              usuario.ativo
                ? tableStyles.statusCompleted
                : tableStyles.statusNotStarted
            }`}
          >
            {usuario.ativo ? "ATIVO" : "INATIVO"}
          </span>
        </div>

        <div className={styles.headerButtons}>
          {!isEditing ? (
            <div className={styles.buttonRow}>
              <button
                className={`${styles.btn} ${styles.btnBlue}`}
                onClick={handleEdit}
                disabled={loadingDelete}
              >
                Editar <FiEdit2 />
              </button>
              <button
                className={`${styles.btn} ${styles.btnRed}`}
                onClick={handleDeleteUser}
                disabled={loadingDelete}
              >
                {loadingDelete ? "..." : "Excluir"} <FiTrash2 />
              </button>
            </div>
          ) : (
            <div className={styles.buttonRow}>
              <button
                className={`${styles.btn} ${styles.btnGreen}`}
                onClick={handleSaveEdit}
                disabled={loadingSave}
              >
                Salvar <FiCheck />
              </button>
              <button
                className={`${styles.btn} ${styles.btnRed}`}
                onClick={handleCancelEdit}
                disabled={loadingSave}
              >
                Cancelar <FiX />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* DADOS CADASTRO */}
      <div className={styles.sectionTitle}>Dados de Cadastro</div>
      <div className={styles.formGroup}>
        <div className={styles.inputRow}>
          <div className={styles.inputWrapper}>
            <label>Nome</label>
            <input
              type="text"
              value={formData.nome || ""}
              onChange={(e) => handleInputChange("nome", e.target.value)}
              disabled={!isEditing}
            />
          </div>
          <div className={styles.inputWrapper}>
            <label>Login</label>
            <input
              type="text"
              value={formData.login || ""}
              onChange={(e) => handleInputChange("login", e.target.value)}
              disabled={!isEditing}
            />
          </div>
        </div>

        <div className={styles.inputRow}>
          <div className={styles.inputWrapper}>
            <label>E-mail</label>
            <input
              type="email"
              value={formData.email || ""}
              onChange={(e) => handleInputChange("email", e.target.value)}
              disabled={!isEditing}
            />
          </div>

          <div className={styles.userActionsRow}>
            <button
              className={`${styles.btn} ${styles.btnBlue}`}
              style={{ height: "38px" }}
              disabled={isEditing || loadingReset}
              onClick={handleResetPassword}
            >
              Resetar Senha <FiRefreshCw />
            </button>
            <button
              className={`${styles.btn} ${
                usuario.ativo ? styles.btnRed : styles.btnGreen
              }`}
              style={{ height: "38px" }}
              disabled={isEditing || loadingSave}
              onClick={handleToggleAtivo}
            >
              {usuario.ativo ? "Desativar" : "Ativar"} <FiAlertCircle />
            </button>
          </div>
        </div>
      </div>

      <div>
        <div className={styles.sectionTitle}>Cargos</div>
        <button
          className={styles.primaryButton}
          onClick={() => setIsRoleModalOpen(true)}
          disabled={isEditing}
          style={{ width: "170px", display: "flex", justifyContent: "center" }}
        >
          Novo Cargo <FiPlus size={16} />
        </button>

        {loadingCargos ? (
          <p style={{ padding: "20px", color: "#666" }}>Carregando cargos...</p>
        ) : (
          <div className={styles.rolesGrid}>
            <div className={styles.roleColumn}>
              <div className={styles.roleHeader}>Movix</div>
              {renderCargoColumn(cargosMovix)}
            </div>
            <div className={styles.roleColumn}>
              <div className={styles.roleHeader}>Força de Vendas</div>
              {renderCargoColumn(cargosFdv)}
            </div>
            <div className={styles.roleColumn}>
              <div className={styles.roleHeader}>Outros</div>
              {renderCargoColumn(cargosOutros)}
            </div>
          </div>
        )}
      </div>

      {/* EMPRESAS */}
      <div className={styles.companiesSection}>
        <div className={styles.sectionTitle}>Empresas Vinculadas</div>
        <button
          className={styles.primaryButton}
          onClick={() => setIsCompanyModalOpen(true)}
          disabled={isEditing || loadingVincular}
          style={{ width: "170px", display: "flex", justifyContent: "center" }}
        >
          Vincular Empresa <FiPlus size={16} />
        </button>
        <div className={styles.innerTableContainer}>
          <div style={{ overflowX: "auto", width: "100%" }}>
            <table className={tableStyles.table}>
              <thead>
                <tr>
                  <th>Razão Social</th>
                  <th>CNPJ</th>
                  <th>Cidade</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {empresasPaginadas.map((emp) => (
                  <tr key={emp.codEmpresa}>
                    <td>{emp.razaoSocial}</td>
                    <td>{emp.cnpj}</td>
                    <td>
                      {emp.municipio?.nome} - {emp.municipio?.uf}
                    </td>
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
                    {/* CÉLULA COM OS BOTÕES REAJUSTADOS */}
                    <td
                      style={{
                        display: "flex",
                        gap: "8px",
                        alignItems: "center",
                      }}
                    >
                      <button
                        className={`${styles.btnTableAction} ${styles.btnFuncionario}`}
                        onClick={() => {
                          setSelectedCompanyId(emp.codEmpresa);
                          handleSelectCompany(emp);
                        }}
                        disabled={isEditing}
                        style={{
                          height: "32px",
                          fontSize: "13px",
                          fontWeight: "400",
                          borderRadius: "6px",
                          padding: "0 16px",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          whiteSpace: "nowrap",
                          cursor: isEditing ? "not-allowed" : "pointer",
                        }}
                      >
                        Cadastro de Funcionário
                      </button>
                      <button
                        className={`${styles.btnTableAction} ${styles.btnRemover}`}
                        onClick={() => handleUnlinkCompany(emp.codEmpresa)}
                        disabled={isEditing || loadingDesvincular}
                        style={{
                          height: "32px",
                          fontSize: "13px",
                          fontWeight: "400",
                          borderRadius: "6px",
                          padding: "0 16px",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor:
                            isEditing || loadingDesvincular
                              ? "not-allowed"
                              : "pointer",
                        }}
                      >
                        Remover
                      </button>
                    </td>
                  </tr>
                ))}
                {empresasPaginadas.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      style={{ textAlign: "center", padding: "20px" }}
                    >
                      Nenhuma empresa vinculada.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <PaginationControls
            paginaAtual={paginaAtual}
            totalPaginas={Math.ceil(totalEmpresas / porPagina) || 1}
            totalElementos={totalEmpresas}
            porPagina={porPagina}
            onPageChange={setPaginaAtual}
            onItemsPerPageChange={setPorPagina}
          />
        </div>
      </div>
    </div>
  );
}
