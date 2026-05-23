/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Info, Mail, Phone, Landmark, ShieldAlert, Award } from 'lucide-react';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="bg-slate-900 text-slate-400 py-12 border-t-4 border-petro-green">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Upper footer grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-10 border-b border-slate-800">
          
          {/* Main info (4 cols) */}
          <div className="md:col-span-4 space-y-4 text-left">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 bg-petro-green p-2 rounded-lg">
                <svg viewBox="0 0 100 100" className="w-5 h-5 text-white fill-current">
                  <polygon points="5,5 95,5 95,30 35,30 35,50 80,50 80,75 35,75 35,95 5,95" />
                </svg>
              </div>
              <span className="font-black text-white text-base tracking-widest uppercase">PETROBRAS</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              O Programa Autonomia e Renda é focado na geração de capital humano habilitado de forma inclusiva, impulsionando a independência e o desenvolvimento sustentável em Moçambique.
            </p>
            <div className="flex gap-4 text-xs font-mono font-medium pt-2 text-petro-green">
              <span>PETROBRAS MOZ 🇲🇿</span>
              <span>•</span>
              <span>IFPELAC PARCEIRO 🤝</span>
            </div>
          </div>

          {/* Nav Links columns (3 cols) */}
          <div className="md:col-span-3 space-y-3.5 text-left">
            <h4 className="text-white text-xs font-bold uppercase tracking-wider">Acesso Rápido</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('sobre')} className="hover:text-white transition-colors cursor-pointer">
                  Sobre o Programa
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('cursos')} className="hover:text-white transition-colors cursor-pointer">
                  Grade Curricular de Cursos
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('calculadora')} className="hover:text-white transition-colors cursor-pointer">
                  Simulador de Bolsa-Auxílio
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('orientador')} className="hover:text-white transition-colors cursor-pointer">
                  Orientador Vocacional Rápido
                </button>
              </li>
            </ul>
          </div>

          {/* Form Links columns (3 cols) */}
          <div className="md:col-span-3 space-y-3.5 text-left">
            <h4 className="text-white text-xs font-bold uppercase tracking-wider">Serviços Administrativos</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('inscricao')} className="hover:text-white transition-colors cursor-pointer text-petro-yellow font-bold">
                  Efetuar Inscrição Online
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('acompanhar')} className="hover:text-white transition-colors cursor-pointer">
                  Verificar Protocolo de Candidatura
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('centros')} className="hover:text-white transition-colors cursor-pointer">
                  Centros de Treinamento Físicos
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('faq')} className="hover:text-white transition-colors cursor-pointer font-bold">
                  Dúvidas Frequentes FAQ
                </button>
              </li>
            </ul>
          </div>

          {/* Technical partnership contact details (2 cols) */}
          <div className="md:col-span-2 space-y-4 text-left">
            <h4 className="text-white text-xs font-bold uppercase tracking-wider">Contacto Oficial</h4>
            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-petro-green" />
                <span className="truncate">suporte@ar-petrobras.co.mz</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-petro-green" />
                <span>+258 21 445 613</span>
              </div>
              <div className="flex items-start gap-2">
                <Landmark className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                <span className="text-[10px] leading-snug">Av. da Mafalala, Cidade de Maputo, Moçambique</span>
              </div>
            </div>
          </div>

        </div>

        {/* Lower footer with partnerships badge and copyright notes */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-6 pt-10 text-[11px] text-slate-500 font-medium">
          <div className="space-y-1.5 text-center sm:text-left">
            <p>© 2026 Petrobras Moçambique, Lda. Todos os direitos reservados.</p>
            <p className="text-[10px] text-slate-500 max-w-2xl">
              Operacionalizado em convênio técnico corporativo com o IFPELAC (Instituto de Formação Profissional e Estudos Laborais Alberto Cassimo) sob regência governamental do MITESS e ANEP Moçambique.
            </p>
            <p className="text-[10px] text-petro-yellow font-semibold">
              ⚠️ Alerta de Segurança: Todo o suporte e formulário de inscrição integrados neste portal são 100% livres de cobranças. Não pague propinas ou valores monetários. Nós não realizamos ofertas ou pagamentos diretos de valores de auxílio por esta plataforma, os quais são operacionalizados unicamente por meio da plataforma e estruturas oficiais da Petrobras.
            </p>
          </div>
          
          <div className="flex items-center gap-4 bg-slate-950 px-4 py-2 rounded-xl border border-slate-800 shrink-0 select-none">
            <div className="text-right">
              <span className="text-[8px] uppercase font-bold text-slate-600 block leading-none">Certificado por</span>
              <strong className="text-xs font-extrabold text-slate-300">ANEP Moçambique</strong>
            </div>
            <Award className="w-6 h-6 text-petro-green" />
          </div>
        </div>

      </div>
    </footer>
  );
}
