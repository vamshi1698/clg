'use client'

import { motion } from 'framer-motion'
import { ArrowRight, ShieldCheck, Target, Medal, Flag, Sword, Users, MapPin, Award, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-50px' },
  transition: { duration: 0.7 }
}

const nccActivities = [
  {
    icon: Sword,
    title: 'Drill & Parade Training',
    desc: 'Regular drill practice, ceremonial parades, and march-past training for national events and inter-college competitions.',
  },
  {
    icon: Target,
    title: 'Firing & Weaponry',
    desc: 'Introduction to small arms, rifle shooting practice, and range firing sessions conducted under army supervision.',
  },
  {
    icon: MapPin,
    title: 'Camp Attendance',
    desc: 'Annual Training Camps (ATC), Combined Annual Training Camps (CATC), and National Integration Camps across India.',
  },
  {
    icon: Medal,
    title: 'Adventure Activities',
    desc: 'Trekking, mountaineering, rock climbing, and survival training that build resilience and teamwork skills.',
  },
  {
    icon: Users,
    title: 'Social Service',
    desc: 'Blood donation drives, tree plantation campaigns, Swachh Bharat initiatives, and disaster management awareness.',
  },
  {
    icon: Award,
    title: 'Certificates & Recognition',
    desc: 'Earn NCC A, B, and C certificates. C-certificate holders get bonus marks and quota in armed forces recruitment.',
  },
]

const achievements = [
  { stat: '50+', label: 'Active Cadets' },
  { stat: '15+', label: 'Camps Attended' },
  { stat: '8', label: 'National Camps' },
  { stat: '3', label: 'Best Cadet Awards' },
]

const highlights = [
  {
    title: 'Republic Day Parade Participation',
    desc: 'Our cadets regularly participate in the prestigious Republic Day camps held in New Delhi, representing the Karnataka Directorate.',
    img: 'https://images.unsplash.com/photo-1579912862699-85d64e28ed27?w=800&auto=format&fit=crop&q=80',
    flip: false,
  },
  {
    title: 'Inter-College Competitions',
    desc: 'Our NCC unit consistently wins prizes in drill competitions, firing events, and cultural activities at inter-college and group-level events.',
    img: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800&auto=format&fit=crop&q=80',
    flip: true,
  },
]

