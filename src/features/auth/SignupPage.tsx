import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router'
import { Button } from '@/components/ui/button'
import { Field } from '@/components/ui/field'
import { FormAlert } from '@/components/ui/form-alert'
import { supabase } from '@/lib/supabase'
import { authErrorMessage } from './auth-errors'
import { signupSchema, type SignupValues } from './schemas'

export function SignupPage() {
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
  const [sentTo, setSentTo] = useState<string | null>(null)
  const { register, handleSubmit, formState } = useForm<SignupValues>({ resolver: zodResolver(signupSchema) })

  async function onSubmit({ fullName, email, password }: SignupValues) {
    setError(null)
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    })
    if (error) return setError(authErrorMessage(error))
    // Com confirmação de e-mail ligada, o Supabase não devolve sessão: avisa pra checar o e-mail.
    if (!data.session) return setSentTo(email)
    navigate('/', { replace: true })
  }

  if (sentTo) {
    return (
      <>
        <h1 className="text-2xl font-semibold tracking-tight">Confirme seu e-mail</h1>
        <p className="mt-2 text-muted">
          Enviamos um link para <strong className="text-ink">{sentTo}</strong>. Abra o e-mail e clique no link para
          ativar a conta.
        </p>
        <Link to="/entrar" className="mt-8 inline-block text-sm font-medium text-brand hover:underline">
          Voltar para o login
        </Link>
      </>
    )
  }

  return (
    <>
      <h1 className="text-2xl font-semibold tracking-tight">Criar conta</h1>
      <p className="mt-1 text-muted">Para você e a equipe da clínica organizarem a agenda.</p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-8 flex flex-col gap-4">
        {error && <FormAlert>{error}</FormAlert>}
        <Field label="Nome completo" autoComplete="name" error={formState.errors.fullName?.message} {...register('fullName')} />
        <Field label="E-mail" type="email" autoComplete="email" error={formState.errors.email?.message} {...register('email')} />
        <Field
          label="Senha"
          type="password"
          autoComplete="new-password"
          hint="Pelo menos 8 caracteres, com letras e números."
          error={formState.errors.password?.message}
          {...register('password')}
        />
        <Button type="submit" loading={formState.isSubmitting} className="mt-2">
          Criar conta
        </Button>
      </form>

      <p className="mt-8 text-sm text-muted">
        Já tem conta?{' '}
        <Link to="/entrar" className="font-medium text-brand hover:underline">
          Entrar
        </Link>
      </p>
    </>
  )
}
