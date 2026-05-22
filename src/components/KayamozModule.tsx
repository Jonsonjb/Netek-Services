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
  Home,
  PlusCircle,
  FileBadge,
  Compass,
  MapPin,
  Coins,
  PhoneCall,
  Search,
  Trash2,
  Tag,
  Building2,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  ChevronDown,
  ChevronUp,
  Image as ImageIcon,
} from "lucide-react";
import { Imovel } from "../types";

const KAYAMOZ_PRESETS: Record<string, string> = {
  Casa: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&auto=format&fit=crop&q=60",
  Terreno: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&auto=format&fit=crop&q=60",
};

export default function KayamozModule({ isAdmin }: { isAdmin: boolean }) {
  const [imoveis, setImoveis] = useState<Imovel[]>([]);
  const [filterType, setFilterType] = useState<"Todos" | "Venda" | "Aluguer">("Todos");
  const [filterPropType, setFilterPropType] = useState<"Todos" | "Terreno" | "Casa">("Todos");

  // Form fields
  const [title, setTitle] = useState("");
  const [type, setType] = useState<"Venda" | "Aluguer">("Venda");
  const [propertyType, setPropertyType] = useState<"Terreno" | "Casa">("Terreno");
  const [dimensions, setDimensions] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [duatStatus, setDuatStatus] = useState<"Com DUAT" | "Sem DUAT">("Com DUAT");
  const [description, setDescription] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Expanded properties record state to save space as requested ("mostrar as informacoes quando em clicado, ou abrir abas do clicado para nao ocupar espaco")
  const [expandedImoveis, setExpandedImoveis] = useState<Record<string, boolean>>({});

  // Image option states
  const [imageMode, setImageMode] = useState<"preset" | "custom" | "none">("preset");
  const [customImageUrl, setCustomImageUrl] = useState("");

  const toggleImovelExpansion = (imovelId: string) => {
    setExpandedImoveis((prev) => ({
      ...prev,
      [imovelId]: !prev[imovelId],
    }));
  };

  // Load real estate items in real-time
  useEffect(() => {
    const q = query(collection(db, "imoveis"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const itemsList: Imovel[] = [];
        snapshot.forEach((d) => {
          itemsList.push({ id: d.id, ...d.data() } as Imovel);
        });
        setImoveis(itemsList);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, "imoveis");
      }
    );

    return () => unsubscribe();
  }, []);

  const handleRegisterProperty = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);

    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      setErrorMsg("Introduza um preço válido em Meticais.");
      setIsSubmitting(false);
      return;
    }

    let savedImageUrl = "";
    if (imageMode === "preset") {
      savedImageUrl = KAYAMOZ_PRESETS[propertyType] || "";
    } else if (imageMode === "custom") {
      savedImageUrl = customImageUrl;
    }

    const payload: Imovel = {
      title,
      type,
      propertyType,
      dimensions,
      location,
      price: parsedPrice,
      duatStatus,
      description,
      createdAt: Date.now(),
      userId: auth.currentUser?.uid || "anonimo",
      imageUrl: savedImageUrl,
    };

    try {
      await addDoc(collection(db, "imoveis"), payload);
      // Clean up fields
      setTitle("");
      setDimensions("");
      setLocation("");
      setPrice("");
      setDescription("");
      setCustomImageUrl("");
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, "imoveis");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProperty = async (propId: string) => {
    if (!propId || !confirm("Deseja mesmo remover esta propriedade do catálogo?")) return;
    try {
      await deleteDoc(doc(db, "imoveis", propId));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `imoveis/${propId}`);
    }
  };

  // Filter logic
  const filteredImoveis = imoveis.filter((item) => {
    const matchType = filterType === "Todos" || item.type === filterType;
    const matchProp = filterPropType === "Todos" || item.propertyType === filterPropType;
    return matchType && matchProp;
  });

  return (
    <div className="space-y-8" id="kayamoz-module">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/40 p-5 rounded-2xl border border-gray-100 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="bg-[#ff6600]/15 p-2.5 rounded-xl">
            <Compass className="h-6 w-6 text-[#ff6600]" />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-[#2c3e50] tracking-tight">
              Kayamoz - Intermediação Imobiliária
            </h2>
            <p className="text-sm text-gray-500">
              Encontre terrenos registados, casas para arrendamento ou venda sob assessoria da equipa Netek
            </p>
          </div>
        </div>

        {/* Broker Contacts */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 bg-gray-50/80 px-4 py-3 rounded-xl border border-gray-100">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Agente Autorizado</span>
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-gray-700">Jonson JB (@jonsonjb7)</span>
            <div className="flex items-center gap-2">
              <a
                href="https://www.facebook.com/jonsonjb7"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-semibold bg-white px-2 py-1 rounded-md border border-gray-150 transition-colors"
                title="Facebook @jonsonjb7"
              >
                <Facebook className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Facebook</span>
              </a>
              <a
                href="https://www.instagram.com/jonsonjb7"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs text-pink-600 hover:text-pink-700 font-semibold bg-white px-2 py-1 rounded-md border border-gray-150 transition-colors"
                title="Instagram @jonsonjb7"
              >
                <Instagram className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Instagram</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form Column - Left */}
        <div className="lg:col-span-4 glass-card rounded-2xl p-6 self-start">
          <div className="flex items-center gap-2 mb-4">
            <PlusCircle className="h-5 w-5 text-[#ff6600]" />
            <h3 className="font-bold text-gray-800 text-lg">Submeter Terreno / Imóvel</h3>
          </div>

          <form onSubmit={handleRegisterProperty} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Título do Anúncio</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex. Terreno 20x30m no Albasine"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-800 focus:border-[#ff6600] outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Negociação</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as "Venda" | "Aluguer")}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-800 bg-white focus:border-[#ff6600] outline-none"
                >
                  <option value="Venda">Para Venda</option>
                  <option value="Aluguer">Para Aluguer</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Imóvel</label>
                <select
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value as "Terreno" | "Casa")}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-800 bg-white focus:border-[#ff6600] outline-none"
                >
                  <option value="Terreno">Terreno / Parcela</option>
                  <option value="Casa">Casa / Vivenda</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Dimensão (m² / Medida)</label>
                <input
                  type="text"
                  required
                  value={dimensions}
                  onChange={(e) => setDimensions(e.target.value)}
                  placeholder="Ex. 20x30m"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-800 focus:border-[#ff6600] outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Situação do DUAT</label>
                <select
                  value={duatStatus}
                  onChange={(e) => setDuatStatus(e.target.value as "Com DUAT" | "Sem DUAT")}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-800 bg-white focus:border-[#ff6600] outline-none"
                >
                  <option value="Com DUAT">Com DUAT Regular</option>
                  <option value="Sem DUAT">Sem DUAT / Cedido</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Preço Pretendido (MZN)</label>
                <input
                  type="number"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="Preço em Meticais"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-800 focus:border-[#ff6600] outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Localização e Detalhes</label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Ex. Bairro Albasine, próximo à Escola Secundária"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-800 focus:border-[#ff6600] outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Breve Descrição do Terreno/Imóvel</label>
              <textarea
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Indique os pontos de referência, vizinhança ou facilidade de acesso a energia/água de passagem."
                rows={3}
                className="w-full p-3 border border-gray-200 rounded-lg text-sm text-gray-800 focus:border-[#ff6600] outline-none resize-none text-left"
              />
            </div>

            {/* Photo Selection Option for the property ad */}
            <div className="bg-gray-50/70 p-4 rounded-xl border border-gray-150 space-y-3">
              <label className="block text-xs font-black uppercase tracking-wider text-[#2c3e50] flex items-center gap-1.5">
                <ImageIcon className="h-4 w-4 text-[#ff6600]" /> Foto do Classificado (Opcional)
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
                    Será utilizada a foto profissional de <strong>{propertyType}</strong>:
                  </p>
                  <div className="relative h-20 rounded-lg overflow-hidden border border-gray-200 bg-gray-100">
                    <img
                      src={KAYAMOZ_PRESETS[propertyType]}
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
                      placeholder="Ex. https://minhafoto.com/imovel1.jpg"
                      className="w-full px-3 py-1.5 border border-gray-250 rounded-lg text-xs text-gray-800 focus:border-[#ff6600] outline-none"
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
                          (e.target as HTMLImageElement).src = KAYAMOZ_PRESETS[propertyType];
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
              <div className="p-2 bg-red-100 text-red-700 rounded-lg text-xs font-semibold">
                {errorMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 bg-[#2c3e50] hover:bg-[#1a252f] text-white font-medium text-sm rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
            >
              {isSubmitting ? (
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                "Anunciar Propriedade"
              )}
            </button>
          </form>
        </div>

        {/* Catalog List Column - Right */}
        <div className="lg:col-span-8 space-y-6">
          {/* Active Filtres */}
          <div className="bg-gray-50 p-4 rounded-xl flex flex-wrap gap-4 items-center justify-between border border-gray-100">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-gray-400" />
              <span className="text-xs text-gray-500 font-semibold uppercase">Filtros Activos</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {/* Type negotiation filter */}
              <div className="flex bg-white border border-gray-200 rounded-lg overflow-hidden p-0.5 text-xs">
                {(["Todos", "Venda", "Aluguer"] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setFilterType(t)}
                    className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                      filterType === t
                        ? "bg-[#ff6600] text-white font-semibold"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              {/* Property type filter */}
              <div className="flex bg-white border border-gray-200 rounded-lg overflow-hidden p-0.5 text-xs">
                {(["Todos", "Terreno", "Casa"] as const).map((pt) => bridgeButton(pt, filterPropType, setFilterPropType))}
              </div>
            </div>
          </div>

          {filteredImoveis.length === 0 ? (
            <div className="glass-card rounded-2xl p-16 text-center text-gray-500">
              <Building2 className="h-10 w-10 mx-auto text-gray-300 mb-3" />
              <p className="font-semibold text-gray-700">Nenhum registo corresponde à pesquisa.</p>
              <p className="text-xs text-gray-400 mt-1">Experimente alterar as opções de filtragem acima.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="kayamoz-properties-grid">
              {filteredImoveis.map((item) => {
                const isExpanded = !!expandedImoveis[item.id || ""];
                const isDataSaverActive = localStorage.getItem("netek_data_saver") === "true";
                const propertyImg = item.imageUrl || KAYAMOZ_PRESETS[item.propertyType] || "";

                return (
                  <div
                    key={item.id}
                    className="glass-card rounded-2xl overflow-hidden hover:shadow-lg transition-all flex flex-col border border-gray-100"
                  >
                    {/* Header bar click to toggle card details or expand button */}
                    <div
                      role="button"
                      onClick={() => item.id && toggleImovelExpansion(item.id)}
                      className="p-4 bg-gray-50/40 border-b border-gray-50 flex items-start justify-between gap-3 cursor-pointer select-none hover:bg-gray-100/50 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                          <span className="bg-[#2c3e50] text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                            {item.type}
                          </span>
                          <span className="bg-[#ff6600] text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                            {item.propertyType}
                          </span>
                          <span className="bg-white text-gray-700 text-[9px] font-bold px-1.5 py-0.5 rounded border border-gray-200 flex items-center gap-0.5">
                            <FileBadge className="h-3 w-3 text-[#ff6600]" /> {item.duatStatus}
                          </span>
                        </div>
                        <h4 className="font-extrabold text-gray-800 text-sm md:text-base leading-tight truncate">
                          {item.title}
                        </h4>
                        <p className="text-[10px] text-gray-400 font-mono mt-0.5">{item.dimensions}</p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <div className="text-right">
                          <span className="text-sm md:text-base font-black text-[#2c3e50] block">
                            {item.price.toLocaleString("pt-MZ")}
                          </span>
                          <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">MZN</span>
                        </div>
                        <div className="text-[#ff6600] shrink-0">
                          {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                        </div>
                      </div>
                    </div>

                    {/* Collapsible content details tab */}
                    {isExpanded ? (
                      <div className="flex-1 flex flex-col justify-between animate-fade-in">
                        
                        {/* Property main photo display with data-saver option */}
                        <div className="relative h-44 bg-gray-100 overflow-hidden flex items-center justify-center text-center p-3">
                          {isDataSaverActive ? (
                            <div className="space-y-1 font-sans">
                              <span className="text-xl block">🚫🖼️</span>
                              <p className="text-[9px] font-black text-orange-600 uppercase tracking-widest">Poupar Megas Activo</p>
                              <p className="text-[9px] text-gray-400">Foto {item.propertyType} Omitida</p>
                            </div>
                          ) : (
                            <img
                              src={propertyImg}
                              alt={item.title}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover grayscale-[10%] hover:scale-102 transition-transform duration-300"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = KAYAMOZ_PRESETS[item.propertyType];
                              }}
                            />
                          )}
                        </div>

                        {/* Details card content */}
                        <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                          <div className="space-y-3">
                            <div>
                              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Descrição e Referências</p>
                              <p className="text-xs text-gray-600 leading-relaxed max-h-32 overflow-y-auto pr-1">
                                {item.description}
                              </p>
                            </div>

                            <div className="flex items-center gap-1.5 text-xs text-gray-600 bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                              <MapPin className="h-4 w-4 text-[#ff6600] shrink-0" />
                              <span className="truncate"><strong>Local:</strong> {item.location}</span>
                            </div>
                          </div>

                          {/* Action controls */}
                          <div className="flex items-center justify-between border-t border-gray-100 pt-3.5">
                            <div>
                              <span className="text-[9px] font-bold text-gray-400 uppercase block tracking-wide">Preço Moçambicano</span>
                              <span className="text-base font-extrabold text-[#ff6600]">
                                {item.price.toLocaleString("pt-MZ")} MZN
                              </span>
                            </div>

                            <div className="flex gap-2">
                              {isAdmin && item.id && (
                                <button
                                  onClick={() => item.id && handleDeleteProperty(item.id)}
                                  className="p-2 border border-red-100 hover:bg-red-50 text-red-500 rounded-xl transition-colors cursor-pointer"
                                  title="Eliminar Anúncio"
                                >
                                  <Trash2 className="h-4.5 w-4.5" />
                                </button>
                              )}

                              <a
                                href={`https://wa.me/258835109190?text=${encodeURIComponent(
                                  `Olá Jonson JB! Desejo saber mais pormenores do catálogo de classificados Kayamoz:\n- Anúncio: "${item.title}"\n- Tipo: ${item.propertyType} para ${item.type}\n- Localização: ${item.location}\n- Preço: ${item.price} MZN.`
                                )}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-[#2a3e50] hover:bg-[#1a252f] text-white px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm hover:shadow-md"
                              >
                                <PhoneCall className="h-4 w-4" /> Negociar
                              </a>
                            </div>
                          </div>
                        </div>

                        {/* Social share widget/bar */}
                        <div className="px-5 py-3 bg-gray-50/50 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3 text-xs bg-gradient-to-r from-gray-50/50 to-white/50">
                          <div className="flex items-center gap-1.5 text-gray-500">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Agente Netek:</span>
                            <span className="font-bold text-gray-700">@jonsonjb7</span>
                            <div className="flex items-center gap-1 ml-1 pl-1.5 border-l border-gray-200">
                              <a
                                href="https://www.facebook.com/jonsonjb7"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-700 p-0.5 bg-white rounded border border-gray-200"
                              >
                                <Facebook className="h-3 w-3" />
                              </a>
                              <a
                                href="https://www.instagram.com/jonsonjb7"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-pink-600 hover:text-pink-700 p-0.5 bg-white rounded border border-gray-200"
                              >
                                <Instagram className="h-3 w-3" />
                              </a>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] text-gray-400 font-bold uppercase mr-1">Partilhar:</span>
                            
                            <a
                              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                                window.location.href
                              )}&quote=${encodeURIComponent(`Veja este imóvel no Kayamoz: ${item.title} por ${item.price.toLocaleString("pt-MZ")} MZN!`)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1 text-blue-600 hover:bg-blue-50 bg-white border border-gray-200 rounded flex items-center justify-center"
                            >
                              <Facebook className="h-3 w-3" />
                            </a>

                            <a
                              href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                                window.location.href
                              )}&text=${encodeURIComponent(`Imóvel no Kayamoz: ${item.title} no ${item.location}. Confira!`)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1 text-[#1da1f2] hover:bg-sky-50 bg-white border border-gray-200 rounded flex items-center justify-center"
                            >
                              <Twitter className="h-3 w-3" />
                            </a>
                          </div>
                        </div>

                      </div>
                    ) : (
                      // Collapsed prompt panel to save substantial screen area and allow visual interactivity
                      <div
                        role="button"
                        onClick={() => item.id && toggleImovelExpansion(item.id)}
                        className="px-5 py-3.5 bg-gray-50/20 text-center border-t border-gray-50 flex items-center justify-between cursor-pointer hover:bg-[#ff6600]/5 transition-colors group"
                      >
                        <span className="text-[11px] font-bold text-gray-400 group-hover:text-[#ff6600] transition-colors flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span> Ver fotos e pormenores completos
                        </span>
                        <span className="text-[11px] font-semibold text-[#ff6600] flex items-center gap-0.5">
                          Ver Mais <ChevronDown className="h-3.5 w-3.5 group-hover:translate-y-0.5 transition-transform" />
                        </span>
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

// Custom abstraction helper as required to build clean JSX
function bridgeButton(
  pt: "Todos" | "Terreno" | "Casa",
  filterPropType: "Todos" | "Terreno" | "Casa",
  setFilterPropType: (pt: "Todos" | "Terreno" | "Casa") => void
) {
  return (
    <button
      key={pt}
      type="button"
      onClick={() => setFilterPropType(pt)}
      className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
        filterPropType === pt
          ? "bg-[#2c3e50] text-white font-semibold"
          : "text-gray-600 hover:bg-gray-100"
      }`}
    >
      {pt}
    </button>
  );
}
