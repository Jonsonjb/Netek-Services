/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { PROVINCES, COURSES } from '../data';
import { MapPin, Award, CheckCircle, Navigation, Info } from 'lucide-react';

export default function HubsList({ onSelectCourse }: { onSelectCourse: (courseId: string) => void }) {
  const [selectedPropId, setSelectedPropId] = useState<string>(PROVINCES[0].id);
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');

  const categories = ['Todos', 'Manutenção Industrial', 'Operações e Energia', 'Tecnologia', 'Construção e Logística'];

  const activeProvince = PROVINCES.find(p => p.id === selectedPropId) || PROVINCES[0];

  // Filter hubs to only show the ones offering courses in the selected category
  const filteredHubs = activeProvince.hubs.filter(hub => {
    if (selectedCategory === 'Todos') return true;
    return hub.courses.some(courseId => {
      const course = COURSES.find(item => item.id === courseId);
      return course?.category === selectedCategory;
    });
  });

  const totalSpotsForCategory = filteredHubs.reduce((acc, hub) => acc + hub.spots, 0);

  return (
    <section className="py-12 bg-slate-50 border-t border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Module Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-petro-green bg-petro-green/10 px-3 py-1.5 rounded-full">Polos do Programa</span>
          <h2 className="text-2xl font-black text-slate-800 mt-3">Centros de Formação IFPELAC</h2>
          <p className="text-xs md:text-sm text-slate-500 mt-1 max-w-md mx-auto">
            Aulas ministradas em salas de máquinas e laboratórios especializados do IFPELAC, possuindo infraestrutura técnica para práticas reais industriais.
          </p>
        </div>

        {/* Dynamic Province Selector Tabs */}
        <div className="flex flex-wrap md:justify-center items-center gap-1.5 mb-6 overflow-x-auto select-none py-1">
          {PROVINCES.map((prov) => (
            <button
              key={prov.id}
              onClick={() => setSelectedPropId(prov.id)}
              className={`px-4.5 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 border ${
                selectedPropId === prov.id
                  ? 'bg-petro-green text-white border-petro-green'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              {prov.name}
            </button>
          ))}
        </div>

        {/* Dynamic Category Selector Tabs */}
        <div className="max-w-4xl mx-auto bg-white border border-slate-200 p-4.5 rounded-2xl mb-10 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xs animate-fade-in">
          <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
            <span className="text-[11px] font-extrabold uppercase text-slate-500 tracking-wider">Filtrar polos por Área do Curso:</span>
          </div>
          <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto overflow-x-auto">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 text-[11px] font-bold rounded-xl cursor-pointer transition-all border whitespace-nowrap ${
                    isActive
                      ? 'bg-slate-800 text-white border-slate-800 shadow-xs'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Province Hub Details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch animate-fade-in">
          
          {/* Hub Summary Card (left 4 columns) */}
          <div className="lg:col-span-4 bg-gradient-to-br from-petro-blue to-petro-green rounded-3xl p-6 text-white flex flex-col justify-between shadow-lg">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="bg-petro-yellow text-slate-900 text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full text-center">Polo Ativo</span>
                {selectedCategory !== 'Todos' && (
                  <span className="bg-slate-900/60 text-white text-[10px] font-bold px-2.5 py-1 rounded-full truncate">
                    🔍 {selectedCategory}
                  </span>
                )}
              </div>
              <h3 className="text-xl font-bold tracking-tight">Província de {activeProvince.name}</h3>
              <p className="text-xs text-white/80 leading-relaxed font-medium">
                Esta província reúne dezenas de turmas operacionais nas áreas de engenharia de escoamento, soldagem profissional pesada e trilhas de letramento tecnológico.
              </p>

              {/* Total vacancies combined for this province */}
              <div className="pt-6 border-t border-white/20">
                <span className="text-[10px] uppercase font-bold text-white/60 tracking-wider">
                  {selectedCategory === 'Todos' ? 'Total de Vagas Oferecidas' : `Vagas em ${selectedCategory}`}
                </span>
                <span className="text-3xl font-black text-petro-yellow block mt-1">
                  {totalSpotsForCategory} vagas
                </span>
                {selectedCategory !== 'Todos' && (
                  <span className="text-[10px] text-white/70 mt-1 block font-medium">
                    Filtrado por curso da área selecionada
                  </span>
                )}
              </div>
            </div>

            <div className="mt-8 bg-black/15 p-4 rounded-xl flex items-start gap-2.5 border border-white/10">
              <Navigation className="w-4.5 h-4.5 text-petro-yellow shrink-0 fill-current mt-0.5" />
              <div className="text-[10.5px] text-white/90 leading-normal font-medium">
                Todas inscrições neste polo são gratuitas. Selecionados devem se matricular presencialmente e assinar a assunção de 85% de frequência.
              </div>
            </div>
          </div>

          {/* District list within selected Province (right 8 columns) */}
          <div className="lg:col-span-8 space-y-5">
            {filteredHubs.length > 0 ? (
              filteredHubs.map((hub, i) => (
                <div 
                  key={i}
                  className="bg-white border border-slate-200 rounded-2xl p-5 md:p-6 shadow-sm hover:shadow-md transition-all space-y-5 animate-fade-in"
                >
                  {/* District row header */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-slate-100">
                    <div className="space-y-0.5">
                      <span className="text-[9px] uppercase tracking-wider text-slate-400 font-extrabold font-mono font-bold">Unidade de Formação</span>
                      <h4 className="text-sm font-black text-slate-800">IFPELAC Distrito de {hub.district}</h4>
                    </div>
                    <div className="bg-green-50 border border-green-150 rounded-lg px-3 py-1 text-center shrink-0">
                      <span className="text-[9px] uppercase font-bold text-slate-400 block font-mono">spots livres para admissão</span>
                      <strong className="text-emerald-700 font-extrabold text-sm">{hub.spots} vagas</strong>
                    </div>
                  </div>

                  {/* Hub Physical Address */}
                  <div className="text-xs text-slate-600 leading-normal bg-slate-50 p-3 rounded-lg border border-slate-100 italic flex items-start gap-2">
                    <span className="shrink-0 mt-0.5">📍</span>
                    <span><strong>Morada:</strong> {hub.address}</span>
                  </div>

                  {/* Courses Offered here in list tags */}
                  <div className="space-y-2">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider font-mono">
                      {selectedCategory === 'Todos' ? 'Cursos lecionados neste hub:' : `Cursos de ${selectedCategory} neste hub:`}
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {hub.courses
                        .map((courseId) => COURSES.find(item => item.id === courseId))
                        .filter((c): c is NonNullable<typeof c> => {
                          if (!c) return false;
                          if (selectedCategory === 'Todos') return true;
                          return c.category === selectedCategory;
                        })
                        .map((c) => (
                          <button
                            key={c.id}
                            onClick={() => onSelectCourse(c.id)}
                            className="bg-slate-100 hover:bg-[#008542]/10 hover:text-[#008542] text-slate-700 font-semibold px-2.5 py-1.5 rounded-lg text-[10.5px] border border-slate-200 transition-all flex items-center gap-1 cursor-pointer"
                            title="Clique para ver detalhes do curso"
                          >
                            <CheckCircle className="w-3 h-3 text-[#008542]" />
                            {c.title}
                          </button>
                        ))}
                    </div>
                  </div>

                </div>
              ))
            ) : (
              <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center flex flex-col items-center justify-center space-y-3 shadow-xs min-h-[300px] animate-fade-in">
                <span className="text-4xl text-slate-400">🔎</span>
                <h4 className="text-sm font-bold text-slate-700">Nenhum Polo Disponível</h4>
                <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
                  Não existem polos oficiais vinculados que ofereçam cursos na área de <strong className="text-slate-700 font-bold">&quot;{selectedCategory}&quot;</strong> na província de <strong className="text-slate-700 font-bold">{activeProvince.name}</strong> neste ciclo de formatação.
                </p>
                <div className="flex gap-2.5 pt-2">
                  <button
                    onClick={() => setSelectedCategory('Todos')}
                    className="px-3.5 py-2 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl cursor-pointer transition-all border border-slate-200"
                  >
                    Ver Todas Áreas
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </section>
  );
}
