import { NextRequest, NextResponse } from 'next/server'
import { ObjectId } from 'mongodb'
import jwt from 'jsonwebtoken'
import { connectToDatabase } from '@/lib/mongodb'
import { supabase } from '@/lib/supabase'
import { sendNoticeToAllUsers } from '@/lib/notice-email'

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
    const notices = await db.collection('notices').find({}).sort({ createdAt: -1 }).toArray()
    return NextResponse.json(notices)
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json({ error: 'Failed to fetch notices' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Verify admin
    const token = request.cookies.get('admin-token')?.value
    if (!token) {
      return NextResponse.json({ error: 'No token' }, { status: 401 })
    }
    
    try {
      jwt.verify(token, JWT_SECRET)
    } catch {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }
    
    const { title, content, type, priority } = body
    
    if (!title || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    
    const { db } = await connectToDatabase()
    
    const notice = {
      title,
      content,
      type: type || 'Academic',
      priority: priority || 'Medium',
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    const result = await db.collection('notices').insertOne(notice)
    const createdNotice = { _id: result.insertedId, ...notice }
    
    // Try to send emails (non-blocking, won't fail notice creation)
    try {
      // Get all user emails from MongoDB (multiple collections)
      const mongoUsers = await db.collection('users').find({}, { projection: { email: 1 } }).toArray()
      const mongoSubmissions = await db.collection('skill_test_submissions').find({}, { projection: { email: 1 } }).toArray()
      
      // Get all user emails from Supabase
      const { data: supabaseUsers } = await supabase.from('submissions').select('email')
      
      console.log('MongoDB users:', mongoUsers.length)
      console.log('MongoDB submissions:', mongoSubmissions.length)
      console.log('Supabase users:', supabaseUsers?.length || 0)
      
      // Combine and deduplicate emails from all sources
      const allEmails = new Set([
        ...mongoUsers.map(user => user.email).filter(email => email),
        ...mongoSubmissions.map(user => user.email).filter(email => email),
        ...(supabaseUsers || []).map(user => user.email).filter(email => email)
      ])
      
      const emailList = Array.from(allEmails).filter(email => email && email.includes('@'))
      
      console.log('Total unique emails found:', emailList.length)
      console.log('Email list:', emailList)
      
      // Send notice email to all users (non-blocking)
      if (emailList.length > 0) {
        sendNoticeToAllUsers(createdNotice, emailList).catch(err => 
          console.error('Notice email failed:', err)
        )
      } else {
        console.log('No valid emails found to send notice')
      }
    } catch (emailError) {
      console.error('Email preparation failed:', emailError)
    }
    
    return NextResponse.json(createdNotice)
  } catch (error) {
    console.error('POST error:', error)
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    await verifyAdmin(request)
    const { id, title, content, type, priority } = await request.json()
    
    const { db } = await connectToDatabase()
    await db.collection('notices').updateOne(
      { _id: new ObjectId(id) },
      { $set: { title, content, type, priority, updatedAt: new Date() } }
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
    await db.collection('notices').deleteOne({ _id: new ObjectId(id!) })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE error:', error)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}