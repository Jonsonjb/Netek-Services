/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  MapPin, 
  Settings, 
  Award, 
  ArrowRight, 
  TrendingUp, 
  UserCheck, 
  Laptop, 
  GraduationCap, 
  ShieldCheck, 
  CheckCircle,
  Clock,
  Briefcase
} from 'lucide-react';

import Header from './components/Header';
import Hero from './components/Hero';
import BenefitCalculator from './components/BenefitCalculator';
import CourseSelectorQuiz from './components/CourseSelectorQuiz';
import CourseExplorer from './components/CourseExplorer';
import RegistrationForm from './components/RegistrationForm';
import ApplicationTracker from './components/ApplicationTracker';
import HubsList from './components/HubsList';
import FAQSection from './components/FAQSection';
import Footer from './components/Footer';
import SectorNews from './components/SectorNews';
import Testimonials from './components/Testimonials';
import { COURSES } from './data';

export default function App() {
  const [activeSection, setActiveSection] = useState<string>('sobre');
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);

  // When user clicks 'Inscrever-se' on a particular course card
  const handleApplyForCourse = (courseId: string) => {
    setSelectedCourseId(courseId);
    setActiveSection('inscricao');
    
    // Smooth scroll back to top of page/form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Callback from quiz results
  const handleSelectCourseFromQuiz = (courseId: string) => {
    setSelectedCourseId(courseId);
    setActiveSection('cursos');
    
    // Smooth scroll to courses section
    setTimeout(() => {
      document.getElementById('course-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const clearQuizSelection = () => {
    setSelectedCourseId(null);
  };

  const handleRegistrationCompleted = (protocol: string) => {
    // We can redirect them to tracker or keep them on success page inside registration wizard
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between font-sans selection:bg-petro-green selection:text-white">
      {/* Shared Header Navigation */}
      <Header activeSection={activeSection} setActiveSection={setActiveSection} />

      {/* Main Dynamically Rendered Content Container with Motion Transitions */}
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            {/* SCREEN 1: ABOUT / HOME LANDING */}
            {activeSection === 'sobre' && (
              <div className="space-y-16 pb-20">
                {/* Hero Section Banner */}
                <Hero onNavigate={setActiveSection} />

                {/* Subpage Section: Why This Matters / Context in Mozambique */}
                <section className="max-w-7xl mx-auto px-4 md:px-8">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    {/* Visual details column */}
                    <div className="lg:col-span-5 space-y-6">
                      <div className="p-3 bg-petro-green/10 text-petro-green w-12 h-12 rounded-2xl flex items-center justify-center">
                        <TrendingUp className="w-6 h-6" />
                      </div>
                      
                      <h3 className="text-2xl font-black text-slate-800 leading-tight">
                        Por que investir no Capital Humano de Moçambique?
                      </h3>
                      
                      <p className="text-slate-600 text-xs md:text-sm leading-relaxed">
                        Moçambique está a posicionar-se como o maior hub de exportação de Gás Natural Liquefeito (LNG) de África, através de megaprojetos na Bacia do Rovuma. Para garantir que este crescimento gere prosperidade local, o programa capacita gratuitamente os moçambicanos para ingressar nas multinacionais de energia e tecnologia de forma imediata.
                      </p>

                      <div className="space-y-3.5 pt-2">
                        <div className="flex items-start gap-2.5">
                          <CheckCircle className="w-4 h-4 text-petro-green shrink-0 mt-1" />
                          <span className="text-xs text-slate-700 font-semibold leading-normal">
                            Adequação das competências aos requisitos das subcontratadas (EPCs).
                          </span>
                        </div>
                        <div className="flex items-start gap-2.5">
                          <CheckCircle className="w-4 h-4 text-petro-green shrink-0 mt-1" />
                          <span className="text-xs text-slate-700 font-semibold leading-normal">
                            Transferência de tecnologia de excelência homologada pelo IFPELAC.
                          </span>
                        </div>
                        <div className="flex items-start gap-2.5">
                          <CheckCircle className="w-4 h-4 text-petro-green shrink-0 mt-1" />
                          <span className="text-xs text-slate-700 font-semibold leading-normal">
                            Redução sistemática de assimetrias regionais de empregabilidade.
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Bento grid layout parameters (right 7 columns) */}
                    <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {/* Grid Item 1 */}
                      <div className="bg-white border border-slate-200 p-6 rounded-3xl space-y-3 shadow-sm hover:shadow-md transition-all">
                        <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-lg">👩🏾‍🔧</div>
                        <h4 className="font-extrabold text-petro-green text-xs uppercase tracking-wider">Cotas de Gênero</h4>
                        <p className="text-xs text-slate-500 leading-normal">
                          Garantia mínima de <strong>50% de preenchimento</strong> de vagas para mulheres, promovendo igualdade de rendimentos no exigente setor industrial.
                        </p>
                      </div>

                      {/* Grid Item 2 */}
                      <div className="bg-white border border-slate-200 p-6 rounded-3xl space-y-3 shadow-sm hover:shadow-md transition-all">
                        <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-lg">💻</div>
                        <h4 className="font-extrabold text-amber-600 text-xs uppercase tracking-wider">Eixo Tecnologia</h4>
                        <p className="text-xs text-slate-500 leading-normal">
                          Do letramento digital ao desenvolvimento de software fullstack. Integração de jovens na nova economia cibernética global.
                        </p>
                      </div>

                      {/* Grid Item 3 */}
                      <div className="bg-white border border-slate-200 p-6 rounded-3xl space-y-3 shadow-sm hover:shadow-md transition-all">
                        <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-lg">🛡️</div>
                        <h4 className="font-extrabold text-blue-600 text-xs uppercase tracking-wider">Incentivos Frequência</h4>
                        <p className="text-xs text-slate-500 leading-normal">
                          Apoio à deslocação diária, fardamento profissional fornecido pela Petrobras e almoço quente servido diretamente no polo.
                        </p>
                      </div>

                      {/* Grid Item 4 */}
                      <div className="bg-white border border-slate-200 p-6 rounded-3xl space-y-3 shadow-sm hover:shadow-md transition-all">
                        <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-lg">🎓</div>
                        <h4 className="font-extrabold text-indigo-600 text-xs uppercase tracking-wider">Certificação ANEP</h4>
                        <p className="text-xs text-slate-500 leading-normal">
                          Exame final prático certificado pela Autoridade Nacional de Educação Profissional (ANEP), habilitante para todas multinacionais.
                        </p>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Subpage Section: Quick highlighted courses block */}
                <section className="bg-white py-14 border-t border-b border-slate-200">
                  <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-10">
                    <div className="text-center md:text-left space-y-2">
                      <span className="text-xs font-bold uppercase tracking-widest text-petro-green">Rotas Rápidas</span>
                      <h3 className="text-2xl font-black text-slate-800">Cursos com Maior Demanda em Moçambique</h3>
                      <p className="text-xs text-slate-500 max-w-lg mt-1">Algumas das carreiras técnicas industriais e digitais com vagas de contratação imediata nos polos nacionais:</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Highlight 1 */}
                      <div className="border border-slate-200 hover:border-slate-300 p-6 rounded-2xl bg-slate-50/50 flex flex-col justify-between hover:shadow-sm transition-all text-left">
                        <div className="space-y-3">
                          <span className="text-lg">⚡</span>
                          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Manutenção Industrial</h4>
                          <h5 className="font-extrabold text-petro-green text-sm leading-snug">Eletricista Industrial de Manutenção</h5>
                          <p className="text-xs text-slate-500 leading-relaxed font-normal">Capacitação avançada em esquemas e comandos em média e baixa tensão para subestações.</p>
                        </div>
                        <button 
                          onClick={() => handleApplyForCourse('eletricista-ind')} 
                          className="mt-6 text-petro-green font-semibold text-xs flex items-center gap-1.5 hover:underline cursor-pointer align-self-start"
                        >
                          Candidatar-se à vaga <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Highlight 2 */}
                      <div className="border border-slate-200 hover:border-slate-300 p-6 rounded-2xl bg-slate-50/50 flex flex-col justify-between hover:shadow-sm transition-all text-left">
                        <div className="space-y-3">
                          <span className="text-lg">🔥</span>
                          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Montagem Pesada</h4>
                          <h5 className="font-extrabold text-petro-green text-sm leading-snug">Soldador de Estruturas Industriais</h5>
                          <p className="text-xs text-slate-500 leading-relaxed font-normal">Foco prático total em soldagem em altura, arco revestido e processos MIG/MAG em juntas metálicas.</p>
                        </div>
                        <button 
                          onClick={() => handleApplyForCourse('soldador-est')} 
                          className="mt-6 text-petro-green font-semibold text-xs flex items-center gap-1.5 hover:underline cursor-pointer align-self-start"
                        >
                          Candidatar-se à vaga <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Highlight 3 */}
                      <div className="border border-slate-200 hover:border-slate-300 p-6 rounded-2xl bg-slate-50/50 flex flex-col justify-between hover:shadow-sm transition-all text-left">
                        <div className="space-y-3">
                          <span className="text-lg">💻</span>
                          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Nova Economia Digital</h4>
                          <h5 className="font-extrabold text-petro-green text-sm leading-snug">Desenvolvedor Web Full Stack</h5>
                          <p className="text-xs text-slate-500 leading-relaxed font-medium">Capacitação intensiva de software em Javascript, React, NodeJS e banco de dados relacionais.</p>
                        </div>
                        <button 
                          onClick={() => handleApplyForCourse('desenvolvedor-fullstack')} 
                          className="mt-6 text-petro-green font-semibold text-xs flex items-center gap-1.5 hover:underline cursor-pointer align-self-start"
                        >
                          Candidatar-se à vaga <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* View all courses button CTA */}
                    <div className="text-center pt-4">
                      <button
                        onClick={() => setActiveSection('cursos')}
                        className="bg-slate-800 hover:bg-slate-900 text-white font-bold px-6 py-3.5 rounded-xl text-xs transition-colors cursor-pointer"
                      >
                        Ver Catálogo Completo com {COURSES.length} Cursos
                      </button>
                    </div>
                  </div>
                </section>

                {/* Section: Sector News grounded on search */}
                <SectorNews 
                  onExploreCourse={handleApplyForCourse}
                  onNavigateToSection={setActiveSection}
                />

                {/* Section: Student Testimonials bento grid */}
                <Testimonials />
              </div>
            )}

            {/* SCREEN 2: COURSE EXPLORER DIRECTORY */}
            {activeSection === 'cursos' && (
              <CourseExplorer 
                onApplyForCourse={handleApplyForCourse}
                selectedCourseIdFromQuiz={selectedCourseId}
                clearQuizSelection={clearQuizSelection}
              />
            )}

            {/* SCREEN 3: BENEFIT STIPEND CALCULATOR */}
            {activeSection === 'calculadora' && (
              <BenefitCalculator />
            )}

            {/* SCREEN 4: VOCATIONAL ORIENTATION QUIZ */}
            {activeSection === 'orientador' && (
              <CourseSelectorQuiz onSelectCourse={handleSelectCourseFromQuiz} />
            )}

            {/* SCREEN 5: ONLINE REGISTRATION FORM */}
            {activeSection === 'inscricao' && (
              <RegistrationForm 
                preSelectedCourseId={selectedCourseId}
                onSuccess={handleRegistrationCompleted}
                setActiveSection={setActiveSection}
              />
            )}

            {/* SCREEN 6: DEEP PROTOCOL APPLICATION TRACKER */}
            {activeSection === 'acompanhar' && (
              <ApplicationTracker />
            )}

            {/* SCREEN 7: HUBS / HUBS MAP VISUALIZER */}
            {activeSection === 'centros' && (
              <HubsList onSelectCourse={handleSelectCourseFromQuiz} />
            )}

            {/* SCREEN 8: FAQ ACCORDION LIST */}
            {activeSection === 'faq' && (
              <FAQSection />
            )}

          </motion.div>
        </AnimatePresence>
      </main>

      {/* Shared Footer block */}
      <Footer onNavigate={setActiveSection} />
    </div>
  );
}
