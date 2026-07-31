import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { PawPrint, CheckCircle2, XCircle } from "lucide-react";
import { apiFetch } from "../lib/api";

export default function ConfirmEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setErrorMessage("Link inválido: token não encontrado.");
      return;
    }

    apiFetch("/auth/confirm-email", {
      method: "POST",
      body: JSON.stringify({ token }),
    })
      .then(() => setStatus("success"))
      .catch((err) => {
        setStatus("error");
        setErrorMessage(err instanceof Error ? err.message : "Erro ao confirmar e-mail");
      });
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-md w-full bg-white rounded-2xl p-10 border border-gray-200 text-center">
        <div className="flex justify-center mb-5">
          <div className="w-9 h-9 rounded-[60%_40%_55%_45%/55%_45%_60%_40%] bg-brand-600 flex items-center justify-center">
            <PawPrint size={20} className="text-white" />
          </div>
        </div>

        {status === "loading" && <p className="text-gray-500">Confirmando seu e-mail...</p>}

        {status === "success" && (
          <>
            <CheckCircle2 className="mx-auto mb-3 text-brand-600" size={40} />
            <h1 className="text-xl font-medium mb-2">E-mail confirmado!</h1>
            <p className="text-gray-500 text-sm mb-6">Sua conta está ativa. Você já pode entrar.</p>
            <Link
              to="/login"
              className="inline-block bg-brand-600 text-white font-medium h-11 px-6 rounded-full leading-[44px] hover:bg-brand-800 transition"
            >
              Ir para o login
            </Link>
          </>
        )}

        {status === "error" && (
          <>
            <XCircle className="mx-auto mb-3 text-red-600" size={40} />
            <h1 className="text-xl font-medium mb-2">Não foi possível confirmar</h1>
            <p className="text-gray-500 text-sm">{errorMessage}</p>
          </>
        )}
      </div>
    </div>
  );
}