export function NCCPage() {
  return (
    <div className="bg-white text-academic-950">
      {/* Hero Section */}
      <section className="relative pt-44 md:pt-52 pb-16 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1590079019458-0eb5b40a3371?w=2000&auto=format&fit=crop&q=80"
            alt="NCC Cadets"
            fill
            sizes="100vw"
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-academic-950 via-academic-950/60 to-transparent" />
        </div>

        <div className="relative container-wide text-white w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-end">
            <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.9 }}>
              <div className="flex items-center gap-2.5 mb-4">
                <ShieldCheck className="w-5 h-5 text-gold-400" />
                <span className="text-gold-400 text-xs font-bold uppercase tracking-[0.25em]">National Cadet Corps</span>
              </div>
              <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold leading-none mb-6">
                Unity <span className="text-gold-400">&</span><br />Discipline.
              </h1>
              <p className="text-slate-300 text-lg leading-relaxed max-w-lg">
                The NCC unit at National College Jayanagar instills leadership, patriotism, and self-discipline through rigorous training, national camps, and adventure activities.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="grid grid-cols-2 gap-4"
            >
              {achievements.map((s, i) => (
                <div key={i} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-center">
                  <div className="font-display text-4xl font-bold text-gold-400">{s.stat}</div>
                  <div className="text-slate-300 text-sm mt-1 font-medium">{s.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* About NCC */}
      <section className="section-padding bg-white">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div {...fadeUp}>
              <span className="text-xs font-bold text-academic-700 tracking-[0.25em] uppercase block mb-3">
                About the Unit
              </span>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-academic-900 mb-6">
                Serving the Nation<br />Since <span className="text-gold-500">Establishment</span>
              </h2>
              <p className="text-slate-600 text-base leading-relaxed mb-4">
                The NCC unit of National College Jayanagar operates under the Karnataka and Goa Directorate. 
                Our unit provides cadets with comprehensive military training, character building, and opportunities 
                to represent the college at state and national level camps.
              </p>
              <p className="text-slate-600 text-base leading-relaxed mb-6">
                Cadets gain exposure to weapons training, map reading, field craft, first aid, disaster management, 
                and are groomed for leadership roles. NCC C-certificate holders receive special benefits in armed 
                forces recruitment and government job selections.
              </p>
              <Link
                href="/campus-life"
                className="inline-flex items-center gap-2 text-academic-900 hover:text-gold-600 font-semibold text-sm transition-colors group"
              >
                <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                Back to Campus Life
              </Link>
            </motion.div>
            <motion.div
              {...fadeUp}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="relative h-80 lg:h-[420px] rounded-3xl overflow-hidden shadow-xl"
            >
              <Image
                src="https://images.unsplash.com/photo-1579912862699-85d64e28ed27?w=800&auto=format&fit=crop&q=80"
                alt="NCC training session"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Activities Grid */}
      <section className="section-padding bg-slate-50">
        <div className="container-wide">
          <motion.div {...fadeUp} className="text-center mb-14">
            <span className="text-xs font-bold text-academic-700 tracking-[0.25em] uppercase block mb-3">
              Training & Activities
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-academic-900">
              What Our Cadets <span className="text-gold-500">Do</span>
            </h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {nccActivities.map((activity, i) => (
              <motion.div
                key={i}
                {...fadeUp}
                transition={{ duration: 0.6, delay: i * 0.08 }}
                className="bg-white rounded-2xl border border-slate-100 p-8 hover:shadow-lg hover:border-gold-200 transition-all group"
              >
                <div className="w-14 h-14 bg-academic-50 rounded-2xl flex items-center justify-center mb-5 group-hover:bg-gold-50 transition-colors">
                  <activity.icon className="h-7 w-7 text-academic-700 group-hover:text-gold-600 transition-colors" />
                </div>
                <h3 className="font-bold text-lg text-academic-900 mb-2">{activity.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{activity.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Highlights */}
      {highlights.map((highlight, i) => (
        <section key={i} className={`section-padding ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}`}>
          <div className="container-wide">
            <div className={`grid lg:grid-cols-2 gap-12 items-center ${highlight.flip ? 'lg:flex-row-reverse' : ''}`}>
              <motion.div
                {...fadeUp}
                className={highlight.flip ? 'lg:order-2' : ''}
              >
                <div className="w-14 h-14 bg-academic-100 rounded-2xl flex items-center justify-center mb-6">
                  <Flag className="h-7 w-7 text-academic-700" />
                </div>
                <h2 className="font-display text-3xl md:text-4xl font-bold text-academic-950 mb-4">{highlight.title}</h2>
                <p className="text-slate-600 text-lg leading-relaxed">{highlight.desc}</p>
              </motion.div>
              <motion.div
                {...fadeUp}
                transition={{ duration: 0.7, delay: 0.15 }}
                className={`relative h-72 lg:h-80 rounded-3xl overflow-hidden shadow-xl ${highlight.flip ? 'lg:order-1' : ''}`}
              >
                <Image src={highlight.img} alt={highlight.title} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
              </motion.div>
            </div>
          </div>
        </section>
      ))}

      {/* Join CTA */}
      <section className="section-padding bg-academic-950 text-white">
        <div className="container-wide">
          <motion.div {...fadeUp} className="text-center max-w-3xl mx-auto">
            <ShieldCheck className="w-12 h-12 text-gold-400 mx-auto mb-6" />
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Ready to Join the <span className="text-gold-400">NCC?</span>
            </h2>
            <p className="text-slate-300 text-lg leading-relaxed mb-8">
              NCC enrolment is open to all first-year students. Build character, earn certificates, and serve the nation while studying at National College.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-gold-500 text-academic-950 hover:bg-gold-400 font-semibold px-8 py-3.5 rounded-xl transition-all shadow-lg"
              >
                Contact NCC Office <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/campus-life"
                className="inline-flex items-center gap-2 border border-white/20 text-white hover:bg-white/10 font-semibold px-8 py-3.5 rounded-xl transition-all"
              >
                Explore Campus Life
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
