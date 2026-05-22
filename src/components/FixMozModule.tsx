import React, { useState, useEffect } from "react";
import { db, handleFirestoreError, OperationType, auth } from "../firebase";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import {
  Briefcase,
  PlusCircle,
  MapPin,
  CircleDollarSign,
  Phone,
  Trash2,
  Send,
  MessageSquare,
  ShieldAlert,
  ChevronDown,
  ChevronUp,
  Image as ImageIcon,
} from "lucide-react";
import { VagaTrabalho } from "../types";

const CATEGORY_PRESETS: Record<string, string> = {
  "Pedreiro / Mestre": "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=600&auto=format&fit=crop&q=60",
  "Serralheiro": "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=600&auto=format&fit=crop&q=60",
  "Carpinteiro": "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=600&auto=format&fit=crop&q=60",
  "Eletricista": "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&auto=format&fit=crop&q=60",
  "Canalizador": "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=600&auto=format&fit=crop&q=60",
  "Servente / Ajudante": "https://images.unsplash.com/photo-1581094288338-2314dddb7ecc?w=600&auto=format&fit=crop&q=60",
  "Pintor": "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&auto=format&fit=crop&q=60",
};

export default function FixMozModule({ isAdmin }: { isAdmin: boolean }) {
  const [vagas, setVagas] = useState<VagaTrabalho[]>([]);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Pedreiro / Mestre");
  const [neighborhood, setNeighborhood] = useState("");
  const [budget, setBudget] = useState("");
  const [ownerContact, setOwnerContact] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Expanded card state to save space as requested ("mostrar as informacoes quando em clicado, ou abrir abas do clicado para nao ocupar espaco")
  const [expandedVagas, setExpandedVagas] = useState<Record<string, boolean>>({});

  // Image option states
  const [imageMode, setImageMode] = useState<"preset" | "custom" | "none">("preset");
  const [customImageUrl, setCustomImageUrl] = useState("");

  const toggleVagaExpansion = (vagaId: string) => {
    setExpandedVagas((prev) => ({
      ...prev,
      [vagaId]: !prev[vagaId],
    }));
  };

  // Load real-time feed using onSnapshot as requested
  useEffect(() => {
    const q = query(collection(db, "vagas_trabalho"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const docsList: VagaTrabalho[] = [];
        snapshot.forEach((d) => {
          docsList.push({ id: d.id, ...d.data() } as VagaTrabalho);
        });
        setVagas(docsList);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, "vagas_trabalho");
      }
    );

    return () => unsubscribe();
  }, []);

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);

    const parsedBudget = parseFloat(budget);
    if (isNaN(parsedBudget) || parsedBudget <= 0) {
      setErrorMsg("Por favor introduza um orçamento válido maior que zero.");
      setIsSubmitting(false);
      return;
    }

    let savedImageUrl = "";
    if (imageMode === "preset") {
      savedImageUrl = CATEGORY_PRESETS[category] || "";
    } else if (imageMode === "custom") {
      savedImageUrl = customImageUrl;
    }

    const docData: VagaTrabalho = {
      title,
      category,
      neighborhood,
      budget: parsedBudget,
      ownerContact,
      description,
      createdAt: Date.now(),
      userId: auth.currentUser?.uid || "anonimo",
      imageUrl: savedImageUrl,
    };

    try {
      await addDoc(collection(db, "vagas_trabalho"), docData);
      // Clear Form on success
      setTitle("");
      setNeighborhood("");
      setBudget("");
      setOwnerContact("");
      setDescription("");
      setCustomImageUrl("");
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, "vagas_trabalho");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (vagaId: string) => {
    if (!vagaId || !confirm("Deseja realmente eliminar este anúncio?")) return;
    try {
      await deleteDoc(doc(db, "vagas_trabalho", vagaId));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `vagas_trabalho/${vagaId}`);
    }
  };

  return (
    <div className="space-y-8" id="fixmoz-module">
      <div className="flex items-center gap-3">
        <div className="bg-[#ff6600]/15 p-2.5 rounded-xl">
          <Briefcase className="h-6 w-6 text-[#ff6600]" />
        </div>
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-[#2c3e50] tracking-tight">
            FixMoz - Agência de Trabalho
          </h2>
          <p className="text-sm text-gray-500">
            Publique a sua oportunidade ou encontre ajudantes qualificados para a sua construção em Moçambique
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form Column - Left */}
        <div className="lg:col-span-5 glass-card rounded-2xl p-6 self-start">
          <div className="flex items-center gap-2 mb-5">
            <PlusCircle className="h-5 w-5 text-[#ff6600]" />
            <h3 className="font-bold text-gray-800 text-lg">Publicar Nova Obra</h3>
          </div>

          <form onSubmit={handlePublish} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Título do Serviço / Obras
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex. Precisa-se de Pintor de Fachada"
                required
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-gray-800 focus:border-[#ff6600] outline-none text-sm transition-colors"
                id="job-title-input"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Profissional Necessário
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-gray-800 bg-white focus:border-[#ff6600] outline-none text-sm transition-colors"
                >
                  <option value="Pedreiro / Mestre">Pedreiro / Mestre</option>
                  <option value="Serralheiro">Serralheiro</option>
                  <option value="Carpinteiro">Carpinteiro</option>
                  <option value="Eletricista">Eletricista</option>
                  <option value="Canalizador">Canalizador</option>
                  <option value="Servente / Ajudante">Servente / Ajudante</option>
                  <option value="Pintor">Pintor</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bairro / Localidade
                </label>
                <input
                  type="text"
                  value={neighborhood}
                  onChange={(e) => setNeighborhood(e.target.value)}
                  placeholder="Ex. Zimpeto, Maputo"
                  required
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-gray-800 focus:border-[#ff6600] outline-none text-sm transition-colors"
                  id="job-location-input"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Orçamento (MZN)
                </label>
                <input
                  type="number"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="Ex. 15000"
                  required
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-gray-800 focus:border-[#ff6600] outline-none text-sm transition-colors"
                  id="job-budget-input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contacto do Dono (Oculto)
                </label>
                <input
                  type="text"
                  value={ownerContact}
                  onChange={(e) => setOwnerContact(e.target.value)}
                  placeholder="Ex. +258 84 123 4567"
                  required
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-gray-800 focus:border-[#ff6600] outline-none text-sm transition-colors"
                  id="job-contact-input"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descrição Detalhada do Serviço
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Indique as especificações, tempo estimado e exigências básicas da obra."
                rows={3}
                required
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-gray-800 focus:border-[#ff6600] outline-none text-sm transition-colors resize-none"
                id="job-description-input"
              />
            </div>

            {/* Photo Selection Option for the work / ad */}
            <div className="bg-gray-50/70 p-4 rounded-xl border border-gray-150 space-y-3">
              <label className="block text-xs font-black uppercase tracking-wider text-[#2c3e50] flex items-center gap-1.5">
                <ImageIcon className="h-4 w-4 text-[#ff6600]" /> Foto do Anúncio / Obra (Opcional)
              </label>
              
              <div className="grid grid-cols-3 gap-1 bg-white p-1 rounded-lg border border-gray-200">
                {(["preset", "custom", "none"] as const).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setImageMode(mode)}
                    className={`py-1.5 px-1 rounded text-[10px] font-bold uppercase tracking-wider text-center cursor-pointer transition-all ${
                      imageMode === mode
                        ? "bg-[#ff6600] text-white shadow-xs"
                        : "text-gray-500 hover:bg-gray-100"
                    }`}
                  >
                    {mode === "preset" && "Usar Padrão"}
                    {mode === "custom" && "Foto Link URL"}
                    {mode === "none" && "Sem Foto"}
                  </button>
                ))}
              </div>

              {imageMode === "preset" && (
                <div className="space-y-1">
                  <p className="text-[10px] text-gray-500 font-light leading-relaxed">
                    Será utilizada a foto profissional de <strong>{category}</strong>:
                  </p>
                  <div className="relative h-20 rounded-lg overflow-hidden border border-gray-200 bg-gray-100">
                    <img
                      src={CATEGORY_PRESETS[category]}
                      className="w-full h-full object-cover"
                      alt="Preset Preview"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>
              )}

              {imageMode === "custom" && (
                <div className="space-y-2">
                  <div>
                    <input
                      type="url"
                      value={customImageUrl}
                      onChange={(e) => setCustomImageUrl(e.target.value)}
                      placeholder="Ex. https://minhafoto.com/obra1.jpg"
                      className="w-full px-3 py-1.5 border border-gray-205 rounded-lg text-xs text-gray-800 focus:border-[#ff6600] outline-none"
                    />
                    <p className="text-[9px] text-gray-400 mt-1">Insira um link direto para uma foto JPG/PNG hospedada online.</p>
                  </div>
                  {customImageUrl && (
                    <div className="relative h-20 rounded-lg overflow-hidden border border-gray-200 bg-gray-100">
                      <img
                        src={customImageUrl}
                        className="w-full h-full object-cover"
                        alt="Custom Preview"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=200";
                        }}
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  )}
                </div>
              )}

              {imageMode === "none" && (
                <p className="text-[10px] text-orange-600 font-bold italic leading-none">
                  ⚡ Economiza dados e megas do visitante! Reduz o custo em Moçambique.
                </p>
              )}
            </div>

            {errorMsg && (
              <div className="p-3 bg-red-50 text-red-700 rounded-lg text-xs font-semibold">
                {errorMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 bg-[#2c3e50] hover:bg-[#1a252f] text-white font-medium text-sm rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
              id="job-submit-btn"
            >
              {isSubmitting ? (
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <Send className="h-4 w-4" /> Publicar Oportunidade
                </>
              )}
            </button>
          </form>
        </div>

        {/* Feed Column - Right */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
              <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-ping"></div> Vagas de Hoje
            </h3>
            <span className="text-xs text-gray-400 font-mono">{vagas.length} vagas ativas</span>
          </div>

          {vagas.length === 0 ? (
            <div className="glass-card rounded-2xl p-12 text-center text-gray-500" id="empty-feed">
              <Briefcase className="h-10 w-10 mx-auto text-gray-300 mb-3" />
              <p className="font-medium">Nenhuma vaga ativa listada no momento.</p>
              <p className="text-xs text-gray-400 mt-1">Seja o primeiro a publicar usando o formulário à esquerda!</p>
            </div>
          ) : (
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1" id="job-feed-list">
              {vagas.map((vaga) => {
                const isExpanded = !!expandedVagas[vaga.id || ""];
                const hasPhoto = !!vaga.imageUrl;
                const isDataSaverActive = localStorage.getItem("netek_data_saver") === "true";

                return (
                  <div
                    key={vaga.id}
                    className="glass-card rounded-2xl overflow-hidden hover:shadow-md transition-all relative border border-gray-100 flex flex-col"
                  >
                    {/* Top bar indicators */}
                    <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-[#2c3e50]"></div>

                    {/* Main Compact Toggler Bar */}
                    <div
                      role="button"
                      onClick={() => vaga.id && toggleVagaExpansion(vaga.id)}
                      className="p-4 pl-5 cursor-pointer flex items-start justify-between gap-4 select-none hover:bg-gray-50/50 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className="inline-block bg-orange-50 text-[#ff6600] text-[10px] font-bold px-2 py-0.5 rounded-full">
                            {vaga.category}
                          </span>
                          <span className="text-[10px] text-gray-400 font-mono flex items-center gap-1">
                            <MapPin className="h-3 w-3" /> {vaga.neighborhood}
                          </span>
                          {hasPhoto && (
                            <span className="inline-block bg-blue-50 text-blue-600 text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1">
                              <ImageIcon className="h-2.5 w-2.5" /> Com Foto
                            </span>
                          )}
                        </div>
                        <h4 className="font-extrabold text-gray-800 text-sm md:text-base leading-tight truncate">
                          {vaga.title}
                        </h4>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <div className="text-right">
                          <p className="text-sm md:text-base font-black text-[#ff6600]">
                            {vaga.budget.toLocaleString("pt-MZ")} MZN
                          </p>
                          <p className="text-[9px] text-gray-400 font-medium">Orçamento</p>
                        </div>
                        <div className="text-gray-400">
                          {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                        </div>
                      </div>
                    </div>

                    {/* Detailed Accordion tab area */}
                    {isExpanded && (
                      <div className="px-5 pb-5 pt-1 border-t border-gray-50 pl-5 space-y-4 animate-fade-in">
                        
                        {/* Optional photo section with data-saver option */}
                        {hasPhoto && (
                          <div className="rounded-xl overflow-hidden border border-gray-150 bg-gray-50 max-h-48 flex items-center justify-center text-center">
                            {isDataSaverActive ? (
                              <div className="py-6 px-4 font-sans text-center">
                                <span className="text-lg block">🚫🖼️</span>
                                <p className="text-[10px] font-black text-orange-600 uppercase tracking-wider">Economia de Dados Ativa</p>
                                <p className="text-[9px] text-gray-400">A foto deste anúncio foi omitida para poupar os seus megas.</p>
                              </div>
                            ) : (
                              <img
                                src={vaga.imageUrl}
                                alt={vaga.title}
                                referrerPolicy="no-referrer"
                                className="w-full max-h-48 object-cover hover:scale-102 transition-transform duration-300"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).style.display = "none";
                                }}
                              />
                            )}
                          </div>
                        )}

                        <div className="space-y-1.5 text-xs text-gray-600 leading-relaxed font-light">
                          <p className="font-bold text-gray-800 uppercase tracking-wider text-[10px] text-gray-400">Descrição do Trabalho</p>
                          <p className="whitespace-pre-line bg-gray-50/50 p-3 rounded-xl border border-gray-100 text-gray-700">
                            {vaga.description}
                          </p>
                        </div>

                        <div className="flex flex-wrap items-center justify-between border-t border-gray-50 pt-3 gap-3 text-xs">
                          <div className="text-gray-400 text-[10px] font-mono">
                            Publicado em {new Date(vaga.createdAt).toLocaleDateString("pt-MZ")}
                          </div>

                          <div className="flex items-center gap-2">
                            {isAdmin && (
                              <div className="bg-orange-50 text-[#2c3e50] px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 border border-orange-100 mr-1">
                                <Phone className="h-3 w-3 shrink-0" />
                                <span>Contato: {vaga.ownerContact}</span>
                              </div>
                            )}

                            {isAdmin && ddoc(vaga) && (
                              <button
                                onClick={() => vaga.id && handleDelete(vaga.id)}
                                className="bg-red-50 hover:bg-red-100 text-red-600 p-2 rounded-lg transition-colors cursor-pointer"
                                title="Eliminar Anúncio"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            )}

                            <a
                              href={`https://wa.me/258835109190?text=${encodeURIComponent(
                                `Olá Jonson JB! Desejo candidatar-me à vaga de "${vaga.title}" localizada em "${vaga.neighborhood}" com orçamento de ${vaga.budget} MZN cadastrada na FixMoz.`
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-[#ff6600] hover:bg-[#e05a00] text-white px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm hover:shadow-md"
                            >
                              <MessageSquare className="h-3.5 w-3.5" /> Candidatar-me via Agência
                            </a>
                          </div>
                        </div>

                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Small helper to avoid syntax issues during build
function ddoc(vaga: any) {
  return !!vaga.id;
}
