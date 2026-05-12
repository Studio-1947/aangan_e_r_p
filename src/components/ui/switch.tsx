import type { ButtonHTMLAttributes } from 'react'
import { cn } from '../../lib/utils'

export function Switch({ className, checked = false, disabled = false, ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { checked?: boolean }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      className={cn(
        'relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border transition-colors',
        checked ? 'border-emerald-500 bg-emerald-500' : 'border-slate-300 bg-slate-200',
        disabled && 'cursor-not-allowed opacity-60',
        className,
      )}
      {...props}
    >
      <span
        className={cn(
          'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform',
          checked ? 'translate-x-5' : 'translate-x-0.5',
        )}
      />
    </button>
  )
}

export default Switch