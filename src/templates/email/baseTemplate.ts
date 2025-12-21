import { emailStyles } from './styles';

export interface EmailTemplateProps {
  title: string;
  content: string;
  buttonText?: string;
  buttonUrl?: string;
  footerText?: string;
}

/**
 * Base Email Template
 * This is the main HTML structure for all emails.
 * Customize the layout here if needed.
 */
export function baseEmailTemplate({
  title,
  content,
  buttonText,
  buttonUrl,
  footerText = 'If you did not request this, please ignore this email.',
}: EmailTemplateProps): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
</head>
<body style="${emailStyles.body}">
  <table role="presentation" style="${emailStyles.container}">
    <tr>
      <td align="center" style="${emailStyles.contentWrapper}">
        <!-- Header -->
        <div style="${emailStyles.header}">
          <div style="${emailStyles.logo}">
            <span style="${emailStyles.logoText}">B</span>
          </div>
          <h1 style="${emailStyles.brandName}">
            Bloxy<span style="${emailStyles.brandAccent}">Trades</span>
          </h1>
        </div>

        <!-- Main Content -->
        <div style="${emailStyles.content}">
          <h2 style="${emailStyles.title}">${title}</h2>
          <div style="${emailStyles.text}">
            ${content}
          </div>

          ${buttonText && buttonUrl ? `
          <!-- CTA Button -->
          <div style="${emailStyles.buttonWrapper}">
            <a href="${buttonUrl}" style="${emailStyles.button}">
              ${buttonText}
            </a>
          </div>
          ` : ''}

          <!-- Alternative Link -->
          ${buttonUrl ? `
          <p style="${emailStyles.alternativeLink}">
            Or copy and paste this link into your browser:<br>
            <a href="${buttonUrl}" style="${emailStyles.link}">${buttonUrl}</a>
          </p>
          ` : ''}
        </div>

        <!-- Footer -->
        <div style="${emailStyles.footer}">
          <p style="${emailStyles.footerText}">${footerText}</p>
          <p style="${emailStyles.footerText}">
            © ${new Date().getFullYear()} BloxyTrades. All rights reserved.
          </p>
          <p style="${emailStyles.footerText}">
            Need help? Contact us at <a href="mailto:support@bloxytrades.com" style="${emailStyles.link}">support@bloxytrades.com</a>
          </p>
        </div>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

