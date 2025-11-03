// jela-website/src/lib/resend.ts

import { Resend } from 'resend'

// Lazy initialization - only creates client when actually called
export function getResendClient() {
  const resendApiKey = process.env.RESEND_API_KEY

  if (!resendApiKey) {
    throw new Error('Missing RESEND_API_KEY environment variable')
  }

  return new Resend(resendApiKey)
}

// Email configuration constants
export const EMAIL_CONFIG = {
  from: 'Jelena Lazić Tattoo <noreply@jelenalazictattoo.com>', // Update with your verified domain
  artistEmail: 'jelenalazictattoo@gmail.com',
  supportEmail: 'jelenalazictattoo@gmail.com',
}

// Email templates
export const emailTemplates = {
  contactFormSubmission: (data: {
    fullName: string
    email: string
    phone?: string
    message: string
  }) => ({
    subject: `New Contact Form Submission - ${data.fullName}`,
    html: `
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
            }
            .header {
              background-color: #8B0000;
              color: white;
              padding: 20px;
              text-align: center;
              border-radius: 8px 8px 0 0;
            }
            .content {
              background-color: #f9f9f9;
              padding: 30px;
              border: 1px solid #e5e5e5;
              border-radius: 0 0 8px 8px;
            }
            .field {
              margin-bottom: 20px;
            }
            .label {
              font-weight: bold;
              color: #8B0000;
              margin-bottom: 5px;
            }
            .value {
              padding: 10px;
              background-color: white;
              border-left: 3px solid #8B0000;
              border-radius: 4px;
            }
            .footer {
              margin-top: 20px;
              padding-top: 20px;
              border-top: 1px solid #e5e5e5;
              color: #666;
              font-size: 12px;
              text-align: center;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1 style="margin: 0;">New Contact Form Submission</h1>
          </div>
          <div class="content">
            <div class="field">
              <div class="label">Name:</div>
              <div class="value">${data.fullName}</div>
            </div>
            
            <div class="field">
              <div class="label">Email:</div>
              <div class="value"><a href="mailto:${data.email}">${data.email}</a></div>
            </div>
            
            ${data.phone ? `
            <div class="field">
              <div class="label">Phone:</div>
              <div class="value">${data.phone}</div>
            </div>
            ` : ''}
            
            <div class="field">
              <div class="label">Message:</div>
              <div class="value">${data.message.replace(/\n/g, '<br>')}</div>
            </div>
            
            <div class="footer">
              Submitted: ${new Date().toLocaleString('en-US', { 
                timeZone: 'Europe/Belgrade',
                dateStyle: 'full',
                timeStyle: 'short'
              })}
            </div>
          </div>
        </body>
      </html>
    `,
  }),

  newsletterWelcome: (email: string) => ({
    subject: 'Welcome to Jelena Lazić Tattoo Updates',
    html: `
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
              padding: 40px 20px;
              text-align: center;
            }
            .content {
              padding: 40px 30px;
            }
            .button {
              display: inline-block;
              padding: 12px 30px;
              background-color: #8B0000;
              color: white;
              text-decoration: none;
              border-radius: 6px;
              margin: 20px 0;
            }
            .footer {
              padding: 20px 30px;
              background-color: #f9f9f9;
              border-top: 1px solid #e5e5e5;
              color: #666;
              font-size: 14px;
              text-align: center;
            }
            .social-links {
              margin: 20px 0;
            }
            .social-links a {
              color: #8B0000;
              text-decoration: none;
              margin: 0 10px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0; font-size: 32px;">Welcome!</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">Thank you for subscribing</p>
            </div>
            
            <div class="content">
              <p>Hi there!</p>
              
              <p>Thank you for subscribing to Jelena Lazić Tattoo updates. You'll receive occasional emails about:</p>
              
              <ul style="line-height: 2;">
                <li>New tattoo work and portfolio updates</li>
                <li>Special events and guest spots</li>
                <li>Studio news and announcements</li>
                <li>Booking availability</li>
              </ul>
              
              <p>I promise to keep these emails infrequent and valuable—no spam, just art!</p>
              
              <div style="text-align: center;">
                <a href="https://jelenalazictattoo.com/portfolio" class="button">View Portfolio</a>
              </div>
              
              <div class="social-links">
                <p style="text-align: center; margin-bottom: 10px;"><strong>Follow me on social media:</strong></p>
                <p style="text-align: center;">
                  <a href="https://www.instagram.com/jelena_lazic_tattoo">Instagram</a> •
                  <a href="https://www.facebook.com/jelenalazictattoo">Facebook</a> •
                  <a href="https://www.tiktok.com/@jelenalazictattoo">TikTok</a>
                </p>
              </div>
            </div>
            
            <div class="footer">
              <p>Jelena Lazić Tattoo<br>
              Belgrade, Serbia<br>
              <a href="mailto:jelenalazictattoo@gmail.com" style="color: #8B0000;">jelenalazictattoo@gmail.com</a></p>
              
              <p style="margin-top: 20px; font-size: 12px;">
                You're receiving this email because you subscribed to updates from jelenalazictattoo.com
              </p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),
}