/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ShieldCheck, HelpCircle, ArrowRight, Zap, Users, GraduationCap, DollarSign } from 'lucide-react';

interface HeroProps {
  onNavigate: (sectionId: string) => void;
}

export default function Hero({ onNavigate }: HeroProps) {
  return (
    <section className="bg-slate-50 py-12 lg:py-18 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Dynamic Breadcrumb/Context Header */}
        <div className="flex items-center gap-2 mb-6">
          <span className="bg-petro-green/10 text-petro-green text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            Petrobras Moçambique, Lda.
          </span>
          <span className="text-slate-300">/</span>
          <span className="text-slate-500 text-xs font-semibold">Qualificação Profissional</span>
        </div>

        {/* Hero Grid Wrapper */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Main Copy Area */}
          <div className="lg:col-span-7 space-y-6">
            <h1 className="text-3xl md:text-5xl font-black text-petro-blue leading-tight tracking-tight">
              A sua porta de entrada para o setor de{' '}
              <span className="text-petro-green underline decoration-petro-yellow decoration-4">Energia e Tecnologia</span> em Moçambique.
            </h1>
            
            <p className="text-slate-600 text-sm md:text-base leading-relaxed max-w-2xl">
              Inspirado no consagrado programa de capacitação da Petrobras, o{' '}
              <strong className="text-slate-1000 font-bold">Autonomia e Renda Moçambique</strong> oferece cursos industriais e tecnológicos de nível internacional de forma{' '}
              <strong className="text-petro-green font-bold text-base">100% gratuita</strong>, com bolsas-auxílio de até <strong className="text-slate-800 font-bold">10.500 MZN</strong> mensais para apoiar o seu sustento durante os estudos.{' '}
              <span className="text-xs text-rose-600 font-semibold block mt-2">
                ⚠️ Aviso Importante: Nós não cobramos propinas (taxas) e nem oferecemos ou pagamos dinheiro de auxílio diretamente através deste portal, exceto através dos processos de governação oficiais e na plataforma oficial da Petrobras.
              </span>
            </p>

            {/* Quick trust badges */}
            <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-500 py-2">
              <span className="flex items-center gap-1.5 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm">
                <ShieldCheck className="w-4 h-4 text-petro-green" /> Inscrição totalmente grátis
              </span>
              <span className="flex items-center gap-1.5 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm">
                <Zap className="w-4 h-4 text-amber-500 animate-pulse" /> Auxílio transporte & alimentação
              </span>
              <span className="flex items-center gap-1.5 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm">
                <GraduationCap className="w-4 h-4 text-petro-green" /> Certificação IFPELAC & ANEP
              </span>
            </div>

            {/* CTA Group */}
            <div className="flex flex-col sm:flex-row gap-3 pt-3">
              <button
                onClick={() => onNavigate('inscricao')}
                className="bg-petro-green hover:opacity-90 text-white font-bold px-8 py-4 rounded-xl text-center flex items-center justify-center gap-2 shadow-lg shadow-petro-green/20 transition-all cursor-pointer"
              >
                Inscrição Online Grátis
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => onNavigate('cursos')}
                className="bg-white border border-slate-200 hover:border-slate-300 text-slate-700 font-bold px-8 py-4 rounded-xl text-center flex items-center justify-center gap-2 hover:bg-slate-50 transition-all cursor-pointer"
              >
                Ver Cursos Disponíveis
              </button>
            </div>

            {/* Sub-Context detail */}
            <div className="text-xs text-slate-400 font-medium">
              * Vagas limitadas e destinadas prioritariamente a grupos de vulnerabilidade socioeconómica, mulheres, chefes de família e residentes locais.
            </div>
          </div>

          {/* Banner Graphic Area */}
          <div className="lg:col-span-12 xl:col-span-5 relative mt-4 xl:mt-0">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-200 aspect-[4/3] max-w-lg mx-auto lg:max-w-none">
              
              {/* Fallback pattern background if picture fails */}
              <div className="absolute inset-0 bg-gradient-to-tr from-petro-green/35 via-transparent to-petro-yellow/25 z-0" />
              
              {/* Actual Generated Image asset */}
              <img 
                src="/src/assets/images/hero_banner_1779387929683.png" 
                alt="Moçambicanos em formação técnica profissional" 
                className="w-full h-full object-cover relative z-10"
                onError={(e) => {
                  // Fallback in case path resolver changes or image is missing
                  e.currentTarget.style.display = 'none';
                }}
              />
              
              {/* Bottom badge overlay */}
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-lg z-25 flex items-center gap-3 border border-slate-100">
                <div className="p-2.5 bg-yellow-50 rounded-xl text-petro-green">
                  <GraduationCap className="w-6 h-6 text-petro-green" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800 leading-none">Formação Oficial Certificada</h4>
                  <p className="text-[10px] text-slate-500 leading-normal mt-1">Autoridade Nacional da Educação Profissional (ANEP)</p>
                </div>
              </div>

              {/* Decorative side shape */}
              <div className="absolute -top-12 -right-12 w-24 h-24 bg-petro-yellow/30 rounded-full blur-2xl z-0" />
              <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-petro-green/20 rounded-full blur-2xl z-0" />
            </div>
          </div>
        </div>

        {/* Bento Key Numbers Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
          {/* Card 1 */}
          <div className="bento-card bg-white border border-slate-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all flex items-start gap-4">
            <div className="p-3 bg-green-50 rounded-xl text-petro-green">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider font-extrabold text-petro-green">Bolsa-Auxílio Mensal</span>
              <h3 className="text-2xl font-black text-petro-blue mt-0.5">8.000 MZN</h3>
              <p className="text-slate-500 text-[11px] leading-normal mt-1">Geral para todos estudantes de presença regular ativa.</p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bento-card bg-white border border-slate-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all flex items-start gap-4">
            <div className="p-3 bg-amber-50 rounded-xl text-amber-500">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider font-extrabold text-amber-600">Apoio a Mães Solo</span>
              <h3 className="text-2xl font-black text-petro-blue mt-0.5">10.500 MZN</h3>
              <p className="text-slate-500 text-[11px] leading-normal mt-1">Para inscritas com dependentes menores de 11 anos.</p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bento-card bg-white border border-slate-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all flex items-start gap-4">
            <div className="p-3 bg-blue-50 rounded-xl text-petro-blue">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-500">Variedade Curricular</span>
              <h3 className="text-2xl font-black text-petro-blue mt-0.5">11 Cursos</h3>
              <p className="text-slate-500 text-[11px] leading-normal mt-1">Eletricista, Soldador, Mecânico, e novas vertentes Tech.</p>
            </div>
          </div>

          {/* Card 4 */}
          <div className="bento-card bg-white border border-slate-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all flex items-start gap-4">
            <div className="p-3 bg-yellow-55 border border-yellow-200 rounded-xl text-petro-green">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider font-extrabold text-petro-green">Acesso Facilitado</span>
              <h3 className="text-2xl font-black text-petro-blue mt-0.5">100% Grátis</h3>
              <p className="text-slate-500 text-[11px] leading-normal mt-1">Carga letiva completa, material escolar e fardamentos pagos.</p>
            </div>
          </div>
        </div>

        {/* Community Voluntary Support Disclaimer Banner */}
        <div className="mt-12 bg-petro-blue/5 border border-petro-blue/10 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-6">
          <div className="w-12 h-12 rounded-2xl bg-petro-blue/10 text-petro-blue flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div className="space-y-1.5 text-center md:text-left">
            <h4 className="text-xs font-extrabold text-petro-blue uppercase tracking-wider flex flex-wrap items-center justify-center md:justify-start gap-2">
              <span>Compromisso Cívico e de Utilidade Pública</span>
              <span className="bg-petro-green text-white text-[9px] font-black px-2 py-0.5 rounded-full border border-white">
                100% GRATUITO
              </span>
            </h4>
            <p className="text-xs text-slate-700 leading-relaxed font-normal">
              Este portal de transparência tem como missão única e exclusiva <strong>ajudar os moçambicanos de forma totalmente gratuita</strong> a se qualificarem para grandes projetos. Não cobramos quaisquer taxas de inscrição, não exigimos propinas de matrícula e não realizamos pagamentos ou ofertas diretas de bolsas de auxílio financeiro por aqui, as quais são processadas exclusivamente na plataforma física e canais corporativos oficiais homologados da Petrobras em cooperação com as entidades financeiras parceiras. Nosso papel é facilitar gratuitamente o seu acesso às vagas de forma livre, limpa e segura!
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
