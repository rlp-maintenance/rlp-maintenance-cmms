/**
 * Marca do RLP Maintenance - o arquivo oficial da marca, nao uma recriacao.
 *
 * E' a unica marca do produto: login, barra lateral da gestao e portal do cliente usam
 * este componente em todo lugar - nao ha mais uma marca separada para o sistema de gestao.
 *
 * Dois arquivos em /public/brand, gerados a partir do PNG original da marca:
 *   rlp-maintenance.png        cores originais, fundo transparente (para fundo claro)
 *   rlp-maintenance-light.png  letras em branco, barras verdes (para fundo escuro)
 * O fundo branco do arquivo original foi removido - sem isso a marca aparecia dentro de
 * um retangulo branco em cima do menu azul.
 */

interface CmmsLogoProps {
  /** "light" = para fundo escuro (sidebar, hero); "dark" = para fundo claro. */
  variant?: "light" | "dark";
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const SIZES: Record<NonNullable<CmmsLogoProps["size"]>, string> = {
  sm: "h-8",
  md: "h-11",
  lg: "h-16",
  xl: "h-32",
};

export function CmmsLogo({ variant = "dark", size = "md", className = "" }: CmmsLogoProps) {
  const suffix = variant === "light" ? "-light" : "";
  return (
    <img
      src={`/brand/rlp-maintenance${suffix}.png`}
      alt="RLP Maintenance"
      className={`${SIZES[size]} w-auto ${className}`}
    />
  );
}
