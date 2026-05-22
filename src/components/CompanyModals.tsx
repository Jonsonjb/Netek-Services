import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  Target,
  Eye,
  Rocket,
  ShieldAlert,
  GraduationCap,
  HeartHandshake,
  ArrowRight,
  Sparkles,
  Phone,
  CheckCircle,
  Clock,
  Coffee,
  PiggyBank,
  MapPin,
  Copy,
  Check,
  Search,
  Plus,
  ExternalLink,
  AlertTriangle,
  Trash2
} from "lucide-react";

export type CompanyModalType = "sobre" | "politicas" | "cursos" | "ajuda" | null;

interface FreeCourse {
  id: string;
  title: string;
  platform: string;
  description: string;
  certText: string;
  link: string;
  icon: string;
  category: string;
}

interface PaidInstitution {
  name: string;
  locations: string;
  description: string;
  priceInfo: string;
  categories: string[];
}

const FREE_COURSES: FreeCourse[] = [
  {
    id: "excel",
    title: "Excel para Negócios e Gestão",
    platform: "Fundação Bradesco (Escola Virtual)",
    description: "Folhas salariais, controle de estoque e balanço patrimonial para micro-empresas locais.",
    certText: "Sim, Gratuito de Auto-Estudo",
    link: "https://www.ev.org.br",
    icon: "📊",
    category: "excel"
  },
  {
    id: "autocad",
    title: "AutoCAD 2D e Desenho Técnico",
    platform: "Autodesk Academy / Udemy",
    description: "Leitura de plantas residenciais, traçados de fundação e cortes de engenharia civil.",
    certText: "Sim, Gratuito de Participação",
    link: "https://www.udemy.com",
    icon: "📐",
    category: "autocad"
  },
  {
    id: "marketing",
    title: "Marketing Digital para Empreendedores",
    platform: "Google Garage Digital",
    description: "Divulgação de serviços, captação de clientes no WhatsApp Business e redes sociais.",
    certText: "Sim, Certificação Gratuita do Google",
    link: "https://learndigital.withgoogle.com",
    icon: "📢",
    category: "marketing"
  },
  {
    id: "nocode",
    title: "No-Code & Websites do Zero",
    platform: "Webflow University / Bubble",
    description: "Criação de landing pages profissionais, portfólios e catálogos online para vendas.",
    certText: "Sim, Certificação Pública",
    link: "https://university.webflow.com",
    icon: "💻",
    category: "nocode"
  },
  {
    id: "gestao",
    title: "Empreendedorismo e Fluxo de Caixa",
    platform: "Sebrae / Coursera Free",
    description: "Finanças básicas, cálculo de custos e estruturação de pequenos negócios em Maputo.",
    certText: "Sim, Gratuito de Participação",
    link: "https://www.coursera.org",
    icon: "📈",
    category: "gestao"
  },
  {
    id: "direito",
    title: "Legislação e Noções de Contratos",
    platform: "FGV Ensino Livre",
    description: "Noções básicas de acordos de DUAT, regulação civil de empresas e acordos laborais.",
    certText: "Sim, Gratuito e Gerado na Hora",
    link: "https://www.fgv.br",
    icon: "⚖️",
    category: "direito"
  }
];

const PAID_INSTITUTIONS: PaidInstitution[] = [
  {
    name: "INEFP (Instituto Nacional de Emprego e Formação Profissional)",
    locations: "Maputo, Matola, Beira, Nampula, Tete, Quelimane",
    description: "Centro estatal de excelente reputação técnica. Conta com módulos rápidos presenciais de Informática de Escritório, Contabilidade de Caixa, Desenho Técnico de Obras, Eletricidade e Construção Civil.",
    priceInfo: "Preço: Tem propinas de baixo custo subvencionadas pelo Estado de Moçambique.",
    categories: ["excel", "autocad", "marketing", "gestao", "direito"]
  },
  {
    name: "ITIC (Instituto de Tecnologias de Informação e Comunicação)",
    locations: "Maputo (Av. 24 de Julho)",
    description: "Uma das instituições de referência na formação prática presencial de Redes, Programação Web, Marketing Digital e Design Gráfico em Maputo.",
    priceInfo: "Preço: Consultar mensalidade localmente aos balcões (Curso Pago).",
    categories: ["nocode", "marketing", "excel"]
  },
  {
    name: "Centro de Informática da Universidade Eduardo Mondlane (CIUEM)",
    locations: "Campus Universitário Principal da UEM, Maputo",
    description: "Oferece treinamentos avançados e práticos presenciais em Excel Administrativo, Redes de Computadores, AutoCAD Avançado para Engenharia e Desenho de Plantas.",
    priceInfo: "Preço: Taxas de inscrição e propina paga pelo módulo de certificação académica.",
    categories: ["excel", "autocad", "nocode"]
  },
  {
    name: "Instituto Monitor de Moçambique",
    locations: "Maputo, Beira e Ensino por Correspondência",
    description: "Excelente para capacitações presenciais e à distância. Oferece Administração de Empresas, Contabilidade Geral, Secretaria e Gestão Comercial.",
    priceInfo: "Preço: Regime pago. Propinas mensais a partir de 2.500 MT a 4.000 MT.",
    categories: ["gestao", "excel", "direito", "marketing"]
  },
  {
    name: "Faculdade de Engenharia da UEM (Cursos de Extensão Técnica)",
    locations: "Av. de Moçambique, Maputo",
    description: "Aulas intensivas periódicas presenciais voltadas para a capacitação de engenheiros, mestres de obras e desenhadores em AutoCAD Civil, FISCALIZAÇÃO e Medidas Estruturais.",
    priceInfo: "Preço: Curso profissional pago com certificação oficial da FEUEM.",
    categories: ["autocad"]
  },
  {
    name: "Academias de Formação Particular (Solis, IT-School, etc.)",
    locations: "Maputo Centro, Matola, Nampula",
    description: "Formações rápidas e intensivas com computadores fornecidos na sala para Excel Avançado, AutoCAD de Arquitetura e Gestão de Portfólios online.",
    priceInfo: "Preço: Tarifários aplicados por módulo intensivo presencial (Cursos Pagos).",
    categories: ["excel", "autocad", "marketing"]
  }
];

