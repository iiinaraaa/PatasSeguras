import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// React Router não reseta a posição de scroll ao navegar entre rotas.
// Sem isso, rolar pra baixo numa página longa (ex: Meus Pets) e navegar pra
// uma página curta (ex: Dashboard) deixa o usuário "abaixo" do conteúdo,
// precisando rolar pra cima manualmente pra usar a tela.
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
