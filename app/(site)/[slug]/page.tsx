import { notFound } from 'next/navigation'
import { getCustomPageBySlug, getCustomPages } from '@/lib/data/public'
import { Metadata } from 'next'
import { BlocksRenderer } from '@/components/blocks-renderer'
import DOMPurify from 'isomorphic-dompurify'

// Allow new slugs added via CMS to render on-demand and then be cached
export const dynamicParams = true

export async function generateStaticParams() {
  const pages = await getCustomPages()
  return pages.map((page) => ({ slug: page.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params
  const page = await getCustomPageBySlug(resolvedParams.slug)

  if (!page) {
    return {
      title: 'Page Not Found',
    }
  }

  return {
    title: page.title,
    description: page.meta_description || page.excerpt || undefined,
  }
}

export default async function CustomPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params
  
  // SQLi Defense-in-depth: strict validation on slug parameter
  const slug = String(resolvedParams.slug)
  if (!/^[a-zA-Z0-9-_]+$/.test(slug)) {
    notFound()
  }

  const page = await getCustomPageBySlug(slug)

  if (!page) {
    notFound()
  }

  const hasBlocks = page.page_blocks && Array.isArray(page.page_blocks) && page.page_blocks.length > 0

  if (hasBlocks) {
    return (
      <div className="w-full bg-white min-h-[60vh]">
        <BlocksRenderer blocks={page.page_blocks} />
      </div>
    )
  }

  return (
    <div className="py-16 md:py-24 bg-white min-h-[60vh]">
      <div className="container-narrow flex justify-center w-full max-w-4xl mx-auto">
        <div className="w-full">
          <header className="mb-12">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-academic-900 leading-tight">
              {page.title}
            </h1>
            {page.excerpt && (
              <p className="mt-6 text-xl text-slate-600 leading-relaxed max-w-3xl">
                {page.excerpt}
              </p>
            )}
            <div className="h-1.5 w-24 bg-gold-500 mt-6 rounded-full" />
          </header>

          {page.featured_image && (
            <div className="mb-12 rounded-2xl overflow-hidden shadow-lg border border-slate-100">
              <img 
                src={page.featured_image} 
                alt={page.title} 
                className="w-full h-auto max-h-[500px] object-cover"
              />
            </div>
          )}

          {page.content ? (
            <div 
              className="prose prose-lg prose-slate max-w-none prose-headings:font-display prose-headings:text-academic-900 prose-a:text-gold-600 hover:prose-a:text-gold-700 text-justify"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(page.content) }}
            />
          ) : (
            <p className="text-slate-500 italic">This page is empty.</p>
          )}
        </div>
      </div>
    </div>
  )
}
