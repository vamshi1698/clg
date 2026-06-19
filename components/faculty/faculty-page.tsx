'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Search, Mail, Award, BookOpen } from 'lucide-react'
import type { Faculty, Department } from '@/types/database'

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
}

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.05 } }
}

interface FacultyPageProps {
  faculty: Faculty[]
  departments: Department[]
}

export function FacultyPage({ faculty, departments }: FacultyPageProps) {
  const [search, setSearch] = useState('')
  const [selectedDept, setSelectedDept] = useState('all')

  const filteredFaculty = useMemo(() => {
    return faculty.filter(member => {
      const matchesSearch = member.name.toLowerCase().includes(search.toLowerCase()) ||
        (member.specialization && member.specialization.toLowerCase().includes(search.toLowerCase()))
      const matchesDept = selectedDept === 'all' || member.department_id === selectedDept
      return matchesSearch && matchesDept
    })
  }, [faculty, search, selectedDept])

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
              Our Faculty
            </motion.h1>
            <motion.p variants={fadeIn} className="text-gray-400 text-lg max-w-3xl mx-auto">
              Meet our distinguished faculty members - experienced educators and researchers dedicated to shaping future leaders.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Search & Filter */}
      <section className="py-8 bg-gray-50 border-b sticky top-[72px] md:top-[120px] z-40">
        <div className="container-wide">
          <div className="flex flex-col md:flex-row gap-4 justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search faculty..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
              />
            </div>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="px-4 py-2 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
            >
              <option value="all">All Departments</option>
              {departments.map(dept => (
                <option key={dept.id} value={dept.id}>{dept.name}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Faculty Grid */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="text-sm text-gray-500 mb-6">
            {filteredFaculty.length} faculty member{filteredFaculty.length !== 1 ? 's' : ''}
          </div>

          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {filteredFaculty.map((member) => (
              <motion.div key={member.id} variants={fadeIn}>
                <div className="bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-square bg-academic-100 relative">
                    {member.image_url ? (
                      <img src={member.image_url} alt={member.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-academic-300 font-display font-bold text-6xl">
                          {member.name.charAt(0)}
                        </span>
                      </div>
                    )}
                    {member.is_hod && (
                      <span className="absolute top-4 right-4 px-2 py-1 bg-gold-500 text-academic-900 text-xs font-semibold rounded">
                        HOD
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-display font-semibold text-academic-900 text-lg">
                      {member.name}
                    </h3>
                    <p className="text-gold-600 text-sm">{member.designation}</p>
                    {member.department && (
                      <p className="text-gray-500 text-sm mt-1">{member.department.name}</p>
                    )}
                    {member.qualification && (
                      <p className="text-xs text-gray-400 mt-2">{member.qualification}</p>
                    )}

                    {(member.email || member.publications_count > 0) && (
                      <div className="mt-4 pt-4 border-t flex items-center gap-4 text-sm">
                        {member.email && (
                          <a href={`mailto:${member.email}`} className="text-gray-500 hover:text-gold-600">
                            <Mail className="h-4 w-4" />
                          </a>
                        )}
                        {member.publications_count > 0 && (
                          <span className="flex items-center gap-1 text-xs text-gray-400">
                            <BookOpen className="h-3 w-3" />
                            {member.publications_count} pubs
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  )
}
