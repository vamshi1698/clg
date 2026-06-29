'use client'

import { motion } from 'framer-motion'
import { ArrowRight, MapPin, Clock, Car, Bus, Phone, Mail, Camera, Coffee, Users } from 'lucide-react'
import Link from 'next/link'

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-50px' },
  transition: { duration: 0.7 }
}

const highlights = [
  { icon: Users, title: 'Campus Tours', desc: 'Guided tours are available Monday–Saturday, 10 AM to 3 PM. Walk through classrooms, labs, the library, and sports facilities with a student guide.' },
  { icon: Coffee, title: 'Visitor Lounge', desc: 'A comfortable waiting area with seating, Wi-Fi, and refreshments. Located at the Main Administrative Block, Ground Floor.' },
  { icon: Camera, title: 'Photography', desc: 'Photography is permitted in public campus areas. Please seek permission before photographing individuals or restricted areas.' },
]

const directions = [
  { mode: Car, label: 'By Car', desc: 'From Bengaluru city center, take the Jayanagar 4th Block Road. Parking is available at the South Gate entrance (Entry from 11th Main).' },
  { mode: Bus, label: 'By BMTC Bus', desc: 'Take buses 37, 37C, or 210 from Majestic. Alight at "National College Stop" on 18th Cross, Jayanagar. 2-minute walk to main gate.' },
  { mode: MapPin, label: 'Nearest Metro', desc: 'Jayanagar Metro Station (Reach station via South City bus or auto). 10-minute auto-rickshaw ride to campus.' },
]

const tourSlots = [
  { day: 'Monday – Friday', time: '10:00 AM, 12:00 PM, 2:30 PM' },
  { day: 'Saturday', time: '10:00 AM, 11:30 AM' },
  { day: 'Sunday & Holidays', time: 'Closed' },
]

