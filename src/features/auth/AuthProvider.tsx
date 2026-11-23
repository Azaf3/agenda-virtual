import { useEffect, useState, type ReactNode } from 'react'
import { supabase } from '@/lib/supabase'
import { AuthContext, type AuthState } from './auth-context'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({ session: null, loading: true, recovering: false })

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setState((s) => ({ ...s, session: data.session, loading: false }))
    })

    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      setState((s) => ({
        session,
        loading: false,
        recovering: event === 'PASSWORD_RECOVERY' ? true : event === 'SIGNED_OUT' ? false : s.recovering,
      }))
    })
    return () => data.subscription.unsubscribe()
  }, [])

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>
}

