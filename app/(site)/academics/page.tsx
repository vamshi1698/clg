import SpotlightCard from '@/components/reactbits/SpotlightCard'
import ScrollReveal from '@/components/reactbits/ScrollReveal'

export const metadata = { title: 'Academics | National College' }

export default function AcademicsPage() {
  return (
    <div className="min-h-screen bg-academic-950 pt-32 pb-20 text-white">
      <div className="container-wide">
        <ScrollReveal
          baseOpacity={0}
          baseRotation={2}
          blurStrength={8}
          containerClassName="mb-12"
          textClassName="text-4xl md:text-6xl font-display font-bold text-white"
        >
          Academic Excellence
        </ScrollReveal>
        
        <p className="text-xl text-gold-400 mb-16 max-w-2xl">
          We offer diverse, rigorous programs led by renowned faculty to prepare you for the challenges of tomorrow.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            { title: 'Departments', desc: 'Browse our academic departments ranging from Sciences to Humanities.' },
            { title: 'Undergraduate Programs', desc: 'Comprehensive bachelor degrees designed for holistic growth.' },
            { title: 'Graduate Programs', desc: 'Advanced masters degrees with a focus on specialized research.' },
            { title: 'Faculty', desc: 'Learn more about the experienced mentors guiding our students.' },
          ].map((item, i) => (
            <SpotlightCard key={i} className="custom-spotlight-card h-full" spotlightColor="rgba(212, 175, 55, 0.15)">
              <h3 className="text-2xl font-bold text-white mb-4">{item.title}</h3>
              <p className="text-slate-300">{item.desc}</p>
            </SpotlightCard>
          ))}
        </div>
      </div>
    </div>
  )
}
