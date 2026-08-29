// jela-website/src/components/home/HeroIntro.tsx

'use client'

import { useEffect, useState } from 'react'

const QUESTION = 'new tattoo?'

const RUNTIME_MS = 3200

const SEEN_KEY = 'heroIntroSeen'

export default function HeroIntro() {
  // Starts covered on the server too, so the hero is never glimpsed before
  // the intro decides whether to run.
  const [phase, setPhase] = useState<'covered' | 'playing' | 'done'>('covered')

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    // Replays on every reload while developing, so the sequence can be
    // watched without clearing storage each time. Once per session in build.
    const alreadySeen =
      process.env.NODE_ENV !== 'development' && sessionStorage.getItem(SEEN_KEY) === '1'

    if (reducedMotion || alreadySeen) {
      setPhase('done')
      return
    }

    setPhase('playing')

    // Marked as seen only once it is over, never on the way in. Setting it
    // up front would make the intro skip itself, because React mounts
    // effects twice in development.
    const finish = () => {
      sessionStorage.setItem(SEEN_KEY, '1')
      setPhase('done')
    }
    const timer = window.setTimeout(finish, RUNTIME_MS)

    // Anyone who reaches for the page gets out of it immediately.
    window.addEventListener('pointerdown', finish)
    window.addEventListener('keydown', finish)
    window.addEventListener('wheel', finish, { passive: true })
    window.addEventListener('touchmove', finish, { passive: true })

    return () => {
      window.clearTimeout(timer)
      window.removeEventListener('pointerdown', finish)
      window.removeEventListener('keydown', finish)
      window.removeEventListener('wheel', finish)
      window.removeEventListener('touchmove', finish)
    }
  }, [])

  // Hands off to the hero: the logo is held small while this plays, then
  // spirals up the moment it clears - whether that was the full sequence or
  // a visitor cutting it short.
  useEffect(() => {
    const root = document.documentElement
    if (phase === 'playing') {
      root.classList.add('intro-running')
    }
    if (phase === 'done') {
      root.classList.remove('intro-running')
      root.classList.add('intro-done')
    }
  }, [phase])

  if (phase === 'done') return null

  if (phase === 'covered') {
    return <div className="hero-intro hero-intro-hold" aria-hidden="true" />
  }

  return (
    <div className="hero-intro hero-intro-playing" aria-hidden="true">
      <p className="hero-intro-word hero-intro-question">{QUESTION}</p>
    </div>
  )
}
