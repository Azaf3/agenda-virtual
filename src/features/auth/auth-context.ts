import type { Session } from '@supabase/supabase-js'
import { createContext, useContext } from 'react'

export type AuthState = {
  session: Session | null
  loading: boolean
  // true quando o usuário chegou pelo link de "redefinir senha" do e-mail
  recovering: boolean
}

export const AuthContext = createContext<AuthState | null>(null)

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth precisa estar dentro de <AuthProvider>')
  return ctx
}
