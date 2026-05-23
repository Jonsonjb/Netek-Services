import { useState } from 'react';
import { 
  Newspaper, 
  Flame, 
  TrendingUp, 
  Globe, 
  Calendar, 
  ArrowUpRight, 
  ChevronDown, 
  ChevronUp, 
  ArrowRight,
  Zap,
  DollarSign,
  Building2,
  ExternalLink
} from 'lucide-react';
import { COURSES } from '../data';

interface SectorNewsProps {
  onExploreCourse: (courseId: string) => void;
  onNavigateToSection: (section: string) => void;
}

interface NewsItem {
  id: string;
  category: 'Gás & GNL' | 'Energias Renováveis' | 'Economia & Fundo Soberano';
  source: string;
  date: string;
  title: string;
  excerpt: string;
  fullBody: string[];
  icon: any;
  colorClass: string;
  relatedCourseId: string;
  courseHighlight: string;
}

export default function SectorNews({ onExploreCourse, onNavigateToSection }: SectorNewsProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const newsData: NewsItem[] = [
    {
      id: 'news-1',
      category: 'Gás & GNL',
      source: 'Consórcio Area 1 / Lusa / Diário Económico',
      date: '21 de Maio de 2026',
      title: 'Retoma Total Próxima: TotalEnergies e Governo de Moçambique alinham regresso das obras em Palma',
      excerpt: 'Após o levantamento formal das condições de força maior, o consórcio do megaprojeto Mozambique LNG (Área 1) entra na fase de mobilização do canteiro físico de construção.',
      fullBody: [
        'O megaprojeto Mozambique LNG liderado pela TotalEnergies, orçado em cerca de 20 mil milhões de dólares na Bacia do Rovuma, restabeleceu o cronograma de contratação. O levantamento oficial das condições de suspensão consolida o regresso de grandes fornecedores internacionais ao canteiro de Afungi em Cabo Delgado.',
        'Esta iniciativa representa um dos picos históricos de oferta de vagas técnicas no país. Os polos do IFPELAC em Pemba e Palma estão a preparar em massa jovens técnicos com foco em soldagem industrial, montagem de andaimes estruturais e auxiliares de campo para responder às subcontratadas (EPCs).',
        'Se deseja trabalhar na reconstrução física das facilidades onshore de Palma, o curso de Soldador de Estruturas Industriais do programa oferece a porta de entrada com homologação certificada.'
      ],
      icon: Flame,
      colorClass: 'text-rose-500 bg-rose-50 border-rose-100',
      relatedCourseId: 'soldador-est',
      courseHighlight: 'A soldagem qualificada é a competência mais requisitada no canteiro de Palma.'
    },
    {
      id: 'news-2',
      category: 'Gás & GNL',
      source: 'ExxonMobil / Diário Económico',
      date: '21 de Maio de 2026',
      title: 'Rovuma LNG: Decisão Final de Investimento (FID) na Área 4 prevista para o segundo semestre de 2026',
      excerpt: 'Megaprojeto de GNL liderado pela petrolífera norte-americana ExxonMobil e pela italiana Eni planeia avançar com módulos terrestres, gerando até 150 mil milhões de dólares ao Estado.',
      fullBody: [
        'O consórcio da Área 4 da Bacia do Rovuma anunciou que a Decisão Final de Investimento (FID) do megaprojeto Rovuma LNG terrestre está programada de forma sólida para a segunda metade deste ano. O design modular otimiza a construção e reduz pegadas ecológicas.',
        'Durante a sua fase áurea, o projeto planeia absorver milhares de ajudantes mecânicos, operadores, tubistas e técnicos de nível básico. A qualificação local contínua é vista pelo Ministério dos Recursos Minerais e Energia como primordial para cumprir as metas de Conteúdo Local.',
        'A capacitação do IFPELAC em mecânica preventiva de compressores, bombas e alinhamento resolve diretamente a lacuna de contratação local para este projeto.'
      ],
      icon: TrendingUp,
      colorClass: 'text-petro-green bg-green-50 border-green-100',
      relatedCourseId: 'mecanico-manut',
      courseHighlight: 'Técnicos mecânicos apoiarão as fases de montagem eletromecânica dos módulos de gás.'
    },
    {
      id: 'news-3',
      category: 'Gás & GNL',
      source: 'Eni S.p.A. / Oil & Gas National Reports',
      date: '18 de Maio de 2026',
      title: 'Bacia do Rovuma: Petrolífera Eni avalia avançar com terceira plataforma flutuante de Gás (FLNG)',
      excerpt: 'Considerando os resultados de produtividade em tempo recorde da Coral Sul FLNG, operadora estuda introduzir uma plataforma de produção adicional no mar de Cabo Delgado.',
      fullBody: [
        'A italiana Eni está a conduzir engenharia avançada de viabilidade para colocar uma nova plataforma flutuante (FLNG) em atividade offshore no norte de Moçambique. Isto aceleraria as exportações de gás natural sem a necessidade de construir grandes complexos terrestres complexos imediatos.',
        'Este complexo laboratório marinho opera em altíssima automação. Portanto, profissionais com proficiência sólida em calibração eletrónica de válvulas, comandos PID e instrumentação eletrónica industrial classificada estão no topo da exclusividade de rendimentos do setor.',
        'Com as certificações oficiais de Instrumentação Industrial e Auxiliar de Operações obtidas no programa, os estudantes ganham preferência regulamentada nas prestadoras de serviços do consórcio.'
      ],
      icon: Globe,
      colorClass: 'text-indigo-600 bg-indigo-50 border-indigo-100',
      relatedCourseId: 'instrumentista-ind',
      courseHighlight: 'A automação cirúrgica em plataformas marinhas tem falta crônica de instrumentistas.'
    },
    {
      id: 'news-4',
      category: 'Economia & Fundo Soberano',
      source: 'Ministério da Economia e Finanças de Moçambique',
      date: '19 de Maio de 2026',
      title: 'Fundo Soberano projeta arrecadação de mais de 30 milhões de dólares das receitas de gás sob forte regulação',
      excerpt: 'Instrumento soberano de estabilização macroeconómica acumula recursos fiscais da Área 4 e projeta auditorias de alto nível com processos digitais transparentes.',
      fullBody: [
        'O Fundo Soberano de Moçambique, estruturado em parceria com o Banco de Moçambique, receberá este ano mais de 30 milhões de dólares diretos de taxas e royalties do mar do Rovuma. A iniciativa blinda as finanças do país de crises externas e garante reservas líquidas para as futuras gerações.',
        'A gestão transparente dos contratos das concessões impulsiona severamente a introdução de infraestrutura tecnológica moderna no funcionalismo público e corporações. Há uma procura urgente por profissionais fluentes em análises quantitativas, gestão estatística e governança de dados.',
        'Nosso eixo de Tecnologia prepara jovens de baixa renda para atuar como Analistas de Dados de BI utilizando o software avançado Microsoft PowerBI, Python e consultas estruturadas SQL.'
      ],
      icon: DollarSign,
      colorClass: 'text-amber-600 bg-amber-50 border-amber-100',
      relatedCourseId: 'analista-dados',
      courseHighlight: 'Novas economias exigem monitoramento transparente baseado em dados analíticos.'
    },
    {
      id: 'news-5',
      category: 'Energias Renováveis',
      source: 'RENMOZ Moçambique-UE Fórum Oficial',
      date: '21 de Maio de 2026',
      title: 'Maputo prepara-se para acolher conferência RENMOZ 2026 sobre energias renováveis e eletrificação rural',
      excerpt: 'Principal fórum de energia comunitária solar debaterá investimentos de grande porte para expandir as redes de distribuição elétrica descentralizada fotovoltaicas.',
      fullBody: [
        'Com o apoio internacional da União Europeia, a Associação Moçambicana de Energias Renováveis (AMER) organiza o evento RENMOZ 2026 em Maputo. O foco estratégico está no desenvolvimento de microgeradoras solares nas províncias da Zambézia, Niassa e Inhambane.',
        'A manutenção destas centrais de pequena escala descentralizadas em distritos distantes exige o destacamento de centenas de eletricistas de baixa-tensão capazes de realizar comandos elétricos, leituras de painéis e manutenção local sem depender de engenheiros da capital.',
        'Tendo as competências em comandos elétricos adquiridas na trilha de Eletricista de Manutenção do IFPELAC, o graduando estará apto a supervisionar instalações solares rurais.'
      ],
      icon: Zap,
      colorClass: 'text-yellow-500 bg-yellow-50 border-yellow-100',
      relatedCourseId: 'eletricista-ind',
      courseHighlight: 'A transição energética necessita de instaladores elétricos em todas as aldeias e vilas.'
    }
  ];

  const categories = ['Todos', 'Gás & GNL', 'Energias Renováveis', 'Economia & Fundo Soberano'];

  const filteredNews = selectedCategory === 'Todos' 
    ? newsData 
    : newsData.filter(item => item.category === selectedCategory);

  const toggleExpand = (id: string) => {
    if (expandedId === id) {
      setExpandedId(null);
    } else {
      setExpandedId(id);
    }
  };

  const getCourseTitle = (courseId: string) => {
    return COURSES.find(c => c.id === courseId)?.title || 'Curso de Especialidade';
  };

  return (
    <section id="noticias-setor" className="bg-slate-100 py-16 border-t border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-10">
        
        {/* Header section with styling matches */}
        <div className="text-center md:text-left space-y-2 max-w-3xl">
          <span className="text-xs font-bold uppercase tracking-widest bg-petro-green/10 text-petro-green px-3 py-1 rounded-full inline-block">
            Mapeamento de Oportunidades
          </span>
          <h2 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">
            Notícias do Setor: Energia & GNL em Moçambique
          </h2>
          <p className="text-xs md:text-sm text-slate-600 leading-relaxed font-normal">
            Acompanhe a evolução real dos megaprojetos na Bacia do Rovuma, transição ecológica e os rumos econômicos do país. Conectamos as manchetes às especializações disponibilizadas gratuitamente.
          </p>
        </div>

        {/* Category Filters Dashboard tabs layout */}
        <div className="flex flex-wrap gap-1.5 pb-2 border-b border-slate-200">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setExpandedId(null);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-petro-blue text-white shadow-sm'
                  : 'bg-white hover:bg-slate-50 text-slate-600 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* News Feed Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {filteredNews.map((item) => {
            const IconComponent = item.icon;
            const isExpanded = expandedId === item.id;
            
            return (
              <div 
                key={item.id}
                id={item.id}
                className="bg-white border border-slate-200 rounded-3xl p-6 transition-all duration-300 hover:shadow-md flex flex-col justify-between"
              >
                <div className="space-y-4">
                  
                  {/* Top attributes */}
                  <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] font-bold text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <span className={`px-2 py-0.5 rounded-full border text-[9px] ${item.colorClass}`}>
                        {item.category}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {item.date}
                      </span>
                    </div>
                    <span className="text-slate-500">{item.source}</span>
                  </div>

                  {/* Main Header title */}
                  <h3 className="font-extrabold text-slate-800 text-sm md:text-base leading-snug hover:text-petro-blue transition-colors">
                    {item.title}
                  </h3>

                  {/* Short excerpt summary */}
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    {item.excerpt}
                  </p>

                  {/* Rich details collapsible */}
                  {isExpanded && (
                    <div className="pt-4 border-t border-slate-100 space-y-4 animate-fade-in">
                      {item.fullBody.map((paragraph, index) => (
                        <p key={index} className="text-xs text-slate-600 leading-relaxed font-normal">
                          {paragraph}
                        </p>
                      ))}

                      {/* Training Alignment Mini-Card */}
                      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3.5">
                        <div className="flex items-start gap-2.5">
                          <div className="p-1 px-2 border border-petro-green/10 bg-petro-green/10 text-petro-green rounded-lg text-xs font-black uppercase">
                            Qualificação Direta
                          </div>
                          <div className="space-y-0.5">
                            <h4 className="text-xs font-extrabold text-slate-800">
                              {getCourseTitle(item.relatedCourseId)}
                            </h4>
                            <p className="text-[10px] text-slate-400 italic">
                              💡 {item.courseHighlight}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-slate-200">
                          <span className="text-[10px] text-slate-500 font-medium">
                            Status: <strong className="text-petro-green">Isento de Custos / Bolsa de Apoio Incluída</strong>
                          </span>
                          <button
                            onClick={() => onExploreCourse(item.relatedCourseId)}
                            className="bg-petro-green hover:opacity-90 text-white font-bold text-[10px] px-3.5 py-1.5 rounded-lg flex items-center gap-1 transition-all pointer-events-auto cursor-pointer"
                          >
                            Ver detalhes do curso
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                    </div>
                  )}

                </div>

                {/* Card Action footer / toggle */}
                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => toggleExpand(item.id)}
                    className="text-petro-blue hover:text-petro-blue/80 font-bold text-xs flex items-center gap-1 cursor-pointer transition-all uppercase tracking-wide"
                  >
                    {isExpanded ? (
                      <>
                        Recolher Informações
                        <ChevronUp className="w-4 h-4" />
                      </>
                    ) : (
                      <>
                        Ler Análise e Cursos Vinculados
                        <ChevronDown className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <div className={`p-2 rounded-xl text-slate-500 ${item.colorClass.split(' ')[1]}`}>
                    <IconComponent className="w-4 h-4" />
                  </div>
                </div>

              </div>
            );
          })}
        </div>

        {/* Outer informative CTA */}
        <div className="bg-white border border-slate-200 p-6 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
              Encontrará vaga nestes polos?
            </h4>
            <p className="text-xs text-slate-500">
              Dispomos de centros móveis em Palma e institutos acreditados do IFPELAC em Cabo Delgado, Tete, Nampula, Sofala, Maxixe e Maputo.
            </p>
          </div>
          <button
            onClick={() => onNavigateToSection('centros')}
            className="bg-slate-800 hover:bg-slate-900 text-white font-bold px-5 py-2.5 rounded-xl text-[11px] transition-colors whitespace-nowrap cursor-pointer"
          >
            Explorar Redes de Centros Físicos
          </button>
        </div>

      </div>
    </section>
  );
}
