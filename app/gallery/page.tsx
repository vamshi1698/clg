import { Metadata } from 'next'
import { getGallery } from '@/lib/data/public'
import { GalleryPage } from '@/components/gallery/gallery-page'

export const metadata: Metadata = {
  title: 'Gallery',
  description: 'Explore photos and videos from National College Jayanagar - campus facilities, events, student activities, and more.',
}

export default async function Gallery() {
  const items = await getGallery()
  return <GalleryPage items={items} />
}
