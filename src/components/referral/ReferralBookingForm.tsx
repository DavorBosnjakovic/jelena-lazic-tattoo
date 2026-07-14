// jela-website/src/components/referral/ReferralBookingForm.tsx

'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslations } from 'next-intl'

type FormData = {
  fullName: string
  email: string
  phone?: string
  message?: string
}

export default function ReferralBookingForm({ code }: { code: string }) {
  const t = useTranslations('referral')
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
      const response = await fetch('/api/referral/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, code }),
      })

      if (response.ok) {
        setStatus('success')
        setMessage(t('formSuccess'))
        reset()
      } else {
        setStatus('error')
        setMessage(t('formError'))
      }
    } catch {
      setStatus('error')
      setMessage(t('formError'))
    }
  }

  if (status === 'success') {
    return (
      <div className="p-6 rounded-md bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200">
        <p className="font-body">{message}</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label htmlFor="fullName" className="block text-sm font-body font-semibold mb-2">
          {t('nameLabel')} <span className="text-accent">*</span>
        </label>
        <input
          id="fullName"
          type="text"
          {...register('fullName', { required: t('nameRequired') })}
          className={`w-full px-4 py-3 rounded-md border-2 bg-background text-foreground font-body focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all duration-200 ${
            errors.fullName ? 'border-red-500' : 'border-border focus:border-accent'
          }`}
          placeholder={t('namePlaceholder')}
        />
        {errors.fullName && (
          <p className="mt-1 text-sm text-red-500">{errors.fullName.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-body font-semibold mb-2">
          {t('emailLabel')} <span className="text-accent">*</span>
        </label>
        <input
          id="email"
          type="email"
          {...register('email', {
            required: t('emailRequired'),
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: t('emailInvalid'),
            },
          })}
          className={`w-full px-4 py-3 rounded-md border-2 bg-background text-foreground font-body focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all duration-200 ${
            errors.email ? 'border-red-500' : 'border-border focus:border-accent'
          }`}
          placeholder={t('emailPlaceholder')}
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-body font-semibold mb-2">
          {t('phoneLabel')} <span className="text-foreground/50">{t('phoneOptional')}</span>
        </label>
        <input
          id="phone"
          type="tel"
          {...register('phone')}
          className="w-full px-4 py-3 rounded-md border-2 border-border bg-background text-foreground font-body focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all duration-200"
          placeholder={t('phonePlaceholder')}
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-body font-semibold mb-2">
          {t('messageLabel')} <span className="text-foreground/50">{t('phoneOptional')}</span>
        </label>
        <textarea
          id="message"
          rows={5}
          {...register('message')}
          className="w-full px-4 py-3 rounded-md border-2 border-border bg-background text-foreground font-body focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all duration-200 resize-none"
          placeholder={t('messagePlaceholder')}
        />
      </div>

      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full px-6 py-3 bg-accent text-white font-nav font-semibold rounded-md hover:bg-accent/90 hover:scale-102 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
      >
        {status === 'loading' ? t('sending') : t('send')}
      </button>

      {status === 'error' && message && (
        <div className="p-4 rounded-md bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200">
          <p className="text-sm font-body">{message}</p>
        </div>
      )}
    </form>
  )
}
