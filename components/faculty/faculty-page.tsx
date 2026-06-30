'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Mail, Award, BookOpen, User, GraduationCap, Info } from 'lucide-react'
import type { Faculty, Department } from '@/types/database'
import { FacultyDetailModal } from '@/components/faculty/faculty-detail-modal'

interface FacultyPageProps {
  faculty: Faculty[]
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

export function FacultyPage({ faculty, departments }: FacultyPageProps) {
  const [search, setSearch] = useState('')
  const [selectedDept, setSelectedDept] = useState('all')
  const [selectedFaculty, setSelectedFaculty] = useState<any | null>(null)

  // Map over faculty to attach department objects for rendering HOD/department names correctly
  const facultyWithDept = useMemo(() => {
    return faculty.map(member => {
      const dept = departments.find(d => d.id === member.department_id)
      return {
        ...member,
        department: dept
      }
    })
  }, [faculty, departments])

  // Filter faculty based on search and selected department
  const filteredFaculty = useMemo(() => {
    return facultyWithDept.filter(member => {
      const matchesSearch = member.name.toLowerCase().includes(search.toLowerCase()) ||
        (member.specialization && member.specialization.toLowerCase().includes(search.toLowerCase())) ||
        (member.qualification && member.qualification.toLowerCase().includes(search.toLowerCase()))
      
      const matchesDept = selectedDept === 'all' || member.department_id === selectedDept
      return matchesSearch && matchesDept
    })
  }, [facultyWithDept, search, selectedDept])

  // Group filtered faculty by department
  const facultyGroupedByDept = useMemo(() => {
    const groups: Record<string, Faculty[]> = {}
    
    filteredFaculty.forEach(member => {
      const deptId = member.department_id || 'other'
      if (!groups[deptId]) {
        groups[deptId] = []
      }
      groups[deptId].push(member)
    })
    
    const sortedGroups: { department: Department | null; faculty: Faculty[] }[] = []
    
    // Sort departments by sort_order
    const sortedDepartments = [...departments].sort((a, b) => a.sort_order - b.sort_order)
    
    sortedDepartments.forEach(dept => {
      if (groups[dept.id] && groups[dept.id].length > 0) {
        // Sort HOD first, then sort_order
        const sortedFaculty = [...groups[dept.id]].sort((a, b) => {
          if (a.is_hod && !b.is_hod) return -1
          if (!a.is_hod && b.is_hod) return 1
          return (a.sort_order || 0) - (b.sort_order || 0)
        })
        
        sortedGroups.push({
          department: dept,
          faculty: sortedFaculty
        })
      }
    })
    
    // Handle others (in case some faculty are not linked to any department or linked to inactive department)
    if (groups['other'] && groups['other'].length > 0) {
      sortedGroups.push({
        department: null,
        faculty: groups['other']
      })
    }
    
    return sortedGroups
  }, [filteredFaculty, departments])

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
              <Award className="h-4 w-4" />
              Distinguished Educators
            </motion.span>
            <h1 className="font-display text-4xl md:text-5xl font-extrabold text-white mb-4">
              Our Faculty Directory
            </h1>
            <p className="text-gray-300 text-base md:text-lg max-w-2xl mx-auto">
              Meet our academic staff — experienced lecturers, mentors, and research scholars dedicated to student success.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter Controls */}
      <section className="py-6 bg-white border-b sticky top-[72px] md:top-[120px] z-40 shadow-sm">
        <div className="container-wide">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            
            {/* Search Input */}
            <div className="relative w-full sm:max-w-md">
              <Search className="absolute left-3 top-2.5 h-4.5 w-4.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name, specialization, or qualification..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-slate-800 text-xs bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              />
            </div>

            {/* Department Dropdown */}
            <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
              <span className="text-xs text-slate-400 font-bold tracking-wider uppercase">Filter:</span>
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="w-full sm:w-64 px-3 py-2 text-slate-800 text-xs bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all cursor-pointer font-semibold"
              >
                <option value="all">All Departments</option>
                {departments.map(dept => (
                  <option key={dept.id} value={dept.id}>{dept.name}</option>
                ))}
              </select>
            </div>

          </div>
        </div>
      </section>

      {/* Directory Grid */}
      <section className="py-12">
        <div className="container-wide">
          
          <div className="text-xs text-slate-400 font-bold tracking-wider uppercase mb-8">
            Showing {filteredFaculty.length} Faculty Member{filteredFaculty.length !== 1 ? 's' : ''}
          </div>

