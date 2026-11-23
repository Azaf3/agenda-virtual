import { cva, type VariantProps } from 'class-variance-authority'
import { Loader2 } from 'lucide-react'
import type { ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors disabled:pointer-events-none disabled:opacity-60',
  {
    variants: {
      variant: {
        primary: 'bg-brand text-white hover:bg-brand-strong',
        secondary: 'border border-line bg-surface text-ink hover:bg-paper',
        ghost: 'text-muted hover:bg-brand-soft hover:text-ink',
      },
      size: {
        md: 'h-10 px-4 text-[15px]',
        sm: 'h-8 px-3 text-sm',
        icon: 'size-9',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  },
)

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & { loading?: boolean }

export function Button({ className, variant, size, loading, disabled, children, ...props }: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="size-4 animate-spin" aria-hidden />}
      {children}
    </button>
  )
}
