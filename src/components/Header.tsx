/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Menu, X, Landmark, Globe, Award } from 'lucide-react';

interface HeaderProps {
  activeSection: string;
  setActiveSection: (sec: string) => void;
}

export default function Header({ activeSection, setActiveSection }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { id: 'sobre', label: 'Sobre o Programa' },
    { id: 'cursos', label: 'Explore os Cursos' },
    { id: 'calculadora', label: 'Bolsas e Calculadora' },
    { id: 'orientador', label: 'Orientador Vocacional' },
    { id: 'inscricao', label: 'Inscrição Online' },
    { id: 'acompanhar', label: 'Acompanhar Candidatura' },
    { id: 'centros', label: 'Centros IFPELAC' },
    { id: 'faq', label: 'Dúvidas Frequentes' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b-3 border-petro-green shadow-sm">
      {/* Top Warning/Alert Line for Global Context */}
      <div className="w-full bg-petro-blue py-2 px-4 text-xs text-white font-medium">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-1">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2.5 h-2.5 bg-petro-yellow rounded-full animate-pulse" />
            <span>Inscrições abertas para o programa de qualificação em Moçambique • Ciclo 2026</span>
          </div>
          <div className="flex items-center gap-4 text-[10px] sm:text-xs">
            <span className="flex items-center gap-1">
              <Globe className="w-3.5 h-3.5" /> Território de Moçambique
            </span>
            <span className="bg-petro-yellow text-petro-blue font-extrabold px-1.5 py-0.5 rounded leading-none text-[9px]">
              100% GRATUITO
            </span>
          </div>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 h-20 flex justify-between items-center">
        {/* Brand Group */}
        <div 
          onClick={() => setActiveSection('sobre')} 
          className="flex items-center gap-3 cursor-pointer select-none"
        >
          {/* Petrobras Custom SVG Styled Logo */}
          <div className="flex items-center gap-1.5 bg-gradient-to-r from-petro-blue via-petro-green to-petro-yellow p-2.5 rounded-lg shadow-sm">
            <svg viewBox="0 0 100 100" className="w-8 h-8 text-white fill-current">
              <polygon points="5,5 95,5 95,30 35,30 35,50 80,50 80,75 35,75 35,95 5,95" />
            </svg>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold tracking-tight text-xl text-petro-blue leading-none">
                PETROBRAS
              </span>
              <span className="text-xs font-semibold bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">
                Moçambique
              </span>
            </div>
            <span className="text-[10px] font-medium tracking-widest uppercase text-petro-green leading-none mt-1">
              Autonomia & Renda
            </span>
          </div>
        </div>

        {/* Partners Badges - Desktop */}
        <div className="hidden lg:flex items-center gap-4 text-slate-400 border-l border-r border-slate-100 px-6 h-10 mx-4">
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <Landmark className="w-4 h-4 text-slate-500" />
            <div className="flex flex-col">
              <span className="font-bold text-[10px] uppercase leading-none text-slate-400">Parceiro Oficial</span>
              <span className="font-semibold text-slate-700 leading-snug">IFPELAC</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <Award className="w-4 h-4 text-slate-500" />
            <div className="flex flex-col">
              <span className="font-bold text-[10px] uppercase leading-none text-slate-400">Certificado por</span>
              <span className="font-semibold text-slate-700 leading-snug">ANEP Moçambique</span>
            </div>
          </div>
        </div>

        {/* Navigation - Desktop */}
        <nav className="hidden xl:flex items-center gap-1 h-full">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => setActiveSection(link.id)}
              className={`px-3 py-2 text-xs font-bold rounded-md transition-all h-9 flex items-center ${
                activeSection === link.id
                  ? 'bg-petro-green text-white shadow-sm'
                  : 'text-slate-600 hover:text-petro-green hover:bg-slate-50'
              }`}
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Right CTA Area - Desktop */}
        <div className="hidden lg:flex items-center gap-2">
          <button 
            onClick={() => setActiveSection('inscricao')}
            className="bg-[#FFD100] text-[#005288] font-black px-4 py-2 text-xs rounded-lg shadow-sm hover:opacity-90 transition-all select-none"
          >
            Inscrever-se Já
          </button>
        </div>

        {/* Mobile Toggle Button */}
        <div className="xl:hidden flex items-center">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2.5 rounded-lg text-slate-600 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-petro-green cursor-pointer"
            aria-label="Alternar Menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {isOpen && (
        <div className="xl:hidden bg-white border-t border-slate-100 shadow-inner max-h-[85vh] overflow-y-auto">
          <div className="px-4 py-5 space-y-2">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => {
                  setActiveSection(link.id);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-3 text-sm font-semibold rounded-lg transition-all ${
                  activeSection === link.id
                    ? 'bg-petro-green text-white'
                    : 'text-slate-700 hover:text-petro-green hover:bg-slate-50'
                }`}
              >
                {link.label}
              </button>
            ))}
            
            {/* Direct CTA on Mobile */}
            <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
              <button 
                onClick={() => {
                  setActiveSection('inscricao');
                  setIsOpen(false);
                }}
                className="w-full text-center bg-petro-yellow text-petro-blue font-extrabold py-3.5 rounded-lg text-sm shadow-sm"
              >
                Inscrição Online Rápida
              </button>
              
              <div className="flex justify-around items-center pt-3 text-[10px] text-slate-400 font-mono">
                <span>IFPELAC 🇲🇿</span>
                <span>•</span>
                <span>PETROBRAS 💚💛</span>
                <span>•</span>
                <span>ANEP CERTIFICADO</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
