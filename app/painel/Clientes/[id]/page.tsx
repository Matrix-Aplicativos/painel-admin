"use client";

import styles from "../DetalhesCliente.module.css";
import {
  FiEdit2,
  FiTrash2,
  FiCheck,
  FiPlus,
  FiX,
  FiArrowLeft,
} from "react-icons/fi";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";

// --- HOOKS ---
import useGetClienteById from "@/app/src/hooks/Cliente/useGetClienteById";
import usePostCliente, {
  ClientePayload,
} from "@/app/src/hooks/Cliente/usePostCliente";
import useDeleteCliente from "@/app/src/hooks/Cliente/useDeleteCliente";
import usePostContato, {
  ContatoPayload,
} from "@/app/src/hooks/Contato/usePostContato";
import useDeleteContato from "@/app/src/hooks/Contato/useDeleteContato";
import useGetParcelas from "@/app/src/hooks/Financeiro/useGetParcelas";
import useGetContatos, {
  ContatoItem,
} from "@/app/src/hooks/Contato/useGetContato";

// --- MODAL ---
import ModalContato from "@/app/src/components/modals/ModalContato";

const TIPOS_MAP: Record<string, string> = {
  A: "Ativação",
  M: "Manutenção",
  S: "Serviço",
  O: "Outros",
};

