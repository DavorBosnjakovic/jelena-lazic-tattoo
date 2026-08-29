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

  if (!mounted) {
    return <div className="w-8 h-8" />
  }

  return (
    <button
      onClick={toggle}
      className="group flex items-center justify-center"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? <Sun className="w-7 h-7 icon-glow" /> : <Moon className="w-7 h-7 icon-glow" />}
    </button>
  )
}