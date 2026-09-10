/** Dados de contato publicos da RLP Maintenance - usados no site de divulgacao. */
export const CONTACT = {
  whatsappNumber: "5515991114373",
  whatsappDisplay: "(15) 99111-4373",
  email: "cmmsrlp@gmail.com",
};

export function buildWhatsAppLink(message: string): string {
  return `https://wa.me/${CONTACT.whatsappNumber}?text=${encodeURIComponent(message)}`;
}
