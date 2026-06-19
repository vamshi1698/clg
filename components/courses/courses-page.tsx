'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Clock, Users, IndianRupee } from 'lucide-react'
import type { Course, Department } from '@/types/database'

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
}

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.05 } }
}

interface CoursesPageProps {
  courses: Course[]
  departments: Department[]
}

export function CoursesPage({ courses, departments }: CoursesPageProps) {
  const [selectedLevel, setSelectedLevel] = useState<string>('all')
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all')

  const filteredCourses = useMemo(() => {
    return courses.filter(course => {
      if (selectedLevel !== 'all' && course.level !== selectedLevel) return false
      if (selectedDepartment !== 'all' && course.department?.code !== selectedDepartment) return false
      return true
    })
  }, [courses, selectedLevel, selectedDepartment])

  const levels = ['all', 'ug', 'pg', 'phd', 'diploma', 'certificate']

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
              Academic Programs
            </motion.h1>
            <motion.p variants={fadeIn} className="text-gray-400 text-lg max-w-3xl mx-auto">
              Discover the right program for your academic and career goals. We offer undergraduate, postgraduate, and diploma courses.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-gray-50 border-b sticky top-[72px] md:top-[120px] z-40">
        <div className="container-wide">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-gray-500 mr-2">Level:</span>
              {levels.map(level => (
                <button
                  key={level}
                  onClick={() => setSelectedLevel(level)}
                  className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                    selectedLevel === level
                      ? 'bg-academic-900 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {level === 'all' ? 'All' : level.toUpperCase()}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Department:</span>
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="px-4 py-2 text-sm bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
              >
                <option value="all">All Departments</option>
                {departments.map(dept => (
                  <option key={dept.id} value={dept.code}>{dept.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="text-sm text-gray-500 mb-6">
            Showing {filteredCourses.length} program{filteredCourses.length !== 1 ? 's' : ''}
          </div>

          {filteredCourses.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500">No programs found matching your criteria.</p>
            </div>
          ) : (
            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredCourses.map((course) => (
                <motion.div key={course.id} variants={fadeIn}>
                  <Link href={`/courses/${course.code.toLowerCase()}`}>
                    <div className="bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-lg hover:border-gold-300 transition-all h-full group">
                      <div className="h-40 bg-gradient-to-br from-academic-900 to-academic-800 relative">
                        {course.image_url && (
                          <img src={course.image_url} alt={course.name} className="w-full h-full object-cover opacity-60" />
                        )}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="px-4 py-2 bg-gold-500 text-academic-900 text-xs font-bold rounded uppercase">
                            {course.level}
                          </span>
                        </div>
                      </div>
                      <div className="p-6">
                        <h3 className="font-display text-xl font-semibold text-academic-900 mb-2 group-hover:text-gold-600 transition-colors">
                          {course.name}
                        </h3>
                        {course.department && (
                          <p className="text-sm text-gold-600 mb-3">{course.department.name}</p>
                        )}
                        <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                          {course.overview || 'A comprehensive program designed to prepare students for successful careers.'}
                        </p>

                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {course.duration}
                          </div>
                          {course.seats && (
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              {course.seats} seats
                            </div>
                          )}
                        </div>

                        {course.annual_fee && (
                          <div className="mt-4 pt-4 border-t">
                            <div className="flex items-center gap-2 text-academic-900 font-semibold">
                              <IndianRupee className="h-4 w-4" />
                              {course.annual_fee.toLocaleString()}/year
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>
    </div>
  )
}
