// Modelo do e-mail que chega ao autor quando alguém usa o formulário de contato.
// E-mail não aceita variáveis CSS nem SVG (Gmail): cores da marca em hex e estilos inline,
// layout em tabelas para funcionar no Gmail, Outlook e Apple Mail.

export type ContactEmailInput = {
  name: string;
  email: string;
  message: string;
  sentAt: Date;
};

// Paleta da marca (spec, seção 3)
const BRAND = {
  primary: "#010066",
  secondary: "#6d4aff",
  background: "#f5f5fa",
  card: "#ffffff",
  foreground: "#0e0e1a",
  muted: "#5c5c70",
  border: "#e3e3ec",
  surface: "#efecfb",
};

const FONT = "'Geist', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
const MONO = "'Geist Mono', 'SFMono-Regular', Consolas, monospace";

export function escapeHtml(text: string) {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "America/Sao_Paulo",
  }).format(date);
}

export function buildContactEmail({ name, email, message, sentAt }: ContactEmailInput) {
  const subject = `Nova mensagem pelo portfólio: ${name}`;
  const when = formatDate(sentAt);
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeMessage = escapeHtml(message).replaceAll("\n", "<br>");
  const replyHref = `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent(
    "Re: contato pelo portfólio",
  )}`;
  const preheader = escapeHtml(message.replace(/\s+/g, " ").slice(0, 110));

  const text = [
    "Nova mensagem pelo portfólio",
    "",
    `Nome: ${name}`,
    `E-mail: ${email}`,
    `Recebida em: ${when} (horário de Brasília)`,
    "",
    message,
    "",
    "Responda este e-mail para falar direto com quem escreveu.",
    "— viniciusvilanova.com",
  ].join("\n");

  const html = `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light">
<meta name="supported-color-schemes" content="light">
<title>${escapeHtml(subject)}</title>
</head>
<body style="margin:0;padding:0;background:${BRAND.background};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${preheader}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BRAND.background};">
  <tr>
    <td align="center" style="padding:32px 16px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;">

        <!-- Marca -->
        <tr>
          <td style="padding:0 4px 16px;font-family:${FONT};">
            <table role="presentation" cellpadding="0" cellspacing="0">
              <tr>
                <td width="36" height="36" align="center" valign="middle" style="width:36px;height:36px;background:${BRAND.secondary};border-radius:10px;color:#ffffff;font-family:${FONT};font-size:20px;font-weight:700;line-height:36px;">V</td>
                <td style="padding-left:10px;font-family:${FONT};font-size:15px;font-weight:700;color:${BRAND.foreground};">vinicius<span style="color:${BRAND.secondary};">.</span></td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Cartão -->
        <tr>
          <td style="background:${BRAND.card};border:1px solid ${BRAND.border};border-radius:20px;overflow:hidden;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">

              <!-- Faixa do topo -->
              <tr>
                <td style="background:${BRAND.primary};padding:28px 28px 24px;font-family:${FONT};">
                  <p style="margin:0 0 6px;font-size:12px;letter-spacing:1.5px;text-transform:uppercase;color:#b9baff;font-weight:500;">Formulário de contato</p>
                  <h1 style="margin:0;font-size:24px;line-height:1.25;color:#ffffff;font-weight:700;">Nova mensagem de ${safeName}</h1>
                  <p style="margin:8px 0 0;font-size:13px;color:#d4d4f5;">${escapeHtml(when)} · horário de Brasília</p>
                </td>
              </tr>

              <!-- Quem escreveu -->
              <tr>
                <td style="padding:24px 28px 8px;font-family:${FONT};">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="padding:0 0 14px;">
                        <p style="margin:0 0 4px;font-size:12px;color:${BRAND.muted};text-transform:uppercase;letter-spacing:1px;">Nome</p>
                        <p style="margin:0;font-size:16px;color:${BRAND.foreground};font-weight:500;">${safeName}</p>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:0 0 6px;">
                        <p style="margin:0 0 4px;font-size:12px;color:${BRAND.muted};text-transform:uppercase;letter-spacing:1px;">E-mail</p>
                        <a href="mailto:${encodeURIComponent(email)}" style="font-family:${MONO};font-size:15px;color:${BRAND.secondary};text-decoration:none;">${safeEmail}</a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Mensagem -->
              <tr>
                <td style="padding:12px 28px 8px;font-family:${FONT};">
                  <p style="margin:0 0 8px;font-size:12px;color:${BRAND.muted};text-transform:uppercase;letter-spacing:1px;">Mensagem</p>
                  <div style="background:${BRAND.surface};border-left:4px solid ${BRAND.secondary};border-radius:12px;padding:16px 18px;font-size:15px;line-height:1.65;color:${BRAND.foreground};">${safeMessage}</div>
                </td>
              </tr>

              <!-- Ação -->
              <tr>
                <td style="padding:20px 28px 28px;font-family:${FONT};">
                  <table role="presentation" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="background:${BRAND.primary};border-radius:10px;">
                        <a href="${replyHref}" style="display:inline-block;padding:12px 22px;font-family:${FONT};font-size:14px;font-weight:500;color:#ffffff;text-decoration:none;">Responder ${safeName}</a>
                      </td>
                    </tr>
                  </table>
                  <p style="margin:12px 0 0;font-size:12px;color:${BRAND.muted};">Ou use “Responder” no seu e-mail: a resposta vai direto para quem escreveu.</p>
                </td>
              </tr>

            </table>
          </td>
        </tr>

        <!-- Rodapé -->
        <tr>
          <td align="center" style="padding:20px 8px 0;font-family:${FONT};font-size:12px;line-height:1.6;color:${BRAND.muted};">
            Enviado pelo formulário de <a href="https://viniciusvilanova.com" style="color:${BRAND.muted};text-decoration:underline;">viniciusvilanova.com</a>
          </td>
        </tr>

      </table>
    </td>
  </tr>
</table>
</body>
</html>`;

  return { subject, html, text };
}
