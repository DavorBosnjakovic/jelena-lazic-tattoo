// jela-website/src/app/api/newsletter/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { getResendClient, emailTemplates, EMAIL_CONFIG } from '@/lib/resend'
import { getSupabaseClient } from '@/lib/supabase'

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

    // Initialize clients INSIDE the route handler (runtime, not build time)
    const supabase = getSupabaseClient()
    const resend = getResendClient()

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

    // Send confirmation email using the template from lib
    const emailTemplate = emailTemplates.newsletterWelcome(email)
    const { error: emailError } = await resend.emails.send({
      from: EMAIL_CONFIG.from,
      to: [email],
      subject: emailTemplate.subject,
      html: emailTemplate.html,
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