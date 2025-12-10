"use client";

import { useState, useEffect } from "react";
import styles from "./ModalVersaoMovix.module.css";
import { FiX, FiCheck } from "react-icons/fi";
import usePostVersaoMovix, {
  VersaoMovixPayload,
} from "@/app/src/hooks/VersaoMovix/usePostVersaoMovix";
import useGetVersaoMovixById from "@/app/src/hooks/VersaoMovix/useGetVersaoMovixById";

const INITIAL_DATA: VersaoMovixPayload = {
  codVersao: null,
  stringVersao: "",
  plataforma: "",
  atualizacaoObrigatoria: false,
  changelog: "",
};

interface ModalVersaoMovixProps {
  isOpen: boolean;
  onClose: () => void;
  idVersao: number | null;
  onSuccess: () => void;
}

export default function ModalVersaoMovix({
  isOpen,
  onClose,
  idVersao,
  onSuccess,
}: ModalVersaoMovixProps) {
  const [formData, setFormData] = useState<VersaoMovixPayload>(INITIAL_DATA);
  const { versao, loading: loadingGet } = useGetVersaoMovixById(idVersao);
  const { saveVersao, loading: loadingSave } = usePostVersaoMovix();

  useEffect(() => {
    if (!isOpen) {
      setFormData(INITIAL_DATA);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && idVersao && versao) {
      let plataformaNormalizada = "";
      if (versao.plataforma) {
        const p = String(versao.plataforma).toUpperCase(); 
        if (p === "ANDROID" || p === "1") plataformaNormalizada = "1";
        if (p === "IOS" || p === "2") plataformaNormalizada = "2";
      }

      setFormData({
        codVersao: versao.codVersao,
        stringVersao: versao.stringVersao,
        plataforma: plataformaNormalizada, 
        atualizacaoObrigatoria: versao.atualizacaoObrigatoria,
        changelog: versao.changelog || "",
      });
    }
  }, [isOpen, idVersao, versao]);

  const handleChange = (field: keyof VersaoMovixPayload, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.stringVersao || !formData.plataforma) {
      alert("Preencha a versão e a plataforma.");
      return;
    }

    const payload = {
      ...formData,
      codVersao: idVersao ? idVersao : null,
    };

    const sucesso = await saveVersao(payload);

    if (sucesso) {
      onSuccess();
      onClose();
    }
  };

  if (!isOpen) return null;

  const isEditing = !!idVersao;
  const isLoading = loadingGet || loadingSave;

  return (
    <div className={styles.overlay}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>
            {isEditing ? "EDITAR VERSÃO MOVIX" : "NOVA VERSÃO MOVIX"}
          </h2>
          <button
            className={styles.closeButton}
            onClick={onClose}
            disabled={isLoading}
          >
            <FiX />
          </button>
        </div>

        {loadingGet ? (
          <div style={{ textAlign: "center", padding: "20px" }}>
            Carregando dados...
          </div>
        ) : (
          <form onSubmit={handleSubmit} className={styles.formContent}>
            <div className={styles.inputGroup}>
              <label>Versão</label>
              <input
                type="text"
                placeholder="X.X.X"
                value={formData.stringVersao}
                onChange={(e) => handleChange("stringVersao", e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div className={styles.inputGroup}>
              <label>Plataforma</label>
              <select
                value={formData.plataforma}
                onChange={(e) => handleChange("plataforma", e.target.value)}
                required
                disabled={isLoading}
              >
                <option value="">Selecione</option>
                <option value="1">ANDROID</option>
                <option value="2">IOS</option>
              </select>
            </div>

            <div className={styles.toggleRow}>
              <div className={styles.inputGroup}>
                <label style={{ marginBottom: 0, fontWeight: 400 }}>
                  Forçar Atualização
                </label>
              </div>
              <label className={styles.switch}>
                <input
                  type="checkbox"
                  checked={formData.atualizacaoObrigatoria}
                  onChange={(e) =>
                    handleChange("atualizacaoObrigatoria", e.target.checked)
                  }
                  disabled={isLoading}
                />
                <span className={styles.slider}></span>
              </label>
            </div>

            <div className={styles.inputGroup}>
              <label>Notas de Atualização</label>
              <textarea
                placeholder="Novidades..."
                value={formData.changelog}
                onChange={(e) => handleChange("changelog", e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div>
              <button
                type="submit"
                className={styles.btnSave}
                disabled={isLoading}
              >
                {loadingSave ? "Salvando..." : "Salvar"} <FiCheck />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
