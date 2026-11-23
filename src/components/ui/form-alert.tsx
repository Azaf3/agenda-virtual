import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

type FormAlertProps = { tone?: 'error' | 'success'; children: ReactNode }

export function FormAlert({ tone = 'error', children }: FormAlertProps) {
  return (
    <div
      role={tone === 'error' ? 'alert' : 'status'}
      className={cn(
        'rounded-lg border px-3 py-2.5 text-sm',
        tone === 'error' ? 'border-miss/30 bg-miss/5 text-miss' : 'border-ok/30 bg-ok/5 text-ok',
      )}
    >
      {children}
    </div>
  )
}
