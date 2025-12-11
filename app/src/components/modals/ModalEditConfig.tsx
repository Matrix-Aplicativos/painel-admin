"use client";

import { useState, useEffect } from "react";
import styles from "./ModalEditConfig.module.css";
import { FiX, FiCheck } from "react-icons/fi";
import usePutConfigMovix from "@/app/src/hooks/Configuracao/usePutConfigMovix";
import usePutConfigFdv from "@/app/src/hooks/Configuracao/usePutConfigFdv";

// Interface dos dados recebidos do GET
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
  // Mudamos onSave para onSaveSuccess, pois o modal gerencia o salvamento
  onSaveSuccess: () => void;
  data: ConfigItem | null;
  tipo: "MOVIX" | "FDV"; // Nova prop para decidir qual hook usar
}

export default function ModalEditConfig({
  isOpen,
  onClose,
  onSaveSuccess,
  data,
  tipo,
}: ModalEditConfigProps) {
  // Estado local do formulário
  const [formData, setFormData] = useState<ConfigItem | null>(null);

  // Hooks de PUT
  const { updateConfig: updateMovix, loading: loadingMovix } =
    usePutConfigMovix();
  const { updateConfig: updateFdv, loading: loadingFdv } = usePutConfigFdv();

  // Carrega os dados no form quando abre
  useEffect(() => {
    if (data) {
      setFormData(data);
    }
  }, [data]);

  if (!isOpen || !formData) return null;

  const isLoading = loadingMovix || loadingFdv;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;

    let sucesso = false;

    // Payload esperado pelos hooks
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
      onSaveSuccess(); // Avisa o pai para recarregar a lista
      onClose(); // Fecha o modal
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.container}>
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
            <button
              type="submit"
              className={styles.btnSave}
              disabled={isLoading}
            >
              {isLoading ? "Salvando..." : "Salvar"} <FiCheck />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
