"use client";

import { useState, useEffect } from "react";
import styles from "./ModalNovoFuncionario.module.css";
import { FiX, FiCheck } from "react-icons/fi";

interface FuncionarioData {
  nome: string;
  cpf: string;
  email: string;
  codErp: string;
  codEmpresa: string | number;
}

interface ModalNovoFuncionarioProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: FuncionarioData) => void;
  empresaId?: number | string; // ID da empresa selecionada na tabela
}

export default function ModalNovoFuncionario({
  isOpen,
  onClose,
  onSave,
  empresaId,
}: ModalNovoFuncionarioProps) {
  const [formData, setFormData] = useState<FuncionarioData>({
    nome: "",
    cpf: "",
    email: "",
    codErp: "",
    codEmpresa: "",
  });

  // Preenche o código da empresa automaticamente ao abrir
  useEffect(() => {
    if (isOpen && empresaId) {
      setFormData((prev) => ({ ...prev, codEmpresa: empresaId }));
    } else if (isOpen) {
      // Limpa se abrir sem contexto (segurança)
      setFormData({ nome: "", cpf: "", email: "", codErp: "", codEmpresa: "" });
    }
  }, [isOpen, empresaId]);

  // Máscara de CPF
  const maskCPF = (value: string) => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})/, "$1-$2")
      .replace(/(-\d{2})\d+?$/, "$1");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let finalValue = value;
    if (name === "cpf") finalValue = maskCPF(value);
    setFormData((prev) => ({ ...prev, [name]: finalValue }));
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
          <h2 className={styles.title}>NOVO FUNCIONÁRIO</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <FiX />
          </button>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label>Nome Completo</label>
            <input
              name="nome"
              type="text"
              placeholder="Nome do Funcionário"
              value={formData.nome}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formRow}>
            <div className={styles.inputGroup}>
              <label>CPF</label>
              <input
                name="cpf"
                type="text"
                placeholder="000.000.000-00"
                value={formData.cpf}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.inputGroup}>
              <label>E-mail</label>
              <input
                name="email"
                type="email"
                placeholder="email@empresa.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.inputGroup}>
              <label>Cód. ERP</label>
              <input
                name="codErp"
                type="text"
                placeholder="Código Interno"
                value={formData.codErp}
                onChange={handleChange}
              />
            </div>
            <div className={styles.inputGroup}>
              <label>Cód. Empresa</label>
              <input
                name="codEmpresa"
                type="text"
                value={formData.codEmpresa}
                onChange={handleChange}
                readOnly // Sugiro deixar readOnly pois veio da tabela, mas pode tirar se quiser editar
              />
            </div>
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
