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
  YouthUnitsSection,
} from '@/components/home/sections'
import { AutoCarouselSection } from '@/components/home/auto-carousel-section'
import Link from 'next/link'
import { SchoolsAndDepartments } from '@/components/home/interactive-showcase'
import { WhyChooseUs } from '@/components/home/why-choose-us'

export default async function HomePage() {
  const [
    settings,
    statistics,
    courses,
    news,
    events,
    gallery,
    recruiters,
    testimonials,
    achievements,
    resultPdfsRes,
    departmentPreview,
  ] = await Promise.all([
    getSiteSettings(),
    getStatistics(),
    getCourses(),
    getNews({ limit: 10 }),
    getEvents({ limit: 5 }), // Fetch recent events
    getGallery({ limit: 10 }),
    getRecruiters(),
    getTestimonials(),
    getAchievements(),
    getActiveResultsPdfs(),
    getDepartments(),
  ])

  const departmentItems = departmentPreview.slice(0, 3).map((dept) => ({
    title: dept.name,
    text: dept.description ?? '',
    href: `/departments/${dept.code.toLowerCase()}`,
  }))

  const resultPdfs = (resultPdfsRes?.data as any[]) || []

  const marqueeItems = [
    ...news.map((n) => ({
      title: n.title,
      href: n.category === 'examination' ? '/results' : `/news/${n.slug}`,
    })),
    ...events.map((e) => ({
      title: e.title,
      href: '/events',
    })),
    ...resultPdfs.map((r) => ({
      title: r.title,
      href: '/results',
    })),
  ].slice(0, 10)

  return (
    <>
      <div className="w-full bg-academic-950 text-white py-0.5 md:py-0.5 border-b border-slate-800 overflow-hidden mt-[96px] md:mt-[144px]">
        <div className="container-wide">
          <div className="overflow-hidden">
            <div className="marquee-track flex w-max items-center whitespace-nowrap">
              {[...marqueeItems, ...marqueeItems].map((item, idx) => (
                <span
                  key={idx}
                  className="flex shrink-0 items-center gap-10 pr-10 text-xs md:text-sm font-semibold tracking-wider text-white/90"
                  aria-hidden={idx >= marqueeItems.length}
                >
                  <Link
                    href={item.href}
                    className="hover:text-gold-400 transition-colors"
                  >
                    {item.title}
                  </Link>

                  <span className="text-gold-500">✦</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <HeroSection
        image_url={
          settings?.hero_image_url ||
          'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=2000&q=80'
        }
        tagline={settings?.tagline || undefined}
        established_year={settings?.established_year}
      />

      <ProgramsSection courses={courses} />

      <SchoolsAndDepartments items={departmentItems} />

      <NewsAndEventsSection
        news={news}
        events={events}
        statistics={statistics}
      />

      <AutoCarouselSection />

      <StatsSection statistics={statistics} />

      <AchievementsSection achievements={achievements} />

      <WhyChooseUs />

      <YouthUnitsSection />

      {gallery.length > 0 && <GalleryPreview items={gallery} />}

      <PrincipalMessage
        name={settings?.principal_name || undefined}
        message={settings?.principal_message || undefined}
        image_url={settings?.principal_image_url || undefined}
      />

      {recruiters.length > 0 && (
        <RecruitersSection recruiters={recruiters} />
      )}

      <TestimonialsSection testimonials={testimonials} />

      <CTASection />
    </>
  )
}