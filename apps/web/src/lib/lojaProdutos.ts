// Por agora, só produtos da Petz (link de afiliado já aprovado).
// Cobasi e Petlove serão adicionadas depois, quando os cadastros de afiliado forem aprovados.

export interface ProdutoLoja {
  nome: string;
  imagem: string; // placeholder por enquanto (nome de ícone do lucide-react, usado como fallback)
  loja: string;
  link: string;
  animal: "dog" | "cat";
}

const LINK_PETZ = "https://petz.com.br/parceiro/pataseguras";

export const CUPOM_DESCONTO = "PATASEGURAS";

export const produtosLoja: ProdutoLoja[] = [
  { nome: "Ração Premium 10kg — com cupom PATASEGURAS", imagem: "Package", loja: "Petz", link: LINK_PETZ, animal: "dog" },
  { nome: "Brinquedo Mordedor — com cupom PATASEGURAS", imagem: "Bone", loja: "Petz", link: LINK_PETZ, animal: "dog" },
  { nome: "Coleira Ajustável — com cupom PATASEGURAS", imagem: "CircleDot", loja: "Petz", link: LINK_PETZ, animal: "dog" },
  { nome: "Areia Higiênica para Gatos — com cupom PATASEGURAS", imagem: "Sparkles", loja: "Petz", link: LINK_PETZ, animal: "cat" },
  { nome: "Shampoo Neutro — com cupom PATASEGURAS", imagem: "Droplet", loja: "Petz", link: LINK_PETZ, animal: "cat" },
];
