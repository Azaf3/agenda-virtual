type ComingSoonProps = { title: string; description: string }

export function ComingSoon({ title, description }: ComingSoonProps) {
  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-8 sm:py-8">
      <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
      <div className="mt-6 rounded-xl border border-dashed border-line bg-surface px-6 py-10 text-center">
        <p className="text-muted">{description}</p>
      </div>
    </div>
  )
}
