'use client'

import { motion } from 'framer-motion'
import { ArrowRight, HeartHandshake, TreePine, Droplets, BookHeart, Stethoscope, Users, HandHelping, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-50px' },
  transition: { duration: 0.7 }
}

const nssActivities = [
  {
    icon: TreePine,
    title: 'Environmental Conservation',
    desc: 'Tree plantation drives, waste management workshops, and eco-awareness campaigns across nearby communities and college surroundings.',
  },
  {
    icon: Droplets,
    title: 'Blood Donation Camps',
    desc: 'Regular blood donation drives organized in collaboration with hospitals and the Red Cross society to support emergency medical needs.',
  },
  {
    icon: Stethoscope,
    title: 'Health Awareness Drives',
    desc: 'Free health check-up camps, hygiene awareness sessions, and first-aid training for rural and urban community members.',
  },
  {
    icon: BookHeart,
    title: 'Literacy & Education',
    desc: 'Teaching programs in government schools, adult literacy initiatives, and distribution of educational materials to underprivileged students.',
  },
  {
    icon: HandHelping,
    title: 'Community Development',
    desc: 'Village adoption programs, Swachh Bharat drives, road safety campaigns, and rural infrastructure improvement initiatives.',
  },
  {
    icon: Users,
    title: 'Special Camps & Rallies',
    desc: 'Seven-day residential special camps in adopted villages, National Integration camps, and participation in national-level NSS events.',
  },
]

const achievements = [
  { stat: '100+', label: 'Active Volunteers' },
  { stat: '20+', label: 'Camps Organized' },
  { stat: '5000+', label: 'Service Hours' },
  { stat: '12', label: 'Awards Won' },
]

const highlights = [
  {
    title: 'Village Adoption Programme',
    desc: 'Our NSS unit has adopted nearby villages where volunteers conduct regular awareness drives, health camps, cleanliness programs, and educational workshops benefiting hundreds of families.',
    img: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&auto=format&fit=crop&q=80',
    flip: false,
  },
  {
    title: 'State & National Recognition',
    desc: 'Our volunteers have received accolades at state-level Republic Day parades and national NSS festivals for outstanding community service and creative programming.',
    img: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&auto=format&fit=crop&q=80',
    flip: true,
  },
]

export function NSSPage() {
  return (
    <div className="bg-white text-academic-950">
      {/* Hero Section */}
      <section className="relative pt-44 md:pt-52 pb-16 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=2000&auto=format&fit=crop&q=80"
            alt="NSS Volunteers"
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
                <HeartHandshake className="w-5 h-5 text-gold-400" />
                <span className="text-gold-400 text-xs font-bold uppercase tracking-[0.25em]">National Service Scheme</span>
              </div>
              <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold leading-none mb-6">
                Not Me<br />But <span className="text-gold-400">You.</span>
              </h1>
              <p className="text-slate-300 text-lg leading-relaxed max-w-lg">
                The NSS unit at National College Jayanagar develops a sense of social responsibility and community consciousness through constructive voluntary service and action.
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

      {/* About NSS */}
      <section className="section-padding bg-white">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div {...fadeUp}>
              <span className="text-xs font-bold text-academic-700 tracking-[0.25em] uppercase block mb-3">
                About the Unit
              </span>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-academic-900 mb-6">
                Service Before<br /><span className="text-gold-500">Self</span>
              </h2>
              <p className="text-slate-600 text-base leading-relaxed mb-4">
                Established under the Ministry of Youth Affairs and Sports, the NSS unit at National College 
                provides students with an opportunity to develop their personality through community service. 
                Our volunteers work on health, hygiene, environment, and social awareness projects.
              </p>
              <p className="text-slate-600 text-base leading-relaxed mb-6">
                NSS volunteers earn certificates and preference points in government service exams. More 
                importantly, they graduate with a deep sense of civic duty, empathy, and leadership skills 
                that benefit their personal and professional lives.
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
                src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&auto=format&fit=crop&q=80"
                alt="NSS community service"
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
              Service & Activities
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-academic-900">
              How We Make a <span className="text-gold-500">Difference</span>
            </h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {nssActivities.map((activity, i) => (
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
                  <HeartHandshake className="h-7 w-7 text-academic-700" />
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
            <HeartHandshake className="w-12 h-12 text-gold-400 mx-auto mb-6" />
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Ready to <span className="text-gold-400">Serve?</span>
            </h2>
            <p className="text-slate-300 text-lg leading-relaxed mb-8">
              NSS enrolment is open to all students. Volunteer for a cause, earn service certificates, and make a meaningful impact on society while building lifelong friendships.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-gold-500 text-academic-950 hover:bg-gold-400 font-semibold px-8 py-3.5 rounded-xl transition-all shadow-lg"
              >
                Contact NSS Office <ArrowRight className="w-4 h-4" />
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
