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
import {
  HeroSection,
  StatsSection,
  PrincipalMessage,
  ProgramsSection,
  NewsSection,
  EventsSection,
  GalleryPreview,
  RecruitersSection,
  TestimonialsSection,
  AchievementsSection,
  CTASection,
} from '@/components/home/sections'

export default async function HomePage() {
  const [settings, statistics, courses, news, events, gallery, recruiters, testimonials, achievements] = await Promise.all([
    getSiteSettings(),
    getStatistics(),
    getCourses(),
    getNews({ featured: true, limit: 5 }),
    getEvents({ upcoming: true, limit: 5 }),
    getGallery({ limit: 10 }),
    getRecruiters(),
    getTestimonials(),
    getAchievements(),
  ])

  return (
    <>
      <HeroSection
        image_url={settings?.hero_image_url || undefined}
        tagline={settings?.tagline || undefined}
        established_year={settings?.established_year}
      />
      <StatsSection statistics={statistics} />
      <PrincipalMessage
        name={settings?.principal_name || undefined}
        message={settings?.principal_message || undefined}
        image_url={settings?.principal_image_url || undefined}
      />
      <ProgramsSection courses={courses} />
      <AchievementsSection achievements={achievements} />
      <NewsSection news={news} />
      <EventsSection events={events} />
      {gallery.length > 0 && <GalleryPreview items={gallery} />}
      {recruiters.length > 0 && <RecruitersSection recruiters={recruiters} />}
      {testimonials.length > 0 && <TestimonialsSection testimonials={testimonials} />}
      <CTASection />
    </>
  )
}
