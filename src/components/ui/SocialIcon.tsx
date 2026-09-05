// jela-website/src/components/ui/SocialIcon.tsx

// Renders a monochrome social icon as a recolorable CSS mask so it can take
// the current text color and turn brand-red with a glow on hover. Pass `color`
// to pin an icon to its own brand colour instead - it then keeps that colour
// on hover too, and only the scale and the glow around it still happen.
export default function SocialIcon({
  icon,
  name,
  className = '',
  color,
}: {
  icon: string
  name: string
  className?: string
  color?: string
}) {
  return (
    <span
      role="img"
      aria-label={name}
      className={`icon-mask icon-glow block ${className}`}
      style={{
        WebkitMaskImage: `url(${icon})`,
        maskImage: `url(${icon})`,
        ...(color ? { color } : {}),
      }}
    />
  )
}
