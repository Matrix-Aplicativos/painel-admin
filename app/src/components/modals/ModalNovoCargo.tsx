"use client";

import { useState, useEffect, useMemo } from "react";
import styles from "./ModalNovoCargo.module.css";
import { FiX, FiCheck } from "react-icons/fi";
import useGetPermissao, {
  PermissaoItem,
} from "@/app/src/hooks/Permissao/useGetPermissao";

interface ModalNovoCargoProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (cargo: { nome: string; permissoes: number[] }) => void;
}

export default function ModalNovoCargo({
  isOpen,
  onClose,
  onSave,
}: ModalNovoCargoProps) {
  const [nomeCargo, setNomeCargo] = useState("");

  // Guardaremos os IDs das permissões selecionadas
  const [permissoesSelecionadas, setPermissoesSelecionadas] = useState<
    number[]
  >([]);

  // Hook de Permissões (Busca todas para exibir)
  const { permissoes, loading } = useGetPermissao({
    pagina: 1,
    porPagina: 100, // Traz todas
    orderBy: "nome",
    direction: "asc",
  });

  // Limpa o form ao abrir
  useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setNomeCargo("");
      setPermissoesSelecionadas([]);
    }
  }, [isOpen]);

  const { permsMovix, permsFdv, permsOutros } = useMemo(() => {
    const movix: PermissaoItem[] = [];
    const fdv: PermissaoItem[] = [];
    const outros: PermissaoItem[] = [];

    permissoes.forEach((p) => {
      const nome = p.nome.toUpperCase();
      if (nome.includes("MOVIX")) {
        movix.push(p);
      } else if (nome.includes("FDV")) {
        fdv.push(p);
      } else {
        outros.push(p);
      }
    });

    return { permsMovix: movix, permsFdv: fdv, permsOutros: outros };
  }, [permissoes]);

  if (!isOpen) return null;

  const handleCheckboxChange = (codPermissao: number) => {
    setPermissoesSelecionadas((prev) => {
      if (prev.includes(codPermissao)) {
        return prev.filter((id) => id !== codPermissao);
      } else {
        return [...prev, codPermissao];
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nomeCargo) {
      alert("Preencha o nome do cargo.");
      return;
    }
    onSave({ nome: nomeCargo, permissoes: permissoesSelecionadas });
  };

  const renderPermissaoList = (lista: PermissaoItem[]) => {
    if (lista.length === 0)
      return (
        <p style={{ fontSize: "12px", color: "#ccc", fontStyle: "italic" }}>
          Nenhuma permissão.
        </p>
      );

    return lista.map((perm) => (
      <label
        key={perm.codPermissao}
        className={styles.checkboxLabel}
        title={perm.descricao}
      >
        <input
          type="checkbox"
          checked={permissoesSelecionadas.includes(perm.codPermissao)}
          onChange={() => handleCheckboxChange(perm.codPermissao)}
        />
        {perm.nome
          .replace("PERM_", "")
          .replace("MOVIX_", "")
          .replace("FDV_", "")
          .replaceAll("_", " ")}
      </label>
    ));
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>NOVO CARGO</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <FiX />
          </button>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
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

          <div className={styles.permissionsTitle}>Permissões</div>

          {loading ? (
            <p style={{ textAlign: "center", color: "#666" }}>
              Carregando permissões...
            </p>
          ) : (
            <div className={styles.rolesContainer}>
              <div className={styles.roleColumn}>
                <div className={styles.roleHeader}>Movix</div>
                {renderPermissaoList(permsMovix)}
              </div>

              <div className={styles.roleColumn}>
                <div className={styles.roleHeader}>Força de Vendas</div>
                {renderPermissaoList(permsFdv)}
              </div>
              {permsOutros.length > 0 && (
                <div className={styles.roleColumn}>
                  <div className={styles.roleHeader}>Outros</div>
                  {renderPermissaoList(permsOutros)}
                </div>
              )}
            </div>
          )}

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
