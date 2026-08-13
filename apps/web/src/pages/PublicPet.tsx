import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Dog, Cat, PawPrint, Phone, MessageCircle, Mail, AtSign, MapPin, PawPrint as PawIcon } from "lucide-react";
import { getPublicPet, type PublicPet as PublicPetType } from "../lib/pets";
import { usePageTitle } from "../hooks/usePageTitle";
import Footer from "../components/Footer";
import pet2 from "../assets/pets/pet-2.jpg";
import pet4 from "../assets/pets/pet-4.jpg";
import dog1 from "../assets/pets/dog-1.png";
import dog3 from "../assets/pets/dog-3.png";
import dog5 from "../assets/pets/dog-5.png";

const speciesIcon = { DOG: Dog, CAT: Cat, OTHER: PawPrint };
const speciesLabel = { DOG: "Cachorro", CAT: "Gato", OTHER: "Outro" };

export default function PublicPet() {
  const { slug } = useParams<{ slug: string }>();
  const [pet, setPet] = useState<PublicPetType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  usePageTitle(pet?.name || "Detalhes do Pet");

  useEffect(() => {
    if (!slug) return;
    getPublicPet(slug)
      .then(setPet)
      .catch((err) => setError(err instanceof Error ? err.message : "Pet não encontrado"))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Carregando...</p>
      </div>
    );
  }

  if (error || !pet) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="max-w-sm w-full bg-white rounded-2xl p-8 border border-gray-200 text-center">
          <PawIcon size={32} className="mx-auto mb-3 text-gray-400" />
          <h1 className="text-lg font-medium mb-1">Pet não encontrado</h1>
          <p className="text-sm text-gray-500">{error || "Este QR Code não corresponde a nenhum pet ativo."}</p>
        </div>
      </div>
    );
  }

  const Icon = speciesIcon[pet.species];
  const medicalGroups = [
    { label: "Alergias", items: pet.allergies },
    { label: "Medicações", items: pet.medications },
    { label: "Condições de saúde", items: pet.diseases },
  ].filter((group) => group.items.length > 0);

  return (
    <div className="relative overflow-hidden min-h-screen bg-gray-50 flex flex-col items-center justify-center px-6 py-10">
      <div className="absolute top-[6%] left-[3%] w-24 h-24 sm:w-32 sm:h-32 bg-brand-100 opacity-70 rounded-[70%_30%_50%_50%/40%_60%_40%_60%] -z-10" />
      <div className="absolute bottom-[8%] right-[-4%] w-32 h-32 sm:w-40 sm:h-40 bg-orange-50 opacity-70 rounded-[35%_65%_60%_40%/55%_45%_65%_35%] -z-10" />

      <img src={dog1} alt="" aria-hidden="true" className="absolute top-[10%] right-[4%] w-16 h-16 sm:w-24 sm:h-24 object-cover opacity-30 rounded-[45%_55%_65%_35%/35%_65%_45%_55%] shadow-md -z-10 animate-float-slow" />
      <img src={pet2} alt="" aria-hidden="true" className="absolute bottom-[14%] left-[2%] w-16 h-16 sm:w-20 sm:h-20 object-cover opacity-30 rounded-[55%_45%_40%_60%/60%_40%_55%_45%] shadow-md -z-10 animate-fade-in [animation-delay:250ms]" />
      <img src={dog3} alt="" aria-hidden="true" className="hidden sm:block absolute top-[45%] left-[-4%] w-24 h-24 object-cover opacity-30 rounded-[60%_40%_30%_70%/65%_35%_60%_40%] shadow-md -z-10 animate-float-slow [animation-delay:400ms]" />
      <img src={pet4} alt="" aria-hidden="true" className="hidden sm:block absolute top-[40%] right-[-3%] w-20 h-20 object-cover opacity-30 rounded-[45%_55%_65%_35%/35%_65%_45%_55%] shadow-md -z-10 animate-fade-in [animation-delay:150ms]" />
      <img src={dog5} alt="" aria-hidden="true" className="hidden sm:block absolute bottom-[4%] left-[45%] w-16 h-16 object-cover opacity-30 rounded-[58%_42%_38%_62%/45%_55%_42%_58%] shadow-md -z-10 animate-float-slow [animation-delay:600ms]" />

      <div className="max-w-sm w-full">
        <div className="bg-brand-600 text-white rounded-2xl px-4 py-3 mb-4 text-sm font-medium text-center flex items-center justify-center gap-2">
          <PawPrint size={18} />
          Estou perdido? Entre em contato com meu tutor!
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6 text-center">
          <div className="w-24 h-24 rounded-full bg-orange-50 flex items-center justify-center overflow-hidden mx-auto mb-4">
            {pet.photoUrl ? (
              <img src={pet.photoUrl} alt={pet.name} className="w-full h-full object-cover" />
            ) : (
              <Icon size={36} className="text-orange-700" />
            )}
          </div>

          <h1 className="text-2xl font-medium mb-1">{pet.name}</h1>
          <p className="text-sm text-gray-500 mb-5">
            {[speciesLabel[pet.species], pet.breed].filter(Boolean).join(" · ")}
          </p>

          {pet.city && (
            <div className="flex items-center justify-center gap-1.5 text-sm text-gray-600 mb-4">
              <MapPin size={15} />
              {pet.city}
            </div>
          )}

          {(pet.contactPhone || pet.contactWhatsapp || pet.contactInstagram || pet.contactEmail) && (
            <div className="border-t border-gray-100 pt-4 mb-4 flex flex-col gap-2">
              <p className="text-sm font-medium mb-1">Contato do tutor</p>
              {pet.contactWhatsapp && (
                <a
                  href={`https://wa.me/${pet.contactWhatsapp.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 text-sm bg-brand-600 text-white h-11 rounded-full hover:bg-brand-800 transition"
                >
                  <MessageCircle size={16} />
                  WhatsApp
                </a>
              )}
              {pet.contactPhone && (
                <a
                  href={`tel:${pet.contactPhone}`}
                  className="flex items-center justify-center gap-2 text-sm border border-gray-300 h-11 rounded-full hover:bg-gray-50 transition"
                >
                  <Phone size={16} />
                  {pet.contactPhone}
                </a>
              )}
              {pet.contactInstagram && (
                <a
                  href={`https://instagram.com/${pet.contactInstagram.replace(/^@/, "")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 text-sm border border-gray-300 h-11 rounded-full hover:bg-gray-50 transition"
                >
                  <AtSign size={16} />
                  {pet.contactInstagram.startsWith("@") ? pet.contactInstagram : `@${pet.contactInstagram}`}
                </a>
              )}
              {pet.contactEmail && (
                <a
                  href={`mailto:${pet.contactEmail}`}
                  className="flex items-center justify-center gap-2 text-sm border border-gray-300 h-11 rounded-full hover:bg-gray-50 transition"
                >
                  <Mail size={16} />
                  {pet.contactEmail}
                </a>
              )}
            </div>
          )}

          {pet.behaviorNotes && (
            <div className="border-t border-gray-100 pt-4 mb-4 text-left">
              <p className="text-sm font-medium mb-1">Comportamento</p>
              <p className="text-sm text-gray-600">{pet.behaviorNotes}</p>
            </div>
          )}

          {medicalGroups.map((group) => (
            <div key={group.label} className="border-t border-gray-100 pt-4 mb-4 text-left">
              <p className="text-sm font-medium mb-1.5">{group.label}</p>
              <ul className="flex flex-col gap-1">
                {group.items.map((item) => (
                  <li key={item.id} className="text-sm text-gray-600">
                    {item.title}
                    {item.details ? ` — ${item.details}` : ""}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-gray-400 mt-5">Patas Seguras — identificação de pets</p>
      </div>

      <Footer />
    </div>
  );
}