          <AnimatePresence mode="wait">
            {facultyGroupedByDept.length > 0 ? (
              <div key="grid-container" className="space-y-16">
                {facultyGroupedByDept.map((group) => {
                  const deptId = group.department?.id || 'other'
                  const deptName = group.department?.name || 'General & Supporting Staff'
                  
                  return (
                    <div key={deptId} className="space-y-8">
                      
                      {/* Department Heading Section */}
                      <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                        <div className="p-2.5 bg-blue-50 border border-blue-100/50 rounded-2xl text-blue-600 shrink-0">
                          <GraduationCap className="h-5 w-5" />
                        </div>
                        <div>
                          <h2 className="font-display font-extrabold text-slate-900 text-lg md:text-xl">
                            Department of {deptName}
                          </h2>
                          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider pt-0.5">
                            {group.faculty.length} Member{group.faculty.length !== 1 ? 's' : ''}
                          </p>
                        </div>
                      </div>

                      {/* Faculty Grid */}
                      <motion.div
                        key={`grid-${deptId}`}
                        initial="initial"
                        animate="animate"
                        variants={staggerContainer}
                        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
                      >
                        {group.faculty.map((member) => (
                          <motion.div key={member.id} variants={fadeIn} className="group">
                            <div 
                              onClick={() => setSelectedFaculty(member)}
                              className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:border-gold-300/40 transition-all duration-300 h-full flex flex-col justify-between cursor-pointer"
                            >
                              <div>
                                
                                {/* Profile Photo */}
                                <div className="aspect-[4/5] bg-gradient-to-br from-academic-50 to-academic-100/60 relative overflow-hidden flex items-center justify-center">
                                  {member.image_url ? (
                                    <img 
                                      src={member.image_url} 
                                      alt={member.name} 
                                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center transition-transform duration-500 group-hover:scale-105">
                                      <span className="text-academic-900/65 font-display font-extrabold text-5xl">
                                        {member.name.charAt(0)}
                                      </span>
                                    </div>
                                  )}

                                  {member.is_hod && (
                                    <span className="absolute top-4 left-4 px-2.5 py-1 bg-amber-500 text-slate-950 text-[9px] font-extrabold rounded-md uppercase tracking-wider shadow-sm z-10">
                                      Head of Dept
                                    </span>
                                  )}
                                </div>

                                {/* Profile Info */}
                                <div className="p-5 space-y-2">
                                  <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider block">
                                    {member.designation}
                                  </span>
                                  <h3 className="font-display font-extrabold text-slate-900 text-base leading-snug group-hover:text-blue-600 transition-colors">
                                    {member.name}
                                  </h3>
                                  {member.department && (
                                    <p className="text-slate-500 text-xs font-semibold">
                                      Dept. of {member.department.name}
                                    </p>
                                  )}
                                  {member.qualification && (
                                    <div className="flex items-center gap-1 text-[10px] text-slate-400 font-bold uppercase tracking-wider pt-1">
                                      <GraduationCap className="w-3.5 h-3.5 text-blue-500" />
                                      <span className="truncate" title={member.qualification}>{member.qualification}</span>
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Contacts & Publications */}
                              {(member.email || member.publications_count > 0) && (
                                <div className="px-5 pb-5 pt-3 border-t border-slate-50 flex items-center justify-between text-xs">
                                  {member.email ? (
                                    <a 
                                      href={`mailto:${member.email}`} 
                                      onClick={(e) => e.stopPropagation()}
                                      className="inline-flex items-center gap-1.5 font-bold text-slate-400 hover:text-blue-600 transition-colors"
                                      title={`Email ${member.name}`}
                                    >
                                      <Mail className="h-4 w-4" />
                                      <span>Email Contact</span>
                                    </a>
                                  ) : (
                                    <div />
                                  )}
                                  
                                  {member.publications_count > 0 && (
                                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 border border-slate-100 rounded-md shadow-sm">
                                      <BookOpen className="h-3.5 h-3.5 text-blue-500" />
                                      {member.publications_count} pubs
                                    </span>
                                  )}
                                </div>
                              )}

                            </div>
                          </motion.div>
                        ))}
                      </motion.div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16 bg-white border border-slate-100 rounded-3xl"
              >
                <Info className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h4 className="font-bold text-slate-800 text-sm mb-1">No Faculty Members Found</h4>
                <p className="text-slate-400 text-xs">
                  No directory records match your search or filter options.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </section>

      <FacultyDetailModal
        faculty={selectedFaculty}
        isOpen={!!selectedFaculty}
        onClose={() => setSelectedFaculty(null)}
      />
    </div>
  )
}
