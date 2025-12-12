"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { FiCheck, FiPlus, FiTrash2 } from "react-icons/fi";
import styles from "./NovoUsuario.module.css";
import tableStyles from "@/app/src/components/Tabelas.module.css";
import PaginationControls from "@/app/src/components/PaginationControls";
import ModalNovoCargo from "@/app/src/components/modals/ModalNovoCargo";
import ModalVincularEmpresa from "@/app/src/components/modals/ModalEmpresas";
import usePostUsuario from "@/app/src/hooks/Usuario/usePostUsuario";
import useGetCargo, { CargoItem } from "@/app/src/hooks/Cargo/useGetCargo";

export default function NewUserPage() {
  const router = useRouter();

  //Declaração de todos os useStates
  const [formData, setFormData] = useState({
    nome: "",
    login: "",
    email: "",
    // Senha removida do state inicial pois será gerada no submit
  });

  const [empresasVinculadas, setEmpresasVinculadas] = useState<any[]>([]);
  const [selectedCargos, setSelectedCargos] = useState<number[]>([]);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [porPagina, setPorPagina] = useState(10);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);

  //Declaração de Funções e Lógica
  const { createUsuario, loading: loadingSave } = usePostUsuario();

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleToggleCargo = (codCargo: number) => {
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
    const id = empresa.id || empresa.codEmpresa;
    if (!empresasVinculadas.find((e) => (e.id || e.codEmpresa) === id)) {
      setEmpresasVinculadas([
        ...empresasVinculadas,
        { ...empresa, status: true },
      ]);
    }
    setIsCompanyModalOpen(false);
  };

  const handleRemoverEmpresa = (id: number) => {
    setEmpresasVinculadas(
      empresasVinculadas.filter((e) => (e.id || e.codEmpresa) !== id)
    );
  };

  const handleSalvarUsuario = async () => {
    // Validação Básica
    if (!formData.nome || !formData.login) {
      alert("Preencha os campos obrigatórios (Nome e Login)!");
      return;
    }

    // Geração da Senha Automática (3 primeiros chars do login)
    const senhaGerada = formData.login.substring(0, 3);

    const payload: any = {
      codUsuario: null, // Alterado para null conforme solicitado
      nome: formData.nome,
      email: formData.email,
      login: formData.login,
      senha: senhaGerada, // Senha gerada automaticamente
      primeiroAcesso: true,
      ativo: true,
      cargos: selectedCargos,
      empresas: empresasVinculadas.map((e) => ({
        codEmpresa: e.codEmpresa || e.id,
      })),
    };

    const sucesso = await createUsuario(payload);

    if (sucesso) {
      alert("Usuário criado com sucesso!");
      router.push("/painel/Usuarios");
    }
  };

  //Declaração de Funções de renderização
  const renderCargoList = (lista: CargoItem[]) => {
    if (lista.length === 0)
      return (
        <p style={{ fontSize: "12px", color: "#ccc", fontStyle: "italic" }}>
          Nenhum cargo.
        </p>
      );
    return lista.map((cargo) => (
      <label key={cargo.codCargo} className={styles.checkboxItem}>
        <input
          type="checkbox"
          checked={selectedCargos.includes(cargo.codCargo)}
          onChange={() => handleToggleCargo(cargo.codCargo)}
        />
        {cargo.nome
          .replace("ROLE_", "")
          .replace("MOVIX_", "")
          .replace("FDV_", "")
          .replaceAll("_", " ")}
      </label>
    ));
  };

  const renderGeneralData = () => (
    <>
      <div className={styles.sectionTitle}>Dados de Cadastro</div>
      <div className={styles.formGroup}>
        <div className={styles.inputRow}>
          <div className={styles.inputWrapper}>
            <label>Nome *</label>
            <input
              name="nome"
              type="text"
              placeholder="Nome completo"
              value={formData.nome}
              onChange={handleInputChange}
            />
          </div>
          <div className={styles.inputWrapper}>
            <label>Login *</label>
            <input
              name="login"
              type="text"
              placeholder="Login de acesso"
              value={formData.login}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className={styles.inputRow}>
          <div className={styles.inputWrapper}>
            <label>E-mail</label>
            <input
              name="email"
              type="email"
              placeholder="email@exemplo.com"
              value={formData.email}
              onChange={handleInputChange}
            />
          </div>
        </div>

        {/* Aviso sobre a senha automática */}
        <p
          style={{
            fontSize: "12px",
            color: "#666",
            marginTop: "5px",
            fontStyle: "italic",
          }}
        >
          * A senha inicial será gerada automaticamente com os 3 primeiros
          dígitos do login.
        </p>
      </div>
    </>
  );

  const renderRolesSection = () => (
    <>
      <div className={styles.sectionTitle}>Cargos</div>
      <button
        className={styles.primaryButton}
        onClick={() => setIsRoleModalOpen(true)}
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

  const renderCompaniesSection = () => (
    <div className={styles.companiesSection}>
      <div className={styles.sectionTitle}>Empresas Vinculadas</div>
      <button
        className={styles.primaryButton}
        onClick={() => setIsCompanyModalOpen(true)}
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
              {empresasVinculadas.length > 0 ? (
                empresasVinculadas.map((emp, index) => (
                  <tr key={emp.id || index}>
                    <td>{emp.razao || emp.razaoSocial}</td>
                    <td>{emp.cnpj}</td>
                    <td>
                      {emp.cidade ||
                        (emp.municipio
                          ? `${emp.municipio.nome}-${emp.municipio.uf}`
                          : "-")}
                    </td>
                    <td>
                      <span
                        className={`${tableStyles.statusBadge} ${tableStyles.statusCompleted}`}
                      >
                        ATIVO
                      </span>
                    </td>
                    <td>
                      <button
                        className={`${styles.btnTableAction} ${styles.btnRemover}`}
                        onClick={() =>
                          handleRemoverEmpresa(emp.id || emp.codEmpresa)
                        }
                      >
                        Remover
                        <FiTrash2 size={12} style={{ marginLeft: 4 }} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    style={{
                      textAlign: "center",
                      padding: "20px",
                      color: "#999",
                    }}
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
          totalPaginas={1}
          totalElementos={empresasVinculadas.length}
          porPagina={porPagina}
          onPageChange={setPaginaAtual}
          onItemsPerPageChange={setPorPagina}
        />
      </div>
    </div>
  );

  //Return
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

      <div className={styles.header}>
        <div className={styles.titleArea}>
          <h1 className={styles.title}>NOVO USUÁRIO</h1>
        </div>
      </div>

      {renderGeneralData()}
      {renderRolesSection()}
      {renderCompaniesSection()}

      <div className={styles.footer}>
        <button
          className={styles.btnCancelBig}
          onClick={() => router.push("/painel/Usuarios")}
          disabled={loadingSave}
        >
          Cancelar
        </button>
        <button
          className={styles.btnSaveBig}
          onClick={handleSalvarUsuario}
          disabled={loadingSave}
        >
          {loadingSave ? "Salvando..." : "Salvar"} <FiCheck size={20} />
        </button>
      </div>
    </div>
  );
}
