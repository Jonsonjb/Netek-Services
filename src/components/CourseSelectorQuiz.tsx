/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { HelpCircle, ChevronRight, RotateCcw, Award, CheckCircle, ArrowRight, BookOpen } from 'lucide-react';
import { COURSES } from '../data';
import { Course } from '../types';

export default function CourseSelectorQuiz({ onSelectCourse }: { onSelectCourse: (courseId: string) => void }) {
  const [step, setStep] = useState<number>(0); // 0 = Intro, 1-3 = Questions, 4 = Results
  const [answers, setAnswers] = useState<Record<number, string>>({});

  const questions = [
    {
      id: 1,
      title: 'Que tipo de atividade prática no dia a dia faz os seus olhos brilharem?',
      options: [
        { key: 'A', text: 'Trabalhar em campo montando, cortando metais, ajustando peças e soldando estruturas.' },
        { key: 'B', text: 'Entender circuitos elétricos, esquemas de energia e automação de máquinas hidráulicas.' },
        { key: 'C', text: 'Solucionar problemas complexos usando o computador, desenhando sites ou analisando relatórios de negócios.' },
        { key: 'D', text: 'Organizar documentos físicos/lógicos, usar planilhas de controlo e aprender informática do zero.' }
      ]
    },
    {
      id: 2,
      title: 'Qual é a sua habilitação literária máxima alcançada (ou aproximada)?',
      options: [
        { key: 'A', text: 'Ensino Primário Completo (ou até a 7ª Classe)' },
        { key: 'B', text: 'Ensino Básico Geral Concluído (9ª Classe ou de 9ª a 11ª Classe)' },
        { key: 'C', text: 'Ensino Secundário Completo (12ª Classe Completa / Instituto Comercial-Industrial)' }
      ]
    },
    {
      id: 3,
      title: 'Qual é o seu objetivo imediato ao concluir este curso profissional?',
      options: [
        { key: 'A', text: 'Empregar-me rapidamente nas indústrias petroquímicas e portuárias das províncias (mão de obra física e técnica).' },
        { key: 'B', text: 'Construir uma carreira independente, prestando serviços técnicos especializados no setor elétrico ou industrial.' },
        { key: 'C', text: 'Inserir-me no setor corporativo administrativo ou financeiro internacional.' },
        { key: 'D', text: 'Trabalhar com startups tecnológicas, programar sistemas, websites e inteligência de negócios digital.' }
      ]
    }
  ];

  const handleSelectOption = (optionKey: string) => {
    const currentQuestionId = step;
    setAnswers(prev => ({ ...prev, [currentQuestionId]: optionKey }));
    
    if (step < questions.length) {
      setStep(prev => prev + 1);
    }
  };

  const handleReset = () => {
    setStep(1);
    setAnswers({});
  };

  // Logic to score and match courses
  const getRecommendedCourses = (): { course: Course; matchScore: number }[] => {
    const scored = COURSES.map(course => {
      let score = 50; // base score

      const q1 = answers[1];
      const q2 = answers[2];
      const q3 = answers[3];

      // Q1 Match -> Interesses
      if (q1 === 'A') { // Industrial Pesado
        if (['soldador-est', 'mecanico-manut', 'caldeireiro-ind', 'instalador-tubulacao', 'montador-andaimes'].includes(course.id)) {
          score += 25;
        }
      } else if (q1 === 'B') { // Eletro-instrumentação
        if (['eletricista-ind', 'instrumentista-ind', 'aux-operacoes'].includes(course.id)) {
          score += 25;
        }
      } else if (q1 === 'C') { // Dev / Data
        if (['desenvolvedor-fullstack', 'analista-dados'].includes(course.id)) {
          score += 30;
        }
      } else if (q1 === 'D') { // Letramento
        if (course.id === 'letramento-dig') {
          score += 40;
        }
      }

      // Q2 Match -> Escolaridade (Crucial)
      if (q2 === 'A') { // até 7ª
        if (course.educationRequired.includes('Primário') || course.educationRequired.includes('7ª')) {
          score += 20;
        } else if (course.educationRequired.includes('12ª') || course.educationRequired.includes('10ª')) {
          score -= 40; // filter high academic requirements down
        }
      } else if (q2 === 'B') { // 9ª Classe
        if (course.educationRequired.includes('9ª') || course.educationRequired.includes('10ª')) {
          score += 25;
        } else if (course.educationRequired.includes('12ª')) {
          score -= 20;
        }
      } else if (q2 === 'C') { // 12ª Classe
        if (course.educationRequired.includes('12ª') || course.educationRequired.includes('10ª')) {
          score += 25;
        }
      }

      // Q3 Match -> Objetivos
      if (q3 === 'A') { // Indústria Física
        if (['soldador-est', 'mecanico-manut', 'caldeireiro-ind', 'aux-operacoes', 'montador-andaimes'].includes(course.id)) {
          score += 15;
        }
      } else if (q3 === 'B') { // Serviços Especializados Autônomos
        if (['eletricista-ind', 'instrumentista-ind', 'instalador-tubulacao'].includes(course.id)) {
          score += 15;
        }
      } else if (q3 === 'C') { // Admin/Corporate
        if (['letramento-dig', 'analista-dados'].includes(course.id)) {
          score += 15;
        }
      } else if (q3 === 'D') { // Tech/Web
        if (['desenvolvedor-fullstack', 'analista-dados'].includes(course.id)) {
          score += 20;
        }
      }

      // Cap match scores at 98% and floor at 30%
      const matchScore = Math.max(30, Math.min(98, score));

      return { course, matchScore };
    });

    // Sort descending by score
    return scored.sort((a, b) => b.matchScore - a.matchScore).slice(0, 3);
  };

  return (
    <section className="py-12 bg-slate-50 border-t border-b border-slate-100">
      <div className="max-w-4xl mx-auto px-4">
        
        {/* Module Title */}
        <div className="text-center mb-8">
          <span className="text-petro-green text-xs font-bold uppercase tracking-widest bg-petro-green/10 px-3 py-1 rounded-full inline-block mb-2">
            Aconselhamento de Carreira
          </span>
          <h2 className="text-2xl font-black text-slate-800">Orientador Vocacional Rápido</h2>
          <p className="text-xs text-slate-500 max-w-lg mx-auto mt-2">
            Responda a 3 perguntas simples e descubra quais qualificações se encaixam perfeitamente com a sua escolaridade e ambições em Moçambique.
          </p>
        </div>

        {/* Quiz Container Box */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-sm">
          
          {/* STEP 0: Introduction */}
          {step === 0 && (
            <div className="text-center space-y-6 py-6">
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center text-3xl mx-auto">
                🧭
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-slate-800">Não tem certeza de qual curso escolher?</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                  O nosso sistema de afinidades profissionais analisa o seu perfil acadêmico de ensino e as suas preferências práticas de trabalho quotidiano para sugerir as trilhas de maior rendimento e empregabilidade para si.
                </p>
              </div>

              <button
                onClick={() => setStep(1)}
                className="inline-flex items-center gap-2 bg-petro-green hover:opacity-90 text-white font-bold px-6 py-3.5 rounded-xl text-xs shadow-md transition-all cursor-pointer"
              >
                Começar Teste Rápido
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* STEP 1 to 3: Active Questions */}
          {step > 0 && step <= questions.length && (
            <div className="space-y-6">
              {/* Progress Tracker */}
              <div className="flex justify-between items-center text-xs text-slate-400 font-mono">
                <span>QUESTÃO {step} DE {questions.length}</span>
                <span>{Math.round((step / questions.length) * 100)}% COMPLETO</span>
              </div>
              
              {/* Visual Progress Bar */}
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-petro-green h-full transition-all duration-300"
                  style={{ width: `${(step / questions.length) * 100}%` }}
                />
              </div>

              {/* Question Title */}
              <h3 className="text-sm md:text-base font-extrabold text-slate-800 leading-snug">
                {questions[step - 1].title}
              </h3>

              {/* Options Grid */}
              <div className="space-y-3">
                {questions[step - 1].options.map((option) => (
                  <button
                    key={option.key}
                    onClick={() => handleSelectOption(option.key)}
                    className="w-full text-left p-4 rounded-2xl border border-slate-200 hover:border-petro-green hover:bg-petro-green/5 transition-all cursor-pointer group flex items-start gap-3"
                  >
                    <div className="w-6 h-6 rounded-lg bg-slate-100 text-slate-500 font-bold text-xs flex items-center justify-center group-hover:bg-petro-green group-hover:text-white transition-all shrink-0">
                      {option.key}
                    </div>
                    <span className="text-xs text-slate-700 font-medium group-hover:text-slate-900 leading-relaxed pt-0.5">
                      {option.text}
                    </span>
                  </button>
                ))}
              </div>

              {/* Footer status buttons */}
              <div className="flex justify-start text-[11px] text-slate-400 font-mono mt-4 pt-4 border-t border-slate-100">
                <span>* Selecione a opção que melhor retrata a sua realidade atual.</span>
              </div>
            </div>
          )}

          {/* STEP 4: Results Showcase */}
          {step > questions.length && (
            <div className="space-y-6">
              <div className="text-center pb-4 border-b border-slate-100">
                <div className="inline-block p-2 bg-petro-green/10 rounded-xl text-petro-green mb-1 font-bold">
                  <CheckCircle className="w-8 h-8 mx-auto" />
                </div>
                <h3 className="text-lg font-black text-slate-800">Cursos de Maior Afinidade Encontrados!</h3>
                <p className="text-xs text-slate-500 mt-1">Conforme as suas habilitações literárias e preferências práticas, aqui estão suas melhores escolhas:</p>
              </div>

              {/* Recommendations list */}
              <div className="space-y-4">
                {getRecommendedCourses().map(({ course, matchScore }, idx) => (
                  <div 
                    key={course.id}
                    className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-5 rounded-2xl border border-slate-200 bg-gradient-to-r from-white to-slate-50/50 hover:shadow-md transition-all"
                  >
                    <div className="space-y-1.5 max-w-xl">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          idx === 0 ? 'bg-petro-yellow text-slate-800' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {idx === 0 ? 'Melhor Afinidade' : `Opção ${idx + 1}`}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{course.category}</span>
                      </div>
                      <h4 className="text-xs md:text-sm font-extrabold text-slate-800">{course.title}</h4>
                      <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{course.description}</p>
                      
                      <div className="flex items-center gap-3 text-[10px] text-slate-400 font-medium pt-1">
                        <span>Requisito: <strong>{course.educationRequired}</strong></span>
                        <span>•</span>
                        <span>Duração: <strong>{course.duration}h</strong></span>
                      </div>
                    </div>

                    {/* Score badge & Navigate CTA */}
                    <div className="flex md:flex-col items-end gap-3 justify-between w-full md:w-auto shrink-0 pt-2 border-t border-slate-100 md:border-t-0">
                      <div className="text-right">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block leading-none">Grau de Sintonia</span>
                        <span className="text-xl font-black text-petro-green">{matchScore}%</span>
                      </div>
                      
                      <button
                        onClick={() => onSelectCourse(course.id)}
                        className="bg-petro-green hover:opacity-90 text-white text-[11px] font-bold py-2 px-4 rounded-lg flex items-center gap-1 shadow-sm shrink-0 transition-all cursor-pointer"
                      >
                        Mais Detalhes
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>

                  </div>
                ))}
              </div>

              {/* Reset CTA */}
              <div className="flex justify-center pt-4 border-t border-slate-100">
                <button
                  onClick={handleReset}
                  className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 bg-slate-100 px-4 py-2.5 rounded-xl cursor-pointer transition-all"
                >
                  <RotateCcw className="w-4 h-4" />
                  Efetuar Novo Teste
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </section>
  );
}
