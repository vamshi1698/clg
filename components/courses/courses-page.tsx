'use client'

import { useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { Clock, Users, IndianRupee, BookOpen, Search, Info, Award, GraduationCap, CheckCircle2, ArrowRight } from 'lucide-react'
import type { Course, Department } from '@/types/database'

interface CoursesPageProps {
  courses: Course[]
  departments: Department[]
}

const fadeIn = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 }
}

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.05 } }
}

export function getCourseGradient(code: string | null | undefined): string {
  const cleanCode = (code || '').toLowerCase();
  if (cleanCode.includes('b.a') || cleanCode.includes('ba')) return 'from-purple-700 to-indigo-700';
  if (cleanCode.includes('b.sc') || cleanCode.includes('bsc')) return 'from-emerald-700 to-teal-700';
  if (cleanCode.includes('b.com') || cleanCode.includes('bcom')) return 'from-blue-700 to-cyan-700';
  if (cleanCode.includes('bca')) return 'from-academic-800 to-slate-900';
  if (cleanCode.includes('bba')) return 'from-gold-600 to-amber-700';
  if (cleanCode.includes('m.a') || cleanCode.includes('ma')) return 'from-violet-700 to-fuchsia-700';
  if (cleanCode.includes('m.sc') || cleanCode.includes('msc')) return 'from-teal-700 to-emerald-800';
  if (cleanCode.includes('m.com') || cleanCode.includes('mcom')) return 'from-sky-700 to-indigo-800';
  if (cleanCode.includes('mba')) return 'from-amber-700 to-orange-800';
  return 'from-slate-700 to-slate-800';
}

