// jela-website/src/types/index.ts

/**
 * Portfolio Image Type
 */
export interface PortfolioImage {
  id: string
  image_url: string
  title?: string | null
  description?: string | null
  category?: string | null
  order: number
  created_at: string
  updated_at: string
}

/**
 * Hero Image Type
 */
export interface HeroImage {
  id: string
  image_url: string
  position: number
  is_active: boolean
  created_at: string
  updated_at: string
}

/**
 * Newsletter Subscriber Type
 */
export interface NewsletterSubscriber {
  id: string
  email: string
  subscribed_at: string
  is_active: boolean
}

/**
 * Contact Submission Type
 */
export interface ContactSubmission {
  id: string
  full_name: string
  email: string
  phone?: string | null
  message: string
  submitted_at: string
  status: 'new' | 'read' | 'replied'
}

/**
 * Contact Form Data
 */
export interface ContactFormData {
  fullName: string
  email: string
  phone?: string
  message: string
}

/**
 * Newsletter Form Data
 */
export interface NewsletterFormData {
  email: string
}

/**
 * API Response Type
 */
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

/**
 * Theme Type
 */
export type Theme = 'light' | 'dark'

/**
 * Social Link Type
 */
export interface SocialLink {
  name: string
  url: string
  icon: React.ReactNode
}

/**
 * Navigation Item Type
 */
export interface NavItem {
  label: string
  href: string
}

/**
 * Form Status Type
 */
export type FormStatus = 'idle' | 'loading' | 'success' | 'error'

/**
 * Button Variant Type
 */
export type ButtonVariant = 'primary' | 'secondary' | 'outline'

/**
 * Button Size Type
 */
export type ButtonSize = 'sm' | 'md' | 'lg'

/**
 * Modal Size Type
 */
export type ModalSize = 'sm' | 'md' | 'lg' | 'xl'

/**
 * Portfolio Category Type (for future filtering)
 */
export type PortfolioCategory =
  | 'realistic'
  | 'traditional'
  | 'black-grey'
  | 'color'
  | 'portrait'
  | 'abstract'
  | 'geometric'
  | 'floral'
  | 'all'

/**
 * Custom Design Type (for future store)
 */
export interface CustomDesign {
  id: string
  image_url: string
  title: string
  description: string
  type: 'classic' | 'exclusive'
  price: number
  is_available: boolean
  created_at: string
}

/**
 * Store Product Type (for future store)
 */
export interface StoreProduct {
  id: string
  name: string
  description: string
  price: number
  images: string[]
  category: 'print' | 'merchandise' | 'digital' | 'design'
  stock: number
  is_available: boolean
  created_at: string
}

/**
 * Email Template Data Types
 */
export interface ContactEmailData {
  fullName: string
  email: string
  phone?: string
  message: string
}

export interface NewsletterEmailData {
  email: string
}

/**
 * Supabase Storage Bucket Names
 */
export const STORAGE_BUCKETS = {
  HERO_IMAGES: 'hero-images',
  PORTFOLIO_IMAGES: 'portfolio-images',
  ABOUT_IMAGES: 'about-images',
  STORE_IMAGES: 'store-images',
  LOGO_IMAGES: 'logo-images',
} as const

export type StorageBucket = typeof STORAGE_BUCKETS[keyof typeof STORAGE_BUCKETS]

/**
 * Environment Variables Type
 */
export interface EnvironmentVariables {
  NEXT_PUBLIC_SUPABASE_URL: string
  NEXT_PUBLIC_SUPABASE_ANON_KEY: string
  SUPABASE_SERVICE_ROLE_KEY: string
  RESEND_API_KEY: string
  NEXT_PUBLIC_GA_MEASUREMENT_ID?: string
}