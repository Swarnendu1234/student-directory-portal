import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'

export async function POST(request: NextRequest) {
  try {
    const { email, interests } = await request.json()
    
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const { db } = await connectToDatabase()
    
    // Check if already updated
    const student = await db.collection('students').findOne({ email })
    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 })
    }
    
    if (student.interestsUpdated) {
      return NextResponse.json({ error: 'This email has already updated interests' }, { status: 400 })
    }
    
    const result = await db.collection('students').updateOne(
      { email },
      { $set: { interests: interests || [], interestsUpdated: true } }
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update interests' }, { status: 500 })
  }
}