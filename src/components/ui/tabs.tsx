import { createContext, useContext, useMemo, useState, type HTMLAttributes, type ReactNode } from 'react'
import { cn } from '../../lib/utils'

type TabsContextValue = {
  value: string
  setValue: (value: string) => void
}

const TabsContext = createContext<TabsContextValue | null>(null)

export function Tabs({ defaultValue, value, onValueChange, className, children }: HTMLAttributes<HTMLDivElement> & {
  defaultValue?: string
  value?: string
  onValueChange?: (value: string) => void
  children: ReactNode
}) {
  const [internalValue, setInternalValue] = useState(defaultValue ?? '')
  const currentValue = value ?? internalValue

  const context = useMemo<TabsContextValue>(() => ({
    value: currentValue,
    setValue: (nextValue) => {
      onValueChange?.(nextValue)
      if (value === undefined) setInternalValue(nextValue)
    },
  }), [currentValue, onValueChange, value])

  return (
    <TabsContext.Provider value={context}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  )
}

export function TabsList({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('inline-flex h-11 items-center rounded-2xl bg-slate-100 dark:bg-slate-800 p-1 text-slate-500 dark:text-slate-400', className)} {...props} />
}

export function TabsTrigger({ className, value, ...props }: HTMLAttributes<HTMLButtonElement> & { value: string }) {
  const context = useContext(TabsContext)
  if (!context) throw new Error('TabsTrigger must be used within Tabs')

  const selected = context.value === value

  return (
    <button
      type="button"
      className={cn(
        'inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium transition',
        selected
          ? 'bg-white dark:bg-slate-900 text-slate-950 dark:text-slate-50 shadow-sm'
          : 'hover:text-slate-900 dark:hover:text-slate-100',
        className,
      )}
      onClick={() => context.setValue(value)}
      {...props}
    />
  )
}

export function TabsContent({ className, value, children, ...props }: HTMLAttributes<HTMLDivElement> & { value: string }) {
  const context = useContext(TabsContext)
  if (!context) throw new Error('TabsContent must be used within Tabs')
  if (context.value !== value) return null
  return (
    <div className={cn('mt-6', className)} {...props}>
      {children}
    </div>
  )
}
