import type { AuthError } from '@supabase/supabase-js'

// Traduz erros do Supabase Auth para mensagens que dizem o que fazer.
const messages: Record<string, string> = {
  invalid_credentials: 'E-mail ou senha incorretos.',
  email_not_confirmed: 'Confirme seu e-mail antes de entrar. O link foi enviado na criação da conta.',
  user_already_exists: 'Já existe uma conta com esse e-mail. Entre ou recupere a senha.',
  email_exists: 'Já existe uma conta com esse e-mail. Entre ou recupere a senha.',
  weak_password: 'Senha fraca. Use pelo menos 8 caracteres, misturando letras e números.',
  same_password: 'A nova senha precisa ser diferente da atual.',
  over_email_send_rate_limit: 'Muitos e-mails enviados em pouco tempo. Aguarde um minuto e tente de novo.',
  over_request_rate_limit: 'Muitas tentativas seguidas. Aguarde um minuto e tente de novo.',
}

export function authErrorMessage(error: AuthError | Error): string {
  const code = 'code' in error && typeof error.code === 'string' ? error.code : undefined
  if (code && messages[code]) return messages[code]
  if (error.message.toLowerCase().includes('fetch')) {
    return 'Sem conexão com o servidor. Verifique sua internet e tente de novo.'
  }
  return 'Algo deu errado. Tente de novo em instantes.'
}
