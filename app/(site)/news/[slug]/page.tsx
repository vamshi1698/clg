import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Metadata } from 'next'
import { ArrowLeft, Calendar } from 'lucide-react'
import { getNewsBySlug } from '@/lib/data/public'

interface PageProps {
  params: { slug: string }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const article = await getNewsBySlug(params.slug)
  if (!article) return { title: 'Not Found' }
  return {
    title: article.title,
    description: article.excerpt || undefined,
  }
}

export default async function NewsArticlePage({ params }: PageProps) {
  const article = await getNewsBySlug(params.slug)
  if (!article) notFound()

  return (
    <div className="bg-slate-50/30 min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-academic-900 py-16 text-white overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gold-500 rounded-full blur-3xl" />
        </div>
        <div className="relative container-wide z-10">
          <Link href="/news" className="inline-flex items-center gap-2 text-slate-300 hover:text-white transition-colors text-sm font-bold mb-6">
            <ArrowLeft className="w-4 h-4" /> Back to News
          </Link>
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="px-3 py-1 bg-white/10 border border-white/20 rounded-md text-[10px] font-bold uppercase tracking-wider text-white">
              {article.category || 'General'}
            </span>
            {article.published_at && (
              <span className="flex items-center gap-1.5 text-slate-300 text-xs font-semibold">
                <Calendar className="w-3.5 h-3.5" />
                {new Date(article.published_at).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </span>
            )}
          </div>
          <h1 className="font-display text-3xl md:text-5xl font-extrabold text-white mb-4 leading-tight">
            {article.title}
          </h1>
          {article.excerpt && (
            <p className="text-slate-300 text-base md:text-lg max-w-3xl leading-relaxed">
              {article.excerpt}
            </p>
          )}
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12 md:py-20">
        <div className="container-wide">
          <div className="max-w-4xl bg-white border border-slate-100 rounded-3xl p-6 md:p-12 shadow-sm">
            {article.image_url && (
              <div className="mb-10 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
                <img src={article.image_url} alt={article.title} className="w-full h-auto object-cover max-h-[500px]" />
              </div>
            )}
            
            {article.content && article.content.trim() !== '' ? (
              <div 
                className="prose prose-slate prose-lg max-w-none prose-headings:font-display prose-headings:font-bold prose-a:text-blue-600 hover:prose-a:text-blue-700"
                dangerouslySetInnerHTML={{ __html: article.content }}
              />
            ) : (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-50 mb-4">
                  <span className="text-slate-300 text-2xl">📰</span>
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">Announcement Details</h3>
                <p className="text-slate-500 text-sm max-w-md mx-auto">
                  This announcement does not contain any further detailed content. 
                  {article.category === 'examination' ? ' Please visit the Results section to view or download the relevant official documents.' : ''}
                </p>
                
                {article.category === 'examination' && (
                  <div className="mt-8">
                    <Link href="/results" className="inline-flex items-center justify-center px-6 py-3 bg-academic-900 text-white font-bold rounded-xl hover:bg-academic-800 transition-colors shadow-sm">
                      Go to Results Section
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
