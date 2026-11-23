import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router'
import { Button } from '@/components/ui/button'
import { Field } from '@/components/ui/field'
import { FormAlert } from '@/components/ui/form-alert'
import { supabase } from '@/lib/supabase'
import { authErrorMessage } from './auth-errors'
import { forgotSchema, type ForgotValues } from './schemas'

export function ForgotPasswordPage() {
  const [error, setError] = useState<string | null>(null)
  const [sent, setSent] = useState(false)
  const { register, handleSubmit, formState } = useForm<ForgotValues>({ resolver: zodResolver(forgotSchema) })

  async function onSubmit({ email }: ForgotValues) {
    setError(null)
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/redefinir-senha`,
    })
    if (error) return setError(authErrorMessage(error))
    setSent(true)
  }

  return (
    <>
      <h1 className="text-2xl font-semibold tracking-tight">Recuperar senha</h1>
      <p className="mt-1 text-muted">Enviamos um link para você criar uma senha nova.</p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-8 flex flex-col gap-4">
        {error && <FormAlert>{error}</FormAlert>}
        {sent && (
          <FormAlert tone="success">
            Se esse e-mail tiver uma conta, o link chega em alguns minutos. Confira também o spam.
          </FormAlert>
        )}
        <Field label="E-mail" type="email" autoComplete="email" error={formState.errors.email?.message} {...register('email')} />
        <Button type="submit" loading={formState.isSubmitting} className="mt-2">
          Enviar link
        </Button>
      </form>

      <Link to="/entrar" className="mt-8 inline-block text-sm font-medium text-brand hover:underline">
        Voltar para o login
      </Link>
    </>
  )
}
