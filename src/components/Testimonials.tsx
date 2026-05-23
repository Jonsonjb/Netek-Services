import { motion } from 'motion/react';
import { useState } from 'react';
import { 
  Quote, 
  MapPin, 
  Briefcase, 
  GraduationCap, 
  Calendar, 
  Star, 
  CheckCircle, 
  ArrowUpRight,
  TrendingUp,
  Award,
  Share2,
  Loader2,
  Check
} from 'lucide-react';

interface Testimonial {
  id: string;
  name: string;
  age: number;
  gender: 'F' | 'M';
  location: string;
  course: string;
  currentJob: string;
  company: string;
  joinedYear: string;
  story: string;
  quote: string;
  genderBadge: string;
  gridClass: string;
  accentColor: string;
  avatarBg: string;
}

export default function Testimonials() {
  const [sharingId, setSharingId] = useState<string | null>(null);

  const handleShareTestimonial = async (student: Testimonial) => {
    if (sharingId) return;
    setSharingId(student.id);
    
    // Smooth transition simulation
    await new Promise((resolve) => setTimeout(resolve, 850));

    try {
      const canvas = document.createElement('canvas');
      canvas.width = 1200;
      canvas.height = 630;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Could not create canvas context');

      // Gradient background matching gender / theme colors
      const gradient = ctx.createLinearGradient(0, 0, 1200, 630);
      if (student.gender === 'F') {
        gradient.addColorStop(0, '#022c22'); // Emerald
        gradient.addColorStop(1, '#064e3b');
      } else {
        gradient.addColorStop(0, '#0f172a'); // Slate
        gradient.addColorStop(1, '#1e293b');
      }
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 1200, 630);

      // Delicate grid pattern
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
      ctx.lineWidth = 1;
      for (let i = 0; i < 1200; i += 60) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, 630);
        ctx.stroke();
      }
      for (let j = 0; j < 630; j += 60) {
        ctx.beginPath();
        ctx.moveTo(0, j);
        ctx.lineTo(1200, j);
        ctx.stroke();
      }

      // Draw brand title
      ctx.fillStyle = '#fcd34d'; // Amber
      ctx.font = 'bold 12px Helvetica';
      ctx.fillText('PROGRAMA AUTONOMIA E RENDA MOÇAMBIQUE', 80, 70);

      ctx.fillStyle = '#10b981'; // Green
      ctx.font = 'bold 11px Helvetica';
      ctx.fillText('CONVÊNIO TÉCNICO REGULAR COM O IFPELAC', 80, 92);

      // Large stylized watermark quote icon in the background
      ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.font = 'italic 180px Helvetica';
      ctx.fillText('“', 60, 240);

      // Simple Canvas text wrap function
      const wrapText = (context: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) => {
        const words = text.split(' ');
        let line = '';
        let currentY = y;
        for (let n = 0; n < words.length; n++) {
          const testLine = line + words[n] + ' ';
          const metrics = context.measureText(testLine);
          const testWidth = metrics.width;
          if (testWidth > maxWidth && n > 0) {
            context.fillText(line, x, currentY);
            line = words[n] + ' ';
            currentY += lineHeight;
          } else {
            line = testLine;
          }
        }
        context.fillText(line, x, currentY);
        return currentY + lineHeight;
      };

      // Apply dynamic quote
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 22px Helvetica';
      let currentY = wrapText(ctx, `"${student.quote}"`, 80, 160, 1040, 34);

      // Draw main story narrative
      ctx.fillStyle = '#cbd5e1';
      ctx.font = 'normal 15px Helvetica';
      currentY = wrapText(ctx, student.story, 80, currentY + 16, 1040, 24);

      // Bottom Meta container
      ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
      ctx.fillRect(80, 475, 1040, 105);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = 1;
      ctx.strokeRect(80, 475, 1040, 105);

      // Formando initials inside custom badge
      const initials = student.name.split(' ').map(n => n[0]).join('');
      const avatarColors: { [key: string]: string } = {
        'test-1': '#059669',
        'test-2': '#2563eb',
        'test-3': '#4f46e5',
        'test-4': '#d97706',
        'test-5': '#e11d48'
      };
      const avatarBgColor = avatarColors[student.id] || '#059669';

      ctx.fillStyle = avatarBgColor;
      ctx.beginPath();
      ctx.arc(140, 528, 28, 0, 2 * Math.PI);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 18px Helvetica';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(initials, 140, 528);

      // Print metadata
      ctx.textAlign = 'left';
      ctx.textBaseline = 'alphabetic';
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 16px Helvetica';
      ctx.fillText(`${student.name}, ${student.age} anos`, 190, 515);

      ctx.fillStyle = '#34d399';
      ctx.font = 'bold 12px Helvetica';
      ctx.fillText(`${student.currentJob} em ${student.company}`, 190, 535);

      ctx.fillStyle = '#94a3b8';
      ctx.font = 'normal 11px Helvetica';
      ctx.fillText(`${student.location} • ${student.joinedYear}`, 190, 553);

      // Brand check stamp element
      ctx.fillStyle = '#10b981';
      ctx.beginPath();
      ctx.arc(1040, 528, 18, 0, 2 * Math.PI);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 14px Helvetica';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('✓', 1040, 528);

      // Signature seals
      ctx.textAlign = 'right';
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 11px Helvetica';
      ctx.fillText('Graduação Homologada', 1005, 524);

      ctx.fillStyle = '#cbd5e1';
      ctx.font = 'bold 9px Helvetica';
      ctx.fillText('FORMANDO DO IFPELAC', 1005, 540);

      // Trigger standard save file
      const dataUrl = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.download = `Sucesso_${student.name.replace(/\s+/g, '_')}_AutonomiaRenda.png`;
      downloadLink.href = dataUrl;
      downloadLink.click();
    } catch (error) {
      console.error('Cannot generate share story image card:', error);
    } finally {
      // Small Delay before removing status
      await new Promise((resolve) => setTimeout(resolve, 300));
      setSharingId(null);
    }
  };

  const testimonials: Testimonial[] = [
    {
      id: 'test-1',
      name: 'Adélia Covane',
      age: 24,
      gender: 'F',
      location: 'Maputo (Infulene)',
      course: 'Eletricista Industrial de Manutenção',
      currentJob: 'Técnica de Manutenção Elétrica Júnior',
      company: 'Mozal Alumínio',
      joinedYear: 'Graduada em Outubro de 2024',
      story: 'Sempre sonhei com a indústria química e metalúrgica, mas os custos de capacitação técnica eram proibitivos para a minha família de cinco pessoas. Através do polo central do IFPELAC, consegui uma vaga no regime de cota de gênero de 50%. Tive todo o material individual de EPI fornecido sem qualquer custo e a bolsa de apoio para transporte me sustentou.',
      quote: 'A gratuidade real me permitiu focar 100% nas aulas. Hoje tenho contrato permanente na Mozal e consigo apoiar a escola de meus irmãos.',
      genderBadge: 'Cota de Gênero • Mulheres na Indústria',
      gridClass: 'lg:col-span-2 row-span-2',
      accentColor: 'border-emerald-200 bg-gradient-to-br from-white to-emerald-50/20 text-emerald-700',
      avatarBg: 'bg-emerald-600 text-white'
    },
    {
      id: 'test-2',
      name: 'Isac Mavila',
      age: 21,
      gender: 'M',
      location: 'Palma (Cabo Delgado)',
      course: 'Soldador de Estruturas Industriais',
      currentJob: 'Soldador Nível III Certificado',
      company: 'Subcontratada de Engenharia (Área 1 LNG)',
      joinedYear: 'Graduado em Fevereiro de 2025',
      story: 'Fui qualificado na unidade móvel de Palma. Aprendi soldagem por arco revestido e processos MIG/MAG avançados sob condições climáticas simuladas e testes práticos rígidos avaliados pela ANEP.',
      quote: 'Logo após o exame final, fui entrevistado no polo por uma recrutadora do consórcio de gás. Comecei a trabalhar em março sem pagar um único cêntimo por intermediação.',
      genderBadge: 'Conteúdo Local • Província de Cabo Delgado',
      gridClass: 'lg:col-span-1',
      accentColor: 'border-blue-200 bg-gradient-to-br from-white to-blue-50/20 text-blue-700',
      avatarBg: 'bg-blue-600 text-white'
    },
    {
      id: 'test-3',
      name: 'Zélia Tembe',
      age: 23,
      gender: 'F',
      location: 'Cidade da Beira (Sofala)',
      course: 'Desenvolvedora Web Full Stack',
      currentJob: 'Desenvolvedora Júnior Remota',
      company: 'Digital Solutions Maputo',
      joinedYear: 'Graduada em Dezembro de 2024',
      story: 'Tinha apenas um telemóvel antigo e nenhum conhecimento de lógica de programação. O curso no hub tecnológico do programa em Sofala nos providenciou acesso a computadores modernos de alto desempenho e mentores experientes.',
      quote: 'Aprender Git, Express, React e bases de dados do zero mudou o meu destino de forma integral.',
      genderBadge: 'Nova Economia Digital',
      gridClass: 'lg:col-span-1',
      accentColor: 'border-indigo-200 bg-gradient-to-br from-white to-indigo-50/20 text-indigo-700',
      avatarBg: 'bg-indigo-600 text-white'
    },
    {
      id: 'test-4',
      name: 'Mateus Tembe',
      age: 26,
      gender: 'M',
      location: 'Pemba (Cabo Delgado)',
      course: 'Mecânico de Manutenção de Equipamentos',
      currentJob: 'Supervisor de Assistência Mecânica',
      company: 'Syrah Resources (Balama Mine)',
      joinedYear: 'Graduado em Julho de 2024',
      story: 'Após concluir o ensino secundário geral, estava desempregado há 3 anos. Fazer o curso técnico intensivo de mecânica com foco em bombas hidráulicas e compressores abriu portas para um setor que eu achava inalcançável sem conexões influentes.',
      quote: 'O que mais prezo no programa é a integridade. Todo o processo seletivo foi feito por mérito e as provas práticas determinaram a contratação rápida.',
      genderBadge: 'Certificação Industrial ANEP',
      gridClass: 'lg:col-span-1',
      accentColor: 'border-amber-200 bg-gradient-to-br from-white to-amber-50/20 text-amber-700',
      avatarBg: 'bg-amber-600 text-white'
    },
    {
      id: 'test-5',
      name: 'Filomena Langa',
      age: 27,
      gender: 'F',
      location: 'Nacala (Nampula)',
      course: 'Instrumentista Industrial de Precisão',
      currentJob: 'Técnica de Calibração e Sensores',
      company: 'Terminais de Combustível de Nacala',
      joinedYear: 'Graduada em Janeiro de 2025',
      story: 'O curso de Instrumentação Industrial de Precisão oferecido de graça pelo convênio com o IFPELAC nos ensinou calibração fina de sistemas eletrônicos SCADA. Estávamos sempre em contato com ferramentas profissionais do padrão de mercado.',
      quote: 'Vencer a barreira das oportunidades industriais como mulher é libertador. O suporte profissional e ético do portal foi decisivo.',
      genderBadge: 'Formação Tecnológica Prática',
      gridClass: 'lg:col-span-2 pb-6 md:pb-0',
      accentColor: 'border-rose-200 bg-gradient-to-br from-white to-rose-50/20 text-rose-700',
      avatarBg: 'bg-rose-600 text-white'
    }
  ];

  return (
    <section id="testemunhos" className="bg-slate-50 py-16 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-10">
        
        {/* Header Block aligned beautifully with other sections */}
        <div className="text-center md:text-left space-y-2 max-w-3xl">
          <span className="text-xs font-bold uppercase tracking-widest bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full inline-block">
            Histórias de Sucesso
          </span>
          <h2 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">
            Testemunhos de Alunos Graduados
          </h2>
          <p className="text-xs md:text-sm text-slate-600 leading-relaxed font-normal">
            Conheça moçambicanos que conquistaram a independência financeira através de nossa trilha de formação técnica corporativa 100% gratuita. Meritocracia, diversidade regional e empregabilidade real na prática.
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 auto-rows-[minmax(280px,_auto)]">
          {testimonials.map((student) => {
            return (
              <div
                key={student.id}
                id={student.id}
                className={`border rounded-3xl p-6 md:p-8 flex flex-col justify-between hover:shadow-lg transition-all duration-300 ${student.gridClass} ${student.accentColor}`}
              >
                <div className="space-y-4">
                  
                  {/* Top Quote Icon and Ribbon Badge */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-wider bg-white/80 backdrop-blur-xs shadow-xs px-3 py-1 rounded-full border border-slate-100 text-[10px]">
                      ✨ {student.genderBadge}
                    </span>
                    <Quote className="w-8 h-8 opacity-20 rotate-180" />
                  </div>

                  {/* Core Testimonial Quote */}
                  <blockquote className="text-sm md:text-base font-extrabold text-slate-800 leading-snug">
                    "{student.quote}"
                  </blockquote>

                  {/* Main Narrative Breakdown */}
                  <p className="text-xs text-slate-600 leading-relaxed font-normal pt-1">
                    {student.story}
                  </p>

                </div>

                {/* Bottom Student Metadata */}
                <div className="mt-6 pt-4 border-t border-slate-200/80 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Avatar Frame with Initials inside */}
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black ${student.avatarBg} text-sm tracking-normal shadow-sm shrink-0`}>
                      {student.name.split(' ').map(n => n[0]).join('')}
                    </div>

                    <div className="space-y-0.5 min-w-0">
                      <h4 className="text-xs font-extrabold text-slate-800 truncate">
                        {student.name}, <span className="text-slate-500 font-medium">{student.age} anos</span>
                      </h4>
                      
                      {/* Location Badge */}
                      <div className="flex items-center gap-1 text-[10px] text-slate-500 font-bold">
                        <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="truncate">{student.location}</span>
                      </div>

                      {/* Employment Tracker Details */}
                      <div className="flex items-center gap-1 text-[10px] text-emerald-700 font-extrabold pt-0.5">
                        <Briefcase className="w-3 h-3 shrink-0" />
                        <span className="truncate">{student.currentJob} em <strong className="underline decoration-wavy decoration-emerald-300">{student.company}</strong></span>
                      </div>

                      <div className="text-[9px] text-slate-400 font-medium">
                        {student.joinedYear}
                      </div>
                    </div>
                  </div>

                  {/* Share Story Card Action Button */}
                  <button
                    onClick={() => handleShareTestimonial(student)}
                    disabled={sharingId !== null}
                    title="Partilhar História de Sucesso (Gerar Imagem)"
                    className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 active:scale-95 flex items-center justify-center shrink-0 transition-all cursor-pointer border border-slate-200/60 shadow-xs hover:border-slate-300 relative group"
                  >
                    {sharingId === student.id ? (
                      <Loader2 className="w-4 h-4 text-emerald-600 animate-spin" />
                    ) : (
                      <>
                        <Share2 className="w-4 h-4 text-slate-600 group-hover:text-petro-green transition-colors" />
                        <span className="absolute -top-9 opacity-0 group-hover:opacity-100 scale-95 group-hover:scale-100 bg-slate-900 text-white font-extrabold text-[9px] px-2 py-1 rounded-md transition-all whitespace-nowrap shadow-md pointer-events-none">
                          Partilhar Sucesso
                        </span>
                      </>
                    )}
                  </button>
                </div>

              </div>
            );
          })}
        </div>

        {/* Dynamic call to action highlighting direct course link integration */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h4 className="text-xs font-extrabold text-petro-yellow uppercase tracking-wider flex items-center justify-center md:justify-start gap-1.5">
              <Award className="w-4 h-4 text-petro-yellow" />
              <span>O próximo caso de sucesso pode ser você!</span>
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              O preenchimento das vagas para as próximas turmas está aberto. Apenas as competências comprovadas determinam sua admissão. Comece agora.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <a
              href="#course-section"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('course-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="bg-petro-green hover:opacity-90 text-white font-extrabold px-5 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
            >
              Inscrever-se Grátis
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
