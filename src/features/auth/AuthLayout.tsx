import { Outlet } from 'react-router'
import { APP_NAME } from '@/config/app'

// Faixa de horários do painel lateral: um dia de agenda sem conflitos,
// com um encaixe recusado pra mostrar o que o sistema impede.
const slots = [
  { hour: '08:00', state: 'busy' },
  { hour: '09:00', state: 'busy' },
  { hour: '10:00', state: 'free' },
  { hour: '11:00', state: 'busy' },
  { hour: '13:00', state: 'free' },
  { hour: '14:00', state: 'busy' },
  { hour: '15:00', state: 'blocked' },
  { hour: '16:00', state: 'free' },
] as const

export function AuthLayout() {
  return (
    <div className="grid min-h-dvh lg:grid-cols-[1fr_minmax(420px,44%)]">
      <main className="flex flex-col px-6 py-8 sm:px-12">
        <div className="flex items-center gap-2.5">
          <img src="/icon.svg" alt="" className="size-8" />
          <span className="text-lg font-semibold tracking-tight">{APP_NAME}</span>
        </div>
        <div className="flex flex-1 items-center justify-center py-10">
          <div className="w-full max-w-sm">
            <Outlet />
          </div>
        </div>
      </main>

      <aside className="relative hidden overflow-hidden bg-brand text-brand-soft lg:flex lg:flex-col lg:justify-between lg:p-12">
        <p className="max-w-sm text-[28px] leading-tight font-semibold text-white">
          Um horário, um paciente. A agenda não deixa marcar dois no mesmo lugar.
        </p>

        <ol className="mt-10 flex flex-col gap-2" aria-hidden>
          {slots.map((slot) => (
            <li key={slot.hour} className="flex items-center gap-4">
              <span className="w-12 text-sm tabular-nums text-brand-mid">{slot.hour}</span>
              {slot.state === 'busy' && <span className="h-9 flex-1 rounded-md bg-white/90" />}
              {slot.state === 'free' && (
                <span className="h-9 flex-1 rounded-md border border-dashed border-brand-mid/60" />
              )}
              {slot.state === 'blocked' && (
                <span className="relative h-9 flex-1">
                  <span className="absolute inset-0 rounded-md bg-white/90" />
                  <span className="absolute top-1.5 right-0 left-6 flex h-9 items-center rounded-md border-2 border-dashed border-[#f2b8b2] bg-brand-strong/80 px-3 text-sm text-[#f7d3cf]">
                    Horário ocupado
                  </span>
                </span>
              )}
            </li>
          ))}
        </ol>
      </aside>
    </div>
  )
}
