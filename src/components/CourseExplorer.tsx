/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Search, Clock, GraduationCap, X, ChevronRight, CheckCircle2, Award, ArrowUpRight } from 'lucide-react';
import { COURSES } from '../data';
import { Course } from '../types';

interface CourseExplorerProps {
  onApplyForCourse: (courseId: string) => void;
  selectedCourseIdFromQuiz: string | null;
  clearQuizSelection: () => void;
}

export default function CourseExplorer({ onApplyForCourse, selectedCourseIdFromQuiz, clearQuizSelection }: CourseExplorerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('Todos');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  // Suggested keywords for search pills
  const suggestedSearchPills = [
    { label: '🔌 Elétrica', query: 'eletricista' },
    { label: '🔥 Soldadura', query: 'soldador' },
    { label: '☀️ Solar', query: 'solar' },
    { label: '⚙️ Mecânica', query: 'mecanico' },
    { label: '💻 Programação', query: 'programador' },
    { label: '🧱 Pedreiro', query: 'pedreiro' },
    { label: '🔍 Automação', query: 'instrumentista' },
    { label: '📊 Analista de Dados', query: 'dados' }
  ];

  // If a course was selected from external actions (like the quiz), open it or scroll to it
  useEffect(() => {
    if (selectedCourseIdFromQuiz) {
      const course = COURSES.find(c => c.id === selectedCourseIdFromQuiz);
      if (course) {
        setSelectedCourse(course);
        clearQuizSelection();
      }
    }
  }, [selectedCourseIdFromQuiz, clearQuizSelection]);

  const categories = ['Todos', 'Manutenção Industrial', 'Operações e Energia', 'Tecnologia', 'Construção e Logística'];

  // Enhanced intelligent search and ranking function
  const getFuzzyScoreAndMatch = (course: Course, query: string) => {
    if (!query.trim()) return { matches: true, score: 0 };
    
    // Split query by spaces and clean short terms
    const terms = query.toLowerCase().trim().split(/\s+/).filter(t => t.length > 1);
    if (terms.length === 0) return { matches: true, score: 0 };

    let score = 0;
    let matchedAny = false;

    // Convert fields to lowercase for easy matching
    const titleLower = course.title.toLowerCase();
    const categoryLower = course.category.toLowerCase();
    const descriptionLower = course.description.toLowerCase();
    const marketDemandLower = course.marketDemand.toLowerCase();
    const syllabusString = course.syllabus.join(' ').toLowerCase();
    const targetAudienceString = course.targetAudience.join(' ').toLowerCase();
    const prerequisitesLower = course.prerequisites.toLowerCase();
    const educationRequiredLower = course.educationRequired.toLowerCase();

    // Verify all search terms (or calculate a cumulative score)
    for (const term of terms) {
      let termMatched = false;
      
      if (titleLower.includes(term)) {
        score += 15;
        termMatched = true;
      }
      if (categoryLower.includes(term)) {
        score += 8;
        termMatched = true;
      }
      if (marketDemandLower.includes(term)) {
        score += 6;
        termMatched = true;
      }
      if (syllabusString.includes(term)) {
        score += 4;
        termMatched = true;
      }
      if (targetAudienceString.includes(term) || prerequisitesLower.includes(term)) {
        score += 3;
        termMatched = true;
      }
      if (descriptionLower.includes(term)) {
        score += 2;
        termMatched = true;
      }
      if (educationRequiredLower.includes(term)) {
        score += 1;
        termMatched = true;
      }

      if (termMatched) {
        matchedAny = true;
      }
    }

    return { matches: matchedAny, score };
  };

  // Process ranking and sorting base on search query
  const rankedCourses = COURSES.map(course => {
    const { matches, score } = getFuzzyScoreAndMatch(course, searchTerm);
    const matchesCategory = activeCategory === 'Todos' || course.category === activeCategory;
    return { course, matches, score, matchesCategory };
  });

  const filteredCourses = rankedCourses
    .filter(item => item.matches && item.matchesCategory)
    .sort((a, b) => b.score - a.score)
    .map(item => item.course);

  const getCategoryTheme = (category: string) => {
    switch (category) {
      case 'Manutenção Industrial':
        return { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-100', icon: '🔧' };
      case 'Operações e Energia':
        return { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-100', icon: '🔋' };
      case 'Tecnologia':
        return { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-100', icon: '💻' };
      case 'Construção e Logística':
        return { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-100', icon: '🏗️' };
      default:
        return { bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-200', icon: '✏️' };
    }
  };

  return (
    <section className="py-12 bg-white" id="course-section">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Section Title */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-10">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-widest text-petro-green bg-petro-green/10 px-3 py-1 rounded-full">Explore as Vagas</span>
            <h2 className="text-2xl md:text-3xl font-black text-slate-800 mt-2.5">Cursos Homologados Gratuitos</h2>
            <p className="text-xs md:text-sm text-slate-500 max-w-xl mt-1 leading-relaxed">
              Formações profissionais de alta densidade letiva estruturadas para atender os padrões internacionais exigidos pelas cadeias de suprimentos de petróleo, gás, geração de energia e mercados digitais.
            </p>
          </div>
          
          {/* Active stats counter */}
          <div className="bg-slate-50 border border-slate-100 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-500 shrink-0">
            Total de Cursos: <span className="font-extrabold text-petro-green">{COURSES.length} caminhos técnicos</span>
          </div>
        </div>

        {/* Filters and Search Bar Container */}
        <div className="space-y-4 mb-8">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 bg-slate-50/70 p-4 rounded-2xl border border-slate-100">
            
            {/* Search Box */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Pesquise por eletricista, programação, soldador..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white text-xs border border-slate-200 rounded-xl pl-10 pr-10 py-3.5 focus:border-petro-green focus:ring-1 focus:ring-offset-0 focus:outline-none"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer p-0.5 rounded-full hover:bg-slate-100"
                  title="Limpar pesquisa"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Directory Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto select-none py-1 lg:py-0">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-4 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                    activeCategory === category
                      ? 'bg-petro-green text-white shadow-sm'
                      : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

          </div>

          {/* Quick Search Pills */}
          <div className="flex flex-wrap items-center gap-2 text-[10px] text-slate-500 bg-white">
            <span className="font-bold text-slate-400 uppercase tracking-widest text-[9px]">Sugestões de Pesquisa:</span>
            {suggestedSearchPills.map((pill) => {
              const isActive = searchTerm.toLowerCase() === pill.query.toLowerCase();
              return (
                <button
                  key={pill.query}
                  type="button"
                  onClick={() => {
                    setSearchTerm(pill.query);
                    // Match suggestion, set category to "Todos" to allow full search discovery
                    setActiveCategory('Todos');
                  }}
                  className={`px-2.5 py-1 rounded-lg border text-[10px] font-bold cursor-pointer transition-all ${
                    isActive
                      ? 'bg-petro-green/15 text-petro-green border-petro-green/30'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
                  }`}
                >
                  {pill.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Course Grid */}
        {filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => {
              const theme = getCategoryTheme(course.category);
              const scoreMatch = getFuzzyScoreAndMatch(course, searchTerm);
              return (
                <div 
                  key={course.id} 
                  className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between hover:shadow-lg hover:border-slate-300 transition-all group"
                >
                  <div className="space-y-4">
                    
                    {/* Top Group Indicator */}
                    <div className="flex justify-between items-center">
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${theme.bg} ${theme.text} border ${theme.border}`}>
                        {theme.icon} {course.category}
                      </span>
                      {searchTerm && scoreMatch.score >= 12 ? (
                        <span className="text-[10px] bg-amber-500 text-white font-extrabold px-2 py-0.5 rounded-full flex items-center gap-0.5 animate-pulse select-none">
                          ⭐ Relevância Alta
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono text-slate-400 font-bold uppercase">{course.modality}</span>
                      )}
                    </div>

                    {/* Course Title */}
                    <h3 className="text-sm md:text-base font-extrabold text-slate-800 leading-snug group-hover:text-petro-green transition-colors line-clamp-1">
                      {course.title}
                    </h3>

                    {/* Brief description */}
                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
                      {course.description}
                    </p>

                    {/* Quick Specs Strip */}
                    <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded-xl text-[10px] text-slate-600 font-medium">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>Carga: <strong>{course.duration} horas</strong></span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <GraduationCap className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">Escolaridade: <strong>{course.educationRequired.includes('completa') ? course.educationRequired.split(' ')[0] : course.educationRequired}</strong></span>
                      </div>
                    </div>

                  </div>

                  {/* Operational Cards Bottom action CTA */}
                  <div className="flex gap-2 mt-6 pt-4 border-t border-slate-100">
                    <button
                      onClick={() => setSelectedCourse(course)}
                      className="flex-1 text-center bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold py-3 px-4 rounded-xl text-xs transition-all cursor-pointer"
                    >
                      Grade Curricular
                    </button>
                    <button
                      onClick={() => onApplyForCourse(course.id)}
                      className="bg-petro-green hover:opacity-90 text-white font-bold px-4 py-3 rounded-xl text-xs flex items-center justify-center gap-1 shadow-sm transition-all cursor-pointer grow-0"
                      title="Matricular-se neste curso"
                    >
                      Inscrever-se
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
            <span className="text-4xl text-slate-400 block mb-3">🔍</span>
            <h3 className="text-base font-bold text-slate-700">Nenhum curso encontrado para &quot;{searchTerm}&quot;</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-6">Refine seus termos de pesquisa, limpe os filtros de categorias ou tente selecionar uma de nossas sugestões rápidas.</p>
            
            <div className="max-w-4xl mx-auto border-t border-slate-200 pt-8 mt-6">
              <span className="text-[11px] uppercase font-extrabold text-slate-400 tracking-wider">Cursos recomendados para você</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                {COURSES.slice(0, 3).map((courseItem) => {
                  return (
                    <div 
                      key={courseItem.id}
                      onClick={() => {
                        setSearchTerm(courseItem.title);
                        setActiveCategory('Todos');
                      }}
                      className="bg-white p-5 rounded-2xl border border-slate-200 text-left hover:border-petro-green transition-all cursor-pointer group"
                    >
                      <span className="text-[10px] font-bold text-slate-400 block mb-1 uppercase tracking-wider">{courseItem.category}</span>
                      <h4 className="text-xs font-extrabold text-slate-800 group-hover:text-petro-green transition-colors truncate">{courseItem.title}</h4>
                      <p className="text-[10px] text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">{courseItem.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Slide-out Immersive Drawer (or Overlay Modal) */}
        {selectedCourse && (
          <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
            
            {/* Backdrop cover overlay */}
            <div 
              className="absolute inset-0 bg-slate-900/60 transition-opacity backdrop-blur-sm"
              onClick={() => setSelectedCourse(null)}
            />

            {/* Content Drawer Box */}
            <div className="relative w-full max-w-2xl bg-white h-full shadow-2xl overflow-y-auto flex flex-col justify-between z-10 animate-slide-in">
              <div>
                {/* Header block with category colored bar */}
                <div className={`py-6 px-6 md:px-8 border-b border-slate-100 flex justify-between items-start sticky top-0 bg-white z-10`}>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${getCategoryTheme(selectedCourse.category).bg} ${getCategoryTheme(selectedCourse.category).text}`}>
                        {getCategoryTheme(selectedCourse.category).icon} {selectedCourse.category}
                      </span>
                      <span className="text-[10px] bg-slate-100 text-slate-500 font-bold px-2 py-0.5 rounded uppercase leading-none">{selectedCourse.modality}</span>
                    </div>
                    <h3 className="text-base md:text-lg font-extrabold text-slate-800 leading-snug">{selectedCourse.title}</h3>
                  </div>
                  
                  <button
                    onClick={() => setSelectedCourse(null)}
                    className="p-1 rounded-full text-slate-400 hover:text-slate-800 hover:bg-slate-100 mt-1 cursor-pointer"
                  >
                    <X className="w-5.5 h-5.5" />
                  </button>
                </div>

                {/* Body details scroll container */}
                <div className="p-6 md:p-8 space-y-8">
                  
                  {/* description block */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Sobre o Curso</h4>
                    <p className="text-xs md:text-sm text-slate-600 leading-relaxed bg-slate-50/50 p-4 rounded-xl border border-slate-100">{selectedCourse.description}</p>
                  </div>

                  {/* Detailed specs strip */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <div className="bg-slate-50 p-3.5 rounded-xl">
                      <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Carga Letiva</span>
                      <strong className="text-sm font-black text-slate-700 mt-1 block">{selectedCourse.duration} Horas letivas</strong>
                    </div>
                    <div className="bg-slate-50 p-3.5 rounded-xl">
                      <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Requisito Literário</span>
                      <strong className="text-sm font-black text-slate-700 mt-1 block truncate" title={selectedCourse.educationRequired}>
                        {selectedCourse.educationRequired}
                      </strong>
                    </div>
                    <div className="bg-slate-50 p-3.5 rounded-xl col-span-2 sm:col-span-1">
                      <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Preços e Taxas</span>
                      <strong className="text-sm font-black text-petro-green mt-1 block">100% Gratuito (Isento)</strong>
                    </div>
                  </div>

                  {/* Syllabus/Grade Curricular */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-petro-green" />
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">Módulos de Formação (Syllabus)</h4>
                    </div>
                    <div className="space-y-2.5">
                      {selectedCourse.syllabus.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
                          <CheckCircle2 className="w-4 h-4 text-petro-green shrink-0 mt-0.5" />
                          <span>Módulo {idx + 1}: <strong>{item}</strong></span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Specific Mozambique Context */}
                  <div className="bg-emerald-50/40 p-5 rounded-2xl border border-petro-green/10 space-y-2">
                    <h4 className="text-xs font-extrabold text-petro-green uppercase tracking-wider">Demanda e Oportunidades em Moçambique</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {selectedCourse.marketDemand}
                    </p>
                  </div>

                  {/* Prerequisites details */}
                  <div className="space-y-2 text-xs">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Requisitos de Ingresso</h4>
                    <p className="text-slate-600 leading-normal">
                      • {selectedCourse.prerequisites} <br />
                      • Residência comprovada nas províncias que fornecem o curso <br />
                      • Registro legal de identidade ativa (BI válido)
                    </p>
                  </div>

                </div>
              </div>

              {/* Bottom Sticky Action CTAs inside drawer */}
              <div className="p-6 md:px-8 border-t border-slate-100 bg-slate-50/80 sticky bottom-0 z-10 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setSelectedCourse(null)}
                  className="flex-1 text-center bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold py-3.5 rounded-xl text-xs transition-all cursor-pointer"
                >
                  Voltar à Listagem
                </button>
                <button
                  onClick={() => {
                    const id = selectedCourse.id;
                    setSelectedCourse(null);
                    onApplyForCourse(id);
                  }}
                  className="flex-1 text-center bg-petro-green hover:opacity-90 text-white font-bold py-3.5 rounded-xl text-xs shadow-lg shadow-petro-green/15 transition-all text-sm cursor-pointer"
                >
                  Aplicar para Vaga Grátis
                </button>
              </div>

            </div>

          </div>
        )}

      </div>
    </section>
  );
}
