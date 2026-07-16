// jela-website/src/app/api/portfolio-images/route.ts

import { readdirSync } from 'fs'
import path from 'path'
import { NextResponse } from 'next/server'

// Read the list at build time. Drop a `portfolio-*.jpg` file into
// public/portfolio/ and redeploy - it gets picked up automatically.
export const dynamic = 'force-static'

export async function GET() {
  const dir = path.join(process.cwd(), 'public', 'portfolio')

  let files: string[] = []
  try {
    files = readdirSync(dir)
  } catch {
    files = []
  }

  const images = files
    .filter((name) => /^portfolio-.*\.(jpe?g|png|webp)$/i.test(name))
    .sort()
    .map((name) => ({
      name,
      url: `/portfolio/${name}`,
    }))

  return NextResponse.json({ images })
}
