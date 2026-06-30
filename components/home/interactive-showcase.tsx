'use client'

import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform, Variants } from 'framer-motion'
import Link from 'next/link'
import { BookOpen, BriefcaseBusiness, Users, ArrowRight, ChevronRight } from 'lucide-react'

// 3D Tilt Card (No border glow as requested)
const TiltCard = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 40 })
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 40 })

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], [10, -10])
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], [-10, 10])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top
    const xPct = mouseX / width - 0.5
    const yPct = mouseY / height - 0.5
    x.set(xPct)
    y.set(yPct)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
      className={`relative w-full h-full ${className}`}
    >
      <div 
        style={{ transform: 'translateZ(30px)' }} 
        className="h-full w-full rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm hover:shadow-xl transition-shadow duration-300"
      >
        {children}
      </div>
    </motion.div>
  )
}

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
}

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
}

export function SchoolsAndDepartments({ items }: { items: {title: string, text: string, href: string}[] }) {
  return (
    <section className="section-padding bg-slate-50 overflow-hidden perspective-[2000px]">
      <div className="container-wide">
        <motion.div 
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-50px' }}
          className="mb-10 flex flex-col md:flex-row items-start md:items-end justify-between gap-6"
        >
          <motion.div variants={fadeUp}>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-academic-600">Academics</p>
            <h2 className="font-display mt-2 text-3xl font-bold text-academic-950 md:text-4xl">Schools & Departments</h2>
          </motion.div>
          <motion.div variants={fadeUp}>
            <Link href="/departments" className="inline-flex items-center gap-2 text-sm font-medium text-academic-700 hover:text-gold-600 transition-colors">
              View all <ChevronRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </motion.div>

        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-50px' }}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {items.map((item) => (
            <motion.div key={item.title} variants={fadeUp} className="h-full">
              <motion.div
                whileHover={{ y: -8 }}
                className="group relative h-full rounded-3xl overflow-hidden cursor-pointer"
              >
                {/* Dynamic Background */}
                <div className="absolute inset-0 bg-academic-950 transition-colors duration-500" />
                
                {/* Subtle Image/Pattern Overlay (using radial gradients for a glowing effect) */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gold-500/20 via-transparent to-transparent" />
                
                {/* Border */}
                <div className="absolute inset-0 border border-white/10 group-hover:border-gold-500/30 rounded-3xl transition-colors duration-500 z-10" />

                <div className="relative z-20 h-full p-8 flex flex-col justify-between">
                  <div>
                    {/* Glowing Icon Container */}
                    <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-8 group-hover:bg-gold-500/20 group-hover:border-gold-500/40 transition-all duration-500 backdrop-blur-sm">
                      <BookOpen className="h-8 w-8 text-gold-400 group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    
                    <h3 className="font-display text-2xl font-bold tracking-wide text-white mb-4 group-hover:text-gold-400 transition-colors duration-300">
                      {item.title}
                    </h3>
                    
                    <p className="text-sm leading-relaxed text-slate-400 group-hover:text-slate-300 transition-colors duration-300 line-clamp-3">
                      {item.text}
                    </p>
                  </div>
                  
                  {/* Hover Reveal Action */}
                  <div className="mt-8 overflow-hidden">
                    <div className="flex items-center gap-3 text-sm font-bold text-gold-400 transform translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                      <span className="tracking-wider uppercase">Explore Department</span>
                      <ArrowRight className="h-4 w-4" />
                    </div>
                    {/* Default state line */}
                    <div className="h-[2px] w-12 bg-white/20 mt-4 group-hover:w-full group-hover:bg-gold-500/50 transition-all duration-700 ease-in-out" />
                  </div>
                  
                  <Link href={item.href} className="absolute inset-0 z-30">
                    <span className="sr-only">Explore {item.title}</span>
                  </Link>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export function CareerAndFaculty({ careerItems, facultyItems }: { 
  careerItems: {title: string, text: string}[], 
  facultyItems: {title: string, text: string}[] 
}) {
  return (
    <section className="section-padding bg-white overflow-hidden">
      <div className="container-wide">
        <div className="grid gap-8 lg:grid-cols-2">
          
          {/* Career Pathways */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6 }}
            className="rounded-[2rem] border border-slate-200 bg-academic-950 p-6 md:p-10 text-white shadow-xl relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500/10 rounded-full blur-3xl -mr-20 -mt-20 transition-transform duration-700 group-hover:scale-150" />
            
            <div className="relative z-10">
              <div className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-white/80">
                Career Pathways
              </div>
              <h2 className="font-display mt-4 text-3xl md:text-4xl font-bold">Bridging education and industry</h2>
              
              <div className="mt-8 space-y-4">
                {careerItems.map((item, i) => (
                  <motion.div 
                    key={item.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 * i, duration: 0.5 }}
                    className="group/item flex flex-col sm:flex-row sm:items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 md:p-5 hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    <div className="bg-gold-500/20 w-12 h-12 rounded-xl flex items-center justify-center shrink-0 group-hover/item:scale-110 transition-transform">
                      <BriefcaseBusiness className="h-6 w-6 text-gold-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white text-lg">{item.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-white/70">{item.text}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
          
          {/* Faculty */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6 }}
            className="rounded-[2rem] border border-slate-200 bg-slate-50 p-6 md:p-10 shadow-sm relative overflow-hidden group"
          >
             <div className="absolute bottom-0 left-0 w-64 h-64 bg-academic-900/5 rounded-full blur-3xl -ml-20 -mb-20 transition-transform duration-700 group-hover:scale-150" />
            
            <div className="relative z-10">
              <div className="inline-flex rounded-full bg-academic-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-academic-700">
                Faculty
              </div>
              <h2 className="font-display mt-4 text-3xl md:text-4xl font-bold text-academic-950">Expert guidance at every step</h2>
              
              <div className="mt-8 space-y-4">
                {facultyItems.map((item, i) => (
                  <motion.div 
                    key={item.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 * i, duration: 0.5 }}
                    className="group/item flex flex-col sm:flex-row sm:items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 md:p-5 hover:shadow-md transition-all cursor-pointer hover:-translate-y-1"
                  >
                    <div className="bg-academic-50 w-12 h-12 rounded-xl flex items-center justify-center shrink-0 group-hover/item:bg-academic-100 transition-colors">
                      <Users className="h-6 w-6 text-academic-700" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-academic-950 text-lg">{item.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-slate-600">{item.text}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
