'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, Clock, Users, IndianRupee, BookOpen, GraduationCap, X, Calendar, FileText } from 'lucide-react'
import type { Course } from '@/types/database'

interface CourseDetailPageProps {
  course: Course
}

const syllabusMap: Record<string, string[]> = {
  BCA: [
    'Data Structures & Algorithms',
    'Web Development (MERN)',
    'Cloud Computing & DevOps',
    'Python & Machine Learning',
    'Database Management Systems'
  ],
  'BSC-CS': [
    'Computer Organization & Architecture',
    'Data Structures using C++',
    'Software Engineering & Agile',
    'Database Systems & SQL',
    'Operating Systems & Linux'
  ],
  'MSC-CS': [
    'Advanced Design & Analysis of Algorithms',
    'Artificial Intelligence & Deep Learning',
    'Cloud-Native Web Development',
    'Cryptography & Cyber Security',
    'Big Data Analytics & ML'
  ],
  BCOM: [
    'Financial Accounting & Analysis',
    'Business Laws & Practices',
    'Corporate Administration',
    'Principles of Marketing',
    'Direct Taxation Laws'
  ],
  MBA: [
    'Strategic & Human Resource Management',
    'Financial Management & Analysis',
    'Marketing Research & Analytics',
    'Supply Chain & Operations',
    'International Business & Strategy'
  ],
  'BE-ECE': [
    'Network Theory & Analysis',
    'Analog & Digital Circuits',
    'Microprocessors & Embed Systems',
    'VLSI Design Technologies',
    'Digital Signals & Communications'
  ],
  'BE-MECH': [
    'Applied Thermodynamics',
    'Fluid Dynamics & Machinery',
    'Computer Aided Design (CAD)',
    'Manufacturing Technology',
    'Robotics & Industrial Automation'
  ],
  'BSC-MATH': [
    'Advanced Calculus',
    'Abstract Algebra & Structures',
    'Numerical Methods & Analysis',
    'Probability & Mathematical Statistics',
    'Ordinary Differential Equations'
  ],
  'BSC-PHY': [
    'Classical Mechanics',
    'Electromagnetism & Waves',
    'Thermodynamics & Statistical Physics',
    'Intro to Quantum Mechanics',
    'Solid State Physics & Devices'
  ]
}

