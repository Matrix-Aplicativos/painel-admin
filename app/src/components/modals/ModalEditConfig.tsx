"use client";
import { useState, useEffect } from "react";
import styles from "./ModalEditConfig.module.css";
import { FiX, FiCheck } from "react-icons/fi";

interface ConfigData {
  id: number;
  cod: number;
  descricao: string;
  valor: string;
  status: boolean;
}

interface ModalEditConfigProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ConfigData) => void;
  data: ConfigData | null;
}

export default function ModalEditConfig({
  isOpen,
  onClose,
  onSave,
  data,
}: ModalEditConfigProps) {
  const [formData, setFormData] = useState<ConfigData | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (data) setFormData(data);
  }, [data]);

  if (!isOpen || !formData) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>EDITAR CONFIGURAÇÃO</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <FiX />
          </button>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label>Descrição</label>
            <input type="text" value={formData.descricao} disabled />
          </div>

          <div className={styles.inputGroup}>
            <label>Valor</label>
            <input
              type="text"
              value={formData.valor}
              onChange={(e) =>
                setFormData({ ...formData, valor: e.target.value })
              }
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Status</label>
            <select
              value={formData.status ? "true" : "false"}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value === "true" })
              }
            >
              <option value="true">Ativo</option>
              <option value="false">Inativo</option>
            </select>
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
