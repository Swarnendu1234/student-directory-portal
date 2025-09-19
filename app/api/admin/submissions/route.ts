import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { supabase } from '@/lib/supabase'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

async function verifyAdmin(request: NextRequest) {
  const token = request.cookies.get('admin-token')?.value
  if (!token) throw new Error('Unauthorized')
  
  try {
    jwt.verify(token, JWT_SECRET)
    return true
  } catch {
    throw new Error('Invalid token')
  }
}

export async function GET(request: NextRequest) {
  try {
    await verifyAdmin(request)
    
    const { data: submissions, error } = await supabase
      .from('submissions')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    
    return NextResponse.json(submissions)
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}