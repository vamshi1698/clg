import SpotlightCard from '@/components/reactbits/SpotlightCard'
import ScrollReveal from '@/components/reactbits/ScrollReveal'

export const metadata = { title: 'Results | National College' }

export default function ResultsPage() {
  return (
    <div className="min-h-screen bg-academic-950 pt-32 pb-20 text-white">
      <div className="container-wide">
        <ScrollReveal
          baseOpacity={0}
          baseRotation={-3}
          blurStrength={5}
          containerClassName="mb-12"
          textClassName="text-4xl md:text-6xl font-display font-bold text-gold-500"
        >
          Examination Results
        </ScrollReveal>
        
        <p className="text-xl text-slate-300 mb-16 max-w-2xl">
          Check your latest semester results and download provisional marksheets.
        </p>

        <div className="max-w-3xl mx-auto">
          <SpotlightCard className="h-full" spotlightColor="rgba(255, 255, 255, 0.1)">
            <form className="flex flex-col space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Registration Number</label>
                <input type="text" className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold-500 transition-colors" placeholder="Enter your Reg. No" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Semester</label>
                <select className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold-500 transition-colors">
                  <option>Select Semester</option>
                  <option>Semester 1</option>
                  <option>Semester 2</option>
                  <option>Semester 3</option>
                  <option>Semester 4</option>
                  <option>Semester 5</option>
                  <option>Semester 6</option>
                </select>
              </div>
              <button type="button" className="w-full bg-gold-600 hover:bg-gold-500 text-academic-950 font-bold py-4 rounded-lg transition-colors">
                View Results
              </button>
            </form>
          </SpotlightCard>
        </div>
      </div>
    </div>
  )
}
