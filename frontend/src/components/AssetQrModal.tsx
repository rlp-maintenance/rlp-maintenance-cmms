import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { Printer } from "lucide-react";
import { Modal } from "./Modal";
import { QRCodeView } from "./QRCodeView";

interface AssetQrModalProps {
  open: boolean;
  onClose: () => void;
  tag: string | null;
  description: string | null;
  path: string;
}

/** QR code do ativo: aponta para a ficha dele (rota interna, atras de login). Quem
 * escaneia sem sessao ativa cai no login e volta pra ca sozinho - o ProtectedRoute ja
 * guarda o destino original. */
export function AssetQrModal({ open, onClose, tag, description, path }: AssetQrModalProps) {
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const url = `${window.location.origin}${path}`;

  useEffect(() => {
    if (!open) return;
    let cancelado = false;
    QRCode.toDataURL(url, { width: 320, margin: 1, color: { dark: "#0b1e3a" } }).then((d) => {
      if (!cancelado) setDataUrl(d);
    });
    return () => {
      cancelado = true;
    };
  }, [open, url]);

  return (
    <Modal open={open} onClose={onClose} title="QR Code do ativo">
      <div className="flex flex-col items-center gap-4">
        <p className="text-center text-sm text-graphite-500">
          Cole esta etiqueta no equipamento. Ao escanear, quem estiver logado abre a ficha direto;{" "}
          quem nao estiver, faz login e cai aqui na volta.
        </p>
        {dataUrl ? (
          <QRCodeView dataUrl={dataUrl} url={url} caption={tag ? `TAG ${tag}` : description ?? undefined} />
        ) : (
          <div className="flex h-40 w-40 items-center justify-center text-sm text-graphite-400">Gerando...</div>
        )}
        {dataUrl && (
          <button type="button" className="btn-outline btn-sm" onClick={() => imprimirEtiqueta(dataUrl, tag, description)}>
            <Printer className="h-4 w-4" /> Imprimir etiqueta
          </button>
        )}
      </div>
    </Modal>
  );
}

function imprimirEtiqueta(dataUrl: string, tag: string | null, description: string | null) {
  const janela = window.open("", "_blank", "width=420,height=520");
  if (!janela) return;
  janela.document.write(`
    <html>
      <head>
        <title>Etiqueta - ${tag ?? "Ativo"}</title>
        <style>
          body { font-family: system-ui, sans-serif; text-align: center; padding: 24px; }
          img { width: 220px; height: 220px; }
          h1 { font-size: 16px; margin: 12px 0 2px; }
          p { font-size: 12px; color: #555; margin: 0; }
        </style>
      </head>
      <body>
        <img src="${dataUrl}" />
        <h1>${tag ? `TAG ${tag}` : "Ativo"}</h1>
        ${description ? `<p>${description}</p>` : ""}
        <script>window.print();</script>
      </body>
    </html>
  `);
  janela.document.close();
}
