"use client";

import { useState, useEffect } from "react";
import styles from "./ModalIntegracao.module.css";
import { FiX, FiCheck, FiCopy, FiKey } from "react-icons/fi";

interface IntegracaoData {
  id?: number;
  descricao: string;
  cnpj: string;
  maxEmpresas: number;
  senhaGerada: string;
}

interface ModalIntegracaoProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: IntegracaoData) => void;
  initialData?: IntegracaoData | null;
}

export default function ModalIntegracao({
  isOpen,
  onClose,
  onSave,
  initialData,
}: ModalIntegracaoProps) {
  const [formData, setFormData] = useState<IntegracaoData>({
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
          senhaGerada: "",
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
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
              />
            </div>
          </div>

          <h3 className={styles.sectionTitle}>Usuário de Integração</h3>

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
            >
              Gerar <FiKey />
            </button>
          </div>

          <div className={styles.footer}>
            <button
              type="button"
              className={styles.btnCancel}
              onClick={onClose}
            >
              Cancelar
            </button>
            <button type="submit" className={styles.btnSave}>
              Salvar <FiCheck />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
