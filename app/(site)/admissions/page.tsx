import SpotlightCard from '@/components/reactbits/SpotlightCard'
import ScrollReveal from '@/components/reactbits/ScrollReveal'

export const metadata = { title: 'Admissions | National College' }

export default function AdmissionsPage() {
  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20 text-academic-950">
      <div className="container-wide">
        <ScrollReveal
          baseOpacity={0}
          baseRotation={4}
          blurStrength={6}
          containerClassName="mb-12"
          textClassName="text-4xl md:text-6xl font-display font-bold text-academic-950"
        >
          Begin Your Journey
        </ScrollReveal>
        
        <p className="text-xl text-academic-700 mb-16 max-w-2xl">
          Discover our admission process, requirements, and deadlines. Take the first step towards excellence.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: 'Undergraduate', desc: 'Explore bachelor programs across Arts, Science, and Commerce.', link: 'Apply UG' },
            { title: 'Graduate', desc: 'Advance your career with our specialized Master degree programs.', link: 'Apply PG' },
            { title: 'Financial Aid', desc: 'Learn about scholarships, grants, and financial assistance options.', link: 'View Aid' },
          ].map((item, i) => (
            <SpotlightCard key={i} className="bg-white border-slate-200 h-full flex flex-col justify-between" spotlightColor="rgba(212, 175, 55, 0.15)">
              <div>
                <h3 className="text-2xl font-bold text-academic-900 mb-4">{item.title}</h3>
                <p className="text-slate-600 mb-6">{item.desc}</p>
              </div>
              <button className="text-left text-gold-600 font-semibold hover:text-gold-700 transition-colors">
                {item.link} →
              </button>
            </SpotlightCard>
          ))}
        </div>
      </div>
    </div>
  )
}
