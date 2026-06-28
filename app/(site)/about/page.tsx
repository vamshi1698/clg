import SpotlightCard from '@/components/reactbits/SpotlightCard'
import ScrollReveal from '@/components/reactbits/ScrollReveal'

export const metadata = { title: 'About | National College' }

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20 text-academic-950">
      <div className="container-wide">
        <ScrollReveal
          baseOpacity={0}
          baseRotation={2}
          blurStrength={5}
          containerClassName="mb-12"
          textClassName="text-4xl md:text-6xl font-display font-bold text-academic-950"
        >
          About National College
        </ScrollReveal>
        
        <p className="text-xl text-academic-700 mb-16 max-w-2xl">
          Since 1965, we have been committed to academic excellence, holistic development, and shaping leaders of the future.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <SpotlightCard className="bg-white border-slate-200" spotlightColor="rgba(212, 175, 55, 0.15)">
            <h3 className="text-2xl font-bold text-academic-900 mb-4">Our Vision</h3>
            <p className="text-slate-600 text-lg leading-relaxed">
              To be a premier institution of learning that nurtures talent, fosters innovation, and promotes ethical leadership to serve the global community.
            </p>
          </SpotlightCard>

          <SpotlightCard className="bg-white border-slate-200" spotlightColor="rgba(212, 175, 55, 0.15)">
            <h3 className="text-2xl font-bold text-academic-900 mb-4">Our Mission</h3>
            <p className="text-slate-600 text-lg leading-relaxed">
              To provide quality education accessible to all, encouraging critical thinking, creativity, and a spirit of scientific inquiry.
            </p>
          </SpotlightCard>
        </div>

        <div className="mt-16">
          <SpotlightCard className="bg-academic-950 text-white" spotlightColor="rgba(255, 255, 255, 0.1)">
            <h3 className="text-2xl font-bold mb-4">History & Heritage</h3>
            <p className="text-slate-300 max-w-3xl leading-relaxed">
              Established with the core belief that education is the ultimate equalizer, National College has grown from a modest campus to a sprawling hub of multifaceted learning. Our autonomous status empowers us to craft contemporary curricula that directly meet industry standards while preserving traditional academic rigor.
            </p>
          </SpotlightCard>
        </div>
      </div>
    </div>
  )
}
