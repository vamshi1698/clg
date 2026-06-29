'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Music, Trophy, Utensils, Heart, Bus, Home, Users, Dumbbell } from 'lucide-react'
import Link from 'next/link'

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-50px' },
  transition: { duration: 0.7 }
}

const campusImages = [
  { src: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80', label: 'Main Campus', span: 'lg:col-span-2 lg:row-span-2' },
  { src: 'https://images.unsplash.com/photo-1571260899304-425eee4c7efc?auto=format&fit=crop&w=600&q=80', label: 'Library', span: '' },
  { src: 'https://images.unsplash.com/photo-1540553016722-983e48a2cd10?auto=format&fit=crop&w=600&q=80', label: 'Auditorium', span: '' },
  { src: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=600&q=80', label: 'Sports Ground', span: '' },
  { src: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80', label: 'Cafeteria', span: '' },
]

const features = [
  {
    icon: Home,
    title: 'Student Hostels',
    desc: 'Comfortable, safe, and well-equipped residential facilities for both boys and girls. 24/7 security, Wi-Fi, study rooms, and mess services included.',
    img: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80',
    flip: false
  },
  {
    icon: Trophy,
    title: 'Sports & Athletics',
    desc: 'World-class sports infrastructure covering cricket, basketball, badminton, kabaddi, and athletics. Dedicated coaches and inter-collegiate tournament opportunities.',
    img: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=800&q=80',
    flip: true
  },
  {
    icon: Music,
    title: 'Arts & Culture',
    desc: 'Annual cultural fests, drama clubs, classical dance societies, music bands, and literary events keep the campus alive with creativity and expression all year round.',
    img: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?auto=format&fit=crop&w=800&q=80',
    flip: false
  },
  {
    icon: Utensils,
    title: 'Dining & Cafes',
    desc: 'Multiple dining outlets serving hygienic, diverse cuisines at affordable prices. Separate vegetarian and non-vegetarian counters with daily fresh menus.',
    img: 'https://images.unsplash.com/photo-1567521464027-f127ff144326?auto=format&fit=crop&w=800&q=80',
    flip: true
  },
]

const quickStats = [
  { value: '15+', label: 'Student Clubs' },
  { value: '4', label: 'Sports Grounds' },
  { value: '2', label: 'Hostels' },
  { value: '5', label: 'Cafeterias' },
]

export default function CampusLifePage() {
  return (
    <div className="bg-white text-academic-950">

      {/* Hero */}
      <section className="relative min-h-[80vh] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
            alt="Campus Life"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-academic-950 via-academic-950/50 to-transparent" />
        </div>

        <div className="relative container-wide pb-16 pt-36 text-white w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-end">
            <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.9 }}>
              <span className="inline-block text-gold-400 text-xs font-bold uppercase tracking-[0.25em] mb-4">Life at National College</span>
              <h1 className="font-display text-6xl md:text-8xl font-bold leading-none mb-6">
                Where <span className="text-gold-400">Life</span><br />Happens.
              </h1>
              <p className="text-slate-300 text-lg leading-relaxed max-w-lg">
                Beyond classrooms and textbooks — discover a vibrant campus teeming with sports, arts, friendships, and memories that last a lifetime.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="grid grid-cols-2 gap-4"
            >
              {quickStats.map((s, i) => (
                <div key={i} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-center">
                  <div className="font-display text-4xl font-bold text-gold-400">{s.value}</div>
                  <div className="text-slate-300 text-sm mt-1 font-medium">{s.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Campus Photo Bento */}
      <section className="section-padding bg-slate-950">
        <div className="container-wide">
          <motion.div {...fadeUp} className="text-center mb-12">
            <span className="text-gold-400 text-xs font-bold uppercase tracking-[0.25em]">Campus Galleries</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-white mt-3">See Our Campus</h2>
          </motion.div>
          <div className="grid grid-cols-2 lg:grid-cols-4 lg:grid-rows-2 gap-3 h-auto lg:h-[600px]">
            {campusImages.map((img, i) => (
              <motion.div
                key={i}
                {...fadeUp}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className={`relative overflow-hidden rounded-2xl group ${img.span}`}
                style={{ minHeight: i === 0 ? '400px' : '180px' }}
              >
                <img
                  src={img.src}
                  alt={img.label}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <span className="absolute bottom-4 left-4 text-white font-bold text-sm">{img.label}</span>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/gallery" className="inline-flex items-center gap-2 border border-white/20 text-white font-semibold px-6 py-3 rounded-full hover:bg-white hover:text-academic-950 transition-all">
              View Full Gallery <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Sections */}
      {features.map((feature, i) => (
        <section key={i} className={`section-padding ${i % 2 === 0 ? 'bg-slate-50' : 'bg-white'}`}>
          <div className="container-wide">
            <div className={`grid lg:grid-cols-2 gap-12 items-center ${feature.flip ? 'lg:flex-row-reverse' : ''}`}>
              <motion.div
                {...fadeUp}
                className={`${feature.flip ? 'lg:order-2' : ''}`}
              >
                <div className="w-16 h-16 bg-academic-100 rounded-2xl flex items-center justify-center mb-6">
                  <feature.icon className="h-8 w-8 text-academic-700" />
                </div>
                <h2 className="font-display text-4xl font-bold text-academic-950 mb-4">{feature.title}</h2>
                <p className="text-slate-600 text-lg leading-relaxed">{feature.desc}</p>
              </motion.div>
              <motion.div
                {...fadeUp}
                transition={{ duration: 0.7, delay: 0.15 }}
                className={`rounded-3xl overflow-hidden shadow-xl ${feature.flip ? 'lg:order-1' : ''}`}
              >
                <img src={feature.img} alt={feature.title} className="w-full h-80 object-cover" />
              </motion.div>
            </div>
          </div>
        </section>
      ))}

      {/* Additional Facilities Grid */}
      <section className="section-padding bg-academic-950 text-white">
        <div className="container-wide">
          <motion.div {...fadeUp} className="text-center mb-12">
            <span className="text-gold-400 text-xs font-bold uppercase tracking-[0.25em]">More on Campus</span>
            <h2 className="font-display text-4xl font-bold mt-3">Everything You Need</h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Heart, title: 'Student Wellness', desc: 'Mental health support, counseling center, and well-equipped medical facility on campus.' },
              { icon: Bus, title: 'Campus Transport', desc: 'Dedicated bus routes covering major city areas, ensuring safe and timely commute.' },
              { icon: Dumbbell, title: 'Fitness Center', desc: 'Modern gymnasium, yoga hall, and aerobics facilities to keep students active.' },
              { icon: Users, title: 'Student Clubs', desc: '15+ clubs spanning tech, literature, entrepreneurship, photography, and community service.' },
            ].map((item, i) => (
              <motion.div
                key={i}
                {...fadeUp}
                transition={{ duration: 0.6, delay: i * 0.08 }}
                className="bg-white/10 border border-white/10 rounded-2xl p-6 hover:bg-white/15 transition-colors"
              >
                <div className="w-12 h-12 bg-gold-500/20 rounded-xl flex items-center justify-center mb-4">
                  <item.icon className="h-6 w-6 text-gold-400" />
                </div>
                <h3 className="font-bold text-lg text-white mb-2">{item.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

    </div>
  )
}
