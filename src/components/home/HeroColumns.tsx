// jela-website/src/components/home/HeroColumns.tsx

import { heroColumns } from '@/lib/heroImages'
import Image from 'next/image'

// One entry per column: which way it travels, how long one full loop takes,
// and from which breakpoint it is laid out. Durations are deliberately
// unrelated to each other so the columns never fall into step.
//
// Eight columns are laid out, but the block they sit in is oversized and
// tilted, so roughly six land inside the viewport on a wide screen.
const columns = [
  { direction: 'up' as const, duration: '58s', visibility: '' },
  { direction: 'down' as const, duration: '73s', visibility: '' },
  { direction: 'up' as const, duration: '47s', visibility: '' },
  { direction: 'down' as const, duration: '65s', visibility: '' },
  { direction: 'up' as const, duration: '81s', visibility: 'hidden md:block' },
  { direction: 'down' as const, duration: '54s', visibility: 'hidden md:block' },
  { direction: 'up' as const, duration: '69s', visibility: 'hidden lg:block' },
  { direction: 'down' as const, duration: '43s', visibility: 'hidden lg:block' },
]

export default function HeroColumns() {
  return (
    <section className="hero-full relative overflow-hidden bg-background">
      {/* Oversized and tilted, so the corners stay covered as it rotates. */}
      <div className="hero-rotor grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
        {columns.map((column, columnIndex) => (
          <div
            key={columnIndex}
            className={`relative overflow-hidden ${column.visibility}`}
          >
            <div
              className={
                column.direction === 'up' ? 'hero-track-up' : 'hero-track-down'
              }
              style={{ animationDuration: column.duration }}
            >
              {/* The list runs twice: the loop resets at the halfway point,
                  which is pixel-identical to the start. */}
              {[...heroColumns[columnIndex], ...heroColumns[columnIndex]].map(
                (image, imageIndex) => (
                  <Image
                    key={imageIndex}
                    src={image.src}
                    alt=""
                    width={image.width}
                    height={image.height}
                    className="block w-full h-auto"
                    sizes="(max-width: 768px) 35vw, (max-width: 1024px) 24vw, 18vw"
                    priority={imageIndex === 0}
                  />
                )
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Solid page colour with the wordmark punched out of it, so the only
          place the moving photos show through is inside the letters.
          Built as an SVG mask rather than a CSS one: the dark plane has to
          stay still and cover everything while the hole itself spirals in,
          and a CSS mask cannot be rotated. */}
      <svg className="hero-knockout" role="img" aria-label="Jelena Lazić Tattoo">
        <defs>
          {/* Keeps the alpha, forces the colour to black - the mask reads
              brightness, so black is what cuts the hole. */}
          <filter id="hero-logo-ink">
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"
            />
          </filter>

          <mask id="hero-logo-hole">
            <rect width="100%" height="100%" fill="#fff" />
            <image
              className="hero-knockout-logo"
              /* Same wordmark with a stray 12x18 blob cleaned off its top
                 right corner. In the original that blob is invisible, but
                 used as a mask it punches a hole through the dark plane. */
              href="/logos/logo-knockout.webp"
              width="100%"
              height="100%"
              preserveAspectRatio="xMidYMid meet"
              filter="url(#hero-logo-ink)"
            />
          </mask>
        </defs>

        <rect
          className="hero-knockout-plane"
          width="100%"
          height="100%"
          mask="url(#hero-logo-hole)"
        />
      </svg>
    </section>
  )
}
