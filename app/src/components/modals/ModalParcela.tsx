"use client";

import { useState, useEffect, useRef } from "react";
import styles from "./ModalParcela.module.css";
import { FiChevronLeft, FiCheck, FiCalendar } from "react-icons/fi";

interface ParcelaData {
  id?: number;
  parcela: string | number;
  valor: string | number;
  vencimento: string;
  tipo: string;
  dataPagamento: string;
}

interface ModalParcelaProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ParcelaData) => void;
  initialData?: ParcelaData | null;
}

export default function ModalParcela({
  isOpen,
  onClose,
  onSave,
  initialData,
}: ModalParcelaProps) {
  // Refs para controlar os inputs de data invisíveis
  const vencimentoRef = useRef<HTMLInputElement>(null);
  const pagamentoRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<ParcelaData>({
    parcela: "",
    valor: "",
    vencimento: "",
    tipo: "",
    dataPagamento: "",
  });

  // --- MÁSCARAS ---
  const maskCurrency = (value: string) => {
    const cleanValue = value.replace(/\D/g, "");
    if (!cleanValue) return "";
    const numberValue = Number(cleanValue) / 100;
    return numberValue.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const maskDate = (value: string) => {
    const v = value.replace(/\D/g, "").slice(0, 8);
    if (v.length >= 5) return `${v.slice(0, 2)}/${v.slice(2, 4)}/${v.slice(4)}`;
    if (v.length >= 3) return `${v.slice(0, 2)}/${v.slice(2)}`;
    return v;
  };

  // --- HANDLERS ---

  // Função Mágica: Abre o calendário nativo quando clica no ícone
  const abrirCalendario = (ref: React.RefObject<HTMLInputElement>) => {
    try {
      if (ref.current) {
        // "showPicker" é o método moderno para abrir o calendário
        // @ts-ignore (TypeScript antigo pode reclamar, mas funciona nos navegadores modernos)
        if (ref.current.showPicker) {
          // @ts-ignore
          ref.current.showPicker();
        } else {
          // Fallback: foca no input para tentar disparar (mobile)
          ref.current.focus();
          ref.current.click();
        }
      }
    } catch (error) {
      console.log("Navegador não suporta showPicker programático", error);
    }
  };

  // Recebe a data do calendário (YYYY-MM-DD) e joga pro texto (DD/MM/AAAA)
  const handleDatePickerChange = (dateValue: string, fieldName: string) => {
    if (!dateValue) return;
    const [year, month, day] = dateValue.split("-");
    const formattedDate = `${day}/${month}/${year}`;
    setFormData((prev) => ({ ...prev, [fieldName]: formattedDate }));
  };

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          ...initialData,
          valor:
            typeof initialData.valor === "number"
              ? initialData.valor.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })
              : initialData.valor,
        });
      } else {
        setFormData({
          parcela: "",
          valor: "",
          vencimento: "",
          tipo: "",
          dataPagamento: "",
        });
      }
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCurrencyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, valor: maskCurrency(e.target.value) }));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: maskDate(e.target.value),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.container}>
        <div className={styles.header}>
          <button className={styles.backButton} onClick={onClose} type="button">
            <FiChevronLeft />
          </button>
          <h2 className={styles.title}>
            {initialData ? "EDITAR PARCELA" : "NOVA PARCELA"}
          </h2>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          {/* NÚMERO PARCELA */}
          <div className={styles.inputGroup}>
            <label>Nº da Parcela</label>
            <input
              name="parcela"
              type="number"
              placeholder="1"
              value={formData.parcela}
              onChange={handleChange}
            />
          </div>

          {/* VALOR */}
          <div className={styles.inputGroup}>
            <label>Valor</label>
            <input
              name="valor"
              type="text"
              placeholder="R$ 0,00"
              value={formData.valor}
              onChange={handleCurrencyChange}
            />
          </div>

          {/* DATA VENCIMENTO */}
          <div className={styles.inputGroup}>
            <label>Data Vencimento</label>
            <div className={styles.dateWrapper}>
              <input
                name="vencimento"
                type="text"
                placeholder="DD/MM/AAAA"
                value={formData.vencimento}
                onChange={handleDateChange}
                maxLength={10}
              />
              {/* Ícone Clicável */}
              <FiCalendar
                className={styles.calendarIcon}
                size={18}
                onClick={() => abrirCalendario(vencimentoRef)}
              />
              {/* Input Nativo Invisível */}
              <input
                type="date"
                ref={vencimentoRef}
                className={styles.hiddenDatePicker}
                onChange={(e) =>
                  handleDatePickerChange(e.target.value, "vencimento")
                }
              />
            </div>
          </div>

          {/* TIPO */}
          <div className={styles.inputGroup}>
            <label>Tipo</label>
            <select name="tipo" value={formData.tipo} onChange={handleChange}>
              <option value="">Selecione</option>
              <option value="Ativação">Ativação</option>
              <option value="Manutenção">Manutenção</option>
              <option value="Serviço">Serviço</option>
              <option value="Serviço">Outros</option>
            </select>
          </div>

          {/* DATA PAGAMENTO */}
          <div className={styles.inputGroup}>
            <label>Data Pagamento</label>
            <div className={styles.dateWrapper}>
              <input
                name="dataPagamento"
                type="text"
                placeholder="DD/MM/AAAA"
                value={formData.dataPagamento}
                onChange={handleDateChange}
                maxLength={10}
              />
              {/* Ícone Clicável */}
              <FiCalendar
                className={styles.calendarIcon}
                size={18}
                onClick={() => abrirCalendario(pagamentoRef)}
              />
              {/* Input Nativo Invisível */}
              <input
                type="date"
                ref={pagamentoRef}
                className={styles.hiddenDatePicker}
                onChange={(e) =>
                  handleDatePickerChange(e.target.value, "dataPagamento")
                }
              />
            </div>
          </div>

          <button type="submit" className={styles.btnSave}>
            Salvar <FiCheck />
          </button>
        </form>
      </div>
    </div>
  );
}
