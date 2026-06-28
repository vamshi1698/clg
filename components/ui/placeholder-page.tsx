import { Construction } from 'lucide-react'

interface PlaceholderPageProps {
  title: string
  description?: string
}

export function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center bg-slate-50 px-4 text-center">
      <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-slate-200 max-w-2xl w-full">
        <div className="flex justify-center mb-6">
          <div className="bg-academic-50 p-4 rounded-full">
            <Construction className="h-12 w-12 text-academic-700" />
          </div>
        </div>
        <h1 className="font-display text-3xl md:text-4xl font-bold text-academic-950 mb-4">
          {title}
        </h1>
        <p className="text-slate-600 text-lg leading-relaxed">
          {description || "This section is currently under development. Please check back later for updates."}
        </p>
      </div>
    </div>
  )
}
