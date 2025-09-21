import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import jwt from 'jsonwebtoken'

function maskPhoneNumber(phone: string): string {
  if (!phone || phone.length < 2) return phone
  const lastTwo = phone.slice(-2)
  const masked = '*'.repeat(phone.length - 2) + lastTwo
  return masked
}

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

    // Check if request is from admin
    const token = request.cookies.get('admin-token')?.value
    let isAdmin = false
    
    if (token) {
      try {
        jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key')
        isAdmin = true
      } catch {
        isAdmin = false
      }
    }
    
    // Mask phone numbers for non-admin users
    const processedStudents = students.map(student => ({
      ...student,
      phone: isAdmin ? student.phone : maskPhoneNumber(student.phone || '')
    }))

    return NextResponse.json(processedStudents)
  } catch (error) {
    console.error('Fetch students error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch students', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { db } = await connectToDatabase()
    
    // Check for duplicate email or WBJEE roll
    const existing = await db.collection('students').findOne({
      $or: [
        { email: body.email },
        { wbjeeRollLastTwo: body.wbjeeRollLastTwo }
      ]
    })
    
    if (existing) {
      return NextResponse.json(
        { error: 'Email or WBJEE roll already registered' },
        { status: 400 }
      )
    }
    
    // Add timestamp
    const studentData = {
      ...body,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    const result = await db.collection('students').insertOne(studentData)
    
    return NextResponse.json(
      { message: 'Registration successful', id: result.insertedId },
      { status: 201 }
    )
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Failed to register student' },
      { status: 500 }
    )
  }
}