import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { data, error } = await supabase
    .from('news')
    .select('id, published, title, date, imageSrc, excerpt, content')
    .eq('published', true)
    .order('date', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const items = (data ?? []).map((row) => ({
    id: String(row.id),
    published: Boolean(row.published),
    title: String(row.title ?? ''),
    date: String(row.date ?? ''),
    imageSrc: String(row.imageSrc ?? ''),
    excerpt: String(row.excerpt ?? ''),
    content: Array.isArray(row.content) ? row.content.map(String) : [],
  }))

  return NextResponse.json(items)
}
