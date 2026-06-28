import SpotlightCard from '@/components/reactbits/SpotlightCard'
import ScrollReveal from '@/components/reactbits/ScrollReveal'

export const metadata = { title: 'Campus Life | National College' }

export default function CampusLifePage() {
  return (
    <div className="min-h-screen bg-academic-950 pt-32 pb-20 text-white">
      <div className="container-wide">
        <ScrollReveal
          baseOpacity={0}
          baseRotation={-4}
          blurStrength={6}
          containerClassName="mb-12"
          textClassName="text-4xl md:text-6xl font-display font-bold text-gold-500"
        >
          Life at National College
        </ScrollReveal>
        
        <p className="text-xl text-slate-300 mb-16 max-w-2xl">
          Experience a vibrant campus atmosphere filled with arts, sports, events, and a dynamic student community.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { title: 'Hostels', desc: 'Safe, comfortable, and well-equipped residential facilities.' },
            { title: 'Sports & Athletics', desc: 'Top-tier coaching and infrastructure for various sports.' },
            { title: 'Arts & Culture', desc: 'Cultural fests, drama clubs, and music societies.' },
            { title: 'Dining & Cafes', desc: 'Hygienic and diverse food options on campus.' },
            { title: 'Student Wellness', desc: 'Mental health support and fitness centers.' },
            { title: 'Transport', desc: 'Dedicated bus routes connecting the city.' },
          ].map((item, i) => (
            <SpotlightCard key={i} className="custom-spotlight-card h-full" spotlightColor="rgba(255, 255, 255, 0.1)">
              <h3 className="text-2xl font-bold text-white mb-4">{item.title}</h3>
              <p className="text-slate-400">{item.desc}</p>
            </SpotlightCard>
          ))}
        </div>
      </div>
    </div>
  )
}
