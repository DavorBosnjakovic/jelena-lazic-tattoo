// jela-website/src/components/contact/ContactForm.tsx

'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'

type FormData = {
  fullName: string
  email: string
  phone?: string
  message: string
}

export default function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>()

  const onSubmit = async (data: FormData) => {
    setStatus('loading')
    setMessage('')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (response.ok) {
        setStatus('success')
        setMessage("Message sent! We'll get back to you soon.")
        reset()
      } else {
        setStatus('error')
        setMessage(result.error || 'Something went wrong. Please try again or email us directly at jelenalazictattoo@gmail.com')
      }
    } catch (error) {
      setStatus('error')
      setMessage('Something went wrong. Please try again or email us directly at jelenalazictattoo@gmail.com')
    }

    // Reset status after 5 seconds
    setTimeout(() => {
      setStatus('idle')
      setMessage('')
    }, 5000)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Full Name */}
      <div>
        <label htmlFor="fullName" className="block text-sm font-body font-semibold mb-2">
          Full Name <span className="text-accent">*</span>
        </label>
        <input
          id="fullName"
          type="text"
          {...register('fullName', { required: 'Please enter your name' })}
          className={`w-full px-4 py-3 rounded-md border-2 bg-background text-foreground font-body focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all duration-200 ${
            errors.fullName ? 'border-red-500' : 'border-border focus:border-accent'
          }`}
          placeholder="Your name"
        />
        {errors.fullName && (
          <p className="mt-1 text-sm text-red-500">{errors.fullName.message}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-body font-semibold mb-2">
          Email <span className="text-accent">*</span>
        </label>
        <input
          id="email"
          type="email"
          {...register('email', {
            required: 'Please enter your email',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Please enter a valid email address',
            },
          })}
          className={`w-full px-4 py-3 rounded-md border-2 bg-background text-foreground font-body focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all duration-200 ${
            errors.email ? 'border-red-500' : 'border-border focus:border-accent'
          }`}
          placeholder="your@email.com"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
        )}
      </div>

      {/* Phone */}
      <div>
        <label htmlFor="phone" className="block text-sm font-body font-semibold mb-2">
          Phone Number <span className="text-foreground/50">(optional)</span>
        </label>
        <input
          id="phone"
          type="tel"
          {...register('phone')}
          className="w-full px-4 py-3 rounded-md border-2 border-border bg-background text-foreground font-body focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all duration-200"
          placeholder="+381 61 234 5678"
        />
      </div>

      {/* Message */}
      <div>
        <label htmlFor="message" className="block text-sm font-body font-semibold mb-2">
          Message <span className="text-accent">*</span>
        </label>
        <textarea
          id="message"
          rows={6}
          {...register('message', {
            required: 'Please enter your message',
            minLength: {
              value: 10,
              message: 'Message must be at least 10 characters',
            },
          })}
          className={`w-full px-4 py-3 rounded-md border-2 bg-background text-foreground font-body focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all duration-200 resize-none ${
            errors.message ? 'border-red-500' : 'border-border focus:border-accent'
          }`}
          placeholder="Tell me about your tattoo idea..."
        />
        {errors.message && (
          <p className="mt-1 text-sm text-red-500">{errors.message.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full px-6 py-3 bg-accent text-white font-nav font-semibold rounded-md hover:bg-accent/90 hover:scale-102 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
      >
        {status === 'loading' ? 'Sending...' : 'Send Message'}
      </button>

      {/* Status Message */}
      {message && (
        <div
          className={`p-4 rounded-md ${
            status === 'success'
              ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200'
              : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200'
          }`}
        >
          <p className="text-sm font-body">{message}</p>
        </div>
      )}
    </form>
  )
}