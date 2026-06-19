'use client'

import { motion } from 'framer-motion'
import { Award, Target, Eye, Flag, Users, BookOpen, Building2, Medal, Calendar } from 'lucide-react'
import type { SiteSettings, Milestone, Accreditation, Leadership } from '@/types/database'

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
}

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.1 } }
}

interface AboutPageProps {
  settings: SiteSettings | null
  milestones: Milestone[]
  accreditations: Accreditation[]
  leadership: Leadership[]
}

export function AboutPage({ settings, milestones, accreditations, leadership }: AboutPageProps) {
  const currentYear = new Date().getFullYear()
  const establishedYear = settings?.established_year || 1965
  const yearsOfExcellence = currentYear - establishedYear

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
              About National College
            </motion.h1>
            <motion.p variants={fadeIn} className="text-gray-400 text-lg max-w-3xl mx-auto">
              A premier autonomous institution in Bangalore, committed to academic excellence and holistic development since 1965.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* History Section */}
      <section id="history" className="section-padding">
        <div className="container-wide">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid lg:grid-cols-2 gap-12 items-center"
          >
            <motion.div variants={fadeIn}>
              <span className="text-gold-600 font-semibold text-sm uppercase tracking-wide">Our History</span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-academic-900 mt-2 mb-6">
                {yearsOfExcellence}+ Years of Excellence
              </h2>
              <div className="prose prose-lg text-gray-600 space-y-4">
                <p>
                  National College Jayanagar was established in 1965 with a vision to provide quality higher education to students from all walks of life. What started as a small institution has grown into one of the most respected colleges in Karnataka.
                </p>
                <p>
                  Over the decades, we have consistently evolved to meet the changing demands of education and industry. Our autonomous status, granted in 1995, has enabled us to design innovative curricula that prepare students for the challenges of the modern world.
                </p>
                <p>
                  Our commitment to excellence has been recognized through various accreditations and awards, including the prestigious NAAC A++ grade, reflecting our dedication to quality education and research.
                </p>
              </div>
              <div className="grid grid-cols-3 gap-4 mt-8">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="font-display text-3xl font-bold text-academic-900">{establishedYear}</div>
                  <div className="text-sm text-gray-500">Founded</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="font-display text-3xl font-bold text-academic-900">1995</div>
                  <div className="text-sm text-gray-500">Autonomous</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="font-display text-3xl font-bold text-academic-900">50K+</div>
                  <div className="text-sm text-gray-500">Alumni</div>
                </div>
              </div>
            </motion.div>

            <motion.div variants={fadeIn} className="relative">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100">
                <img
                  src="https://images.pexels.com/photos/2897375/pexels-photo-2897375.jpeg"
                  alt="National College Campus"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 w-48 h-48 bg-gold-500 rounded-2xl -z-0" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section id="vision-mission" className="section-padding bg-gray-50">
        <div className="container-wide">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-2 gap-8"
          >
            <motion.div variants={fadeIn} className="bg-white p-8 rounded-2xl shadow-sm">
              <div className="w-16 h-16 bg-gold-100 rounded-full flex items-center justify-center mb-6">
                <Eye className="h-8 w-8 text-gold-600" />
              </div>
              <h3 className="font-display text-2xl font-bold text-academic-900 mb-4">Our Vision</h3>
              <p className="text-gray-600 leading-relaxed">
                To be a globally recognized institution of excellence in higher education, fostering innovation, research, and community service while preparing students to be responsible citizens and leaders.
              </p>
            </motion.div>

            <motion.div variants={fadeIn} className="bg-white p-8 rounded-2xl shadow-sm">
              <div className="w-16 h-16 bg-academic-100 rounded-full flex items-center justify-center mb-6">
                <Target className="h-8 w-8 text-academic-900" />
              </div>
              <h3 className="font-display text-2xl font-bold text-academic-900 mb-4">Our Mission</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-3">
                  <span className="text-gold-500 mt-1">•</span>
                  Provide quality education that meets global standards
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-gold-500 mt-1">•</span>
                  Foster research, innovation, and entrepreneurship
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-gold-500 mt-1">•</span>
                  Develop ethical and socially responsible graduates
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-gold-500 mt-1">•</span>
                  Build strong industry-academia partnerships
                </li>
              </ul>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Leadership */}
      <section id="leadership" className="section-padding">
        <div className="container-wide">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeIn} className="text-center mb-12">
              <span className="text-gold-600 font-semibold text-sm uppercase tracking-wide">Leadership</span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-academic-900 mt-2">
                Our Leadership Team
              </h2>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {leadership.map((member) => (
                <motion.div key={member.id} variants={fadeIn}>
                  <div className="bg-white border border-gray-100 rounded-xl p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-20 bg-academic-100 rounded-full flex items-center justify-center overflow-hidden">
                        {member.image_url ? (
                          <img src={member.image_url} alt={member.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-academic-900 font-display font-bold text-2xl">
                            {member.name.charAt(0)}
                          </span>
                        )}
                      </div>
                      <div>
                        <h3 className="font-display text-lg font-semibold text-academic-900">
                          {member.name}
                        </h3>
                        <p className="text-gold-600 text-sm">{member.designation}</p>
                        {member.qualification && (
                          <p className="text-gray-500 text-xs mt-1">{member.qualification}</p>
                        )}
                      </div>
                    </div>
                    {member.bio && (
                      <p className="mt-4 text-gray-600 text-sm line-clamp-3">{member.bio}</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Accreditation */}
      <section id="accreditation" className="section-padding bg-academic-900 text-white">
        <div className="container-wide">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeIn} className="text-center mb-12">
              <span className="text-gold-500 font-semibold text-sm uppercase tracking-wide">Accreditation</span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-white mt-2">
                Recognized Excellence
              </h2>
              <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
                Our commitment to quality education is validated by leading accreditation bodies.
              </p>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              className="grid md:grid-cols-3 gap-6"
            >
              {accreditations.map((acc) => (
                <motion.div key={acc.id} variants={fadeIn}>
                  <div className="bg-white/10 border border-white/20 rounded-xl p-6 text-center">
                    <div className="w-20 h-20 bg-gold-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Medal className="h-10 w-10 text-academic-900" />
                    </div>
                    <h3 className="font-display text-xl font-semibold text-white mb-2">
                      {acc.name}
                    </h3>
                    <p className="text-gold-500 font-semibold mb-2">
                      {acc.issuing_body}
                      {acc.grade && ` - ${acc.grade}`}
                    </p>
                    {acc.valid_until && (
                      <p className="text-gray-400 text-sm">
                        Valid until {new Date(acc.valid_until).getFullYear()}
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section-padding">
        <div className="container-wide">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeIn} className="text-center mb-12">
              <span className="text-gold-600 font-semibold text-sm uppercase tracking-wide">Our Journey</span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-academic-900 mt-2">
                Milestones & Achievements
              </h2>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              className="relative max-w-3xl mx-auto"
            >
              {milestones.map((milestone, index) => (
                <motion.div
                  key={milestone.id}
                  variants={fadeIn}
                  className="relative flex gap-6 pb-12 last:pb-0"
                >
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-academic-900 rounded-full flex items-center justify-center text-white font-display font-bold">
                      {milestone.year}
                    </div>
                    {index < milestones.length - 1 && (
                      <div className="w-0.5 h-full bg-academic-200 absolute left-8 top-16 -translate-x-1/2" />
                    )}
                  </div>
                  <div className="pt-3">
                    <h3 className="font-display text-xl font-semibold text-academic-900 mb-2">
                      {milestone.title}
                    </h3>
                    <p className="text-gray-600">{milestone.description}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
