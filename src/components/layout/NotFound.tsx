import { Link } from 'react-router'

export function NotFound() {
  return (
    <div className="grid min-h-dvh place-items-center px-6 text-center">
      <div>
        <h1 className="text-2xl font-semibold">Página não encontrada</h1>
        <Link to="/" className="mt-4 inline-block font-medium text-brand hover:underline">
          Ir para a agenda
        </Link>
      </div>
    </div>
  )
}
