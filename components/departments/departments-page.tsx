'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Users, BookOpen, FlaskConical, Monitor, Cpu, Wrench, Calculator, Atom, FlaskConical as Flask, Building2, Briefcase, BookOpenText } from 'lucide-react'
import type { Department } from '@/types/database'

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
}

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.1 } }
}

const iconMap: Record<string, any> = {
  'Monitor': Monitor,
  'Cpu': Cpu,
  'Wrench': Wrench,
  'Calculator': Calculator,
  'Atom': Atom,
  'FlaskConical': Flask,
  'Building2': Building2,
  'Briefcase': Briefcase,
  'BookOpen': BookOpenText,
}

interface DepartmentsPageProps {
  departments: Department[]
}

export function DepartmentsPage({ departments }: DepartmentsPageProps) {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative bg-academic-900 py-20 lg:py-28">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gold-500 rounded-full blur-3xl" />
        </div>
        <div className="relative container-wide text-center">
          <motion.div initial="initial" animate="animate" variants={staggerContainer}>
            <motion.h1 variants={fadeIn} className="font-display text-4xl md:text-5xl font-bold text-white mb-6">
              Academic Departments
            </motion.h1>
            <motion.p variants={fadeIn} className="text-gray-400 text-lg max-w-3xl mx-auto">
              Explore our diverse departments, each committed to excellence in teaching, research, and industry collaboration.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Departments Grid */}
      <section className="section-padding">
        <div className="container-wide">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {departments.map((dept) => {
              const IconComponent = iconMap[dept.icon || ''] || BookOpen
              return (
                <motion.div key={dept.id} variants={fadeIn}>
                  <Link
                    href={`/departments/${dept.code.toLowerCase()}`}
                    className="block h-full"
                  >
                    <div className="bg-white border border-gray-100 rounded-xl p-6 hover:shadow-lg hover:border-gold-300 transition-all h-full group">
                      <div className="w-14 h-14 bg-academic-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-gold-500 transition-colors">
                        <IconComponent className="h-7 w-7 text-academic-900 group-hover:text-white transition-colors" />
                      </div>
                      <h3 className="font-display text-xl font-semibold text-academic-900 mb-2">
                        {dept.name}
                      </h3>
                      {dept.short_name && (
                        <p className="text-gold-600 text-sm font-medium mb-3">
                          {dept.short_name}
                        </p>
                      )}
                      <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                        {dept.description || dept.overview || 'Explore excellence in academic programs and research.'}
                      </p>
                      {dept.established_year && (
                        <p className="text-xs text-gray-400">
                          Est. {dept.established_year}
                        </p>
                      )}
                      <div className="flex items-center text-gold-600 text-sm font-medium mt-4 group-hover:translate-x-1 transition-transform">
                        Learn More <ArrowRight className="ml-1 h-4 w-4" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>
    </div>
  )
}
