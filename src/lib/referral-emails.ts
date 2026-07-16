// jela-website/src/lib/referral-emails.ts
// Serbian email templates for the referral program, sent via Resend.

import {
  CREDIT_PERCENT,
  formatDateSr,
  formatEur,
  qrImageUrl,
  referralLandingUrl,
  referralStatusUrl,
} from './referral'

function wrap(title: string, bodyHtml: string): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #fafafa;
          }
          .container {
            background-color: white;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          .header {
            background-color: #8B0000;
            color: white;
            padding: 30px 20px;
            text-align: center;
          }
          .content {
            padding: 30px;
          }
          .highlight {
            background-color: #f9f4f4;
            border-left: 3px solid #8B0000;
            border-radius: 4px;
            padding: 15px;
            margin: 20px 0;
          }
          .code {
            font-size: 28px;
            font-weight: bold;
            letter-spacing: 2px;
            color: #8B0000;
            text-align: center;
          }
          .amount {
            font-size: 32px;
            font-weight: bold;
            color: #8B0000;
            text-align: center;
          }
          .button {
            display: inline-block;
            padding: 12px 30px;
            background-color: #8B0000;
            color: white !important;
            text-decoration: none;
            border-radius: 6px;
            margin: 10px 0;
          }
          .qr {
            text-align: center;
            margin: 20px 0;
          }
          .footer {
            padding: 20px 30px;
            background-color: #f9f9f9;
            border-top: 1px solid #e5e5e5;
            color: #666;
            font-size: 12px;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0; font-size: 26px;">${title}</h1>
          </div>
          <div class="content">
            ${bodyHtml}
          </div>
          <div class="footer">
            <p>Jelena Lazić Tattoo<br>Beograd, Srbija<br>
            <a href="mailto:jelenalazictattoo@gmail.com" style="color: #8B0000;">jelenalazictattoo@gmail.com</a></p>
          </div>
        </div>
      </body>
    </html>
  `
}

export const referralEmails = {
  // 1. To the client, when Jelena creates their code
  codeCreated: (data: { name: string; code: string; secret: string }) => ({
    subject: `Tvoj lični kod za preporuke - ${data.code}`,
    html: wrap(
      'Tvoj kod za preporuke',
      `
        <p>Zdravo ${data.name},</p>
        <p>hvala ti na poverenju! Evo tvog ličnog koda za preporuke:</p>
        <div class="highlight">
          <div class="code">${data.code}</div>
        </div>
        <div class="qr">
          <img src="${qrImageUrl(data.code)}" alt="QR kod ${data.code}" width="220" height="220" style="max-width: 220px;">
          <p style="color: #666; font-size: 14px;">Pokaži ovaj QR kod ili podeli link ispod</p>
        </div>
        <p><strong>Kako funkcioniše:</strong></p>
        <ul>
          <li>Ko dođe na tetovažu s tvojim kodom dobija <strong>${CREDIT_PERCENT}% popusta</strong>.</li>
          <li>Ti dobijaš <strong>${CREDIT_PERCENT}% vrednosti njegove tetovaže</strong> kao popust na svoju sledeću.</li>
          <li>Popusti se sabiraju - više preporuka, veći popust.</li>
        </ul>
        <p style="text-align: center;">
          <a href="${referralLandingUrl(data.code)}" class="button">Link za deljenje</a>
        </p>
        <p>Svoje stanje - koliko si zaradio/la i ko je došao preko tebe - uvek možeš videti ovde:</p>
        <p style="text-align: center;">
          <a href="${referralStatusUrl(data.secret)}" class="button" style="background-color: #555;">Moje stanje</a>
        </p>
        <p style="font-size: 13px; color: #666;">Link "Moje stanje" je samo tvoj - nemoj ga deliti. Za deljenje koristi QR kod ili "Link za deljenje".</p>
      `
    ),
  }),

  // 2. To Jelena, when someone books via a referral code
  bookingReceived: (data: {
    friendName: string
    friendEmail?: string
    friendPhone?: string
    message?: string
    referrerName: string
    code: string
  }) => ({
    subject: `Nova prijava preko koda ${data.code} (${data.referrerName})`,
    html: wrap(
      'Nova prijava - referal program',
      `
        <p><strong>${data.friendName}</strong> želi termin, a došao/la je preko koda <strong>${data.code}</strong> (${data.referrerName}) - ima pravo na ${CREDIT_PERCENT}% popusta.</p>
        <div class="highlight">
          ${data.friendEmail ? `<p style="margin: 5px 0;"><strong>Email:</strong> <a href="mailto:${data.friendEmail}">${data.friendEmail}</a></p>` : ''}
          ${data.friendPhone ? `<p style="margin: 5px 0;"><strong>Telefon:</strong> ${data.friendPhone}</p>` : ''}
          ${data.message ? `<p style="margin: 5px 0;"><strong>Poruka:</strong><br>${data.message.replace(/\n/g, '<br>')}</p>` : ''}
        </div>
        <p>Kad tetovaža bude obavljena, označi je u admin panelu da se popust automatski upiše.</p>
      `
    ),
  }),

  // 3. To the referrer, when their friend's tattoo is completed
  creditEarned: (data: {
    name: string
    friendName: string
    creditEur: number
    balanceEur: number
    expiresAt: string
    secret: string
  }) => ({
    subject: `Zaradio/la si ${formatEur(data.creditEur)} popusta!`,
    html: wrap(
      'Tvoja preporuka se isplatila!',
      `
        <p>Zdravo ${data.name},</p>
        <p><strong>${data.friendName}</strong> je iskoristio/la tvoj kod - i time si zaradio/la:</p>
        <div class="highlight">
          <div class="amount">${formatEur(data.creditEur)}</div>
          <p style="text-align: center; margin: 5px 0 0 0; color: #666;">popusta na tvoju sledeću tetovažu</p>
        </div>
        <p>Tvoje ukupno stanje je sada <strong>${formatEur(data.balanceEur)}</strong>. Ovaj popust važi do <strong>${formatDateSr(data.expiresAt)}</strong>.</p>
        <p style="text-align: center;">
          <a href="${referralStatusUrl(data.secret)}" class="button">Pogledaj svoje stanje</a>
        </p>
      `
    ),
  }),

  // 4. To the referrer, when credits are about to expire
  expiryReminder: (data: {
    name: string
    expiringEur: number
    expiresAt: string
    secret: string
  }) => ({
    subject: `Podsetnik: ${formatEur(data.expiringEur)} popusta ti ističe ${formatDateSr(data.expiresAt)}`,
    html: wrap(
      'Tvoj popust uskoro ističe',
      `
        <p>Zdravo ${data.name},</p>
        <p>samo da te podsetimo - imaš <strong>${formatEur(data.expiringEur)}</strong> popusta koji ističe <strong>${formatDateSr(data.expiresAt)}</strong>.</p>
        <p>Ako planiraš novu tetovažu, javi se na vreme da ga iskoristiš!</p>
        <p style="text-align: center;">
          <a href="${referralStatusUrl(data.secret)}" class="button">Pogledaj svoje stanje</a>
        </p>
      `
    ),
  }),
}
