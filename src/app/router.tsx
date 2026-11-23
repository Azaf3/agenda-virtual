import { createBrowserRouter } from 'react-router'
import { AppShell } from '@/components/layout/AppShell'
import { ComingSoon } from '@/components/layout/ComingSoon'
import { NotFound } from '@/components/layout/NotFound'
import { AuthLayout } from '@/features/auth/AuthLayout'
import { ForgotPasswordPage } from '@/features/auth/ForgotPasswordPage'
import { GuestOnly, RequireAuth } from '@/features/auth/guards'
import { LoginPage } from '@/features/auth/LoginPage'
import { ResetPasswordPage } from '@/features/auth/ResetPasswordPage'
import { SignupPage } from '@/features/auth/SignupPage'
import { AgendaPage } from '@/features/calendar/AgendaPage'

export const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [
      {
        element: <GuestOnly />,
        children: [
          { path: '/entrar', element: <LoginPage /> },
          { path: '/criar-conta', element: <SignupPage /> },
          { path: '/recuperar-senha', element: <ForgotPasswordPage /> },
        ],
      },
      { path: '/redefinir-senha', element: <ResetPasswordPage /> },
    ],
  },
  {
    element: <RequireAuth />,
    children: [
      {
        element: <AppShell />,
        children: [
          { path: '/', element: <AgendaPage /> },
          {
            path: '/profissionais',
            element: (
              <ComingSoon
                title="Profissionais"
                description="Cadastro de profissionais e horários de atendimento chega na próxima etapa."
              />
            ),
          },
          {
            path: '/configuracoes',
            element: <ComingSoon title="Configurações" description="Dados da clínica e equipe chegam na próxima etapa." />,
          },
        ],
      },
    ],
  },
  { path: '*', element: <NotFound /> },
])
