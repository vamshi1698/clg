import { Metadata } from 'next'
import { getEvents } from '@/lib/data/public'
import { EventsPage } from '@/components/events/events-page'

export const metadata: Metadata = {
  title: 'Events',
  description: 'Upcoming and past events at National College Jayanagar - seminars, workshops, cultural programs, and more.',
}

export default async function Events() {
  const events = await getEvents()
  return <EventsPage events={events} />
}
