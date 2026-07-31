import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { createPet } from "../lib/pets";

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
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!accessToken) return;
    setError("");
    setLoading(true);
    try {
      await createPet(accessToken, form);
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
