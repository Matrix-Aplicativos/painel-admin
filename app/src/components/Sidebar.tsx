"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import "./Sidebar.css";
import {
  FiHome,
  FiUsers,
  FiShare2,
  FiUser,
  FiDollarSign,
  FiCalendar,
  FiMenu,
  FiLogOut,
  FiSmartphone, // Importei o ícone novo
} from "react-icons/fi";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
  toggleTheme: () => void;
  isDarkMode: boolean;
}

export default function Sidebar({
  isOpen,
  toggleSidebar,
  toggleTheme,
  isDarkMode,
}: SidebarProps) {
  const usuario = { nome: "Admin User" };
  const router = useRouter();
  const handleLogout = () => router.push("/");

  return (
    <div className={`sidebar ${isOpen ? "" : "closed"}`}>
      <div className="header-sidebar">
        <div className="user-info">
          {isOpen && <span>{usuario?.nome}</span>}
        </div>
        <button className="toggle-button" onClick={toggleSidebar}>
          <FiMenu size={24} />
        </button>
      </div>

      <ul className="menu">
        <li>
          <Link href="/painel" className="menu-item">
            <FiHome size={24} />
            {isOpen && <span className="menu-text">Home</span>}
          </Link>
        </li>
        <li>
          <Link href="/painel/Clientes" className="menu-item">
            <FiUsers size={24} />
            {isOpen && <span className="menu-text">Clientes</span>}
          </Link>
        </li>
        <li>
          <Link href="/painel/Integracoes" className="menu-item">
            <FiShare2 size={24} />
            {isOpen && <span className="menu-text">Integrações</span>}
          </Link>
        </li>
        <li>
          <Link href="/painel/Usuarios" className="menu-item">
            <FiUser size={24} />
            {isOpen && <span className="menu-text">Usuários</span>}
          </Link>
        </li>
        <li>
          <Link href="/painel/FluxoCaixa" className="menu-item">
            <FiDollarSign size={24} />
            {isOpen && <span className="menu-text">Fluxo de Caixa</span>}
          </Link>
        </li>
        <li>
          <Link href="/painel/Vencimentos" className="menu-item">
            <FiCalendar size={24} />
            {isOpen && <span className="menu-text">Vencimentos</span>}
          </Link>
        </li>

        {/* NOVO ITEM ADICIONADO AQUI */}
        <li>
          <Link href="/painel/VersaoMovix" className="menu-item">
            <FiSmartphone size={24} />
            {isOpen && <span className="menu-text">Versões MOVIX</span>}
          </Link>
        </li>
      </ul>

      <div className="bottom-section">
        <button className="menu-item logout" onClick={handleLogout}>
          <FiLogOut size={24} />
          {isOpen && <span className="logout-text">Sair</span>}
        </button>
      </div>
    </div>
  );
}
