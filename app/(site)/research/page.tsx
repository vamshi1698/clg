import SpotlightCard from '@/components/reactbits/SpotlightCard'
import ScrollReveal from '@/components/reactbits/ScrollReveal'

export const metadata = { title: 'Research | National College' }

export default function ResearchPage() {
  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20 text-academic-950">
      <div className="container-wide">
        <ScrollReveal
          baseOpacity={0}
          baseRotation={5}
          blurStrength={10}
          containerClassName="mb-12"
          textClassName="text-4xl md:text-6xl font-display font-bold text-academic-950"
        >
          Pioneering Research
        </ScrollReveal>
        
        <p className="text-xl text-academic-700 mb-16 max-w-2xl">
          At National College, innovation meets application. Discover the groundbreaking research projects and publications by our students and faculty.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { title: 'Research Centers', desc: 'State-of-the-art facilities dedicated to applied sciences and humanities.' },
            { title: 'Publications', desc: 'Browse our archive of peer-reviewed papers and academic journals.' },
            { title: 'Student Projects', desc: 'View award-winning capstone projects and research initiatives.' },
          ].map((item, i) => (
            <SpotlightCard key={i} className="bg-white border-slate-200 h-full" spotlightColor="rgba(30, 58, 138, 0.05)">
              <h3 className="text-2xl font-bold text-academic-900 mb-4">{item.title}</h3>
              <p className="text-slate-600">{item.desc}</p>
            </SpotlightCard>
          ))}
        </div>
      </div>
    </div>
  )
}
