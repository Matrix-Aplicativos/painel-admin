"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./NovoUsuario.module.css";
import tableStyles from "@/app/src/components/Tabelas.module.css";
import { FiCheck, FiPlus, FiTrash2, FiEye, FiSlash } from "react-icons/fi";
import ModalNovoCargo from "@/app/src/components/modals/ModalNovoCargo";
import ModalVincularEmpresa from "@/app/src/components/modals/ModalEmpresas";
import PaginationControls from "@/app/src/components/PaginationControls";

export default function NewUserPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    nome: "",
    login: "",
    email: "",
    senha: "",
    confirmSenha: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [empresasVinculadas, setEmpresasVinculadas] = useState<any[]>([]);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [porPagina, setPorPagina] = useState(10);

  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSaveRole = (cargo: string) => {
    console.log("Cargo criado:", cargo);
    setIsRoleModalOpen(false);
  };

  const handleVincularEmpresa = (empresa: any) => {
    if (!empresasVinculadas.find((e) => e.id === empresa.id)) {
      setEmpresasVinculadas([
        ...empresasVinculadas,
        { ...empresa, status: true },
      ]);
    }
    setIsCompanyModalOpen(false);
  };

  const handleRemoverEmpresa = (id: number) => {
    setEmpresasVinculadas(empresasVinculadas.filter((e) => e.id !== id));
  };

  const handleSalvarUsuario = () => {
    if (formData.senha !== formData.confirmSenha) {
      alert("As senhas não conferem!");
      return;
    }
    if (!formData.nome || !formData.login || !formData.senha) {
      alert("Preencha os campos obrigatórios!");
      return;
    }

    console.log("Salvando usuário:", {
      ...formData,
      empresas: empresasVinculadas,
    });

    router.push("/painel/Usuarios");
  };

  return (
    <div className={styles.container}>
      <ModalNovoCargo
        isOpen={isRoleModalOpen}
        onClose={() => setIsRoleModalOpen(false)}
        onSave={handleSaveRole}
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

      <div className={styles.sectionTitle}>Dados de Cadastro</div>
      <div className={styles.formGroup}>
        <div className={styles.inputRow}>
          <div className={styles.inputWrapper}>
            <label>Nome</label>
            <input
              name="nome"
              type="text"
              placeholder="Nome completo"
              value={formData.nome}
              onChange={handleInputChange}
            />
          </div>
          <div className={styles.inputWrapper}>
            <label>Login</label>
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

        <div className={styles.inputRow}>
          <div className={styles.inputWrapper}>
            <label>Senha</label>
            <div className={styles.inputWrapperRelative}>
              <input
                name="senha"
                type={showPassword ? "text" : "password"}
                placeholder="******"
                value={formData.senha}
                onChange={handleInputChange}
              />
              <div
                className={styles.eyeIcon}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FiSlash /> : <FiEye />}
              </div>
            </div>
          </div>

          <div className={styles.inputWrapper}>
            <label>Confirmar Senha</label>
            <div className={styles.inputWrapperRelative}>
              <input
                name="confirmSenha"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="******"
                value={formData.confirmSenha}
                onChange={handleInputChange}
              />
              <div
                className={styles.eyeIcon}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <FiSlash /> : <FiEye />}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.sectionTitle}>Cargos</div>
      <button
        className={styles.primaryButton}
        onClick={() => setIsRoleModalOpen(true)}
      >
        Novo <FiPlus size={16} />
      </button>

      <div className={styles.rolesGrid}>
        <div className={styles.roleColumn}>
          <div className={styles.roleHeader}>Movix</div>
          <label className={styles.checkboxItem}>
            <input type="checkbox" defaultChecked /> ROLE_MOVIX_GESTOR
          </label>
          <label className={styles.checkboxItem}>
            <input type="checkbox" /> ROLE_MOVIX_FUNCIONARIO
          </label>
          <label className={styles.checkboxItem}>
            <input type="checkbox" /> ROLE_MOVIX_INVENTARIOS
          </label>
          <label className={styles.checkboxItem}>
            <input type="checkbox" /> ROLE_MOVIX_TRANSFERENCIAS
          </label>
        </div>

        <div className={styles.roleColumn}>
          <div className={styles.roleHeader}>Força de Vendas</div>
          <label className={styles.checkboxItem}>
            <input type="checkbox" /> ROLE_FDV_GESTOR
          </label>
          <label className={styles.checkboxItem}>
            <input type="checkbox" /> ROLE_FDV_FUNCIONARIO
          </label>
        </div>

        <div className={styles.roleColumn}>
          <div className={styles.roleHeader}>Outros</div>
          <label className={styles.checkboxItem}>
            <input type="checkbox" /> ROLE_ADMIN
          </label>
        </div>
      </div>

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
                  empresasVinculadas.map((emp) => (
                    <tr key={emp.id}>
                      <td>{emp.razao}</td>
                      <td>{emp.cnpj}</td>
                      <td>{emp.cidade}</td>
                      <td>
                        <span
                          className={`${tableStyles.statusBadge} ${tableStyles.statusCompleted}`}
                        >
                          ATIVO
                        </span>
                      </td>
                      <td>
                        <button
                          className={
                            styles.btnTableAction + " " + styles.btnRemover
                          }
                          onClick={() => handleRemoverEmpresa(emp.id)}
                        >
                          Remover{" "}
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

      <div className={styles.footer}>
        <button
          className={styles.btnCancelBig}
          onClick={() => router.push("/painel/Usuarios")}
        >
          Cancelar
        </button>
        <button className={styles.btnSaveBig} onClick={handleSalvarUsuario}>
          Salvar <FiCheck size={20} />
        </button>
      </div>
    </div>
  );
}
