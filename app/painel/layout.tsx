"use client";
import { useState } from "react";
import Sidebar from "../src/components/Sidebar";

export default function PainelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    document.documentElement.setAttribute(
      "data-theme",
      newMode ? "dark" : "light"
    );
  };

  return (
    <div className="painel-body">
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        toggleTheme={toggleTheme}
        isDarkMode={isDarkMode}
      />
      <main className="content-main">{children}</main>
    </div>
  );
}
