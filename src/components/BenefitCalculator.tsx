/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { HelpCircle, DollarSign, Award, CheckCircle2, Calculator, Info } from 'lucide-react';

export default function BenefitCalculator() {
  const [gender, setGender] = useState<'Masculino' | 'Feminino'>('Feminino');
  const [hasChildrenUnder11, setHasChildrenUnder11] = useState<boolean>(true);
  const [commuteDays, setCommuteDays] = useState<number>(22); // standard classes per month

  // Values in Meticais (MZN)
  const baseStipend = 8000;
  const womenStipendWithKids = 10500;
  
  const dailyTransportValue = 120; // typical transport cost in Mozambican cities (chapa) is covered
  const monthlyTransport = commuteDays * dailyTransportValue;
  
  const dailyMealValue = 150; // value of hot lunch served at IFPELAC
  const monthlyMealValue = commuteDays * dailyMealValue;

  // Calculate personal total
  const isEligibleForWomanRate = gender === 'Feminino' && hasChildrenUnder11;
  const finalStipend = isEligibleForWomanRate ? womenStipendWithKids : baseStipend;
  const totalFinancialValue = finalStipend + monthlyTransport + monthlyMealValue;

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Module Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-petro-green text-xs font-bold uppercase tracking-wider bg-petro-green/10 px-3 py-1.5 rounded-full inline-block mb-3">
            Custos e Incentivos Financeiros
          </span>
          <h2 className="text-2xl md:text-3xl font-black text-petro-blue">
            Calculadora de Incentivos e Bolsas
          </h2>
          <p className="text-slate-600 text-xs md:text-sm mt-3 leading-relaxed">
            O programa custeia integralmente os cursos e ainda apoia financeiramente o estudante mensalmente para evitar a evasão escolar e garantir que você tenha transporte e alimentação saudáveis. Eleve sua autonomia financeira!
          </p>
        </div>

        {/* Main Interface Box */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          
          {/* Form Settings Area (left 5 columns) */}
          <div className="lg:col-span-5 bg-white border border-slate-200 p-6 rounded-3xl flex flex-col justify-between shadow-sm">
            <div className="space-y-6">
              <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
                <Calculator className="w-5 h-5 text-petro-green" />
                <h3 className="font-extrabold text-petro-blue text-sm">Simulador de Benefício Customizado</h3>
              </div>

              {/* Setting 1: Gender */}
              <div className="space-y-2">
                <label className="text-xs font-extrabold text-slate-500 uppercase tracking-wide block">Gênero do Candidato</label>
                <div className="grid grid-cols-2 gap-3">
                   <button
                    onClick={() => setGender('Feminino')}
                    className={`py-3 px-4 text-xs font-bold rounded-xl border transition-all text-center cursor-pointer ${
                      gender === 'Feminino'
                        ? 'bg-petro-green text-white border-petro-green shadow-sm'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    Feminino
                  </button>
                  <button
                    onClick={() => {
                      setGender('Masculino');
                      setHasChildrenUnder11(false);
                    }}
                    className={`py-3 px-4 text-xs font-bold rounded-xl border transition-all text-center cursor-pointer ${
                      gender === 'Masculino'
                        ? 'bg-petro-green text-white border-petro-green shadow-sm'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    Masculino
                  </button>
                </div>
              </div>

              {/* Setting 2: Children Eligibility (Feminino only) */}
              <div className={`space-y-3 transition-opacity duration-300 ${gender === 'Masculino' ? 'opacity-40 pointer-events-none' : 'opacity-100'}`}>
                <div className="flex justify-between items-center">
                  <label className="text-xs font-extrabold text-slate-500 uppercase tracking-wide block">
                    Tem filhos menores de 11 anos?
                  </label>
                  <span className="text-[10px] font-bold bg-petro-yellow text-petro-blue px-2 py-0.5 rounded leading-none">
                    AMPLIAÇÃO DE BOLSA
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => gender === 'Feminino' && setHasChildrenUnder11(true)}
                    className={`py-3 px-4 text-xs font-bold rounded-xl border transition-all text-center cursor-pointer ${
                      hasChildrenUnder11 && gender === 'Feminino'
                        ? 'bg-petro-green text-white border-petro-green shadow-sm'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    Sim, possuo dependentes
                  </button>
                  <button
                    onClick={() => gender === 'Feminino' && setHasChildrenUnder11(false)}
                    className={`py-3 px-4 text-xs font-bold rounded-xl border transition-all text-center cursor-pointer ${
                      !hasChildrenUnder11 && gender === 'Feminino'
                        ? 'bg-petro-green text-white border-petro-green shadow-sm'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    Não possuo
                  </button>
                </div>
                <p className="text-[11px] text-slate-400 leading-snug">
                  * No escopo social da Petrobras, mulheres chefes de família com crianças pequenas sob tutela herdam um ajuste financeiro maior para auxiliar com encargos de maternidade.
                </p>
              </div>

              {/* Setting 3: Commute / Class Days */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-slate-600 uppercase tracking-wide">
                  <span>Dias letivos no mês</span>
                  <span className="font-mono text-petro-green">{commuteDays} dias</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="26"
                  value={commuteDays}
                  onChange={(e) => setCommuteDays(Number(e.target.value))}
                  className="w-full h-2 bg-slate-255 rounded-lg appearance-none cursor-pointer accent-petro-green"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                  <span>Mínimo (10 dias)</span>
                  <span>Média Letiva (22 dias)</span>
                  <span>Máximo (26 dias)</span>
                </div>
              </div>
            </div>

            <div className="mt-8 bg-blue-50/50 p-4 rounded-xl border border-blue-100 flex items-start gap-3">
              <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
              <div className="text-[11px] text-slate-600 leading-normal">
                <strong>Critério de frequência:</strong> A bolsa é paga integralmente para alunos com presença mensal mínima de <strong>85%</strong>.
              </div>
            </div>
          </div>

          {/* Results Display Area (right 7 columns) */}
          <div className="lg:col-span-7 bg-petro-green/5 border border-petro-green/10 rounded-3xl p-6 lg:p-8 flex flex-col justify-between shadow-sm">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#005288]">Total Estimado de Recursos em Apoio</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-4xl lg:text-5xl font-black text-petro-blue">{totalFinancialValue.toLocaleString()}</span>
                <span className="text-lg font-bold text-slate-700">MZN / mês</span>
              </div>
              <p className="text-xs text-slate-500 mt-1 leading-normal">
                Valor representativo que combina a transferência de renda mensal líquida com subsídios alimentares e de deslocamento.
              </p>

              {/* Items Breakdown list */}
              <div className="space-y-4 mt-8">
                {/* 1. Monthly Stipend */}
                <div className="flex justify-between items-center p-4 bg-white rounded-xl border border-slate-100 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-green-50 text-petro-green flex items-center justify-center font-black text-sm">
                      $
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 leading-none">Bolsa-Auxílio Mensal Direta</h4>
                      <p className="text-[10px] text-slate-500 leading-none mt-1">
                        {isEligibleForWomanRate ? 'Taxa diferenciada: Mulher com filhos' : 'Taxa de enquadramento geral'}
                      </p>
                    </div>
                  </div>
                  <span className="font-extrabold text-sm text-petro-green">{finalStipend.toLocaleString()} MZN</span>
                </div>

                {/* 2. Transport cost covered */}
                <div className="flex justify-between items-center p-4 bg-white rounded-xl border border-slate-100 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-orange-50 text-orange-500 flex items-center justify-center font-bold text-sm">
                      🚌
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 leading-none">Subsídio de Deslocamento Diário</h4>
                      <p className="text-[10px] text-slate-500 leading-none mt-1">
                        Custeado por dia útil de aula ({dailyTransportValue} MZN/dia)
                      </p>
                    </div>
                  </div>
                  <span className="font-extrabold text-sm text-slate-700">{monthlyTransport.toLocaleString()} MZN</span>
                </div>

                {/* 3. Meals at IFPELAC */}
                <div className="flex justify-between items-center p-4 bg-white rounded-xl border border-slate-100 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-500 flex items-center justify-center font-bold text-sm">
                      🍛
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 leading-none">Alimentação Direta Equacionada</h4>
                      <p className="text-[10px] text-slate-500 leading-none mt-1">
                        Pratos quentes e lanche servidos no local ({dailyMealValue} MZN/dia)
                      </p>
                    </div>
                  </div>
                  <span className="font-extrabold text-sm text-slate-700">{monthlyMealValue.toLocaleString()} MZN</span>
                </div>
              </div>
            </div>

            {/* Extra Pack Benefit */}
            <div className="mt-8 pt-6 border-t border-slate-200">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">Também incluso no ato da matrícula (Custo zero):</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="p-3 bg-white rounded-xl border border-slate-100 text-center flex flex-col items-center justify-center">
                  <span className="text-lg">👕</span>
                  <span className="text-[10px] leading-snug font-bold text-slate-600 mt-1">Uniforme Oficial</span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-100 text-center flex flex-col items-center justify-center">
                  <span className="text-lg">🥾</span>
                  <span className="text-[10px] leading-snug font-bold text-slate-600 mt-1">Botas de Aço</span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-100 text-center flex flex-col items-center justify-center">
                  <span className="text-lg">🎒</span>
                  <span className="text-[10px] leading-snug font-bold text-slate-600 mt-1">Kit Escolar</span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-100 text-center flex flex-col items-center justify-center">
                  <span className="text-lg">🏗️</span>
                  <span className="text-[10px] leading-snug font-bold text-slate-600 mt-1">EPIs Completos</span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
