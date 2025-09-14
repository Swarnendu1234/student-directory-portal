import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'

export async function GET(request: NextRequest) {
  try {
    console.log('Fetching students...')
    
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const department = searchParams.get('department') || ''
    const year = searchParams.get('year') || ''
    const interest = searchParams.get('interest') || ''

    console.log('Search params:', { search, department, year, interest })

    const { db } = await connectToDatabase()
    console.log('Connected to database')
    
    const collection = db.collection('students')

    // Build search query
    const query: any = {}
    
    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { wbjeeRollLastTwo: { $regex: search, $options: 'i' } }
      ]
    }
    
    if (department && department !== 'All Departments') {
      query.department = department
    }
    
    if (year && year !== 'All Years') {
      query.currentYear = year
    }
    
    if (interest && interest !== 'All Interests') {
      query.interests = { $in: [interest] }
    }

    console.log('Query:', query)

    const students = await collection
      .find(query)
      .sort({ createdAt: -1 })
      .toArray()

    console.log('Found students:', students.length)

    return NextResponse.json(students)
  } catch (error) {
    console.error('Fetch students error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch students', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}