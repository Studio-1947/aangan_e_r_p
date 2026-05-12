import type { HTMLAttributes } from 'react'
import { cn } from '../../lib/utils'

const variants = {
  default: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300',
  success: 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400',
  warning: 'bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-400',
  outline: 'border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300',
  destructive: 'bg-rose-100 dark:bg-rose-900/50 text-rose-700 dark:text-rose-400',
} as const

export function Badge({ className, variant = 'default', ...props }: HTMLAttributes<HTMLSpanElement> & { variant?: keyof typeof variants }) {
  return <span className={cn('inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium', variants[variant], className)} {...props} />
}
