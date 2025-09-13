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
  const client = new MongoClient(NOTICES_MONGODB_URI, {
    serverSelectionTimeoutMS: 5000,
    connectTimeoutMS: 10000,
  })
  await client.connect()
  return { db: client.db('notices'), client }
}

export async function GET() {
  let client
  try {
    const { db, client: dbClient } = await getDatabase()
    client = dbClient
    const notices = await db.collection('notices').find({}).sort({ createdAt: -1 }).toArray()
    return NextResponse.json(notices)
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json({ error: 'Failed to fetch notices' }, { status: 500 })
  } finally {
    if (client) await client.close()
  }
}

export async function POST(request: NextRequest) {
  let client
  try {
    await verifyAdmin(request)
    const { title, content, type, priority } = await request.json()
    
    const { db, client: dbClient } = await getDatabase()
    client = dbClient
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
    try {
      await sendNoticeEmail(createdNotice)
    } catch (emailError) {
      console.error('Email sending failed:', emailError)
    }
    
    return NextResponse.json(createdNotice)
  } catch (error) {
    console.error('POST error:', error)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  } finally {
    if (client) await client.close()
  }
}

export async function PUT(request: NextRequest) {
  let client
  try {
    await verifyAdmin(request)
    const { id, title, content, type, priority } = await request.json()
    
    const { db, client: dbClient } = await getDatabase()
    client = dbClient
    await db.collection('notices').updateOne(
      { _id: new ObjectId(id) },
      { $set: { title, content, type, priority, updatedAt: new Date() } }
    )
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('PUT error:', error)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  } finally {
    if (client) await client.close()
  }
}

export async function DELETE(request: NextRequest) {
  let client
  try {
    await verifyAdmin(request)
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    const { db, client: dbClient } = await getDatabase()
    client = dbClient
    await db.collection('notices').deleteOne({ _id: new ObjectId(id!) })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE error:', error)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  } finally {
    if (client) await client.close()
  }
}