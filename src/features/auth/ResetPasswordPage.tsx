import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router'
import { Button } from '@/components/ui/button'
import { Field } from '@/components/ui/field'
import { FormAlert } from '@/components/ui/form-alert'
import { supabase } from '@/lib/supabase'
import { authErrorMessage } from './auth-errors'
import { useAuth } from './auth-context'
import { resetSchema, type ResetValues } from './schemas'

// Aberta pelo link do e-mail: o Supabase cria uma sessão temporária de recuperação.
export function ResetPasswordPage() {
  const { session, loading } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
  const { register, handleSubmit, formState } = useForm<ResetValues>({ resolver: zodResolver(resetSchema) })

  async function onSubmit({ password }: ResetValues) {
    setError(null)
    const { error } = await supabase.auth.updateUser({ password })
    if (error) return setError(authErrorMessage(error))
    navigate('/', { replace: true })
  }

  if (!loading && !session) {
    return (
      <>
        <h1 className="text-2xl font-semibold tracking-tight">Link expirado</h1>
        <p className="mt-2 text-muted">Esse link de redefinição não vale mais. Peça um novo.</p>
        <Link to="/recuperar-senha" className="mt-8 inline-block text-sm font-medium text-brand hover:underline">
          Pedir novo link
        </Link>
      </>
    )
  }

  return (
    <>
      <h1 className="text-2xl font-semibold tracking-tight">Criar senha nova</h1>
      <p className="mt-1 text-muted">Depois de salvar, você já entra na agenda.</p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-8 flex flex-col gap-4">
        {error && <FormAlert>{error}</FormAlert>}
        <Field
          label="Senha nova"
          type="password"
          autoComplete="new-password"
          hint="Pelo menos 8 caracteres, com letras e números."
          error={formState.errors.password?.message}
          {...register('password')}
        />
        <Field
          label="Repita a senha"
          type="password"
          autoComplete="new-password"
          error={formState.errors.confirm?.message}
          {...register('confirm')}
        />
        <Button type="submit" loading={formState.isSubmitting} className="mt-2">
          Salvar senha
        </Button>
      </form>
    </>
  )
}
