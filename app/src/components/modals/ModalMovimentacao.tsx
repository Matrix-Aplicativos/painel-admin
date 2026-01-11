"use client";

import { useState, useEffect } from "react";
import styles from "./ModalMovimentacao.module.css";
import {
  FiX,
  FiCheck,
  FiArrowUpCircle,
  FiArrowDownCircle,
} from "react-icons/fi";

interface MovimentacaoData {
  codmovimentacao?: number | null;
  descricao: string;
  valor: string | number;
  datapagamento: string;
  categoria: string;
  subcategoria: string;
  tipo?: "entrada" | "saida";
}

interface ModalMovimentacaoProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: MovimentacaoData) => void;
  initialData?: any;
}

export default function ModalMovimentacao({
  isOpen,
  onClose,
  onSave,
  initialData,
}: ModalMovimentacaoProps) {
  const [formData, setFormData] = useState<MovimentacaoData>({
    descricao: "",
    valor: "",
    datapagamento: "",
    categoria: "",
    subcategoria: "",
    tipo: "entrada",
  });

  const maskCurrency = (value: string) => {
    const cleanValue = value.replace(/\D/g, "");
    if (!cleanValue) return "";
    const numberValue = Number(cleanValue) / 100;
    return numberValue.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  // Função para pegar a data atual no fuso local no formato YYYY-MM-DD
  const getHojeLocal = () => {
    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = String(hoje.getMonth() + 1).padStart(2, "0");
    const dia = String(hoje.getDate()).padStart(2, "0");
    return `${ano}-${mes}-${dia}`;
  };

  // No arquivo ModalMovimentacao

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        const valorRaw = Number(initialData.valor);
        const isSaida = valorRaw < 0;
        const valorAbs = Math.abs(valorRaw);
        const dataFormatada = initialData.datapagamento
          ? initialData.datapagamento.split("T")[0]
          : "";

        setFormData({
          codmovimentacao: initialData.codmovimentacao,
          descricao: initialData.descricao || "",
          valor: valorAbs.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          }),
          datapagamento: dataFormatada, 
          categoria: initialData.categoria || "",
          subcategoria: initialData.subcategoria || "",
          tipo: isSaida ? "saida" : "entrada",
        });
      } else {
        setFormData({
          descricao: "",
          valor: "",
          datapagamento: getHojeLocal(),
          categoria: "",
          subcategoria: "",
          tipo: "entrada",
        });
      }
    }
  }, [isOpen, initialData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCurrencyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, valor: maskCurrency(e.target.value) }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let valorFinal =
      typeof formData.valor === "string"
        ? Number(
            formData.valor
              .replace("R$", "")
              .replace(/\./g, "")
              .replace(",", ".")
              .trim()
          )
        : formData.valor;

    if (formData.tipo === "saida") {
      valorFinal = valorFinal * -1;
    }

    onSave({
      ...formData,
      valor: valorFinal,
    });
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>
            {initialData ? "EDITAR MOVIMENTAÇÃO" : "NOVA MOVIMENTAÇÃO"}
          </h2>
          <button className={styles.closeButton} onClick={onClose}>
            <FiX />
          </button>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label>Descrição</label>
            <input
              name="descricao"
              type="text"
              placeholder="Ex: Venda de Serviços"
              value={formData.descricao}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formRow}>
            <div className={styles.inputGroup}>
              <label>Valor</label>
              <input
                name="valor"
                type="text"
                placeholder="R$ 0,00"
                value={formData.valor}
                onChange={handleCurrencyChange}
                required
              />
            </div>
            <div className={styles.inputGroup}>
              <label>Data</label>
              <input
                name="datapagamento"
                type="date"
                value={formData.datapagamento}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.inputGroup}>
              <label>Categoria</label>
              <input
                name="categoria"
                type="text"
                placeholder="Ex: Receita"
                value={formData.categoria}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.inputGroup}>
              <label>Sub Categoria</label>
              <input
                name="subcategoria"
                type="text"
                placeholder="Ex: Energia"
                value={formData.subcategoria}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label>Tipo de Movimentação</label>
            <div className={styles.typeSelector}>
              <button
                type="button"
                className={`${styles.typeButton} ${styles.entrada} ${
                  formData.tipo === "entrada" ? styles.active : ""
                }`}
                onClick={() =>
                  setFormData((prev) => ({ ...prev, tipo: "entrada" }))
                }
              >
                <FiArrowUpCircle size={18} /> Entrada (Receita)
              </button>
              <button
                type="button"
                className={`${styles.typeButton} ${styles.saida} ${
                  formData.tipo === "saida" ? styles.active : ""
                }`}
                onClick={() =>
                  setFormData((prev) => ({ ...prev, tipo: "saida" }))
                }
              >
                <FiArrowDownCircle size={18} /> Saída (Despesa)
              </button>
            </div>
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
