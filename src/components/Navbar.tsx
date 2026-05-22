import { 
  Shield, 
  LogOut, 
  Menu, 
  X, 
  User, 
  UserCheck, 
  HeartHandshake, 
  BookOpen, 
  Clock, 
  BadgeCheck,
  Calculator,
  Briefcase,
  FileText,
  Home,
  GraduationCap,
  Sparkles,
  HelpCircle
} from "lucide-react";
import { useState } from "react";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { motion } from "motion/react";
import { getUserFriendlyName } from "../lib/userUtils";

interface NavbarProps {
  activeModule: string;
  setActiveModule: (module: string) => void;
  user: any; // Firebase logged in User (or virtual fallback user)
  onSignOut: () => void;
  onOpenAuthModal: () => void;
  onOpenModal: (type: "sobre" | "politicas" | "cursos" | "ajuda") => void;
  isDataSaver: boolean;
  onToggleDataSaver: () => void;
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
}

export default function Navbar({
  activeModule,
  setActiveModule,
  user,
  onSignOut,
  onOpenAuthModal,
  onOpenModal,
  isDataSaver,
  onToggleDataSaver,
  isDarkMode = false,
  onToggleDarkMode = () => {},
}: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Erro ao efetuar logout no Firebase:", err);
    }
    onSignOut();
  };

  const isUserAdmin = user && user.email === "admin@jonsonjb.com";

  // Navigation Items augmented with specialized modern icons and short subtitles
  const navItems = [
    { 
      id: "engenharia", 
      label: "Cálculos & Obras", 
      icon: Calculator,
      color: "text-orange-400",
      bgHover: "hover:bg-orange-500/10" 
    },
    { 
      id: "fixmoz", 
      label: "FixMoz Empregos", 
      icon: Briefcase,
      color: "text-blue-400",
      bgHover: "hover:bg-blue-500/10" 
    },
    { 
      id: "digitais", 
      label: "Serviços Digitais", 
      icon: FileText,
      color: "text-purple-400",
      bgHover: "hover:bg-purple-500/10" 
    },
    { 
      id: "kayamoz", 
      label: "KayaMoz Imóveis", 
      icon: Home,
      color: "text-emerald-400",
      bgHover: "hover:bg-emerald-500/10" 
    },
  ];

  // Helper to extract a friendly abbreviation from user email
  const getUserInitials = () => {
    const friendlyName = getUserFriendlyName(user);
    if (!friendlyName) return "U";
    const parts = friendlyName.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
    }
    return friendlyName.substring(0, 2).toUpperCase();
  };

  return (
    <div className="flex flex-col sticky top-0 z-40 shadow-md font-sans" id="main-navigation-wrapper">
      {/* 1. SLIM AND INTELLIGENT TOP RIBBON (Menu Superior Slim e Interativo) */}
      <div className="bg-[#151f2b] text-gray-300 py-2 border-b border-white/5 text-[10.5px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-orange-400 font-semibold text-center md:text-left">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
            </span>
            <span className="tracking-wide">✨ TODOS OS SERVIÇOS TÉCNICOS SÃO 100% GRATUITOS • NETEK MOÇAMBIQUE</span>
          </div>
          <div className="flex items-center gap-3.5 flex-wrap justify-center">
            <button
              onClick={onToggleDataSaver}
              className={`transition-all cursor-pointer flex items-center gap-1 font-extrabold px-2.5 py-0.5 rounded-lg border text-[10px] ${
                isDataSaver
                  ? "bg-orange-500 hover:bg-[#e05a00] text-white border-orange-500 animate-pulse"
                  : "bg-white/5 hover:bg-orange-500/15 text-orange-300 border-white/10"
              }`}
              title="Activar poupança extrema no consumo de dados (megas)"
            >
              🚀 {isDataSaver ? "Poupar Megas: ATIVO 🚫🖼️" : "Modo Poupar Megas"}
            </button>
            <button
              onClick={onToggleDarkMode}
              className="transition-all cursor-pointer flex items-center gap-1 font-extrabold px-2.5 py-0.5 rounded-lg border text-[10px] bg-white/5 hover:bg-white/10 text-yellow-300 hover:text-white border-white/10"
              title="Alternar entre Tema Claro e Tema Escuro (Modo Noturno)"
            >
              {isDarkMode ? "🌙 Modo Escuro" : "☀️ Modo Claro"}
            </button>
            <button
              onClick={() => onOpenModal("sobre")}
              className="hover:text-white transition-all cursor-pointer flex items-center gap-1 font-medium bg-white/5 hover:bg-white/10 px-2 py-0.5 rounded-lg"
            >
              📖 Sobre &amp; Líder Jonson JB
            </button>
            <button
              onClick={() => onOpenModal("cursos")}
              className="hover:text-white transition-all cursor-pointer text-emerald-400 flex items-center gap-1 font-bold bg-emerald-500/10 hover:bg-emerald-500/20 px-2 py-0.5 rounded-lg"
            >
              🎓 Cursos Extra (Grátis)
            </button>
            <button
              onClick={() => onOpenModal("politicas")}
              className="hover:text-white transition-all cursor-pointer flex items-center gap-1 font-medium bg-white/5 hover:bg-white/10 px-2 py-0.5 rounded-lg"
            >
              ⚖️ Termos &amp; Privacidade
            </button>
            <button
              onClick={() => onOpenModal("ajuda")}
              className="hover:text-white transition-all cursor-pointer text-orange-400 flex items-center gap-1 font-bold bg-orange-500/10 hover:bg-orange-600 hover:text-white px-2.5 py-0.5 rounded-lg animate-pulse"
            >
              💖 Manter Site Online (Apoio M-Pesa)
            </button>
          </div>
        </div>
      </div>

      {/* 2. CHIC SLIM CORE NAVIGATION BAR */}
      <nav className="bg-[#2c3e50] text-white border-b border-white/5 transition-all" id="main-navigation-bar">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-14 items-center">
            
            {/* Logo Brand Area with Micro Interaction */}
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="flex items-center gap-2.5 cursor-pointer"
              onClick={() => setActiveModule("engenharia")}
            >
              <div className="bg-white p-1 rounded-xl shadow-inner">
                <div className="bg-[#ff6600] text-white w-7.5 h-7.5 rounded-lg flex items-center justify-center font-black text-sm tracking-wider">
                  NK
                </div>
              </div>
              <div>
                <span className="font-extrabold text-sm sm:text-base block tracking-tight leading-none">
                  Netek <span className="text-[#ff6600]">Services</span>
                </span>
                <span className="text-[9px] text-gray-300 block font-mono mt-0.5">
                  by Jonson JB
                </span>
              </div>
            </motion.div>

            {/* Desktop Navigation Link Pills with Shared Layout Animation */}
            <div className="hidden md:flex items-center space-x-1" id="desktop-nav-links">
              {navItems.map((item) => {
                const IconComponent = item.icon;
                const isActive = activeModule === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveModule(item.id)}
                    className="relative px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 overflow-hidden group select-none"
                  >
                    {/* Sliding orange pill beneath */}
                    {isActive && (
                      <motion.div
                        layoutId="active-nav-pill"
                        transition={{ type: "spring", stiffness: 350, damping: 30 }}
                        className="absolute inset-0 bg-[#ff6600] rounded-xl z-0"
                      />
                    )}
                    
                    {/* Content on top */}
                    <span className={`relative z-10 transition-colors ${isActive ? "text-white" : `${item.color} group-hover:scale-110 duration-200`}`}>
                      <IconComponent className="h-4 w-4" />
                    </span>
                    <span className={`relative z-10 transition-colors ${isActive ? "text-white" : "text-gray-200 group-hover:text-white"}`}>
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* User Account Desk Actions */}
            <div className="hidden md:flex items-center gap-3">
              {user ? (
                <div className="flex items-center gap-2.5 bg-white/5 border border-white/10 pl-2.5 pr-1 py-1 rounded-2xl">
                  {/* Clickable Profile Navigation */}
                  <button
                    onClick={() => setActiveModule("perfil")}
                    className="flex items-center gap-2 transition-all text-left hover:opacity-90 cursor-pointer"
                    title="Configurações do Meu Perfil"
                  >
                    <div className="w-6.5 h-6.5 rounded-lg bg-[#ff6600]/90 flex items-center justify-center font-extrabold text-[10px] text-white shrink-0 shadow-sm">
                      {getUserInitials()}
                    </div>
                    
                    <div className="text-left leading-none">
                      <p className="text-[10px] font-extrabold text-[#ff6600] max-w-[110px] truncate leading-none mb-0.5" title={user.email}>
                        {getUserFriendlyName(user)}
                      </p>
                      <span className="text-[8px] font-medium text-gray-400 max-w-[110px] truncate block leading-none">
                        {user.email}
                      </span>
                    </div>
                  </button>

                  {/* Sign out */}
                  <button
                    onClick={handleLogout}
                    className="bg-white/5 hover:bg-red-500/15 hover:text-red-400 transition-all p-1.5 rounded-xl cursor-pointer"
                    title="Terminar Sessão"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={onOpenAuthModal}
                  className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-[#ff6600] border border-white/10 text-xs font-bold uppercase tracking-wider transition-all text-white flex items-center gap-1.5 cursor-pointer hover:border-[#ff6600] hover:shadow-md"
                  id="auth-trigger-desktop"
                >
                  <User className="h-3.8 w-3.8 text-[#ff6600]" /> 
                  <span>Minha Conta</span>
                </button>
              )}
            </div>

            {/* Mobile Interface Hamburger & Triggers */}
            <div className="md:hidden flex items-center gap-2">
              {user && (
                <button
                  onClick={() => setActiveModule("perfil")}
                  className={`flex flex-col items-start leading-none px-2.5 py-1 rounded-xl text-left transition-all cursor-pointer ${
                    activeModule === "perfil" ? "bg-[#ff6600]" : "bg-white/5 border border-white/10"
                  }`}
                  title="Ver Perfil"
                >
                  <span className="text-[9.5px] font-black text-white truncate max-w-[85px] leading-tight block">{getUserFriendlyName(user)}</span>
                  <span className="text-[7.5px] font-medium text-gray-400 max-w-[85px] truncate block leading-tight">{user.email}</span>
                </button>
              )}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-white hover:text-orange-400 p-1.5 transition-colors cursor-pointer rounded-lg bg-white/5"
                id="mobile-hamburger-btn"
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Navigation Sidebar Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-[#1f2d3a] border-t border-white/5 px-4 pt-3 pb-5 space-y-2 animate-fade-in" id="mobile-nav-panel">
            
            <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-widest px-2.5 block mb-1">Canais Técnicos</span>
            {navItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = activeModule === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveModule(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2.5 transition-all ${
                    isActive ? "bg-[#ff6600] text-white shadow-md" : "hover:bg-white/5 text-gray-255"
                  }`}
                >
                  <span className={isActive ? "text-white" : item.color}>
                    <IconComponent className="h-4.5 w-4.5" />
                  </span>
                  <span>{item.label}</span>
                </button>
              );
            })}

            {user && (
              <button
                onClick={() => {
                  setActiveModule("perfil");
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2.5 transition-all ${
                  activeModule === "perfil" ? "bg-[#ff6600] text-white" : "text-orange-400 hover:bg-white/5"
                }`}
              >
                <span>👤</span>
                <span>O Meu Perfil Netek</span>
              </button>
            )}

            {/* Institutional Mobile Quick Links */}
            <div className="pt-3.5 border-t border-white/5 mt-3 space-y-1">
              <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-widest px-2.5 block mb-1">Institucional Netek</span>
              
              <button
                onClick={() => {
                  onOpenModal("sobre");
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-left px-4 py-2 rounded-xl text-xs font-semibold text-gray-200 hover:bg-white/5 flex items-center gap-2 block"
              >
                <span>📖</span> <span>Sobre Nós &amp; Missão</span>
              </button>

              <button
                onClick={() => {
                  onOpenModal("cursos");
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-left px-2.5 py-2 rounded-xl text-xs font-bold text-emerald-400 bg-emerald-500/15 hover:bg-emerald-500/20 flex items-center gap-2 block"
              >
                <span>🎓</span> <span>Cursos Moçambique (Grátis!)</span>
              </button>

              <button
                onClick={() => {
                  onOpenModal("politicas");
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-left px-4 py-2 rounded-xl text-xs font-semibold text-gray-200 hover:bg-white/5 flex items-center gap-2 block"
              >
                <span>⚖️</span> <span>Políticas &amp; Termos</span>
              </button>

              <button
                onClick={() => {
                  onOpenModal("ajuda");
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-left px-2.5 py-2 rounded-xl text-xs font-bold text-orange-400 bg-orange-500/10 hover:bg-orange-500/20 flex items-center gap-2 block animate-pulse"
              >
                <span>💖</span> <span>Manter Site Online (Apoio)</span>
              </button>
            </div>

            {/* Authentication state triggers mobile */}
            {user ? (
              <button
                onClick={() => {
                  handleLogout();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-red-400 hover:bg-red-500/10 mt-3 flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" /> Terminar Sessão
              </button>
            ) : (
              <button
                onClick={() => {
                  onOpenAuthModal();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-center px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#ff6600] hover:bg-orange-600 transition-colors text-white mt-3 flex items-center justify-center gap-2 shadow-sm"
                id="auth-trigger-mobile"
              >
                <User className="h-4.5 w-4.5" /> Iniciar Sessão Geral
              </button>
            )}

          </div>
        )}
      </nav>
    </div>
  );
}
