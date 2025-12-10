"use client";

import { useState, useEffect } from "react";
import styles from "./ModalIntegracao.module.css";
import { FiX, FiCheck, FiCopy, FiKey } from "react-icons/fi";
import usePostIntegracao, {
  IntegracaoPayload,
} from "../../hooks/Integracao/usePostIntegracao";

interface IntegracaoFormData {
  id?: number;
  descricao: string;
  cnpj: string;
  maxEmpresas: number;
  senhaGerada: string;
}

interface ModalIntegracaoProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveSuccess: () => void;
  initialData?: IntegracaoFormData | null;
}

export default function ModalIntegracao({
  isOpen,
  onClose,
  onSaveSuccess,
  initialData,
}: ModalIntegracaoProps) {
  const { createIntegracao, loading, error, success } = usePostIntegracao();

  const [formData, setFormData] = useState<IntegracaoFormData>({
    descricao: "",
    cnpj: "",
    maxEmpresas: 1,
    senhaGerada: "",
  });

  const generatePassword = () => {
    const length = 16;
    const charset = {
      upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
      lower: "abcdefghijklmnopqrstuvwxyz",
      number: "0123456789",
      symbol: "!@#$%^&*()_+~`|}{[]:;?><,./-=",
    };

    let password = "";
    password += charset.upper[Math.floor(Math.random() * charset.upper.length)];
    password += charset.lower[Math.floor(Math.random() * charset.lower.length)];
    password +=
      charset.number[Math.floor(Math.random() * charset.number.length)];
    password +=
      charset.symbol[Math.floor(Math.random() * charset.symbol.length)];

    const allChars =
      charset.upper + charset.lower + charset.number + charset.symbol;
    for (let i = 4; i < length; i++) {
      password += allChars[Math.floor(Math.random() * allChars.length)];
    }

    return password
      .split("")
      .sort(() => 0.5 - Math.random())
      .join("");
  };

  const maskCNPJ = (value: string) => {
    return value
      .replace(/\D/g, "")
      .replace(/^(\d{2})(\d)/, "$1.$2")
      .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/\.(\d{3})(\d)/, ".$1/$2")
      .replace(/(\d{4})(\d)/, "$1-$2")
      .slice(0, 18);
  };

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData(initialData);
      } else {
        setFormData({
          descricao: "",
          cnpj: "",
          maxEmpresas: 1,
          senhaGerada: generatePassword(), 
        });
      }
    }
  }, [isOpen, initialData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    let finalValue = value;
    if (name === "cnpj") finalValue = maskCNPJ(value);
    setFormData((prev) => ({ ...prev, [name]: finalValue }));
  };

  const handleCopyPassword = () => {
    if (!formData.senhaGerada) return;
    navigator.clipboard.writeText(formData.senhaGerada);
    alert("Senha copiada para a área de transferência!");
  };

  const handleGeneratePassword = () => {
    setFormData((prev) => ({ ...prev, senhaGerada: generatePassword() }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload: IntegracaoPayload = {
      codIntegracao: null, 
      descricao: formData.descricao,
      cnpj: formData.cnpj,
      maxEmpresas: Number(formData.maxEmpresas),
      ativo: true,
      usuario: {
        nomeUsuario: formData.cnpj.replace(/\D/g, ""),
        senha: formData.senhaGerada,
      },
    };

    const isCreated = await createIntegracao(payload);

    if (isCreated) {
      onSaveSuccess(); 
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>
            {initialData ? "EDITAR INTEGRAÇÃO" : "NOVA INTEGRAÇÃO"}
          </h2>
          <button
            className={styles.closeButton}
            onClick={onClose}
            title="Fechar"
            disabled={loading}
          >
            <FiX />
          </button>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <h3 className={styles.sectionTitle}>Dados de Cadastro</h3>

          <div className={styles.inputGroup}>
            <label>Descrição</label>
            <input
              name="descricao"
              type="text"
              placeholder="Ex: Integração ERP Protheus"
              value={formData.descricao}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <div className={styles.formRow}>
            <div className={styles.inputGroup} style={{ flex: 2 }}>
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
            <div className={styles.inputGroup} style={{ flex: 1 }}>
              <label>Máximo de Empresas</label>
              <input
                name="maxEmpresas"
                type="number"
                min="1"
                value={formData.maxEmpresas}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
          </div>

          <h3 className={styles.sectionTitle}>Usuário de Integração</h3>

          <div
            className={styles.infoBox}
            style={{ fontSize: "12px", color: "#666", marginBottom: "10px" }}
          >
            O login do usuário será gerado automaticamente com base no CNPJ.
          </div>

          <div className={styles.formRow}>
            <div className={styles.inputGroup} style={{ flex: 1 }}>
              <label>Senha</label>
              <div className={styles.passwordWrapper}>
                <input
                  name="senhaGerada"
                  type="text"
                  placeholder="Senha"
                  value={formData.senhaGerada}
                  readOnly
                  style={{ backgroundColor: "#f9f9f9", cursor: "default" }}
                />
                {formData.senhaGerada && (
                  <button
                    type="button"
                    className={styles.copyButton}
                    onClick={handleCopyPassword}
                    title="Copiar Senha"
                  >
                    <FiCopy size={16} />
                  </button>
                )}
              </div>
            </div>

            <button
              type="button"
              className={styles.generateButton}
              onClick={handleGeneratePassword}
              disabled={loading}
            >
              Gerar <FiKey />
            </button>
          </div>

          {error && (
            <div
              style={{
                color: "red",
                marginTop: 10,
                fontSize: 14,
                textAlign: "center",
              }}
            >
              {error}
            </div>
          )}

          <div className={styles.footer}>
            <button
              type="button"
              className={styles.btnCancel}
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </button>
            <button type="submit" className={styles.btnSave} disabled={loading}>
              {loading ? "Salvando..." : "Salvar"} <FiCheck />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
