import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useLocation, useNavigate } from 'react-router'
import { Button } from '@/components/ui/button'
import { Field } from '@/components/ui/field'
import { FormAlert } from '@/components/ui/form-alert'
import { supabase } from '@/lib/supabase'
import { authErrorMessage } from './auth-errors'
import { loginSchema, type LoginValues } from './schemas'

export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: string } | null)?.from ?? '/'
  const [error, setError] = useState<string | null>(null)
  const { register, handleSubmit, formState } = useForm<LoginValues>({ resolver: zodResolver(loginSchema) })

  async function onSubmit(values: LoginValues) {
    setError(null)
    const { error } = await supabase.auth.signInWithPassword(values)
    if (error) return setError(authErrorMessage(error))
    navigate(from, { replace: true })
  }

  return (
    <>
      <h1 className="text-2xl font-semibold tracking-tight">Entrar</h1>
      <p className="mt-1 text-muted">Acesse a agenda da sua clínica.</p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-8 flex flex-col gap-4">
        {error && <FormAlert>{error}</FormAlert>}
        <Field label="E-mail" type="email" autoComplete="email" error={formState.errors.email?.message} {...register('email')} />
        <Field
          label="Senha"
          type="password"
          autoComplete="current-password"
          error={formState.errors.password?.message}
          {...register('password')}
        />
        <Link to="/recuperar-senha" className="-mt-1 self-end text-sm text-brand hover:underline">
          Esqueci minha senha
        </Link>
        <Button type="submit" loading={formState.isSubmitting} className="mt-2">
          Entrar
        </Button>
      </form>

      <p className="mt-8 text-sm text-muted">
        Ainda não tem conta?{' '}
        <Link to="/criar-conta" className="font-medium text-brand hover:underline">
          Criar conta
        </Link>
      </p>
    </>
  )
}
