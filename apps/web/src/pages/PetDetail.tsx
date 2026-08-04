import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import { ArrowLeft, Dog, Cat, PawPrint, Download, Printer } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getPet, type PetDetail as PetDetailType } from "../lib/pets";

const speciesIcon = { DOG: Dog, CAT: Cat, OTHER: PawPrint };
const speciesLabel = { DOG: "Cachorro", CAT: "Gato", OTHER: "Outro" };
const sexLabel = { MALE: "Macho", FEMALE: "Fêmea", UNKNOWN: "Não sei" };

export default function PetDetail() {
  const { id } = useParams<{ id: string }>();
  const { accessToken } = useAuth();
  const [pet, setPet] = useState<PetDetailType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const qrRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!accessToken || !id) return;
    getPet(accessToken, id)
      .then(setPet)
      .catch((err) => setError(err instanceof Error ? err.message : "Erro ao carregar pet"))
      .finally(() => setLoading(false));
  }, [accessToken, id]);

  const publicUrl = pet?.qrCode ? `${window.location.origin}/p/${pet.qrCode.slug}` : null;

  function handleDownload() {
    const canvas = qrRef.current?.querySelector("canvas");
    if (!canvas || !pet) return;
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = `qrcode-${pet.name}.png`;
    link.click();
  }

  if (loading) {
    return <p className="text-gray-500">Carregando...</p>;
  }

  if (error || !pet) {
    return <div className="bg-red-50 text-red-800 text-sm rounded-xl px-4 py-3">{error || "Pet não encontrado."}</div>;
  }

  const Icon = speciesIcon[pet.species];
  const addressLines = [
    [pet.neighborhood, pet.number].filter(Boolean).join(", "),
    pet.complement,
    pet.city && pet.state ? `${pet.city} - ${pet.state}` : pet.city,
  ].filter(Boolean);

  return (
    <div className="max-w-3xl">
      <Link to="/dashboard/pets" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-6">
        <ArrowLeft size={16} />
        Voltar para Meus Pets
      </Link>

      <div className="grid md:grid-cols-[1fr_auto] gap-8">
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <div className="flex items-start gap-4 mb-5">
            <div className="w-20 h-20 rounded-2xl bg-orange-50 flex items-center justify-center overflow-hidden shrink-0">
              {pet.photoUrl ? (
                <img src={pet.photoUrl} alt={pet.name} className="w-full h-full object-cover" />
              ) : (
                <Icon size={32} className="text-orange-700" />
              )}
            </div>
            <div>
              <h1 className="text-2xl font-medium mb-1">{pet.name}</h1>
              <p className="text-sm text-gray-500">
                {[speciesLabel[pet.species], pet.breed, sexLabel[pet.sex]].filter(Boolean).join(" · ")}
              </p>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-4">
            <p className="text-sm font-medium mb-1.5">Endereço</p>
            {addressLines.length > 0 ? (
              addressLines.map((line, i) => (
                <p key={i} className="text-sm text-gray-600">
                  {line}
                </p>
              ))
            ) : (
              <p className="text-sm text-gray-400">Nenhum endereço cadastrado.</p>
            )}
          </div>

          {pet.addressNotes && (
            <div className="border-t border-gray-100 pt-4 mt-4">
              <p className="text-sm font-medium mb-1.5">Observação</p>
              <p className="text-sm text-gray-600">{pet.addressNotes}</p>
            </div>
          )}
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col items-center text-center h-fit">
          <p className="text-sm font-medium mb-3">QR Code do pet</p>
          {publicUrl ? (
            <>
              <div ref={qrRef} className="p-3 bg-white rounded-xl border border-gray-100 mb-4">
                <QRCodeCanvas value={publicUrl} size={160} />
              </div>
              <p className="text-xs text-gray-400 mb-4 max-w-[180px] break-all">{publicUrl}</p>
              <div className="flex gap-2">
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-1.5 text-sm font-medium bg-brand-600 text-white h-10 px-4 rounded-full cursor-pointer hover:bg-brand-800 transition"
                >
                  <Download size={15} />
                  Baixar
                </button>
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 text-sm font-medium border border-gray-300 h-10 px-4 rounded-full cursor-pointer hover:bg-gray-50 transition"
                >
                  <Printer size={15} />
                  Imprimir
                </button>
              </div>
            </>
          ) : (
            <p className="text-sm text-gray-400">Este pet ainda não tem um QR Code.</p>
          )}
        </div>
      </div>
    </div>
  );
}
