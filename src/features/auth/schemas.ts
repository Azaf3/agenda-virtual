import { z } from 'zod'

const email = z.email('Informe um e-mail válido.')
const password = z
  .string()
  .min(8, 'A senha precisa ter pelo menos 8 caracteres.')
  .regex(/[A-Za-z]/, 'Inclua pelo menos uma letra.')
  .regex(/\d/, 'Inclua pelo menos um número.')

export const loginSchema = z.object({
  email,
  password: z.string().min(1, 'Informe sua senha.'),
})

export const signupSchema = z.object({
  fullName: z.string().trim().min(3, 'Informe seu nome completo.'),
  email,
  password,
})

export const forgotSchema = z.object({ email })

export const resetSchema = z
  .object({ password, confirm: z.string() })
  .refine((v) => v.password === v.confirm, {
    path: ['confirm'],
    message: 'As senhas não são iguais.',
  })

export type LoginValues = z.infer<typeof loginSchema>
export type SignupValues = z.infer<typeof signupSchema>
export type ForgotValues = z.infer<typeof forgotSchema>
export type ResetValues = z.infer<typeof resetSchema>
