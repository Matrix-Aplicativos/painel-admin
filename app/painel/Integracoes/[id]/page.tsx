"use client";

import styles from "../DetalhesIntegracao.module.css";
import tableStyles from "../../../src/components/Tabelas.module.css";
import {
  FiEdit2,
  FiTrash2,
  FiCheck,
  FiSearch,
  FiPlus,
  FiAlertCircle,
} from "react-icons/fi";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import PaginationControls from "@/app/src/components/PaginationControls";

const MOCK_EMPRESAS = [
  {
    id: 101,
    razao: "Razão Social da Empresa 1",
    cnpj: "09.346.601/0001-25",
    cidade: "Cuiabá, MT",
    bairro: "Jd. Cuiabá",
    status: true,
  },
  {
    id: 102,
    razao: "Razão Social da Empresa 2",
    cnpj: "09.346.601/0001-25",
    cidade: "Cuiabá, MT",
    bairro: "Goiabeiras",
    status: true,
  },
  {
    id: 103,
    razao: "Razão Social da Empresa 3",
    cnpj: "09.346.601/0001-25",
    cidade: "Cuiabá, MT",
    bairro: "Jd. Imperial",
    status: true,
  },
  {
    id: 104,
    razao: "Razão Social da Empresa 4",
    cnpj: "09.346.601/0001-25",
    cidade: "Cuiabá, MT",
    bairro: "Centro",
    status: true,
  },
];

export default function IntegrationDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id;
  const [empresas] = useState(MOCK_EMPRESAS);

  const [paginaAtual, setPaginaAtual] = useState(1);
  const [porPagina, setPorPagina] = useState(20);

  const handleVerDetalhesEmpresa = (empresaId: number) => {
    router.push(`/painel/Integracoes/${id}/Empresa`);
  };
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>DESCRIÇÃO DA INTEGRAÇÃO</h1>
        <span className={styles.statusBadge}>ATIVO</span>
      </div>

      <div className={styles.topGrid}>
        <div>
          <div className={styles.sectionTitle}>Dados de Cadastro</div>
          <div className={styles.formGroup}>
            <div className={styles.inputWrapper}>
              <label>Descrição</label>
              <input type="text" defaultValue="Descrição da Integração" />
            </div>

            <div className={styles.inputRow}>
              <div className={styles.inputWrapper}>
                <label>CNPJ</label>
                <input type="text" defaultValue="09.346.601/0001-25" />
              </div>
              <div
                className={styles.inputWrapper}
                style={{ maxWidth: "150px" }}
              >
                <label>Máximo de Empresas</label>
                <input type="number" defaultValue="5" />
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className={styles.sectionTitle}>Usuário Responsável</div>
          <div className={styles.formGroup}>
            <div className={styles.inputWrapper}>
              <label>Nome</label>
              <input
                type="text"
                defaultValue="Nome do Usuário"
                disabled
                style={{ backgroundColor: "#f9f9f9" }}
              />
            </div>

            <div className={styles.userActions}>
              <button className={`${styles.btn} ${styles.btnBlue}`}>
                Alterar Senha <FiEdit2 />
              </button>
              <button className={`${styles.btn} ${styles.btnRed}`}>
                Desativar <FiAlertCircle />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.mainActions}>
        <div className={styles.actionRow}>
          <button className={`${styles.btn} ${styles.btnBlue}`}>
            Editar <FiEdit2 />
          </button>
          <button className={`${styles.btn} ${styles.btnRed}`}>
            Excluir <FiTrash2 />
          </button>
        </div>
        <div className={styles.actionRow}>
          <button className={`${styles.btn} ${styles.btnGreen}`}>
            Salvar <FiCheck />
          </button>
          <button className={`${styles.btn} ${styles.btnRed}`}>
            Cancelar <FiTrash2 />
          </button>
        </div>
      </div>

      <div className={styles.companiesSection}>
        <div className={styles.sectionTitle}>Empresas</div>

        <div className={styles.filtersRow}>
          <div className={styles.inputWrapper}>
            <label>Razão Social</label>
            <input type="text" placeholder="Buscar por Razão Social" />
          </div>
          <div className={styles.inputWrapper}>
            <label>CNPJ</label>
            <input type="text" placeholder="Buscar por CNPJ" />
          </div>
          <div className={styles.inputWrapper}>
            <label>Cidade</label>
            <input type="text" placeholder="Buscar por Cidade" />
          </div>

          <button
            className={`${styles.btn} ${styles.btnBlue}`}
            style={{ marginLeft: "10px" }}
          >
            Buscar <FiSearch />
          </button>
          <button className={styles.primaryButton}>
            Novo <FiPlus size={18} />
          </button>
        </div>

        <div
          className={styles.innerTableContainer}
          style={{
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
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
                {empresas.map((emp) => (
                  <tr key={emp.id}>
                    <td>{emp.razao}</td>
                    <td>{emp.cnpj}</td>
                    <td>{emp.cidade}</td>
                    <td>{emp.bairro}</td>
                    <td>
                      <span
                        className={`${tableStyles.statusBadge} ${tableStyles.statusCompleted}`}
                      >
                        ATIVO
                      </span>
                    </td>
                    <td>
                      <button
                        className={tableStyles.btnDetails}
                        onClick={() => handleVerDetalhesEmpresa(emp.id)}
                      >
                        Ver detalhes
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
