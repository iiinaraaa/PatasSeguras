import { Link } from "react-router-dom";
import { ArrowRight, PawPrint, Dog, Cat, Heart, QrCode, ShieldCheck, Phone } from "lucide-react";
import { usePageTitle } from "../hooks/usePageTitle";
import InstallButton from "../components/InstallButton";
import Footer from "../components/Footer";
import pet1 from "../assets/pets/pet-1.jpg";
import pet3 from "../assets/pets/pet-3.png";
import pet5 from "../assets/pets/pet-5.jpg";
import dog2 from "../assets/pets/dog-2.png";
import dog4 from "../assets/pets/dog-4.png";

const blobShapes = [
  "rounded-[70%_30%_50%_50%/40%_60%_40%_60%]",
  "rounded-[35%_65%_60%_40%/55%_45%_65%_35%]",
  "rounded-[60%_40%_30%_70%/65%_35%_60%_40%]",
  "rounded-[45%_55%_65%_35%/35%_65%_45%_55%]",
  "rounded-[55%_45%_40%_60%/60%_40%_55%_45%]",
];

type Decoration =
  | { kind: "photo"; src: string; size: string; shape: string; anim: string; style: { top?: string; left?: string; right?: string; bottom?: string } }
  | { kind: "blob"; size: string; shape: string; style: { top?: string; left?: string; right?: string; bottom?: string } };

const landingDecorations: Decoration[] = [
  { kind: "blob", size: "w-56 h-56 sm:w-72 sm:h-72", shape: blobShapes[0], style: { top: "-8%", right: "-10%" } },
  { kind: "photo", src: pet3, size: "w-20 h-20 sm:w-28 sm:h-28", shape: blobShapes[1], anim: "animate-float-slow", style: { top: "4%", right: "2%" } },
  { kind: "blob", size: "w-32 h-32 sm:w-44 sm:h-44", shape: blobShapes[2], style: { top: "40%", left: "-7%" } },
  { kind: "photo", src: dog4, size: "w-20 h-20 sm:w-28 sm:h-28", shape: blobShapes[4], anim: "animate-fade-in [animation-delay:100ms]", style: { top: "55%", right: "1%" } },
  { kind: "photo", src: pet5, size: "w-16 h-16 sm:w-24 sm:h-24", shape: blobShapes[3], anim: "animate-float-slow [animation-delay:300ms]", style: { top: "78%", left: "-3%" } },
  { kind: "blob", size: "w-40 h-40 sm:w-56 sm:h-56", shape: blobShapes[3], style: { top: "68%", right: "-9%" } },
];

