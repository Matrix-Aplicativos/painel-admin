"use client";

import { useState, useEffect } from "react";
import { FiX, FiCheck } from "react-icons/fi";
import styles from "./ModalEditConfig.module.css";
import usePutConfigMovix from "@/app/src/hooks/Configuracao/usePutConfigMovix";
import usePutConfigFdv from "@/app/src/hooks/Configuracao/usePutConfigFdv";

interface ConfigItem {
  codConfiguracao: number;
  codEmpresa: number;
  descricao: string;
  valor: string;
  ativo: boolean;
}

interface ModalEditConfigProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveSuccess: () => void;
  data: ConfigItem | null;
  tipo: "MOVIX" | "FDV";
}

export default function ModalEditConfig({
  isOpen,
  onClose,
  onSaveSuccess,
  data,
  tipo,
}: ModalEditConfigProps) {
  //Declaração de todos os useStates
  const [formData, setFormData] = useState<ConfigItem | null>(null);

  //Declaração de Funções e Lógica
  const { updateConfig: updateMovix, loading: loadingMovix } =
    usePutConfigMovix();
  const { updateConfig: updateFdv, loading: loadingFdv } = usePutConfigFdv();

  const isLoading = loadingMovix || loadingFdv;

  useEffect(() => {
    if (data) {
      setFormData(data);
    }
  }, [data]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;

    let sucesso = false;

    const payload = {
      valor: formData.valor,
      ativo: formData.ativo,
    };

    if (tipo === "MOVIX") {
      sucesso = await updateMovix(formData.codConfiguracao, payload);
    } else {
      sucesso = await updateFdv(formData.codConfiguracao, payload);
    }

    if (sucesso) {
      onSaveSuccess();
      onClose();
    }
  };

  //Declaração de Funções de renderização
  const renderHeader = () => (
    <div className={styles.header}>
      <h2 className={styles.title}>EDITAR CONFIGURAÇÃO ({tipo})</h2>
      <button
        className={styles.closeButton}
        onClick={onClose}
        disabled={isLoading}
      >
        <FiX />
      </button>
    </div>
  );

  const renderForm = () => {
    if (!formData) return null;

    return (
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
            disabled={isLoading}
          />
        </div>

        <div className={styles.inputGroup}>
          <label>Status</label>
          <select
            value={formData.ativo ? "true" : "false"}
            onChange={(e) =>
              setFormData({ ...formData, ativo: e.target.value === "true" })
            }
            disabled={isLoading}
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
            disabled={isLoading}
          >
            Cancelar
          </button>
          <button type="submit" className={styles.btnSave} disabled={isLoading}>
            {isLoading ? "Salvando..." : "Salvar"} <FiCheck />
          </button>
        </div>
      </form>
    );
  };

  //Return
  if (!isOpen || !formData) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.container}>
        {renderHeader()}
        {renderForm()}
      </div>
    </div>
  );
}
