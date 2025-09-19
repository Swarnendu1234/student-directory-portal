import { NextRequest, NextResponse } from 'next/server'
import { ObjectId } from 'mongodb'
import jwt from 'jsonwebtoken'
import { connectToDatabase } from '@/lib/mongodb'

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

export async function GET() {
  try {
    const { db } = await connectToDatabase()
    const questions = await db.collection('skill_test_questions').find({}).sort({ createdAt: -1 }).toArray()
    return NextResponse.json(questions)
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json({ error: 'Failed to fetch questions' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await verifyAdmin(request)
    const { question, options, correctAnswer, difficulty, testType } = await request.json()
    
    if (!question || !options || options.length !== 4) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    
    const { db } = await connectToDatabase()
    
    const questionDoc = {
      question,
      options,
      correctAnswer,
      difficulty,
      testType,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    const result = await db.collection('skill_test_questions').insertOne(questionDoc)
    const createdQuestion = { _id: result.insertedId, ...questionDoc }
    
    return NextResponse.json(createdQuestion)
  } catch (error) {
    console.error('POST error:', error)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    await verifyAdmin(request)
    const { id, question, options, correctAnswer, difficulty, testType } = await request.json()
    
    const { db } = await connectToDatabase()
    await db.collection('skill_test_questions').updateOne(
      { _id: new ObjectId(id) },
      { $set: { question, options, correctAnswer, difficulty, testType, updatedAt: new Date() } }
    )
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('PUT error:', error)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await verifyAdmin(request)
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    const { db } = await connectToDatabase()
    await db.collection('skill_test_questions').deleteOne({ _id: new ObjectId(id!) })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE error:', error)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}