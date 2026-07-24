import Link from 'next/link'
import DOMPurify from 'isomorphic-dompurify'

interface Block {
  id: string
  type: string
  [key: string]: any
}

interface BlocksRendererProps {
  blocks: Block[]
}

export function BlocksRenderer({ blocks }: BlocksRendererProps) {
  if (!blocks || !Array.isArray(blocks) || blocks.length === 0) {
    return null
  }

  return (
    <div className="flex flex-col w-full">
      {blocks.map((block) => (
        <BlockRenderer key={block.id} block={block} />
      ))}
    </div>
  )
}

function BlockRenderer({ block }: { block: Block }) {
  switch (block.type) {
    case 'hero':
      return (
        <section className="relative w-full py-24 md:py-32 bg-academic-900 text-white overflow-hidden flex items-center justify-center min-h-[400px]">
          {block.image && (
            <div className="absolute inset-0 z-0 opacity-40">
              <img src={block.image} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-academic-900/60 mix-blend-multiply" />
            </div>
          )}
          <div className="relative z-10 container-narrow text-center px-4">
            {block.title && (
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6 text-white drop-shadow-md leading-tight">
                {block.title}
              </h1>
            )}
            {block.subtitle && (
              <p className="text-lg md:text-xl text-slate-200 max-w-2xl mx-auto drop-shadow">
                {block.subtitle}
              </p>
            )}
          </div>
        </section>
      )

    case 'text':
      if (!block.content) return null
      return (
        <section className="py-12 md:py-20 bg-white">
          <div className="container-narrow">
            <div
              className="prose prose-lg prose-slate max-w-none prose-headings:font-display prose-headings:text-academic-900 prose-a:text-gold-600 hover:prose-a:text-gold-700 text-justify"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(block.content) }}
            />
          </div>
        </section>
      )

    case 'image_gallery':
      if (!block.images || block.images.length === 0) return null
      return (
        <section className="py-12 md:py-16 bg-slate-50">
          <div className="container-narrow">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {block.images.map((img: string, idx: number) => (
                <div key={idx} className="aspect-square rounded-2xl overflow-hidden shadow-sm border border-slate-200 group">
                  <img
                    src={img}
                    alt=""
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )

    case 'cta':
      return (
        <section className="py-16 md:py-24 bg-academic-900 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10 bg-repeat mix-blend-overlay"></div>
          <div className="container-narrow relative z-10 text-center">
            {block.title && (
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-6 text-gold-500">
                {block.title}
              </h2>
            )}
            {block.content && (
              <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-10">
                {block.content}
              </p>
            )}
            {block.buttonText && block.buttonUrl && (
              <Link
                href={block.buttonUrl}
                className="inline-flex items-center justify-center px-8 py-3.5 text-base font-bold text-academic-900 bg-gold-500 hover:bg-gold-400 rounded-full transition-all hover:scale-105 shadow-lg shadow-gold-500/20"
              >
                {block.buttonText}
              </Link>
            )}
          </div>
        </section>
      )

    default:
      return null
  }
}
