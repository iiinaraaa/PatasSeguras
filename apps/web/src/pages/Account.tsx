import { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import { Camera, Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { uploadImage } from "../lib/cloudinary";
import { apiFetch } from "../lib/api";
import { usePageTitle } from "../hooks/usePageTitle";

export default function Account() {
  usePageTitle("Minha Conta");
  const { user, accessToken, refreshProfile } = useAuth();
  const [fullName, setFullName] = useState(user?.fullName || "");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // user chega de forma assíncrona (via /users/me, depois do refresh no mount do
  // AuthContext); sem isso, um reload de página deixa o campo Nome vazio para sempre,
  // porque o useState acima só le user?.fullName na primeira renderização.
  useEffect(() => {
    setFullName(user?.fullName || "");
  }, [user]);

  async function handlePhotoChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !accessToken) return;

    setError("");
    setUploading(true);
    try {
      const url = await uploadImage(file);
      await apiFetch("/users/me", {
        method: "PATCH",
        headers: { Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify({ photoUrl: url }),
      });
      await refreshProfile();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao enviar foto");
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!accessToken) return;
    setError("");
    setSuccess(false);
    setSaving(true);
    try {
      await apiFetch("/users/me", {
        method: "PATCH",
        headers: { Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify({ fullName }),
      });
      await refreshProfile();
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao salvar");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-medium mb-1">Minha Conta</h1>
      <p className="text-sm text-gray-500 mb-7">Gerencie seus dados pessoais</p>

      <div className="flex items-center gap-4 mb-8">
        <div className="relative w-20 h-20 rounded-full bg-orange-50 flex items-center justify-center overflow-hidden">
          {user?.photoUrl ? (
            <img src={user.photoUrl} alt="Foto de perfil" className="w-full h-full object-cover" />
          ) : (
            <span className="text-2xl font-medium text-orange-700">
              {user?.fullName?.[0]?.toUpperCase() || "?"}
            </span>
          )}
          {uploading && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <Loader2 size={20} className="text-white animate-spin" />
            </div>
          )}
        </div>
        <label className="flex items-center gap-2 text-sm font-medium text-brand-600 cursor-pointer hover:text-brand-800">
          <Camera size={16} />
          Trocar foto
          <input type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
        </label>
      </div>

      {error && <div className="bg-red-50 text-red-800 text-sm rounded-xl px-4 py-3 mb-4">{error}</div>}
      {success && (
        <div className="bg-brand-50 text-brand-800 text-sm rounded-xl px-4 py-3 mb-4">
          Dados atualizados com sucesso!
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="text-sm font-medium block mb-1.5">Nome completo</label>
          <input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm focus:outline-none focus:border-brand-600"
          />
        </div>

        <div>
          <label className="text-sm font-medium block mb-1.5">E-mail</label>
          <input
            value={user?.email || ""}
            disabled
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-500"
          />
          <p className="text-xs text-gray-400 mt-1">Alteração de e-mail ainda não disponível.</p>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="bg-brand-600 text-white font-medium h-11 rounded-full cursor-pointer hover:bg-brand-800 transition disabled:opacity-60 mt-2 w-full sm:w-fit px-6"
        >
          {saving ? "Salvando..." : "Salvar alterações"}
        </button>
      </form>
    </div>
  );
}
