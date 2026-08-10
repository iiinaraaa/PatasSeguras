import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Dog, Cat, PawPrint, CircleCheck } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { listPets, type Pet } from "../lib/pets";
import LoadingState from "../components/LoadingState";

const speciesIcon = { DOG: Dog, CAT: Cat, OTHER: PawPrint };

export default function PetsList() {
  const { accessToken } = useAuth();
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!accessToken) return;
    listPets(accessToken)
      .then(setPets)
      .catch((err) => setError(err instanceof Error ? err.message : "Erro ao carregar pets"))
      .finally(() => setLoading(false));
  }, [accessToken]);

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-7">
        <div>
          <h1 className="text-2xl font-medium mb-1">Meus Pets</h1>
          {!loading && (
            <p className="text-sm text-gray-500">
              {pets.length} pet{pets.length === 1 ? "" : "s"} cadastrado{pets.length === 1 ? "" : "s"}
            </p>
          )}
        </div>
        <Link
          to="/dashboard/pets/novo"
          className="bg-brand-600 text-white font-medium h-11 px-5 rounded-full flex items-center justify-center gap-1.5 text-sm hover:bg-brand-800 transition w-full sm:w-auto"
        >
          <Plus size={16} />
          Cadastrar pet
        </Link>
      </div>

      {error && <div className="bg-red-50 text-red-800 text-sm rounded-xl px-4 py-3 mb-4">{error}</div>}

      {loading ? (
        <LoadingState label="Carregando seus pets..." />
      ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {pets.map((pet) => {
          const Icon = speciesIcon[pet.species];
          const location = [pet.neighborhood, pet.city && pet.state ? `${pet.city} - ${pet.state}` : pet.city]
            .filter(Boolean)
            .join(", ");
          return (
            <Link
              key={pet.id}
              to={`/dashboard/pets/${pet.id}`}
              className="bg-white border border-gray-200 rounded-2xl p-4 hover:border-gray-300 transition"
            >
              <div className="w-11 h-11 rounded-[65%_35%_40%_60%/50%_45%_55%_50%] bg-orange-50 flex items-center justify-center mb-3 overflow-hidden">
                {pet.photoUrl ? (
                  <img src={pet.photoUrl} alt={pet.name} className="w-full h-full object-cover" />
                ) : (
                  <Icon size={22} className="text-orange-700" />
                )}
              </div>
              <p className="font-medium text-sm mb-0.5">{pet.name}</p>
              <p className="text-xs text-gray-400 mb-2.5">
                {[pet.breed, location].filter(Boolean).join(" · ") || "Sem detalhes"}
              </p>
              <div className="flex items-center gap-1.5 text-xs text-brand-800">
                <CircleCheck size={13} />
                Ativo
              </div>
            </Link>
          );
        })}

        <Link
          to="/dashboard/pets/novo"
          className="border border-dashed border-gray-300 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 text-gray-400 hover:text-gray-600 hover:border-gray-400 transition min-h-[140px]"
        >
          <Plus size={22} />
          <p className="text-sm">Cadastrar novo pet</p>
        </Link>
      </div>
      )}
    </div>
  );
}
