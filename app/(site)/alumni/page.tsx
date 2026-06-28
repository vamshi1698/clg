import SpotlightCard from '@/components/reactbits/SpotlightCard'
import ScrollReveal from '@/components/reactbits/ScrollReveal'

export const metadata = { title: 'Alumni | National College' }

export default function AlumniPage() {
  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20 text-academic-950">
      <div className="container-wide">
        <ScrollReveal
          baseOpacity={0}
          baseRotation={2}
          blurStrength={8}
          containerClassName="mb-12"
          textClassName="text-4xl md:text-6xl font-display font-bold text-academic-950"
        >
          Alumni Network
        </ScrollReveal>
        
        <p className="text-xl text-academic-700 mb-16 max-w-2xl">
          Connect with fellow graduates, explore networking opportunities, and stay updated with your alma mater.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {[
            { title: 'Global Network', desc: 'Join our vast network of successful professionals across the globe.' },
            { title: 'Mentorship', desc: 'Guide current students and help shape the future generation.' },
            { title: 'Events & Reunions', desc: 'Stay tuned for upcoming annual meets and department reunions.' },
            { title: 'Give Back', desc: 'Support scholarships and infrastructure development at the college.' },
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
