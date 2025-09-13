import { NextRequest, NextResponse } from 'next/server'
import { MongoClient, ObjectId } from 'mongodb'
import jwt from 'jsonwebtoken'
import { sendNoticeEmail } from '@/lib/email'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'
const NOTICES_MONGODB_URI = process.env.NOTICES_MONGODB_URI || 'mongodb://localhost:27017/notices'

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

async function getDatabase() {
  const client = new MongoClient(NOTICES_MONGODB_URI)
  await client.connect()
  return client.db('notices')
}

export async function GET() {
  try {
    const db = await getDatabase()
    const notices = await db.collection('notices').find({}).sort({ createdAt: -1 }).toArray()
    return NextResponse.json(notices)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch notices' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await verifyAdmin(request)
    const { title, content, type, priority } = await request.json()
    
    const db = await getDatabase()
    const notice = {
      title,
      content,
      type,
      priority,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    const result = await db.collection('notices').insertOne(notice)
    const createdNotice = { id: result.insertedId, ...notice }
    
    // Send email notification
    await sendNoticeEmail(createdNotice)
    
    return NextResponse.json(createdNotice)
  } catch (error) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    await verifyAdmin(request)
    const { id, title, content, type, priority } = await request.json()
    
    const db = await getDatabase()
    await db.collection('notices').updateOne(
      { _id: new ObjectId(id) },
      { $set: { title, content, type, priority, updatedAt: new Date() } }
    )
    
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await verifyAdmin(request)
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    const db = await getDatabase()
    await db.collection('notices').deleteOne({ _id: new ObjectId(id!) })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}