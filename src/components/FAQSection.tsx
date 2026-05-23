/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Search, FileText, Wallet, Globe, X } from 'lucide-react';
import { FAQS } from '../data';
import { motion, AnimatePresence } from 'motion/react';

export default function FAQSection() {
  const [activeCategory, setActiveCategory] = useState<'Todos' | 'Geral' | 'Inscrições' | 'Bolsas e Auxílios' | 'Moçambique'>('Todos');
  const [openFaqId, setOpenFaqId] = useState<string | null>('faq-1'); // Have the first one open by default
  const [searchTerm, setSearchTerm] = useState('');

  const categories = [
    { id: 'Todos', label: 'Todos', icon: HelpCircle },
    { id: 'Geral', label: 'Geral', icon: HelpCircle },
    { id: 'Inscrições', label: 'Inscrições', icon: FileText },
    { id: 'Bolsas e Auxílios', label: 'Bolsas e Auxílios', icon: Wallet },
    { id: 'Moçambique', label: 'Moçambique', icon: Globe },
  ] as const;

  const getFaqCount = (category: string) => {
    if (category === 'Todos') return FAQS.length;
    return FAQS.filter(faq => faq.category === category).length;
  };

  const filteredFaqs = FAQS.filter(faq => {
    const matchesCategory = activeCategory === 'Todos' || faq.category === activeCategory;
    const matchesSearch = 
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleFaq = (id: string) => {
    setOpenFaqId(prev => (prev === id ? null : id));
  };

  const handleResetSearch = () => {
    setSearchTerm('');
    setActiveCategory('Todos');
    setOpenFaqId('faq-1');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.04
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 8 },
    show: { opacity: 1, y: 0, transition: { duration: 0.25, ease: 'easeOut' } }
  };

  return (
    <section className="py-12 bg-white" id="faq-section">
      <div className="max-w-4xl mx-auto px-4">
        
        {/* Module Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-petro-green bg-petro-green/10 px-3 py-1.5 rounded-full">Suporte ao Candidato</span>
          <h2 className="text-2xl font-black text-slate-800 mt-2.5">Dúvidas Frequentes</h2>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Tem alguma dúvida sobre os auxílios financeiros em Meticais, regras de presença ou documentos escolares? Encontre as respostas rápidas abaixo.
          </p>
        </div>

        {/* Interactive Search Bar */}
        <div className="max-w-md mx-auto mb-8 relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Pesquise por palavras-chave (ex: bolsa, BI, presença)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9.5 pr-9 py-2.5 text-xs font-semibold text-slate-700 placeholder:text-slate-400 rounded-xl border border-slate-200 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-petro-green/20 focus:border-petro-green focus:bg-white transition-all shadow-2xs"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
              title="Limpar campo de pesquisa"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Categories Tab Selector (High-Fidelity Chips) */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8 select-none overflow-x-auto py-1.5 max-w-3xl mx-auto">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const count = getFaqCount(cat.id);
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCategory(cat.id);
                  // Auto-open first visible FAQ when changing category to provide intuitive context
                  const matching = FAQS.filter(f => cat.id === 'Todos' || f.category === cat.id);
                  if (matching.length > 0) {
                    setOpenFaqId(matching[0].id);
                  } else {
                    setOpenFaqId(null);
                  }
                }}
                className={`relative px-4 py-2.5 text-xs font-extrabold rounded-xl transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 border shadow-2xs ${
                  isActive
                    ? 'bg-slate-800 text-white border-slate-800 shadow-xs'
                    : 'bg-white hover:bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{cat.label}</span>
                <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-md font-bold ${
                  isActive 
                    ? 'bg-white/20 text-white' 
                    : 'bg-slate-100 text-slate-500'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* FAQs Accordion Grid */}
        <div className="max-w-3xl mx-auto min-h-[160px]">
          {filteredFaqs.length > 0 ? (
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="space-y-3.5"
            >
              {filteredFaqs.map((faq) => {
                const isOpen = openFaqId === faq.id;
                return (
                  <motion.div 
                    key={faq.id}
                    variants={itemVariants}
                    layout="position"
                    className={`border rounded-2xl transition-all duration-300 overflow-hidden ${
                      isOpen 
                        ? 'border-petro-green bg-petro-green/[0.015] shadow-xs' 
                        : 'border-slate-200 bg-white hover:border-slate-300 shadow-2xs'
                    }`}
                  >
                    {/* Accordion Toggle Trigger Box */}
                    <button
                      onClick={() => toggleFaq(faq.id)}
                      className="w-full text-left px-5 py-4.5 flex justify-between items-center gap-4 cursor-pointer"
                    >
                      <div className="flex items-start gap-3">
                        <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs shrink-0 mt-0.5 transition-colors ${
                          isOpen ? 'bg-petro-green/10 text-petro-green font-bold' : 'bg-slate-50 text-slate-500'
                        }`}>
                          ❓
                        </span>
                        <span className={`text-xs md:text-sm font-bold transition-colors leading-snug ${
                          isOpen ? 'text-petro-green font-extrabold' : 'text-slate-800 font-bold'
                        }`}>
                          {faq.question}
                        </span>
                      </div>
                      
                      {/* Rotating Chevron icon */}
                      <span className={`shrink-0 transition-transform duration-300 ${
                        isOpen ? 'text-petro-green rotate-180' : 'text-slate-400'
                      }`}>
                        <ChevronDown className="w-4 h-4" />
                      </span>
                    </button>

                    {/* Collapsible Answer Pane with react-motion for smooth transition */}
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2, ease: "easeInOut" }}
                        >
                          <div className="px-5 pb-5 pt-1 text-xs md:text-sm text-slate-600 leading-relaxed border-t border-slate-100/50 font-medium pl-14 pr-6 whitespace-pre-line">
                            {faq.answer}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-50 border border-dashed border-slate-200 rounded-2xl p-10 text-center flex flex-col items-center justify-center space-y-3 shadow-2xs"
            >
              <span className="text-3xl text-slate-400">🔍</span>
              <h4 className="text-sm font-bold text-slate-700">Nenhum resultado encontrado</h4>
              <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
                Não conseguimos encontrar nenhuma dúvida que corresponda à sua pesquisa <strong className="text-slate-700">&quot;{searchTerm}&quot;</strong> na categoria selecionada.
              </p>
              <button
                onClick={handleResetSearch}
                className="mt-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-705 font-bold px-4 py-2 rounded-xl text-xs transition-all cursor-pointer shadow-2xs"
              >
                Limpar filtros e busca
              </button>
            </motion.div>
          )}
        </div>

      </div>
    </section>
  );
}
