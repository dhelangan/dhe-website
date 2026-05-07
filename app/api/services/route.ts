import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const [
    servicesRes,
    projectsRes,
    qnaRes,
    reviewsRes,
  ] = await Promise.all([
    supabase
      .from('services')
      .select('*')
      .order('id', { ascending: true }),

    supabase
      .from('services-project')
      .select('*')
      .order('id', { ascending: true }),

    supabase
      .from('services-qna')
      .select('*')
      .order('id', { ascending: true }),

    supabase
      .from('services-reviews')
      .select('*')
      .order('id', { ascending: true }),
  ])

  // Check errors
  if (
    servicesRes.error ||
    projectsRes.error ||
    qnaRes.error ||
    reviewsRes.error
  ) {
    return NextResponse.json(
      {
        error:
          servicesRes.error?.message ||
          projectsRes.error?.message ||
          qnaRes.error?.message ||
          reviewsRes.error?.message,
      },
      { status: 500 }
    )
  }

  // Combine JSON
  const combinedData = {
    services: servicesRes.data,
    projects: projectsRes.data,
    qna: qnaRes.data,
    reviews: reviewsRes.data,
  }

  return NextResponse.json(combinedData)
}