interface CompanyModalsProps {
  activeModal: CompanyModalType;
  onClose: () => void;
}

export default function CompanyModals({ activeModal, onClose }: CompanyModalsProps) {
  const [notifyName, setNotifyName] = useState("");
  const [notifyPhone, setNotifyPhone] = useState("");
  const [isNotifying, setIsNotifying] = useState(false);
  const [notified, setNotified] = useState(false);

  // States for Searching & Adding Custom Courses
  const [searchTerm, setSearchTerm] = useState("");
  const [customCourseInput, setCustomCourseInput] = useState("");
  const [userAddedCourses, setUserAddedCourses] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("netek_user_courses");
      return saved ? JSON.parse(saved) : [];
    } catch (_) {
      return [];
    }
  });

  const [selectedMainCourseId, setSelectedMainCourseId] = useState<string>("excel");
  const [selectedCustomCourse, setSelectedCustomCourse] = useState<string | null>(null);

  const [donationAmount, setDonationAmount] = useState("500");
  const [donationMethod, setDonationMethod] = useState("mpesa");
  const [donationPhone, setDonationPhone] = useState("");
  const [donationSuccess, setDonationSuccess] = useState(false);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const handleCopyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(key);
    setTimeout(() => {
      setCopiedText(null);
    }, 2000);
  };

  const handleAddCustomCourse = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = customCourseInput.trim();
    if (!clean) return;
    
    if (!userAddedCourses.includes(clean)) {
      const updated = [...userAddedCourses, clean];
      setUserAddedCourses(updated);
      localStorage.setItem("netek_user_courses", JSON.stringify(updated));
    }
    
    setSelectedCustomCourse(clean);
    setSelectedMainCourseId("custom");
    setCustomCourseInput("");
  };

  const handleRemoveCustomCourse = (course: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const filtered = userAddedCourses.filter((c) => c !== course);
    setUserAddedCourses(filtered);
    localStorage.setItem("netek_user_courses", JSON.stringify(filtered));
    
    if (selectedCustomCourse === course) {
      setSelectedCustomCourse(null);
      setSelectedMainCourseId("excel");
    }
  };

  const handleNotifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notifyName || !notifyPhone) return;
    setIsNotifying(true);
    setTimeout(() => {
      setIsNotifying(false);
      setNotified(true);
      
      const courseTitle = selectedMainCourseId === "custom" && selectedCustomCourse
        ? selectedCustomCourse
        : (FREE_COURSES.find(c => c.id === selectedMainCourseId)?.title || "Excel para Negócios");
      
      // WhatsApp Draft for notification Waitlist
      const msg = `Olá Diretor Jonson JB! Gostaria de demonstrar meu interesse nos cursos da Netek Services Moçambique:\n\n` +
                  `*Nome:* ${notifyName}\n` +
                  `*Contacto:* ${notifyPhone}\n` +
                  `*Curso Desejado:* ${courseTitle}\n\n` +
                  `Por favor, informe-me sobre novas turmas gratuitas ou orientações recomendadas. Obrigado!`;
      
      window.open(`https://wa.me/258835109190?text=${encodeURIComponent(msg)}`, "_blank");
    }, 800);
  };

  const handleDonationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!donationPhone) {
      alert("Por favor insira o contacto ou email de envio.");
      return;
    }
    setDonationSuccess(true);
    
    // WhatsApp draft to inform Donation
    const isPaypal = donationMethod === "paypal";
    const unit = isPaypal ? "$" : "MT";
    const msg = `Olá Diretor Jonson JB! Gostaria de oferecer um incentivo de ajuda ao portal Netek Services para manter os servidores online:\n\n` +
                `*Valor:* ${donationAmount} ${unit}\n` +
                `*Canal:* ${donationMethod.toUpperCase()}\n` +
                `*Origem:* ${donationPhone}\n\n` +
                `Agradeço por disponibilizar todas as ferramentas de forma 100% gratuita! Força no projeto.`;
    
    window.open(`https://wa.me/258835109190?text=${encodeURIComponent(msg)}`, "_blank");
  };

  return (
    <AnimatePresence>
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs font-sans">
          {/* Backdrop closer */}
          <div className="absolute inset-0" onClick={onClose}></div>

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl relative z-10 flex flex-col max-h-[90vh] border border-gray-100 dark:border-slate-800"
          >
            {/* Header Area */}
            <div className="bg-[#2c3e50] text-white p-5 flex items-center justify-between border-b border-white/5 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="bg-[#ff6600] text-white p-2 rounded-xl shrink-0 shadow-sm">
                  {activeModal === "sobre" && <Rocket className="h-5 w-5" />}
                  {activeModal === "politicas" && <ShieldAlert className="h-5 w-5" />}
                  {activeModal === "cursos" && <GraduationCap className="h-5 w-5" />}
                  {activeModal === "ajuda" && <HeartHandshake className="h-5 w-5" />}
                </div>
                <div>
                  <span className="bg-white/10 text-orange-300 text-[9px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider block w-max font-mono mb-0.5">
                    Informação Institucional
                  </span>
                  <h3 className="font-extrabold text-sm sm:text-base leading-none">
                    {activeModal === "sobre" && "Sobre Nós, Missão & Visão"}
                    {activeModal === "politicas" && "Políticas de Privacidade & Políticas de Uso"}
                    {activeModal === "cursos" && "Cursos de Formação Profissional Grátis"}
                    {activeModal === "ajuda" && "Ajuda & Manutenção de Servidores"}
                  </h3>
                </div>
              </div>
              <button
                onClick={onClose}
                className="bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white p-1.5 rounded-xl transition-all cursor-pointer"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            {/* Scrollable Content Body */}
            <div className="overflow-y-auto p-6 space-y-6 text-xs text-gray-600 dark:text-gray-300 bg-white dark:bg-slate-900 leading-relaxed">
              
              {/* 1. Modal: SOBRE, MISSÃO E VISÃO */}
              {activeModal === "sobre" && (
                <div className="space-y-6" id="about-modal-content">
                  <div className="space-y-2">
                    <h4 className="font-bold text-gray-800 text-sm">Quem é a Netek Services?</h4>
                    <p>
                      A <strong>Netek Services</strong> é uma plataforma pioneira idealizada e dirigida pelo especialista <strong>Jonson JB</strong>, concebida para aproximar cidadãos e empresários moçambicanos de soluções integradas de cálculo, alvenaria, direito documental, e tecnologia sem atritos. 
                    </p>
                    <p>
                      Percebemos as dificuldades que muitos enfrentam ao planeamento de orçamentos de obras residenciais em Maputo, Matola, Nampula e Beira, ou na formalização de minutas como contratos de trabalho e procurações municipais. A Netek Services oferece estas ferramentas de forma inteligente, automática e o melhor de tudo: <strong>100% gratuita</strong>, democratizando a engenharia e os documentos legais.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <div className="bg-orange-50/50 border border-orange-100 p-4 rounded-2xl space-y-2">
                      <h5 className="font-bold text-slate-800 text-xs flex items-center gap-1.5 uppercase tracking-wider">
                        <Target className="h-4 w-4 text-[#ff6600]" /> Nossa Missão
                      </h5>
                      <p className="text-[11px] text-gray-650">
                        Proporcionar ferramentas de engenharia métrica, modelagem e templates administrativos acessíveis a qualquer smartphone, de modo a mitigar desperdícios de materiais e reduzir custos burocráticos associados à vida produtiva moçambicana.
                      </p>
                    </div>

                    <div className="bg-blue-50/30 border border-blue-100 p-4 rounded-2xl space-y-2">
                      <h5 className="font-bold text-slate-800 text-xs flex items-center gap-1.5 uppercase tracking-wider">
                        <Eye className="h-4 w-4 text-blue-500" /> Nossa Visão
                      </h5>
                      <p className="text-[11px] text-gray-650">
                        Ser a principal ponte digital de Moçambique entre o planeamento civil estrutural e a captação digital, expandindo para o ensino técnico e fornecendo recursos confiáveis que auxiliem milhares de construtores locais, advogados e estagiários.
                      </p>
                    </div>
                  </div>

                  <div className="bg-gray-50 border border-gray-150 p-4 rounded-2xl space-y-2">
                    <h5 className="font-bold text-gray-800 text-xs flex items-center gap-2">
                      ⭐ Compromisso com a Transparência
                    </h5>
                    <p className="text-[11px]">
                      Acreditamos que todos os cidadãos devem ter recursos para construir de forma segura e dentro da lei. Por isso, a calculadora de vãos de portas e janelas, as estimativas de blocos e areia, e o formatador de CVs e contratos estarão sempre à disposição no portal, operando sem taxas de utilização obrigatórias.
                    </p>
                  </div>
                </div>
              )}

              {/* 2. Modal: POLÍTICAS DE PRIVACIDADE E USO */}
              {activeModal === "politicas" && (
                <div className="space-y-6" id="policies-modal-content">
                  <div className="space-y-3">
                    <h4 className="font-bold text-gray-800 text-sm">1. Privacidade dos Dados do Utilizador</h4>
                    <p>
                      Em conformidade com a legislação aplicável em Moçambique, nomeadamente a <strong>Lei da Proteção de Dados de Moçambique</strong>, a Netek Services respeita escrupulosamente a confidencialidade das suas informações pessoais.
                    </p>
                    <p>
                      Quaisquer dados inseridos nas nossas calculadoras (como o seu nome de utilizador, telefone de celular para WhatsApp e solicitações de modificação em plantas de casa) são protegidos em instâncias de base de dados seguras do Cloud Firestore. Jamais compartilharemos os seus números telefónicos com terceiros ou utilizaremos as suas informações para fins publicitários corporativos não acordados.
                    </p>
                  </div>

                  <div className="space-y-3 pt-2">
                    <h4 className="font-bold text-gray-800 text-sm">2. Termos e Condições de Uso</h4>
                    <ul className="space-y-2 list-disc pl-4 text-gray-650">
                      <li>
                        <strong>Natureza das Estimativas:</strong> Os dimensionamentos de pedra, blocos, cimento e quantidades de portas e basculantes são calculados com base em padrões teóricos de sapata residencial. Não substituem o parecer de engenheiros registados na Ordem de Engenheiros de Moçambique (OEM).
                      </li>
                      <li>
                        <strong>Templates Legais:</strong> Os geradores automatizados de Contratos sob a Lei do Trabalho e minutas de posse de DUAT servem de base contratual e devem ser revistos e assinados de livre espirote por ambas as partes voluntárias.
                      </li>
                      <li>
                        <strong>Conduta de Classificados (FixMoz &amp; Kayamoz):</strong> É terminantemente proibido anunciar produtos, imóveis ou anúncios de emprego fraudulento no nosso fórum de corretores. A moderação encabeçada pela equipa do Jonson JB reserva-se o direito de excluir imediatamente qualquer publicação que infrinja os conceitos éticos da nossa comunidade de parceiros.
                      </li>
                    </ul>
                  </div>

                  <div className="p-3.5 bg-yellow-50 text-yellow-900 rounded-2xl border border-yellow-100 text-[11px]">
                    <strong>Nota Legal:</strong> Ao clicar no link de direcionamento de mensagens ao WhatsApp do Diretor Jonson JB, compreende que as mensagens geradas recolhem exclusivamente parâmetros autorizados de cálculos para responder estruturadamente à sua proposta de planta.
                  </div>
                </div>
              )}

              {/* 3. Modal: CURSOS GRÁTIS */}
              {activeModal === "cursos" && (
                <div className="space-y-6" id="courses-modal-content">
                  {/* Banner header and search */}
                  <div className="bg-gradient-to-br from-slate-900 via-[#2c3e50] to-slate-800 text-white p-5 rounded-2xl relative overflow-hidden border border-slate-700 shadow-md">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#ff6600]/10 rounded-full blur-2xl pointer-events-none"></div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
                      <div className="space-y-1">
                        <span className="bg-[#ff6600] text-white text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-widest block w-max font-mono">
                          Moçambique • Educação & Capacitação
                        </span>
                        <h4 className="font-extrabold text-sm sm:text-base">Centro de Capacitação Netek</h4>
                        <p className="text-[10.5px] text-gray-300 font-light leading-relaxed">
                          Descubra excelentes cursos online gratuitos com certificação no site ou escreva outra especialidade para obter parcerias e recomendações locais!
                        </p>
                      </div>
                      <GraduationCap className="h-10 w-10 text-orange-400 shrink-0" />
                    </div>
                  </div>

                  {/* Interactive Search & Add Custom Course Row */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 bg-gray-50 dark:bg-slate-800/80 p-4 rounded-2xl border border-gray-150 dark:border-slate-750">
                    {/* Search Field */}
                    <div className="md:col-span-6 space-y-1">
                      <label className="text-[10px] uppercase font-black tracking-widest text-[#ff6600] block">
                        🔍 Filtrar Cursos Online Gratuitos:
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                          <Search className="h-3.8 w-3.8" />
                        </span>
                        <input
                          type="text"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          placeholder="Pesquise por Excel, AutoCAD, Marketing, No-Code..."
                          className="w-full pl-9 pr-3.5 py-2 text-xs bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl outline-none focus:border-[#ff6600] dark:focus:border-[#ff6600] transition-colors text-gray-800 dark:text-white"
                        />
                      </div>
                    </div>

                    {/* Add Custom Course Form */}
                    <form onSubmit={handleAddCustomCourse} className="md:col-span-6 space-y-1">
                      <label className="text-[10px] uppercase font-black tracking-widest text-[#ff6600] block">
                        💡 Não encontrou o seu curso? Escreva o curso desejado:
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={customCourseInput}
                          onChange={(e) => setCustomCourseInput(e.target.value)}
                          placeholder="Ex: Serralharia Civil, Inglês, Eletricidade..."
                          className="flex-1 px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl outline-none focus:border-[#ff6600] dark:focus:border-[#ff6600] transition-colors text-gray-800 dark:text-white"
                        />
                        <button
                          type="submit"
                          className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <Plus className="h-3.5 w-3.5" /> Adicionar
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* Free Online Courses Section */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-gray-850 dark:text-white text-sm">
                        Cursos Gratuitos Disponíveis na Internet (com Certificado):
                      </h4>
                      {selectedMainCourseId === "custom" && (
                        <button
                          onClick={() => {
                            setSelectedMainCourseId("excel");
                            setSelectedCustomCourse(null);
                          }}
                          className="text-[10px] text-orange-600 dark:text-orange-400 hover:underline font-bold cursor-pointer"
                        >
                          Ver Cursos Padrão
                        </button>
                      )}
                    </div>

                    {/* Custom User Added Courses Tags Row */}
                    {userAddedCourses.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 p-2 bg-slate-50 dark:bg-slate-850/40 rounded-xl border border-dashed border-gray-200 dark:border-slate-705">
                        <span className="text-[9px] font-black uppercase text-gray-400 dark:text-gray-500 tracking-wide self-center mr-1">
                          Seus Pedidos:
                        </span>
                        {userAddedCourses.map((course) => {
                          const isActive = selectedMainCourseId === "custom" && selectedCustomCourse === course;
                          return (
                            <button
                              key={course}
                              type="button"
                              onClick={() => {
                                setSelectedCustomCourse(course);
                                setSelectedMainCourseId("custom");
                              }}
                              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                                isActive
                                  ? "bg-slate-900 dark:bg-orange-600 text-white border border-slate-900 dark:border-orange-600"
                                  : "bg-white dark:bg-slate-900 text-gray-700 dark:text-gray-300 border border-gray-150 dark:border-slate-800 hover:bg-gray-100 dark:hover:bg-slate-850"
                              }`}
                            >
                              <span>🎓 {course}</span>
                              <span
                                onClick={(e) => handleRemoveCustomCourse(course, e)}
                                className="text-gray-400 hover:text-red-500 font-extrabold focus:outline-none p-0.5 rounded cursor-pointer transition-all"
                                title="Excluir interesse"
                              >
                                &times;
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {/* Courses Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {FREE_COURSES.filter(c =>
                        c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        c.platform.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        c.description.toLowerCase().includes(searchTerm.toLowerCase())
                      ).map((course) => {
                        const isActive = selectedMainCourseId === course.id;
                        return (
                          <div
                            key={course.id}
                            onClick={() => {
                              setSelectedMainCourseId(course.id);
                              setSelectedCustomCourse(null);
                            }}
                            className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between h-full relative ${
                              isActive
                                ? "bg-orange-50/50 dark:bg-slate-800/80 border-orange-300 dark:border-orange-500/50 shadow-xs ring-1 ring-orange-400/30"
                                : "bg-white dark:bg-slate-900/50 hover:bg-gray-50 dark:hover:bg-slate-850/60 border-gray-150 dark:border-slate-850"
                            }`}
                          >
                            <div className="space-y-1.5">
                              <div className="flex justify-between items-start gap-2">
                                <span className="text-lg">{course.icon}</span>
                                <span className="bg-[#ff6600]/10 text-[#ff6600] text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">
                                  {course.platform}
                                </span>
                              </div>
                              <h5 className="font-extrabold text-[11.5px] text-gray-800 dark:text-white leading-snug">
                                {course.title}
                              </h5>
                              <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-relaxed font-light">
                                {course.description}
                              </p>
                            </div>

                            <div className="mt-3.5 pt-2.5 border-t border-gray-100 dark:border-slate-800/85 flex items-center justify-between gap-1">
                              <span className="text-[9px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/20 px-1.5 py-0.5 rounded-md">
                                <CheckCircle className="h-2.8 w-2.8" /> {course.certText}
                              </span>
                              <a
                                href={course.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="text-[10px] text-orange-650 dark:text-orange-400 hover:underline font-extrabold flex items-center gap-0.5"
                                title="Acessar plataforma externa do curso grátis"
                              >
                                Aceder <ExternalLink className="h-2.5 w-2.5" />
                              </a>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Physical Local Recommendations Panel */}
                  <div className="bg-[#ff6600]/5 dark:bg-orange-950/10 rounded-2xl p-4 border border-[#ff6600]/20 space-y-3.5">
                    <div className="flex items-start gap-2 text-orange-700 dark:text-orange-400">
                      <AlertTriangle className="h-5 w-5 shrink-0 text-[#ff6600] mt-0.5" />
                      <div className="space-y-0.5">
                        <h5 className="font-extrabold text-[10.5px] text-gray-800 dark:text-orange-300 uppercase tracking-widest">
                          Sugerir Ensino Presencial em Moçambique:
                        </h5>
                        <p className="text-[10px] text-gray-600 dark:text-gray-400 leading-relaxed">
                          ⚠️ <strong>AVISO IMPORTANTE:</strong> Ao contrário dos recursos gratuitos online listados acima, as aulas presenciais nestas instituições exigem locomoção física e são **PAGAS** (com taxas de inscrição e propinas próprias cobradas internamente).
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2.5">
                      <p className="text-[11px] font-bold text-gray-700 dark:text-gray-300">
                        Centros recomendados em Moçambique para{" "}
                        <span className="text-[#ff6600] font-black underline">
                          {selectedMainCourseId === "custom" && selectedCustomCourse
                            ? `"${selectedCustomCourse}"`
                            : FREE_COURSES.find(c => c.id === selectedMainCourseId)?.title}
                        </span>:
                      </p>

                      <div className="space-y-2 max-h-[190px] overflow-y-auto pr-1">
                        {(() => {
                          const getSelectedCourseCategory = () => {
                            if (selectedMainCourseId === "custom" && selectedCustomCourse) {
                              const lower = selectedCustomCourse.toLowerCase();
                              if (lower.includes("autocad") || lower.includes("desenho") || lower.includes("obra") || lower.includes("civil") || lower.includes("arquit") || lower.includes("constru") || lower.includes("planta") || lower.includes("mestre")) {
                                return "autocad";
                              }
                              if (lower.includes("excel") || lower.includes("finan") || lower.includes("contab") || lower.includes("fatur") || lower.includes("caixa") || lower.includes("folha") || lower.includes("salar")) {
                                return "excel";
                              }
                              if (lower.includes("market") || lower.includes("publi") || lower.includes("vend") || lower.includes("comerc") || lower.includes("negoc") || lower.includes("redes")) {
                                return "marketing";
                              }
                              if (lower.includes("code") || lower.includes("web") || lower.includes("desenvol") || lower.includes("program") || lower.includes("computa") || lower.includes("ti") || lower.includes("inf") || lower.includes("soft") || lower.includes("tecnolog")) {
                                return "nocode";
                              }
                              if (lower.includes("empree") || lower.includes("gest") || lower.includes("negoc") || lower.includes("admin")) {
                                return "gestao";
                              }
                              if (lower.includes("direi") || lower.includes("leg") || lower.includes("contra") || lower.includes("advoc") || lower.includes("bi") || lower.includes("minut") || lower.includes("duat")) {
                                return "direito";
                              }
                            }
                            return selectedMainCourseId;
                          };

                          const cat = getSelectedCourseCategory();
                          let matches = PAID_INSTITUTIONS.filter(inst => inst.categories.includes(cat));
                          if (matches.length === 0) {
                            matches = PAID_INSTITUTIONS.slice(0, 2);
                          }
                          return matches.map((inst, idx) => (
                            <div key={idx} className="bg-white dark:bg-slate-900 border border-gray-150 dark:border-slate-800 p-3 rounded-xl space-y-1.5 shadow-2xs">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                                <h6 className="font-extrabold text-[11px] text-slate-800 dark:text-white flex items-center gap-1">
                                  🏢 {inst.name}
                                </h6>
                                <span className="bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-gray-400 text-[8.5px] px-1.5 py-0.5 rounded font-mono font-bold tracking-tight">
                                  {inst.locations}
                                </span>
                              </div>
                              <p className="text-[9.5px] text-gray-500 dark:text-gray-400 leading-relaxed font-light">
                                {inst.description}
                              </p>
                              <div className="text-[9.5px] font-bold text-red-650 dark:text-red-400 bg-red-50/40 dark:bg-red-950/20 px-2 py-0.5 rounded w-max border border-red-100/30">
                                {inst.priceInfo}
                              </div>
                            </div>
                          ));
                        })()}
                      </div>
                    </div>
                  </div>

                  {/* Signup waiting list banner */}
                  {notified ? (
                    <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 p-4 rounded-xl text-center space-y-1.5">
                      <p className="font-bold text-emerald-800 dark:text-emerald-400">✓ Demonstrado com Sucesso!</p>
                      <p className="text-[11px] text-emerald-750 dark:text-emerald-500">
                        O seu pedido foi estruturado e enviado ao Diretor Jonson JB. Notificá-lo-emos via WhatsApp com encaminhamento de bolsas gratuitas ou orientações recomendadas!
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleNotifySubmit} className="bg-orange-50/30 dark:bg-slate-800/40 border border-orange-100 dark:border-slate-700/80 p-4 rounded-2xl space-y-3">
                      <h4 className="font-bold text-slate-800 dark:text-white text-xs flex items-center gap-1">
                        <Sparkles className="h-3.8 w-3.8 text-[#ff6600]" /> Solicitar Suporte de Bolsas / Entrar na Lista de Espera:
                      </h4>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed font-light">
                        Insira os seus dados de contacto moçambicanos abaixo para solicitar ajuda de admissão ou ser notificado de parcerias de bolsas com centros presenciais:
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input
                          type="text"
                          required
                          value={notifyName}
                          onChange={(e) => setNotifyName(e.target.value)}
                          placeholder="Seu Nome Completo"
                          className="px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl outline-none focus:border-[#ff6600] text-gray-800 dark:text-white"
                        />
                        <input
                          type="text"
                          required
                          value={notifyPhone}
                          onChange={(e) => setNotifyPhone(e.target.value)}
                          placeholder="Telemóvel (WhatsApp)"
                          className="px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl outline-none focus:border-[#ff6600] text-gray-800 dark:text-white"
                        />
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                        <p className="text-[10px] text-gray-400 dark:text-gray-550 italic leading-relaxed">
                          *O curso selecionado acima será guardado no seu formulário de contacto.
                        </p>
                        <button
                          type="submit"
                          disabled={isNotifying}
                          className="py-1.5 px-4 bg-[#ff6600] text-white hover:bg-orange-600 rounded-xl font-bold cursor-pointer transition-colors text-xs flex items-center gap-1.5 self-end shrink-0 shadow-xs"
                        >
                          {isNotifying ? "A preparar..." : "Submeter ao Diretor Geral Jonson JB 📲"}
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}

              {/* 4. Modal: AJUDA E MANUTENÇÃO (Keep site alive) */}
              {activeModal === "ajuda" && (
                <div className="space-y-6 animate-fade-in" id="help-modal-content">
                  
                  {/* Maputo HQ Visual Card */}
                  <div className="bg-gradient-to-br from-slate-900 via-[#2c3e50] to-slate-800 text-white p-5 rounded-2xl relative overflow-hidden border border-slate-700 shadow-md">
                    {/* Abstract design elements */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#ff6600]/10 rounded-full blur-2xl pointer-events-none"></div>
                    <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-blue-500/10 rounded-full blur-xl pointer-events-none"></div>
                    
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
                      <div className="space-y-1.5 flex-1">
                        <span className="bg-[#ff6600] text-white text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-widest block w-max font-mono">
                          📍 Sede Oficial Moçambicana
                        </span>
                        <h4 className="font-extrabold text-sm sm:text-base flex items-center gap-1.5">
                          Estamos em Maputo, Moçambique
                        </h4>
                        <p className="text-[10.5px] text-gray-300 font-light leading-relaxed">
                          Toda a concepção, desenvolvimento do algoritmo de engenharia civil, centralização do portal <strong>Netek</strong> e canais <strong>FixMoz</strong> e <strong>Kayamoz</strong> são mantidos a partir de nossa central técnica em Maputo.
                        </p>
                      </div>
                      
                      {/* Interactivity details bubble */}
                      <div className="bg-white/5 border border-white/10 p-3 rounded-xl shrink-0 text-center sm:text-right space-y-0.5 w-full sm:w-auto">
                        <span className="text-[9px] text-orange-300 font-bold block uppercase tracking-wider">Atendimento Local</span>
                        <p className="text-xs font-bold text-white">Segunda a Sábado</p>
                        <p className="text-[10px] text-gray-400">Das 08:00h às 17:00h</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-bold text-gray-800 text-sm flex items-center gap-1.5">
                      💖 Apoie a Manutenção e Servidores
                    </h4>
                    <p className="text-[11px] text-gray-500 leading-relaxed">
                      Este portal é gratuito para todos os cidadãos moçambicanos e mantido de maneira filantrópica pelo <strong>Líder Jonson JB</strong>. O seu apoio voluntário ajuda a pagar os custos mensais de servidores de bases de dados, largura de banda e serviços de infraestrutura para que continue livre.
                    </p>
                  </div>

                  {donationSuccess ? (
                    <div className="bg-emerald-50 border border-emerald-100 p-5 rounded-2xl text-center space-y-2.5">
                      <p className="font-bold text-emerald-800 text-sm flex items-center justify-center gap-1">
                        <CheckCircle className="h-5 w-5 text-emerald-600" /> Contribuição Informada via WhatsApp!
                      </p>
                      <p className="text-[11.5px] text-emerald-700 leading-relaxed">
                        Muito obrigado! Geramos o rascunho oficial de agradecimento para enviar ao Diretor Jonson JB. A sua contribuição é essencial para manter a engenharia, emprego e habitação gratuita no nosso país.
                      </p>
                      <div className="pt-2">
                        <button
                          type="button"
                          onClick={() => setDonationSuccess(false)}
                          className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all cursor-pointer"
                        >
                          Efetuar Outro Apoio
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      
                      {/* Interactive Section Toggles (M-Pesa, e-Mola, mKesh, PayPal) without wasting space */}
                      <div className="space-y-1">
                        <label className="block text-[10px] font-black uppercase tracking-widest text-[#2c3e50] mb-2">
                          Selecione o Canal de Apoio para ver as Informações:
                        </label>
                        
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          {/* 1. Mpesa */}
                          <button
                            type="button"
                            onClick={() => setDonationMethod("mpesa")}
                            className={`p-3 rounded-xl border text-left transition-all relative cursor-pointer ${
                              donationMethod === "mpesa"
                                ? "bg-red-50/55 border-red-500 shadow-xs"
                                : "bg-white border-gray-200 hover:bg-gray-50 animate-fade-in"
                            }`}
                          >
                            <span className="block text-[9px] font-bold text-gray-400 uppercase">Vodacom</span>
                            <span className="block text-xs font-extrabold text-red-600">M-Pesa 🇲🇿</span>
                            {donationMethod === "mpesa" && (
                              <span className="absolute top-2 right-2 w-2 h-2 bg-red-600 rounded-full"></span>
                            )}
                          </button>

                          {/* 2. Emola */}
                          <button
                            type="button"
                            onClick={() => setDonationMethod("emola")}
                            className={`p-3 rounded-xl border text-left transition-all relative cursor-pointer ${
                              donationMethod === "emola"
                                ? "bg-orange-50/55 border-orange-500 shadow-xs"
                                : "bg-white border-gray-200 hover:bg-gray-50"
                            }`}
                          >
                            <span className="block text-[9px] font-bold text-gray-400 uppercase">Movitel</span>
                            <span className="block text-xs font-extrabold text-orange-600">e-Mola 🇲🇿</span>
                            {donationMethod === "emola" && (
                              <span className="absolute top-2 right-2 w-2 h-2 bg-orange-600 rounded-full"></span>
                            )}
                          </button>

                          {/* 3. Mkesh */}
                          <button
                            type="button"
                            onClick={() => setDonationMethod("mkesh")}
                            className={`p-3 rounded-xl border text-left transition-all relative cursor-pointer ${
                              donationMethod === "mkesh"
                                ? "bg-yellow-50/55 border-yellow-500 shadow-xs"
                                : "bg-white border-gray-200 hover:bg-gray-50"
                            }`}
                          >
                            <span className="block text-[9px] font-bold text-gray-400 uppercase">Tmcel</span>
                            <span className="block text-xs font-extrabold text-[#2c3e50]">mKesh 🇲🇿</span>
                            {donationMethod === "mkesh" && (
                              <span className="absolute top-2 right-2 w-2 h-2 bg-[#2c3e50] rounded-full"></span>
                            )}
                          </button>

                          {/* 4. Paypal */}
                          <button
                            type="button"
                            onClick={() => setDonationMethod("paypal")}
                            className={`p-3 rounded-xl border text-left transition-all relative cursor-pointer ${
                              donationMethod === "paypal"
                                ? "bg-blue-50/55 border-blue-500 shadow-xs"
                                : "bg-white border-gray-200 hover:bg-gray-50"
                            }`}
                          >
                            <span className="block text-[9px] font-bold text-gray-400 uppercase">Internacional</span>
                            <span className="block text-xs font-extrabold text-blue-600">PayPal 🌐</span>
                            {donationMethod === "paypal" && (
                              <span className="absolute top-2 right-2 w-2 h-2 bg-blue-600 rounded-full"></span>
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Display Accordion Details Area dynamically per clicked channel */}
                      <div className="bg-gray-50/50 border border-gray-200 rounded-2xl p-5 space-y-4 relative overflow-hidden transition-all">
                        
                        <div className="absolute top-0 right-0 p-3 opacity-10 pointer-events-none select-none font-black text-6xl text-[#2c3e50]">
                          {donationMethod.toUpperCase()}
                        </div>

                        {/* M-PESA CHANNEL DETAILS PANEL */}
                        {donationMethod === "mpesa" && (
                          <div className="space-y-3 animate-fade-in">
                            <div className="flex items-center gap-2">
                              <span className="w-2.5 h-2.5 bg-red-600 rounded-full animate-ping"></span>
                              <h5 className="font-extrabold text-xs uppercase text-slate-800">Apoio via M-Pesa (Vodacom Moçambique)</h5>
                            </div>
                            
                            <p className="text-[10.5px] text-gray-500 leading-relaxed font-light">
                              Faça a transferência para o número M-Pesa oficial da nossa administração em Maputo. O envio é creditado e utilizado nas despesas da computação Netek:
                            </p>

                            <div className="bg-white border border-gray-200 rounded-xl p-3 flex items-center justify-between gap-3 shadow-3xs">
                              <div>
                                <span className="text-[9px] text-gray-450 uppercase font-black tracking-wider block">Número oficial de destino</span>
                                <span className="text-sm font-black text-red-600 font-mono">840166592</span>
                                <span className="block text-[8px] text-gray-450 mt-0.5">Titular: PENIEL DINIS MUCAVELE (Jonson JB7)</span>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleCopyText("840166592", "mpesa")}
                                className={`text-[10px] font-bold px-3 py-1.5 rounded-lg border transition-all cursor-pointer flex items-center gap-1 ${
                                  copiedText === "mpesa"
                                    ? "bg-emerald-50 border-emerald-300 text-emerald-700 font-black animate-pulse"
                                    : "bg-gray-50 hover:bg-gray-100 border-gray-250 text-gray-650"
                                }`}
                              >
                                {copiedText === "mpesa" ? (
                                  <>
                                    <Check className="h-3 w-3 text-emerald-600" /> Copiado!
                                  </>
                                ) : (
                                  <>
                                    <Copy className="h-3 w-3" /> Copiar Número
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        )}

                        {/* E-MOLA CHANNEL DETAILS PANEL */}
                        {donationMethod === "emola" && (
                          <div className="space-y-3 animate-fade-in">
                            <div className="flex items-center gap-2">
                              <span className="w-2.5 h-2.5 bg-orange-500 rounded-full animate-ping"></span>
                              <h5 className="font-extrabold text-xs uppercase text-slate-800">Apoio via e-Mola (Movitel Moçambique)</h5>
                            </div>
                            
                            <p className="text-[10.5px] text-gray-500 leading-relaxed font-light">
                              Envie o valor de incentivo livre ou pagamento corporativo utilizando o sistema e-Mola em Moçambique:
                            </p>

                            <div className="bg-white border border-gray-200 rounded-xl p-3 flex items-center justify-between gap-3 shadow-3xs">
                              <div>
                                <span className="text-[9px] text-gray-450 uppercase font-black tracking-wider block">Número oficial de destino</span>
                                <span className="text-sm font-black text-orange-600 font-mono">874786943</span>
                                <span className="block text-[8px] text-gray-450 mt-0.5">Titular: PENIEL DINIS MUCAVELE (Jonson JB7)</span>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleCopyText("874786943", "emola")}
                                className={`text-[10px] font-bold px-3 py-1.5 rounded-lg border transition-all cursor-pointer flex items-center gap-1 ${
                                  copiedText === "emola"
                                    ? "bg-emerald-50 border-emerald-300 text-emerald-700 font-black animate-pulse"
                                    : "bg-gray-50 hover:bg-gray-100 border-gray-250 text-gray-650"
                                }`}
                              >
                                {copiedText === "emola" ? (
                                  <>
                                    <Check className="h-3 w-3 text-emerald-600" /> Copiado!
                                  </>
                                ) : (
                                  <>
                                    <Copy className="h-3 w-3" /> Copiar Número
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        )}

                        {/* MKESH CHANNEL DETAILS PANEL */}
                        {donationMethod === "mkesh" && (
                          <div className="space-y-3 animate-fade-in">
                            <div className="flex items-center gap-2">
                              <span className="w-2.5 h-2.5 bg-[#2c3e50] rounded-full animate-ping"></span>
                              <h5 className="font-extrabold text-xs uppercase text-slate-800">Apoio via mKesh (Tmcel Moçambique)</h5>
                            </div>
                            
                            <p className="text-[10.5px] text-gray-500 leading-relaxed font-light">
                              Suporta transferências gratuitas Tmcel mKesh direto ao saldo administrativo do portal:
                            </p>

                            <div className="bg-white border border-gray-200 rounded-xl p-3 flex items-center justify-between gap-3 shadow-3xs">
                              <div>
                                <span className="text-[9px] text-gray-450 uppercase font-black tracking-wider block">Número oficial de destino</span>
                                <span className="text-sm font-black text-[#2c3e50] font-mono">835109190</span>
                                <span className="block text-[8px] text-gray-450 mt-0.5">Titular: PENIEL DINIS MUCAVELE (Jonson JB7)</span>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleCopyText("835109190", "mkesh")}
                                className={`text-[10px] font-bold px-3 py-1.5 rounded-lg border transition-all cursor-pointer flex items-center gap-1 ${
                                  copiedText === "mkesh"
                                    ? "bg-emerald-50 border-emerald-300 text-emerald-700 font-black animate-pulse"
                                    : "bg-gray-50 hover:bg-gray-100 border-gray-250 text-gray-650"
                                }`}
                              >
                                {copiedText === "mkesh" ? (
                                  <>
                                    <Check className="h-3 w-3 text-emerald-600" /> Copiado!
                                  </>
                                ) : (
                                  <>
                                    <Copy className="h-3 w-3" /> Copiar Número
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        )}

                        {/* PAYPAL CHANNEL DETAILS PANEL */}
                        {donationMethod === "paypal" && (
                          <div className="space-y-3 animate-fade-in">
                            <div className="flex items-center gap-2">
                              <span className="w-2.5 h-2.5 bg-blue-600 rounded-full animate-ping"></span>
                              <h5 className="font-extrabold text-xs uppercase text-slate-800">Apoio via PayPal Internacional</h5>
                            </div>
                            
                            <p className="text-[10.5px] text-gray-500 leading-relaxed font-light">
                              Para apoiadores internacionais ou de órgãos corporativos que utilizam canais como dólares (USD) ou Euros (EUR):
                            </p>

                            <div className="bg-white border border-gray-200 rounded-xl p-3 flex items-center justify-between gap-3 shadow-3xs">
                              <div>
                                <span className="text-[9px] text-gray-450 uppercase font-black tracking-wider block">Email PayPal oficial</span>
                                <span className="text-sm font-black text-blue-600 font-mono">netekservices@gmail.com</span>
                                <span className="block text-[8px] text-gray-450 mt-0.5">Titular: PENIEL DINIS MUCAVELE (Jonson JB7 / Netek)</span>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleCopyText("netekservices@gmail.com", "paypal")}
                                className={`text-[10px] font-bold px-3 py-1.5 rounded-lg border transition-all cursor-pointer flex items-center gap-1 ${
                                  copiedText === "paypal"
                                    ? "bg-emerald-50 border-emerald-300 text-emerald-700 font-black animate-pulse"
                                    : "bg-gray-50 hover:bg-gray-100 border-gray-250 text-gray-650"
                                }`}
                              >
                                {copiedText === "paypal" ? (
                                  <>
                                    <Check className="h-3 w-3 text-emerald-600" /> Copiado!
                                  </>
                                ) : (
                                  <>
                                    <Copy className="h-3 w-3" /> Copiar Email
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Input details to coordinate communication \& thank you note */}
                        <form onSubmit={handleDonationSubmit} className="space-y-4 pt-3 border-t border-gray-200">
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                            {/* Donation Amount Choice */}
                            <div>
                              <label className="block text-[10px] uppercase font-black tracking-wider text-gray-400 mb-1">
                                Valor Pretendido (Incentivo)
                              </label>
                              <div className="flex flex-wrap gap-1.55">
                                {["100", "250", "500", "1000"].map((v) => (
                                  <button
                                    key={v}
                                    type="button"
                                    onClick={() => setDonationAmount(v)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                                      donationAmount === v
                                        ? "bg-[#ff6600] text-white border-[#ff6600]"
                                        : "bg-white border-gray-250 text-gray-600 hover:bg-gray-100"
                                    }`}
                                  >
                                    {v} {donationMethod === "paypal" ? "$" : "MT"}
                                  </button>
                                ))}
                                <input
                                  type="number"
                                  value={donationAmount}
                                  onChange={(e) => setDonationAmount(e.target.value)}
                                  placeholder="Outro"
                                  className="w-[60px] px-2 py-1 bg-white border border-gray-250 rounded-lg text-xs text-center outline-none focus:border-[#ff6600]"
                                />
                              </div>
                            </div>

                            {/* Payer Identifier */}
                            <div className="space-y-1">
                              <label className="block text-[10px] uppercase font-black tracking-wider text-gray-400">
                                {donationMethod === "paypal" ? "Seu Email de Envio" : "O Seu Celular de Origem"}
                              </label>
                              <input
                                type="text"
                                required
                                value={donationPhone}
                                onChange={(e) => setDonationPhone(e.target.value)}
                                placeholder={donationMethod === "paypal" ? "Ex. seu@email.com" : "Ex. 84 / 85 / 87..."}
                                className="w-full px-3 py-1.5 bg-white border border-gray-250 rounded-xl outline-none text-xs text-gray-800 focus:border-[#ff6600] transition-colors"
                              />
                            </div>
                          </div>

                          <button
                            type="submit"
                            className="w-full py-2.5 bg-[#ff6600] hover:bg-orange-600 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm shadow-orange-500/10"
                          >
                            <Phone className="h-4 w-4" /> Informar Contribuição ao Jonson JB (WhatsApp)
                          </button>
                        </form>

                      </div>
                    </div>
                  )}

                </div>
              )}

            </div>

            {/* Footer Closer Action Bar */}
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-150 flex items-center justify-end shrink-0">
              <button
                onClick={onClose}
                className="py-1.5 px-4 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Fechar Painel
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
