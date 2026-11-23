import { CalendarDays, LogOut, Menu, Settings, Users, X } from 'lucide-react'
import { useState } from 'react'
import { NavLink, Outlet } from 'react-router'
import { Button } from '@/components/ui/button'
import { APP_NAME } from '@/config/app'
import { useAuth } from '@/features/auth/auth-context'
import { supabase } from '@/lib/supabase'
import { cn } from '@/lib/utils'

const nav = [
  { to: '/', label: 'Agenda', icon: CalendarDays, end: true },
  { to: '/profissionais', label: 'Profissionais', icon: Users },
  { to: '/configuracoes', label: 'Configurações', icon: Settings },
]

export function AppShell() {
  const { session } = useAuth()
  const [open, setOpen] = useState(false)
  const user = session?.user
  const name = (user?.user_metadata.full_name as string | undefined) ?? user?.email ?? ''

  const sidebar = (
    <div className="flex h-full flex-col gap-6 p-4">
      <div className="flex items-center gap-2.5 px-2 pt-1">
        <img src="/icon.svg" alt="" className="size-7" />
        <span className="text-base font-semibold tracking-tight">{APP_NAME}</span>
      </div>

      <nav aria-label="Principal" className="flex flex-col gap-0.5">
        {nav.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-[15px] text-muted transition-colors hover:bg-brand-soft hover:text-ink',
                isActive && 'bg-brand-soft font-medium text-brand',
              )
            }
          >
            <Icon className="size-[18px]" aria-hidden />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto border-t border-line pt-4">
        <p className="truncate px-2 text-sm font-medium" title={name}>
          {name}
        </p>
        {user?.email && name !== user.email && <p className="truncate px-2 text-sm text-muted">{user.email}</p>}
        <Button variant="ghost" size="sm" className="mt-2 w-full justify-start" onClick={() => supabase.auth.signOut()}>
          <LogOut className="size-4" aria-hidden />
          Sair
        </Button>
      </div>
    </div>
  )

  return (
    <div className="min-h-dvh lg:grid lg:grid-cols-[248px_1fr]">
      <aside className="sticky top-0 hidden h-dvh border-r border-line bg-surface lg:block">{sidebar}</aside>

      {/* Celular: barra superior com menu deslizante */}
      <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-line bg-surface px-4 lg:hidden">
        <div className="flex items-center gap-2">
          <img src="/icon.svg" alt="" className="size-7" />
          <span className="font-semibold">{APP_NAME}</span>
        </div>
        <Button variant="ghost" size="icon" aria-label="Abrir menu" onClick={() => setOpen(true)}>
          <Menu className="size-5" />
        </Button>
      </header>
      {open && (
        <div className="fixed inset-0 z-30 lg:hidden" role="dialog" aria-modal="true" aria-label="Menu">
          <button className="absolute inset-0 bg-ink/30" aria-label="Fechar menu" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-72 bg-surface shadow-xl">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-3 right-3"
              aria-label="Fechar menu"
              onClick={() => setOpen(false)}
            >
              <X className="size-5" />
            </Button>
            {sidebar}
          </div>
        </div>
      )}

      <main className="min-w-0">
        <Outlet />
      </main>
    </div>
  )
}
