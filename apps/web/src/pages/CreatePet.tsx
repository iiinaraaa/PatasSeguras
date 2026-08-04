import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { createPet } from "../lib/pets";
import { uploadImage } from "../lib/cloudinary";

export default function CreatePet() {
  const { accessToken } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    species: "DOG",
    breed: "",
    sex: "MALE",
    city: "",
    state: "",
    neighborhood: "",
    number: "",
    complement: "",
    addressNotes: "",
    photoUrl: "",
    contactPhone: "",
    contactWhatsapp: "",
    contactInstagram: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImage(file);
      update("photoUrl", url);
    } catch {
      setError("Erro ao enviar foto");
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!accessToken) return;
    setError("");
    setLoading(true);
    try {
      // Campos opcionais vazios ("") são omitidos em vez de enviados — o backend
      // valida photoUrl como URL, e uma string vazia falharia essa validação.
      const payload = Object.fromEntries(
        Object.entries(form).filter(([, value]) => value !== ""),
      );
      await createPet(accessToken, payload);
      navigate("/dashboard/pets");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao cadastrar pet");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-medium mb-1">Cadastrar pet</h1>
      <p className="text-sm text-gray-500 mb-7">Preencha os dados do seu animal</p>

      {error && <div className="bg-red-50 text-red-800 text-sm rounded-xl px-4 py-3 mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="text-sm font-medium block mb-1.5">Foto</label>
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 rounded-2xl bg-orange-50 flex items-center justify-center overflow-hidden">
              {form.photoUrl ? (
                <img src={form.photoUrl} alt="Foto do pet" className="w-full h-full object-cover" />
              ) : (
                <span className="text-xs text-gray-400">Sem foto</span>
              )}
            </div>
            <label className="text-sm font-medium text-brand-600 cursor-pointer hover:text-brand-800">
              {uploading ? "Enviando..." : "Escolher foto"}
              <input type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} disabled={uploading} />
            </label>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium block mb-1.5">Nome</label>
          <input
            required
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm focus:outline-none focus:border-brand-600"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-medium block mb-1.5">Espécie</label>
            <select
              value={form.species}
              onChange={(e) => update("species", e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm focus:outline-none focus:border-brand-600"
            >
              <option value="DOG">Cachorro</option>
              <option value="CAT">Gato</option>
              <option value="OTHER">Outro</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium block mb-1.5">Sexo</label>
            <select
              value={form.sex}
              onChange={(e) => update("sex", e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm focus:outline-none focus:border-brand-600"
            >
              <option value="MALE">Macho</option>
              <option value="FEMALE">Fêmea</option>
              <option value="UNKNOWN">Não sei</option>
            </select>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium block mb-1.5">Raça</label>
          <input
            value={form.breed}
            onChange={(e) => update("breed", e.target.value)}
            className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm focus:outline-none focus:border-brand-600"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-medium block mb-1.5">Cidade</label>
            <input
              value={form.city}
              onChange={(e) => update("city", e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm focus:outline-none focus:border-brand-600"
            />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1.5">Estado (UF)</label>
            <input
              maxLength={2}
              value={form.state}
              onChange={(e) => update("state", e.target.value.toUpperCase())}
              className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm focus:outline-none focus:border-brand-600"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-medium block mb-1.5">Bairro</label>
            <input
              value={form.neighborhood}
              onChange={(e) => update("neighborhood", e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm focus:outline-none focus:border-brand-600"
            />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1.5">Número</label>
            <input
              value={form.number}
              onChange={(e) => update("number", e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm focus:outline-none focus:border-brand-600"
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium block mb-1.5">Complemento</label>
          <input
            value={form.complement}
            onChange={(e) => update("complement", e.target.value)}
            placeholder="Apto, bloco, ponto de referência..."
            className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm focus:outline-none focus:border-brand-600"
          />
        </div>

        <div>
          <label className="text-sm font-medium block mb-1.5">Observação</label>
          <textarea
            value={form.addressNotes}
            onChange={(e) => update("addressNotes", e.target.value)}
            rows={3}
            placeholder="Informações adicionais sobre o endereço..."
            className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm focus:outline-none focus:border-brand-600 resize-none"
          />
        </div>

        <div className="border-t border-gray-200 pt-4 mt-1">
          <p className="text-sm font-medium mb-3">Contato</p>
          <p className="text-xs text-gray-500 mb-3">
            Exibido na página pública do QR Code, pra quem encontrar seu pet poder falar com você.
          </p>

          <div className="flex flex-col gap-4">
            <div>
              <label className="text-sm font-medium block mb-1.5">Telefone</label>
              <input
                value={form.contactPhone}
                onChange={(e) => update("contactPhone", e.target.value)}
                placeholder="(11) 99999-9999"
                className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm focus:outline-none focus:border-brand-600"
              />
            </div>

            <div>
              <label className="text-sm font-medium block mb-1.5">WhatsApp</label>
              <input
                value={form.contactWhatsapp}
                onChange={(e) => update("contactWhatsapp", e.target.value)}
                placeholder="(11) 99999-9999"
                className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm focus:outline-none focus:border-brand-600"
              />
            </div>

            <div>
              <label className="text-sm font-medium block mb-1.5">Instagram</label>
              <input
                value={form.contactInstagram}
                onChange={(e) => update("contactInstagram", e.target.value)}
                placeholder="@seuperfil"
                className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm focus:outline-none focus:border-brand-600"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-brand-600 text-white font-medium h-11 rounded-full cursor-pointer hover:bg-brand-800 transition disabled:opacity-60 mt-2"
        >
          {loading ? "Salvando..." : "Cadastrar pet"}
        </button>
      </form>
    </div>
  );
}
