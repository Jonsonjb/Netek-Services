/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Course, ProvinceData, FAQItem } from './types';

export const COURSES: Course[] = [
  {
    id: 'eletricista-ind',
    title: 'Eletricista Industrial de Manutenção',
    slug: 'eletricista-industrial',
    category: 'Manutenção Industrial',
    duration: 320,
    description: 'Capacitação completa em instalações elétricas industriais, comandos elétricos de potência, segurança em eletricidade e manutenção preventiva/corretiva de subestações de baixa e média tensão.',
    targetAudience: [
      'Jovens em busca do primeiro emprego técnico',
      'Profissionais que desejam entrar na indústria manufatureira e petroquímica',
      'Pessoas de comunidades locais vizinhas às facilidades industriais'
    ],
    prerequisites: 'Idade mínima de 18 anos',
    educationRequired: '9ª Classe completa ou equivalente',
    modality: 'Presencial',
    marketDemand: 'Essencial para o setor fabril nacional, refinarias e centrais termelétricas como a de Temane (Inhambane), bem como polos portuários de Nacala e Beira.',
    syllabus: [
      'Fundamentos de Eletricidade e Metrologia Elétrica',
      'Leitura de Diagramas Elétricos e Padrões Industriais',
      'Comandos Elétricos e Chaves de Partida de Motores',
      'Segurança Ocupacional em Sistemas Elétricos (SST)',
      'Instalação de Dispositivos de Proteção e Sensores'
    ],
    provincesAvailable: ['Maputo Cidade', 'Maputo Província', 'Sofala', 'Nampula', 'Tete', 'Cabo Delgado']
  },
  {
    id: 'soldador-est',
    title: 'Soldador de Estruturas Industriais',
    slug: 'soldador-estruturas',
    category: 'Manutenção Industrial',
    duration: 280,
    description: 'Curso prático focado em técnicas de arco elétrico com elétrodo revestido e processos semi-automáticos MIG/MAG em juntas de topo e ângulo, posicionadas de forma plana, vertical e sobre-cabeça.',
    targetAudience: [
      'Indivíduos em situação de desemprego ou extrema vulnerabilidade',
      'Trabalhadores da construção civil que buscam especialização pesada'
    ],
    prerequisites: 'Idade mínima de 18 anos, boa saúde e acuidade visual',
    educationRequired: '9ª Classe completa ou equivalente',
    modality: 'Presencial',
    marketDemand: 'Altíssima procura na montagem pesada de tubulações estruturais e plataformas de escoamento de Gás Natural Liquefeito (GNL), especialmente nos megaprojetos liderados na Bacia do Rovuma em Cabo Delgado.',
    syllabus: [
      'Metalurgia Aplicada e Ensaios Não-Destrutivos Básicos',
      'Tecnologia de Equipamentos de Soldagem',
      'Prática de Soldagem com Elétrodos Celulósicos e Básicos',
      'Prevenção de Acidentes e Uso Seguro de Gases Comprimidos',
      'Processo de Goivagem e Preparação de Bisel'
    ],
    provincesAvailable: ['Cabo Delgado', 'Sofala', 'Maputo Província', 'Maputo Cidade']
  },
  {
    id: 'mecanico-manut',
    title: 'Mecânico de Manutenção de Máquinas Industriais',
    slug: 'mecanico-manutencao-industrial',
    category: 'Manutenção Industrial',
    duration: 360,
    description: 'Desenvolvimento de competências para diagnosticar defeitos, realizar alinhamento, balanceamento, montagem e desmontagem de bombas centrífugas, redutores, compressores e turbinas industriais.',
    targetAudience: [
      'Trabalhadores autônomos de oficinas',
      'Jovens que buscam sólida qualificação em mecânica mecânica pesada'
    ],
    prerequisites: 'Idade mínima de 18 anos',
    educationRequired: '9ª Classe completa',
    modality: 'Presencial',
    marketDemand: 'Os parques industriais de Beluluane (Matola/Maputo), as indústrias de cimento de Nacala e as grandes refinadoras de açúcar/grãos têm carência constante de mecânicos de precisão.',
    syllabus: [
      'Ajustagem Mecânica e Tolerâncias Geométricas',
      'Metrologia de Precisão (Micrómetros e Relógios Comparadores)',
      'Sistemas Hidráulicos e Pneumáticos de Controle de Fluidos',
      'Lubrificação de Elementos de Transmissão por Engrenagens',
      'Manutenção Preditiva com Análise de Vibração e Alinhamento a Laser'
    ],
    provincesAvailable: ['Maputo Província', 'Sofala', 'Tete', 'Cabo Delgado']
  },
  {
    id: 'aux-operacoes',
    title: 'Auxiliar de Operações em Processamento de Petróleo e Gás',
    slug: 'auxiliar-operacoes-petroleo-gas',
    category: 'Operações e Energia',
    duration: 240,
    description: 'Estudo das operações unitárias das refinarias e poços. Ensina o monitoramento de parâmetros físicos (temperatura, vazão, pressão) de tanquetes e as normas internacionais de segurança em indústrias petroquímicas.',
    targetAudience: [
      'Estudantes formados no ensino secundário que buscam oportunidades no mercado energético',
      'Mulheres em comunidades atingidas por grandes empreendimentos extrativos'
    ],
    prerequisites: 'Idade mínima de 18 anos',
    educationRequired: '12ª Classe completa ou equivalente (Ensino Secundário)',
    modality: 'Presencial',
    marketDemand: 'Preparação essencial de capital humano local para a futura operação onshore das centrais de beneficiamento e separação de gás natural de Palma (Cabo Delgado) e Temane (Inhambane).',
    syllabus: [
      'Mecânica dos Fluidos Aplicada a Vasos Industriais',
      'Termodinâmica Básica das Correntes de Vapor',
      'Monitorização e Controle de Plantas de Processo Químico',
      'Instalações Offshore e Sistemas de Alívio de Pressão (Flare)',
      'Sistema de Gestão de SMS (Segurança, Meio Ambiente e Saúde)'
    ],
    provincesAvailable: ['Cabo Delgado', 'Maputo Província', 'Inhambane']
  },
  {
    id: 'instrumentista-ind',
    title: 'Instrumentista Industrial',
    slug: 'instrumentista-industrial',
    category: 'Operações e Energia',
    duration: 340,
    description: 'Domínio das tecnologias de automação e controle industrial de malha fechada. Ensina a calibrar e manter transmissores eletrônicos de pressão de vazão, posicionadores de válvulas de segurança e sensores de nível.',
    targetAudience: [
      'Jovens com aptidão científica e lógica matemática',
      'Eletricistas que queiram transitar para área de automação inteligente'
    ],
    prerequisites: 'Idade mínima de 18 anos',
    educationRequired: '10ª Classe completa ou equivalente profissional',
    modality: 'Presencial',
    marketDemand: 'Uma das profissões mais bem remuneradas e requisitadas nos megaprojetos de gás do Rovuma, refinarias de óleos alimentares brutas e centrais elétricas do país.',
    syllabus: [
      'Metrologia Criteriosa de Calibração e Margens de Erro',
      'Controle Automático Proporcional Integral Derivativo (PID)',
      'Sensores Inteligentes e Sistemas de Válvulas Pneumáticas',
      'Fundamentos de Configuração de Protocolo HART e Fieldbus',
      'Segurança Intrínseca em Ambientes Classificados / Inflamáveis'
    ],
    provincesAvailable: ['Cabo Delgado', 'Maputo Província', 'Tete']
  },
  {
    id: 'desenvolvedor-fullstack',
    title: 'Desenvolvedor Web Full Stack Júnior',
    slug: 'desenvolvedor-full-stack',
    category: 'Tecnologia',
    duration: 480,
    description: 'Curso intensivo no novo Eixo de Tecnologia. Do letramento à programação de software empresarial. Capacita para desenvolver sistemas web dinâmicos e seguros utilizando React no frontend e Node.js com Express no backend, com conexão a banco de dados relacionais.',
    targetAudience: [
      'Jovens desempregados que buscam recolocação no dinâmico mercado de TI',
      'Mulheres chefes de família identificadas em programas assistenciais locais'
    ],
    prerequisites: 'Idade mínima de 18 anos e conhecimentos gerais de informática',
    educationRequired: '12ª Classe completa ou equivalente',
    modality: 'Semipresencial',
    marketDemand: 'Grande demanda nacional por profissionais qualificados em TI. Maputo abriga um polo crescente de bancos digitais, operadoras de telecomunicações (Tmcel, Vodacom, Movitel), agrotechs e fintechs.',
    syllabus: [
      'Lógica de Programação e Estruturas de Algoritmos com Javascript ES6',
      'Criação de Páginas Web Dinâmicas Responsivas com HTML5, CSS3, Flexbox',
      'Estilização Moderna Otimizada com Framework Tailwind CSS',
      'Desenvolvimento de Aplicações Monopágina (SPAs) Robustas com React',
      'Criação de APIs REST com Node.js, Express e Banco de Dados (PostgreSQL)'
    ],
    provincesAvailable: ['Maputo Cidade', 'Maputo Província', 'Sofala', 'Nampula']
  },
  {
    id: 'analista-dados',
    title: 'Analista de Dados Júnior e Business Intelligence',
    slug: 'analista-de-dados',
    category: 'Tecnologia',
    duration: 360,
    description: 'Estudo completo da manipulação, análise estatística e visualização em painéis decisórios inteligentes. Capacita a programar em Python com Pandas, extrair relatórios via instrução de consulta estruturada SQL e criar relatórios no PowerBI para indústrias e logística.',
    targetAudience: [
      'Jovens de minorias sociais com interesse em tecnologias corporativas',
      'Pessoas com facilidade analítica em planilhas ou cálculos'
    ],
    prerequisites: 'Idade mínima de 18 anos',
    educationRequired: '12ª Classe completa',
    modality: 'Semipresencial',
    marketDemand: 'Essencial para a digitalização de operações logísticas portuárias de Maputo e Nacala, monitoramento financeiro e auditoria de grandes empresas.',
    syllabus: [
      'Linguagem Python Aplicada a Ciências de Dados (Numpy e Pandas)',
      'Pesquisa e Consulta Estruturada de Banco de Dados com Linguagem SQL',
      'Modelagem Dimensional de Bancos e Construção de Relacionamentos',
      'Design e Criação de Visualizações Claras com PowerBI e Streamlit',
      'Estatística Descritiva Aplicada a Indicadores de KPIs'
    ],
    provincesAvailable: ['Maputo Cidade', 'Cabo Delgado', 'Tete']
  },
  {
    id: 'letramento-dig',
    title: 'Introdução às Novas Tecnologias e Letramento Digital',
    slug: 'letramento-digital-auxiliar',
    category: 'Tecnologia',
    duration: 200,
    description: 'Treinamento focado em democratização tecnológica. Desde o uso de sistemas operacionais, navegação profissional segura na internet, digitação veloz, processadores de texto estruturados, envio de correios eletrônicos, e ferramentas básicas de planilhas organizacionais.',
    targetAudience: [
      'Mulheres em comunidades vulneráveis nos arredores de fábricas',
      'Pessoas com baixos níveis de familiaridade com o computador'
    ],
    prerequisites: 'Idade mínima de 16 anos',
    educationRequired: '7ª Classe completa ou equivalente',
    modality: 'Presencial',
    marketDemand: 'Fundamental para a inclusão produtiva e trabalhos de secretariado, controle de estoque industrial básico, recepção e atividades administrativas organizadas em todo o território de Moçambique.',
    syllabus: [
      'Hardware das Unidades e Uso Eficiente do Sistema Operacional',
      'Prevenção de Golpes de Redes Sociais e Higiene Cibernética',
      'Utilização Elaborada de Editores de Texto para Documentações',
      'Criação de Orçamentos de Negócio com Planilhas Eletrônicas',
      'Comunicação de Equipes através de E-mails e Videochamadas'
    ],
    provincesAvailable: ['Maputo Cidade', 'Maputo Província', 'Sofala', 'Nampula', 'Cabo Delgado', 'Tete', 'Inhambane', 'Gaza', 'Zambézia', 'Manica', 'Niassa']
  },
  {
    id: 'caldeireiro-ind',
    title: 'Caldeireiro Industrial de Tubulação',
    slug: 'caldeireiro-industrial',
    category: 'Manutenção Industrial',
    duration: 300,
    description: 'Curso prático para formar mecânicos de chaparia. Envolve traçagem geométrica complexa, corte térmico de chapas e tubos pelo processo oxiacetilênico, ponteamento a arco e montagem final de sistemas estruturais.',
    targetAudience: [
      'Jovens que buscam profissões de alto vigor operacional e técnica manual',
      'Moradores locais de áreas de transição portuária'
    ],
    prerequisites: 'Idade mínima de 18 anos, resistência para atividades de campo',
    educationRequired: '9ª Classe completa ou equivalente',
    modality: 'Presencial',
    marketDemand: 'Vital para a reparação metálica de cargueiros navais na Beira, manutenção em turbinas de geração em Tete, e manutenção no terminal de gás de Cabo Delgado.',
    syllabus: [
      'Isometria Avançada e Leitura de Desenho Técnico Industrial',
      'Traçagem Básica e Avançada de Cônicos, Cilindros e Curvas',
      'Processo de Corte com Plasma de Alta Temperatura e Oxiacetileno',
      'Soldagem com Eletrodo Revestido para Posicionamento de Fixação',
      'Segurança no Trabalho e Controlo de Ruído e Radiação Térmica'
    ],
    provincesAvailable: ['Maputo Cidade', 'Sofala', 'Cabo Delgado']
  },
  {
    id: 'instalador-tubulacao',
    title: 'Instalador de Linhas de Tubulação Industrial (Encanador)',
    slug: 'instalador-encanador-industrial',
    category: 'Construção e Logística',
    duration: 260,
    description: 'Ensina a pré-fabricar, alinhar, nivelar e instalar linhas de tubulações estruturadas para óleo e fluidos petrolíferos de alta viscosidade sob rígidas diretrizes internacionais (normas ASME / Moçambique).',
    targetAudience: [
      'Operários de obras que queiram ascender a instaladores navais e refinarias',
      'Profissionais da área de solda'
    ],
    prerequisites: 'Idade mínima de 18 anos',
    educationRequired: '9ª Classe completa ou equivalente',
    modality: 'Presencial',
    marketDemand: 'Muito solicitado para implantação de redes de distribuição secundárias nos polos petrolíferos das províncias produtoras de hidrocarbonetos.',
    syllabus: [
      'Leitura de Plantas de Tubagem e Desenhos Ortográficos',
      'Tipologia de Conexões Flangeadas, Roscadas e Soldadas',
      'Montagem de Suportes de Carga e Alinhamento Preciso de Nível',
      'Noções Básicas de Corrosão Galvânica e Aplicação de Revestimentos',
      'Procedimentos de Testes Hidropneumáticos de Vedação Segura'
    ],
    provincesAvailable: ['Maputo Província', 'Sofala', 'Inhambane']
  },
  {
    id: 'montador-andaimes',
    title: 'Montador de Andaimes Industriais em Altura',
    slug: 'montador-de-andaimes-industrial',
    category: 'Construção e Logística',
    duration: 200,
    description: 'Preparo robusto para montagem e desmontagem segura de estruturas provisórias tubulares e fachadas suspensas para permitir o isolamento térmico, reparo estrutural e pintura em torres.',
    targetAudience: [
      'Jovens desempregados de comunidades rurais e ribeirinhas',
      'Pessoas com aptidões para trabalho sob altura controlada'
    ],
    prerequisites: 'Idade mínima de 18 anos, não possuir acrofobia (medo de altura)',
    educationRequired: 'Ensino Primário completo ou equivalente',
    modality: 'Presencial',
    marketDemand: 'Demanda perene nos terminais marítimos, estaleiros de reparos navais e plantas de processamento mineral do país.',
    syllabus: [
      'Cálculo e Dimensionamento de Carga de Plataformas Provisórias',
      'Normas de Segurança em Altura (EPIs de Absorção de Impacto)',
      'Prática de Montagem com Abraçadeiras Fixas e Articuladas',
      'Amarração Confiável, Verificação de Prumos e Forramento Seguros',
      'Organização de Canteiros de Obra e Manuseio de Içamento'
    ],
    provincesAvailable: ['Sofala', 'Nampula', 'Cabo Delgado', 'Maputo Província']
  },
  {
    id: 'instalador-solar',
    title: 'Instalador de Sistemas Solares Fotovoltaicos',
    slug: 'instalador-solar-fotovoltaico',
    category: 'Operações e Energia',
    duration: 240,
    description: 'Capacitação completa em montagem, dimensionamento básico, conexões de inversores e manutenção preventiva de sistemas de energia solar fotovoltaica off-grid e híbridos para eletrificação rural descentralizada.',
    targetAudience: [
      'Jovens interessados na transição para energias renováveis e limpas',
      'Eletricistas básicos residenciais que buscam especialização sustentável',
      'Residentes de zonas periurbanas e distritos rurais com alto potencial solar'
    ],
    prerequisites: 'Idade mínima de 18 anos',
    educationRequired: '7ª Classe completa ou equivalente',
    modality: 'Presencial',
    marketDemand: 'Fomento urgente à eletrificação do país fora da rede convencional (Funae, AMER, RENMOZ) e expansão em províncias de grande dispersão habitacional.',
    syllabus: [
      'Princípios de Radiação Solar e Células Fotovoltaicas',
      'Dimensionamento de Carga e Armazenamento (Banco de Baterias)',
      'Instalação Prática de Painéis, Controladores de Carga e Inversores',
      'Protocolos de Manutenção Preventiva e Limpeza de Painéis',
      'Termos de Proteção Elétrica e Aterramento em Corrente Contínua'
    ],
    provincesAvailable: ['Inhambane', 'Cabo Delgado', 'Tete', 'Nampula', 'Sofala']
  },
  {
    id: 'pedreiro-geral',
    title: 'Pedreiro Geral e Construção Civil Básica',
    slug: 'pedreiro-construcao-civil',
    category: 'Construção e Logística',
    duration: 320,
    description: 'Ensino prático focado em leitura de projetos básicos de alvenaria, preparação de argamassas, assentamento alinhado de blocos/tijolos, reboco de alto Acabamento e segurança básica em canteiros de obras.',
    targetAudience: [
      'Cidadãos sem experiência que desejam entrar na construção civil de imediato',
      'Ajudantes de obras que buscam ascensão profissional e certificação de carteira'
    ],
    prerequisites: 'Idade mínima de 18 anos, robustez física para atividades operacionais',
    educationRequired: 'Ensino Primário completo ou equivalente',
    modality: 'Presencial',
    marketDemand: 'Necessidade crucial na reestruturação habitacional, obras públicas descentralizadas e construção das cidades operárias associadas aos grandes empreendimentos nacionais.',
    syllabus: [
      'Leitura Básica de Plantas, Cortes e Prumos de Construção',
      'Dosagem e Preparação Química de Betão, Argamassa e Revestimentos',
      'Técnicas de Alinhamento e Assentamento de Blocos de Cimento e Tijolo',
      'Aplicação de Rebocos e Nivelas de Piso com Perfeição',
      'Uso Rígido de Equipamentos de Proteção Individual em Obras Pesadas'
    ],
    provincesAvailable: ['Maputo Cidade', 'Maputo Província', 'Sofala', 'Cabo Delgado']
  },
  {
    id: 'mecanico-diesel-agro',
    title: 'Mecânico de Motores Diesel e Bombas Agrícolas',
    slug: 'mecanico-motores-diesel-agricolas',
    category: 'Manutenção Industrial',
    duration: 285,
    description: 'Formação em manutenção de motores de combustão interna movidos a diesel aplicados no agronegócio e bombas de irrigação. Ensina a fazer afinações, trocas de filtros de combustível, desentupimentos e reparos rápidos.',
    targetAudience: [
      'Jovens de comunidades rurais focadas na agricultura familiar e comercial',
      'Técnicos de motores de gasolina que pretendem migrar para a motorização diesel'
    ],
    prerequisites: 'Idade mínima de 18 anos',
    educationRequired: '7ª Classe completa ou equivalente',
    modality: 'Presencial',
    marketDemand: 'O agronegócio moçambicano nas ricas bacias fluviais (Tete, Nampula, Zambézia) possui grande carência de mecânicos habilitados a restabelecer bombas e geradores locais.',
    syllabus: [
      'Princípios de Funcionamento do Ciclo de Combustão Diesel a 4 Tempos',
      'Diagnóstico de Falhas em Sistemas de Injeção Eletrônica e Mecânica',
      'Manutenção Preventiva de Cabeçotes, Válvulas e Pistões de Alta Pressão',
      'Operação e Manutenção Fina de Bombas Centrífugas de Irrigação',
      'Práticas Ecológicas para Eliminação Transparente de Óleo Usado'
    ],
    provincesAvailable: ['Tete', 'Inhambane', 'Nampula']
  },
  {
    id: 'operador-empilhadeira-log',
    title: 'Operador de Empilhadeira e Logística de Armazéns',
    slug: 'operador-empilhadeira-logistica',
    category: 'Construção e Logística',
    duration: 180,
    description: 'Ensina a operar empilhadeiras hidráulicas e elétricas industriais com segurança, além de noções estruturadas de inventários, armazenagem eficiente, rotulagem inteligente e controle de entrada/saída de canteiros.',
    targetAudience: [
      'Indivíduos em busca de emprego em supermercados centrais, armazéns e portos',
      'Motoristas que procuram ampliar suas categorias profissionais e habilitações industriais'
    ],
    prerequisites: 'Idade mínima de 18 anos, recomendável possuir carta de condução (não obrigatório)',
    educationRequired: '9ª Classe completa ou equivalente',
    modality: 'Presencial',
    marketDemand: 'Crescimento substancial nos centros de distribuição logística e terminais de contêineres do Corredor de Nacala e Porto da Beira.',
    syllabus: [
      'Instruções de Condução e Operações de Alavancas de Carga Hidráulica',
      'Normas de Equilíbrio de Centro de Gravidade e Cálculo de Peso de Paletes',
      'Técnicas de Armazenagem de Produtos Perigosos, Químicos ou Inflamáveis',
      'Noções Básicas de Softwares de Inventário e Registro de Mercadorias',
      'Inspeções Diárias de Segurança Pré e Pós-Operação de Máquinas'
    ],
    provincesAvailable: ['Nampula', 'Sofala', 'Maputo Província']
  },
  {
    id: 'auxiliar-administrativo',
    title: 'Auxiliar de Contabilidade e Assistente Administrativo',
    slug: 'auxiliar-administrativo-contabilidade',
    category: 'Tecnologia',
    duration: 300,
    description: 'Capacitação para suporte administrativo às micro/pequenas empresas e associações locais. Ensina fundamentos de contabilidade primária, faturamento eletrônico, controle orçamental integrado, uso de planilhas e relatórios gerenciais.',
    targetAudience: [
      'Jovens em busca do primeiro emprego em escritório ou serviços públicos locais',
      'Mulheres da comunidade motivadas a liderar a gestão financeira de suas iniciativas cooperativas'
    ],
    prerequisites: 'Idade mínima de 17 anos',
    educationRequired: '10ª Classe completa ou equivalente',
    modality: 'Semipresencial',
    marketDemand: 'Toda e qualquer micro ou pequena empresa requer administração sólida e conciliação de fluxo de caixa para sua sobrevivência econômica diária.',
    syllabus: [
      'Processamento de Faturas e Notas de Lançamento de Caixa',
      'Uso de Excel e Planilhas para Balancetes de Controle Financeiro',
      'Redação de E-mails, Atas de Reuniões e Memorandos Oficiais',
      'Noções Básicas do Sistema Fiscal de Moçambique (IVA, IRPS, INSS)',
      'Gestão Organizada de Arquivos Digitais e Físicos de Pessoal'
    ],
    provincesAvailable: ['Maputo Cidade', 'Maputo Província', 'Sofala', 'Cabo Delgado']
  }
];