export default function Landing() {
  usePageTitle("Página Inicial");

  return (
    <div className="relative overflow-hidden">
      <div className="hidden sm:block absolute inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden="true">
        {landingDecorations.map((d, i) =>
          d.kind === "photo" ? (
            <img
              key={i}
              src={d.src}
              alt=""
              className={`absolute object-cover opacity-30 ${d.size} ${d.shape} ${d.anim}`}
              style={d.style}
            />
          ) : (
            <div key={i} className={`absolute bg-brand-50 opacity-70 ${d.size} ${d.shape}`} style={d.style} />
          )
        )}
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <nav className="flex items-center justify-between pb-4 sm:pb-5 border-b border-gray-200 mb-8 sm:mb-12">
        <div className="flex items-center gap-2 sm:gap-2.5">
          <div className="w-9 h-9 rounded-[60%_40%_55%_45%/55%_45%_60%_40%] bg-brand-600 flex items-center justify-center shrink-0">
            <PawPrint size={20} className="text-white" />
          </div>
          <span className="font-medium text-lg hidden sm:inline">Patas Seguras</span>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          <Link to="/login">
            <button className="px-3 sm:px-4 h-11 text-sm sm:text-base rounded-full font-medium hover:bg-gray-50 cursor-pointer">Entrar</button>
          </Link>
          <Link to="/cadastro">
            <button className="px-4 sm:px-6 h-11 text-sm sm:text-base rounded-full font-medium bg-brand-600 text-white flex items-center gap-1.5 sm:gap-2 hover:bg-brand-800 transition cursor-pointer">
              <ArrowRight size={16} className="hidden sm:inline" />
              Criar conta
            </button>
          </Link>
        </div>
      </nav>

      <div className="grid md:grid-cols-2 gap-10 md:gap-12 items-center mb-14 sm:mb-20">
        <div>
          <span className="inline-block bg-brand-50 text-brand-800 text-xs font-medium px-3.5 py-1.5 rounded-full mb-4">
            100% gratuito, para sempre
          </span>
          <h1 className="text-3xl sm:text-4xl leading-tight font-medium mb-4">
            Cada pet merece um caminho de volta para casa
          </h1>
          <p className="text-gray-600 text-base leading-relaxed mb-7">
            Cadastre seu pet, gere um QR Code exclusivo, e ajude a reunir animais
            perdidos com seus tutores — para tutores, ONGs e qualquer pessoa que
            queira ajudar.
          </p>
          <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3">
            <Link to="/cadastro" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto justify-center px-6 h-12 rounded-full font-medium bg-brand-600 text-white flex items-center gap-2 hover:bg-brand-800 transition cursor-pointer">
                <ArrowRight size={17} />
                Criar conta
              </button>
            </Link>
            <button className="w-full sm:w-auto px-6 h-12 rounded-full font-medium border border-gray-300 hover:bg-gray-50 transition cursor-pointer">
              Como funciona
            </button>
            <InstallButton className="w-full sm:w-auto h-12" />
          </div>
        </div>

        <div className="relative min-h-[280px]">
          <div className="relative grid grid-cols-2 gap-3.5 z-10">
            <div className="bg-white rounded-2xl p-4 col-span-2 shadow-sm">
              <div className="flex items-center gap-3 mb-2.5">
                <div className="w-11 h-11 rounded-[65%_35%_40%_60%/50%_45%_55%_50%] bg-orange-50 flex items-center justify-center">
                  <Dog size={22} className="text-orange-700" />
                </div>
                <div>
                  <p className="font-medium text-sm">Rex</p>
                  <p className="text-xs text-gray-400">Labrador · São Paulo</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-brand-800">
                <QrCode size={14} />
                <span>QR Code ativo</span>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <div className="w-10 h-10 rounded-[40%_60%_55%_45%/55%_40%_60%_45%] bg-pink-50 flex items-center justify-center mb-2.5">
                <Cat size={18} className="text-pink-700" />
              </div>
              <p className="font-medium text-sm">Luna</p>
              <p className="text-xs text-gray-400">Vacinada</p>
            </div>
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <div className="w-10 h-10 rounded-[55%_45%_35%_65%/45%_55%_45%_55%] bg-amber-50 flex items-center justify-center mb-2.5">
                <Heart size={18} className="text-amber-700" />
              </div>
              <p className="font-medium text-sm">Adoção</p>
              <p className="text-xs text-gray-400">em breve</p>
            </div>
          </div>
        </div>
      </div>

      <div className="sm:hidden relative h-32 mb-8 overflow-hidden" aria-hidden="true">
        <div className="absolute top-0 left-[2%] w-16 h-16 bg-brand-50 opacity-70 rounded-[70%_30%_50%_50%/40%_60%_40%_60%]" />
        <img
          src={pet1}
          alt=""
          className="absolute top-2 left-[24%] w-20 h-20 object-cover opacity-30 rounded-[45%_55%_65%_35%/35%_65%_45%_55%] shadow-md animate-float-slow"
        />
        <img
          src={dog2}
          alt=""
          className="absolute top-0 left-[54%] w-16 h-16 object-cover opacity-30 rounded-[55%_45%_40%_60%/60%_40%_55%_45%] shadow-md animate-fade-in [animation-delay:200ms]"
        />
        <div className="absolute top-4 right-[2%] w-14 h-14 bg-brand-50 opacity-70 rounded-[35%_65%_60%_40%/55%_45%_65%_35%]" />
      </div>

      <div className="grid md:grid-cols-3 gap-5 pt-10 border-t border-gray-200">
        <div>
          <div className="w-11 h-11 rounded-[60%_40%_50%_50%/50%_60%_40%_50%] bg-brand-50 flex items-center justify-center mb-3">
            <QrCode size={20} className="text-brand-800" />
          </div>
          <p className="font-medium text-base mb-1">QR Code exclusivo</p>
          <p className="text-sm text-gray-600 leading-relaxed">
            Cada pet tem um código próprio, fácil de gerar e de escanear.
          </p>
        </div>
        <div>
          <div className="w-11 h-11 rounded-[45%_55%_60%_40%/55%_45%_55%_45%] bg-brand-50 flex items-center justify-center mb-3">
            <ShieldCheck size={20} className="text-brand-800" />
          </div>
          <p className="font-medium text-base mb-1">Dados protegidos</p>
          <p className="text-sm text-gray-600 leading-relaxed">
            Você escolhe o que fica público na página do seu pet.
          </p>
        </div>
        <div>
          <div className="w-11 h-11 rounded-[55%_45%_40%_60%/40%_55%_45%_60%] bg-brand-50 flex items-center justify-center mb-3">
            <Phone size={20} className="text-brand-800" />
          </div>
          <p className="font-medium text-base mb-1">Contato direto com o tutor</p>
          <p className="text-sm text-gray-600 leading-relaxed">
            Quem encontrar seu pet escaneia o QR Code e já vê como falar com você, na
            hora.
          </p>
        </div>
      </div>

      <Footer />
      </div>
    </div>
  );
}
