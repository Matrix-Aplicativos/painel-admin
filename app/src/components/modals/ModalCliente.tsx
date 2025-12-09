"use client";

import { useState, useEffect } from "react";
import styles from "./ModalCliente.module.css";
import { FiX, FiCheck, FiSearch } from "react-icons/fi";
import ModalMunicipio from "./ModalMunicipio";

interface ClienteData {
  id?: number;
  razaoSocial: string;
  cnpj: string;
  cep: string;
  cidade: string;
  endereco: string;
  complemento: string; // Mudou de bairro para complemento
  descricaoIntegracao: string; // Novo campo
  situacao: string;
}

interface ModalClienteProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ClienteData) => void;
  initialData?: ClienteData | null;
}

export default function ModalCliente({
  isOpen,
  onClose,
  onSave,
  initialData,
}: ModalClienteProps) {
  const [isMunicipioOpen, setIsMunicipioOpen] = useState(false);

  const [formData, setFormData] = useState<ClienteData>({
    razaoSocial: "",
    cnpj: "",
    cep: "",
    cidade: "",
    endereco: "",
    complemento: "",
    descricaoIntegracao: "",
    situacao: "Ativo",
  });

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

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData(initialData);
      } else {
        setFormData({
          razaoSocial: "",
          cnpj: "",
          cep: "",
          cidade: "",
          endereco: "",
          complemento: "",
          descricaoIntegracao: "",
          situacao: "Ativo",
        });
      }
    }
  }, [isOpen, initialData]);

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

  const handleCidadeSelect = (cidadeCompleta: string) => {
    setFormData((prev) => ({ ...prev, cidade: cidadeCompleta }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
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
            >
              <FiX />
            </button>
          </div>

          <form className={styles.form} onSubmit={handleSubmit}>
            {/* Linha 1 */}
            <div className={styles.formRow}>
              <div className={styles.inputGroup}>
                <label>Razão Social</label>
                <input
                  name="razaoSocial"
                  type="text"
                  placeholder="Nome da Empresa"
                  value={formData.razaoSocial}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className={styles.inputGroup}>
                <label>CNPJ</label>
                <input
                  name="cnpj"
                  type="text"
                  placeholder="00.000.000/0000-00"
                  value={formData.cnpj}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Linha 2 */}
            <div className={styles.formRow}>
              <div className={styles.inputGroup} style={{ flex: 0.4 }}>
                <label>CEP</label>
                <input
                  name="cep"
                  type="text"
                  placeholder="00000-000"
                  value={formData.cep}
                  onChange={handleChange}
                />
              </div>

              <div className={styles.inputGroup}>
                <label>Cidade</label>
                <div className={styles.inputWrapperRelative}>
                  <input
                    name="cidade"
                    type="text"
                    placeholder="Clique para selecionar"
                    value={formData.cidade}
                    readOnly
                    onClick={() => setIsMunicipioOpen(true)}
                  />
                  <FiSearch className={styles.searchIcon} size={16} />
                </div>
              </div>
            </div>

            {/* Linha 3: Endereço e Complemento */}
            <div className={styles.formRow}>
              <div className={styles.inputGroup}>
                <label>Endereço</label>
                <input
                  name="endereco"
                  type="text"
                  placeholder="Rua, Número"
                  value={formData.endereco}
                  onChange={handleChange}
                />
              </div>
              <div className={styles.inputGroup}>
                <label>Complemento</label>
                <input
                  name="complemento"
                  type="text"
                  placeholder="Apto, Bloco, Sala..."
                  value={formData.complemento}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Linha 4: Descrição Integração e Situação */}
            <div className={styles.formRow}>
              <div className={styles.inputGroup} style={{ flex: 2 }}>
                <label>Descrição da Integração</label>
                <input
                  name="descricaoIntegracao"
                  type="text"
                  placeholder="Ex: Integração ERP Protheus"
                  value={formData.descricaoIntegracao}
                  onChange={handleChange}
                />
              </div>
              <div className={styles.inputGroup} style={{ flex: 1 }}>
                <label>Situação</label>
                <select
                  name="situacao"
                  value={formData.situacao}
                  onChange={handleChange}
                >
                  <option value="Ativo">Ativo</option>
                  <option value="Inativo">Inativo</option>
                </select>
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
    </>
  );
}
