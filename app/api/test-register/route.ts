import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'

export async function POST(request: NextRequest) {
  try {
    console.log('Test registration endpoint called')
    
    const body = await request.json()
    console.log('Request body:', body)
    
    const { db } = await connectToDatabase()
    console.log('Connected to database')
    
    const collection = db.collection('students')
    
    const testStudent = {
      fullName: body.fullName || 'Test Student',
      email: body.email || 'test@example.com',
      phone: body.phone || '1234567890',
      wbjeeRoll: body.wbjeeRoll || '12345678901',
      department: body.department || 'Computer Science & Engineering',
      profilePhotoUrl: '',
      createdAt: new Date()
    }
    
    const result = await collection.insertOne(testStudent)
    console.log('Insert result:', result)
    
    return NextResponse.json({
      success: true,
      message: 'Test student created successfully',
      id: result.insertedId
    })
    
  } catch (error) {
    console.error('Test registration error:', error)
    return NextResponse.json(
      { error: 'Test failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const { db } = await connectToDatabase()
    const collection = db.collection('students')
    const count = await collection.countDocuments()
    
    return NextResponse.json({
      message: 'Database connection successful',
      studentCount: count
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Database connection failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}