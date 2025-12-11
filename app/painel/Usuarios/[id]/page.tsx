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
} from "react-icons/fi";
import styles from "../DetalhesUsuario.module.css";
import tableStyles from "@/app/src/components/Tabelas.module.css";
import PaginationControls from "@/app/src/components/PaginationControls";
import ModalNovoCargo from "@/app/src/components/modals/ModalNovoCargo";
import ModalNovoFuncionario from "@/app/src/components/modals/ModalNovoFuncionario";
import ModalVincularEmpresa from "@/app/src/components/modals/ModalEmpresas";
import useGetUsuarioById, {
  UsuarioDetalhe,
} from "@/app/src/hooks/Usuario/useGetUsuarioById";
import useDeleteUsuario from "@/app/src/hooks/Usuario/useDeleteUsuario";
import usePostUsuario from "@/app/src/hooks/Usuario/usePostUsuario";
import usePostResetarSenha from "@/app/src/hooks/Usuario/usePostResetarSenha";
import useGetCargo, { CargoItem } from "@/app/src/hooks/Cargo/useGetCargo";

export default function UserDetailsPage() {
  //Declaração de todos os useStates
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<UsuarioDetalhe>>({});
  const [selectedCargos, setSelectedCargos] = useState<number[]>([]);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [porPagina, setPorPagina] = useState(20);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
  const [isFuncionarioModalOpen, setIsFuncionarioModalOpen] = useState(false);
  const [selectedCompanyId, setSelectedCompanyId] = useState<number | string>(
    ""
  );

  //Declaração de Funções e Lógica
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);

  const { usuario, loading, error, refetch } = useGetUsuarioById(id);
  const { deleteUsuario, loading: loadingDelete } = useDeleteUsuario();
  const { createUsuario, loading: loadingSave } = usePostUsuario();
  const { resetarSenha, loading: loadingReset } = usePostResetarSenha();

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

  useEffect(() => {
    if (usuario) {
      setFormData({
        codUsuario: usuario.codUsuario,
        nome: usuario.nome,
        login: usuario.login,
        email: usuario.email,
        ativo: usuario.ativo,
      });
    }
  }, [usuario]);

  const { cargosMovix, cargosFdv, cargosOutros } = useMemo(() => {
    const movix: CargoItem[] = [];
    const fdv: CargoItem[] = [];
    const outros: CargoItem[] = [];

    cargos.forEach((cargo) => {
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

  const handleEditar = () => {
    setIsEditing(true);
  };

  const handleCancelarEdicao = () => {
    setIsEditing(false);
    if (usuario) {
      setFormData({
        codUsuario: usuario.codUsuario,
        nome: usuario.nome,
        login: usuario.login,
        email: usuario.email,
        ativo: usuario.ativo,
      });
    }
  };

  const handleSalvarEdicao = async () => {
    const payload: any = {
      codUsuario: id,
      nome: formData.nome || "",
      email: formData.email || "",
      login: formData.login || "",
      primeiroAcesso: usuario?.primeiroAcesso || false,
      ativo: formData.ativo !== undefined ? formData.ativo : true,
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

    const confirmacao = window.confirm(
      `Deseja realmente ${acao} este usuário?`
    );

    if (confirmacao) {
      const payload: any = {
        codUsuario: id,
        nome: usuario.nome,
        email: usuario.email,
        login: usuario.login,
        primeiroAcesso: usuario.primeiroAcesso,
        ativo: novoStatus,
      };

      const sucesso = await createUsuario(payload);
      if (sucesso) {
        refetch();
      }
    }
  };

  const handleResetarSenha = async () => {
    if (!usuario?.login) return;

    const confirmacao = window.confirm(
      `Deseja resetar a senha do usuário ${usuario.login}? A nova senha será os 3 primeiros dígitos do login.`
    );

    if (confirmacao) {
      const sucesso = await resetarSenha(usuario.login);
      if (sucesso) {
        alert("Senha resetada com sucesso!");
      }
    }
  };

  const handleExcluir = async () => {
    const confirmacao = window.confirm(
      "Deseja realmente excluir este usuário? Esta ação não pode ser desfeita."
    );

    if (confirmacao) {
      const sucesso = await deleteUsuario(id);
      if (sucesso) {
        alert("Usuário excluído com sucesso!");
        router.push("/painel/Usuarios");
      }
    }
  };

  const handleInputChange = (field: keyof UsuarioDetalhe, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleToggleCargo = (codCargo: number) => {
    if (!isEditing) return;

    setSelectedCargos((prev) => {
      if (prev.includes(codCargo)) {
        return prev.filter((id) => id !== codCargo);
      } else {
        return [...prev, codCargo];
      }
    });
  };

  const handleCargoCreated = () => {
    setIsRoleModalOpen(false);
    refetchCargos();
  };

  const handleVincularEmpresa = (empresa: any) => {
    console.log("Vincular:", empresa);
    setIsCompanyModalOpen(false);
  };

  const handleOpenFuncionarioModal = (empresaId: number) => {
    setSelectedCompanyId(empresaId);
    setIsFuncionarioModalOpen(true);
  };

  const handleSaveFuncionario = (data: any) => {
    console.log("Funcionario Salvo:", data);
    setIsFuncionarioModalOpen(false);
  };

  const listaEmpresas = usuario?.empresas || [];
  const totalEmpresas = listaEmpresas.length;
  const empresasPaginadas = listaEmpresas.slice(
    (paginaAtual - 1) * porPagina,
    paginaAtual * porPagina
  );

  //Declaração de Funções de renderização
  const renderCargoList = (lista: CargoItem[]) => {
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

  const renderHeader = () => (
    <div className={styles.header}>
      <div className={styles.titleArea}>
        <h1 className={styles.title}>{usuario?.nome?.toUpperCase()}</h1>
        <span
          className={`${styles.statusBadge} ${
            usuario?.ativo
              ? tableStyles.statusCompleted
              : tableStyles.statusNotStarted
          }`}
        >
          {usuario?.ativo ? "ATIVO" : "INATIVO"}
        </span>
      </div>

      <div className={styles.headerButtons}>
        {!isEditing ? (
          <div className={styles.buttonRow}>
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
          <div className={styles.buttonRow}>
            <button
              className={`${styles.btn} ${styles.btnGreen}`}
              onClick={handleSalvarEdicao}
              disabled={loadingSave}
            >
              Salvar <FiCheck />
            </button>
            <button
              className={`${styles.btn} ${styles.btnRed}`}
              onClick={handleCancelarEdicao}
              disabled={loadingSave}
            >
              Cancelar <FiX />
            </button>
          </div>
        )}
      </div>
    </div>
  );

  const renderUserData = () => (
    <>
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
              onClick={handleResetarSenha}
            >
              Resetar Senha <FiRefreshCw />
            </button>

            <button
              className={`${styles.btn} ${
                usuario?.ativo ? styles.btnRed : styles.btnGreen
              }`}
              style={{ height: "38px" }}
              disabled={isEditing || loadingSave}
              onClick={handleToggleAtivo}
            >
              {usuario?.ativo ? "Desativar" : "Ativar"} <FiAlertCircle />
            </button>
          </div>
        </div>
      </div>
    </>
  );

  const renderRoles = () => (
    <>
      <div className={styles.sectionTitle}>Cargos</div>
      <button
        className={styles.primaryButton}
        onClick={() => setIsRoleModalOpen(true)}
        disabled={isEditing}
      >
        Novo <FiPlus size={16} />
      </button>

      {loadingCargos ? (
        <p style={{ padding: "20px", color: "#666" }}>Carregando cargos...</p>
      ) : (
        <div className={styles.rolesGrid}>
          <div className={styles.roleColumn}>
            <div className={styles.roleHeader}>Movix</div>
            {renderCargoList(cargosMovix)}
          </div>

          <div className={styles.roleColumn}>
            <div className={styles.roleHeader}>Força de Vendas</div>
            {renderCargoList(cargosFdv)}
          </div>

          <div className={styles.roleColumn}>
            <div className={styles.roleHeader}>Outros</div>
            {renderCargoList(cargosOutros)}
          </div>
        </div>
      )}
    </>
  );

  const renderCompanies = () => (
    <div className={styles.companiesSection}>
      <div className={styles.sectionTitle}>Empresas Vinculadas</div>
      <button
        className={styles.primaryButton}
        onClick={() => setIsCompanyModalOpen(true)}
        disabled={isEditing}
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
                  <td>
                    <button
                      className={`${styles.btnTableAction} ${styles.btnFuncionario}`}
                      onClick={() => handleOpenFuncionarioModal(emp.codEmpresa)}
                      disabled={isEditing}
                    >
                      Cadastro de Funcionário
                    </button>

                    <button
                      className={`${styles.btnTableAction} ${styles.btnRemover}`}
                      onClick={() => alert("Implementar desvínculo")}
                      disabled={isEditing}
                    >
                      Remover
                    </button>
                  </td>
                </tr>
              ))}
              {empresasPaginadas.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center" }}>
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
  );

  //Return
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

  return (
    <div className={styles.container}>
      <ModalNovoCargo
        isOpen={isRoleModalOpen}
        onClose={() => setIsRoleModalOpen(false)}
        onSuccess={handleCargoCreated}
      />
      <ModalVincularEmpresa
        isOpen={isCompanyModalOpen}
        onClose={() => setIsCompanyModalOpen(false)}
        onVincular={handleVincularEmpresa}
      />
      <ModalNovoFuncionario
        isOpen={isFuncionarioModalOpen}
        onClose={() => setIsFuncionarioModalOpen(false)}
        onSave={handleSaveFuncionario}
        empresaId={selectedCompanyId}
      />

      {renderHeader()}
      {renderUserData()}
      {renderRoles()}
      {renderCompanies()}
    </div>
  );
}