export function CoursesPage({ courses, departments }: CoursesPageProps) {
  const searchParams = useSearchParams()
  const levelParam = searchParams.get('level') || 'all'
  const deptParam = searchParams.get('department') || 'all'
  const searchParam = searchParams.get('search') || ''

  const [selectedLevel, setSelectedLevel] = useState<string>(levelParam)
  const [selectedDepartment, setSelectedDepartment] = useState<string>(deptParam)
  const [searchQuery, setSearchQuery] = useState(searchParam)

  // Sync state if query params change
  useEffect(() => {
    setSelectedLevel(levelParam)
    setSelectedDepartment(deptParam)
    setSearchQuery(searchParam)
  }, [levelParam, deptParam, searchParam])

  // Map courses to include full department object to resolve filtering issues
  const coursesWithDept = useMemo(() => {
    return courses.map(course => {
      const dept = departments.find(d => d.id === course.department_id)
      return {
        ...course,
        department: dept
      }
    })
  }, [courses, departments])

  // Filter courses based on selections
  const filteredCourses = useMemo(() => {
    return coursesWithDept.filter(course => {
      // 1. Level Filter
      if (selectedLevel !== 'all' && course.level !== selectedLevel) return false

      // 2. Department Filter (Code match)
      if (selectedDepartment !== 'all' && course.department?.code !== selectedDepartment) return false

      // 3. Search query
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase()
        const matchName = (course.name || '').toLowerCase().includes(query)
        const matchCode = (course.code || '').toLowerCase().includes(query)
        const matchOverview = course.overview?.toLowerCase().includes(query) || false
        if (!matchName && !matchCode && !matchOverview) return false
      }

      return true
    })
  }, [coursesWithDept, selectedLevel, selectedDepartment, searchQuery])

  const levels = ['all', 'ug', 'pg', 'diploma']

  return (
    <div className="bg-slate-50/30 min-h-screen">

      {/* Hero Section */}
      <section className="relative bg-academic-900 py-16 lg:py-20 text-white overflow-hidden border-b border-slate-800">
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
              Academic Offerings
            </motion.span>
            <h1 className="font-display text-4xl md:text-5xl font-extrabold text-white mb-4">
              Our Academic Programs
            </h1>
            <p className="text-gray-300 text-base md:text-lg max-w-2xl mx-auto">
              Explore undergraduate, postgraduate, and professional diploma programs designed to launch your global career.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Sticky Filters bar */}
      <section className="py-6 bg-white border-b sticky top-[72px] md:top-[120px] z-40 shadow-sm">
        <div className="container-wide">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">

            {/* Level selection buttons */}
            <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-2">Level:</span>
              {levels.map(level => (
                <button
                  key={level}
                  onClick={() => setSelectedLevel(level)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all border ${selectedLevel === level
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                    : 'bg-white text-slate-600 border-slate-100 hover:bg-slate-50'
                    }`}
                >
                  {level === 'all' ? 'All Programs' : level.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Right side: search & department select */}
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto shrink-0">

              {/* Search */}
              <div className="relative w-full sm:w-60">
                <Search className="absolute left-3 top-2.5 h-4.5 w-4.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search programs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-slate-800 text-xs bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                />
              </div>

              {/* Department select */}
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="w-full sm:w-56 px-3 py-2 text-slate-800 text-xs bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all cursor-pointer font-semibold"
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

      {/* Programs grid */}
      <section className="py-12">
        <div className="container-wide">

          <div className="text-xs text-slate-400 font-bold tracking-wider uppercase mb-8">
            Showing {filteredCourses.length} Program{filteredCourses.length !== 1 ? 's' : ''}
          </div>

          <AnimatePresence mode="wait">
            {filteredCourses.length > 0 ? (
              <motion.div
                key="grid"
                initial="initial"
                animate="animate"
                variants={staggerContainer}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {filteredCourses.map((course) => {
                  const gradient = getCourseGradient(course.code)
                  const hasStreams = course.core_subjects && course.core_subjects.length > 0

                  return (
                    <motion.div key={course.id} variants={fadeIn} className="group">
                      <Link href={course?.code ? `/courses/${course.code.toLowerCase()}` : '#'} className="block h-full">
                        <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full flex flex-col justify-between">

                          {/* Top Part: Gradient Header */}
                          <div className={`bg-gradient-to-br ${gradient} p-7 text-white relative`}>
                            <BookOpen className="h-9 w-9 mb-4 opacity-80" />
                            <h3 className="font-display text-xl font-bold leading-snug min-h-[3.5rem] flex items-center">{course.name}</h3>
                            <div className="flex items-center gap-4 mt-3 text-white/70 text-sm">
                              <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" />{course.duration}</span>
                              {course.seats && (
                                <span className="flex items-center gap-1.5"><Users className="h-4 w-4" />{course.seats} Seats</span>
                              )}
                            </div>

                            <span className="absolute top-4 right-4 px-2.5 py-0.5 bg-white/20 backdrop-blur-md text-white border border-white/20 text-[9px] font-extrabold rounded-md uppercase tracking-wider shadow-sm z-10">
                              {course.level.toUpperCase()}
                            </span>
                          </div>

                          {/* Bottom Part: Content / Streams */}
                          <div className="bg-white p-6 flex-1 flex flex-col justify-between">
                            <div>
                              {hasStreams ? (
                                <>
                                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Available Streams</p>
                                  <ul className="space-y-2">
                                    {course.core_subjects!.slice(0, 5).map((s, idx) => (
                                      <li key={idx} className="flex items-start gap-2 text-slate-700 text-sm">
                                        <CheckCircle2 className="h-4 w-4 text-gold-500 shrink-0 mt-0.5" />
                                        <span className="line-clamp-1">{s}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </>
                              ) : (
                                <>
                                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Program Overview</p>
                                  <p className="text-slate-600 text-sm leading-relaxed line-clamp-5">
                                    {course.overview || 'A comprehensive program designed to prepare students for successful careers.'}
                                  </p>
                                </>
                              )}

                              {course.annual_fee && (
                                <div className="flex items-center justify-between mt-5 pt-3 border-t border-slate-100">
                                  <span className="text-[9px] font-bold text-slate-400 tracking-wider uppercase">Annual Fee</span>
                                  <span className="font-extrabold text-academic-900 flex items-center text-sm sm:text-base">
                                    <IndianRupee className="w-3.5 h-3.5 shrink-0" />
                                    ₹{Number(course.annual_fee).toLocaleString('en-IN')}/year
                                  </span>
                                </div>
                              )}
                            </div>

                            <div className="inline-flex items-center gap-1.5 mt-6 text-academic-700 font-semibold text-sm hover:text-gold-600 transition-colors">
                              Course Details <ArrowRight className="h-4 w-4" />
                            </div>
                          </div>

                        </div>
                      </Link>
                    </motion.div>
                  )
                })}
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16 bg-white border border-slate-100 rounded-3xl"
              >
                <Info className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h4 className="font-bold text-slate-800 text-sm mb-1">No Academic Programs Found</h4>
                <p className="text-slate-400 text-xs">
                  No courses match your query or filter criteria.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </section>

    </div>
  )
}
