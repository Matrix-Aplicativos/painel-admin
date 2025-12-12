"use client";

import { useState, useEffect } from "react";
import styles from "./ModalCliente.module.css";
import { FiX, FiCheck, FiSearch } from "react-icons/fi";
import ModalMunicipio from "./ModalMunicipio";
import usePostCliente, {
  ClientePayload,
} from "@/app/src/hooks/Cliente/usePostCliente";
import { MunicipioItem } from "../../hooks/Municipio/useGetMunicipio";

interface ModalClienteProps {
  isOpen: boolean;
  onClose: () => void;
  // Agora não recebe mais dados, ele mesmo chama o hook de sucesso
  onSuccess: () => void;
  initialData?: any; // Recebe o objeto do Supabase (TbClienteItem)
}

export default function ModalCliente({
  isOpen,
  onClose,
  onSuccess,
  initialData,
}: ModalClienteProps) {
  const [isMunicipioOpen, setIsMunicipioOpen] = useState(false);
  const { saveCliente, loading } = usePostCliente();

  // Estado alinhado com o banco + campos auxiliares de formulário
  const [formData, setFormData] = useState({
    razaosocial: "",
    cnpj: "",
    cep: "",
    logradouro: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidadeNome: "", // Visual
    observacoes: "",
    situacao: "1", // Padrão "1" (Ativo)
  });

  // Função para "explodir" o endereço único do banco nos campos do form
  // Ex: "Rua A, 123, Centro, Cuiabá" -> logradouro="Rua A", numero="123"...
  // Como é difícil fazer isso perfeito sem padrão, vamos simplificar:
  // Se for edição, jogamos o endereço todo no logradouro por enquanto, ou deixamos vazio para o usuário corrigir.

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          razaosocial: initialData.razaosocial || "",
          cnpj: initialData.cnpj || "",
          cep: initialData.cep || "",
          logradouro: initialData.endereco || "", // Joga tudo aqui por enquanto
          numero: "",
          complemento: "",
          bairro: "",
          cidadeNome: "",
          observacoes: initialData.observacoes || "",
          situacao: initialData.situacao || "1",
        });
      } else {
        setFormData({
          razaosocial: "",
          cnpj: "",
          cep: "",
          logradouro: "",
          numero: "",
          complemento: "",
          bairro: "",
          cidadeNome: "",
          observacoes: "",
          situacao: "1",
        });
      }
    }
  }, [isOpen, initialData]);

  const maskCNPJ = (value: string) => {
    return value
      .replace(/\D/g, "")
      .replace(/^(\d{2})(\d)/, "$1.$2")
      .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/\.(\d{3})(\d)/, ".$1/$2")
      .replace(/(\d{4})(\d)/, "$1-$2")
      .slice(0, 18);
  };

  const maskCEP = (value: string) => {
    return value
      .replace(/\D/g, "")
      .replace(/^(\d{5})(\d)/, "$1-$2")
      .slice(0, 9);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    let finalValue = value;

    if (name === "cnpj") finalValue = maskCNPJ(value);
    if (name === "cep") finalValue = maskCEP(value);

    setFormData((prev) => ({ ...prev, [name]: finalValue }));
  };

  const handleCidadeSelect = (cidade: MunicipioItem) => {
    setFormData((prev) => ({
      ...prev,
      cidadeNome: `${cidade.nome} - ${cidade.uf}`,
    }));
    setIsMunicipioOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Monta o endereço completo para salvar numa coluna só (padrão do banco legado)
    // Ex: "Rua X, 123, Apto 10, Centro, Cuiabá - MT"
    const partesEndereco = [
      formData.logradouro,
      formData.numero,
      formData.complemento,
      formData.bairro,
      formData.cidadeNome,
    ]
      .filter(Boolean)
      .join(", ");

    const payload: ClientePayload = {
      codcliente: initialData?.codcliente || null, // Se tem ID, é update
      razaosocial: formData.razaosocial,
      cnpj: formData.cnpj.replace(/\D/g, ""), // Remove formatação pro banco
      cep: formData.cep.replace(/\D/g, ""),
      endereco: partesEndereco, // Salva concatenado
      observacoes: formData.observacoes,
      situacao: formData.situacao,
    };

    const sucesso = await saveCliente(payload);

    if (sucesso) {
      onSuccess();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <ModalMunicipio
        isOpen={isMunicipioOpen}
        onClose={() => setIsMunicipioOpen(false)}
        onSelect={handleCidadeSelect}
      />

      <div className={styles.overlay}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h2 className={styles.title}>
              {initialData ? "EDITAR CLIENTE" : "NOVO CLIENTE"}
            </h2>
            <button
              className={styles.closeButton}
              onClick={onClose}
              type="button"
              disabled={loading}
            >
              <FiX />
            </button>
          </div>

          <form className={styles.form} onSubmit={handleSubmit}>
            {/* Linha 1 */}
            <div className={styles.formRow}>
              <div className={styles.inputGroup}>
                <label>Razão Social</label>
                <input
                  name="razaosocial"
                  type="text"
                  placeholder="Nome da Empresa"
                  value={formData.razaosocial}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>
              <div className={styles.inputGroup}>
                <label>CNPJ</label>
                <input
                  name="cnpj"
                  type="text"
                  placeholder="00.000.000/0000-00"
                  value={formData.cnpj}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* Linha 2 */}
            <div className={styles.formRow}>
              <div className={styles.inputGroup} style={{ flex: 0.4 }}>
                <label>CEP</label>
                <input
                  name="cep"
                  type="text"
                  placeholder="00000-000"
                  value={formData.cep}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>

              <div className={styles.inputGroup}>
                <label>Cidade</label>
                <div className={styles.inputWrapperRelative}>
                  <input
                    name="cidadeNome"
                    type="text"
                    placeholder="Clique para selecionar"
                    value={formData.cidadeNome}
                    readOnly
                    onClick={() => !loading && setIsMunicipioOpen(true)}
                    style={{
                      cursor: "pointer",
                      backgroundColor: loading ? "#eee" : "#fff",
                    }}
                  />
                  <FiSearch
                    className={styles.searchIcon}
                    size={16}
                    style={{
                      position: "absolute",
                      right: 10,
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "#1769e3",
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Linha 3: Endereço (Quebrado visualmente, mas salvo junto) */}
            <div className={styles.formRow}>
              <div className={styles.inputGroup} style={{ flex: 2 }}>
                <label>Logradouro (Rua, Av...)</label>
                <input
                  name="logradouro"
                  type="text"
                  placeholder="Rua das Flores"
                  value={formData.logradouro}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
              <div className={styles.inputGroup} style={{ flex: 0.5 }}>
                <label>Número</label>
                <input
                  name="numero"
                  type="text"
                  placeholder="123"
                  value={formData.numero}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.inputGroup}>
                <label>Bairro</label>
                <input
                  name="bairro"
                  type="text"
                  placeholder="Centro"
                  value={formData.bairro}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
              <div className={styles.inputGroup}>
                <label>Complemento</label>
                <input
                  name="complemento"
                  type="text"
                  placeholder="Sala 101"
                  value={formData.complemento}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
            </div>

            {/* Linha 4: Observações e Situação */}
            <div className={styles.formRow}>
              <div className={styles.inputGroup} style={{ flex: 2 }}>
                <label>Observações / Integração</label>
                <input
                  name="observacoes"
                  type="text"
                  placeholder="Ex: 3 Licenças Movix..."
                  value={formData.observacoes}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
              <div className={styles.inputGroup} style={{ flex: 1 }}>
                <label>Situação</label>
                <select
                  name="situacao"
                  value={formData.situacao}
                  onChange={handleChange}
                  disabled={loading}
                >
                  <option value="1">Ativo</option>
                  <option value="2">Cancelado</option>
                  <option value="3">Em Negociação</option>
                  <option value="4">Prospecção</option>
                </select>
              </div>
            </div>

            {/* Footer */}
            <div className={styles.footer}>
              <button
                type="button"
                className={styles.btnCancel}
                onClick={onClose}
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className={styles.btnSave}
                disabled={loading}
              >
                {loading ? "Salvando..." : "Salvar"} <FiCheck />
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
