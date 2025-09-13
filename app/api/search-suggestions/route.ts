import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q') || ''
    
    const { db } = await connectToDatabase()
    const collection = db.collection('students')
    
    if (!query) {
      // Return trending users (most recent registrations)
      const trending = await collection
        .find({})
        .sort({ createdAt: -1 })
        .limit(5)
        .project({ fullName: 1, homeTown: 1, department: 1, _id: 1 })
        .toArray()
      
      return NextResponse.json({ suggestions: trending, trending: true })
    }
    
    // Search suggestions
    const suggestions = await collection
      .find({
        $or: [
          { fullName: { $regex: query, $options: 'i' } },
          { homeTown: { $regex: query, $options: 'i' } },
          { phone: { $regex: query, $options: 'i' } }
        ]
      })
      .limit(8)
      .project({ fullName: 1, homeTown: 1, phone: 1, department: 1, _id: 1 })
      .toArray()
    
    return NextResponse.json({ suggestions, trending: false })
  } catch (error) {
    return NextResponse.json({ suggestions: [], trending: false })
  }
}