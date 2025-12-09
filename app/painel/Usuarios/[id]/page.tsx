"use client";

import styles from "../DetalhesUsuario.module.css";
import tableStyles from "@/app/src/components/Tabelas.module.css";
import {
  FiEdit2,
  FiTrash2,
  FiCheck,
  FiAlertCircle,
  FiRefreshCw,
  FiPlus,
} from "react-icons/fi";
import { useParams } from "next/navigation";
import { useState } from "react";
import PaginationControls from "@/app/src/components/PaginationControls";

// Importar Modais
import ModalNovoCargo from "@/app/src/components/modals/ModalNovoCargo";

import ModalNovoFuncionario from "@/app/src/components/modals/ModalNovoFuncionario";
import ModalVincularEmpresa from "@/app/src/components/modals/ModalEmpresas";

const MOCK_EMPRESAS_USER = [
  {
    id: 1,
    razao: "Razão Social da Empresa 1",
    cnpj: "09.346.601/0001-25",
    cidade: "Cuiabá, MT",
    status: true,
  },
  {
    id: 2,
    razao: "Razão Social da Empresa 2",
    cnpj: "09.346.601/0001-25",
    cidade: "Cuiabá, MT",
    status: true,
  },
];

export default function UserDetailsPage() {
  const params = useParams();
  const id = params.id;
  const [empresas, setEmpresas] = useState(MOCK_EMPRESAS_USER);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [porPagina, setPorPagina] = useState(20);

  // Estados dos Modais
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);

  // Novo Estado para Funcionário
  const [isFuncionarioModalOpen, setIsFuncionarioModalOpen] = useState(false);
  const [selectedCompanyId, setSelectedCompanyId] = useState<number | string>(
    ""
  );

  // Handlers
  const handleSaveRole = (cargo: string) => {
    console.log("Novo cargo adicionado:", cargo);
    setIsRoleModalOpen(false);
  };

  const handleVincularEmpresa = (empresa: any) => {
    setEmpresas([...empresas, { ...empresa, status: true }]);
    setIsCompanyModalOpen(false);
  };

  // Handler para abrir modal de funcionário
  const handleOpenFuncionarioModal = (empresaId: number) => {
    setSelectedCompanyId(empresaId);
    setIsFuncionarioModalOpen(true);
  };

  const handleSaveFuncionario = (data: any) => {
    console.log("Funcionário Salvo:", data);
    setIsFuncionarioModalOpen(false);
  };

  return (
    <div className={styles.container}>
      {/* --- RENDERIZAR OS MODAIS --- */}
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

      <ModalNovoFuncionario
        isOpen={isFuncionarioModalOpen}
        onClose={() => setIsFuncionarioModalOpen(false)}
        onSave={handleSaveFuncionario}
        empresaId={selectedCompanyId}
      />

      {/* HEADER */}
      <div className={styles.header}>
        <div className={styles.titleArea}>
          <h1 className={styles.title}>NOME DO USUÁRIO</h1>
          <span className={styles.statusBadge}>ATIVO</span>
        </div>

        <div className={styles.headerButtons}>
          <div className={styles.buttonRow}>
            <button className={`${styles.btn} ${styles.btnBlue}`}>
              Editar <FiEdit2 />
            </button>
            <button className={`${styles.btn} ${styles.btnRed}`}>
              Excluir <FiTrash2 />
            </button>
          </div>
          <div className={styles.buttonRow}>
            <button className={`${styles.btn} ${styles.btnGreen}`}>
              Salvar <FiCheck />
            </button>
            <button className={`${styles.btn} ${styles.btnRed}`}>
              Cancelar <FiTrash2 />
            </button>
          </div>
        </div>
      </div>

      {/* DADOS CADASTRO */}
      <div className={styles.sectionTitle}>Dados de Cadastro</div>
      <div className={styles.formGroup}>
        <div className={styles.inputRow}>
          <div className={styles.inputWrapper}>
            <label>Nome</label>
            <input type="text" defaultValue="Nome do Usuário" />
          </div>
          <div className={styles.inputWrapper}>
            <label>Login</label>
            <input type="text" defaultValue="000.000.000-11" />
          </div>
        </div>

        <div className={styles.inputRow}>
          <div className={styles.inputWrapper}>
            <label>E-mail</label>
            <input type="email" defaultValue="email@exemplo.com" />
          </div>

          <div className={styles.userActionsRow}>
            <button
              className={`${styles.btn} ${styles.btnBlue}`}
              style={{ height: "38px" }}
            >
              Alterar Senha <FiRefreshCw />
            </button>
            <button
              className={`${styles.btn} ${styles.btnRed}`}
              style={{ height: "38px" }}
            >
              Desativar <FiAlertCircle />
            </button>
          </div>
        </div>
      </div>

      {/* CARGOS */}
      <div className={styles.sectionTitle}>Cargos</div>
      <button
        className={styles.primaryButton}
        onClick={() => setIsRoleModalOpen(true)}
      >
        Novo <FiPlus size={16} />
      </button>

      <div className={styles.rolesGrid}>
        {/* ... (mesmo conteúdo de cargos) ... */}
        <div className={styles.roleColumn}>
          <div className={styles.roleHeader}>Movix</div>
          <label className={styles.checkboxItem}>
            <input type="checkbox" defaultChecked /> ROLE_MOVIX_GESTOR
          </label>
          <label className={styles.checkboxItem}>
            <input type="checkbox" /> ROLE_MOVIX_FUNCIONARIO
          </label>
        </div>
        <div className={styles.roleColumn}>
          <div className={styles.roleHeader}>Força de Vendas</div>
          <label className={styles.checkboxItem}>
            <input type="checkbox" /> ROLE_FDV_GESTOR
          </label>
        </div>
        <div className={styles.roleColumn}>
          <div className={styles.roleHeader}>Outros</div>
          <label className={styles.checkboxItem}>
            <input type="checkbox" /> ROLE_ADMIN
          </label>
        </div>
      </div>

      {/* EMPRESAS */}
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
                {empresas.map((emp) => (
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
                      {/* BOTÃO CADASTRO DE FUNCIONÁRIO COM AÇÃO */}
                      <button
                        className={
                          styles.btnTableAction + " " + styles.btnFuncionario
                        }
                        onClick={() => handleOpenFuncionarioModal(emp.id)}
                      >
                        Cadastro de Funcionário
                      </button>

                      <button
                        className={
                          styles.btnTableAction + " " + styles.btnRemover
                        }
                      >
                        Remover
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <PaginationControls
            paginaAtual={paginaAtual}
            totalPaginas={1}
            totalElementos={empresas.length}
            porPagina={porPagina}
            onPageChange={setPaginaAtual}
            onItemsPerPageChange={setPorPagina}
          />
        </div>
      </div>
    </div>
  );
}
