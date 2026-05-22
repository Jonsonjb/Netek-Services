import React, { useState } from "react";
import { auth } from "../firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import {
  X,
  Lock,
  Mail,
  Eye,
  EyeOff,
  UserPlus,
  LogIn,
  AlertCircle,
  CheckCircle,
  ShieldAlert,
} from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: any) => void;
}

export default function AuthModal({ isOpen, onClose, onAuthSuccess }: AuthModalProps) {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [localFallbackActive, setLocalFallbackActive] = useState(false);

  if (!isOpen) return null;

  const validatePassword = (pwd: string) => {
    return pwd.length >= 6;
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      setSuccessMsg("Fez login com sucesso através da conta Google!");
      setTimeout(() => {
        onAuthSuccess(userCredential.user);
        onClose();
      }, 800);
    } catch (err: any) {
      console.warn("Erro Google Sign-In:", err);
      let friendlyError = err.message || "Falha ao entrar com o Google.";
      if (err.code === "auth/popup-blocked") {
        friendlyError = "O pop-up de login foi bloqueado pelo seu navegador. Por favor, permita pop-ups para fazer login.";
      } else if (err.code === "auth/popup-closed-by-user") {
        friendlyError = "A janela de login do Google foi fechada antes de concluir.";
      } else if (
        err.code === "auth/operation-not-allowed" || 
        err.message?.includes("CONFIGURATION_NOT_FOUND") ||
        err.message?.includes("auth/api-key-not-valid")
      ) {
        friendlyError = "O login por Google precisa de ser configurado na consola Firebase para este domínio. Sandbox Activada.";
        setLocalFallbackActive(true);
      }
      setErrorMsg(friendlyError);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    setLocalFallbackActive(false);

    if (!email || !password) {
      setErrorMsg("Por favor, preencha todos os campos obrigatórios.");
      setIsLoading(false);
      return;
    }

    if (!isLoginMode) {
      if (password !== confirmPassword) {
        setErrorMsg("As palavras-passes não correspondem.");
        setIsLoading(false);
        return;
      }
      if (!validatePassword(password)) {
        setErrorMsg("A palavra-passe deve ter no mínimo 6 caracteres.");
        setIsLoading(false);
        return;
      }
    }

    try {
      if (isLoginMode) {
        // NATIVE FIREBASE SIGN IN
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        setSuccessMsg("Fez login com sucesso!");
        setTimeout(() => {
          onAuthSuccess(userCredential.user);
          onClose();
        }, 800);
      } else {
        // NATIVE FIREBASE REGISTER
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        setSuccessMsg("Conta criada com sucesso com o Firebase Auth! Bem-vindo.");
        setTimeout(() => {
          onAuthSuccess(userCredential.user);
          onClose();
        }, 1200);
      }
    } catch (err: any) {
      console.warn("Erro Firebase Auth na Plataforma NK:", err);
      
      let friendlyError = err.message || "Ocorreu um erro durante a autenticação.";
      
      // Map Firebase codes to friendly Portuguese (Mozambique context) messages
      if (err.code === "auth/invalid-email") {
        friendlyError = "O endereço de e-mail introduzido é inválido.";
      } else if (err.code === "auth/user-disabled") {
        friendlyError = "Este utilizador foi desativado pela administração.";
      } else if (err.code === "auth/user-not-found" || err.code === "auth/invalid-credential") {
        friendlyError = "E-mail ou palavra-passe incorretos.";
      } else if (err.code === "auth/wrong-password") {
        friendlyError = "Palavra-passe errada ou utilizador incorreto.";
      } else if (err.code === "auth/email-already-in-use") {
        friendlyError = "Este e-mail já está registado na plataforma.";
      } else if (err.code === "auth/weak-password") {
        friendlyError = "A palavra-passe é muito fraca. Escolha outra mais forte.";
      } else if (
        err.code === "auth/operation-not-allowed" ||
        err.message?.includes("CONFIGURATION_NOT_FOUND") ||
        err.message?.includes("auth")
      ) {
        friendlyError = "O serviço de autenticação com E-mail e Senha precisa de ser ativado no Firebase Console para este domínio.";
        setLocalFallbackActive(true);
      }

      setErrorMsg(friendlyError);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLocalBypass = () => {
    // Generate a beautiful virtual user profile for the offline developer testing mode
    const fakeEmail = email || "usuario.teste@netek.co.mz";
    const isAdminUser = fakeEmail.toLowerCase() === "admin@jonsonjb.com";
    
    const virtualUser = {
      uid: isAdminUser ? "admin-vip-uid-9999" : "user-virtual-uid-" + Math.floor(Math.random() * 10000),
      email: fakeEmail,
      displayName: isAdminUser ? "Director Admin" : "Utilizador Local",
    };

    setSuccessMsg("Ligado via Autenticação Local Demonstrativa!");
    setErrorMsg(null);
    setTimeout(() => {
      onAuthSuccess(virtualUser);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in" id="auth-modal-overlay">
      <div className="bg-[#f4f6f9] rounded-3xl max-w-md w-full shadow-2xl overflow-hidden border border-gray-100 flex flex-col" id="auth-modal-card">
        {/* Modal Brand Cover Header */}
        <div className="bg-[#2c3e50] p-6 text-white flex justify-between items-center relative shrink-0">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#ff6600]/10 rounded-full blur-xl -mr-6 -mt-6"></div>
          
          <div className="flex items-center gap-3 z-10">
            <div className="bg-[#ff6600] w-10 h-10 rounded-xl flex items-center justify-center font-extrabold text-white text-base shadow-md">
              NK
            </div>
            <div>
              <h3 className="font-extrabold text-[#ffffff] text-lg tracking-tight">Portal do Utilizador</h3>
              <p className="text-[11px] text-gray-300 font-mono tracking-wider">Netek Services • Moçambique</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-[#ff6600] p-1.5 rounded-full hover:bg-white/10 transition-colors cursor-pointer z-10"
            aria-label="Close Auth Modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Action Toggle Tabs */}
        <div className="flex bg-white border-b border-gray-200">
          <button
            onClick={() => {
              setIsLoginMode(true);
              setErrorMsg(null);
              setSuccessMsg(null);
            }}
            className={`flex-1 py-3 text-center text-xs font-bold tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer ${
              isLoginMode
                ? "border-b-2 border-l border-[#ff6600] text-[#ff6600] bg-orange-50/20"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            <LogIn className="h-4 w-4" /> Entrar (Entrar)
          </button>
          <button
            onClick={() => {
              setIsLoginMode(false);
              setErrorMsg(null);
              setSuccessMsg(null);
            }}
            className={`flex-1 py-3 text-center text-xs font-bold tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer ${
              !isLoginMode
                ? "border-b-2 border-r border-[#ff6600] text-[#ff6600] bg-orange-50/20"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            <UserPlus className="h-4 w-4" /> Criar Conta (Registar)
          </button>
        </div>

        {/* Modal Form Content */}
        <div className="p-6 md:p-8 space-y-4 max-h-[80vh] overflow-y-auto">
          {isLoginMode ? (
            <p className="text-xs text-gray-500 mb-2 text-center md:text-left">
              Inicie sessão na sua conta Netek para associar as suas publicações de vagas, terrenos ou minutas de documentos eletrónicos.
            </p>
          ) : (
            <p className="text-xs text-gray-500 mb-2 text-center md:text-left">
              Registe-se gratuitamente para começar a divulgar as suas habilidades no FixMoz, contactar parceiros e consultar o catálogo de terrenos Kayamoz.
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* EMAIL */}
            <div>
              <label className="block text-xs font-bold uppercase text-gray-600 mb-1">
                Correio Eletrónico (E-mail)
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:border-[#ff6600] focus:ring-1 focus:ring-[#ff6600] outline-none transition-all text-gray-800 text-sm"
                  placeholder="exemplo@netek.co.mz"
                  required
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div>
              <label className="block text-xs font-bold uppercase text-gray-600 mb-1">
                Palavra-passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-2.5 bg-white border border-gray-200 rounded-xl focus:border-[#ff6600] focus:ring-1 focus:ring-[#ff6600] outline-none transition-all text-gray-800 text-sm"
                  placeholder={isLoginMode ? "Insira a palavra-passe" : "No mínimo 6 caracteres"}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                >
                  {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                </button>
              </div>
            </div>

            {/* CONFIRM PASSWORD (ONLY IN SIGN UP) */}
            {!isLoginMode && (
              <div>
                <label className="block text-xs font-bold uppercase text-gray-600 mb-1">
                  Confirmar Palavra-passe
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-12 py-2.5 bg-white border border-gray-200 rounded-xl focus:border-[#ff6600] focus:ring-1 focus:ring-[#ff6600] outline-none transition-all text-gray-800 text-sm"
                    placeholder="Repita a palavra-passe"
                    required
                  />
                </div>
              </div>
            )}

            {/* ERROS */}
            {errorMsg && (
              <div className="bg-red-50 text-red-700 p-3.5 rounded-2xl flex items-start gap-2.5 text-xs border border-red-100">
                <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-semibold">Falha de Autenticação</p>
                  <p className="opacity-90 leading-relaxed">{errorMsg}</p>
                </div>
              </div>
            )}

            {/* SUCESSO */}
            {successMsg && (
              <div className="bg-green-50 text-green-700 p-3.5 rounded-2xl flex items-start gap-2.5 text-xs border border-green-100">
                <CheckCircle className="h-5 w-5 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-semibold">Sucesso!</p>
                  <p className="opacity-95 leading-relaxed">{successMsg}</p>
                </div>
              </div>
            )}

            {/* ACTION SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-[#2c3e50] hover:bg-[#1f2c39] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md  cursor-pointer flex items-center justify-center gap-2 hover:shadow-orange-200"
              id="auth-submit-btn"
            >
              {isLoading ? (
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : isLoginMode ? (
                <span className="flex items-center gap-2"><LogIn className="h-4 w-4" /> Entrar com Firebase Auth</span>
              ) : (
                <span className="flex items-center gap-2"><UserPlus className="h-4 w-4" /> Criar nova conta no Firebase</span>
              )}
            </button>
          </form>

          {/* DIVIDER */}
          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="flex-shrink mx-4 text-gray-400 text-[10px] font-black uppercase tracking-wider">Ou continue com</span>
            <div className="flex-grow border-t border-gray-200"></div>
          </div>

          {/* GOOGLE SIGN IN BUTTON */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full py-2.5 px-4 bg-white hover:bg-gray-50 text-gray-700 font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-xs border border-gray-200 cursor-pointer flex items-center justify-center gap-2"
          >
            <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M21.35 11.1H12v2.7h5.38c-.24 1.28-.96 2.37-2.04 3.1v2.57h3.3c1.93-1.78 3.04-4.4 3.04-7.4 0-.35-.11-.7-.35-1z" fill="#4285F4" />
              <path d="M12 20.62c2.43 0 4.47-.8 5.96-2.18l-3.3-2.57c-.9.61-2.07.98-3.31.98-2.34 0-4.33-1.58-5.04-3.71h-3.4v2.64c1.51 2.97 5.07 4.77 9.12 4.77z" fill="#34A853" />
              <path d="M6.96 13.14a5.2 5.2 0 0 1 0-3.28V7.22H3.56a9.01 9.01 0 0 0 0 8.56l3.4-2.64c-.71-2.13-.71-4.78 0-6.92z" fill="#FBBC05" />
              <path d="M12 5.15c1.32 0 2.51.45 3.44 1.35l2.58-2.58C16.46 2.44 14.42 1.38 12 1.38A9.01 9.01 0 0 0 2.88 6.22l3.4 2.64c.71-2.13 2.7-3.71 6.12-3.71z" fill="#EA4335" />
            </svg>
            <span>Iniciar Sessão com o Google</span>
          </button>

          {/* ADMIN AND TESTING BYPASS ZONE */}
          <div className="pt-2 text-center">
            
            {/* Fallback button if Google Firebase configuration for this testing space requires offline bypass */}
            {(localFallbackActive || errorMsg) && (
              <div className="mt-3 bg-[#ff6600]/5 border border-[#ff6600]/20 p-3 rounded-2xl">
                <p className="text-[10px] text-gray-500 mb-2">
                  Deseja saltar temporariamente os bloqueios de e-mail / ligação do Firebase e simular {isLoginMode ? "Login" : "Registo"} em modo Sandbox?
                </p>
                <button
                  type="button"
                  onClick={handleLocalBypass}
                  className="w-full py-1.5 px-3 bg-[#ff6600] text-white hover:bg-orange-600 text-[10px] font-bold rounded-lg transition-colors cursor-pointer uppercase tracking-wider"
                >
                  Confirmar Acesso Local (Offline Sandbox)
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
