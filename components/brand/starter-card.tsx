import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

type StarterCardProps = {
  title: string
  description: string
  href: string
}

export function StarterCard({ title, description, href }: StarterCardProps) {
  return (
    <div className="card-hover rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4 inline-flex rounded-full bg-academic-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-academic-700">
        Featured
      </div>
      <h3 className="font-display text-2xl font-semibold text-academic-950">{title}</h3>
      <p className="mt-3 max-w-prose text-sm leading-7 text-slate-600">{description}</p>
      <Link href={href} className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-academic-700 hover:text-academic-900">
        Learn more <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  )
}