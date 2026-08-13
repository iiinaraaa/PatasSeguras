import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { ChevronLeft, ChevronRight, ExternalLink, Package, Bone, CircleDot, Sparkles, Droplet, Ticket } from "lucide-react";
import { produtosLoja, CUPOM_DESCONTO } from "../lib/lojaProdutos";
import { getRandomDogPhoto, getRandomCatPhoto } from "../lib/petPhotos";
import { usePageTitle } from "../hooks/usePageTitle";
import Spinner from "../components/Spinner";

const icones: Record<string, typeof Package> = { Package, Bone, CircleDot, Sparkles, Droplet };

export default function Loja() {
  usePageTitle("Loja");
  const trilhoRef = useRef<HTMLDivElement>(null);
  const [fotos, setFotos] = useState<(string | null)[]>([]);
  const [loadingFotos, setLoadingFotos] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  const arrastando = useRef(false);
  const inicioX = useRef(0);
  const inicioScroll = useRef(0);

  useEffect(() => {
    let cancelado = false;

    async function carregarFotos() {
      const resultados = await Promise.all(
        produtosLoja.map((produto) =>
          (produto.animal === "cat" ? getRandomCatPhoto() : getRandomDogPhoto()).catch(() => null)
        )
      );
      if (!cancelado) {
        setFotos(resultados);
        setLoadingFotos(false);
      }
    }

    carregarFotos();
    return () => {
      cancelado = true;
    };
  }, []);

  useEffect(() => {
    const el = trilhoRef.current;
    if (!el) return;

    function atualizarIndiceAtivo() {
      if (!el) return;
      const cards = Array.from(el.children) as HTMLElement[];
      let maisProximo = 0;
      let menorDistancia = Infinity;
      cards.forEach((card, i) => {
        const distancia = Math.abs(card.offsetLeft - el.scrollLeft);
        if (distancia < menorDistancia) {
          menorDistancia = distancia;
          maisProximo = i;
        }
      });
      setActiveIndex(maisProximo);
    }

    atualizarIndiceAtivo();
    el.addEventListener("scroll", atualizarIndiceAtivo, { passive: true });
    return () => el.removeEventListener("scroll", atualizarIndiceAtivo);
  }, []);

  function scroll(direcao: "esquerda" | "direita") {
    const el = trilhoRef.current;
    if (!el) return;
    const delta = direcao === "direita" ? el.clientWidth * 0.9 : -el.clientWidth * 0.9;
    el.scrollBy({ left: delta, behavior: "smooth" });
  }

  function irParaCard(i: number) {
    const el = trilhoRef.current;
    const card = el?.children[i] as HTMLElement | undefined;
    if (el && card) el.scrollTo({ left: card.offsetLeft, behavior: "smooth" });
  }

  function onPointerDown(e: ReactPointerEvent<HTMLDivElement>) {
    if (e.pointerType !== "mouse") return;
    const el = trilhoRef.current;
    if (!el) return;
    arrastando.current = true;
    inicioX.current = e.clientX;
    inicioScroll.current = el.scrollLeft;
    el.setPointerCapture(e.pointerId);
  }

  function onPointerMove(e: ReactPointerEvent<HTMLDivElement>) {
    if (!arrastando.current) return;
    const el = trilhoRef.current;
    if (!el) return;
    el.scrollLeft = inicioScroll.current - (e.clientX - inicioX.current);
  }

  function onPointerUp(e: ReactPointerEvent<HTMLDivElement>) {
    arrastando.current = false;
    const el = trilhoRef.current;
    if (el && el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-2xl font-medium">Loja</h1>
        <div className="hidden sm:flex items-center gap-2">
          <button
            onClick={() => scroll("esquerda")}
            aria-label="Anterior"
            className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-50 transition cursor-pointer"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => scroll("direita")}
            aria-label="Próximo"
            className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-50 transition cursor-pointer"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
      <p className="text-gray-500 text-sm mb-4">Produtos recomendados para o seu pet.</p>

      <div className="bg-brand-50 text-brand-800 text-sm rounded-xl px-4 py-3 mb-6 flex items-start gap-2.5">
        <Ticket size={18} className="shrink-0 mt-0.5" />
        <p>
          Compre pela loja oficial usando o cupom <strong>{CUPOM_DESCONTO}</strong> e ajude o
          projeto — clique em qualquer produto abaixo para ir direto à loja parceira.
        </p>
      </div>

      <div
        ref={trilhoRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        className="no-scrollbar flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-2 cursor-grab active:cursor-grabbing select-none"
      >
        {produtosLoja.map((produto, i) => {
          const Icon = icones[produto.imagem] ?? Package;
          const foto = fotos[i];
          return (
            <div
              key={i}
              className="snap-start shrink-0 w-[90%] sm:w-[47%] md:w-[31%] lg:w-[23%] bg-white border border-gray-200 rounded-2xl p-4 hover:border-gray-300 hover:shadow-lg hover:scale-[1.02] transition-all duration-200 flex flex-col"
            >
              <div className="w-full h-32 rounded-xl bg-brand-50 flex items-center justify-center mb-3 overflow-hidden">
                {loadingFotos ? (
                  <Spinner size={22} />
                ) : foto ? (
                  <img src={foto} alt={produto.nome} className="w-full h-full object-cover pointer-events-none" draggable={false} />
                ) : (
                  <Icon size={40} className="text-brand-800" />
                )}
              </div>
              <div className="flex items-center gap-1.5 flex-wrap mb-2">
                <span className="inline-block bg-brand-50 text-brand-800 text-xs font-medium px-2.5 py-1 rounded-full">
                  {produto.loja}
                </span>
                <span className="inline-block bg-amber-50 text-amber-800 text-xs font-medium px-2.5 py-1 rounded-full">
                  Cupom: {CUPOM_DESCONTO}
                </span>
              </div>
              <p className="font-medium text-sm mb-3 flex-1">{produto.nome}</p>
              <a
                href={produto.link}
                target="_blank"
                rel="noreferrer noopener"
                className="bg-brand-600 text-white font-medium h-10 rounded-full flex items-center justify-center gap-1.5 text-sm hover:bg-brand-800 transition"
              >
                Comprar
                <ExternalLink size={14} />
              </a>
            </div>
          );
        })}
      </div>

      <div className="flex justify-center items-center gap-1.5 mt-4">
        {produtosLoja.map((_, i) => (
          <button
            key={i}
            onClick={() => irParaCard(i)}
            aria-label={`Ir para produto ${i + 1}`}
            className={`h-2 rounded-full transition-all cursor-pointer ${
              i === activeIndex ? "bg-brand-600 w-6" : "bg-gray-200 w-2 hover:bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
