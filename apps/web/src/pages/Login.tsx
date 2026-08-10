import { useState, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { PawPrint } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import FieldError from "../components/FieldError";
import { inputClass } from "../lib/formStyles";
import { usePageTitle } from "../hooks/usePageTitle";

interface FieldErrors {
  email?: string;
  password?: string;
}

export default function Login() {
  usePageTitle("Entrar");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  function validate(): FieldErrors {
    const errors: FieldErrors = {};
    if (!email.trim()) errors.email = "Informe seu e-mail.";
    if (!password) errors.password = "Informe sua senha.";
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
      await login(email, password, rememberMe);
      navigate("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao entrar");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 py-10 sm:py-12">
      <div className="max-w-md w-full relative">
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-brand-50 rounded-[62%_38%_51%_49%/42%_58%_42%_58%] -z-10" />

        <div className="relative bg-white rounded-2xl p-6 sm:p-10 border border-gray-200">
          <Link to="/" className="flex items-center gap-2.5 mb-8">
            <div className="w-9 h-9 rounded-[60%_40%_55%_45%/55%_45%_60%_40%] bg-brand-600 flex items-center justify-center">
              <PawPrint size={20} className="text-white" />
            </div>
            <span className="font-medium text-lg">Patas Seguras</span>
          </Link>

          <h1 className="text-2xl font-medium mb-1">Bem-vindo de volta</h1>
          <p className="text-gray-500 text-sm mb-7">Entre para cuidar dos seus pets</p>

          {error && (
            <div className="bg-red-50 text-red-800 text-sm rounded-xl px-4 py-3 mb-4">{error}</div>
          )}

          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-3.5">
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
            <div>
              <label className="text-sm font-medium block mb-1.5">Senha</label>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setFieldErrors((prev) => ({ ...prev, password: undefined }));
                }}
                placeholder="••••••••"
                className={inputClass(!!fieldErrors.password)}
              />
              <FieldError message={fieldErrors.password} />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 text-sm mt-1 mb-2">
              <label className="flex items-center gap-2 text-gray-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-3.5 h-3.5"
                />
                Lembrar de mim
              </label>
              <span className="text-brand-600 font-medium cursor-pointer">Esqueci minha senha</span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-600 text-white font-medium h-11 rounded-full cursor-pointer hover:bg-brand-800 transition disabled:opacity-60"
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Não tem conta?{" "}
            <Link to="/cadastro" className="text-brand-600 font-medium">
              Criar conta
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
