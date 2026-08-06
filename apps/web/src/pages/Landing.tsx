import { Link } from "react-router-dom";
import { ArrowRight, PawPrint, Dog, Cat, Heart, QrCode, ShieldCheck, MapPin } from "lucide-react";

export default function Landing() {
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
            Cadastre seus animais, gere um QR Code exclusivo e ajude tutores, ONGs e
            protetores a manter cada bichinho seguro e identificável.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link to="/cadastro" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto justify-center px-6 h-12 rounded-full font-medium bg-brand-600 text-white flex items-center gap-2 hover:bg-brand-800 transition cursor-pointer">
                <ArrowRight size={17} />
                Criar conta
              </button>
            </Link>
            <button className="w-full sm:w-auto px-6 h-12 rounded-full font-medium border border-gray-300 hover:bg-gray-50 transition cursor-pointer">
              Como funciona
            </button>
          </div>
        </div>

        <div className="relative min-h-[280px]">
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

      <div className="grid md:grid-cols-3 gap-5 pt-10 border-t border-gray-200">
        <div>
          <div className="w-11 h-11 rounded-[60%_40%_50%_50%/50%_60%_40%_50%] bg-brand-50 flex items-center justify-center mb-3">
            <QrCode size={20} className="text-brand-800" />
          </div>
          <p className="font-medium text-base mb-1">QR Code exclusivo</p>
          <p className="text-sm text-gray-600 leading-relaxed">
            Cada pet tem um código próprio, sem expor dados sensíveis.
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
            <MapPin size={20} className="text-brand-800" />
          </div>
          <p className="font-medium text-base mb-1">Pet perdido</p>
          <p className="text-sm text-gray-600 leading-relaxed">
            Ative um alerta em segundos e aumente as chances de reencontro.
          </p>
        </div>
      </div>
    </div>
  );
}