export const PROVINCES: ProvinceData[] = [
  {
    id: 'cabo-delgado',
    name: 'Cabo Delgado',
    hubs: [
      {
        district: 'Pemba',
        institution: 'Centro de Formação Profissional do IFPELAC - Pemba',
        address: 'AvenidaEduardo Mondlane, Bairro do Natite, Pemba',
        spots: 850,
        courses: ['soldador-est', 'eletricista-ind', 'mecanico-manut', 'aux-operacoes', 'instrumentista-ind', 'letramento-dig', 'caldeireiro-ind', 'analista-dados', 'montador-andaimes', 'instalador-solar', 'pedreiro-geral', 'auxiliar-administrativo']
      },
      {
        district: 'Palma',
        institution: 'Unidade Móvel IFPELAC / Porto de Palma',
        address: 'Zona de Expansão Costeira, Palma',
        spots: 350,
        courses: ['soldador-est', 'aux-operacoes', 'montador-andaimes', 'letramento-dig', 'instalador-solar']
      }
    ]
  },
  {
    id: 'maputo-cidade',
    name: 'Maputo Cidade',
    hubs: [
      {
        district: 'Maputo Central',
        institution: 'Instituto de Formação Profissional do IFPELAC - Maputo Sede',
        address: 'Rua do Trabalho, nº 420, Bairro da Mafalala, Maputo',
        spots: 1400,
        courses: ['eletricista-ind', 'soldador-est', 'caldeireiro-ind', 'desenvolvedor-fullstack', 'analista-dados', 'letramento-dig', 'pedreiro-geral', 'auxiliar-administrativo']
      }
    ]
  },
  {
    id: 'maputo-provincia',
    name: 'Maputo Província',
    hubs: [
      {
        district: 'Matola',
        institution: 'Centro Vocacional do IFPELAC - Matola',
        address: 'Avenida das Indústrias, Parcela 150B, Matola',
        spots: 1200,
        courses: ['eletricista-ind', 'mecanico-manut', 'aux-operacoes', 'instrumentista-ind', 'desenvolvedor-fullstack', 'instalador-tubulacao', 'montador-andaimes', 'letramento-dig', 'pedreiro-geral', 'operador-empilhadeira-log', 'auxiliar-administrativo']
      }
    ]
  },
  {
    id: 'sofala',
    name: 'Sofala',
    hubs: [
      {
        district: 'Beira',
        institution: 'Centro Vocacional Especializado do IFPELAC - Beira',
        address: 'Avenida Armando Tivane, Bairro do Estoril, Beira',
        spots: 750,
        courses: ['eletricista-ind', 'soldador-est', 'mecanico-manut', 'caldeireiro-ind', 'desenvolvedor-fullstack', 'instalador-tubulacao', 'montador-andaimes', 'letramento-dig', 'instalador-solar', 'pedreiro-geral', 'operador-empilhadeira-log', 'auxiliar-administrativo']
      }
    ]
  },
  {
    id: 'nampula',
    name: 'Nampula',
    hubs: [
      {
        district: 'Nacala-Porto',
        institution: 'Centro Vocacional do IFPELAC - Nacala',
        address: 'Rua da Zona Portuária, Nacala',
        spots: 600,
        courses: ['eletricista-ind', 'montador-andaimes', 'letramento-dig', 'desenvolvedor-fullstack', 'instalador-solar', 'mecanico-diesel-agro', 'operador-empilhadeira-log']
      }
    ]
  },
  {
    id: 'tete',
    name: 'Tete',
    hubs: [
      {
        district: 'Cidade de Tete',
        institution: 'Centro de Formação Profissional IFPELAC - Tete',
        address: 'Avenida da Liberdade, Bairro de Francisco Manyanga, Tete',
        spots: 550,
        courses: ['eletricista-ind', 'mecanico-manut', 'instrumentista-ind', 'analista-dados', 'letramento-dig', 'instalador-solar', 'mecanico-diesel-agro']
      }
    ]
  },
  {
    id: 'inhambane',
    name: 'Inhambane',
    hubs: [
      {
        district: 'Maxixe',
        institution: 'Centro de Formação Vocacional de Inhambane - Maxixe',
        address: 'Estrada Nacional nº 1, Entrada Sul, Maxixe',
        spots: 450,
        courses: ['aux-operacoes', 'letramento-dig', 'instalador-tubulacao', 'instalador-solar', 'mecanico-diesel-agro']
      }
    ]
  }
];

