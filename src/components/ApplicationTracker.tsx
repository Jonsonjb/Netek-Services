/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Search, Loader2, Calendar, MapPin, Award, CheckCircle2, Clock, AlertTriangle, FileText } from 'lucide-react';
import { COURSES } from '../data';
import { Registration } from '../types';
import { jsPDF } from 'jspdf';

export default function ApplicationTracker() {
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Registration | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Pre-seed some mock records under localStorage if empty so users can play with it out of the box
  useEffect(() => {
    try {
      const existing = localStorage.getItem('autonomia_renda_registrations');
      if (!existing) {
        const mockRecords: Registration[] = [
          {
            id: 'mock-1',
            fullName: 'Amélia Mucavele',
            birthday: '1999-04-12',
            gender: 'Feminino',
            biNumber: '110200384729A',
            nuit: '149204392',
            phone: '841234567',
            email: 'amelia.mucavele@gmail.com',
            province: 'Maputo Província',
            district: 'Matola',
            childUnder11: true,
            educationLevel: '12ª Classe Completa ou superior',
            courseId: 'desenvolvedor-fullstack',
            agreeToTerms: true,
            status: 'Pré-Selecionado',
            registrationDate: '2026-05-19',
            protocolNumber: 'AR-MOZ-2026-90218'
          },
          {
            id: 'mock-2',
            fullName: 'Jafar Chande',
            birthday: '1997-11-20',
            gender: 'Masculino',
            biNumber: '020194829104B',
            nuit: '293846194',
            phone: '869876543',
            email: 'jafar.chande@live.com',
            province: 'Cabo Delgado',
            district: 'Pemba',
            childUnder11: false,
            educationLevel: '9ª Classe Completa ou equivalente',
            courseId: 'soldador-est',
            agreeToTerms: true,
            status: 'Matriculado',
            registrationDate: '2026-05-15',
            protocolNumber: 'AR-MOZ-2026-38419'
          }
        ];
        localStorage.setItem('autonomia_renda_registrations', JSON.stringify(mockRecords));
      }
    } catch (e) {
      console.error('Error pre-seeding mock records', e);
    }
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    setResult(null);
    setHasSearched(true);

    // Simulate standard server/local query delay for realistic UI look
    setTimeout(() => {
      try {
        const queryClean = searchQuery.trim().replace(/\s+/g, '').toUpperCase();
        const existing = localStorage.getItem('autonomia_renda_registrations');
        const list: Registration[] = existing ? JSON.parse(existing) : [];

        // Match either biNumber or protocolNumber
        const matched = list.find(
          reg => reg.protocolNumber.toUpperCase() === queryClean || reg.biNumber.toUpperCase() === queryClean
        );
        
        if (matched) {
          setResult(matched);
        }
      } catch (err) {
        console.error('Failed to query registrations', err);
      } finally {
        setLoading(false);
      }
    }, 850);
  };

  const downloadPDFConfirmation = () => {
    if (!result) return;
    
    // Create modern PDF document
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // 1. Top Decorative Green Banner
    doc.setFillColor(0, 115, 62); // Petrobras Green Theme
    doc.rect(0, 0, 210, 14, 'F');

    // 2. Main Title & Heading
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(0, 115, 62);
    doc.text('PROGRAMA AUTONOMIA E RENDA', 20, 30);
    
    doc.setFontSize(10);
    doc.setTextColor(148, 163, 184);
    doc.text('CONVÊNIO TÉCNICO REGIDO PELA COOPERAÇÃO IFPELAC & PETROBRAS MOÇAMBIQUE', 20, 36);

    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.5);
    doc.line(20, 42, 190, 42);

    // Document Main Title
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(30, 41, 59);
    doc.text('COMPROVATIVO HOMOLOGADO DE INSCRIÇÃO', 20, 52);

    // Meta Data Box
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(100, 116, 139);
    doc.text(`NÚMERO DE COMPROVATIVO: ${result.protocolNumber}`, 20, 58);
    doc.text(`DATA DO EXPEDIENTE: ${result.registrationDate}`, 20, 63);

    // 3. Section: Personal Details Block (Fills background with light gray slate-50)
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.rect(20, 70, 170, 72, 'FD'); // background fill and border bounding box

    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(30, 41, 59);
    doc.text('I. DADOS PESSOAIS DO CANDIDATO', 25, 77);

    // Line beneath section header
    doc.setDrawColor(241, 245, 249);
    doc.line(25, 80, 185, 80);

    const labels = [
      ['NOME DO ESTUDANTE:', result.fullName],
      ['BILHETE DE IDENTIDADE:', result.biNumber],
      ['NÚMERO DO NUIT:', result.nuit || 'Dossiê Isento'],
      ['CANDIDATO PROVÍNCIA:', result.province],
      ['POLO EXCLUSIVO:', `IFPELAC - Distrito de ${result.district}`],
      ['ESCOLARIDADE DECLARADA:', result.educationLevel],
      ['TELEFONE CONTACTO:', result.phone],
      ['ENDEREÇO CORREIO:', result.email || 'Não Registado']
    ];

    let currentY = 86;
    doc.setFontSize(8.5);
    labels.forEach(([lbl, val]) => {
      doc.setFont('Helvetica', 'bold');
      doc.setTextColor(71, 85, 105);
      doc.text(lbl, 25, currentY);
      doc.setFont('Helvetica', 'normal');
      doc.setTextColor(15, 23, 42);
      doc.text(val, 75, currentY);
      currentY += 6.5;
    });

    // 4. Section: Registered Course
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(30, 41, 59);
    doc.text('II. CERTIFICAÇÃO E ENQUADRAMENTO ACADÉMICO', 20, 153);

    doc.setDrawColor(226, 232, 240);
    doc.line(20, 156, 190, 156);

    const matchedCourse = COURSES.find(c => c.id === result.courseId);
    const courseName = matchedCourse ? matchedCourse.title : 'Curso Técnico Industrial Avançado';
    const courseDuration = matchedCourse ? `${matchedCourse.duration} Horas Formativas` : 'Duração Padrão';
    const courseCategory = matchedCourse ? matchedCourse.category : 'Ensino Profissional';

    doc.setFontSize(8.5);
    
    doc.setFont('Helvetica', 'bold');
    doc.setTextColor(71, 85, 105);
    doc.text('ESPECIALIDADE ALOCADA:', 20, 163);
    doc.setFont('Helvetica', 'bold');
    doc.setTextColor(0, 115, 62);
    doc.text(courseName, 65, 163);

    doc.setFont('Helvetica', 'bold');
    doc.setTextColor(71, 85, 105);
    doc.text('DURAÇÃO CURSO:', 20, 170);
    doc.setFont('Helvetica', 'normal');
    doc.setTextColor(15, 23, 42);
    doc.text(courseDuration, 65, 170);

    doc.setFont('Helvetica', 'bold');
    doc.setTextColor(71, 85, 105);
    doc.text('CATEGORIA DO SETOR:', 20, 177);
    doc.setFont('Helvetica', 'normal');
    doc.setTextColor(15, 23, 42);
    doc.text(courseCategory, 65, 177);

    doc.setFont('Helvetica', 'bold');
    doc.setTextColor(71, 85, 105);
    doc.text('MODALIDADE INSTRUÇÃO:', 20, 184);
    doc.setFont('Helvetica', 'normal');
    doc.setTextColor(15, 23, 42);
    doc.text(`${result.educationLevel.toLowerCase().includes('completa') ? 'Presencial com Auxílio de Custo (8.000 / 10.500 MZN)' : 'Presencial Integral Gratuito'}`, 65, 184);

    // 5. Section: Legal Security Status and instructions
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(30, 41, 59);
    doc.text('III. DISPOSIÇÕES GERAIS E ATIVAÇÃO FINANCEIRA', 20, 196);
    doc.line(20, 199, 190, 199);

    doc.setFontSize(8);
    doc.setFont('Helvetica', 'bold');
    doc.setTextColor(4, 120, 87); // Green info tone
    doc.text(`ESTADO DA CANDIDATURA: ${result.status.toUpperCase()}`, 20, 205);

    const descText = result.status === 'Matriculado' 
      ? 'Parabéns! O seu processo físico foi completamente homologado. Tem o seu fardamento escolar, equipamento de proteção individual (EPI) de marca própria garantidos sem qualquer taxa. Apresente-se no polo respectivo para recolher as credenciais bancárias de apoio de subsistência.'
      : 'As suas informações estão pré-aprovadas. Deverá dirigir-se à secretaria acadêmica acompanhado deste boletim de comprovativo e suas cópias físicas até 15 de Outubro de 2026. A verificação do BI e Habilitações concluirá a sua vaga oficial.';

    doc.setFont('Helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    const splitDetails = doc.splitTextToSize(descText, 170);
    doc.text(splitDetails, 20, 210);

    // Decorative Yellow Bar
    doc.setFillColor(252, 211, 77); // Yellow Warning Accent Bar
    doc.rect(20, 228, 170, 12, 'F');
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(146, 64, 14); // Brown Text
    doc.text('AVISO DE SEGURANÇA E COMBATE A PROPINA: ESTE PORTAL E TODA A FORMAÇÃO SÃO 100% GRATUITOS.', 23, 235.5);

    // Footer signature and stamps
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text('EXPEDIDO ELETRONICAMENTE PELO PORTAL AUTONOMIA E RENDA MOÇAMBIQUE', 20, 258);
    doc.text(`CÓDIGO DE AUTENTICIDADE: COMPR-${result.biNumber.substring(0, 4)}-${result.protocolNumber.split('-')[3]}`, 20, 263);

    // Stamp circle
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.5);
    doc.circle(165, 260, 11, 'D');
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(5);
    doc.setTextColor(148, 163, 184);
    doc.text('VALIDADO', 165, 259.5, { align: 'center' });
    doc.text('IFPELAC', 165, 262.5, { align: 'center' });

    // Download saving trigger
    doc.save(`Comprovativo_Inscricao_${result.protocolNumber}.pdf`);
  };

  const getStatusLabelAttributes = (status: string) => {
    switch (status) {
      case 'Matriculado':
        return { bg: 'bg-green-100 text-green-800 border-green-200', label: 'Matriculado Concluído ✓' };
      case 'Pré-Selecionado':
        return { bg: 'bg-emerald-100 text-emerald-800 border-emerald-200 animate-pulse', label: 'Pré-Selecionado (Aprovado)' };
      case 'Suplente':
        return { bg: 'bg-yellow-105 text-yellow-805 border-yellow-250', label: 'Lista de Espera (Suplente)' };
      case 'Documentação Pendente':
        return { bg: 'bg-orange-100 text-orange-800 border-orange-200', label: 'Falta apresentar documentos físico' };
      default:
        return { bg: 'bg-blue-105 text-blue-805 border-blue-250', label: 'Em Processo de Análise' };
    }
  };

  return (
    <section className="py-12 bg-white" id="tracker-section">
      <div className="max-w-4xl mx-auto px-4">
        
        {/* Module Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-petro-green text-xs font-bold uppercase tracking-widest bg-petro-green/10 px-3 py-1 rounded-full">Secretaria Virtual</span>
          <h2 className="text-2xl font-black text-slate-800 mt-2.5">Acompanhar Inscrição</h2>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Consulte o estado de processamento da sua vaga. Insira o seu número de comprovante Protocolar ou o número do Bilhete de Identidade.
          </p>
        </div>

        {/* Search Panel box */}
        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 mb-8 shadow-inner">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4.5 h-4.5" />
              <input
                type="text"
                placeholder="Insira ex: AR-MOZ-2026-90218 ou 110200384729A"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white text-xs border border-slate-200 rounded-xl pl-11 pr-4 py-4 text-slate-800 focus:outline-none focus:border-petro-green font-semibold"
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="bg-petro-green hover:opacity-90 text-white font-bold px-6 py-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Pesquisando...
                </>
              ) : (
                'Consultar Dossier'
              )}
            </button>
          </form>

          {/* Quick instructions / seeded keys tip */}
          <div className="mt-3 flex gap-2 text-[10px] text-slate-400 font-medium">
            <span>💡 <strong>Dica rápida:</strong> Pode testar usando as chaves de simulação: </span>
            <span className="font-mono text-petro-green font-semibold">AR-MOZ-2026-90218</span> (Amélia) ou <span className="font-mono text-petro-green font-semibold">020194829104B</span> (Jafar).
          </div>
        </div>

        {/* Dynamic Display Results */}
        {hasSearched && !loading && (
          <div className="space-y-8 animate-fade-in text-left">
            {result ? (
              <div className="space-y-8">
                {/* Result header layout */}
                <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400 font-mono">Candidato Encontrado</span>
                    <h3 className="text-base font-extrabold text-slate-800">{result.fullName}</h3>
                    <div className="flex flex-wrap items-center gap-2 text-[10px] text-slate-400 font-medium pt-1">
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> Registado em: {result.registrationDate}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> Polo: IFPELAC {result.district}</span>
                    </div>
                  </div>

                  {/* Status Indicator pill */}
                  <div className="shrink-0 text-left md:text-right space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">Situação Atual</span>
                    <span className={`inline-block text-xs font-bold px-3 py-1.5 rounded-full border ${getStatusLabelAttributes(result.status).bg}`}>
                      {getStatusLabelAttributes(result.status).label}
                    </span>
                  </div>
                </div>

                {/* PDF Confirmation Action Banner */}
                <div className="bg-emerald-50/70 border border-emerald-500/15 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100/60 text-emerald-700 flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5 text-emerald-700" />
                    </div>
                    <div className="space-y-0.5 text-left">
                      <h4 className="text-xs font-bold text-slate-800">Comprovativo de Matrícula Oficial</h4>
                      <p className="text-[10px] text-slate-500 leading-normal">
                        Guarde uma cópia certificada do seu boletim de admissão no formato digital PDF para comprovação de dados.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={downloadPDFConfirmation}
                    className="w-full sm:w-auto shrink-0 bg-petro-green hover:opacity-95 text-white font-extrabold px-4.5 py-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
                  >
                    <FileText className="w-4 h-4" />
                    Baixar Comprovativo PDF
                  </button>
                </div>

                {/* Grid of dossier metrics */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
                  {/* Progress Timeline (8 columns) */}
                  <div className="md:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 space-y-5">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 pb-2 border-b border-slate-100 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-slate-400" /> Linha do Tempo da Candidatura
                    </h4>

                    {/* Stylised vertical node progress */}
                    <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
                      {/* Step 1 */}
                      <div className="relative">
                        <span className="absolute -left-6 top-0 w-4.5 h-4.5 rounded-full bg-green-500 border-2 border-white shadow-sm flex items-center justify-center text-[10px] text-white font-bold">✓</span>
                        <div className="text-xs">
                          <strong className="text-slate-800 font-bold block">1. Inscrição submetida com sucesso</strong>
                          <span className="text-[10px] text-slate-400 font-mono">{result.registrationDate} • Via Portal Online</span>
                        </div>
                      </div>

                      {/* Step 2 */}
                      <div className="relative">
                        <span className={`absolute -left-6 top-0 w-4.5 h-4.5 rounded-full border-2 border-white shadow-sm flex items-center justify-center text-[10px] text-white font-bold ${
                          ['Pré-Selecionado', 'Matriculado', 'Documentação Pendente'].includes(result.status)
                            ? 'bg-green-500'
                            : 'bg-yellow-500 animate-pulse'
                        }`}>
                          {['Pré-Selecionado', 'Matriculado', 'Documentação Pendente'].includes(result.status) ? '✓' : '●'}
                        </span>
                        <div className="text-xs">
                          <strong className="text-slate-800 font-bold block">2. Inquérito social e cruzamento de dados</strong>
                          <p className="text-[10px] text-slate-500 mt-0.5 leading-relaxed">Avaliação de conformidade de enquadramento (Baixa renda e cotas prioritárias).</p>
                        </div>
                      </div>

                      {/* Step 3 */}
                      <div className="relative">
                        <span className={`absolute -left-6 top-0 w-4.5 h-4.5 rounded-full border-2 border-white shadow-sm flex items-center justify-center text-[10px] text-white font-bold ${
                          result.status === 'Matriculado'
                            ? 'bg-green-500'
                            : result.status === 'Pré-Selecionado'
                            ? 'bg-orange-500 animate-pulse'
                            : 'bg-slate-200'
                        }`}>
                          {result.status === 'Matriculado' ? '✓' : '●'}
                        </span>
                        <div className="text-xs">
                          <strong className="text-slate-800 font-bold block">3. Homologação Física de Papéis e Matrícula</strong>
                          <p className="text-[10px] text-slate-500 mt-0.5 leading-relaxed">
                            {result.status === 'Matriculado' 
                              ? 'Documentos deferidos e aceites pela reitoria do IFPELAC.'
                              : 'Aguardando validação física dos comprovativos na secretaria do polo.'
                            }
                          </p>
                        </div>
                      </div>

                      {/* Step 4 */}
                      <div className="relative">
                        <span className={`absolute -left-6 top-0 w-4.5 h-4.5 rounded-full border-2 border-white shadow-sm flex items-center justify-center text-[10px] text-white font-bold ${
                          result.status === 'Matriculado' ? 'bg-green-500' : 'bg-slate-200'
                        }`}>
                          {result.status === 'Matriculado' ? '✓' : '●'}
                        </span>
                        <div className="text-xs">
                          <strong className="text-slate-800 font-bold block">4. Alocação de Auxílio Financeiro e Receção do Kit</strong>
                          <p className="text-[10px] text-slate-500 mt-0.5 leading-relaxed">Entrega dos uniformes oficiais, fardamento profissional, EPIs e abertura da conta bancária de recebimento dos 8.000 / 10.500 MZN.</p>
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* Validation Actions and documents Checklist (5 columns) */}
                  <div className="md:col-span-5 bg-slate-50 border border-slate-200 rounded-2xl p-6 flex flex-col justify-between space-y-5">
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 pb-2 border-b border-slate-200 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-slate-500" /> Pendências a Apresentar
                      </h4>
                      <p className="text-[10.5px] text-slate-500 leading-normal mt-2 mb-4">
                        Se selecionada, deve comparecer com as cópias físicas dos seguintes documentos na secretaria do IFPELAC local de <strong>{result.district}</strong>:
                      </p>

                      <div className="space-y-2.5">
                        <div className="flex items-center gap-2.5 text-xs text-slate-700 font-semibold bg-white p-2.5 rounded-xl border border-slate-200">
                          <input type="checkbox" defaultChecked={result.status === 'Matriculado'} disabled className="rounded text-petro-green" />
                          <span>Bilhete de Identidade (BI)</span>
                        </div>
                        <div className="flex items-center gap-2.5 text-xs text-slate-700 font-semibold bg-white p-2.5 rounded-xl border border-slate-200">
                          <input type="checkbox" defaultChecked={result.status === 'Matriculado'} disabled className="rounded text-petro-green" />
                          <span>Folha de NUIT impresso</span>
                        </div>
                        <div className="flex items-center gap-2.5 text-xs text-slate-700 font-semibold bg-white p-2.5 rounded-xl border border-slate-200">
                          <input type="checkbox" defaultChecked={false} disabled className="rounded text-petro-green" />
                          <span>Certificado de Habilitação Escolar</span>
                        </div>
                        <div className="flex items-center gap-2.5 text-xs text-slate-700 font-semibold bg-white p-2.5 rounded-xl border border-slate-200">
                          <input type="checkbox" defaultChecked={false} disabled className="rounded text-petro-green" />
                          <span>Declaração de Residência Bairro</span>
                        </div>
                      </div>
                    </div>

                    {result.status === 'Pré-Selecionado' && (
                      <div className="bg-petro-yellow/10 border border-petro-yellow/20 p-3.5 rounded-xl space-y-1.5 leading-snug">
                        <div className="flex items-center gap-2 font-extrabold text-[#d6b000] text-xs">
                          <AlertTriangle className="w-4 h-4" /> Comparecer até 15 de Outubro
                        </div>
                        <p className="text-[10px] text-slate-600 font-medium">
                          Evite cancelamento! Apresente-se física e pontualmente na secretaria para garantir sua homologação de conta bancária de bolsa.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            ) : (
              <div className="text-center py-12 bg-red-50/20 rounded-2xl border border-dashed border-red-200">
                <span className="text-3xl block mb-2">⚠️</span>
                <h3 className="text-xs font-bold text-slate-700">Inscrição Não Encontrada</h3>
                <p className="text-[11px] text-slate-500 max-w-sm mx-auto mt-1">
                  Não localizamos nenhuma candidatura correspondente a query "<strong>{searchQuery}</strong>". Verifique se houve algum digito incorreto e tente novamente.
                </p>
              </div>
            )}
          </div>
        )}

      </div>
    </section>
  );
}
