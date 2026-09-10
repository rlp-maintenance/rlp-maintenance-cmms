import { Link } from "react-router-dom";
import { Mail, MessageCircle } from "lucide-react";
import { CmmsLogo } from "../components/CmmsLogo";
import { CONTACT, buildWhatsAppLink } from "../lib/publicContact";

export function PublicFooter() {
  const ano = new Date().getFullYear();
  return (
    <footer className="border-t border-white/10 bg-navy-950">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row">
          <div>
            <CmmsLogo variant="light" size="sm" />
            <p className="mt-3 max-w-xs text-sm text-navy-300">
              Gestão de manutenção industrial - ativos, planos preventivos, ordens de serviço e almoxarifado num só lugar.
            </p>
          </div>

          <div className="flex flex-col gap-3 text-sm">
            <a
              href={buildWhatsAppLink("Ola! Quero conhecer o RLP Maintenance CMMS.")}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-navy-200 hover:text-white"
            >
              <MessageCircle className="h-4 w-4" /> {CONTACT.whatsappDisplay}
            </a>
            <a href={`mailto:${CONTACT.email}`} className="flex items-center gap-2 text-navy-200 hover:text-white">
              <Mail className="h-4 w-4" /> {CONTACT.email}
            </a>
            <Link to="/entrar" className="text-navy-200 hover:text-white">
              Acessar minha conta
            </Link>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-xs text-navy-400">
          © {ano} RLP Maintenance. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
}