export const FAQS: FAQItem[] = [
  {
    id: 'faq-1',
    category: 'Geral',
    question: 'O que é o Programa Autonomia e Renda Moçambique?',
    answer: 'O Programa Autonomia e Renda é uma iniciativa socioeducativa pioneira financiada pela Petrobras Moçambique em parceria operacional com o IFPELAC (Instituto de Formação Profissional e Estudos Laborais Alberto Cassimo) e o Ministério do Trabalho, Emprego e Segurança Social (MITESS). O principal objetivo é formar tecnicamente e conceder subsídio financeiro a moçambicanos de famílias vulneráveis, acelerando sua inserção nas atividades industriais, portuárias e tecnológicas do país.'
  },
  {
    id: 'faq-2',
    category: 'Inscrições',
    question: 'Quem pode participar do programa e quais os grupos prioritários?',
    answer: 'O programa é voltado a pessoas de baixa renda, em situação de desemprego ou subemprego. Priorizamos estruturalmente mulheres (com ou sem dependentes), agregados familiares chefiados por mães solo, jovens desempregados em busca de primeira colocação, e residentes em distritos circum-adjacentes e vizinhos aos grandes megaprojetos industriais da Petrobras e suas operadoras.'
  },
  {
    id: 'faq-3',
    category: 'Bolsas e Auxílios',
    question: 'Qual é o valor da bolsa-auxílio moçambicana e como funciona?',
    answer: 'Todas as formações qualificantes são 100% gratuitas (incluindo isenção total de matrículas e propinas/taxas). Adicionalmente, o aluno de presença integral regular poderá ser elegível para receber mensalmente:\n\n- Bolsa-auxílio geral: 8.000 MZN (Meticais) mensais.\n- Bolsa-auxílio diferenciada para Mulheres com filhos menores de 11 anos: 10.500 MZN mensais, auxiliando no sustento e cuidados familiares.\n\nRegra Geral de Transparência: Nós não cobramos qualquer tipo de propina e nem realizamos pagamentos ou ofertas diretas de dinheiro de auxílio através deste portal. As bolsas são homologadas e operacionalizadas de forma inteiramente segura e regulada exclusivamente na plataforma oficial e canais internos oficiais da Petrobras com apoio do IFPELAC.'
  },
  {
    id: 'faq-4',
    category: 'Inscrições',
    question: 'Quais documentos são exigidos para efetivar a inscrição?',
    answer: 'No momento da inscrição online, basta preencher este formulário simplificado com as informações básicas do seu BI (Bilhete de Identidade), o seu NUIT (Número de Identificação Tributária) e comprovativos aproximados de agregado familiar ou escolaridade. Se selecionado, você será convocado a apresentar a cópia física destes documentos no centro do IFPELAC correspondente.'
  },
  {
    id: 'faq-5',
    category: 'Moçambique',
    question: 'Os cursos são reconhecidos oficialmente em Moçambique?',
    answer: 'Sim, absolutamente! Todas as qualificações profissionais são certificadas e homologadas sob o escopo pedagógico nacional do IFPELAC e da Autoridade Nacional da Educação Profissional (ANEP) de Moçambique, atribuindo aos graduandos as carteiras profissionais oficiais reconhecidas por todas as multinacionais que operam no território moçambicano.'
  },
  {
    id: 'faq-6',
    category: 'Bolsas e Auxílios',
    question: 'Se eu faltar às aulas, posso perder o direito de receber a bolsa?',
    answer: 'Sim. A manutenção pontual e integral da bolsa-auxílio mensal exige que o aluno obtenha frequência mínima exigida de 85% em todas as atividades teóricas e laboratórios manuais a cada mês corrente.'
  }
];
