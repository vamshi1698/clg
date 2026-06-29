import {
  getSiteSettings,
  getStatistics,
  getCourses,
  getNews,
  getEvents,
  getGallery,
  getRecruiters,
  getTestimonials,
  getAchievements,
} from '@/lib/data/public'
import { getActiveResultsPdfs } from '@/lib/actions/public-actions'
import {
  HeroSection,
  StatsSection,
  PrincipalMessage,
  ProgramsSection,
  GalleryPreview,
  RecruitersSection,
  TestimonialsSection,
  AchievementsSection,
  CTASection,
} from '@/components/home/sections'
import { NoticeBoard } from '@/components/home/notice-board'
import { AutoCarouselSection } from '@/components/home/auto-carousel-section'
import { BookOpen, BriefcaseBusiness, Users, ArrowRight, ChevronRight, Film, MonitorSmartphone } from 'lucide-react'
import Link from 'next/link'
import { ImmersiveIdCard } from '@/components/home/ImmersiveIdCard';
import { SchoolsAndDepartments, CareerAndFaculty } from '@/components/home/interactive-showcase';
import { WhyChooseUs } from '@/components/home/why-choose-us';

const highlightSlides = [
  {
    title: 'Campus momentum',
    description: 'A rotating visual preview for announcements, campus life, and student achievements.',
  },
  {
    title: 'Academic excellence',
    description: 'A clean carousel-style section that keeps the homepage lively and focused.',
  },
  {
    title: 'Student pathways',
    description: 'Clear calls to action that guide visitors to departments, careers, and faculty.',
  },
]

const departmentPreview = [
  { title: 'Computer Applications', text: 'Software, systems, and applied computing pathways.', href: '/departments' },
  { title: 'Commerce & Management', text: 'Business, finance, and professional growth tracks.', href: '/departments' },
  { title: 'Arts & Humanities', text: 'Culture, critical thinking, and communication-led study.', href: '/departments' },
]

const careerPreview = [
  { title: 'Placement guidance', text: 'Career support, resume preparation, and interview readiness.' },
  { title: 'Industry exposure', text: 'Workshops, guest lectures, and recruiter interaction.' },
  { title: 'Alumni pathways', text: 'Stories and outcomes that show where the college journey leads.' },
]

const facultyPreview = [
  { title: 'Dedicated mentors', text: 'Faculty with strong academic and student support focus.' },
  { title: 'Research guidance', text: 'Encouraging applied research and project-based learning.' },
  { title: 'Department leadership', text: 'Visible academic leadership in every program area.' },
]

export default async function HomePage() {
  const [settings, statistics, courses, news, events, gallery, recruiters, testimonials, achievements, resultPdfsRes] = await Promise.all([
    getSiteSettings(),
    getStatistics(),
    getCourses(),
    getNews({ limit: 10 }),
    getEvents({ upcoming: true, limit: 5 }),
    getGallery({ limit: 10 }),
    getRecruiters(),
    getTestimonials(),
    getAchievements(),
    getActiveResultsPdfs(),
  ])

  const resultPdfs = (resultPdfsRes?.data as any[]) || []

  return (
    <>
      <div className="w-full bg-academic-950 text-white py-2.5 md:py-3.5 overflow-hidden border-b border-slate-800">
        <div className="container-wide flex items-center overflow-hidden py-0.5 text-xs md:text-sm font-semibold tracking-wider">
          <div className="min-w-0 flex-1 overflow-hidden">
            <div className="marquee-track flex w-[400%] md:w-[200%] items-center gap-10 whitespace-nowrap text-white/90">
              {[
                ...news.map(n => ({ title: n.title, href: `/news/${n.slug}` })),
                ...events.map(e => ({ title: e.title, href: '/events' })),
                ...resultPdfs.map(r => ({ title: r.title, href: `/api/results/pdf/${r.id}` }))
              ].slice(0, 10).map((item, idx) => (
                <span key={idx} className="flex items-center gap-10">
                  {item.href ? (
                    <Link href={item.href} className="hover:text-gold-400 transition-colors">
                      {item.title}
                    </Link>
                  ) : (
                    <span>{item.title}</span>
                  )}
                  <span className="text-gold-500">✦</span>
                </span>
              ))}
              {/* Duplicate track for seamless infinite scroll */}
              {[
                ...news.map(n => ({ title: n.title, href: `/news/${n.slug}` })),
                ...events.map(e => ({ title: e.title, href: '/events' })),
                ...resultPdfs.map(r => ({ title: r.title, href: `/api/results/pdf/${r.id}` }))
              ].slice(0, 10).map((item, idx) => (
                <span key={`dup-${idx}`} className="flex items-center gap-10" aria-hidden="true">
                  {item.href ? (
                    <Link href={item.href} className="hover:text-gold-400 transition-colors">
                      {item.title}
                    </Link>
                  ) : (
                    <span>{item.title}</span>
                  )}
                  <span className="text-gold-500">✦</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <HeroSection
        image_url={settings?.hero_image_url || undefined}
        tagline={settings?.tagline || undefined}
        established_year={settings?.established_year}
      />

      {/* Dynamic Image Carousel controlled via CMS (Gallery) */}
      <AutoCarouselSection />

      {/* Unified Notice Board System for News, Events, and Result Bulletins */}
      <NoticeBoard news={news} events={events} resultPdfs={resultPdfs} />

      <StatsSection statistics={statistics} />

      {/* Departments & Academics (Immersive) */}
      <SchoolsAndDepartments items={departmentPreview} />

      <ProgramsSection courses={courses} />

      {/* Career & Faculty (Immersive) */}
      <CareerAndFaculty careerItems={careerPreview} facultyItems={facultyPreview} />

      <AchievementsSection achievements={achievements} />
      
      <WhyChooseUs />
      
      {gallery.length > 0 && <GalleryPreview items={gallery} />}
      
      <PrincipalMessage
        name={settings?.principal_name || undefined}
        message={settings?.principal_message || undefined}
        image_url={settings?.principal_image_url || undefined}
      />

      {recruiters.length > 0 && <RecruitersSection recruiters={recruiters} />}
      {testimonials.length > 0 && <TestimonialsSection testimonials={testimonials} />}
      
      <ImmersiveIdCard />

      <CTASection />
    </>
  )
}

