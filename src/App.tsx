import { useState, useEffect } from "react";
import { auth } from "./firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import Navbar from "./components/Navbar";
import AuthModal from "./components/AuthModal";
import EngineeringModule from "./components/EngineeringModule";
import FixMozModule from "./components/FixMozModule";
import DigitalServicesModule from "./components/DigitalServicesModule";
import KayamozModule from "./components/KayamozModule";
import UserProfileModule from "./components/UserProfileModule";
import CompanyModals, { CompanyModalType } from "./components/CompanyModals";
import { getUserFriendlyName } from "./lib/userUtils";
import {
  Compass,
  ArrowUpRight,
  ShieldCheck,
  Building2,
  HardHat,
  Network,
  Phone,
  BookmarkCheck,
  Award,
} from "lucide-react";

export default function App() {
  const [activeModule, setActiveModule] = useState("engenharia");
  const [user, setUser] = useState<any>(null);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [companyModal, setCompanyModal] = useState<CompanyModalType>(null);

  const [isDataSaver, setIsDataSaver] = useState(() => {
    return localStorage.getItem("netek_data_saver") === "true";
  });

  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("netek_dark_mode") === "true";
  });

  useEffect(() => {
    localStorage.setItem("netek_dark_mode", String(isDarkMode));
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  const handleToggleDataSaver = () => {
    const newVal = !isDataSaver;
    setIsDataSaver(newVal);
    localStorage.setItem("netek_data_saver", String(newVal));
  };

  // Sync session state natively with Firebase Auth
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        if (firebaseUser.email === "admin@jonsonjb.com") {
          setIsAdminLoggedIn(true);
        } else {
          setIsAdminLoggedIn(false);
        }
      } else {
        // If a mock virtual user is configured locally, preserve state unless user manually triggered signOut
      }
    });
    return () => unsubscribe();
  }, []);

  const handleAuthSuccess = (authenticatedUser: any) => {
    setUser(authenticatedUser);
    if (authenticatedUser.email === "admin@jonsonjb.com") {
      setIsAdminLoggedIn(true);
    } else {
      setIsAdminLoggedIn(false);
    }
  };

  const handleSignOut = () => {
    setUser(null);
    setIsAdminLoggedIn(false);
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-300 ${isDarkMode ? "bg-slate-950 text-gray-100 dark" : "bg-[#f4f6f9]"}`} id="netek-root-app">
      {/* 1. Header Navigation */}
      <Navbar
        activeModule={activeModule}
        setActiveModule={setActiveModule}
        user={user}
        onSignOut={handleSignOut}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onOpenModal={setCompanyModal}
        isDataSaver={isDataSaver}
        onToggleDataSaver={handleToggleDataSaver}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
      />

      {/* Hero Welcome banner with a Mozambican theme */}
      <header className="bg-[#2c3e50] text-white py-10 px-4 border-t border-white/5 shadow-inner" id="hero-netek-banner">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 animate-fade-in">
            <div className="inline-flex items-center gap-1.5 bg-[#ff6600]/25 px-3 py-1 rounded-full text-xs font-bold text-orange-300 uppercase tracking-widest border border-[#ff6600]/30">
              <Compass className="h-3 w-3 animate-spin duration-1000" /> Mercado Digital de Moçambique
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              Ecosistema Multi-Serviços <span className="text-[#ff6600]">Netek</span>
            </h1>
            <p className="text-gray-300 text-sm md:text-base max-w-2xl leading-relaxed font-light">
              Consulte materiais de construção com inteligência métrica, conecte-se com construtores locais na
              FixMoz, solicite minutas de documentos legais ou encontre terrenos documentados na Kayamoz.
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 p-4 rounded-2xl flex items-center gap-4 shrink-0 max-w-sm transition-all hover:bg-white/10">
            <div className="bg-[#ff6600] text-white p-3 rounded-xl shadow-lg">
              <Phone className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase font-mono font-bold">Assistência WhatsApp</p>
              <a
                href="https://wa.me/258835109190"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-[#ff6600] font-extrabold text-base block transition-colors mt-0.5"
              >
                +258 83 510 9190
              </a>
              <span className="text-[10px] text-orange-300 block">Director Geral: Jonson JB</span>
            </div>
          </div>
        </div>
      </header>

      {/* 2. DYNAMIC INTRO PROMO CARDS (Disponíveis logo de cara, totalmente interativos) */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 mt-6 grid grid-cols-1 md:grid-cols-3 gap-4" id="intro-promo-cards">
        {/* Card 1: Cursos Grátis */}
        <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border border-emerald-500/15 p-4 rounded-3xl flex flex-col justify-between hover:shadow-md transition-all gap-3">
          <div className="space-y-1">
            <span className="bg-emerald-600 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded font-mono">
              Formações Grátis 🇲🇿
            </span>
            <h4 className="font-extrabold text-[#2c3e50] text-[13px] mt-1">Cursos Gratuitos Brevemente!</h4>
            <p className="text-[11px] text-gray-550 leading-relaxed font-light">
              No-Code, Excel para PMEs e AutoCAD de obra com diplomas virtuais homologados pela Netek.
            </p>
          </div>
          <button
            onClick={() => setCompanyModal("cursos")}
            className="text-[11px] font-bold text-emerald-600 hover:text-emerald-700 hover:underline flex items-center gap-1 self-start cursor-pointer"
          >
            Saber Mais e Inscrever-se →
          </button>
        </div>

        {/* Card 2: Sobre & Equipa */}
        <div className="bg-gradient-to-br from-[#ff6600]/10 to-[#ff6600]/5 border border-[#ff6600]/15 p-4 rounded-3xl flex flex-col justify-between hover:shadow-md transition-all gap-3">
          <div className="space-y-1">
            <span className="bg-[#ff6600] text-white text-[9px] font-black uppercase px-2 py-0.5 rounded font-mono">
              Sobre Nós • Missão &amp; Visão
            </span>
            <h4 className="font-extrabold text-[#2c3e50] text-[13px] mt-1">Conheça o Propósito do Diretor Jonson JB</h4>
            <p className="text-[11px] text-gray-550 leading-relaxed font-light">
              Descubra por que disponibilizamos empregos, terrenos validados e cálculos de infraestruturas livres.
            </p>
          </div>
          <button
            onClick={() => setCompanyModal("sobre")}
            className="text-[11px] font-bold text-[#ff6600] hover:text-[#d35400] hover:underline flex items-center gap-1 self-start cursor-pointer"
          >
            Nossa Proposta de Valor →
          </button>
        </div>

        {/* Card 3: Ajuda & Apoio */}
        <div className="bg-gradient-to-br from-[#2c3e50]/5 to-[#2c3e50]/10 border border-[#2c3e50]/15 p-4 rounded-3xl flex flex-col justify-between hover:shadow-md transition-all gap-3">
          <div className="space-y-1">
            <span className="bg-[#2c3e50] text-white text-[9px] font-black uppercase px-2 py-0.5 rounded font-mono">
              Apoio Voluntário 💖
            </span>
            <h4 className="font-extrabold text-[#2c3e50] text-[13px] mt-1">Ajude a Manter o Portal Ativo</h4>
            <p className="text-[11px] text-gray-550 leading-relaxed font-light">
              Mantenha as nossas ferramentas, geradores de CV e calculadoras integradas no ar via M-Pesa.
            </p>
          </div>
          <button
            onClick={() => setCompanyModal("ajuda")}
            className="text-[11px] font-bold text-[#2c3e50] hover:underline flex items-center gap-1 self-start cursor-pointer"
          >
            Apoiadores Voluntários →
          </button>
        </div>
      </div>

      {/* Extra Admin Status Alert */}
      {isAdminLoggedIn && (
        <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-2.5 text-center text-xs font-bold flex items-center justify-center gap-2 animate-fade-in" id="admin-banner-alert">
          <ShieldCheck className="h-4.5 w-4.5 text-amber-700 animate-bounce" />
          <span>ESTADO: ACESSO ADMINISTRADOR ATIVADO. Tem permissões para excluir anúncios e visualizar contactos proprietários nas vagas.</span>
        </div>
      )}

      {/* Active User Greeting Card */}
      {user && !isAdminLoggedIn && (
        <div className="bg-green-50 border-b border-green-200 text-green-900 px-4 py-2 text-center text-xs font-medium flex items-center justify-center gap-2 animate-fade-in" id="user-welcome-alert">
          <Award className="h-4.5 w-4.5 text-green-700" />
          <span>
            Bem-vindo de volta ao Netek Services, <strong className="font-extrabold text-[#ff6600]">{getUserFriendlyName(user)}</strong> (<span className="text-gray-500 font-mono text-[10px]">{user.email}</span>)! Agora pode submeter vagas e terrenos de imediato, registados em seu nome.
          </span>
        </div>
      )}

      {/* Moçambique Data Saver Friendly Alert */}
      {isDataSaver && (
        <div className="bg-orange-500 border-b border-orange-600 text-white px-4 py-2 text-center text-[11px] font-black flex items-center justify-center gap-2 animate-fade-in uppercase tracking-wider font-sans" id="datasaver-banner-alert">
          <span>🚀 ECONOMIA DE DADOS ATIVA: Fotos de Imóveis ocultadas para poupar saldo e megas de internet em Moçambique! 🇲🇿</span>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8" id="primary-view-container">
        {activeModule === "engenharia" && <EngineeringModule isAdmin={isAdminLoggedIn} />}
        {activeModule === "fixmoz" && <FixMozModule isAdmin={isAdminLoggedIn} />}
        {activeModule === "digitais" && <DigitalServicesModule isAdmin={isAdminLoggedIn} />}
        {activeModule === "kayamoz" && <KayamozModule isAdmin={isAdminLoggedIn} />}
        {activeModule === "perfil" && <UserProfileModule user={user} isAdmin={isAdminLoggedIn} />}
      </main>

      {/* Elegant Footer with copyright & Mozambican details */}
      <footer className="bg-[#1e2b38] border-t border-white/5 py-12 px-4 text-gray-400 text-sm" id="main-corporate-footer">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="bg-white p-1 rounded-lg">
                <div className="bg-[#ff6600] text-white w-7 h-7 rounded-md font-bold flex items-center justify-center text-sm">N</div>
              </div>
              <span className="font-extrabold text-white text-base">Netek Services</span>
            </div>
            <p className="text-xs leading-relaxed text-gray-400">
              Uma plataforma integrada moçambicana orientada para a agilização de serviços imobiliários (Kayamoz), 
              calculadora métrica de materiais, intermediação laboral (FixMoz) e minutas automatizadas de contratos.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-white mb-3 text-xs uppercase tracking-wider text-orange-400">Nossos Módulos</h4>
            <ul className="space-y-1.5 text-xs">
              <li><button onClick={() => setActiveModule("engenharia")} className="hover:text-white transition-colors">Engenharia Integrada</button></li>
              <li><button onClick={() => setActiveModule("fixmoz")} className="hover:text-white transition-colors">Agência FixMoz</button></li>
              <li><button onClick={() => setActiveModule("digitais")} className="hover:text-white transition-colors">Express Documentos</button></li>
              <li><button onClick={() => setActiveModule("kayamoz")} className="hover:text-white transition-colors">Intermediação Imobiliária</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-3 text-xs uppercase tracking-wider text-orange-400">Contatos e Expediente</h4>
            <p className="text-xs leading-relaxed text-gray-400 mb-2">
              Direção-Geral Jonson JB<br />
              Maputo, Moçambique
            </p>
            <p className="text-xs leading-relaxed text-gray-400">
              E-mail: <a href="mailto:admin@jonsonjb.com" className="text-orange-400 hover:underline font-semibold text-xs">admin@jonsonjb.com</a><br />
              WhatsApp: <a href="https://wa.me/258835109190" className="text-orange-400 hover:underline font-semibold text-xs">+258 83 510 9190</a>
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto border-t border-white/5 pt-6 text-center text-xs space-y-2">
          <p>© {new Date().getFullYear()} Netek Services (Jonson JB). Todos os direitos reservados.</p>
          <p className="text-[10px] text-gray-500 font-mono">Construído em conformidade regulamentar com as leis fiscais e o Código Civil de Moçambique.</p>
        </div>
      </footer>

      {/* Unified Register/Login Auth Modal Overlay */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />

      {/* Institutional Corporate overlay info modals */}
      <CompanyModals
        activeModal={companyModal}
        onClose={() => setCompanyModal(null)}
      />
    </div>
  );
}
