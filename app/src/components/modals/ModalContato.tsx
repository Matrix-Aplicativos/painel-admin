"use client";
import { useState, useEffect } from "react";
import styles from "./ModalCliente.module.css"; // Reutilizando estilo do modal de cliente
import { FiX, FiCheck } from "react-icons/fi";

interface ContatoData {
  codcontatocliente?: number;
  nome: string;
  email: string;
  telefone: string;
}

interface ModalContatoProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ContatoData) => void;
  initialData?: ContatoData | null;
}

export default function ModalContato({
  isOpen,
  onClose,
  onSave,
  initialData,
}: ModalContatoProps) {
  const [formData, setFormData] = useState<ContatoData>({
    nome: "",
    email: "",
    telefone: "",
  });

  useEffect(() => {
    if (isOpen) {
      setFormData(initialData || { nome: "", email: "", telefone: "" });
    }
  }, [isOpen, initialData]);

  // --- MÁSCARA DE TELEFONE BRASILEIRO ---
  const maskPhone = (value: string) => {
    let v = value.replace(/\D/g, ""); // Remove tudo o que não é dígito
    v = v.substring(0, 11); // Limita a 11 dígitos (DDD + 9 números)

    // Coloca parênteses em volta dos dois primeiros dígitos
    v = v.replace(/^(\d{2})(\d)/g, "($1) $2");

    // Coloca o hífen entre o quarto e o quinto dígitos (para fixo) ou quinto e sexto (para celular)
    v = v.replace(/(\d)(\d{4})$/, "$1-$2");

    return v;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const maskedValue = maskPhone(e.target.value);
    setFormData({ ...formData, telefone: maskedValue });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.container} style={{ width: "500px" }}>
        <div className={styles.header}>
          <h2 className={styles.title}>
            {initialData ? "EDITAR CONTATO" : "NOVO CONTATO"}
          </h2>
          <button className={styles.closeButton} onClick={onClose}>
            <FiX />
          </button>
        </div>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label>Nome</label>
            <input
              type="text"
              value={formData.nome}
              onChange={(e) =>
                setFormData({ ...formData, nome: e.target.value })
              }
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label>E-mail</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>
          <div className={styles.inputGroup}>
            <label>Telefone</label>
            <input
              type="text"
              value={formData.telefone}
              onChange={handlePhoneChange} // Usando o handler com máscara
              placeholder="(99) 99999-9999"
              maxLength={15} // Limita o tamanho visual
            />
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
