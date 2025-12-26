"use client";

import { useState, useEffect } from "react";
import styles from "./ModalCliente.module.css";
import { FiX, FiCheck, FiSearch } from "react-icons/fi";
import ModalMunicipio from "./ModalMunicipio";
import usePostCliente, {
  ClientePayload,
} from "@/app/src/hooks/Cliente/usePostCliente";
import { MunicipioItem } from "../../hooks/Municipio/useGetMunicipio";

interface ModalClienteProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: any;
}

export default function ModalCliente({
  isOpen,
  onClose,
  onSuccess,
  initialData,
}: ModalClienteProps) {
  const [isMunicipioOpen, setIsMunicipioOpen] = useState(false);
  const { saveCliente, loading } = usePostCliente();

  // Estado simplificado para bater com os campos da imagem
  const [formData, setFormData] = useState({
    razaosocial: "",
    cnpj: "",
    cep: "",
    logradouro: "", // Atua como "Endereço" na imagem
    complemento: "",
    cidadeNome: "",
    situacao: "1",
  });

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          razaosocial: initialData.razaosocial || "",
          cnpj: initialData.cnpj || "",
          cep: initialData.cep || "",
          logradouro: initialData.endereco || "",
          complemento: "",
          cidadeNome: "",
          situacao: initialData.situacao || "1",
        });
      } else {
        setFormData({
          razaosocial: "",
          cnpj: "",
          cep: "",
          logradouro: "",
          complemento: "",
          cidadeNome: "",
          situacao: "1",
        });
      }
    }
  }, [isOpen, initialData]);

  const maskCNPJ = (value: string) => {
    return value
      .replace(/\D/g, "")
      .replace(/^(\d{2})(\d)/, "$1.$2")
      .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/\.(\d{3})(\d)/, ".$1/$2")
      .replace(/(\d{4})(\d)/, "$1-$2")
      .slice(0, 18);
  };

  const maskCEP = (value: string) => {
    return value
      .replace(/\D/g, "")
      .replace(/^(\d{5})(\d)/, "$1-$2")
      .slice(0, 9);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    let finalValue = value;

    if (name === "cnpj") finalValue = maskCNPJ(value);
    if (name === "cep") finalValue = maskCEP(value);

    setFormData((prev) => ({ ...prev, [name]: finalValue }));
  };

  const handleCidadeSelect = (cidade: MunicipioItem) => {
    setFormData((prev) => ({
      ...prev,
      cidadeNome: `${cidade.nome} - ${cidade.uf}`,
    }));
    setIsMunicipioOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Concatena endereço para salvar no banco legado
    const partesEndereco = [
      formData.logradouro,
      formData.complemento ? `Comp: ${formData.complemento}` : "",
      formData.cidadeNome,
    ]
      .filter(Boolean)
      .join(", ");

    const payload: ClientePayload = {
      codcliente: initialData?.codcliente || null,
      razaosocial: formData.razaosocial,
      cnpj: formData.cnpj.replace(/\D/g, ""),
      cep: formData.cep.replace(/\D/g, ""),
      endereco: partesEndereco,
      observacoes: "", // Campo removido da tela
      situacao: formData.situacao,
    };

    const sucesso = await saveCliente(payload);

    if (sucesso) {
      onSuccess();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <ModalMunicipio
        isOpen={isMunicipioOpen}
        onClose={() => setIsMunicipioOpen(false)}
        onSelect={handleCidadeSelect}
      />

      <div className={styles.overlay}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h2 className={styles.title}>
              {initialData ? "EDITAR CLIENTE" : "NOVO CLIENTE"}
            </h2>
            <button
              className={styles.closeButton}
              onClick={onClose}
              type="button"
              disabled={loading}
            >
              <FiX />
            </button>
          </div>

          <form className={styles.form} onSubmit={handleSubmit}>
            {/* Linha 1: Razão Social (Full Width) */}
            <div className={styles.formRow}>
              <div className={styles.inputGroup}>
                <label>Razão Social</label>
                <input
                  name="razaosocial"
                  type="text"
                  placeholder="Razão Social do Cliente"
                  value={formData.razaosocial}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* Linha 2: CNPJ e CEP */}
            <div className={styles.formRow}>
              <div className={styles.inputGroup} style={{ flex: 2 }}>
                <label>CNPJ</label>
                <input
                  name="cnpj"
                  type="text"
                  placeholder="CNPJ da Empresa"
                  value={formData.cnpj}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>
              <div className={styles.inputGroup} style={{ flex: 1 }}>
                <label>CEP</label>
                <input
                  name="cep"
                  type="text"
                  placeholder="78000-000"
                  value={formData.cep}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
            </div>

            {/* Linha 3: Cidade e Endereço */}
            <div className={styles.formRow}>
              <div className={styles.inputGroup} style={{ flex: 1.2 }}>
                <label>Cidade</label>
                <div className={styles.inputWrapperRelative}>
                  <input
                    name="cidadeNome"
                    type="text"
                    placeholder="Cidade"
                    value={formData.cidadeNome}
                    readOnly
                    onClick={() => !loading && setIsMunicipioOpen(true)}
                    style={{
                      cursor: "pointer",
                      backgroundColor: loading ? "#eee" : "#fff",
                    }}
                  />
                  <FiSearch
                    className={styles.searchIcon}
                    size={16}
                    style={{
                      position: "absolute",
                      right: 10,
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "#1769e3",
                    }}
                  />
                </div>
              </div>

              <div className={styles.inputGroup} style={{ flex: 2 }}>
                <label>Endereço</label>
                <input
                  name="logradouro"
                  type="text"
                  placeholder="Endereço do Cliente"
                  value={formData.logradouro}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
            </div>

            {/* Linha 4: Complemento e Situação */}
            <div className={styles.formRow}>
              <div className={styles.inputGroup} style={{ flex: 2 }}>
                <label>Complemento</label>
                <input
                  name="complemento"
                  type="text"
                  placeholder="Complemento de Endereço"
                  value={formData.complemento}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
              <div className={styles.inputGroup} style={{ flex: 1 }}>
                <label>Situação</label>
                <select
                  name="situacao"
                  value={formData.situacao}
                  onChange={handleChange}
                  disabled={loading}
                >
                  <option value="1">Ativo</option>
                  <option value="2">Cancelado</option>
                  <option value="3">Em Negociação</option>
                  <option value="4">Prospecção</option>
                </select>
              </div>
            </div>

            {/* Footer com Cancelar e Salvar */}
            <div className={styles.footer}>
              <button
                type="button"
                className={styles.btnCancel}
                onClick={onClose}
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className={styles.btnSave}
                disabled={loading}
              >
                {loading ? "Salvando..." : "Salvar"} <FiCheck />
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
