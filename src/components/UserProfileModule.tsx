import React, { useState, useEffect } from "react";
import { db, handleFirestoreError, OperationType } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { getUserFriendlyName } from "../lib/userUtils";
import {
  User,
  Phone,
  MapPin,
  Mail,
  Save,
  AlertCircle,
  CheckCircle,
  ShieldCheck,
  Building,
  ArrowRight,
} from "lucide-react";

interface UserProfileModuleProps {
  user: any;
  isAdmin: boolean;
}

export default function UserProfileModule({ user, isAdmin }: UserProfileModuleProps) {
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [profession, setProfession] = useState("");
  const [about, setAbout] = useState("");
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const fetchUserProfile = async () => {
      setIsLoading(true);
      setErrorMsg(null);
      const userDocPath = `users/${user.uid}`;
      try {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          setName(data.name || "");
          setPhoneNumber(data.phoneNumber || "");
          setAddress(data.address || "");
          setProfession(data.profession || "");
          setAbout(data.about || "");
        }
      } catch (err: any) {
        console.error("Erro ao carregar perfil:", err);
        // Using error handler constraint
        try {
          handleFirestoreError(err, OperationType.GET, userDocPath);
        } catch (wrappedErr: any) {
          setErrorMsg("Não foi possível carregar os dados de perfil no momento. Por favor, tente novamente.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSaving(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    const userDocPath = `users/${user.uid}`;
    const profilePayload = {
      uid: user.uid,
      email: user.email,
      name: name.trim(),
      phoneNumber: phoneNumber.trim(),
      address: address.trim(),
      profession: profession.trim(),
      about: about.trim(),
      updatedAt: new Date().toISOString(),
    };

    try {
      const docRef = doc(db, "users", user.uid);
      await setDoc(docRef, profilePayload);
      setSuccessMsg("O seu perfil foi atualizado com sucesso no Netek Services!");
      
      // Auto-dismiss successes
      setTimeout(() => {
        setSuccessMsg(null);
      }, 4000);
    } catch (err: any) {
      console.error("Erro ao guardar dados do perfil:", err);
      try {
        handleFirestoreError(err, OperationType.WRITE, userDocPath);
      } catch (wrappedErr: any) {
        setErrorMsg("Infelizmente, ocorreu um erro ao salvar o seu perfil. Verifique as suas permissões.");
      }
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="glass-card rounded-3xl p-8 max-w-2xl mx-auto text-center space-y-6 my-8 animate-fade-in" id="profile-logged-out-state">
        <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto text-[#2c3e50]/40">
          <User className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-extrabold text-gray-800">Sessão Não Iniciada</h2>
          <p className="text-sm text-gray-500 max-w-md mx-auto">
            Por favor, inicie sessão ou registe uma nova conta para poder editar e visualizar as suas informações de perfil personalizadas.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in" id="profile-container-section">
      {/* Upper overview stats header */}
      <div className="glass-card rounded-3xl p-6 md:p-8 flex flex-col md:flex-row gap-6 items-center justify-between shadow-sm relative overflow-hidden" id="profile-header-card">
        <div className="absolute top-0 right-0 w-36 h-36 bg-[#ff6600]/5 rounded-full blur-2xl -mr-10 -mt-10"></div>
        
        <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left z-10">
          <div className="w-20 h-20 bg-[#2c3e50] text-[#ff6600] border-4 border-white shadow-xl rounded-2xl flex items-center justify-center font-extrabold text-3xl">
            {(() => {
              const profileName = name || getUserFriendlyName(user);
              const parts = profileName.trim().split(/\s+/);
              if (parts.length >= 2) {
                return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
              }
              return profileName.substring(0, 2).toUpperCase();
            })()}
          </div>
          <div>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h2 className="text-2xl font-extrabold text-gray-800 tracking-tight">{name || getUserFriendlyName(user)}</h2>
              {isAdmin && (
                <span className="bg-green-100 text-green-800 text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3" /> Administrador
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500 flex items-center justify-center sm:justify-start gap-1.5 mt-1">
              <Mail className="h-4 w-4 text-gray-400 shrink-0" /> {user.email}
            </p>
            {profession && (
              <p className="text-xs text-orange-600 font-mono font-bold uppercase tracking-wider mt-1 flex items-center justify-center sm:justify-start gap-1">
                <Building className="h-3.5 w-3.5" /> {profession}
              </p>
            )}
          </div>
        </div>

        <div className="bg-[#2c3e50]/5 border border-[#2c3e50]/10 p-4 rounded-2xl flex flex-col items-center shrink-0 min-w-[200px] text-center z-10">
          <span className="text-[10px] text-gray-400 uppercase font-mono font-bold tracking-wider">Identificador ID</span>
          <span className="text-xs font-mono font-bold text-gray-700 bg-white/70 px-2.5 py-1 rounded-lg border border-gray-100 mt-1 block max-w-[180px] truncate" title={user.uid}>
            {user.uid.substring(0, 10)}...
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Help Panel - Left */}
        <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-gray-200/60 shadow-inner flex flex-col space-y-6 shadow-sm self-start" id="profile-helper-sidebar">
          <div>
            <h3 className="font-bold text-gray-800 text-base mb-1">Dicas do Perfil NK</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Manter o seu perfil atualizado ajuda a acelerar os seus contatos com construtores e proprietários no ecossistema do Netek Services.
            </p>
          </div>

          <div className="border-t border-gray-100 pt-4 space-y-4">
            <div className="flex gap-3">
              <div className="bg-[#ff6600]/10 p-2 rounded-xl text-[#ff6600] h-9 w-9 flex items-center justify-center shrink-0">
                <Phone className="h-4.5 w-4.5" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold text-gray-800">Candidaturas FixMoz</h4>
                <p className="text-[11px] text-gray-400 leading-normal">O seu contacto preferencial facilita o envio célere de CVs.</p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="bg-[#2c3e50]/10 p-2 rounded-xl text-[#2c3e50] h-9 w-9 flex items-center justify-center shrink-0">
                <MapPin className="h-4.5 w-4.5" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold text-gray-800">Negociação Kayamoz</h4>
                <p className="text-[11px] text-gray-400 leading-normal">Saber a sua localização ajuda a filtrar propriedades por província em Moçambique.</p>
              </div>
            </div>
          </div>

          <div className="bg-orange-50 border border-orange-100 p-4 rounded-2xl text-xs space-y-1 text-orange-900 font-medium">
            <p className="font-bold text-[#ff6600]">Autenticação Protegida</p>
            <p className="text-gray-600 leading-relaxed text-[11px]">
              Os seus dados PII estão isolados e cobertos pelas regras de segurança configuradas do Firebase Auth. Nenhum utilizador não-autorizado pode ler a sua identidade.
            </p>
          </div>
        </div>

        {/* Profile Edit Form Column - Right */}
        <div className="lg:col-span-8 glass-card rounded-3xl p-6 md:p-8" id="profile-edit-panel">
          <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
            <h3 className="text-lg font-extrabold text-gray-800 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-[#ff6600] rounded-full inline-block"></span>
              Atualizar Informação Pessoal
            </h3>
            <span className="text-[10px] bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-lg font-bold uppercase font-mono border border-indigo-100">
              Iniciado via Firebase
            </span>
          </div>

          {isLoading ? (
            <div className="py-12 flex flex-col items-center justify-center gap-3">
              <div className="w-10 h-10 border-4 border-[#ff6600] border-t-transparent rounded-full animate-spin"></div>
              <p className="text-xs text-gray-400 font-mono">A carregar dados do Firebase...</p>
            </div>
          ) : (
            <form onSubmit={handleSave} className="space-y-5">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* FULL NAME */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide">
                    Nome Completo
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ex: Jonson JB"
                      className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:border-[#ff6600] focus:ring-1 focus:ring-[#ff6600] outline-none text-sm transition-all text-gray-800"
                      required
                    />
                  </div>
                </div>

                {/* PHONE NUMBER */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide">
                    Telemóvel / WhatsApp
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="Ex: +258 83 510 9190"
                      className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:border-[#ff6600] focus:ring-1 focus:ring-[#ff6600] outline-none text-sm transition-all text-gray-800"
                    />
                  </div>
                </div>

                {/* PROFESSION */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide">
                    Profissão / Ocupação
                  </label>
                  <div className="relative">
                    <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      value={profession}
                      onChange={(e) => setProfession(e.target.value)}
                      placeholder="Ex: Pedreiro / Engenheiro Civil"
                      className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:border-[#ff6600] focus:ring-1 focus:ring-[#ff6600] outline-none text-sm transition-all text-gray-800"
                    />
                  </div>
                </div>

                {/* ADDRESS */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide">
                    Endereço / Bairro
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Ex: Triunfo, Cidade de Maputo"
                      className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:border-[#ff6600] focus:ring-1 focus:ring-[#ff6600] outline-none text-sm transition-all text-gray-800"
                    />
                  </div>
                </div>
              </div>

              {/* ABOUT/BIO */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide">
                  Biografia / Breve Descrição
                </label>
                <textarea
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                  placeholder="Escreva algo sobre a sua experiência ou as suas pretensões profissionais..."
                  rows={4}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-2xl focus:border-[#ff6600] focus:ring-1 focus:ring-[#ff6600] outline-none text-sm transition-all text-gray-800 resize-none"
                />
              </div>

              {/* MESSAGES */}
              {errorMsg && (
                <div className="bg-red-50 text-red-700 p-3.5 rounded-2xl flex items-start gap-2.5 text-xs border border-red-100">
                  <AlertCircle className="h-5 w-5 shrink-0 mt-0.5 animate-pulse" />
                  <div>
                    <p className="font-bold">Erro de Registo</p>
                    <p className="opacity-90 leading-relaxed text-[11px]">{errorMsg}</p>
                  </div>
                </div>
              )}

              {successMsg && (
                <div className="bg-green-50 text-green-700 p-3.5 rounded-2xl flex items-start gap-2.5 text-xs border border-green-100">
                  <CheckCircle className="h-5 w-5 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">Perfil Gravado</p>
                    <p className="opacity-95 leading-relaxed text-[11px]">{successMsg}</p>
                  </div>
                </div>
              )}

              {/* SUBMIT */}
              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="bg-[#ff6600] hover:bg-orange-600 text-white font-bold text-xs uppercase tracking-wider py-3 px-6 rounded-xl flex items-center gap-2 transition-all shadow-md hover:shadow-orange-200 shrink-0 cursor-pointer"
                  id="profile-save-btn"
                >
                  {isSaving ? (
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  <span>Guardar Alterações</span>
                </button>
              </div>

            </form>
          )}
        </div>
      </div>
    </div>
  );
}
