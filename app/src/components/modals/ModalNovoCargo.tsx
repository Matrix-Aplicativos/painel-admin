"use client";

import { useState, useEffect, useMemo } from "react";
import styles from "./ModalNovoCargo.module.css";
import { FiX, FiCheck } from "react-icons/fi";
import useGetPermissao, {
  PermissaoItem,
} from "@/app/src/hooks/Permissao/useGetPermissao";
import usePostCargo from "@/app/src/hooks/Cargo/usePostCargo";

interface ModalNovoCargoProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void; // Alterado de onSave para onSuccess
}

export default function ModalNovoCargo({
  isOpen,
  onClose,
  onSuccess,
}: ModalNovoCargoProps) {
  const [nomeCargo, setNomeCargo] = useState("");
  const [permissoesSelecionadas, setPermissoesSelecionadas] = useState<
    number[]
  >([]);

  // Hook de GET Permissões (Busca todas)
  const { permissoes, loading: loadingPermissoes } = useGetPermissao({
    pagina: 1,
    porPagina: 100,
    orderBy: "nome",
    direction: "asc",
  });

  // Hook de POST Cargo (Salvar)
  const { createCargo, loading: saving } = usePostCargo();

  // Limpa o form ao abrir
  useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setNomeCargo("");
      setPermissoesSelecionadas([]);
    }
  }, [isOpen]);

  // Agrupamento de Permissões
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

  const handleCheckboxChange = (codPermissao: number) => {
    setPermissoesSelecionadas((prev) => {
      if (prev.includes(codPermissao)) {
        return prev.filter((id) => id !== codPermissao);
      } else {
        return [...prev, codPermissao];
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nomeCargo) {
      alert("Preencha o nome do cargo.");
      return;
    }

    // Chama a API para criar o cargo
    const sucesso = await createCargo({
      nome: nomeCargo,
      permissoes: permissoesSelecionadas,
    });

    if (sucesso) {
      onSuccess(); // Avisa o pai que deu certo (para dar refresh na lista se necessário)
      onClose(); // Fecha o modal
    }
  };

  if (!isOpen) return null;

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
          disabled={saving} // Desabilita durante o salvamento
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
          <button
            className={styles.closeButton}
            onClick={onClose}
            disabled={saving}
          >
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
              disabled={saving}
            />
          </div>

          <div className={styles.permissionsTitle}>Permissões</div>

          {loadingPermissoes ? (
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
              disabled={saving}
            >
              Cancelar
            </button>
            <button type="submit" className={styles.btnSave} disabled={saving}>
              {saving ? "Salvando..." : "Salvar"} <FiCheck />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
