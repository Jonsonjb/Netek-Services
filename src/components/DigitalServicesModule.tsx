import React, { useState } from "react";
import { db, handleFirestoreError, OperationType, auth } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import { jsPDF } from "jspdf";
import {
  FileText,
  User,
  Briefcase,
  FileSignature,
  Send,
  MessageSquare,
  AlertCircle,
  GraduationCap,
  Wrench,
  Search,
  Calculator,
  Hammer,
  Cpu,
  Globe,
  Palette,
  CheckCircle2,
  Trash2,
  Plus,
  Minus,
  Info,
  Building2,
  ExternalLink,
  FileDown,
} from "lucide-react";

export interface ServiceItem {
  id: string;
  category: "construcao" | "tecnologia" | "juridico" | "design";
  categoryLabel: string;
  title: string;
  description: string;
  basePrice: number;
  priceNote: string;
  deliveryDays: string;
  unit: string;
}

export const SERVICES_DATA: ServiceItem[] = [
  // 10 Construção & Engenharia
  {
    id: "srv-1",
    category: "construcao",
    categoryLabel: "Construção & Engenharia",
    title: "Cálculo Métrico de Materiais",
    description: "Estimativa profissional de sacos de cimento, ferro, brita, areia e blocos com base na planta de execução.",
    basePrice: 2500,
    priceNote: "Preço base por divisão",
    deliveryDays: "1-2 dias",
    unit: "Divisão"
  },
  {
    id: "srv-2",
    category: "construcao",
    categoryLabel: "Construção & Engenharia",
    title: "Desenho de Planta de Casas 2D/3D",
    description: "Layout arquitetónico focado nas tipologias residenciais moçambicanas de referência (T2, T3, T4, etc.).",
    basePrice: 8500,
    priceNote: "Base por piso",
    deliveryDays: "3-5 dias",
    unit: "Piso"
  },
  {
    id: "srv-3",
    category: "construcao",
    categoryLabel: "Construção & Engenharia",
    title: "Fiscalização Independente de Obra",
    description: "Acompanhamento profissional das etapas de sapata, colunas e vigas para garantir cimento e traço corretos.",
    basePrice: 5000,
    priceNote: "Por visita técnica",
    deliveryDays: "Sob agendamento",
    unit: "Visita"
  },
  {
    id: "srv-4",
    category: "construcao",
    categoryLabel: "Construção & Engenharia",
    title: "Projeto de Betão Armado/Cálculo Estrutural",
    description: "Obrigatório para segurança em construções verticais (sobrados, anexos de múltiplos pisos e coberturas pesadas).",
    basePrice: 12000,
    priceNote: "Base por laje",
    deliveryDays: "5-7 dias",
    unit: "Laje"
  },
  {
    id: "srv-5",
    category: "construcao",
    categoryLabel: "Construção & Engenharia",
    title: "Pintura & Tratamento de Humidade",
    description: "Aplicação profissional de tinta com tratamento preliminar anti-humidade em paredes de blocos.",
    basePrice: 150,
    priceNote: "Por m²",
    deliveryDays: "Conforme área",
    unit: "m²"
  },
  {
    id: "srv-6",
    category: "construcao",
    categoryLabel: "Construção & Engenharia",
    title: "Instalação de Sistemas Hidráulicos (Canalizador)",
    description: "Canalização de esgotos, água fria/quente, tanques de água e bombas de pressão residenciais.",
    basePrice: 3500,
    priceNote: "Por ponto de água",
    deliveryDays: "2-3 dias",
    unit: "Ponto"
  },
  {
    id: "srv-7",
    category: "construcao",
    categoryLabel: "Construção & Engenharia",
    title: "Instalação Elétrica Residenciais",
    description: "Dimensionamento de quadros elétricos, disjuntores, cablagem segura, lâmpadas e tomadas conformadas.",
    basePrice: 4000,
    priceNote: "Preço base monofásico por divisão",
    deliveryDays: "2-4 dias",
    unit: "Divisão"
  },
  {
    id: "srv-8",
    category: "construcao",
    categoryLabel: "Construção & Engenharia",
    title: "Carpintaria Metódica de Acabamentos",
    description: "Montagem de roupeiros embutidos, tetos falsos em PVC/gesso e portas de madeira local robustas.",
    basePrice: 6500,
    priceNote: "Preço base de instalação",
    deliveryDays: "4-7 dias",
    unit: "Unidade"
  },
  {
    id: "srv-9",
    category: "construcao",
    categoryLabel: "Construção & Engenharia",
    title: "Serralharia de Portões e Proteções",
    description: "Construção de grades de segurança reforçadas e portões personalizados de chapa maciça para residências.",
    basePrice: 15000,
    priceNote: "Base de fabrico",
    deliveryDays: "5-10 dias",
    unit: "Estrutura"
  },
  {
    id: "srv-10",
    category: "construcao",
    categoryLabel: "Construção & Engenharia",
    title: "Assentamento de Ladrilhos & Azulejos",
    description: "Revestimentos cerâmicos para cozinhas, wc e salas comuns com alinhamento a laser.",
    basePrice: 200,
    priceNote: "Por m²",
    deliveryDays: "Conforme metragem",
    unit: "m²"
  },

  // 8 Tecnologia & TI
  {
    id: "srv-11",
    category: "tecnologia",
    categoryLabel: "Tecnologia & TI",
    title: "Criação de Landing Page Exclusiva",
    description: "Página de conversão moderna otimizada para captar clientes locais em bairros de Maputo/Matola.",
    basePrice: 7500,
    priceNote: "Base de criação única",
    deliveryDays: "2-4 dias",
    unit: "Projeto"
  },
  {
    id: "srv-12",
    category: "tecnologia",
    categoryLabel: "Tecnologia & TI",
    title: "Desenvolvimento de Website Institucional",
    description: "Ideal para empresas locais de engenharia, imobiliário ou comércio, contendo portfólio completo.",
    basePrice: 18000,
    priceNote: "Completo",
    deliveryDays: "7-12 dias",
    unit: "Website"
  },
  {
    id: "srv-13",
    category: "tecnologia",
    categoryLabel: "Tecnologia & TI",
    title: "Desenvolvimento Web App No-Code",
    description: "Sistemas web interactivos e painéis de controlo de alta complexidade desenvolvidos em tempo recorde no Bubble/Glide.",
    basePrice: 35000,
    priceNote: "Desenvolvimento customizado",
    deliveryDays: "15-20 dias",
    unit: "Sistema"
  },
  {
    id: "srv-14",
    category: "tecnologia",
    categoryLabel: "Tecnologia & TI",
    title: "Instalação & Gestão de Redes Estruturadas",
    description: "Configuração física de cabos categoria 6 e roteadores de longo alcance para pequenas empresas.",
    basePrice: 5000,
    priceNote: "Por andar",
    deliveryDays: "2-3 dias",
    unit: "Instalação"
  },
  {
    id: "srv-15",
    category: "tecnologia",
    categoryLabel: "Tecnologia & TI",
    title: "Manutenção Física & Configuração de Computadores",
    description: "Limpeza física contra poeira, troca de pasta térmica de processador e formatação com reinstalações corporativas.",
    basePrice: 1200,
    priceNote: "Sob consulta por máquina",
    deliveryDays: "1 dia",
    unit: "Equipamento"
  },
  {
    id: "srv-16",
    category: "tecnologia",
    categoryLabel: "Tecnologia & TI",
    title: "Apoio em Configuração Google Workspace",
    description: "Configuração de e-mails profissionais (ex: geral@netekservices.co.mz) usando domínio próprio.",
    basePrice: 3000,
    priceNote: "Configuração de até 5 contas",
    deliveryDays: "1-2 dias",
    unit: "Configuração"
  },
  {
    id: "srv-17",
    category: "tecnologia",
    categoryLabel: "Tecnologia & TI",
    title: "Backup Seguro Automatizado na Nuvem",
    description: "Implementação de rotinas automáticas com sincronização encriptada para salvaguarda de ficheiros sigilosos.",
    basePrice: 4500,
    priceNote: "Base de configuração",
    deliveryDays: "2 dias",
    unit: "Posto"
  },
  {
    id: "srv-18",
    category: "tecnologia",
    categoryLabel: "Tecnologia & TI",
    title: "Suporte Técnico de Helpdesk Mensal",
    description: "Subscrição mensal de assistência técnica local e remota para manter os computadores da empresa sem falhas.",
    basePrice: 8000,
    priceNote: "Mensalidade (até 5 computadores)",
    deliveryDays: "Contrato contínuo",
    unit: "Mês"
  },

  // 8 Jurídicos & Documentos
  {
    id: "srv-19",
    category: "juridico",
    categoryLabel: "Jurídico & Documental",
    title: "Currículo Profissional Magnético",
    description: "Reestruturação de competências e percurso laboral sob termos formais corporativos em Moçambique.",
    basePrice: 500,
    priceNote: "Formatado em PDF e Word",
    deliveryDays: "1 dia",
    unit: "Ficheiro"
  },
  {
    id: "srv-20",
    category: "juridico",
    categoryLabel: "Jurídico & Documental",
    title: "Redação de Cartas de Candidatura Formal",
    description: "Modelagem epistolar de grande força persuasiva voltada para vagas do mercado moçambicano.",
    basePrice: 350,
    priceNote: "Documento final",
    deliveryDays: "1 dia",
    unit: "Carta"
  },
  {
    id: "srv-21",
    category: "juridico",
    categoryLabel: "Jurídico & Documental",
    title: "Minutas de Venda e Compromisso de Lote",
    description: "Acordos bilaterais garantindo a segurança de entrada financeira contra duplicidade de venda de terrenos de outrem.",
    basePrice: 2000,
    priceNote: "Código Civil Moçambicano aplicável",
    deliveryDays: "1-2 dias",
    unit: "Documento"
  },
  {
    id: "srv-22",
    category: "juridico",
    categoryLabel: "Jurídico & Documental",
    title: "Contratos de Arrendamento Comerciais/Urbano",
    description: "Minutas contendo cláusulas precisas relativas a caução de danos, rescisão de prazo e encargos correntes.",
    basePrice: 1500,
    priceNote: "Conforme Artigo 1022 do C. Civil",
    deliveryDays: "1-2 dias",
    unit: "Documento"
  },
  {
    id: "srv-23",
    category: "juridico",
    categoryLabel: "Jurídico & Documental",
    title: "Contratos de Trabalho Individuais",
    description: "Alinhado com a Lei do Trabalho Moçambicana (LT), definindo salários, faltas e compensações de lei.",
    basePrice: 2500,
    priceNote: "Base adaptável",
    deliveryDays: "2 dias",
    unit: "Contrato"
  },
  {
    id: "srv-24",
    category: "juridico",
    categoryLabel: "Jurídico & Documental",
    title: "Declarações formais & Minutas de Procuração",
    description: "Minutas de procuração de plenos poderes para representação legal municipal ou bancária.",
    basePrice: 800,
    priceNote: "Minuta formal pronta",
    deliveryDays: "1 dia",
    unit: "Minuta"
  },
  {
    id: "srv-25",
    category: "juridico",
    categoryLabel: "Jurídico & Documental",
    title: "Assessoria Documental de DUAT",
    description: "Instrução estruturada do processo de obtenção de DUAT definitivo nos cadastros municipais.",
    basePrice: 6000,
    priceNote: "Fase consultiva",
    deliveryDays: "2-3 dias",
    unit: "Lote"
  },
  {
    id: "srv-26",
    category: "juridico",
    categoryLabel: "Jurídico & Documental",
    title: "Apoio no Licenciamento Comercial / Alvará",
    description: "Reunião de documentação, formulários de preenchimento e acompanhamento de taxas administrativas.",
    basePrice: 10000,
    priceNote: "Exclui emolumentos públicos",
    deliveryDays: "5-10 dias",
    unit: "Processo"
  },

  // 4 Design & Redes Sociais
  {
    id: "srv-27",
    category: "design",
    categoryLabel: "Design, Marketing & Outros",
    title: "Criação de Logótipo & Branding",
    description: "Identidade visual profissional incluindo logótipo vetorial, selo para marca de água e manual de cores.",
    basePrice: 4000,
    priceNote: "Kit Digital Vetorial",
    deliveryDays: "4-6 dias",
    unit: "Design"
  },
  {
    id: "srv-28",
    category: "design",
    categoryLabel: "Design, Marketing & Outros",
    title: "Gestão e Geração de Conteúdo para Redes Sociais",
    description: "Criação de anúncios gráficos periódicos para redes sociais com estratégias de divulgação paga local.",
    basePrice: 6000,
    priceNote: "Mensalidade (até 12 criações)",
    deliveryDays: "Mensal",
    unit: "Mês"
  },
  {
    id: "srv-29",
    category: "design",
    categoryLabel: "Design, Marketing & Outros",
    title: "Tradução Técnica Inglês - Português",
    description: "Tradução analítica de manuais, contratos, minutas ou e-mails corporativos com alta precisão vocabular.",
    basePrice: 450,
    priceNote: "Por folha A4",
    deliveryDays: "1-2 dias",
    unit: "Página"
  },
  {
    id: "srv-30",
    category: "design",
    categoryLabel: "Design, Marketing & Outros",
    title: "Formação Básica de Excel para Negócios",
    description: "Aulas práticas com fórmulas de controlo de caixa, folhas salariais de empregados e inventários de comércio.",
    basePrice: 1500,
    priceNote: "Por aluno individual",
    deliveryDays: "Conforme sessões",
    unit: "Formando"
  }
];

