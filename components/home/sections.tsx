'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Users, Award, Building2, TrendingUp, Calendar, MapPin, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import type { Statistics, News, Event, Course, Testimonial, Recruiter, Achievement, GalleryItem } from '@/types/database'

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
}

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.1 } }
}

// Hero Section
interface HeroSectionProps {
  image_url?: string
  tagline?: string
  established_year?: number
}

export function HeroSection({ image_url, tagline, established_year = 1965 }: HeroSectionProps) {
  const currentYear = new Date().getFullYear()
  const yearsOfExcellence = currentYear - established_year

  return (
    <section className="relative min-h-[600px] lg:min-h-[700px] flex items-center">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: image_url
            ? `url(${image_url})`
            : `url(https://images.pexels.com/photos/15698835/pexels-photo-15698835/free-photo-of-aerial-view-of-a-university-campus.jpeg)`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-academic-900/95 via-academic-900/85 to-academic-900/60" />

      <div className="relative container-wide section-padding text-white">
        <motion.div
          initial="initial"
          animate="animate"
          variants={staggerContainer}
          className="max-w-3xl"
        >
          <motion.div variants={fadeIn} className="mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-gold-500/20 border border-gold-500/30 rounded-full text-gold-500 text-sm font-medium">
              <Award className="h-4 w-4" />
              Autonomous Institution | NAAC A++ Accredited
            </span>
          </motion.div>

          <motion.h1
            variants={fadeIn}
            className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight"
          >
            Excellence in Education
            <span className="block text-gold-500">Since {established_year}</span>
          </motion.h1>

          <motion.p
            variants={fadeIn}
            className="text-lg md:text-xl text-gray-300 mb-8 leading-relaxed"
          >
            {tagline || 'A premier autonomous institution committed to academic excellence, holistic development, and preparing students for successful careers.'}
          </motion.p>

          <motion.div variants={fadeIn} className="flex flex-wrap gap-4">
            <Button asChild size="lg" className="btn-secondary text-base">
              <Link href="/admissions">
                Apply Now <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-academic-900">
              <Link href="/courses">
                Explore Courses
              </Link>
            </Button>
          </motion.div>

          <motion.div variants={fadeIn} className="mt-12 flex items-center gap-8 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gold-500" />
              <span>Jayanagar, Bangalore</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-gold-500" />
              <span>{yearsOfExcellence}+ Years of Excellence</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

// Statistics Section
interface StatsSectionProps {
  statistics: Statistics | null
}

export function StatsSection({ statistics }: StatsSectionProps) {
  if (!statistics) return null

  const stats = [
    { label: 'Years of Excellence', value: statistics.years_of_excellence, icon: Award },
    { label: 'Students', value: statistics.students_count.toLocaleString(), icon: Users },
    { label: 'Faculty Members', value: statistics.faculty_count, icon: Building2 },
    { label: 'Departments', value: statistics.departments_count, icon: Building2 },
    { label: 'Placement Rate', value: `${statistics.placement_percentage}%`, icon: TrendingUp },
  ]

  return (
    <section className="bg-academic-900 py-12 -mt-1 relative z-10">
      <div className="container-wide">
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="grid grid-cols-2 md:grid-cols-5 gap-6"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              variants={fadeIn}
              className="text-center p-6"
            >
              <stat.icon className="h-8 w-8 mx-auto mb-3 text-gold-500" />
              <div className="font-display text-3xl md:text-4xl font-bold text-white mb-2">
                {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
              </div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

// Principal Message Section
interface PrincipalMessageProps {
  name?: string
  message?: string
  image_url?: string
}

export function PrincipalMessage({ name, message, image_url }: PrincipalMessageProps) {
  return (
    <section className="section-padding bg-white">
      <div className="container-wide">
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="grid lg:grid-cols-2 gap-12 items-center"
        >
          <motion.div variants={fadeIn} className="relative">
            <div className="relative z-10">
              <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-academic-100">
                {image_url ? (
                  <img src={image_url} alt={name || 'Principal'} className="w-full h-full object-cover" />
                ) : (
                  <img
                    src="https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg"
                    alt={name || 'Principal'}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            </div>
            <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-gold-500 rounded-2xl -z-0" />
          </motion.div>

          <motion.div variants={fadeIn}>
            <span className="text-gold-600 font-semibold text-sm uppercase tracking-wide">
              Message from the Principal
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-academic-900 mt-2 mb-6">
              {name || 'Dr. K. Srinivas'}
            </h2>
            <div className="prose prose-lg text-gray-600 leading-relaxed">
              <p className="text-base md:text-lg">
                {message || 'Welcome to National College Jayanagar. For over five decades, we have been committed to nurturing minds and shaping futures. Our institution stands as a beacon of academic excellence, combining traditional values with modern education methodology.'}
              </p>
              <p className="text-base md:text-lg mt-4">
                We believe in holistic development of our students - academically, socially, and personally. Our dedicated faculty, state-of-the-art infrastructure, and industry partnerships ensure that every student receives the best possible education.
              </p>
            </div>
            <Button asChild className="mt-8 btn-primary">
              <Link href="/about#principal">
                Read Full Message <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

// Featured Programs Section
interface ProgramsSectionProps {
  courses: Course[]
}

export function ProgramsSection({ courses }: ProgramsSectionProps) {
  const displayCourses = courses.slice(0, 6)

  return (
    <section className="section-padding bg-gray-50">
      <div className="container-wide">
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <motion.div variants={fadeIn} className="text-center mb-12">
            <span className="text-gold-600 font-semibold text-sm uppercase tracking-wide">
              Our Programs
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-academic-900 mt-2 mb-4">
              Courses We Offer
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Choose from a wide range of undergraduate and postgraduate programs across various disciplines.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {displayCourses.map((course) => (
              <motion.div key={course.id} variants={fadeIn}>
                <Card className="card-hover h-full overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-semibold px-3 py-1 rounded-full bg-academic-100 text-academic-900 uppercase">
                        {course.level}
                      </span>
                      <span className="text-sm text-gray-500">{course.duration}</span>
                    </div>
                    <h3 className="font-display text-xl font-semibold text-academic-900 mb-2">
                      {course.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {course.overview || 'A comprehensive program designed to prepare students for successful careers.'}
                    </p>
                    <Link
                      href={`/courses/${course.code.toLowerCase()}`}
                      className="inline-flex items-center text-gold-600 hover:text-gold-700 font-medium text-sm"
                    >
                      Learn More <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          <motion.div variants={fadeIn} className="text-center mt-10">
            <Button asChild variant="outline" className="btn-outline">
              <Link href="/courses">
                View All Programs <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

// News Section
interface NewsSectionProps {
  news: News[]
}

export function NewsSection({ news }: NewsSectionProps) {
  const displayNews = news.slice(0, 3)

  return (
    <section className="section-padding bg-white">
      <div className="container-wide">
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <motion.div variants={fadeIn} className="flex items-center justify-between mb-12">
            <div>
              <span className="text-gold-600 font-semibold text-sm uppercase tracking-wide">
                Latest Updates
              </span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-academic-900 mt-2">
                News & Announcements
              </h2>
            </div>
            <Button asChild variant="outline" className="hidden md:inline-flex btn-outline">
              <Link href="/news">
                All News <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-6"
          >
            {displayNews.map((item, index) => (
              <motion.div key={item.id} variants={fadeIn}>
                <Card className="card-hover h-full overflow-hidden">
                  <div className="aspect-video bg-gray-100">
                    {item.image_url ? (
                      <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-academic-100">
                        <span className="text-academic-300 text-6xl font-display font-bold">NC</span>
                      </div>
                    )}
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-3 text-xs text-gray-500">
                      <span className="px-2 py-1 bg-academic-50 text-academic-900 rounded capitalize">
                        {item.category}
                      </span>
                      <span>
                        {item.published_at
                          ? new Date(item.published_at).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })
                          : 'Recent'}
                      </span>
                    </div>
                    <h3 className="font-display text-lg font-semibold text-academic-900 mb-2 line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2 mb-4">{item.excerpt}</p>
                    <Link
                      href={`/news/${item.slug}`}
                      className="inline-flex items-center text-gold-600 hover:text-gold-700 font-medium text-sm"
                    >
                      Read More <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          <motion.div variants={fadeIn} className="md:hidden text-center mt-8">
            <Button asChild variant="outline" className="btn-outline">
              <Link href="/news">
                All News <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

// Events Section
interface EventsSectionProps {
  events: Event[]
}

export function EventsSection({ events }: EventsSectionProps) {
  const displayEvents = events.slice(0, 3)

  return (
    <section className="section-padding bg-academic-900 text-white">
      <div className="container-wide">
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <motion.div variants={fadeIn} className="flex items-center justify-between mb-12">
            <div>
              <span className="text-gold-500 font-semibold text-sm uppercase tracking-wide">
                Mark Your Calendar
              </span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-white mt-2">
                Upcoming Events
              </h2>
            </div>
            <Button asChild variant="outline" className="hidden md:inline-flex bg-transparent border-white text-white hover:bg-white hover:text-academic-900">
              <Link href="/events">
                All Events <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-6"
          >
            {displayEvents.map((event) => (
              <motion.div key={event.id} variants={fadeIn}>
                <Card className="bg-white/10 border-white/20 backdrop-blur-sm overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-16 text-center">
                        <div className="text-gold-500 text-sm font-medium">
                          {new Date(event.event_date).toLocaleDateString('en-IN', { month: 'short' })}
                        </div>
                        <div className="text-white text-2xl font-display font-bold">
                          {new Date(event.event_date).getDate()}
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-display text-lg font-semibold text-white mb-2">
                          {event.title}
                        </h3>
                        <div className="space-y-2 text-sm text-gray-400">
                          {event.event_time && (
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-gold-500" />
                              {event.event_time}
                            </div>
                          )}
                          {event.venue && (
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-gold-500" />
                              {event.venue}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          <motion.div variants={fadeIn} className="md:hidden text-center mt-8">
            <Button asChild variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-academic-900">
              <Link href="/events">
                All Events <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

// Gallery Preview
interface GalleryPreviewProps {
  items: GalleryItem[]
}

export function GalleryPreview({ items }: GalleryPreviewProps) {
  const displayItems = items.slice(0, 6)

  return (
    <section className="section-padding bg-gray-50">
      <div className="container-wide">
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <motion.div variants={fadeIn} className="text-center mb-12">
            <span className="text-gold-600 font-semibold text-sm uppercase tracking-wide">
              Campus Life
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-academic-900 mt-2 mb-4">
              Gallery
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore our state-of-the-art facilities and vibrant campus life.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            className="grid grid-cols-2 md:grid-cols-3 gap-4"
          >
            {displayItems.map((item, index) => (
              <motion.div
                key={item.id}
                variants={fadeIn}
                className={`relative overflow-hidden rounded-lg ${index === 0 ? 'col-span-2 row-span-2' : ''}`}
              >
                <div className={`bg-gray-100 ${index === 0 ? 'aspect-square' : 'aspect-video'}`}>
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform hover:scale-105"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-academic-900/60 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="font-display text-white font-semibold text-sm md:text-base">
                    {item.title}
                  </h3>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div variants={fadeIn} className="text-center mt-10">
            <Button asChild variant="outline" className="btn-outline">
              <Link href="/gallery">
                View Full Gallery <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

// Recruiters Section
interface RecruitersSectionProps {
  recruiters: Recruiter[]
}

export function RecruitersSection({ recruiters }: RecruitersSectionProps) {
  const featuredRecruiters = recruiters.filter(r => r.is_featured)
  const displayRecruiters = featuredRecruiters.length > 0 ? featuredRecruiters : recruiters.slice(0, 8)

  return (
    <section className="section-padding bg-white">
      <div className="container-wide">
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <motion.div variants={fadeIn} className="text-center mb-12">
            <span className="text-gold-600 font-semibold text-sm uppercase tracking-wide">
              Our Recruiters
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-academic-900 mt-2 mb-4">
              Top Companies Hire Our Graduates
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our strong industry partnerships ensure excellent placement opportunities for our students.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6"
          >
            {displayRecruiters.map((recruiter) => (
              <motion.div
                key={recruiter.id}
                variants={fadeIn}
                className="flex items-center justify-center p-6 bg-gray-50 rounded-lg hover:bg-academic-50 transition-colors"
              >
                <div className="text-center">
                  <div className="text-academic-900 font-display font-bold text-lg">
                    {recruiter.name}
                  </div>
                  {recruiter.industry && (
                    <div className="text-xs text-gray-500">{recruiter.industry}</div>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

// Testimonials Section
interface TestimonialsSectionProps {
  testimonials: Testimonial[]
}

export function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  const displayTestimonials = testimonials.filter(t => t.is_featured)
  const testimonialsToShow = displayTestimonials.length > 0 ? displayTestimonials : testimonials.slice(0, 3)

  return (
    <section className="section-padding bg-academic-900 text-white">
      <div className="container-wide">
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <motion.div variants={fadeIn} className="text-center mb-12">
            <span className="text-gold-500 font-semibold text-sm uppercase tracking-wide">
              Success Stories
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white mt-2 mb-4">
              What Our Alumni Say
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Our alumni are making waves across industries. Here are their stories.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-6"
          >
            {testimonialsToShow.map((testimonial) => (
              <motion.div key={testimonial.id} variants={fadeIn}>
                <Card className="bg-white/10 border-white/20 backdrop-blur-sm h-full">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-gold-500 rounded-full flex items-center justify-center">
                        <span className="text-academic-900 font-display font-bold">
                          {testimonial.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <div className="font-semibold text-white">{testimonial.name}</div>
                        <div className="text-sm text-gray-400">
                          {testimonial.designation}, {testimonial.company}
                        </div>
                        {testimonial.batch_year && (
                          <div className="text-xs text-gold-500">Batch of {testimonial.batch_year}</div>
                        )}
                      </div>
                    </div>
                    <blockquote className="text-gray-300 text-sm italic line-clamp-4">
                      "{testimonial.content}"
                    </blockquote>
                    {testimonial.rating && (
                      <div className="flex items-center gap-1 mt-4">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <svg
                            key={i}
                            className={`h-4 w-4 ${i < testimonial.rating! ? 'text-gold-500' : 'text-gray-600'}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

// Achievements Section
interface AchievementsSectionProps {
  achievements: Achievement[]
}

export function AchievementsSection({ achievements }: AchievementsSectionProps) {
  if (achievements.length === 0) return null

  return (
    <section className="section-padding bg-gray-50">
      <div className="container-wide">
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <motion.div variants={fadeIn} className="text-center mb-12">
            <span className="text-gold-600 font-semibold text-sm uppercase tracking-wide">
              Our Pride
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-academic-900 mt-2 mb-4">
              Achievements & Accolades
            </h2>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {achievements.slice(0, 4).map((achievement) => (
              <motion.div key={achievement.id} variants={fadeIn}>
                <Card className="card-hover h-full">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-gold-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Award className="h-8 w-8 text-gold-600" />
                    </div>
                    <h3 className="font-display text-lg font-semibold text-academic-900 mb-2">
                      {achievement.title}
                    </h3>
                    <p className="text-gray-600 text-sm">{achievement.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

// CTA Section
export function CTASection() {
  return (
    <section className="relative py-20 bg-gradient-to-br from-academic-900 to-academic-800 overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold-500 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gold-500 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />
      </div>
      <div className="relative container-wide text-center">
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <motion.h2
            variants={fadeIn}
            className="font-display text-3xl md:text-5xl font-bold text-white mb-6"
          >
            Begin Your Journey With Us
          </motion.h2>
          <motion.p
            variants={fadeIn}
            className="text-gray-300 text-lg max-w-2xl mx-auto mb-10"
          >
            Join thousands of successful alumni who started their careers at National College Jayanagar.
          </motion.p>
          <motion.div variants={fadeIn} className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" className="btn-secondary text-base">
              <Link href="/admissions">
                Apply for Admission <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-academic-900">
              <Link href="/contact">
                Contact Us
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
