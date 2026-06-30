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
  getDepartments,
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
  NewsAndEventsSection,
} from '@/components/home/sections'
import { AutoCarouselSection } from '@/components/home/auto-carousel-section'
import { BookOpen, BriefcaseBusiness, Users, ArrowRight, ChevronRight, Film, MonitorSmartphone } from 'lucide-react'
import Link from 'next/link'
import { ImmersiveIdCard } from '@/components/home/ImmersiveIdCard';
import { SchoolsAndDepartments } from '@/components/home/interactive-showcase';
import { WhyChooseUs } from '@/components/home/why-choose-us';


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
  const [settings, statistics, courses, news, events, gallery, recruiters, testimonials, achievements, resultPdfsRes, departmentPreview] = await Promise.all([
    getSiteSettings(),
    getStatistics(),
    getCourses(),
    getNews({ limit: 10 }),
    getEvents({ upcoming: true, limit: 5 }),
    getGallery({ limit: 10 }),
    getRecruiters(),
    getTestimonials(),
    getAchievements(),
    getActiveResultsPdfs(), getDepartments()
  ])
  const departmentItems = departmentPreview.slice(0, 3).map((dept) => ({
    title: dept.name,
    text: dept.description ?? "",
    href: `/departments/${dept.code.toLowerCase()}`,
  }))

  const resultPdfs = (resultPdfsRes?.data as any[]) || []

  return (
    <>
      <div className="w-full bg-academic-950 text-white py-2.5 md:py-3.5 overflow-hidden border-b border-slate-800">
        <div className="container-wide flex items-center overflow-hidden py-0.5 text-xs md:text-sm font-semibold tracking-wider">
          <div className="min-w-0 flex-1 overflow-hidden">
            <div className="marquee-track flex w-[400%] md:w-[200%] items-center gap-10 whitespace-nowrap text-white/90">
              {[
                ...news.map(n => ({ title: n.title, href: n.category === 'examination' ? '/results' : `/news/${n.slug}` })),
                ...events.map(e => ({ title: e.title, href: '/events' })),
                ...resultPdfs.map(r => ({ title: r.title, href: `/results` }))
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
                ...news.map(n => ({ title: n.title, href: n.category === 'examination' ? '/results' : `/news/${n.slug}` })),
                ...events.map(e => ({ title: e.title, href: '/events' })),
                ...resultPdfs.map(r => ({ title: r.title, href: `/results` }))
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
        image_url={settings?.hero_image_url || 'https://images.unsplash.com/photo-1541829070740-15665fc885ce?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80'}
        tagline={settings?.tagline || undefined}
        established_year={settings?.established_year}
      />

      <ProgramsSection courses={courses} />

      {/* Departments & Academics (Immersive) */}
      <SchoolsAndDepartments items={departmentItems} />

      {/* Unified Notice Board System for News, Events, and Result Bulletins */}
      <NewsAndEventsSection news={news} events={events} statistics={statistics} />

      {/* Dynamic Image Carousel controlled via CMS (Gallery) */}
      <AutoCarouselSection />

      <StatsSection statistics={statistics} />

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

      <CTASection />
    </>
  )
}

