// jela-website/src/components/layout/ThemeToggle.tsx

'use client'

import { Moon, Sun } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function ThemeToggle() {
  const [theme, setTheme] = useState('dark')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Default to dark unless the user explicitly chose light
    const saved = localStorage.getItem('theme')
    const initial = saved === 'light' ? 'light' : 'dark'
    setTheme(initial)
    document.documentElement.classList.toggle('dark', initial === 'dark')
  }, [])

  function toggle() {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)

    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  // Holds the space until the stored choice is known, so the bar does not
  // shuffle when the switch appears.
  if (!mounted) {
    return <div className="w-[4.25rem] h-8" />
  }

  const light = theme === 'light'

  return (
    <label className="switch" title={light ? 'Light' : 'Dark'}>
      <input
        type="checkbox"
        checked={light}
        onChange={toggle}
        aria-label={light ? 'Switch to dark theme' : 'Switch to light theme'}
      />
      <span className="slider">
        {/* The knob shows what is on, not what it would switch to. */}
        <span className="slider-btn">
          <span className="texture" />
          <span className="switch-face">
            {light ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </span>
          <span className="texture" />
        </span>
      </span>
    </label>
  )
}
