// jela-website/src/components/ui/SocialIcon.tsx

// Renders a monochrome social icon as a recolorable CSS mask so it can take
// the current text color and turn brand-red with a glow on hover.
export default function SocialIcon({
  icon,
  name,
  className = '',
}: {
  icon: string
  name: string
  className?: string
}) {
  return (
    <span
      role="img"
      aria-label={name}
      className={`icon-mask icon-glow block ${className}`}
      style={{ WebkitMaskImage: `url(${icon})`, maskImage: `url(${icon})` }}
    />
  )
}
