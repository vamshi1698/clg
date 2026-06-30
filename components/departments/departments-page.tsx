'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  ArrowRight, 
  BookOpen, 
  Monitor, 
  Atom, 
  Briefcase, 
  Award, 
  Trophy, 
  GraduationCap, 
  Sparkles, 
  ChevronRight,
  BookOpenText
} from 'lucide-react'
import type { Department } from '@/types/database'

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
}

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.1 } }
}

interface DepartmentsPageProps {
  departments: Department[]
}

export function DepartmentsPage({ departments }: DepartmentsPageProps) {
  // Group the 9 database departments into 4 major streams
  const groupedStreams = useMemo(() => {
    const csDepts = departments.filter(d => d.code === 'CS')
    const scienceDepts = departments.filter(d => ['PH', 'CH', 'MA', 'EC', 'ME'].includes(d.code))
    const commerceDepts = departments.filter(d => ['CO', 'MB'].includes(d.code))
    const artsDepts = departments.filter(d => ['EN'].includes(d.code))

    return [
      {
        id: 'computer-science',
        name: 'Computer Science',
        icon: Monitor,
        gradient: 'from-blue-600 to-cyan-500',
        bgGradient: 'from-blue-50/50 to-cyan-50/20',
        borderHover: 'hover:border-blue-300/60',
        iconColor: 'text-blue-600',
        iconBg: 'bg-blue-100/80',
        description: 'Empowering students with state-of-the-art computer education, software development skills, and technical innovation.',
        subDepartments: csDepts,
        achievements: [
          'Achieved 100% placement for Computer Science department graduates (2024)',
          'Won first place in the National level Inter-Collegiate Hackathon "CodeStorm" (2025)',
          'Collaborated with tech giants to establish the Advanced Coding & AI Incubation Lab'
        ]
      },
      {
        id: 'science',
        name: 'Science & Engineering',
        icon: Atom,
        gradient: 'from-emerald-600 to-teal-500',
        bgGradient: 'from-emerald-50/40 to-teal-50/20',
        borderHover: 'hover:border-emerald-300/60',
        iconColor: 'text-emerald-600',
        iconBg: 'bg-emerald-100/80',
        description: 'Fostering a spirit of scientific inquiry, rigorous research, and experimental practice across physical, mathematical, and engineering sciences.',
        subDepartments: scienceDepts,
        achievements: [
          'Faculty members published 150+ research papers in international high-impact indexed journals',
          'Science students secured 3 Gold Medals and top university ranks in Physics & Mathematics',
          'Received research grants for eco-friendly green energy projects from the Science & Technology Council'
        ]
      },
      {
        id: 'commerce',
        name: 'Commerce & Management',
        icon: Briefcase,
        gradient: 'from-amber-600 to-orange-500',
        bgGradient: 'from-amber-50/40 to-orange-50/20',
        borderHover: 'hover:border-amber-300/60',
        iconColor: 'text-amber-600',
        iconBg: 'bg-amber-100/80',
        description: 'Nurturing future business leaders, financial managers, and entrepreneurs through dynamic corporate exposure and professional course tracks.',
        subDepartments: commerceDepts,
        achievements: [
          'Maintained a consistent 95%+ placement rate in top multinational financial institutions and audit firms',
          'Overall Champions in the National Level Inter-Collegiate Management Fest for consecutive years',
          'Established professional training partnerships (MOUs) for CA and CS exam preparation'
        ]
      },
      {
        id: 'arts',
        name: 'Arts & Humanities',
        icon: BookOpenText,
        gradient: 'from-purple-600 to-pink-500',
        bgGradient: 'from-purple-50/40 to-pink-50/20',
        borderHover: 'hover:border-purple-300/60',
        iconColor: 'text-purple-600',
        iconBg: 'bg-purple-100/80',
        description: 'Exploring human language, creative literature, and communication to cultivate critical thinking, analytical reasoning, and cultural awareness.',
        subDepartments: artsDepts,
        achievements: [
          'Secured the Best Play Award at the Inter-University Drama and Cultural Festival',
          'Hosted the annual National Level Literature and Language Conference on Contemporary Studies',
          'Alumni successfully admitted to premier master degree programs in top tier global universities'
        ]
      }
    ]
  }, [departments])

  return (
    <div className="bg-slate-50/30 min-h-screen pb-16">
      {/* Hero Section */}
      <section className="relative bg-academic-900 py-20 lg:py-24 text-white overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gold-500 rounded-full blur-3xl" />
        </div>
        <div className="relative container-wide text-center">
          <motion.div initial="initial" animate="animate" variants={staggerContainer}>
            <motion.span 
              variants={fadeIn}
              className="inline-flex items-center gap-2 px-4 py-1.5 bg-gold-500/20 border border-gold-500/35 rounded-full text-gold-500 text-xs font-semibold mb-5 tracking-wide"
            >
              <GraduationCap className="h-4.5 w-4.5" />
              Academic Portals
            </motion.span>
            <h1 className="font-display text-4xl md:text-5xl font-extrabold text-white mb-4">
              Our Academic Departments
            </h1>
            <p className="text-gray-300 text-base md:text-lg max-w-2xl mx-auto">
              Discover our 4 major academic streams, including detailed sub-departments, specialized courses, and top achievements.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Grid Section */}
      <section className="py-12 lg:py-16">
        <div className="container-wide">
          <motion.div
            initial="initial"
            animate="animate"
            variants={staggerContainer}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            {groupedStreams.map((stream) => {
              const IconComponent = stream.icon
              return (
                <motion.div 
                  key={stream.id} 
                  variants={fadeIn}
                  className="group"
                >
                  <div className={`bg-white border border-slate-100 rounded-3xl p-6 lg:p-8 shadow-sm hover:shadow-xl ${stream.borderHover} transition-all duration-300 h-full flex flex-col justify-between relative overflow-hidden`}>
                    
                    {/* Background accent glow */}
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-slate-50 to-slate-100 rounded-bl-full opacity-50 -z-0 pointer-events-none" />

                    <div>
                      {/* Top Info */}
                      <div className="flex items-center gap-4 mb-5 relative z-10">
                        <div className={`w-14 h-14 ${stream.iconBg} rounded-2xl flex items-center justify-center`}>
                          <IconComponent className={`h-7 w-7 ${stream.iconColor}`} />
                        </div>
                        <div>
                          <h3 className="font-display text-xl lg:text-2xl font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors">
                            {stream.name}
                          </h3>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block pt-0.5">
                            Academic Stream
                          </span>
                        </div>
                      </div>

                      <p className="text-slate-500 text-sm leading-relaxed mb-6">
                        {stream.description}
                      </p>

                      {/* Achievements Section */}
                      <div className={`rounded-2xl p-5 mb-6 bg-gradient-to-br ${stream.bgGradient} border border-slate-100/50`}>
                        <div className="flex items-center gap-2 mb-3.5">
                          <Trophy className="h-4.5 w-4.5 text-amber-500" />
                          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                            Key Achievements & Highlights
                          </h4>
                        </div>
                        <ul className="space-y-2.5 text-xs text-slate-600 font-medium">
                          {stream.achievements.map((ach, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <Sparkles className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                              <span>{ach}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Sub-departments / Courses Links */}
                    <div className="border-t border-slate-100 pt-5 mt-auto">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-3">
                        Sub-Departments & Programs
                      </span>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {stream.subDepartments.length > 0 ? (
                          stream.subDepartments.map((dept) => (
                            <Link
                              key={dept.id}
                              href={dept?.code ? `/departments/${dept.code.toLowerCase()}` : '#'}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-100 hover:bg-blue-50 hover:border-blue-200 text-slate-600 hover:text-blue-600 rounded-xl text-xs font-bold transition-all"
                            >
                              <span>{dept.name}</span>
                              <ChevronRight className="h-3 w-3" />
                            </Link>
                          ))
                        ) : (
                          <span className="text-xs text-slate-400 italic">No sub-departments linked.</span>
                        )}
                      </div>
                    </div>

                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>
    </div>
  )
}