export function CourseDetailPage({ course }: CourseDetailPageProps) {
  const [isSyllabusOpen, setIsSyllabusOpen] = useState(false)

  const subjects = (course.core_subjects && course.core_subjects.length > 0)
    ? course.core_subjects
    : (syllabusMap[course.code.toUpperCase()] || [
      'Core Subjects & Fundamentals',
      'Applied Concepts & Laboratory',
      'Specialized Electives & Seminars',
      'Industry Integration Projects',
      'Emerging Trends & Methodologies'
    ])

  return (
    <div className="bg-slate-50/30 min-h-screen py-10">
      <div className="container-wide">

        {/* Back Link */}
        <Link
          href="/courses"
          className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-800 text-sm mb-8 transition-colors font-medium"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Programs
        </Link>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

          {/* Left Block: Course Overview & details (col-span-8) */}
          <div className="lg:col-span-8 space-y-8">
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm">
              <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-bold tracking-wider uppercase mb-4 border border-blue-100/50">
                {course.level === 'ug' ? 'Undergraduate' : course.level === 'pg' ? 'Postgraduate' : 'Academic'} Program
              </span>
              <h1 className="font-display text-3xl md:text-4xl font-extrabold text-academic-900 leading-tight mb-4">
                {course.name} ({course.code.toUpperCase()})
              </h1>
              {course.department && (
                <div className="flex items-center gap-2 text-slate-500 text-sm mb-6">
                  <GraduationCap className="w-4.5 h-4.5 text-blue-500" />
                  <span className="font-semibold text-slate-700">Department of {course.department.name}</span>
                </div>
              )}
              <hr className="border-slate-100 my-6" />
              <h2 className="font-display text-xl font-bold text-slate-900 mb-3">Course Overview</h2>
              <p className="text-slate-600 text-sm md:text-base leading-relaxed">
                {course.overview || 'A comprehensive program designed to equip students with critical theoretical knowledge and practical industry skills.'}
              </p>
            </div>

            {/* Quick specifications */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-start gap-4">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 shrink-0 border border-blue-100/50">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs text-slate-400 font-bold tracking-wider uppercase mb-1">Duration</h3>
                  <p className="font-bold text-slate-800 text-sm sm:text-base">{course.duration}</p>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-start gap-4">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 shrink-0 border border-blue-100/50">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs text-slate-400 font-bold tracking-wider uppercase mb-1">Intake Seats</h3>
                  <p className="font-bold text-slate-800 text-sm sm:text-base">{course.seats ? `${course.seats} Seats` : 'Contact Administration'}</p>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-start gap-4 md:col-span-2">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 shrink-0 border border-blue-100/50">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs text-slate-400 font-bold tracking-wider uppercase mb-1">Eligibility Criteria</h3>
                  <p className="font-bold text-slate-800 text-sm sm:text-base leading-normal">{course.eligibility || 'PUC / 10+2 or equivalent examination.'}</p>
                </div>
              </div>

            </div>
          </div>

          {/* Right Block: Action Card (col-span-4) */}
          <div className="lg:col-span-4 space-y-6">

            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
              <h3 className="font-display text-lg font-bold text-slate-900 mb-3">Course Curriculum</h3>
              <p className="text-slate-500 text-xs sm:text-sm mb-6 leading-relaxed">
                Explore the complete core subjects and syllabus details of the program to understand the curriculum focus.
              </p>

              <button
                onClick={() => setIsSyllabusOpen(true)}
                className="w-full py-3 bg-[#0F2D52] hover:bg-[#153B66] text-white text-xs font-bold rounded-2xl transition-all shadow-sm flex items-center justify-center gap-2 mb-3"
              >
                <FileText className="w-4 h-4" /> View Syllabus Overview
              </button>

              {course.annual_fee && (
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400 font-bold tracking-wider uppercase">Annual Fee</span>
                    <span className="font-extrabold text-academic-900 flex items-center text-base sm:text-lg">
                      <IndianRupee className="w-4 h-4 shrink-0" />
                      {course.annual_fee.toLocaleString()}/year
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-gradient-to-r from-[#03152c] to-[#0A2540] rounded-3xl p-6 text-white relative overflow-hidden shadow-md">
              <span className="text-[10px] font-bold text-blue-400 tracking-wider uppercase mb-2 block">ADMISSIONS OPEN</span>
              <h3 className="font-display text-base font-extrabold mb-3">Join National College</h3>
              <p className="text-slate-300 text-xs leading-relaxed mb-4">
                Applications are open for the academic year 2026-27. Secure your admission to our premier programs today.
              </p>
              <Link
                href="/admissions"
                className="inline-flex items-center justify-center w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold rounded-xl transition-all shadow-sm"
              >
                Apply Online Now
              </Link>
            </div>

          </div>

        </div>

      </div>

      {/* Syllabus Modal */}
      <AnimatePresence>
        {isSyllabusOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSyllabusOpen(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
            />

            {/* Modal Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: 'spring', duration: 0.4 }}
              className="bg-white rounded-3xl w-full max-w-lg shadow-2xl p-6 relative z-10 overflow-hidden border border-slate-100"
            >

              {/* Close Button top-right */}
              <button
                onClick={() => setIsSyllabusOpen(false)}
                className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 transition-colors p-1.5 hover:bg-slate-100 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Content */}
              <div>
                <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-bold tracking-wider uppercase mb-3 border border-blue-100/50">
                  SYLLABUS OVERVIEW
                </span>
                <h3 className="font-display text-xl sm:text-2xl font-extrabold text-academic-900 mb-2 leading-tight pr-8">
                  {course.name} ({course.code.toUpperCase()})
                </h3>
                <p className="text-slate-400 font-bold text-[10px] tracking-wider uppercase mt-4 mb-5">
                  CORE SUBJECTS & ELECTIVES
                </p>

                {/* Subjects List */}
                <div className="space-y-3 mb-6">
                  {subjects.map((subj, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 p-3.5 bg-slate-50 border border-slate-100/65 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300"
                    >
                      <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-sm">
                        {index + 1}
                      </div>
                      <span className="font-bold text-slate-800 text-xs sm:text-sm">
                        {subj}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Action close button */}
                <div className="flex justify-end mt-6">
                  <button
                    onClick={() => setIsSyllabusOpen(false)}
                    className="w-full sm:w-auto px-6 py-2.5 bg-[#05152c] hover:bg-[#081f3b] text-white text-xs font-bold rounded-xl shadow-md transition-colors"
                  >
                    Got it, Close
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
