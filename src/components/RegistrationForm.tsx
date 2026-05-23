/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Check, ArrowRight, User, GraduationCap, MapPin, ClipboardList, Wallet, Printer, Search } from 'lucide-react';
import { COURSES, PROVINCES } from '../data';
import { Registration } from '../types';

interface RegistrationFormProps {
  preSelectedCourseId: string | null;
  onSuccess: (protocolNum: string) => void;
  setActiveSection: (sec: string) => void;
}

export default function RegistrationForm({ preSelectedCourseId, onSuccess, setActiveSection }: RegistrationFormProps) {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [successData, setSuccessData] = useState<Registration | null>(null);

  // Form Fields State
  const [fullName, setFullName] = useState('');
  const [birthday, setBirthday] = useState('');
  const [gender, setGender] = useState<'Masculino' | 'Feminino' | 'Outro'>('Feminino');
  const [biNumber, setBiNumber] = useState('');
  const [nuit, setNuit] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [province, setProvince] = useState('');
  const [district, setDistrict] = useState('');
  const [childUnder11, setChildUnder11] = useState(false);
  const [educationLevel, setEducationLevel] = useState('');
  const [courseId, setCourseId] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isVulnerable, setIsVulnerable] = useState(false);
  const [formErrors, setFormErrors] = useState<string[]>([]);

  // Apply pre-selected course automatically if navigated here with a choice
  useEffect(() => {
    if (preSelectedCourseId) {
      setCourseId(preSelectedCourseId);
      
      // Auto-populate first province that has this course of possible
      const match = PROVINCES.find(p => p.hubs.some(h => h.courses.includes(preSelectedCourseId)));
      if (match) {
        setProvince(match.name);
        // auto select first hub district
        const hub = match.hubs.find(h => h.courses.includes(preSelectedCourseId));
        if (hub) {
          setDistrict(hub.district);
        }
      }
    }
  }, [preSelectedCourseId]);

  // Available courses filtering based on chosen province
  const getCoursesForSelectedProvince = () => {
    if (!province) return COURSES;
    const provMatch = PROVINCES.find(p => p.name === province);
    if (!provMatch) return COURSES;
    
    // Union of all courses taught in this province's hubs
    const availableIds = new Set<string>();
    provMatch.hubs.forEach(hub => {
      hub.courses.forEach(id => availableIds.add(id));
    });

    return COURSES.filter(c => availableIds.has(c.id));
  };

  // Helper validation routines
  const validateStep1 = () => {
    const errors: string[] = [];
    if (!fullName.trim() || fullName.trim().split(' ').length < 2) {
      errors.push('Por favor, introduza o seu nome completo (Nome e Apelido).');
    }
    if (!birthday) {
      errors.push('Data de Nascimento é obrigatória.');
    } else {
      const birthYear = new Date(birthday).getFullYear();
      const currentYear = new Date().getFullYear();
      if (currentYear - birthYear < 16) {
        errors.push('A idade mínima para participar no programa é de 16 anos completos.');
      }
    }
    
    // BI mask checking in Moçambique (e.g. 12 digits followed by a letter)
    const biRaw = biNumber.replace(/\s+/g, '').toUpperCase();
    if (!biRaw || biRaw.length !== 13) {
      errors.push('O número do Bilhete de Identidade (BI) deve possuir exatamente 13 caracteres (12 dígitos + 1 letra no final).');
    }

    // NUIT checking (9 digits in Mozambique)
    const nuitRaw = nuit.replace(/\D/g, '');
    if (!nuitRaw || nuitRaw.length !== 9) {
      errors.push('O NUIT de Moçambique deve possuir exatamente 9 dígitos.');
    }

    // Phone checking (9 digits)
    const phoneRaw = phone.replace(/\D/g, '');
    if (!phoneRaw || phoneRaw.length !== 9) {
      errors.push('Telemóvel deve conter exatamente 9 dígitos numéricos.');
    } else if (!['82', '83', '84', '85', '86', '87', '89'].includes(phoneRaw.substring(0, 2))) {
      errors.push('Por favor insira um prefixo de telemóvel moçambicano válido (ex: 84..., 82..., 86...).');
    }

    setFormErrors(errors);
    return errors.length === 0;
  };

  const validateStep2 = () => {
    const errors: string[] = [];
    if (!province) {
      errors.push('Selecione a Província de residência.');
    }
    if (!district.trim()) {
      errors.push('Selecione ou digite o Distrito/Hub para o curso.');
    }
    if (!educationLevel) {
      errors.push('Indique as suas habilitações literárias atuais.');
    }

    setFormErrors(errors);
    return errors.length === 0;
  };

  const validateStep3 = () => {
    const errors: string[] = [];
    if (!courseId) {
      errors.push('Selecione o curso de sua preferência.');
    } else {
      // Validate academic requirement of selected course
      const selectedCourse = COURSES.find(c => c.id === courseId);
      if (selectedCourse) {
        if (selectedCourse.educationRequired.includes('9ª') && ['Menos de 7ª Classe', '7ª Classe Completa'].includes(educationLevel)) {
          errors.push(`O curso de ${selectedCourse.title} exige escolaridade mínima de ${selectedCourse.educationRequired}. A escolaridade inserida (${educationLevel}) não atende à exigência.`);
        }
        if (selectedCourse.educationRequired.includes('12ª') && educationLevel !== '12ª Classe Completa ou superior') {
          errors.push(`O curso de ${selectedCourse.title} exige escolaridade mínima de ${selectedCourse.educationRequired}.`);
        }
      }
    }
    if (!agreeToTerms) {
      errors.push('Deve aceitar os termos de compromisso de frequência.');
    }

    setFormErrors(errors);
    return errors.length === 0;
  };

  const handleNext = () => {
    setFormErrors([]);
    if (currentStep === 1) {
      if (validateStep1()) setCurrentStep(2);
    } else if (currentStep === 2) {
      if (validateStep2()) setCurrentStep(3);
    }
  };

  const handlePrev = () => {
    setFormErrors([]);
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep3()) return;

    // Build enrollment record
    const randomProtocol = `AR-MOZ-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    const newReg: Registration = {
      id: Math.random().toString(36).substring(2, 9),
      fullName,
      birthday,
      gender,
      biNumber: biNumber.toUpperCase(),
      nuit: nuit.replace(/\D/g, ''),
      phone,
      email: email || 'não_fornecido@cadastro.ar',
      province,
      district,
      childUnder11: gender === 'Feminino' && childUnder11,
      educationLevel,
      courseId,
      agreeToTerms,
      status: 'Em Processamento',
      registrationDate: new Date().toISOString().split('T')[0],
      protocolNumber: randomProtocol
    };

    // Store in LocalStorage
    try {
      const existing = localStorage.getItem('autonomia_renda_registrations');
      const list = existing ? JSON.parse(existing) : [];
      list.push(newReg);
      localStorage.setItem('autonomia_renda_registrations', JSON.stringify(list));
    } catch (e) {
      console.error('Error saving registration', e);
    }

    setSuccessData(newReg);
    setCurrentStep(4);
    onSuccess(randomProtocol);
  };

  return (
    <section className="py-12 bg-slate-50 min-h-[500px]">
      <div className="max-w-3xl mx-auto px-4">
        
        {/* Wizard Header Progress Bar */}
        {currentStep < 4 && (
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-black text-slate-800">Candidatura Online</h2>
              <span className="text-xs text-slate-400 font-bold uppercase">Passo {currentStep} de 3</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className={`h-1.5 rounded-full transition-all ${currentStep >= 1 ? 'bg-petro-green' : 'bg-slate-200'}`} />
              <div className={`h-1.5 rounded-full transition-all ${currentStep >= 2 ? 'bg-petro-green' : 'bg-slate-200'}`} />
              <div className={`h-1.5 rounded-full transition-all ${currentStep >= 3 ? 'bg-petro-green' : 'bg-slate-200'}`} />
            </div>

            {/* Stepper Titles for Accessibility */}
            <div className="flex justify-between text-[10px] text-slate-400 font-bold uppercase mt-2 font-mono">
              <span className={currentStep === 1 ? 'text-petro-green' : ''}>1. Pessoal</span>
              <span className={currentStep === 2 ? 'text-petro-green' : 'text-center'}>2. Local & Ensino</span>
              <span className={currentStep === 3 ? 'text-petro-green' : 'text-right'}>3. Curso</span>
            </div>
          </div>
        )}

        {/* Errors list if any */}
        {formErrors.length > 0 && (
          <div className="bg-red-50 border border-red-150 p-4 rounded-xl text-xs text-red-600 space-y-1 mb-6">
            <strong className="block font-bold">Por favor, acerte as pendências antes de prosseguir:</strong>
            {formErrors.map((err, i) => (
              <p key={i}>• {err}</p>
            ))}
          </div>
        )}

        {/* Inner Form content container */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-sm">
          
          <form onSubmit={handleFormSubmit} className="space-y-6">
            
            {/* STEP 1: Personal Data */}
            {currentStep === 1 && (
              <div className="space-y-5">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                  <User className="w-5 h-5 text-petro-green" />
                  <h3 className="font-bold text-slate-800 text-sm">Dados de Identificação Pessoal</h3>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wide block">Nome Completo (Conforme no BI)</label>
                  <input
                    type="text"
                    required
                    maxLength={100}
                    placeholder="ex. Peniel Mucavele"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-xs text-slate-800 focus:bg-white focus:border-petro-green focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-500 block">Data de Nascimento</label>
                    <input
                      type="date"
                      required
                      value={birthday}
                      onChange={(e) => setBirthday(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 focus:bg-white focus:border-petro-green focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-500 block">Gênero</label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value as any)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 focus:bg-white focus:border-petro-green focus:outline-none"
                    >
                      <option value="Feminino">Feminino</option>
                      <option value="Masculino">Masculino</option>
                      <option value="Outro">Outro / Prefiro não declarar</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-500 block">Bilhete de Identidade (BI)</label>
                    <input
                      type="text"
                      required
                      maxLength={13}
                      placeholder="ex. 110200384729A"
                      value={biNumber}
                      onChange={(e) => setBiNumber(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-xs font-mono text-slate-800 focus:bg-white focus:border-petro-green focus:outline-none"
                    />
                    <span className="text-[9px] text-slate-400">12 Números + 1 Letra Final Capitular (Moçambique)</span>
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-500 block">NUIT (Número Tributário)</label>
                    <input
                      type="text"
                      required
                      maxLength={9}
                      placeholder="ex. 149204392"
                      value={nuit}
                      onChange={(e) => setNuit(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-xs font-mono text-slate-800 focus:bg-white focus:border-petro-green focus:outline-none"
                    />
                    <span className="text-[9px] text-slate-400">Exatamente 9 dígitos numéricos moçambicanos</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-500 block">Telemóvel Principal</label>
                    <input
                      type="tel"
                      required
                      maxLength={15}
                      placeholder="ex. 84 123 4567"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-xs text-slate-800 focus:bg-white focus:border-petro-green focus:outline-none"
                    />
                    <span className="text-[9px] text-slate-400">Redes TMcel, Vodacom ou Movitel</span>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-500 block">Correio Eletrónico (Opcional)</label>
                    <input
                      type="email"
                      placeholder="ex. peniel@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-xs text-slate-800 focus:bg-white focus:border-petro-green focus:outline-none"
                    />
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-4">
                  <input
                    type="checkbox"
                    id="checkbox-vulnerable"
                    checked={isVulnerable}
                    onChange={(e) => setIsVulnerable(e.target.checked)}
                    className="w-4 h-4 rounded text-petro-green border-slate-300 focus:ring-petro-green mt-0.5"
                  />
                  <div className="text-[11px] text-slate-500 leading-normal select-none">
                    <label htmlFor="checkbox-vulnerable" className="font-bold text-slate-705 block mb-0.5">Declaração de Baixa Renda ou Vulnerabilidade</label>
                    Declaro, sob compromisso de honra, que o meu agregado familiar não possui capacidade financeira própria de custeio educacional superior e me enquadro no grupo prioritário de assistência social.
                  </div>
                </div>

                {gender === 'Feminino' && (
                  <div className="p-4 bg-petro-yellow/10 rounded-xl border border-petro-yellow/20 flex items-start gap-4 transition-all animate-fade-in">
                    <input
                      type="checkbox"
                      id="checkbox-kids"
                      checked={childUnder11}
                      onChange={(e) => setChildUnder11(e.target.checked)}
                      className="w-4 h-4 rounded text-petro-green border-petro-yellow mt-0.5 mt-1"
                    />
                    <div className="text-[11px] text-slate-700 leading-normal select-none">
                      <label htmlFor="checkbox-kids" className="font-extrabold block mb-0.5 text-slate-800">
                        Mulher Mãe / Tutora com filhos menores de 11 anos?
                      </label>
                      Marque esta opção se tiver sob seus cuidados diretos crianças dependentes menores de 11 anos. Isto habilitará o pleito pelo auxílio maternidade diferenciado no valor de <strong>10.500 MZN</strong> caso matriculada.
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* STEP 2: Geographic Hub and Education Level */}
            {currentStep === 2 && (
              <div className="space-y-5">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                  <MapPin className="w-5 h-5 text-petro-green" />
                  <h3 className="font-bold text-slate-800 text-sm">Residência e Equivalência Escolar</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-500 block">Província em Moçambique</label>
                    <select
                      value={province}
                      required
                      onChange={(e) => {
                        setProvince(e.target.value);
                        // Auto populate first district of that province
                        const match = PROVINCES.find(p => p.name === e.target.value);
                        if (match && match.hubs.length > 0) {
                          setDistrict(match.hubs[0].district);
                        } else {
                          setDistrict('');
                        }
                      }}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-xs text-slate-800 focus:bg-white focus:border-petro-green focus:outline-none"
                    >
                      <option value="">-- Selecionar --</option>
                      {PROVINCES.map((p) => (
                        <option key={p.id} value={p.name}>{p.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-500 block">Distrito / Centro IFPELAC</label>
                    <select
                      value={district}
                      required
                      onChange={(e) => setDistrict(e.target.value)}
                      disabled={!province}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-xs text-slate-800 focus:bg-white focus:border-petro-green focus:outline-none disabled:opacity-50"
                    >
                      <option value="">-- Selecionar distrito --</option>
                      {province && PROVINCES.find(p => p.name === province)?.hubs.map((hub) => (
                        <option key={hub.district} value={hub.district}>IFPELAC {hub.district} ({hub.institution.split(' - ')[1] || hub.district})</option>
                      ))}
                    </select>
                  </div>
                </div>

                {district && province && (
                  <div className="text-[11px] text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-100 italic leading-snug">
                    📍 <strong>Endereço de Validação Física:</strong> {
                    PROVINCES.find(p => p.name === province)?.hubs.find(h => h.district === district)?.address
                  }
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-500 block">Grau de Escolaridade Atual Mínimo Concluído</label>
                  <select
                    value={educationLevel}
                    required
                    onChange={(e) => setEducationLevel(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-xs text-slate-800 focus:bg-white focus:border-petro-green focus:outline-none"
                  >
                    <option value="">-- Selecionar --</option>
                    <option value="Menos de 7ª Classe">Menos de Escolaridade Básica (Não alfabetizado ou inferior a 7ª)</option>
                    <option value="7ª Classe Completa">7ª Classe Completa (Ensino Primário)</option>
                    <option value="9ª Classe Completa ou equivalente">9ª Classe Completa (Ensino Básico)</option>
                    <option value="12ª Classe Completa ou superior">12ª Classe Completa ou superior (Ensino Secundário Completo)</option>
                  </select>
                  <span className="text-[9px] text-slate-400">Insira fidedignamente pois o IFPELAC exigirá o certificado físico no ato de matrícula.</span>
                </div>
              </div>
            )}

            {/* STEP 3: Course Selection and Final Accord/Terms */}
            {currentStep === 3 && (
              <div className="space-y-5">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                  <ClipboardList className="w-5 h-5 text-petro-green" />
                  <h3 className="font-bold text-slate-800 text-sm">Escolha do Curso e Assinatura Eletrônica</h3>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-500 block">Curso de Candidatura (Disponíveis em {province || 'Moçambique'})</label>
                  <select
                    value={courseId}
                    required
                    onChange={(e) => setCourseId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-xs text-slate-800 focus:bg-white focus:border-petro-green focus:outline-none font-bold text-petro-green"
                  >
                    <option value="">-- Selecione o curso --</option>
                    {getCoursesForSelectedProvince().map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.title} ({c.duration}h) - Requisito: {c.educationRequired}
                      </option>
                    ))}
                  </select>
                  <span className="text-[9px] text-slate-400">Apenas cursos ativos no polo de {province} são listados.</span>
                </div>

                {courseId && (
                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2 leading-relaxed">
                    <h4 className="text-xs font-bold text-slate-700">Destaques da Formação selecionada:</h4>
                    <p className="text-[11px] text-slate-600 font-medium">
                      “{COURSES.find(c => c.id === courseId)?.description}”
                    </p>
                    <span className="inline-block text-[10px] font-bold bg-petro-green/10 text-petro-green px-2 py-0.5 rounded">
                      Carga total de aulas: {COURSES.find(c => c.id === courseId)?.duration} horas presenciais
                    </span>
                  </div>
                )}

                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="agree-attendance"
                      required
                      checked={agreeToTerms}
                      onChange={(e) => setAgreeToTerms(e.target.checked)}
                      className="w-4 h-4 rounded text-petro-green border-slate-300 mt-0.5"
                    />
                    <label htmlFor="agree-attendance" className="text-[11px] text-slate-500 leading-normal select-none cursor-pointer">
                      <strong>Termos de Compromisso Escolar:</strong> Declaro que possuo disponibilidade de tempo integral para as sessões, me comprometo a obter no mínimo <strong>85% de presença</strong> mensal nas aulas sob pena de desligamento automático do programa e perda do subsídio monetário moçambicano.
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation buttons inside Wizard */}
            {currentStep < 4 && (
              <div className="flex justify-between items-center pt-6 border-t border-slate-200 mt-10">
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="text-xs font-bold text-slate-600 border border-slate-200 hover:bg-slate-50 rounded-lg px-5 py-3 transition-all cursor-pointer"
                  >
                    Dígito Anterior
                  </button>
                ) : (
                  <div />
                )}

                {currentStep < 3 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="bg-petro-green hover:opacity-90 text-white font-bold text-xs rounded-lg px-6 py-3 flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    Próximo Passo
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="bg-petro-green hover:opacity-90 text-white font-extrabold text-xs rounded-lg px-8 py-3.5 shadow-md hover:shadow-lg transition-all cursor-pointer"
                  >
                    Finalizar Candidatura
                  </button>
                )}
              </div>
            )}

          </form>

          {/* STEP 4: Absolute Success & Protocol Printable Ticket layout */}
          {currentStep === 4 && successData && (
            <div className="space-y-8 py-4 animate-fade-in text-center sm:text-left">
              
              <div className="bg-petro-green/5 border border-petro-green/20 p-5 rounded-2xl flex flex-col sm:flex-row items-center gap-4">
                <div className="w-14 h-14 bg-petro-green rounded-full text-white flex items-center justify-center text-2xl shrink-0 font-bold">
                  ✓
                </div>
                <div>
                  <h3 className="text-sm md:text-base font-black text-petro-green leading-none">Candidatura Submetida com Sucesso!</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-normal">
                    O seu registro digital foi armazenado no banco local do IFPELAC. Guarde o seu número de comprovante protocolar para as fases de seleção presencial.
                  </p>
                </div>
              </div>

              {/* Printable Ticket Receipt */}
              <div id="enrolment-receipt" className="border-2 border-slate-200 rounded-2xl p-6 bg-slate-50/50 space-y-6 relative overflow-hidden text-left font-sans">
                {/* Decorative cutouts */}
                <div className="absolute top-1/2 -left-3 w-6 h-6 bg-white border border-slate-200 rounded-full -translate-y-1/2" />
                <div className="absolute top-1/2 -right-3 w-6 h-6 bg-white border border-slate-200 rounded-full -translate-y-1/2" />
                
                {/* Receipt Header */}
                <div className="flex justify-between items-start pb-4 border-b border-dashed border-slate-300">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase leading-none block">Comprovante de Pré-Inscrição</span>
                    <h4 className="text-xs font-black text-slate-800">PROGRAMA AUTONOMIA E RENDA</h4>
                    <span className="text-[9px] text-slate-500 block leading-none">Petrobras Moçambique • IFPELAC</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase block">Protocolo de Consulta</span>
                    <strong className="text-xs md:text-sm font-mono font-extrabold text-petro-green">{successData.protocolNumber}</strong>
                  </div>
                </div>

                {/* Receipt Details rows */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-medium text-slate-600">
                  <div className="space-y-0.5">
                    <span className="text-[9px] text-slate-400 block uppercase font-bold tracking-wider">Candidando</span>
                    <strong className="text-slate-800 font-semibold">{successData.fullName}</strong>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[9px] text-slate-400 block uppercase font-bold tracking-wider">DI / Bilhete Identidade</span>
                    <strong className="text-slate-800 font-mono">{successData.biNumber}</strong>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[9px] text-slate-400 block uppercase font-bold tracking-wider">Curso Reclamado</span>
                    <strong className="text-petro-green font-extrabold text-[12px]">{COURSES.find(c => c.id === successData.courseId)?.title}</strong>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[9px] text-slate-400 block uppercase font-bold tracking-wider">Equivalência Letiva</span>
                    <strong className="text-slate-800 font-semibold">{successData.educationLevel}</strong>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[9px] text-slate-400 block uppercase font-bold tracking-wider">Província / Centro Alocado</span>
                    <strong className="text-slate-800 font-semibold">{successData.province} - IFPELAC {successData.district}</strong>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[9px] text-slate-400 block uppercase font-bold tracking-wider">Previsão Letiva</span>
                    <strong className="text-slate-800 font-semibold">Ciclo Letivo 2º Semestre 2026</strong>
                  </div>
                </div>

                {/* Sub Benefit note on receipt */}
                <div className="bg-petro-green/5 border border-petro-green/10 p-4 rounded-xl flex items-center gap-3">
                  <span className="text-lg">💰</span>
                  <div className="text-[10px] text-slate-600 leading-relaxed">
                    <strong>Bolsa Habilitada:</strong> {successData.childUnder11 ? '10.500 MZN/mês (Mãe profissional com herança de dependência)' : '8.000 MZN/mês (Taxa Geral)'} • Sujeito à homologação de relatórios físicos de presença regular mínima.
                  </div>
                </div>

                {/* Receipt Footer */}
                <div className="text-center md:text-left text-[10px] text-slate-400 border-t border-dashed border-slate-300 pt-4 leading-normal font-medium">
                  • Apresente a cópia autenticada do BI, NUIT Moçambicano, e Certificado de Habilitações com esta via impressa/digital no posto físico da secretaria do IFPELAC de {successData.district} para homologação.
                </div>
              </div>

              {/* Action utilities */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button
                  onClick={() => window.print()}
                  className="bg-slate-800 hover:bg-slate-900 text-white font-semibold py-3 px-6 rounded-xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  Imprimir Comprovativo (PDF)
                </button>
                <button
                  onClick={() => setActiveSection('acompanhar')}
                  className="bg-white border border-slate-300 hover:border-slate-400 text-slate-700 font-bold py-3 px-6 rounded-xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  Ir para Painel de Acompanhamento
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </section>
  );
}
