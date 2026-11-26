import { ReactNode } from "react"

export function PageHeading({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string
  title: string
  description: string
  action: ReactNode
}) {
  return (
    <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
      <div>
        <div className="mb-2 flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.16em] text-brand-teal">
          <span className="h-px w-5 bg-brand-teal" />
          {eyebrow}
        </div>
        <h1 className="text-3xl font-extrabold tracking-[-0.02em] sm:text-4xl">
          {title}
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
          {description}
        </p>
      </div>
      {action}
    </div>
  )
}
