// jela-website/src/app/api/portfolio-images/route.ts

import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET() {
  try {
    console.log('🔍 API called')
    console.log('📍 Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
    console.log('🔑 Anon key exists:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
    
    const { data, error } = await supabase.storage.from('portfolio').list('', {
      limit: 100,
      offset: 0,
      sortBy: { column: 'name', order: 'asc' },
    })

    console.log('📦 Data received:', data)
    console.log('❌ Error:', error)

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: 'Failed to fetch images' }, { status: 500 })
    }

    const imageFiles = data
      .filter((file) => file.name.match(/\.(jpg|jpeg|png|webp)$/i))
      .map((file) => ({
        name: file.name,
        url: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/portfolio/${file.name}`,
      }))

    console.log('✅ Image files found:', imageFiles.length)

    return NextResponse.json({ images: imageFiles })
  } catch (error) {
    console.error('Error fetching portfolio images:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}