import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()
    
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const { db } = await connectToDatabase()
    const student = await db.collection('students').findOne({ email })
    
    if (!student) {
      return NextResponse.json({ error: 'Email not found, please register first' }, { status: 404 })
    }

    return NextResponse.json({ 
      success: true, 
      interests: student.interests || [],
      hasUpdated: student.interestsUpdated || false
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to verify email' }, { status: 500 })
  }
}