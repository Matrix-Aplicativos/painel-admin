"use client";

import { useState } from "react";
import styles from "./Calendar.module.css";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const MOCK_VENCIMENTOS = [
  {
    id: 1,
    cliente: "Supermercado Modelo",
    valor: 1500.0,
    data: "2025-12-05",
    categoria: "Vendas",
    status: "pago",
  },
  {
    id: 2,
    cliente: "Tech Soluções",
    valor: 500.0,
    data: "2025-12-05",
    categoria: "Serviço",
    status: "atrasado",
  },
  {
    id: 3,
    cliente: "Padaria do João",
    valor: 250.0,
    data: "2025-12-12",
    categoria: "Manutenção",
    status: "pendente",
  },
  {
    id: 4,
    cliente: "Consultoria ABC",
    valor: 3200.0,
    data: "2025-12-15",
    categoria: "Consultoria",
    status: "pendente",
  },
  {
    id: 6,
    cliente: "Scotch Store",
    valor: 120.0,
    data: "2025-12-02",
    categoria: "Manutenção",
    status: "atrasado",
  },
  {
    id: 7,
    cliente: "Transportadora Veloz",
    valor: 10000.0,
    data: "2025-12-30",
    categoria: "Contrato",
    status: "pendente",
  },
];

export default function VencimentosPage() {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 11, 1));

  const changeMonth = (offset: number) => {
    const newDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + offset,
      1
    );
    setCurrentDate(newDate);
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonthDays = new Date(year, month, 0).getDate();

  const getStatusClass = (status: string) => {
    switch (status) {
      case "atrasado":
        return styles.statusLate;
      case "pago":
        return styles.statusPaid;
      default:
        return styles.statusPending;
    }
  };

  const renderDays = () => {
    const totalCells = 42; 
    const days = [];

    for (let i = firstDayIndex; i > 0; i--) {
      days.push(
        <div
          key={`prev-${i}`}
          className={`${styles.dayCell} ${styles.otherMonth}`}
        >
          <span className={styles.dayNumber}>{prevMonthDays - i + 1}</span>
        </div>
      );
    }

    const today = new Date();
    for (let i = 1; i <= daysInMonth; i++) {
      const isToday =
        i === today.getDate() &&
        month === today.getMonth() &&
        year === today.getFullYear();

      const dateString = `${year}-${String(month + 1).padStart(
        2,
        "0"
      )}-${String(i).padStart(2, "0")}`;
      const dayEvents = MOCK_VENCIMENTOS.filter((v) => v.data === dateString);

      days.push(
        <div
          key={i}
          className={`${styles.dayCell} ${isToday ? styles.currentDay : ""}`}
        >
          <span className={styles.dayNumber}>{i}</span>

          <div className={styles.eventList}>
            {dayEvents.map((event) => (
              <div
                key={event.id}
                className={`${styles.eventCard} ${getStatusClass(
                  event.status
                )}`}
              >
                <span className={styles.clientName} title={event.cliente}>
                  {event.cliente}
                </span>
                <span className={styles.categoryTag}>{event.categoria}</span>
                <span className={styles.cardValue}>
                  {event.valor.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }

    const filledCells = days.length;
    const remainingCells = totalCells - filledCells;

    for (let i = 1; i <= remainingCells; i++) {
      days.push(
        <div
          key={`next-${i}`}
          className={`${styles.dayCell} ${styles.otherMonth}`}
        >
          <span className={styles.dayNumber}>{i}</span>
        </div>
      );
    }

    return days;
  };

  const formatMonthYear = (date: Date) => {
    const str = date.toLocaleDateString("pt-BR", {
      month: "long",
      year: "numeric",
    });
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>CALENDÁRIO DE VENCIMENTOS</h1>

        <div className={styles.monthNavigator}>
          <button onClick={() => changeMonth(-1)} className={styles.navButton}>
            <FiChevronLeft size={24} />
          </button>
          <div className={styles.monthTitle}>
            {formatMonthYear(currentDate)}
          </div>
          <button onClick={() => changeMonth(1)} className={styles.navButton}>
            <FiChevronRight size={24} />
          </button>
        </div>

        <div style={{ width: "200px" }}></div>
      </div>

      <div className={styles.calendarContainer}>
        <div className={styles.weekHeader}>
          {[
            "Domingo",
            "Segunda",
            "Terça",
            "Quarta",
            "Quinta",
            "Sexta",
            "Sábado",
          ].map((day) => (
            <div key={day} className={styles.weekDay}>
              {day}
            </div>
          ))}
        </div>
        <div className={styles.daysGrid}>{renderDays()}</div>
      </div>
    </div>
  );
}
