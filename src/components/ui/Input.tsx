// jela-website/src/components/ui/Input.tsx

import { InputHTMLAttributes, forwardRef } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', label, error, id, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={id}
            className="block text-sm font-body font-semibold mb-2 text-foreground"
          >
            {label}
            {props.required && <span className="text-accent ml-1">*</span>}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={`w-full px-4 py-3 rounded-md border-2 bg-background text-foreground font-body focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
            error ? 'border-red-500' : 'border-border focus:border-accent'
          } ${className}`}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-red-500 font-body">{error}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input