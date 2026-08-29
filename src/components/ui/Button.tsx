// jela-website/src/components/ui/Button.tsx

import { ButtonHTMLAttributes, forwardRef } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: 'sm' | 'md' | 'lg'
  block?: boolean
}

// There is one button on this site. The look lives in the .btn class in
// globals.css, so a plain <button className="btn"> and this component can
// never drift apart.
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', size = 'md', block = false, children, ...props }, ref) => {
    const sizeClass = size === 'sm' ? ' btn-sm' : size === 'lg' ? ' btn-lg' : ''
    const blockClass = block ? ' btn-block' : ''

    return (
      <button
        ref={ref}
        className={`btn${sizeClass}${blockClass}${className ? ' ' + className : ''}`}
        {...props}
      >
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'

export default Button
