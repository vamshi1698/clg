import { Metadata } from 'next'
import { getNews } from '@/lib/data/public'
import { NewsPage } from '@/components/news/news-page'

export const metadata: Metadata = {
  title: 'News & Announcements',
  description: 'Stay updated with the latest news, announcements, and events at National College Jayanagar.',
}

export default async function News() {
  const news = await getNews()
  return <NewsPage news={news} />
}
