"use client";

import styles from "../DetalhesCliente.module.css";
import { FiEdit2, FiTrash2, FiCheck, FiPlus } from "react-icons/fi";
import { useParams } from "next/navigation"; // Para pegar o ID da URL
import { useRouter } from "next/navigation";

export default function ClientDetailsPage() {
  const router = useRouter(); // <--- Hook
  const params = useParams();
  const id = params.id;

  const handleVerParcelas = () => {
    router.push(`/painel/Clientes/${id}/Parcelas`);
  };

  return (
    <div className={styles.container}>
      {/* Título e Status */}
      <div className={styles.header}>
        <h1 className={styles.title}>RAZÃO SOCIAL DO CLIENTE</h1>
        <span className={styles.statusBadge}>ATIVO</span>
      </div>

      <div className={styles.mainGrid}>
        {/* COLUNA DA ESQUERDA (FORMULÁRIO) */}
        <div className={styles.formSection}>
          <div className={styles.sectionTitle}>Dados de Cadastro</div>

          <div className={styles.formRow}>
            <div className={styles.inputGroup}>
              <label>Razão Social</label>
              <input type="text" defaultValue="Razão Social da Empresa" />
            </div>
            <div className={styles.inputGroup}>
              <label>CNPJ</label>
              <input type="text" defaultValue="09.346.601/0001-25" />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.inputGroup} style={{ flex: 0.5 }}>
              <label>CEP</label>
              <input type="text" defaultValue="78000-000" />
            </div>
            <div className={styles.inputGroup} style={{ flex: 0.8 }}>
              <label>Cidade</label>
              <input type="text" defaultValue="Cuiabá" />
            </div>
            <div className={styles.inputGroup}>
              <label>Endereço</label>
              <input type="text" defaultValue="Jardim Cuiabá" />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.inputGroup}>
              <label>Complemento</label>
              <input type="text" defaultValue="Jardim Cuiabá" />
            </div>
            <div className={styles.inputGroup}>
              <label>Situação</label>
              <select defaultValue="Ativo">
                <option value="Ativo">Ativo</option>
                <option value="Inativo">Inativo</option>
              </select>
            </div>
          </div>

          {/* Seção Contato */}
          <div
            className={styles.sectionTitle}
            style={{ marginTop: "20px", border: "none" }}
          >
            Contato
          </div>
          <button className={styles.primaryButton}>
             Novo <FiPlus size={18} />
          </button>

          <div className={styles.contactHeader}>
            <span style={{ flex: 1, fontSize: "12px", color: "#999" }}>
              E-mail
            </span>
            <span style={{ flex: 1, fontSize: "12px", color: "#999" }}>
              Telefone
            </span>
            <span style={{ flex: 1, fontSize: "12px", color: "#999" }}>
              Nome
            </span>
          </div>

          <div className={styles.contactList}>
            <div className={styles.contactItem}>
              <a href="#" className={styles.contactLink}>
                email@exemplo.com.br
              </a>
              <span className={styles.contactLink}>(65) 12345-6789</span>
              <span className={styles.contactLink}>Nome da Pessoa</span>
            </div>
            <div className={styles.contactItem}>
              <a href="#" className={styles.contactLink}>
                email@exemplo.com.br
              </a>
              <span className={styles.contactLink}>(65) 12345-6789</span>
              <span className={styles.contactLink}>Nome da Pessoa</span>
            </div>
          </div>

          {/* Seção Observações */}
          <div className={styles.sectionTitle} style={{ marginTop: "30px" }}>
            Observações
          </div>
          <div className={styles.inputGroup}>
            <textarea placeholder="Digite suas observações aqui..."></textarea>
          </div>
        </div>

        {/* COLUNA DA DIREITA (BOTÕES E FINANCEIRO) */}
        <div className={styles.sidebarSection}>
          {/* Botões de Ação */}
          <div className={styles.actionButtons}>
            <div className={styles.buttonRow}>
              <button className={`${styles.btnAction} ${styles.btnEdit}`}>
                Editar <FiEdit2 />
              </button>
              <button className={`${styles.btnAction} ${styles.btnDelete}`}>
                Excluir <FiTrash2 />
              </button>
            </div>
            <div className={styles.buttonRow}>
              <button className={`${styles.btnAction} ${styles.btnSave}`}>
                Salvar <FiCheck />
              </button>
              <button className={`${styles.btnAction} ${styles.btnCancel}`}>
                Cancelar <FiTrash2 />
              </button>
            </div>
          </div>

          {/* Lista de Pagamentos */}
          <div className={styles.paymentSection}>
            <h3>Pagamentos em Aberto</h3>

            <div className={`${styles.paymentRow} ${styles.paymentHeader}`}>
              <span>Nº</span>
              <span>Vencimento</span>
              <span>Tipo</span>
              <span>Valor</span>
            </div>

            <div className={styles.paymentList}>
              <div className={styles.paymentRow}>
                <span>1</span>
                <span>10/10/2025</span>
                <span>Ativação</span>
                <span>R$700,00</span>
              </div>
              <div className={styles.paymentRow}>
                <span>2</span>
                <span>10/10/2025</span>
                <span>Manutenção</span>
                <span>R$200,00</span>
              </div>
            </div>

            <button
              className={styles.btnViewParcels}
              onClick={handleVerParcelas} // <--- Adicione o onClick
            >
              Ver Parcelas
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
