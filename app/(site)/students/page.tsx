import SpotlightCard from '@/components/reactbits/SpotlightCard'
import ScrollReveal from '@/components/reactbits/ScrollReveal'

export const metadata = { title: 'Students | National College' }

export default function StudentsPage() {
  return (
    <div className="min-h-screen bg-academic-950 pt-32 pb-20 text-white">
      <div className="container-wide">
        <ScrollReveal
          baseOpacity={0}
          baseRotation={5}
          blurStrength={10}
          containerClassName="mb-12"
          textClassName="text-4xl md:text-6xl font-display font-bold text-white"
        >
          Student Resources
        </ScrollReveal>
        
        <p className="text-xl text-gold-400 mb-16 max-w-2xl">
          Everything you need to succeed at National College. From academic calendars to campus services, find it all here.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { title: 'Academic Calendar', desc: 'View important dates, holidays, and exam schedules.' },
            { title: 'Library Access', desc: 'Search the catalog and access digital journals.' },
            { title: 'Student Portal', desc: 'Login to view grades, attendance, and fee details.' },
            { title: 'Clubs & Societies', desc: 'Join extracurricular groups and enhance your skills.' },
            { title: 'Career Guidance', desc: 'Connect with our placement cell for opportunities.' },
            { title: 'Health & Wellness', desc: 'Access counseling and medical assistance on campus.' },
          ].map((item, i) => (
            <SpotlightCard key={i} className="custom-spotlight-card h-full" spotlightColor="rgba(212, 175, 55, 0.15)">
              <h3 className="text-2xl font-bold text-white mb-4">{item.title}</h3>
              <p className="text-slate-300">{item.desc}</p>
              <button className="mt-6 text-gold-500 font-semibold hover:text-gold-400 transition-colors">
                Explore →
              </button>
            </SpotlightCard>
          ))}
        </div>
      </div>
    </div>
  )
}
