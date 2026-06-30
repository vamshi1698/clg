'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, Mail, Phone, Award, BookOpen, GraduationCap, Briefcase, Star, Lightbulb } from 'lucide-react'
import type { Faculty } from '@/types/database'

interface FacultyDetailModalProps {
  faculty: (Faculty & { department?: { name: string } | null }) | null
  isOpen: boolean
  onClose: () => void
}

export function FacultyDetailModal({ faculty, isOpen, onClose }: FacultyDetailModalProps) {
  if (!faculty) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-10">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md cursor-pointer"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="relative bg-white w-full max-w-2xl max-h-[85vh] rounded-3xl shadow-2xl overflow-y-auto z-10 border border-slate-100 flex flex-col"
          >
            {/* Header / Close button */}
            <div className="absolute top-4 right-4 z-20">
              <button
                onClick={onClose}
                className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-950 rounded-full transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-6 sm:p-8 md:p-10 space-y-8 flex-1">
              
              {/* Top Profile Banner */}
              <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start text-center sm:text-left border-b border-slate-100 pb-6">
                {/* Photo */}
                <div className="w-28 h-28 sm:w-32 sm:h-32 bg-gradient-to-br from-academic-50 to-academic-100/60 rounded-3xl overflow-hidden shadow-md flex-shrink-0 flex items-center justify-center relative">
                  {faculty.image_url ? (
                    <img
                      src={faculty.image_url}
                      alt={faculty.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-academic-900 font-display font-extrabold text-4xl">
                      {faculty.name.charAt(0)}
                    </span>
                  )}
                </div>

                {/* Profile Meta */}
                <div className="space-y-2.5 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <span className="px-2.5 py-0.5 bg-amber-500/10 text-amber-600 border border-amber-500/20 text-[10px] font-extrabold rounded-md uppercase tracking-wider">
                      {faculty.designation}
                    </span>
                    {faculty.is_hod && (
                      <span className="px-2.5 py-0.5 bg-blue-500/10 text-blue-600 border border-blue-500/20 text-[10px] font-extrabold rounded-md uppercase tracking-wider">
                        Head of Dept
                      </span>
                    )}
                  </div>

                  <h2 className="font-display font-extrabold text-slate-900 text-2xl leading-tight">
                    {faculty.name}
                  </h2>

                  {faculty.department?.name && (
                    <p className="text-slate-500 font-semibold text-sm">
                      Department of {faculty.department.name}
                    </p>
                  )}

                  {faculty.qualification && (
                    <p className="text-slate-400 font-medium text-xs flex items-center justify-center sm:justify-start gap-1">
                      <GraduationCap className="h-4 w-4 text-blue-500 shrink-0" />
                      {faculty.qualification}
                    </p>
                  )}
                </div>
              </div>

              {/* Bio description */}
              {faculty.bio && (
                <div className="space-y-2">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">About / Biography</h3>
                  <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">{faculty.bio}</p>
                </div>
              )}

              {/* Core Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
                {/* Academic Qualifications List */}
                {faculty.qualifications && faculty.qualifications.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <GraduationCap className="h-4 w-4 text-blue-500" /> Academic Profile
                    </h3>
                    <ul className="text-slate-600 text-xs font-medium space-y-1">
                      {faculty.qualifications.map((q, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-amber-500">•</span> {q}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Experience & stats */}
                {(faculty.experience_years !== null || faculty.publications_count !== null) && (
                  <div className="space-y-3.5">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Briefcase className="h-4 w-4 text-blue-500" /> Career Profile
                    </h3>
                    <div className="space-y-2">
                      {faculty.experience_years !== null && (
                        <div className="flex justify-between items-center bg-white p-2.5 rounded-xl border border-slate-100 text-xs">
                          <span className="text-slate-500 font-semibold">Teaching Experience</span>
                          <span className="text-slate-800 font-bold">{faculty.experience_years} Years</span>
                        </div>
                      )}
                      {faculty.publications_count !== null && faculty.publications_count > 0 && (
                        <div className="flex justify-between items-center bg-white p-2.5 rounded-xl border border-slate-100 text-xs">
                          <span className="text-slate-500 font-semibold">Research Publications</span>
                          <span className="inline-flex items-center gap-1 text-slate-800 font-bold">
                            <BookOpen className="h-3.5 w-3.5 text-blue-500" /> {faculty.publications_count} Articles
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Research Interests & Specializations */}
              {(faculty.specialization || (faculty.research_interests && faculty.research_interests.length > 0)) && (
                <div className="space-y-4">
                  {faculty.specialization && (
                    <div className="space-y-1.5">
                      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Area of Specialization</h3>
                      <p className="text-slate-800 font-semibold text-sm">{faculty.specialization}</p>
                    </div>
                  )}

                  {faculty.research_interests && faculty.research_interests.length > 0 && (
                    <div className="space-y-2">
                      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Lightbulb className="h-4 w-4 text-amber-500" /> Research Interests
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {faculty.research_interests.map((ri, idx) => (
                          <span key={idx} className="px-3 py-1 bg-blue-50/50 border border-blue-100 text-blue-700 text-xs rounded-full font-medium">
                            {ri}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Achievements */}
              {faculty.achievements && faculty.achievements.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Star className="h-4 w-4 text-amber-500" /> Key Achievements / Awards
                  </h3>
                  <div className="space-y-2">
                    {faculty.achievements.map((ach, idx) => (
                      <div key={idx} className="flex gap-3 items-start bg-gold-500/5 border border-gold-500/10 p-3 rounded-xl">
                        <Award className="h-5 w-5 text-gold-600 shrink-0 mt-0.5" />
                        <span className="text-slate-700 text-xs sm:text-sm font-medium">{ach}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Contact Details */}
              {(faculty.email || faculty.phone) && (
                <div className="border-t border-slate-100 pt-6 space-y-3">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Contact Details</h3>
                  <div className="flex flex-col sm:flex-row gap-4 text-xs font-semibold">
                    {faculty.email && (
                      <a
                        href={`mailto:${faculty.email}`}
                        className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors"
                      >
                        <Mail className="h-4.5 w-4.5 text-blue-500 shrink-0" />
                        <span>{faculty.email}</span>
                      </a>
                    )}
                    {faculty.phone && (
                      <a
                        href={`tel:${faculty.phone}`}
                        className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors"
                      >
                        <Phone className="h-4.5 w-4.5 text-blue-500 shrink-0" />
                        <span>{faculty.phone}</span>
                      </a>
                    )}
                  </div>
                </div>
              )}

            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
