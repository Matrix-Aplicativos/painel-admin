"use client";

import styles from "./DetalhesEmpresa.module.css";
import tableStyles from "../../../../src/components/Tabelas.module.css";
import {
  FiEdit2,
  FiTrash2,
  FiCheck,
  FiX,
  FiSearch,
  FiPlus,
} from "react-icons/fi";
import { useParams } from "next/navigation";
import { useState } from "react";
import PaginationControls from "@/app/src/components/PaginationControls";

const MOCK_CONFIGS = [
  { id: 1, cod: 1, descricao: "descricao-da-config", valor: "S", status: true },
  {
    id: 2,
    cod: 2,
    descricao: "descricao-da-config-2",
    valor: "123",
    status: true,
  },
  {
    id: 3,
    cod: 3,
    descricao: "descricao-da-config-3",
    valor: "Exemplo",
    status: true,
  },
];

export default function CompanyDetailsPage() {
  const [configs] = useState(MOCK_CONFIGS);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [porPagina, setPorPagina] = useState(10);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleArea}>
          <h1 className={styles.title}>RAZÃO SOCIAL DA EMPRESA</h1>
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
              Cancelar <FiX />
            </button>
          </div>
        </div>
      </div>

      <div className={styles.sectionTitle}>Dados de Cadastro</div>
      <div className={styles.formGroup}>
        <div className={styles.inputRow}>
          <div className={styles.inputWrapper}>
            <label>Razão Social</label>
            <input type="text" defaultValue="Razão Social da Empresa" />
          </div>
          <div className={styles.inputWrapper}>
            <label>Nome Fantasia</label>
            <input type="text" defaultValue="Nome Fantasia da Empresa" />
          </div>
        </div>

        <div className={styles.inputRow}>
          <div className={styles.inputWrapper}>
            <label>CNPJ</label>
            <input type="text" defaultValue="09.346.601/0001-25" />
          </div>
          <div className={styles.inputWrapper}>
            <label>Cidade</label>
            <input type="text" defaultValue="Cuiabá, MT" />
          </div>
          <div className={styles.inputWrapper}>
            <label>Bairro</label>
            <input type="text" defaultValue="Jardim Cuiabá" />
          </div>
        </div>

        <div className={styles.togglesRow}>
          <div className={styles.toggleContainer}>
            <span className={styles.toggleLabel}>Movix</span>
            <label className={styles.switch}>
              <input type="checkbox" defaultChecked />
              <span className={styles.slider}></span>
            </label>
          </div>
          <div className={styles.toggleContainer}>
            <span className={styles.toggleLabel}>Força de Vendas</span>
            <label className={styles.switch}>
              <input type="checkbox" />
              <span className={styles.slider}></span>
            </label>
          </div>
        </div>
      </div>

      <div className={styles.sectionTitle}>MOVIX</div>
      <div className={styles.formGroup}>
        <div className={styles.inputRow}>
          <div className={styles.inputWrapper} style={{ maxWidth: "150px" }}>
            <label>Máx. Dispositivos</label>
            <input type="number" defaultValue="10" />
          </div>
          <div className={styles.inputWrapper} style={{ maxWidth: "150px" }}>
            <label>Máx. Dispositivos Multi</label>
            <input type="number" defaultValue="10" />
          </div>
          <div className={styles.inputWrapper} style={{ maxWidth: "150px" }}>
            <label>Validade Licença</label>
            <input type="text" defaultValue="10/10/2025" />
          </div>
        </div>
      </div>

      <div className={styles.configSection}>
        <div className={styles.sectionTitle}>Configurações</div>

        <div style={{ marginBottom: "15px" }}>
          <button className={styles.primaryButton}>
            Novo <FiPlus size={18} />
          </button>

          <div className={styles.configFilters}>
            <div className={styles.inputWrapper} style={{ maxWidth: "150px" }}>
              <label>Cód. Configuração</label>
              <input type="text" placeholder="Buscar pelo Código" />
            </div>
            <div className={styles.inputWrapper} style={{ maxWidth: "250px" }}>
              <label>Descrição</label>
              <input type="text" placeholder="Buscar pela Descrição" />
            </div>
            <button className={`${styles.btn} ${styles.btnBlue}`}>
              Buscar <FiSearch />
            </button>
          </div>
        </div>

        <div className={styles.innerTableContainer}>
          <table className={tableStyles.table}>
            <thead>
              <tr>
                <th>Cod. Configuração</th>
                <th>Descrição</th>
                <th>Valor</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {configs.map((conf) => (
                <tr key={conf.id}>
                  <td>{conf.cod}</td>
                  <td>{conf.descricao}</td>
                  <td>{conf.valor}</td>
                  <td>
                    <span
                      className={`${tableStyles.statusBadge} ${tableStyles.statusCompleted}`}
                    >
                      ATIVO
                    </span>
                  </td>
                  <td>
                    <button
                      className={`${styles.btn} ${styles.btnBlue}`}
                      style={{ padding: "6px 12px", minWidth: "auto" }}
                    >
                      Editar
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
          totalElementos={configs.length}
          porPagina={porPagina}
          onPageChange={setPaginaAtual}
          onItemsPerPageChange={setPorPagina}
        />
      </div>
    </div>
  );
}
