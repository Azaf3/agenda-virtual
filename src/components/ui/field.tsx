import { forwardRef, useId, type InputHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

type FieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string
  error?: string
  hint?: string
}

// Campo de formulário: rótulo, input e mensagem de erro ligados por id (acessível).
export const Field = forwardRef<HTMLInputElement, FieldProps>(function Field(
  { label, error, hint, className, id, ...props },
  ref,
) {
  const autoId = useId()
  const inputId = id ?? autoId
  const messageId = `${inputId}-msg`
  const message = error ?? hint

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={inputId} className="text-sm font-medium text-ink">
        {label}
      </label>
      <input
        ref={ref}
        id={inputId}
        aria-invalid={error ? true : undefined}
        aria-describedby={message ? messageId : undefined}
        className={cn(
          'h-10 rounded-lg border border-line bg-surface px-3 text-[15px] text-ink placeholder:text-muted/70',
          'focus-visible:border-brand focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-brand-soft',
          error && 'border-miss focus-visible:border-miss focus-visible:ring-miss/15',
          className,
        )}
        {...props}
      />
      {message && (
        <p id={messageId} className={cn('text-sm', error ? 'text-miss' : 'text-muted')}>
          {message}
        </p>
      )}
    </div>
  )
})
