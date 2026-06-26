'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Users, Award, Building2, TrendingUp, Calendar, MapPin, Clock, Download } from 'lucide-react'
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
    <section className="relative w-full min-h-[85vh] flex items-center justify-center overflow-hidden">
      {/* Background Image / Pattern */}
      <div className="absolute inset-0 bg-academic-950">
        <div 
          className="absolute inset-0 opacity-50 bg-cover bg-center"
          style={{ backgroundImage: `url(${image_url || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80'})` }} 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-academic-950 via-academic-900/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-academic-950/80 via-academic-900/40 to-transparent" />
      </div>

      <div className="relative container-wide w-full pt-32 pb-16">
        <motion.div
          initial="initial"
          animate="animate"
          variants={staggerContainer}
          className="max-w-4xl"
        >
          <motion.div variants={fadeIn} className="mb-6 flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 border-l-4 border-gold-500 pl-4 py-1 text-sm font-bold uppercase tracking-[0.2em] text-gold-300">
              Est. {established_year}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm px-4 py-1 text-sm text-white shadow-sm">
              <Award className="h-4 w-4 text-gold-400" /> Autonomous Institution
            </span>
          </motion.div>

          <motion.h1
            variants={fadeIn}
            className="font-display mb-6 text-5xl font-bold leading-[1.1] tracking-tight text-white text-balance md:text-7xl lg:text-8xl"
          >
            A campus built for <span className="text-gold-400">ambition.</span>
          </motion.h1>

          <motion.p
            variants={fadeIn}
            className="mb-10 max-w-2xl text-lg leading-relaxed text-slate-300 md:text-2xl font-light"
          >
            {tagline || 'A premier autonomous institution committed to holistic development, academic rigor, and preparing students for the challenges of tomorrow.'}
          </motion.p>

          <motion.div variants={fadeIn} className="flex flex-wrap gap-4">
            <Button asChild size="lg" className="bg-gold-500 text-lg h-14 px-8 text-academic-950 shadow-lg hover:bg-gold-400 transition-all">
              <Link href="/admissions">
                Apply Now <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white/30 bg-white/10 backdrop-blur-md text-lg h-14 px-8 text-white hover:bg-white hover:text-academic-900 transition-all">
              <Link href="/courses">
                Explore Courses
              </Link>
            </Button>
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
    <section className="relative z-10 -mt-1 border-y border-slate-200 bg-white py-12">
      <div className="container-wide">
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="grid grid-cols-2 gap-4 md:grid-cols-5 md:gap-6"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              variants={fadeIn}
              className="rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm"
            >
              <stat.icon className="mx-auto mb-3 h-8 w-8 text-academic-600" />
              <div className="font-display mb-2 text-3xl font-bold text-academic-950 md:text-4xl">
                {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
              </div>
              <div className="text-sm text-slate-600">{stat.label}</div>
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
    <section className="relative overflow-hidden bg-gradient-to-br from-academic-950 via-academic-900 to-academic-800 py-20">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 right-0 h-96 w-96 -translate-y-1/2 translate-x-1/2 rounded-full bg-gold-500 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-96 w-96 -translate-x-1/2 translate-y-1/2 rounded-full bg-gold-500 blur-3xl" />
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
            className="font-display mb-6 text-3xl font-bold text-white md:text-5xl"
          >
            Begin Your Journey With Us
          </motion.h2>
          <motion.p
            variants={fadeIn}
            className="mx-auto mb-10 max-w-2xl text-lg text-slate-200/80"
          >
            Join thousands of successful alumni who started their careers at National College Jayanagar.
          </motion.p>
          <motion.div variants={fadeIn} className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" className="btn-secondary text-base shadow-lg shadow-gold-500/20">
              <Link href="/admissions">
                Apply for Admission <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white/30 bg-white/5 text-white backdrop-blur-md hover:bg-white hover:text-academic-900">
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

// Unified News and Events Section
interface NewsAndEventsSectionProps {
  news: News[]
  events: Event[]
  statistics: Statistics | null
}

export function NewsAndEventsSection({ news, events, statistics }: NewsAndEventsSectionProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'results' | 'circulars' | 'general'>('all')

  const displayEvents = events.slice(0, 3)

  const defaultEventImages = [
    'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&auto=format&fit=crop&q=80', // Ongoing/Academic (Adjust tie suit)
    'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&auto=format&fit=crop&q=80', // Upcoming/Technical (Classroom laptop work)
    'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&auto=format&fit=crop&q=80', // Upcoming/Cultural (Concert lights)
  ]

  const getNoticeInfo = (item: News) => {
    const category = item.category
    if (category === 'examination') {
      return {
        badge: 'EXAM RESULT',
        badgeClass: 'bg-rose-50 text-rose-600 border border-rose-100',
        tab: 'results'
      }
    }
    if (category === 'academic' || category === 'admission') {
      return {
        badge: 'OFFICIAL CIRCULAR',
        badgeClass: 'bg-blue-50 text-blue-600 border border-blue-100',
        tab: 'circulars'
      }
    }
    return {
      badge: 'GENERAL',
      badgeClass: 'bg-slate-50 text-slate-600 border border-slate-100',
      tab: 'general'
    }
  }

  const filteredNotices = news.filter(item => {
    if (activeTab === 'all') return true
    const { tab } = getNoticeInfo(item)
    return tab === activeTab
  }).slice(0, 3)

  return (
    <section className="py-16 md:py-20 bg-slate-50/50 border-y border-slate-100">
      <div className="container-wide">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          
          {/* Left Column: Events Timeline */}
          <div className="lg:col-span-7">
            <span className="text-[10px] sm:text-xs font-bold text-blue-600 tracking-wider uppercase">
              CAMPUS HIGHLIGHTS
            </span>
            <h2 className="font-display text-2xl sm:text-3.5xl font-extrabold text-academic-900 mt-1">
              Upcoming & Ongoing Events
            </h2>
            <div className="w-10 h-[3px] bg-blue-600 mt-2.5 rounded-full" />

            <div className="relative pl-8 sm:pl-10 mt-8 space-y-6">
              {/* Vertical line timeline */}
              <div className="absolute left-[7px] sm:left-[9px] top-2 bottom-2 w-[1px] bg-slate-200" />
              
              {displayEvents.map((event, index) => {
                const isOngoing = index === 0
                const imageSrc = event.image_url || defaultEventImages[index % defaultEventImages.length]
                
                return (
                  <div key={event.id} className="relative">
                    {/* Timeline Dot */}
                    <div className="absolute -left-[29px] sm:-left-[31px] top-7 z-10 flex items-center justify-center">
                      <div className={`w-3.5 h-3.5 rounded-full border-2 bg-white shadow-sm flex items-center justify-center ${
                        isOngoing ? 'border-orange-500' : 'border-blue-500'
                      }`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${
                          isOngoing ? 'bg-orange-500' : 'bg-blue-500'
                        }`} />
                      </div>
                    </div>

                    {/* Event Card */}
                    <div className="flex flex-col sm:flex-row bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                      {/* Image block */}
                      <div className="relative w-full sm:w-44 h-40 sm:h-auto flex-shrink-0 bg-slate-100">
                        <img
                          src={imageSrc}
                          alt={event.title}
                          className="w-full h-full object-cover"
                        />
                        <span className={`absolute top-3 left-3 px-2 py-0.5 text-[9px] font-bold text-white rounded-md tracking-wider uppercase shadow-sm ${
                          isOngoing ? 'bg-orange-500' : 'bg-blue-500'
                        }`}>
                          {isOngoing ? 'ONGOING' : 'UPCOMING'}
                        </span>
                      </div>

                      {/* Content block */}
                      <div className="p-5 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-1.5 text-slate-500 text-[11px] mb-2 font-medium">
                            <Clock className="w-3.5 h-3.5 text-blue-500" />
                            <span>
                              {new Date(event.event_date).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </span>
                            <span className="text-slate-300">•</span>
                            <span className="font-bold text-blue-600 uppercase text-[10px] tracking-wider">
                              {(event.category || 'academic').toUpperCase()}
                            </span>
                          </div>
                          <h3 className="font-bold text-base sm:text-lg text-slate-900 leading-snug mb-2 hover:text-blue-600 transition-colors">
                            <Link href={`/events/${event.slug}`}>{event.title}</Link>
                          </h3>
                          <p className="text-slate-500 text-xs sm:text-sm line-clamp-2 leading-relaxed">
                            {event.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
              {displayEvents.length === 0 && (
                <p className="text-slate-500 text-sm">No upcoming events scheduled.</p>
              )}
            </div>
          </div>

          {/* Right Column: Notice Board & Stats */}
          <div className="lg:col-span-5 flex flex-col justify-between h-full">
            <div>
              <span className="text-[10px] sm:text-xs font-bold text-blue-600 tracking-wider uppercase">
                NOTICE BOARD
              </span>
              <h2 className="font-display text-2xl sm:text-3.5xl font-extrabold text-academic-900 mt-1">
                Announcements & Results
              </h2>
              <div className="w-10 h-[3px] bg-blue-600 mt-2.5 rounded-full" />

              {/* Filter Tabs */}
              <div className="flex flex-wrap gap-2 mt-8">
                {(['all', 'results', 'circulars', 'general'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all border ${
                      activeTab === tab
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                        : 'bg-white text-slate-600 border-slate-100 hover:bg-slate-50'
                    }`}
                  >
                    {tab === 'all' && 'All Notices'}
                    {tab === 'results' && 'Results'}
                    {tab === 'circulars' && 'Circulars'}
                    {tab === 'general' && 'General'}
                  </button>
                ))}
              </div>

              {/* Notices List */}
              <div className="mt-6 space-y-4">
                {filteredNotices.map((item) => {
                  const { badge, badgeClass } = getNoticeInfo(item)
                  return (
                    <div key={item.id} className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-all">
                      <div className="flex-1 pr-4">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className={`px-2 py-0.5 text-[9px] font-bold rounded-md tracking-wider uppercase ${badgeClass}`}>
                            {badge}
                          </span>
                          <span className="text-[10px] text-slate-400 font-semibold">
                            {item.published_at ? new Date(item.published_at).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            }) : 'Recent'}
                          </span>
                        </div>
                        <h4 className="font-bold text-slate-800 text-xs sm:text-sm leading-snug hover:text-blue-600 transition-colors line-clamp-2">
                          <Link href={`/news/${item.slug}`}>{item.title}</Link>
                        </h4>
                      </div>
                      <div className="flex-shrink-0">
                        <Link 
                          href={`/news/${item.slug}`}
                          className="flex items-center justify-center p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 border border-slate-100 rounded-xl transition-all shadow-sm"
                          title="Download document"
                        >
                          <Download className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  )
                })}
                {filteredNotices.length === 0 && (
                  <div className="text-center py-8 text-slate-400 text-xs border border-dashed border-slate-200 rounded-2xl bg-white/50">
                    No notices found in this category.
                  </div>
                )}
              </div>
            </div>

            {/* Live Statistics Card */}
            <div className="mt-8 p-6 bg-gradient-to-r from-[#03152c] to-[#0A2540] rounded-3xl shadow-lg text-white relative overflow-hidden">
              <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-4 translate-y-4">
                <svg width="180" height="180" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="50" cy="50" r="40" stroke="white" strokeWidth="2" strokeDasharray="4 4" />
                  <path d="M50 10 L50 90 M10 50 L90 50" stroke="white" strokeWidth="1" />
                  <polygon points="50,30 55,45 70,50 55,55 50,70 45,55 30,50 45,45" fill="white" />
                </svg>
              </div>

              <div className="relative z-10">
                <span className="text-[10px] sm:text-xs font-bold text-blue-400 tracking-wider uppercase mb-3 block">
                  LIVE STATISTICS
                </span>
                <div className="flex items-center gap-12 mt-2">
                  <div>
                    <div className="text-3xl sm:text-4xl font-extrabold font-sans text-white mb-0.5 tracking-tight">
                      A++
                    </div>
                    <div className="text-[9px] sm:text-[10px] font-bold text-slate-400 tracking-wider uppercase">
                      NAAC RATING
                    </div>
                  </div>
                  <div>
                    <div className="text-3xl sm:text-4xl font-extrabold font-sans text-white mb-0.5 tracking-tight">
                      15+
                    </div>
                    <div className="text-[9px] sm:text-[10px] font-bold text-slate-400 tracking-wider uppercase">
                      STUDENT CLUBS
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

