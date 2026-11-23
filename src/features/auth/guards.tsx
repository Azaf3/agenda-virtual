import { Navigate, Outlet, useLocation } from 'react-router'
import { useAuth } from './auth-context'

function FullPageSpinner() {
  return (
    <div className="grid min-h-dvh place-items-center" aria-busy="true">
      <span className="size-6 animate-spin rounded-full border-2 border-brand-mid border-t-brand" />
      <span className="sr-only">Carregando</span>
    </div>
  )
}

// Só deixa passar quem está logado; guarda a página de origem pra voltar depois do login.
export function RequireAuth() {
  const { session, loading } = useAuth()
  const location = useLocation()
  if (loading) return <FullPageSpinner />
  if (!session) return <Navigate to="/entrar" replace state={{ from: location.pathname }} />
  return <Outlet />
}

// Telas de login/cadastro: quem já está logado vai direto pra agenda.
export function GuestOnly() {
  const { session, loading } = useAuth()
  if (loading) return <FullPageSpinner />
  if (session) return <Navigate to="/" replace />
  return <Outlet />
}
