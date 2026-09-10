import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { CmmsLogo } from "../components/CmmsLogo";
import { buildWhatsAppLink } from "../lib/publicContact";

const NAV_LINKS = [
  { href: "#funcionalidades", label: "Funcionalidades" },
  { href: "#como-funciona", label: "Como funciona" },
  { href: "#indicadores", label: "Indicadores" },
];

export function PublicHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="shrink-0" onClick={() => setOpen(false)}>
          <CmmsLogo variant="dark" size="sm" />
        </Link>

        <nav className="hidden items-center gap-9 md:flex">
          {NAV_LINKS.map((l) => (
            <a key={l.href} href={l.href} className="text-sm font-semibold text-graphite-700 transition-colors hover:text-navy-900">
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-6 md:flex">
          <Link to="/entrar" className="text-sm font-semibold text-graphite-700 transition-colors hover:text-navy-900">
            Entrar
          </Link>
          <a
            href={buildWhatsAppLink("Ola! Quero conhecer o RLP Maintenance CMMS.")}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md bg-navy-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-navy-800"
          >
            Falar com a equipe
          </a>
        </div>

        <button
          type="button"
          className="text-graphite-700 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          aria-expanded={open}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-gray-200 bg-white px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-4">
            {NAV_LINKS.map((l) => (
              <a key={l.href} href={l.href} className="text-sm font-semibold text-graphite-700" onClick={() => setOpen(false)}>
                {l.label}
              </a>
            ))}
            <Link to="/entrar" className="text-sm font-semibold text-graphite-700" onClick={() => setOpen(false)}>
              Entrar
            </Link>
            <a
              href={buildWhatsAppLink("Ola! Quero conhecer o RLP Maintenance CMMS.")}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md bg-navy-900 px-5 py-2.5 text-center text-sm font-semibold text-white"
            >
              Falar com a equipe
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