export default function VisitorsPage() {
  return (
    <div className="bg-white text-academic-950">

      {/* Hero */}
      <section className="relative min-h-[65vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=2000&q=80"
            alt="College Campus"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-academic-950 via-academic-950/60 to-academic-950/30" />
        </div>
        <div className="relative container-wide pt-36 pb-16 text-white text-center w-full">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <span className="inline-block bg-gold-500/20 border border-gold-500/40 text-gold-300 text-xs font-bold uppercase tracking-[0.25em] px-4 py-2 rounded-full mb-6">
              Welcome Visitors
            </span>
            <h1 className="font-display text-5xl md:text-7xl font-bold leading-tight mb-6">
              Visit National <span className="text-gold-400">College</span>
            </h1>
            <p className="text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto">
              Experience our campus firsthand. Whether you're a prospective student, a parent, or a guest — we welcome you with open arms.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <Link href="#tour" className="inline-flex items-center gap-2 bg-gold-500 text-academic-950 font-bold px-7 py-4 rounded-full hover:bg-gold-400 transition-colors">
                Book a Tour <ArrowRight className="h-5 w-5" />
              </Link>
              <Link href="#directions" className="inline-flex items-center gap-2 border border-white/30 bg-white/10 backdrop-blur text-white font-semibold px-7 py-4 rounded-full hover:bg-white hover:text-academic-950 transition-all">
                Get Directions
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Campus Highlights for Visitors */}
      <section className="section-padding bg-slate-50">
        <div className="container-wide">
          <motion.div {...fadeUp} className="text-center mb-14">
            <span className="text-gold-600 font-semibold text-xs uppercase tracking-[0.25em]">Visitor Information</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-academic-950 mt-3">Your Visit Guide</h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8">
            {highlights.map((item, i) => (
              <motion.div
                key={i}
                {...fadeUp}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="bg-white border border-slate-200 rounded-3xl p-8 hover:shadow-lg hover:-translate-y-1 transition-all"
              >
                <div className="w-16 h-16 bg-academic-50 rounded-2xl flex items-center justify-center mb-6">
                  <item.icon className="h-8 w-8 text-academic-700" />
                </div>
                <h3 className="font-display text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-slate-600 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Campus Tour Booking */}
      <section id="tour" className="section-padding bg-academic-950 text-white">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div {...fadeUp}>
              <span className="text-gold-400 text-xs font-bold uppercase tracking-[0.25em]">See It For Yourself</span>
              <h2 className="font-display text-4xl md:text-5xl font-bold mt-3 mb-6">Campus Tours</h2>
              <p className="text-slate-400 text-lg leading-relaxed mb-8">
                Book a guided tour led by our enthusiastic student ambassadors. Get a real feel of campus life, ask questions, and meet faculty on select tour days.
              </p>
              <Link href="/contact" className="inline-flex items-center gap-2 bg-gold-500 text-academic-950 font-bold px-6 py-3 rounded-full hover:bg-gold-400 transition-colors">
                Book Your Tour <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
            <motion.div {...fadeUp} transition={{ duration: 0.7, delay: 0.2 }}>
              <div className="bg-white/10 border border-white/10 rounded-3xl p-8">
                <h3 className="font-bold text-white text-xl mb-6 flex items-center gap-3">
                  <Clock className="h-6 w-6 text-gold-400" /> Available Slots
                </h3>
                <div className="space-y-4">
                  {tourSlots.map((slot, i) => (
                    <div key={i} className="flex items-center justify-between py-3 border-b border-white/10 last:border-0">
                      <span className="text-white font-medium">{slot.day}</span>
                      <span className="text-gold-300 text-sm font-semibold">{slot.time}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-6 p-4 bg-gold-500/10 border border-gold-500/20 rounded-2xl">
                  <p className="text-gold-300 text-sm">
                    💡 Advance booking recommended for groups of 10 or more. Walk-ins welcome for smaller groups.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Directions */}
      <section id="directions" className="section-padding bg-white">
        <div className="container-wide">
          <motion.div {...fadeUp} className="text-center mb-14">
            <span className="text-gold-600 font-semibold text-xs uppercase tracking-[0.25em]">Find Us</span>
            <h2 className="font-display text-4xl font-bold text-academic-950 mt-3">How to Get Here</h2>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div className="space-y-6">
              {directions.map((dir, i) => (
                <motion.div
                  key={i}
                  {...fadeUp}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className="flex gap-5 border border-slate-200 rounded-2xl p-6 hover:shadow-md transition-shadow"
                >
                  <div className="w-12 h-12 bg-academic-50 rounded-xl flex items-center justify-center shrink-0">
                    <dir.mode className="h-6 w-6 text-academic-700" />
                  </div>
                  <div>
                    <h3 className="font-bold text-academic-950 mb-1">{dir.label}</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">{dir.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Map placeholder + address */}
            <motion.div {...fadeUp} transition={{ duration: 0.7, delay: 0.2 }}>
              <div className="rounded-3xl overflow-hidden shadow-xl border border-slate-200">
                <div className="relative h-64 bg-slate-100">
                  <img
                    src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=800&q=80"
                    alt="Campus aerial view"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-academic-950/40 flex items-center justify-center">
                    <div className="text-center text-white">
                      <MapPin className="h-10 w-10 text-gold-400 mx-auto mb-2" />
                      <p className="font-bold text-lg">National College, Jayanagar</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-6 space-y-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-gold-600 mb-1">Address</p>
                    <p className="text-slate-700">National College (Autonomous), <br />18th Cross, Jayanagar 4th Block,<br /> Bengaluru – 560011, Karnataka</p>
                  </div>
                  <div className="flex gap-6">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-gold-600 mb-1">Phone</p>
                      <a href="tel:08012345678" className="text-academic-700 hover:text-gold-600 transition-colors">080-12345678</a>
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-gold-600 mb-1">Email</p>
                      <a href="mailto:info@nationalcollege.edu.in" className="text-academic-700 hover:text-gold-600 transition-colors text-sm">info@nationalcollege.edu.in</a>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

    </div>
  )
}
