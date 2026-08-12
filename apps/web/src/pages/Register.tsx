import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PawPrint, ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import FieldError from "../components/FieldError";
import { inputClass } from "../lib/formStyles";
import { usePageTitle } from "../hooks/usePageTitle";
import Footer from "../components/Footer";
import dog4 from "../assets/pets/dog-4.png";
import pet1 from "../assets/pets/pet-1.jpg";

interface FieldErrors {
  fullName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export default function Register() {
  usePageTitle("Criar Conta");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  function checkPasswordsMatch(pwd: string, confirm: string) {
    setFieldErrors((prev) => ({
      ...prev,
      confirmPassword: confirm && pwd !== confirm ? "As senhas não coincidem" : undefined,
    }));
  }

  function handlePasswordChange(value: string) {
    setPassword(value);
    setFieldErrors((prev) => ({ ...prev, password: undefined }));
    checkPasswordsMatch(value, confirmPassword);
  }

  function handleConfirmPasswordChange(value: string) {
    setConfirmPassword(value);
    checkPasswordsMatch(password, value);
  }

  function validate(): FieldErrors {
    const errors: FieldErrors = {};
    if (!fullName.trim()) errors.fullName = "Informe seu nome completo.";
    if (!email.trim()) errors.email = "Informe seu e-mail.";
    if (!password) errors.password = "Informe uma senha.";
    else if (password.length < 8) errors.password = "A senha deve ter no mínimo 8 caracteres.";
    if (!confirmPassword) errors.confirmPassword = "Confirme sua senha.";
    else if (password !== confirmPassword) errors.confirmPassword = "As senhas não coincidem.";
    return errors;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    const errors = validate();
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setLoading(true);
    try {
      await register(fullName, email, password, confirmPassword);
      showToast("Cadastrado com sucesso!");
      navigate("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao criar conta");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative overflow-hidden min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 py-10 sm:py-12">
      <div className="absolute top-[5%] left-[2%] w-24 h-24 sm:w-32 sm:h-32 bg-orange-50 opacity-70 rounded-[45%_55%_65%_35%/35%_65%_45%_55%] -z-10" />
      <div className="absolute bottom-[10%] left-[-5%] w-36 h-36 sm:w-44 sm:h-44 bg-brand-50 opacity-70 rounded-[70%_30%_50%_50%/40%_60%_40%_60%] -z-10" />
      <div className="absolute top-[45%] right-[-6%] w-24 h-24 sm:w-32 sm:h-32 bg-orange-50 opacity-70 rounded-[60%_40%_30%_70%/65%_35%_60%_40%] -z-10" />

      <img
        src={dog4}
        alt=""
        aria-hidden="true"
        className="absolute top-[12%] left-[4%] w-20 h-20 sm:w-28 sm:h-28 object-cover opacity-30 rounded-[58%_42%_38%_62%/45%_55%_42%_58%] shadow-md -z-10 animate-float-slow"
      />
      <img
        src={pet1}
        alt=""
        aria-hidden="true"
        className="absolute bottom-[14%] right-[3%] w-16 h-16 sm:w-24 sm:h-24 object-cover opacity-30 rounded-[55%_45%_35%_65%/45%_55%_45%_55%] shadow-md -z-10 animate-fade-in [animation-delay:300ms]"
      />

      <div className="max-w-md w-full relative">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-orange-50 rounded-[55%_45%_35%_65%/45%_55%_45%_55%] -z-10" />

        <div className="relative bg-white rounded-2xl p-6 sm:p-10 border border-gray-200">
          <Link to="/" className="flex items-center gap-2.5 mb-8">
            <div className="w-9 h-9 rounded-[60%_40%_55%_45%/55%_45%_60%_40%] bg-brand-600 flex items-center justify-center">
              <PawPrint size={20} className="text-white" />
            </div>
            <span className="font-medium text-lg">Patas Seguras</span>
          </Link>

          <h1 className="text-2xl font-medium mb-1">Crie sua conta</h1>
          <p className="text-gray-500 text-sm mb-7">Gratuito, para sempre</p>

          {error && (
            <div className="bg-red-50 text-red-800 text-sm rounded-xl px-4 py-3 mb-4">{error}</div>
          )}

          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-3.5">
            <div>
              <label className="text-sm font-medium block mb-1.5">Nome completo</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value);
                  setFieldErrors((prev) => ({ ...prev, fullName: undefined }));
                }}
                placeholder="Seu nome"
                className={inputClass(!!fieldErrors.fullName)}
              />
              <FieldError message={fieldErrors.fullName} />
            </div>
            <div>
              <label className="text-sm font-medium block mb-1.5">E-mail</label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setFieldErrors((prev) => ({ ...prev, email: undefined }));
                }}
                placeholder="voce@exemplo.com"
                className={inputClass(!!fieldErrors.email)}
              />
              <FieldError message={fieldErrors.email} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="text-sm font-medium block mb-1.5">Senha</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  placeholder="••••••••"
                  className={inputClass(!!fieldErrors.password)}
                />
                <p className="text-xs text-gray-400 mt-1">Mínimo de 8 caracteres</p>
                <FieldError message={fieldErrors.password} />
              </div>
              <div>
                <label className="text-sm font-medium block mb-1.5">Confirmar</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => handleConfirmPasswordChange(e.target.value)}
                  placeholder="••••••••"
                  className={inputClass(!!fieldErrors.confirmPassword)}
                />
                <FieldError message={fieldErrors.confirmPassword} />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-600 text-white font-medium h-11 rounded-full cursor-pointer hover:bg-brand-800 transition disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
            >
              <ArrowRight size={16} />
              {loading ? "Criando..." : "Criar conta"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Já tem conta?{" "}
            <Link to="/login" className="text-brand-600 font-medium">
              Entrar
            </Link>
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}