export default function DigitalServicesModule({ isAdmin }: { isAdmin: boolean }) {
  const [activeSubTab, setActiveSubTab] = useState<"cv" | "carta" | "contrato" | "catalogo" | "pre-marcacao">("catalogo");

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states - Pre-marcação Moçambique
  const [preName, setPreName] = useState("");
  const [prePhone, setPrePhone] = useState("");
  const [preDocType, setPreDocType] = useState("BI (Bilhete de Identidade)");
  const [preDetails, setPreDetails] = useState("");

  // Form states - CV
  const [cvName, setCvName] = useState("");
  const [cvPhone, setCvPhone] = useState("");
  const [cvEmail, setCvEmail] = useState("");
  const [cvProfession, setCvProfession] = useState("");
  const [cvExperience, setCvExperience] = useState("");
  const [cvEducation, setCvEducation] = useState("");
  const [cvSkills, setCvSkills] = useState("");
  const [cvObjective, setCvObjective] = useState("");

  // Form states - Letters
  const [letterName, setLetterName] = useState("");
  const [letterPhone, setLetterPhone] = useState("");
  const [letterEmail, setLetterEmail] = useState("");
  const [letterRecipient, setLetterRecipient] = useState("");
  const [letterPurpose, setLetterPurpose] = useState("");
  const [letterBody, setLetterBody] = useState("");

  // Form states - Contracts
  const [contractClient, setContractClient] = useState("");
  const [contractIdNum, setContractIdNum] = useState("");
  const [contractType, setContractType] = useState("Prestação de Serviços");
  const [contractValue, setContractValue] = useState("");
  const [contractDetails, setContractDetails] = useState("");

  // Catalog tab states & calculators
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<"tudo" | "construcao" | "tecnologia" | "juridico" | "design">("tudo");
  const [cart, setCart] = useState<Record<string, number>>({});
  const [customNotes, setCustomNotes] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [clientName, setClientName] = useState("");

  // Cart operations
  const addToCart = (serviceId: string) => {
    setCart((prev) => ({
      ...prev,
      [serviceId]: (prev[serviceId] || 0) + 1,
    }));
  };

  const removeFromCart = (serviceId: string) => {
    setCart((prev) => {
      const updated = { ...prev };
      const currentQty = updated[serviceId] || 0;
      if (currentQty <= 1) {
        delete updated[serviceId];
      } else {
        updated[serviceId] = currentQty - 1;
      }
      return updated;
    });
  };

  const clearFromCart = (serviceId: string) => {
    setCart((prev) => {
      const updated = { ...prev };
      delete updated[serviceId];
      return updated;
    });
  };

  const getCartTotal = () => {
    let total = 0;
    Object.entries(cart).forEach(([id, qty]) => {
      const item = SERVICES_DATA.find((s) => s.id === id);
      if (item) {
        total += item.basePrice * Number(qty);
      }
    });
    return total;
  };

  const hasItemsInCart = Object.keys(cart).length > 0;

  const handleCustomQuoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasItemsInCart) {
      alert("Por favor selecione pelo menos 1 serviço do catálogo para pedir cotação.");
      return;
    }

    setIsSubmitting(true);

    const selectedList = Object.entries(cart).map(([id, qty]) => {
      const srv = SERVICES_DATA.find((s) => s.id === id)!;
      return {
        id: srv.id,
        title: srv.title,
        quantity: Number(qty),
        unitPrice: srv.basePrice,
        subtotal: srv.basePrice * Number(qty),
        unit: srv.unit,
      };
    });

    const calculatedTotal = getCartTotal();

    const dataPayload = {
      clientName: clientName || "Cliente Geral Anónimo",
      clientPhone: clientPhone || "Não fornecido",
      selectedServices: selectedList,
      estimatedTotal: calculatedTotal,
      notes: customNotes,
      createdAt: Date.now(),
      userId: auth.currentUser?.uid || "anonimo",
    };

    try {
      // 1. Save to firestore collection 'pedidos_servicos_custom'
      await addDoc(collection(db, "pedidos_servicos_custom"), dataPayload);

      // 2. Draft message & redirect to WhatsApp Jonson JB
      let msg = `Olá Diretor Jonson JB! Montei um pedido de cotação de múltiplos serviços no portal Netek Services:\n`;
      msg += `*Cliente:* ${clientName || "Geral/Anónimo"}\n`;
      msg += `*Telefone:* ${clientPhone || "Não especificado"}\n\n`;
      msg += `*Serviços Selecionados:*\n`;
      
      selectedList.forEach((item, index) => {
        msg += `${index + 1}. *${item.title}* (${item.quantity}x ${item.unit}) -> _Subtotal: ${item.subtotal.toLocaleString("pt-MZ")} MT_\n`;
      });

      msg += `\n*Total Estimado:* ${calculatedTotal.toLocaleString("pt-MZ")} MT\n`;
      if (customNotes.trim()) {
        msg += `*Observações do Cliente:* "${customNotes}"\n`;
      }
      
      msg += `\nSolicito validação e envio do orçamento formal timbrado. Obrigado!`;

      window.open(`https://wa.me/258835109190?text=${encodeURIComponent(msg)}`, "_blank");

      // Auto clear cart & inputs
      setCart({});
      setCustomNotes("");
      setClientName("");
      setClientPhone("");
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, "pedidos_servicos_custom");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCvSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const dataPayload = {
      fullName: cvName,
      phone: cvPhone,
      email: cvEmail,
      profession: cvProfession,
      experience: cvExperience,
      education: cvEducation,
      skills: cvSkills,
      objective: cvObjective,
      createdAt: Date.now(),
      userId: auth.currentUser?.uid || "anonimo",
    };

    try {
      // 1. Save to firestore collection 'pedidos_cv'
      await addDoc(collection(db, "pedidos_cv"), dataPayload);

      // 2. Draft message & redirect to WhatsApp
      const msg = `Olá Diretor Jonson JB! Solicito a elaboração de Currículo Profissional com estes dados:\n\n*Nome:* ${cvName}\n*Contacto:* ${cvPhone}\n*E-mail:* ${cvEmail}\n*Profissão:* ${cvProfession}\n*Objetivo:* ${cvObjective}\n*Experiência:* ${cvExperience}\n*Educação:* ${cvEducation}\n*Habilidades:* ${cvSkills}`;
      window.open(`https://wa.me/258835109190?text=${encodeURIComponent(msg)}`, "_blank");

      // Auto clear
      setCvName("");
      setCvPhone("");
      setCvEmail("");
      setCvProfession("");
      setCvExperience("");
      setCvEducation("");
      setCvSkills("");
      setCvObjective("");
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, "pedidos_cv");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLetterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const dataPayload = {
      fullName: letterName,
      phone: letterPhone,
      email: letterEmail,
      recipient: letterRecipient,
      purpose: letterPurpose,
      bodyText: letterBody,
      createdAt: Date.now(),
      userId: auth.currentUser?.uid || "anonimo",
    };

    try {
      // 1. Save to firestore collection 'pedidos_cartas'
      await addDoc(collection(db, "pedidos_cartas"), dataPayload);

      // 2. Draft message & redirect to WhatsApp
      const msg = `Olá Diretor Jonson JB! Solicito a elaboração de Carta Formal:\n\n*Remetente:* ${letterName}\n*Contacto:* ${letterPhone}\n*E-mail:* ${letterEmail}\n*Destinatário:* ${letterRecipient}\n*Assunto/Motivo:* ${letterPurpose}\n*Esboço do Texto:* ${letterBody}`;
      window.open(`https://wa.me/258835109190?text=${encodeURIComponent(msg)}`, "_blank");

      // Auto clear
      setLetterName("");
      setLetterPhone("");
      setLetterEmail("");
      setLetterRecipient("");
      setLetterPurpose("");
      setLetterBody("");
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, "pedidos_cartas");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleContractSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const parsedValue = parseFloat(contractValue) || 0;
    const dataPayload = {
      clientName: contractClient,
      clientIdNumber: contractIdNum,
      contractType,
      contractValue: parsedValue,
      details: contractDetails,
      createdAt: Date.now(),
      userId: auth.currentUser?.uid || "anonimo",
    };

    try {
      // 1. Save to firestore collection 'pedidos_contratos'
      await addDoc(collection(db, "pedidos_contratos"), dataPayload);

      // 2. Draft message & redirect to WhatsApp
      const msg = `Olá Diretor Jonson JB! Solicito a elaboração de Minuta de Contrato Legal:\n\n*Outorgante:* ${contractClient}\n*BI Nº:* ${contractIdNum}\n*Tipo de Contrato:* ${contractType}\n*Valor:* ${parsedValue} MZN\n*Detalhes:* ${contractDetails}`;
      window.open(`https://wa.me/258835109190?text=${encodeURIComponent(msg)}`, "_blank");

      // Auto clear
      setContractClient("");
      setContractIdNum("");
      setContractValue("");
      setContractDetails("");
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, "pedidos_contratos");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownloadContractPDF = () => {
    try {
      const doc = new jsPDF();
      
      // Header Letterhead
      doc.setFillColor(44, 62, 80); // #2c3e50 Deep Slate
      doc.rect(0, 0, 210, 35, "F");

      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.text("NETEK SERVICES MOCAMBIQUE", 14, 15);
      
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.text("Assessoria Tecnica, Juridica Geral e Processual", 14, 21);
      doc.text("Sede Oficial: Cidade de Maputo, Mocambique | Tel: +258 83 510 9190 | admin@jonsonjb.com", 14, 26);
      
      // Document Title
      doc.setTextColor(44, 62, 80);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.text(`MINUTA PRELIMINAR: ${(contractType || "Acordo").toUpperCase()}`, 14, 48);
      
      doc.setDrawColor(220, 224, 230);
      doc.line(14, 52, 196, 52);

      // Metadata section
      doc.setTextColor(80, 80, 80);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9.5);
      doc.text("Primeiro Outorgante:", 14, 61);
      doc.setFont("helvetica", "normal");
      doc.text("Netek Services & Empreendimentos (Maputo)", 55, 61);

      doc.setFont("helvetica", "bold");
      doc.text("Segundo Outorgante:", 14, 67);
      doc.setFont("helvetica", "normal");
      doc.text(`${contractClient || "Joao Manuel Macuacua"}`, 55, 67);

      doc.setFont("helvetica", "bold");
      doc.text("BI Mocambicano No:", 14, 73);
      doc.setFont("helvetica", "normal");
      doc.text(`${contractIdNum || "110101987364Z"}`, 55, 73);

      doc.setFont("helvetica", "bold");
      doc.text("Valor do Acordo MZN:", 14, 79);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(230, 90, 0); // Orange shade
      const formattedValue = contractValue ? Number(contractValue).toLocaleString("pt-MZ") : "0";
      doc.text(`${formattedValue} MT (MZN)`, 55, 79);
      
      doc.setTextColor(80, 80, 80);
      doc.setFont("helvetica", "bold");
      doc.text("Data de Emissao:", 14, 85);
      doc.setFont("helvetica", "normal");
      doc.text(`${new Date().toLocaleDateString("pt-MZ")} as ${new Date().toLocaleTimeString("pt-MZ")}`, 55, 85);

      doc.setDrawColor(200, 200, 200);
      doc.line(14, 91, 196, 91);

      // Document Body
      doc.setTextColor(40, 40, 40);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.text("CLAUSULAS CONTRATUAIS GERAIS SUGERIDAS", 14, 100);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      
      // Clause 1
      doc.setFont("helvetica", "bold");
      doc.text("CLAUSULA PRIMEIRA - DO OBJETO E FINALIDADE", 14, 109);
      doc.setFont("helvetica", "normal");
      const cl1 = `O presente documento constitui uma minuta tecnica preliminar para formalizacao do acordo de ${contractType}, a ser executado cumprindo as normas comuns de habitacao e de cooperacao reciproca de Mocambique.`;
      const cl1Lines = doc.splitTextToSize(cl1, 180);
      doc.text(cl1Lines, 14, 114);

      // Clause 2
      let currentY = 117 + (cl1Lines.length * 4.5);
      doc.setFont("helvetica", "bold");
      doc.text("CLAUSULA SEGUNDA - COMPROMISSO MONETARIO", 14, currentY);
      currentY += 5;
      doc.setFont("helvetica", "normal");
      const cl2 = `Para consolidacao dos deveres e aquisicao do objeto, e fixado o montante liquido de ${formattedValue} MZN (Meticais), o qual sera pago nas formas e parcelas acordadas oralmente ou documentadas em anexo.`;
      const cl2Lines = doc.splitTextToSize(cl2, 180);
      doc.text(cl2Lines, 14, currentY);

      // Clause 3
      currentY += (cl2Lines.length * 4.5) + 4;
      doc.setFont("helvetica", "bold");
      doc.text("CLAUSULA TERCEIRA - ESPECIFICACOES E TERMOS DETALHADOS", 14, currentY);
      currentY += 5;
      doc.setFont("helvetica", "normal");
      const cl3 = contractDetails || "As especificacoes de infraestrutura, prazos, faturas, obrigacoes de entrega, e garantias tecnicas de materiais serao delimitadas e incorporadas conforme manifestacao de ambas as partes interessadas.";
      const cl3Lines = doc.splitTextToSize(cl3, 180);
      doc.text(cl3Lines, 14, currentY);

      // Clause 4
      currentY += (cl3Lines.length * 4.5) + 4;
      doc.setFont("helvetica", "bold");
      doc.text("CLAUSULA QUARTA - JURISDICAO E LEGISLACAO APLICAVEL", 14, currentY);
      currentY += 5;
      doc.setFont("helvetica", "normal");
      const cl4 = "O presente instrumento e regido com base nos termos previstos pelo Codigo Civil de Mocambique e a Lei do Trabalho em vigor, elegendo o Tribunal Judicial da Cidade de Maputo como foro exclusivo de resolucao de litigios de boa-fe.";
      const cl4Lines = doc.splitTextToSize(cl4, 180);
      doc.text(cl4Lines, 14, currentY);

      // Signatures
      currentY += (cl4Lines.length * 4.5) + 18;
      if (currentY > 245) {
        doc.addPage();
        currentY = 30;
      }

      doc.setDrawColor(200, 200, 200);
      doc.line(20, currentY, 90, currentY);
      doc.line(120, currentY, 190, currentY);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.5);
      doc.text("PRIMEIRO OUTORGANTE", 35, currentY + 5);
      doc.text("SEGUNDO OUTORGANTE", 135, currentY + 5);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.text("Netek Services / Titular Jonson JB7", 28, currentY + 9);
      doc.text(`${contractClient || "Joao Manuel Macuacua"}`, 128, currentY + 9);

      // Footer note
      doc.setTextColor(150, 150, 150);
      doc.setFontSize(7.5);
      doc.text("Minuta autogerada de assistencia gratuita - Licenca de Transicao Netek Services Mocambique", 14, 285);

      doc.save(`Netek_Minuta_Contrato_${(contractType || "Acordo").replace(/\s+/g, "_")}.pdf`);
    } catch (e) {
      console.error("Erro ao gerar PDF:", e);
    }
  };

  const handlePreSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const dataPayload = {
      fullName: preName,
      phone: prePhone,
      documentType: preDocType,
      details: preDetails,
      createdAt: Date.now(),
      userId: auth.currentUser?.uid || "anonimo",
    };

    try {
      // 1. Save to firestore collection 'pedidos_pre_marcacao'
      await addDoc(collection(db, "pedidos_pre_marcacao"), dataPayload);

      // 2. Draft message & redirect to WhatsApp Jonson JB
      const msg = `Olá Diretor Jonson JB! Solicito auxílio técnico na pré-marcação / pré-registo de documentos em Moçambique:\n\n*Nome:* ${preName}\n*Contacto (WhatsApp):* ${prePhone}\n*Documento Pretendido:* ${preDocType}\n*Especificações / Detalhes:* ${preDetails}\n\nPor favor, confirmem as taxas de assessoria e prazos. Obrigado!`;
      window.open(`https://wa.me/258835109190?text=${encodeURIComponent(msg)}`, "_blank");

      // Auto clear
      setPreName("");
      setPrePhone("");
      setPreDetails("");
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, "pedidos_pre_marcacao");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="glass-card rounded-2xl p-6 md:p-8" id="digservice-module">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-[#ff6600]/15 p-2.5 rounded-xl">
          <FileText className="h-6 w-6 text-[#ff6600]" />
        </div>
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-[#2c3e50] tracking-tight">
            Netek Serviços Digitais
          </h2>
          <p className="text-sm text-gray-500">
            Crie Currículos, Cartas de Apresentação e Contratos prontos de forma instantânea e profissional
          </p>
        </div>
      </div>

      {/* Sub-Tabs Control */}
      <div className="flex flex-wrap border-b border-gray-100 mb-6 gap-2" id="docs-tab-list">
        <button
          onClick={() => setActiveSubTab("catalogo")}
          className={`pb-3 px-4 font-semibold text-sm transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
            activeSubTab === "catalogo"
              ? "border-[#ff6600] text-[#ff6600]"
              : "border-transparent text-gray-400 hover:text-gray-600"
          }`}
          id="tab-catalogo"
        >
          <Calculator className="h-4 w-4" /> Catálogo & Calculadora (30 Serviços)
        </button>
        <button
          onClick={() => setActiveSubTab("cv")}
          className={`pb-3 px-4 font-semibold text-sm transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
            activeSubTab === "cv"
              ? "border-[#ff6600] text-[#ff6600]"
              : "border-transparent text-gray-400 hover:text-gray-600"
          }`}
          id="tab-cv"
        >
          <User className="h-4 w-4" /> Currículo Profissional
        </button>
        <button
          onClick={() => setActiveSubTab("carta")}
          className={`pb-3 px-4 font-semibold text-sm transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
            activeSubTab === "carta"
              ? "border-[#ff6600] text-[#ff6600]"
              : "border-transparent text-gray-400 hover:text-gray-600"
          }`}
          id="tab-carta"
        >
          <FileText className="h-4 w-4" /> Cartas Formais
        </button>
        <button
          onClick={() => setActiveSubTab("contrato")}
          className={`pb-3 px-4 font-semibold text-sm transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
            activeSubTab === "contrato"
              ? "border-[#ff6600] text-[#ff6600]"
              : "border-transparent text-gray-400 hover:text-gray-600"
          }`}
          id="tab-contrato"
        >
          <FileSignature className="h-4 w-4" /> Contratos Legais
        </button>
        <button
          onClick={() => setActiveSubTab("pre-marcacao")}
          className={`pb-3 px-4 font-semibold text-sm transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
            activeSubTab === "pre-marcacao"
              ? "border-[#ff6600] text-[#ff6600]"
              : "border-transparent text-gray-400 hover:text-gray-600"
          }`}
          id="tab-pre-marcacao"
        >
          <Building2 className="h-4 w-4" /> Pré-Marcação Oficial 🇲🇿
        </button>
      </div>

      {/* Form Content Wrapper */}
      <div className="mt-4" id="digservice-forms">
        {activeSubTab === "cv" && (
          <form onSubmit={handleCvSubmit} className="space-y-4 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
                <input
                  type="text"
                  required
                  value={cvName}
                  onChange={(e) => setCvName(e.target.value)}
                  placeholder="Ex. António Bernardo"
                  className="w-full px-3.5 py-2 border border-gray-200 rounded-lg text-sm text-gray-800 focus:border-[#ff6600] outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Telemóvel / Celular</label>
                <input
                  type="text"
                  required
                  value={cvPhone}
                  onChange={(e) => setCvPhone(e.target.value)}
                  placeholder="Ex. +258 84 987 6543"
                  className="w-full px-3.5 py-2 border border-gray-200 rounded-lg text-sm text-gray-800 focus:border-[#ff6600] outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
                <input
                  type="email"
                  required
                  value={cvEmail}
                  onChange={(e) => setCvEmail(e.target.value)}
                  placeholder="antonio@exemplo.com"
                  className="w-full px-3.5 py-2 border border-gray-200 rounded-lg text-sm text-gray-800 focus:border-[#ff6600] outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                  <Briefcase className="h-3.5 w-3.5 text-gray-400" /> Profissão desejada
                </label>
                <input
                  type="text"
                  required
                  value={cvProfession}
                  onChange={(e) => setCvProfession(e.target.value)}
                  placeholder="Ex. Engenheiro Civil Júnior, Recepcionista"
                  className="w-full px-3.5 py-2 border border-gray-200 rounded-lg text-sm text-gray-800 focus:border-[#ff6600] outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                  Objectivo Profissional
                </label>
                <input
                  type="text"
                  value={cvObjective}
                  onChange={(e) => setCvObjective(e.target.value)}
                  placeholder="Integrar uma equipe dinâmica e expandir competências técnicas."
                  className="w-full px-3.5 py-2 border border-gray-200 rounded-lg text-sm text-gray-800 focus:border-[#ff6600] outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                  <Briefcase className="h-3.5 w-3.5 text-gray-400" /> Experiências Profissionais
                </label>
                <textarea
                  value={cvExperience}
                  onChange={(e) => setCvExperience(e.target.value)}
                  placeholder="Ex. 2 anos de Assistente na Empresa ABC (2024-2026)"
                  rows={3}
                  className="w-full p-3 border border-gray-200 rounded-lg text-sm text-gray-800 focus:border-[#ff6600] outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                  <GraduationCap className="h-3.5 w-3.5 text-gray-400" /> Formação Académica
                </label>
                <textarea
                  value={cvEducation}
                  onChange={(e) => setCvEducation(e.target.value)}
                  placeholder="Ex. Licenciado em Gestão - UEM (Concluído em 2023)"
                  rows={3}
                  className="w-full p-3 border border-gray-200 rounded-lg text-sm text-gray-800 focus:border-[#ff6600] outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                  <Wrench className="h-3.5 w-3.5 text-gray-400" /> Habilidades Técnicas
                </label>
                <textarea
                  value={cvSkills}
                  onChange={(e) => setCvSkills(e.target.value)}
                  placeholder="Ex. Excel Avançado, Gestão de Tempo, Inglês Fluente"
                  rows={3}
                  className="w-full p-3 border border-gray-200 rounded-lg text-sm text-gray-800 focus:border-[#ff6600] outline-none resize-none"
                />
              </div>
            </div>

            {/* Custom info text */}
            <div className="bg-orange-50 text-orange-950 p-4 rounded-xl border border-orange-100 flex items-start gap-2 text-xs leading-relaxed">
              <AlertCircle className="h-4 w-4 shrink-0 text-[#ff6600] mt-0.5" />
              <p>
                Os seus dados serão enviados nativamente para o nosso banco de dados. Ao submeter, será
                redirecionado automaticamente para o WhatsApp do diretor geral <strong> Jonson JB </strong> para o início
                da formatação profissional do ficheiro Word / PDF.
              </p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-[#ff6600] hover:bg-[#e05a00] text-white rounded-xl font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              id="cv-submit-btn"
            >
              <MessageSquare className="h-5 w-5" /> Enviar Dados para o WhatsApp do Diretor Jonson JB
            </button>
          </form>
        )}

        {activeSubTab === "carta" && (
          <form onSubmit={handleLetterSubmit} className="space-y-4 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Peticionário</label>
                <input
                  type="text"
                  required
                  value={letterName}
                  onChange={(e) => setLetterName(e.target.value)}
                  placeholder="Ex. Maria Santos"
                  className="w-full px-3.5 py-2 border border-gray-200 rounded-lg text-sm text-gray-800 focus:border-[#ff6600] outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contacto Telefónico</label>
                <input
                  type="text"
                  required
                  value={letterPhone}
                  onChange={(e) => setLetterPhone(e.target.value)}
                  placeholder="Ex. +258 82 111 2222"
                  className="w-full px-3.5 py-2 border border-gray-200 rounded-lg text-sm text-gray-800 focus:border-[#ff6600] outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Seu E-mail</label>
                <input
                  type="email"
                  required
                  value={letterEmail}
                  onChange={(e) => setLetterEmail(e.target.value)}
                  placeholder="email@exemplo.com"
                  className="w-full px-3.5 py-2 border border-gray-200 rounded-lg text-sm text-gray-800 focus:border-[#ff6600] outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Destinatário da Carta</label>
                <input
                  type="text"
                  required
                  value={letterRecipient}
                  onChange={(e) => setLetterRecipient(e.target.value)}
                  placeholder="Ex. Exmo. Senhor Diretor dos Recursos Humanos da CDM"
                  className="w-full px-3.5 py-2 border border-gray-200 rounded-lg text-sm text-gray-800 focus:border-[#ff6600] outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Assunto / Motivo</label>
                <input
                  type="text"
                  required
                  value={letterPurpose}
                  onChange={(e) => setLetterPurpose(e.target.value)}
                  placeholder="Ex. Candidatura de Emprego, Carta de Demissão, Reclamação"
                  className="w-full px-3.5 py-2 border border-gray-200 rounded-lg text-sm text-gray-800 focus:border-[#ff6600] outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rascunho ou Motivação do Conteúdo</label>
              <textarea
                required
                value={letterBody}
                onChange={(e) => setLetterBody(e.target.value)}
                placeholder="Introduza um resumo do conteúdo que necessita corporizar e polir na carta jurídica/formal..."
                rows={4}
                className="w-full p-3 border border-gray-200 rounded-lg text-sm text-gray-800 focus:border-[#ff6600] outline-none resize-none"
              />
            </div>

            {/* Custom info text */}
            <div className="bg-orange-50 text-orange-950 p-4 rounded-xl border border-orange-100 flex items-start gap-2 text-xs leading-relaxed">
              <AlertCircle className="h-4 w-4 shrink-0 text-[#ff6600] mt-0.5" />
              <p>
                Os seus dados serão salvos com segurança. Ao clicar abaixo, o Diretor Geral receberá os dados 
                para formatar a sua carta final em formato PDF/Word timbrado corporativamente.
              </p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-[#ff6600] hover:bg-[#e05a00] text-white rounded-xl font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              id="letter-submit-btn"
            >
              <MessageSquare className="h-5 w-5" /> Enviar Dados para o WhatsApp do Diretor Jonson JB
            </button>
          </form>
        )}

        {activeSubTab === "contrato" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in" id="contract-builder-grid">
            
            {/* Form Column */}
            <form onSubmit={handleContractSubmit} className="space-y-4">
              <div className="bg-orange-500/10 text-orange-600 dark:text-orange-400 p-3 rounded-2xl text-[11px] font-bold uppercase tracking-wider font-mono border border-orange-500/15">
                ✒️ Editor Oficial de Minutas Legais Netek
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Nome do Cliente Outorgante *</label>
                  <input
                    type="text"
                    required
                    value={contractClient}
                    onChange={(e) => setContractClient(e.target.value)}
                    placeholder="Ex. João Manuel Macuácua"
                    className="w-full px-3.5 py-2 border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-lg text-sm text-gray-800 dark:text-gray-100 focus:border-[#ff6600] outline-none transition-all shadow-2xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Nº do Bilhete de Identidade (BI) *</label>
                  <input
                    type="text"
                    required
                    value={contractIdNum}
                    onChange={(e) => setContractIdNum(e.target.value)}
                    placeholder="Ex. 110101987364Z"
                    className="w-full px-3.5 py-2 border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-lg text-sm text-gray-800 dark:text-gray-100 focus:border-[#ff6600] outline-none transition-all shadow-2xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Tipo de Contrato *</label>
                  <select
                    value={contractType}
                    onChange={(e) => setContractType(e.target.value)}
                    className="w-full px-3.5 py-2 border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-lg text-sm text-gray-800 dark:text-gray-100 focus:border-[#ff6600] outline-none transition-all shadow-2xs cursor-pointer"
                  >
                    <option value="Compromisso de Compra e Venda">Compromisso de Compra e Venda (Terreno/Casa)</option>
                    <option value="Prestação de Serviços">Prestação de Serviços de Obra</option>
                    <option value="Arrendamento Urbano">Arrendamento Residencial / Comercial</option>
                    <option value="Cessão de Direitos e DUAT">Cessão de Exploração e DUAT</option>
                    <option value="Contrato de Trabalho">Contrato de Trabalho Individual</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Valor do Acordo Económico (MZN) *</label>
                  <input
                    type="number"
                    required
                    value={contractValue}
                    onChange={(e) => setContractValue(e.target.value)}
                    placeholder="Ex. 180000"
                    className="w-full px-3.5 py-2 border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-lg text-sm text-gray-800 dark:text-gray-100 focus:border-[#ff6600] outline-none transition-all shadow-2xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Cláusulas Importantes / Detalhes de Acordo *</label>
                <textarea
                  required
                  value={contractDetails}
                  onChange={(e) => setContractDetails(e.target.value)}
                  placeholder="Exemplo de cláusulas acordadas: Data de entrega do terreno, prazos de pagamento, penalidades por quebra de compromisso..."
                  rows={4}
                  className="w-full p-3 border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-lg text-sm text-gray-800 dark:text-gray-100 focus:border-[#ff6600] outline-none resize-none transition-all shadow-2xs"
                />
              </div>

              {/* Custom info text */}
              <div className="bg-orange-50 dark:bg-[#1e140d] text-orange-950 dark:text-orange-200 p-4 rounded-xl border border-orange-100 dark:border-orange-900/40 flex items-start gap-2 text-xs leading-relaxed">
                <AlertCircle className="h-4 w-4 shrink-0 text-[#ff6600] mt-0.5" />
                <p>
                  Os detalhes contratuais serão cadastrados no Firestore particular da Netek. A minuta primária é gerada com base nos princípios legais de boa-fé contemplados no Código Civil de Moçambique.
                </p>
              </div>

              {/* TWO SATELLITE ACTION BUTTONS: Download and WhatsApp */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleDownloadContractPDF}
                  className="py-3 px-4 bg-[#2c3e50] hover:bg-[#1e2b38] dark:bg-slate-800 dark:hover:bg-slate-750 text-white rounded-xl font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer border border-[#34495e]"
                >
                  <FileDown className="h-5 w-5 text-orange-400" /> Exportar para PDF 📥
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="py-3 px-4 bg-[#ff6600] hover:bg-[#e05a00] text-white rounded-xl font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  id="contract-submit-btn"
                >
                  <MessageSquare className="h-5 w-5" /> Submeter &amp; WhatsApp 📱
                </button>
              </div>
            </form>

            {/* Live Preview Column */}
            <div className="space-y-3 flex flex-col h-full justify-between" id="contract-live-preview-box">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-gray-400 font-extrabold uppercase tracking-widest block">
                  📄 PRÉ-REVISÃO DA MINUTA (DOCUMENTO COM MEDIDAS DE FORMATO)
                </span>
                <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Live Sync
                </span>
              </div>

              {/* Physical Document Mockup sheet */}
              <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 text-xs leading-relaxed text-gray-800 dark:text-gray-300 shadow-inner h-[400px] overflow-y-auto font-serif relative">
                
                {/* Simulated Document Seal Ribbon */}
                <div className="absolute top-0 right-8 w-12 h-14 bg-red-600 opacity-80 rounded-b-md shadow-xs flex items-center justify-center text-white text-[8px] font-sans font-extrabold uppercase tracking-wider text-center pt-2">
                  Netek<br/>Seal
                </div>

                {/* Document Letterhead header */}
                <div className="text-center space-y-1 mb-6 border-b border-gray-150 pb-4 dark:border-slate-800">
                  <h4 className="font-extrabold text-[#2c3e50] dark:text-white uppercase tracking-wider text-[11px] font-sans">
                    REPÚBLICA DE MOÇAMBIQUE
                  </h4>
                  <p className="text-[10px] text-gray-400 uppercase font-sans tracking-widest font-black text-xs">
                    NETEK SERVICES ACORDO LEGAL
                  </p>
                  <p className="text-[9px] text-gray-500 font-sans italic">
                    Maputo, Central • Assessoria Processual e Laboral
                  </p>
                </div>

                {/* Minuta Body content */}
                <div className="space-y-4">
                  <p className="text-center font-extrabold text-[#2c3e50] dark:text-white text-xs uppercase tracking-wide font-sans">
                    CONTRATO DE {contractType ? contractType.toUpperCase() : "PRESTAÇÃO DE SERVIÇOS"}
                  </p>

                  <div className="space-y-2">
                    <p>
                      <strong>PRIMEIRO OUTORGANTE:</strong> <code>NETEK SERVICES MOÇAMBIQUE</code> (Intermediação Regional com sede em Maputo), representado voluntariamente por <strong>PENIEL DINIS MUCAVELE (Jonson JB7)</strong>.
                    </p>
                    <p>
                      <strong>SEGUNDO OUTORGANTE:</strong> <strong>{contractClient || "(Preencha o Nome do Outorgante ao lado)"}</strong>, portador do Bilhete de Identidade (BI) Moçambicano nº <strong>{contractIdNum || "(Nº de BI em falta)"}</strong>.
                    </p>
                    <p className="italic">
                      Ambas as partes acordam e assinam reciprocamente em boa-fé as seguintes cláusulas:
                    </p>
                  </div>

                  <div className="space-y-3">
                    <p>
                      <strong>CLÁUSULA 1ª (OBJETO):</strong> O presente instrumento define e assegura o acordo legal direto de <code>{contractType || "Cessão de Vantagem Técnica"}</code> visando segurança habitacional ou prestação técnica.
                    </p>
                    <p>
                      <strong>CLÁUSULA 2ª (MONTANTE):</strong> O encargo acordado pelas partes corresponderá a <strong>{contractValue ? Number(contractValue).toLocaleString("pt-MZ") : "0"} MZN (Meticais)</strong>, líquidos de taxas alfandegárias de fiscalização no terreno.
                    </p>
                    <p className="whitespace-pre-wrap">
                      <strong>CLÁUSULA 3ª (TERMOS &amp; ESPECIFICIDADES):</strong><br />
                      {contractDetails ? contractDetails : "Aguardando cláusulas e pormenores especiais a serem delineados no editor ao lado..."}
                    </p>
                    <p>
                      <strong>CLÁUSULA 4ª (CONVENÇÃO DE FORO):</strong> Para a resolução de litígios resultantes do cumprimento deste instrumento, outorga-se o foro cível do Tribunal Judicial da Cidade de Maputo.
                    </p>
                  </div>

                  {/* Signatures placeholders inside mockup sheet */}
                  <div className="pt-8 grid grid-cols-2 gap-4 text-center text-[9px] font-sans">
                    <div>
                      <div className="border-b border-gray-300 dark:border-slate-700 mx-auto w-3/4 mb-1"></div>
                      <p className="font-extrabold text-gray-500">1º Outorgante (Netek)</p>
                    </div>
                    <div>
                      <div className="border-b border-gray-300 dark:border-slate-700 mx-auto w-3/4 mb-1"></div>
                      <p className="font-extrabold text-gray-500">2º Outorgante (Cliente)</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Informative advice */}
              <span className="text-[10px] text-gray-400 font-mono block text-center italic leading-relaxed">
                * Qualquer alteração no formulário atualizará o layout do documento físico eletronicamente na mesma hora.
              </span>
            </div>
          </div>
        )}

        {/* 5th Tab: Pré-Marcação e Agendamento de Documentos em Moçambique */}
        {activeSubTab === "pre-marcacao" && (
          <div className="space-y-6 animate-fade-in" id="pre-marcacao-tab">
            
            {/* Elegant Header with Moçambique Context */}
            <div className="bg-gradient-to-r from-blue-900 via-[#151f2b] to-emerald-900 text-white p-5 rounded-3xl shadow-sm border border-white/5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="bg-emerald-600 text-white text-[9px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider font-mono">
                  Portais Oficiais Moçambique 🇲🇿
                </span>
                <h3 className="font-extrabold text-base md:text-lg">Pré-Marcação &amp; Apoio Documental Técnico</h3>
                <p className="text-xs text-blue-200 max-w-xl font-light leading-relaxed">
                  Consulte os portais oficiais dos ministérios terrestres e rodoviários de Moçambique. Caso tenha dificuldades técnicas com lentidão do sistema ou queira poupar megas, nós efetuamos toda a marcação e emitimos o pdf comprovativo por si!
                </p>
              </div>
              <div className="bg-white/10 px-3.5 py-2 rounded-2xl flex items-center gap-2 border border-white/10 shrink-0 text-xs">
                <Globe className="text-emerald-400 h-5 w-5 shrink-0" />
                <span className="font-semibold font-sans">Moçambique Conectado</span>
              </div>
            </div>

            {/* Official Portals Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4" id="gov-portals-grid">
              {[
                {
                  title: "Bilhete de Identidade (DNIC)",
                  desc: "Direcção Nacional de Identificação Civil. Agendamento prévio eletrónico para emissão de primeira e segunda via do BI.",
                  url: "https://www.dnic.gov.mz/",
                  sector: "Identificação Civil",
                  phone: "800 111 222",
                },
                {
                  title: "Passaporte & DIRE (SENAMI)",
                  desc: "Serviço Nacional de Migração. Consulta de requisitos oficiais, emissão de vistos temporários e passaporte biométrico moçambicano.",
                  url: "https://www.senami.gov.mz/",
                  sector: "Migração e Estrangeiros",
                  phone: "84 312 0000",
                },
                {
                  title: "Exames & Cartas (INATRO)",
                  desc: "Instituto Nacional dos Transportes Terrestres. Inscrição para exames teóricos, reclamações de sinistros ou agendamento de licença de condução.",
                  url: "https://www.inatro.gov.mz/",
                  sector: "Transportes Terrestres",
                  phone: "82 500 5000",
                },
                {
                  title: "Reserva de Nome de Empresa (CREMAP)",
                  desc: "Conservatória de Registo de Entidades Legais de Moçambique. Pesquisa de designações ou firmas corporativas e reserva oficial.",
                  url: "https://www.cremap.gov.mz/",
                  sector: "Registo Comercial",
                  phone: "21 32 4440",
                },
                {
                  title: "Segurança Social SISSMO (INSS)",
                  desc: "Instituto Nacional de Segurança Social Moçambicano. Registo e consulta de contribuições para trabalhadores por conta própria ou outrem.",
                  url: "https://www.inss.gov.mz/",
                  sector: "Previdência Social",
                  phone: "800 144 144",
                },
                {
                  title: "Portal do Cidadão Geral",
                  desc: "Acesso unificado a informações públicas de Moçambique, formulários, taxas tributárias autárquicas e orientações gerais do Estado.",
                  url: "https://www.portaldocidadao.gov.mz/",
                  sector: "Serviço Público Geral",
                  phone: "Governo",
                }
              ].map((site, index) => (
                <div key={index} className="bg-white p-5 rounded-2xl border border-gray-150 shadow-3xs flex flex-col justify-between hover:shadow-xs transition-all gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-start gap-2">
                      <span className="bg-gray-100 text-gray-600 text-[10px] font-bold px-2 py-0.5 rounded font-mono">
                        {site.sector}
                      </span>
                      <span className="text-[10px] text-gray-400 font-semibold uppercase">oficial</span>
                    </div>
                    <h4 className="font-extrabold text-[#2c3e50] text-sm tracking-tight">{site.title}</h4>
                    <p className="text-xs text-gray-500 leading-relaxed font-light">{site.desc}</p>
                  </div>
                  <div className="pt-3 border-t border-gray-50 flex items-center justify-between gap-2">
                    <span className="text-[10px] text-[#ff6600] font-bold font-sans">Apoio Documental</span>
                    <a
                      href={site.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-800 font-bold transition-colors cursor-pointer"
                    >
                      Abrir Portal <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {/* Help Prompt & Assistive request Form */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Info text box (7 cols) */}
              <div className="lg:col-span-6 xl:col-span-7 bg-orange-50/65 rounded-3xl p-6 border border-orange-100/60 space-y-4">
                <div className="flex gap-3 items-start">
                  <div className="bg-[#ff6600]/15 p-2 rounded-xl text-[#ff6600] shrink-0">
                    <AlertCircle className="h-5 w-5" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-extrabold text-sm text-[#2c3e50] uppercase tracking-wider">
                      Solicitar Agendamento Assistido (Nós Tratamos Por Si)
                    </h4>
                    <p className="text-xs text-gray-600 leading-relaxed font-light">
                      O processo de pré-registo online de documentos em Moçambique pode ser demorado, confuso ou dar múltiplos erros de conexão devido ao congestionamento dos servidores governamentais.
                    </p>
                  </div>
                </div>

                <div className="space-y-3.5 pl-10 text-xs text-gray-600 leading-relaxed font-light">
                  <p>
                    <strong>Como funciona o nosso serviço de facilitação documental?</strong>
                  </p>
                  <ul className="list-disc pl-4 space-y-1.5 list-outside">
                    <li>Selecione o documento necessário no formulário lateral.</li>
                    <li>Indique o seu nome, contacto telefónico do WhatsApp e detalhes.</li>
                    <li>
                      A nossa equipe acessará os sistemas adequados para fazer múltiplos pré-registos e lhe enviará a guia/folha de marcação em PDF directa no seu telefone para sua total comodidade.
                    </li>
                    <li>
                      <strong>Sem taxas ocultas:</strong> O serviço e acompanhamento técnico por parte do portal é sob cotação solidária barata e sem compromisso.
                    </li>
                  </ul>
                  <p className="bg-white/70 p-3 rounded-xl border border-orange-100 font-medium text-orange-950 text-[11px] leading-snug">
                    📌 <em>"Nós seremos solicitados quando não consegue fazer o pré-registo ou pré-marcação sozinho nos portais públicos."</em> — Equipa Jonson JB
                  </p>
                </div>
              </div>

              {/* Assist Form (5 cols) */}
              <div className="lg:col-span-6 xl:col-span-5 bg-white rounded-3xl p-6 border border-gray-150 shadow-3xs">
                <h3 className="font-extrabold text-sm text-[#2c3e50] uppercase tracking-wider mb-4 flex items-center gap-2">
                  <FileText className="h-4.5 w-4.5 text-[#ff6600]" /> Solicitar Suporte Documental
                </h3>

                <form onSubmit={handlePreSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Seu Nome Completo</label>
                    <input
                      type="text"
                      required
                      value={preName}
                      onChange={(e) => setPreName(e.target.value)}
                      placeholder="Ex. Amélia Alberto Macuácua"
                      className="w-full px-3.5 py-2 border border-gray-205 rounded-xl text-xs text-gray-800 focus:border-[#ff6600] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Telemóvel / Celular (WhatsApp)</label>
                    <input
                      type="text"
                      required
                      value={prePhone}
                      onChange={(e) => setPrePhone(e.target.value)}
                      placeholder="Ex. +258 84 123 4567"
                      className="w-full px-3.5 py-2 border border-gray-205 rounded-xl text-xs text-gray-800 focus:border-[#ff6600] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Serviço Pretendido</label>
                    <select
                      value={preDocType}
                      onChange={(e) => setPreDocType(e.target.value)}
                      className="w-full px-3.5 py-2 border border-gray-205 bg-white rounded-xl text-xs text-gray-800 focus:border-[#ff6600] outline-none"
                    >
                      <option value="Agendamento BI (Identificação Civil)">Agendamento de BI (Identificação Civil)</option>
                      <option value="Passaporte de Viagem (SENAMI)">Passaporte de Viagem (SENAMI)</option>
                      <option value="DIRE de Residência (SENAMI)">DIRE de Residência (SENAMI)</option>
                      <option value="Marcação de Exame / Carta de Condução (INATRO)">Exame/Carta de Condução (INATRO)</option>
                      <option value="Reserva de Nome de Empresa (CREMAP)">Reserva de Nome de Empresa (CREMAP)</option>
                      <option value="Inscrição na Segurança Social (INSS SISSMO)">Inscrição de Trabalhador no INSS</option>
                      <option value="Tratamento Geral de DUAT / Alvará Municipal">DUAT / Licenciamento Comercial Geral</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Detalhes da Dificuldade ou Requisitos</label>
                    <textarea
                      required
                      value={preDetails}
                      onChange={(e) => setPreDetails(e.target.value)}
                      placeholder="Ex. Já tentei fazer a marcação do BI no portal da DNIC mas a página dá erro e não gera o código de confirmação. Preciso de agendamento em Maputo..."
                      rows={3}
                      className="w-full p-3 border border-gray-205 rounded-xl text-xs text-gray-800 focus:border-[#ff6600] outline-none resize-none font-sans"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 bg-[#ff6600] hover:bg-[#e05a00] text-white rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer shadow-orange-500/10 hover:shadow-lg"
                    id="pre-submit-btn"
                  >
                    {isSubmitting ? (
                      <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <MessageSquare className="h-4 w-4" /> Enviar Pedido por WhatsApp
                      </>
                    )}
                  </button>

                  <p className="text-[10px] text-gray-400 text-center font-light leading-snug font-sans">
                    O seu pedido de pré-registo assistido será gravado na base de dados Netek Moçambique com segurança e confidencialidade.
                  </p>
                </form>
              </div>

            </div>

          </div>
        )}

        {/* 4th Tab: Catálogo de 30 Serviços com Calculadora e Filtros */}
        {activeSubTab === "catalogo" && (
          <div className="space-y-6 animate-fade-in" id="catalogo-services-tab">
            
            {/* Introductory Promo Ribbon */}
            <div className="bg-gradient-to-r from-[#2c3e50] to-[#1a252f] text-white p-5 rounded-2xl shadow-sm border border-white/5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="bg-[#ff6600] text-white text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Novo Recurso Expandido
                </span>
                <h3 className="font-bold text-base md:text-lg">Catálogo Geral da Prestação de Serviços</h3>
                <p className="text-xs text-gray-300 max-w-xl font-light">
                  Selecione múltiplos serviços de construção, jurídicos ou de TI, determine as quantidades e use a nossa calculadora inteligente para obter uma estimativa de custos para Moçambique instantaneamente!
                </p>
              </div>
              <div className="flex items-center gap-2 bg-white/10 px-3.5 py-2 rounded-xl text-xs font-mono shrink-0">
                <Calculator className="text-[#ff6600] h-5 w-5 shrink-0" />
                <span>Base Recalculada em MT</span>
              </div>
            </div>

            {/* Filter Search Bar */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-white p-4 rounded-2xl border border-gray-100 shadow-3xs">
              <div className="md:col-span-4 relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Pesquisar serviço..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-250 rounded-xl text-xs text-gray-800 focus:bg-white focus:border-[#ff6600] outline-none transition-all"
                  id="srv-search-input"
                />
              </div>

              {/* Tag Categories Selector */}
              <div className="md:col-span-8 flex flex-wrap gap-1.5 justify-start md:justify-end">
                {[
                  { id: "tudo", label: "Todos os 30" },
                  { id: "construcao", label: "Construção & Obras" },
                  { id: "tecnologia", label: "Sistemas & TI" },
                  { id: "juridico", label: "Documentos Legal" },
                  { id: "design", label: "Design & Social" },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id as any)}
                    className={`px-3 py-1.5 rounded-xl text-[11px] font-semibold transition-all cursor-pointer ${
                      selectedCategory === cat.id
                        ? "bg-[#ff6600] text-white shadow-3xs"
                        : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* MAIN PORTFOLIO & CALCULATOR SPLIT GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: List of Services (8 cols) */}
              <div className="lg:col-span-7 xl:col-span-8 space-y-4">
                
                {/* Dynamically filter listed services */}
                {(() => {
                  const filtered = SERVICES_DATA.filter((s) => {
                    const matchesSearch =
                      s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      s.description.toLowerCase().includes(searchTerm.toLowerCase());
                    const matchesCategory = selectedCategory === "tudo" || s.category === selectedCategory;
                    return matchesSearch && matchesCategory;
                  });

                  if (filtered.length === 0) {
                    return (
                      <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 text-gray-400">
                        <Info className="h-10 w-10 mx-auto text-gray-300 mb-3" />
                        <p className="font-semibold text-sm">Nenhum serviço encontrado.</p>
                        <p className="text-xs text-gray-400 mt-1">Experimente limpar a sua pesquisa de filtro.</p>
                      </div>
                    );
                  }

                  return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {filtered.map((srv) => {
                        const inCartQty = cart[srv.id] || 0;
                        const cardIcon = (() => {
                          switch (srv.category) {
                            case "construcao":
                              return <Hammer className="h-4.5 w-4.5 text-orange-500" />;
                            case "tecnologia":
                              return <Cpu className="h-4.5 w-4.5 text-blue-500" />;
                            case "juridico":
                              return <FileSignature className="h-4.5 w-4.5 text-emerald-500" />;
                            case "design":
                              return <Palette className="h-4.5 w-4.5 text-purple-500" />;
                            default:
                              return <Wrench className="h-4.5 w-4.5 text-gray-500" />;
                          }
                        })();

                        return (
                          <div
                            key={srv.id}
                            className={`bg-white rounded-2xl p-4 border transition-all flex flex-col justify-between ${
                              inCartQty > 0
                                ? "border-[#ff6600] ring-1 ring-[#ff6600]/20 bg-orange-50/5"
                                : "border-gray-100 hover:border-gray-200 shadow-3xs hover:shadow-xs"
                            }`}
                          >
                            <div className="space-y-2">
                              {/* Category Header */}
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1.5">
                                  {cardIcon}
                                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                                    {srv.categoryLabel}
                                  </span>
                                </div>
                                <span className="text-[10px] bg-gray-50 text-gray-400 px-2 py-0.5 rounded-full font-mono">
                                  ⏱️ {srv.deliveryDays}
                                </span>
                              </div>

                              {/* Title */}
                              <h4 className="font-extrabold text-sm text-gray-800 tracking-tight leading-snug">
                                {srv.title}
                              </h4>

                              {/* Description */}
                              <p className="text-xs text-gray-500 leading-relaxed font-light">
                                {srv.description}
                              </p>
                            </div>

                            {/* Control Footer */}
                            <div className="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between gap-2">
                              <div className="space-y-0.5">
                                <p className="text-xs font-extrabold text-[#ff6600] tracking-wide">
                                  Preço Sob Consulta
                                </p>
                                <p className="text-[9px] text-gray-400 font-medium">
                                  {srv.priceNote} • {srv.unit}
                                </p>
                              </div>

                              {/* Quick add/remove button set */}
                              {inCartQty > 0 ? (
                                <div className="flex items-center gap-1.5 bg-orange-50 rounded-xl p-1 border border-orange-200">
                                  <button
                                    type="button"
                                    onClick={() => removeFromCart(srv.id)}
                                    className="p-1 rounded-lg hover:bg-white text-gray-600 cursor-pointer"
                                    title="Remover um"
                                  >
                                    <Minus className="h-3.5 w-3.5" />
                                  </button>
                                  <span className="text-xs font-extrabold text-[#ff6600] px-1 font-mono">
                                    {inCartQty}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => addToCart(srv.id)}
                                    className="p-1 rounded-lg hover:bg-white text-gray-600 cursor-pointer"
                                    title="Adicionar mais um"
                                  >
                                    <Plus className="h-3.5 w-3.5" />
                                  </button>
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => addToCart(srv.id)}
                                  className="py-1.5 px-3 bg-gray-50 hover:bg-[#ff6600] border border-gray-200 hover:border-[#ff6600] text-gray-700 hover:text-white rounded-xl text-2xs font-extrabold uppercase tracking-wider transition-all cursor-pointer"
                                >
                                  Adicionar
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}

              </div>

              {/* Right Column: Dynamic Price Calculator Panel (4 cols) */}
              <div className="lg:col-span-5 xl:col-span-4">
                <div className="bg-white rounded-3xl p-5 border border-gray-150 shadow-sm sticky top-20 space-y-4">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                    <h3 className="font-extrabold text-sm text-gray-800 uppercase tracking-wider flex items-center gap-2">
                      <Calculator className="h-4.5 w-4.5 text-[#ff6600]" /> Cotação Inteligente
                    </h3>
                    <span className="bg-[#ff6600]/10 text-[#ff6600] text-[10px] font-extrabold px-2.5 py-0.5 rounded-full font-mono">
                      {Object.keys(cart).length} serviços
                    </span>
                  </div>

                  {!hasItemsInCart ? (
                    <div className="py-10 text-center text-gray-400 space-y-2">
                      <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-300">
                        🛒
                      </div>
                      <p className="text-xs font-semibold">Calculadora Vazia</p>
                      <p className="text-[11px] text-gray-400 leading-normal max-w-[200px] mx-auto font-light">
                        Clique em múltiplos botões <strong>"Adicionar"</strong> nos cartões de serviços para simular o seu orçamento personalizado de imediato!
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleCustomQuoteSubmit} className="space-y-4 animate-fade-in">
                      
                      {/* Cart Item Row List */}
                      <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
                        {Object.entries(cart).map(([id, qty]) => {
                          const item = SERVICES_DATA.find((s) => s.id === id);
                          if (!item) return null;
                          const subtotal = item.basePrice * Number(qty);

                          return (
                            <div
                              key={id}
                              className="bg-gray-50 p-2.5 rounded-xl flex items-center justify-between text-xs border border-gray-100"
                            >
                              <div className="space-y-0.5 max-w-[65%]">
                                <h5 className="font-extrabold text-gray-800 truncate" title={item.title}>
                                  {item.title}
                                </h5>
                                <p className="text-[10px] text-gray-400 font-medium font-sans">
                                  {qty}x • {item.unit}
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="font-extrabold text-[#ff6600] text-2xs uppercase tracking-wider font-sans">
                                  Sob Consulta
                                </span>
                                <button
                                  type="button"
                                  onClick={() => clearFromCart(id)}
                                  className="text-gray-400 hover:text-red-500 p-1"
                                  title="Eliminar este do orçamento"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Client Quick Contact parameters - satisfies "adicione mais funcionalidades" */}
                      <div className="space-y-2 pt-3 border-t border-gray-100">
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[10px] font-bold text-gray-500 uppercase mb-0.5">Seu Nome</label>
                            <input
                              type="text"
                              required
                              value={clientName}
                              onChange={(e) => setClientName(e.target.value)}
                              placeholder="Seu Nome"
                              className="w-full px-2 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs outline-none focus:border-[#ff6600]"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-gray-500 uppercase mb-0.5">Telefone</label>
                            <input
                              type="text"
                              required
                              value={clientPhone}
                              onChange={(e) => setClientPhone(e.target.value)}
                              placeholder="Celular"
                              className="w-full px-2 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs outline-none focus:border-[#ff6600]"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-gray-500 uppercase mb-0.5">
                            Requisitos e Notas Adicionais da Obra ou Serviço
                          </label>
                          <textarea
                            value={customNotes}
                            onChange={(e) => setCustomNotes(e.target.value)}
                            placeholder="Ex. Preciso deste serviço em Maputo central, gostaria de incluir atendimento urgente..."
                            rows={2}
                            className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-xs resize-none outline-none focus:border-[#ff6600]"
                          />
                        </div>
                      </div>

                      {/* Cumulative Pricing Recap Board */}
                      <div className="bg-orange-50/50 border border-orange-100 p-3.5 rounded-2xl space-y-2">
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>Serviços Selecionados:</span>
                          <span className="font-bold text-gray-700">{Object.keys(cart).length} selecionado(s)</span>
                        </div>
                        <div className="flex justify-between text-xs text-gray-500 font-sans">
                          <span>Análise Documental:</span>
                          <span className="text-[#34a853] font-bold text-[10px] uppercase">Grátis</span>
                        </div>
                        <div className="flex justify-between items-center text-sm pt-2 border-t border-orange-200 font-bold text-gray-800">
                          <span>Recap Total Estimado:</span>
                          <span className="text-[#ff6600] text-xs font-black uppercase tracking-wider">
                            Sob Orçamento Técnico
                          </span>
                        </div>
                      </div>

                      {/* Submit Trigger - database persistent and pre-fills WhatsApp redirect */}
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-3 bg-[#ff6600] hover:bg-[#e05a00] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer shadow-orange-500/10 hover:shadow-lg"
                        id="calculate-submit-btn"
                      >
                        {isSubmitting ? (
                          <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <>
                            <Send className="h-4 w-4" /> Solicitar Orçamento Oficial no WhatsApp
                          </>
                        )}
                      </button>

                      <div className="text-[10px] text-gray-400 text-center font-light leading-snug">
                        Os dados do seu cálculo serão guardados com segurança na base de dados Netek Services em conformidade legal.
                      </div>
                    </form>
                  )}
                </div>
              </div>

            </div>

          </div>
        )}
      </div>
    </div>
  );
}
