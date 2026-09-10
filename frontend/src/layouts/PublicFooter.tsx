import { Link } from "react-router-dom";
import { Mail, MessageCircle } from "lucide-react";
import { CmmsLogo } from "../components/CmmsLogo";
import { CONTACT, buildWhatsAppLink } from "../lib/publicContact";

export function PublicFooter() {
  const ano = new Date().getFullYear();
  return (
    <footer className="border-t border-white/10 bg-navy-950">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-10 md:flex-row">
          <div>
            <CmmsLogo variant="light" size="sm" />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-navy-300">
              Gestão de manutenção industrial - ativos, planos preventivos, ordens de serviço e almoxarifado num só
              lugar.
            </p>
          </div>

          <div className="flex flex-col gap-3 text-sm">
            <a
              href={buildWhatsAppLink("Ola! Quero conhecer o RLP Maintenance CMMS.")}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-navy-200 transition-colors hover:text-brand-lime"
            >
              <MessageCircle className="h-4 w-4" /> {CONTACT.whatsappDisplay}
            </a>
            <a href={`mailto:${CONTACT.email}`} className="flex items-center gap-2 text-navy-200 transition-colors hover:text-brand-lime">
              <Mail className="h-4 w-4" /> {CONTACT.email}
            </a>
            <Link to="/entrar" className="text-navy-200 transition-colors hover:text-brand-lime">
              Acessar minha conta
            </Link>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-white/10 pt-6 text-xs text-navy-400 sm:flex-row sm:items-center sm:justify-between">
          <span>© {ano} RLP Maintenance. Todos os direitos reservados.</span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-lime" /> RLP Maintenance CMMS
          </span>
        </div>
      </div>
    </footer>
  );
}
