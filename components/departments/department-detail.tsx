'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { User, Award, BookOpen, Eye, Target, Beaker, Lightbulb } from 'lucide-react'
import type { Department, Faculty, Course } from '@/types/database'
import { FacultyDetailModal } from '@/components/faculty/faculty-detail-modal'

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
}

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.1 } }
}

interface DepartmentDetailPageProps {
  department: Department
  faculty: Faculty[]
  courses: Course[]
}

export function DepartmentDetailPage({ department, faculty, courses }: DepartmentDetailPageProps) {
  const hod = faculty.find(f => f.is_hod) || faculty[0]
  const [selectedFaculty, setSelectedFaculty] = useState<Faculty | null>(null)

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative bg-academic-900 py-20 lg:py-28">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gold-500 rounded-full blur-3xl" />
        </div>
        <div className="relative container-wide">
          <motion.div
            initial="initial"
            animate="animate"
            variants={staggerContainer}
            className="max-w-3xl"
          >
            <motion.span
              variants={fadeIn}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gold-500/20 border border-gold-500/30 rounded-full text-gold-500 text-sm font-medium mb-6"
            >
              <BookOpen className="h-4 w-4" />
              Department
            </motion.span>
            <motion.h1
              variants={fadeIn}
              className="font-display text-4xl md:text-5xl font-bold text-white mb-4"
            >
              {department.name}
            </motion.h1>
            {department.description && (
              <motion.p variants={fadeIn} className="text-gray-300 text-lg">
                {department.description}
              </motion.p>
            )}
          </motion.div>
        </div>
      </section>

      {/* Overview */}
      <section className="section-padding">
        <div className="container-wide">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid lg:grid-cols-3 gap-8"
          >
            <motion.div variants={fadeIn} className="lg:col-span-2">
              <h2 className="font-display text-3xl font-bold text-academic-900 mb-6">Overview</h2>
              <div className="prose prose-lg max-w-none text-gray-600">
                <p className="text-base md:text-lg leading-relaxed">
                  {department.overview || 'The department offers comprehensive programs designed to provide students with strong theoretical foundations and practical skills. Our curriculum is regularly updated to meet industry requirements and global standards.'}
                </p>
              </div>

              {/* Vision & Mission */}
              <div className="grid md:grid-cols-2 gap-6 mt-10">
                {department.vision && (
                  <div className="bg-gray-50 p-6 rounded-xl">
                    <div className="flex items-center gap-3 mb-3">
                      <Eye className="h-5 w-5 text-gold-600" />
                      <h3 className="font-display text-lg font-semibold text-academic-900">Vision</h3>
                    </div>
                    <p className="text-gray-600 text-sm">{department.vision}</p>
                  </div>
                )}
                {department.mission && (
                  <div className="bg-gray-50 p-6 rounded-xl">
                    <div className="flex items-center gap-3 mb-3">
                      <Target className="h-5 w-5 text-gold-600" />
                      <h3 className="font-display text-lg font-semibold text-academic-900">Mission</h3>
                    </div>
                    <p className="text-gray-600 text-sm">{department.mission}</p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Quick Stats */}
            <motion.div variants={fadeIn}>
              <div className="bg-academic-900 rounded-xl p-6 text-white space-y-6">
                {courses.length > 0 && (
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gold-500 rounded-lg flex items-center justify-center">
                      <BookOpen className="h-6 w-6 text-academic-900" />
                    </div>
                    <div>
                      <div className="text-2xl font-display font-bold">{courses.length}</div>
                      <div className="text-gray-400 text-sm">Programs Offered</div>
                    </div>
                  </div>
                )}
                {faculty.length > 0 && (
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gold-500 rounded-lg flex items-center justify-center">
                      <User className="h-6 w-6 text-academic-900" />
                    </div>
                    <div>
                      <div className="text-2xl font-display font-bold">{faculty.length}</div>
                      <div className="text-gray-400 text-sm">Faculty Members</div>
                    </div>
                  </div>
                )}
                {department.established_year && (
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gold-500 rounded-lg flex items-center justify-center">
                      <Award className="h-6 w-6 text-academic-900" />
                    </div>
                    <div>
                      <div className="text-2xl font-display font-bold">{department.established_year}</div>
                      <div className="text-gray-400 text-sm">Year Established</div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Facilities */}
      {department.facilities && department.facilities.length > 0 && (
        <section className="section-padding bg-gray-50">
          <div className="container-wide">
            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              <motion.h2 variants={fadeIn} className="font-display text-3xl font-bold text-academic-900 mb-8">
                Facilities & Infrastructure
              </motion.h2>
              <motion.div
                variants={staggerContainer}
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-4"
              >
                {department.facilities.map((facility, index) => (
                  <motion.div
                    key={index}
                    variants={fadeIn}
                    className="flex items-start gap-3 bg-white p-4 rounded-lg border border-gray-100"
                  >
                    <div className="w-8 h-8 bg-gold-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Beaker className="h-4 w-4 text-gold-600" />
                    </div>
                    <span className="text-gray-700">{facility}</span>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Research Areas */}
      {department.research_areas && department.research_areas.length > 0 && (
        <section className="section-padding">
          <div className="container-wide">
            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              <motion.div variants={fadeIn} className="flex items-center gap-3 mb-8">
                <Lightbulb className="h-8 w-8 text-gold-600" />
                <h2 className="font-display text-3xl font-bold text-academic-900">Research Areas</h2>
              </motion.div>
              <motion.div variants={staggerContainer} className="flex flex-wrap gap-3">
                {department.research_areas.map((area, index) => (
                  <motion.span
                    key={index}
                    variants={fadeIn}
                    className="px-4 py-2 bg-academic-50 text-academic-900 rounded-full text-sm font-medium"
                  >
                    {area}
                  </motion.span>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </section>
      )}

      {/* HOD Message */}
      {hod && (
        <section className="section-padding bg-academic-900 text-white">
          <div className="container-wide">
            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="grid lg:grid-cols-3 gap-8 items-center"
            >
              <motion.div variants={fadeIn} className="lg:col-span-2 order-2 lg:order-1">
                <span className="text-gold-500 font-semibold text-sm uppercase tracking-wide">
                  Message from HOD
                </span>
                <h2 className="font-display text-2xl md:text-3xl font-bold text-white mt-2 mb-6">
                  {department.hod_name || hod.name}
                </h2>
                <p className="text-gray-300 leading-relaxed">
                  {department.hod_message || 'Welcome to our department. We are committed to providing quality education and fostering research excellence. Our faculty and students work together to push the boundaries of knowledge and innovation.'}
                </p>
              </motion.div>
              <motion.div variants={fadeIn} className="order-1 lg:order-2">
                <div className="w-40 h-40 bg-gold-500 rounded-full mx-auto flex items-center justify-center overflow-hidden">
                  {hod.image_url ? (
                    <img src={hod.image_url} alt={hod.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-academic-900 font-display font-bold text-4xl">
                      {hod.name.charAt(0)}
                    </span>
                  )}
                </div>
                {hod.qualification && (
                  <p className="text-center mt-4 text-gray-400 text-sm">{hod.qualification}</p>
                )}
              </motion.div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Faculty */}
      {faculty.length > 0 && (
        <section className="section-padding">
          <div className="container-wide">
            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              <motion.h2 variants={fadeIn} className="font-display text-3xl font-bold text-academic-900 mb-8">
                Our Faculty
              </motion.h2>
              <motion.div
                variants={staggerContainer}
                className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
              >
                {faculty.slice(0, 8).map((member) => (
                  <motion.div key={member.id} variants={fadeIn}>
                    <div 
                      onClick={() => setSelectedFaculty(member)}
                      className="text-center p-6 bg-white border border-gray-100 rounded-xl hover:shadow-lg transition-shadow cursor-pointer"
                    >
                      <div className="w-20 h-20 bg-academic-100 rounded-full mx-auto flex items-center justify-center overflow-hidden mb-4">
                        {member.image_url ? (
                          <img src={member.image_url} alt={member.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-academic-900 font-display font-bold text-2xl">
                            {member.name.charAt(0)}
                          </span>
                        )}
                      </div>
                      <h3 className="font-display font-semibold text-academic-900">{member.name}</h3>
                      <p className="text-gold-600 text-sm">{member.designation}</p>
                      {member.specialization && (
                        <p className="text-gray-500 text-xs mt-1">{member.specialization}</p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Programs */}
      {courses.length > 0 && (
        <section className="section-padding bg-gray-50">
          <div className="container-wide">
            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              <motion.h2 variants={fadeIn} className="font-display text-3xl font-bold text-academic-900 mb-8">
                Programs Offered
              </motion.h2>
              <motion.div
                variants={staggerContainer}
                className="grid md:grid-cols-2 gap-6"
              >
                {courses.map((course) => (
                  <motion.div key={course.id} variants={fadeIn}>
                    <Link href={course?.code ? `/courses/${course.code.toLowerCase()}` : '#'} className="block group h-full">
                      <div className="bg-white p-6 rounded-xl border border-gray-100 hover:shadow-lg hover:border-gold-300 transition-all h-full flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <span className="px-3 py-1 bg-academic-100 text-academic-900 text-xs font-semibold rounded uppercase">
                              {course.level}
                            </span>
                            <span className="text-gray-500 text-sm">{course.duration}</span>
                          </div>
                          <h3 className="font-display text-lg font-semibold text-academic-900 mb-2 group-hover:text-gold-600 transition-colors">
                            {course.name}
                          </h3>
                          {course.overview && (
                            <p className="text-gray-600 text-sm mb-4 line-clamp-2">{course.overview}</p>
                          )}
                        </div>
                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-50">
                          {course.seats ? (
                            <p className="text-xs text-gray-400">Intake: {course.seats} seats</p>
                          ) : (
                            <div />
                          )}
                          <span className="inline-flex items-center gap-1 text-gold-600 text-xs font-semibold">
                            View Details →
                          </span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </section>
      )}
      <FacultyDetailModal
        faculty={selectedFaculty ? { ...selectedFaculty, department } : null}
        isOpen={!!selectedFaculty}
        onClose={() => setSelectedFaculty(null)}
      />
    </div>
  )
}
