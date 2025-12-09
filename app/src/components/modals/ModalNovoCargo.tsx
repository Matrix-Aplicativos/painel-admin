"use client";

import { useState, useEffect } from "react";
import styles from "./ModalNovoCargo.module.css";
import { FiX, FiCheck } from "react-icons/fi";

interface ModalNovoCargoProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (cargo: { nome: string; permissoes: string[] }) => void;
}

// Lista de Permissões Disponíveis (Mock)
const PERMISSOES_MOVIX = [
  "ROLE_MOVIX_GESTOR",
  "ROLE_MOVIX_FUNCIONARIO",
  "ROLE_MOVIX_INVENTARIOS",
  "ROLE_MOVIX_TRANSFERENCIAS",
];

const PERMISSOES_FDV = [
  "ROLE_FDV_GESTOR",
  "ROLE_FDV_FUNCIONARIO",
  "ROLE_FDV_PEDIDOS",
  "ROLE_FDV_RELATORIOS",
];

export default function ModalNovoCargo({
  isOpen,
  onClose,
  onSave,
}: ModalNovoCargoProps) {
  const [nomeCargo, setNomeCargo] = useState("");
  const [permissoesSelecionadas, setPermissoesSelecionadas] = useState<
    string[]
  >([]);

  // Limpa o form ao abrir
  useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setNomeCargo("");
      setPermissoesSelecionadas([]);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Lógica para marcar/desmarcar checkbox
  const handleCheckboxChange = (permissao: string) => {
    setPermissoesSelecionadas((prev) => {
      if (prev.includes(permissao)) {
        // Se já tem, remove
        return prev.filter((p) => p !== permissao);
      } else {
        // Se não tem, adiciona
        return [...prev, permissao];
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ nome: nomeCargo, permissoes: permissoesSelecionadas });
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <h2 className={styles.title}>NOVO CARGO</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <FiX />
          </button>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          {/* Nome do Cargo */}
          <div className={styles.inputGroup}>
            <label>Nome do Cargo</label>
            <input
              type="text"
              placeholder="Ex: Supervisor de Vendas"
              value={nomeCargo}
              onChange={(e) => setNomeCargo(e.target.value)}
              required
            />
          </div>

          {/* Área de Permissões */}
          <div className={styles.permissionsTitle}>Permissões</div>

          <div className={styles.rolesContainer}>
            {/* Coluna Movix */}
            <div className={styles.roleColumn}>
              <div className={styles.roleHeader}>Movix</div>
              {PERMISSOES_MOVIX.map((perm) => (
                <label key={perm} className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={permissoesSelecionadas.includes(perm)}
                    onChange={() => handleCheckboxChange(perm)}
                  />
                  {perm}
                </label>
              ))}
            </div>

            {/* Coluna Força de Vendas */}
            <div className={styles.roleColumn}>
              <div className={styles.roleHeader}>Força de Vendas</div>
              {PERMISSOES_FDV.map((perm) => (
                <label key={perm} className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={permissoesSelecionadas.includes(perm)}
                    onChange={() => handleCheckboxChange(perm)}
                  />
                  {perm}
                </label>
              ))}
            </div>
          </div>

          {/* Footer */}
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
