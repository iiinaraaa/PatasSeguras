import { Link } from "react-router-dom";
import { ArrowRight, PawPrint, Dog, Cat, Heart, QrCode, ShieldCheck, Phone } from "lucide-react";
import { usePageTitle } from "../hooks/usePageTitle";
import InstallButton from "../components/InstallButton";
import Footer from "../components/Footer";
import pet1 from "../assets/pets/pet-1.jpg";
import pet2 from "../assets/pets/pet-2.jpg";
import pet3 from "../assets/pets/pet-3.png";
import pet4 from "../assets/pets/pet-4.jpg";
import pet5 from "../assets/pets/pet-5.jpg";
import dog1 from "../assets/pets/dog-1.png";
import dog2 from "../assets/pets/dog-2.png";
import dog3 from "../assets/pets/dog-3.png";
import dog4 from "../assets/pets/dog-4.png";
import dog5 from "../assets/pets/dog-5.png";

const blobShapes = [
  "rounded-[55%_45%_35%_65%/45%_55%_45%_55%]",
  "rounded-[60%_40%_55%_45%/55%_45%_60%_40%]",
  "rounded-[45%_55%_60%_40%/55%_45%_55%_45%]",
  "rounded-[58%_42%_38%_62%/45%_55%_42%_58%]",
];

const galleryPhotos = [pet1, dog1, pet2, dog2, pet3, dog3, pet4, dog4, pet5, dog5];

export default function Landing() {
  usePageTitle("Página Inicial");

  return (
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

        <div className="relative min-h-[280px] overflow-hidden">
          <div className="absolute -top-8 -right-5 w-52 h-52 bg-brand-50 rounded-[62%_38%_51%_49%/42%_58%_42%_58%] z-0" />

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

      <div className="hidden sm:flex flex-wrap justify-center items-center gap-4 sm:gap-5 mb-10 sm:mb-14 overflow-hidden">
        {galleryPhotos.map((src, i) => (
          <img
            key={src}
            src={src}
            alt=""
            aria-hidden="true"
            className={`w-16 h-16 sm:w-20 sm:h-20 object-cover shadow-sm ${blobShapes[i % blobShapes.length]} ${
              i % 2 === 0 ? "animate-float-slow" : "animate-fade-in"
            }`}
            style={{ animationDelay: `${i * 150}ms` }}
          />
        ))}
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
  );
}