export default function ClientDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);

  // --- HOOKS CLIENTE ---
  const { cliente, loading, refetch } = useGetClienteById(id);
  const { saveCliente, loading: loadingSave } = usePostCliente();
  const { deleteCliente, loading: loadingDelete } = useDeleteCliente();

  // --- HOOKS CONTATO ---
  const { contatos, refetch: refetchContatos } = useGetContatos(id);
  const { saveContato } = usePostContato();
  const { deleteContato } = useDeleteContato();

  // --- HOOKS PARCELA ---
  const { parcelas, loading: loadingParcelas } = useGetParcelas(id);

  // --- ESTADOS ---
  const [isEditing, setIsEditing] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<ContatoItem | null>(
    null
  );

  const [formData, setFormData] = useState({
    razaosocial: "",
    cnpj: "",
    cep: "",
    endereco: "",
    situacao: "1",
    observacoes: "",
  });

  useEffect(() => {
    if (cliente) {
      setFormData({
        razaosocial: cliente.razaosocial || "",
        cnpj: cliente.cnpj || "",
        cep: cliente.cep || "",
        endereco: cliente.endereco || "",
        situacao: cliente.situacao || "1",
        observacoes: cliente.observacoes || "",
      });
    }
  }, [cliente]);

  // Lógica de Filtragem de Parcelas (Apenas em aberto e não vencidas)
  const parcelasFiltradas = parcelas.filter((p) => {
    // 1. Se já está pago, ignora
    if (p.pago) return false;

    // 2. Verifica se a data de vencimento é hoje ou futuro
    if (!p.datavencimento) return false;

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    // Converte string YYYY-MM-DD para data local corretamente
    const [ano, mes, dia] = p.datavencimento.toString().split("-");
    const dataVenc = new Date(Number(ano), Number(mes) - 1, Number(dia));

    return dataVenc >= hoje;
  });

  // --- HANDLERS CLIENTE ---
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditar = () => {
    setIsEditing(true);
  };

  const handleCancelar = () => {
    setIsEditing(false);
    if (cliente) {
      setFormData({
        razaosocial: cliente.razaosocial || "",
        cnpj: cliente.cnpj || "",
        cep: cliente.cep || "",
        endereco: cliente.endereco || "",
        situacao: cliente.situacao || "1",
        observacoes: cliente.observacoes || "",
      });
    }
  };

  const handleSalvarCliente = async () => {
    const payload: ClientePayload = {
      codcliente: id,
      razaosocial: formData.razaosocial,
      cnpj: formData.cnpj,
      cep: formData.cep,
      endereco: formData.endereco,
      observacoes: formData.observacoes,
      situacao: formData.situacao,
    };

    if (await saveCliente(payload)) {
      alert("Cliente atualizado!");
      setIsEditing(false);
      refetch();
    }
  };

  const handleExcluirCliente = async () => {
    if (confirm("Tem certeza que deseja excluir este cliente?")) {
      if (await deleteCliente(id)) {
        alert("Cliente excluído!");
        router.push("/painel/Clientes");
      }
    }
  };

  // --- HANDLERS CONTATO ---
  const handleOpenContactModal = (contato?: ContatoItem) => {
    setSelectedContact(contato || null);
    setIsContactModalOpen(true);
  };

  const handleSaveContato = async (data: any) => {
    const payload: ContatoPayload = {
      codcontatocliente: selectedContact?.codcontatocliente || null,
      codcliente: id,
      nome: data.nome,
      email: data.email,
      telefone: data.telefone,
    };

    if (await saveContato(payload)) {
      setIsContactModalOpen(false);
      refetchContatos();
    }
  };

  const handleDeleteContato = async (codContato: number) => {
    if (confirm("Excluir este contato?")) {
      if (await deleteContato(codContato)) {
        refetchContatos();
      }
    }
  };

  const handleVerParcelas = () => {
    router.push(`/painel/Clientes/${id}/Parcelas`);
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "1":
        return "ATIVO";
      case "2":
        return "CANCELADO";
      case "3":
        return "EM NEGOCIAÇÃO";
      case "4":
        return "PROSPECÇÃO";
      default:
        return "DESCONHECIDO";
    }
  };

  const getStatusClass = (status: string) => {
    if (status === "1") return styles.statusBadge;
    return `${styles.statusBadge} ${styles.statusInactive}`;
  };

  if (loading) return <div className={styles.container}>Carregando...</div>;
  if (!cliente)
    return <div className={styles.container}>Cliente não encontrado.</div>;

  return (
    <div className={styles.container}>
      <ModalContato
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        onSave={handleSaveContato}
        initialData={selectedContact}
      />

      {/* HEADER */}
      <div className={styles.header}>
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <Link
            href="/painel/Clientes"
            style={{ color: "#333", display: "flex", alignItems: "center" }}
          >
            <FiArrowLeft size={24} />
          </Link>
          <h1 className={styles.title}>{cliente.razaosocial?.toUpperCase()}</h1>
        </div>

        <span
          className={getStatusClass(cliente.situacao)}
          style={
            cliente.situacao !== "1"
              ? { backgroundColor: "#ffebee", color: "#c62828" }
              : {}
          }
        >
          {getStatusLabel(cliente.situacao)}
        </span>
      </div>

      <div className={styles.mainGrid}>
        {/* ESQUERDA: FORMULÁRIO CLIENTE */}
        <div className={styles.formSection}>
          <div className={styles.sectionTitle}>Dados de Cadastro</div>

          <div className={styles.formRow}>
            <div className={styles.inputGroup}>
              <label>Razão Social</label>
              <input
                name="razaosocial"
                type="text"
                value={formData.razaosocial}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>
            <div className={styles.inputGroup}>
              <label>CNPJ</label>
              <input
                name="cnpj"
                type="text"
                value={formData.cnpj}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.inputGroup} style={{ flex: 0.5 }}>
              <label>CEP</label>
              <input
                name="cep"
                type="text"
                value={formData.cep}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>
            <div className={styles.inputGroup}>
              <label>Endereço Completo</label>
              <input
                name="endereco"
                type="text"
                value={formData.endereco}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.inputGroup}>
              <label>Situação</label>
              <select
                name="situacao"
                value={formData.situacao}
                onChange={handleInputChange}
                disabled={!isEditing}
              >
                <option value="1">Ativo</option>
                <option value="2">Cancelado</option>
                <option value="3">Em Negociação</option>
                <option value="4">Prospecção</option>
              </select>
            </div>
          </div>

          <div
            className={styles.sectionTitle}
            style={{
              marginTop: "20px",
              border: "none",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span>Contatos</span>

            {isEditing && (
              <button
                className={styles.primaryButton}
                onClick={() => handleOpenContactModal()}
                type="button"
                style={{
                  fontSize: "12px",
                  padding: "4px 10px",
                  height: "auto",
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                }}
              >
                Novo <FiPlus size={14} />
              </button>
            )}
          </div>

          {/* CABEÇALHO DA TABELA CONTATOS */}
          <div
            className={styles.contactHeader}
            style={{
              display: "flex",
              padding: "10px 0",
              borderBottom: "1px solid #eee",
              fontWeight: "bold",
            }}
          >
            <span style={{ flex: 1, fontSize: "12px", color: "#999" }}>
              Nome
            </span>
            <span style={{ flex: 1, fontSize: "12px", color: "#999" }}>
              E-mail
            </span>
            <span style={{ flex: 1, fontSize: "12px", color: "#999" }}>
              Telefone
            </span>
            {isEditing && (
              <span
                style={{
                  width: "80px",
                  fontSize: "12px",
                  color: "#999",
                  textAlign: "center",
                }}
              >
                Ações
              </span>
            )}
          </div>

          {/* LISTA DE CONTATOS */}
          <div className={styles.contactList}>
            {contatos.map((ct) => (
              <div
                key={ct.codcontatocliente}
                className={styles.contactItem}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "10px 0",
                  borderBottom: "1px solid #f5f5f5",
                }}
              >
                <span className={styles.contactLink} style={{ flex: 1 }}>
                  {ct.nome}
                </span>
                <a
                  href={`mailto:${ct.email}`}
                  className={styles.contactLink}
                  style={{
                    flex: 1,
                    color: "#1769e3",
                    textDecoration: "none",
                  }}
                >
                  {ct.email}
                </a>
                <span className={styles.contactLink} style={{ flex: 1 }}>
                  {ct.telefone}
                </span>

                {isEditing && (
                  <div
                    style={{
                      width: "80px",
                      display: "flex",
                      gap: 10,
                      justifyContent: "center",
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => handleOpenContactModal(ct)}
                      style={{
                        border: "none",
                        background: "none",
                        cursor: "pointer",
                        color: "#1769e3",
                      }}
                      title="Editar"
                    >
                      <FiEdit2 size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteContato(ct.codcontatocliente)}
                      style={{
                        border: "none",
                        background: "none",
                        cursor: "pointer",
                        color: "#d32f2f",
                      }}
                      title="Excluir"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                )}
              </div>
            ))}
            {contatos.length === 0 && (
              <p style={{ fontSize: 12, color: "#999", padding: 10 }}>
                Nenhum contato cadastrado.
              </p>
            )}
          </div>

          <div className={styles.sectionTitle} style={{ marginTop: "30px" }}>
            Observações
          </div>
          <div className={styles.inputGroup}>
            <textarea
              name="observacoes"
              value={formData.observacoes}
              onChange={handleInputChange}
              disabled={!isEditing}
              placeholder="Digite suas observações aqui..."
            ></textarea>
          </div>
        </div>

        {/* DIREITA: ACTIONS & FINANCEIRO */}
        <div className={styles.sidebarSection}>
          <div className={styles.actionButtons}>
            {!isEditing ? (
              <div className={styles.buttonRow}>
                <button
                  className={`${styles.btnAction} ${styles.btnEdit}`}
                  onClick={handleEditar}
                  disabled={loadingDelete}
                >
                  Editar <FiEdit2 />
                </button>
                <button
                  className={`${styles.btnAction} ${styles.btnDelete}`}
                  onClick={handleExcluirCliente}
                  disabled={loadingDelete}
                >
                  Excluir <FiTrash2 />
                </button>
              </div>
            ) : (
              <div className={styles.buttonRow}>
                <button
                  className={`${styles.btnAction} ${styles.btnSave}`}
                  onClick={handleSalvarCliente}
                  disabled={loadingSave}
                >
                  Salvar <FiCheck />
                </button>
                <button
                  className={`${styles.btnAction} ${styles.btnCancel}`}
                  onClick={handleCancelar}
                  disabled={loadingSave}
                >
                  Cancelar <FiX />
                </button>
              </div>
            )}
          </div>

          {/* LISTA DE PARCELAS */}
          <div className={styles.paymentSection}>
            <h3>Pagamentos em Aberto</h3>

            <div className={`${styles.paymentRow} ${styles.paymentHeader}`}>
              <span>Vencimento</span>
              <span>Valor</span>
              <span>Tipo</span>
            </div>

            <div className={styles.paymentList}>
              {loadingParcelas && (
                <p style={{ fontSize: 12, padding: 10 }}>Carregando...</p>
              )}
              {!loadingParcelas && parcelasFiltradas.length === 0 && (
                <p style={{ fontSize: 12, padding: 10 }}>
                  Nenhuma parcela em aberto para os próximos dias.
                </p>
              )}

              {parcelasFiltradas.map((p) => (
                <div key={p.codparcela} className={styles.paymentRow}>
                  <span>
                    {new Date(p.datavencimento).toLocaleDateString("pt-BR", {
                      timeZone: "UTC",
                    })}
                  </span>
                  <span>
                    {Number(p.valor).toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </span>
                  <span>{TIPOS_MAP[p.tipo] || p.tipo}</span>
                </div>
              ))}
            </div>

            <button
              className={styles.btnViewParcels}
              onClick={handleVerParcelas}
            >
              Ver Todas as Parcelas
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
