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
import {
  HeroSection,
  StatsSection,
  PrincipalMessage,
  ProgramsSection,
  NewsAndEventsSection,
  GalleryPreview,
  RecruitersSection,
  TestimonialsSection,
  AchievementsSection,
  CTASection,
} from '@/components/home/sections'
import { AutoCarouselSection } from '@/components/home/auto-carousel-section'
import { BookOpen, BriefcaseBusiness, Users, ArrowRight, ChevronRight, Film, MonitorSmartphone } from 'lucide-react'
import Link from 'next/link'

const marqueeItems = [
  'Latest information: admissions, events, and notices are updated regularly.',
  'Academic calendar and results are available through the campus portal.',
  'Faculty profiles and department highlights are now featured on the homepage.',
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
  const [settings, statistics, courses, news, events, gallery, recruiters, testimonials, achievements, departmentPreview] = await Promise.all([
    getSiteSettings(),
    getStatistics(),
    getCourses(),
    getNews({ limit: 10 }),
    getEvents({ upcoming: true, limit: 5 }),
    getGallery({ limit: 10 }),
    getRecruiters(),
    getTestimonials(),
    getAchievements(), getDepartments()
  ])

  return (
    <>
      <HeroSection
        image_url={settings?.hero_image_url || undefined}
        tagline={settings?.tagline || undefined}
        established_year={settings?.established_year}
      />

      {/* Stanford style: News and Events directly after the hero */}
      <NewsAndEventsSection news={news} events={events} statistics={statistics} />

      <StatsSection statistics={statistics} />

      {/* Departments & Academics */}
      <section className="section-padding bg-slate-50">
        <div className="container-wide">
          <div className="mb-10 flex items-end justify-between gap-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-academic-600">Academics</p>
              <h2 className="font-display mt-2 text-3xl font-bold text-academic-950 md:text-4xl">Schools & Departments</h2>
            </div>
            <Link href="/departments" className="hidden items-center gap-2 text-gold-600 text-sm font-medium md:inline-flex">
              View all <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            {departmentPreview.map((item) => (
              <div key={item.name} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
                <BookOpen className="h-8 w-8 text-academic-700" />
                <h3 className="mt-4 font-display text-2xl font-semibold text-academic-950">{item.name}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{item.description}</p>
                <Link href={`/departments/${item.code}`} className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-academic-700 hover:text-gold-600 transition-colors">
                  Explore <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ProgramsSection courses={courses} />

      {/* Career & Faculty */}
      <section className="section-padding bg-white">
        <div className="container-wide grid gap-6 lg:grid-cols-2">
          <div className="rounded-[2rem] border border-slate-200 bg-academic-950 p-8 text-white shadow-xl">
            <div className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-white/80">
              Career Pathways
            </div>
            <h2 className="font-display mt-4 text-3xl font-bold">Bridging education and industry</h2>
            <div className="mt-6 space-y-4">
              {careerPreview.map((item) => (
                <div key={item.title} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                  <BriefcaseBusiness className="mt-1 h-5 w-5 text-gold-500" />
                  <div>
                    <h3 className="font-semibold text-white">{item.title}</h3>
                    <p className="mt-1 text-sm leading-7 text-white/75">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-8 shadow-sm">
            <div className="inline-flex rounded-full bg-academic-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-academic-700">
              Faculty
            </div>
            <h2 className="font-display mt-4 text-3xl font-bold text-academic-950">Expert guidance at every step</h2>
            <div className="mt-6 space-y-4">
              {facultyPreview.map((item) => (
                <div key={item.title} className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4">
                  <Users className="mt-1 h-5 w-5 text-academic-700" />
                  <div>
                    <h3 className="font-semibold text-academic-950">{item.title}</h3>
                    <p className="mt-1 text-sm leading-7 text-slate-600">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <AchievementsSection achievements={achievements} />

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

