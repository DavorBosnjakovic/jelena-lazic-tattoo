// jela-website/src/app/api/newsletter/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createClient } from '@supabase/supabase-js'

const resend = new Resend(process.env.RESEND_API_KEY)

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    // Validation
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Email format validation
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Check if email already exists
    const { data: existingSubscriber } = await supabase
      .from('newsletter_subscribers')
      .select('email')
      .eq('email', email)
      .single()

    if (existingSubscriber) {
      return NextResponse.json(
        { error: "You're already on our list!" },
        { status: 409 }
      )
    }

    // Add to database
    const { error: dbError } = await supabase
      .from('newsletter_subscribers')
      .insert([
        {
          email,
          is_active: true,
        },
      ])

    if (dbError) {
      console.error('Database error:', dbError)
      return NextResponse.json(
        { error: 'Failed to subscribe. Please try again.' },
        { status: 500 }
      )
    }

    // Send confirmation email
    const { error: emailError } = await resend.emails.send({
      from: 'Jelena Lazić Tattoo <noreply@jelenalazictattoo.com>', // Update with your verified domain
      to: [email],
      subject: 'Welcome to Jelena Lazić Tattoo Updates',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
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
    })

    if (emailError) {
      console.error('Email error:', emailError)
      // Don't fail the request if confirmation email fails
    }

    return NextResponse.json(
      { success: true, message: "You're subscribed! Check your email for confirmation." },
      { status: 200 }
    )
  } catch (error) {
    console.error('Newsletter signup error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}