import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'

const FIRST_HOUR = 7
const LAST_HOUR = 20
const hours = Array.from({ length: LAST_HOUR - FIRST_HOUR + 1 }, (_, i) => FIRST_HOUR + i)

const dayFormat = new Intl.DateTimeFormat('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })

function addDays(date: Date, amount: number) {
  const next = new Date(date)
  next.setDate(next.getDate() + amount)
  return next
}

function isSameDay(a: Date, b: Date) {
  return a.toDateString() === b.toDateString()
}

// Visão do dia. Os atendimentos entram aqui na sprint 3; por enquanto a grade
// e a navegação entre dias já funcionam.
export function AgendaPage() {
  const [now] = useState(() => new Date())
  const [day, setDay] = useState(now)
  const today = isSameDay(day, now)
  const title = dayFormat.format(day)

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-6 sm:px-8 sm:py-8">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight first-letter:uppercase">{title}</h1>
          <p className="text-muted">{today ? 'Hoje' : 'Agenda do dia'}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={() => setDay(now)} disabled={today}>
            Hoje
          </Button>
          <Button variant="secondary" size="icon" aria-label="Dia anterior" onClick={() => setDay((d) => addDays(d, -1))}>
            <ChevronLeft className="size-4" />
          </Button>
          <Button variant="secondary" size="icon" aria-label="Próximo dia" onClick={() => setDay((d) => addDays(d, 1))}>
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </header>

      <p className="rounded-lg border border-dashed border-line bg-surface px-4 py-3 text-muted">
        <span className="font-medium text-ink">Nenhum atendimento neste dia.</span> Marcar atendimentos chega na
        próxima etapa.
      </p>

      <section aria-label={`Horários de ${title}`} className="relative overflow-hidden rounded-xl border border-line bg-surface">
        <ol>
          {hours.map((h) => (
            <li key={h} className="flex h-14 border-b border-line last:border-b-0">
              <span className="w-16 shrink-0 pt-2 pr-3 text-right text-sm tabular-nums text-muted">
                {String(h).padStart(2, '0')}:00
              </span>
              <span className="flex-1 border-l border-line" />
            </li>
          ))}
        </ol>
      </section>
    </div>
  )
}
