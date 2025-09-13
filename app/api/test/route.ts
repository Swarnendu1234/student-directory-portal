import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'

export async function GET() {
  try {
    console.log('Testing MongoDB connection...')
    const { db } = await connectToDatabase()
    
    // Test the connection by getting database stats
    const stats = await db.stats()
    
    // Test students collection
    const studentsCollection = db.collection('students')
    const studentCount = await studentsCollection.countDocuments()
    
    return NextResponse.json({
      message: 'MongoDB connection successful',
      database: stats.db,
      collections: stats.collections,
      studentCount,
      mongoUri: process.env.MONGODB_URI ? 'Set' : 'Not set'
    })
  } catch (error) {
    console.error('MongoDB connection error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to connect to MongoDB', 
        details: error instanceof Error ? error.message : 'Unknown error',
        mongoUri: process.env.MONGODB_URI ? 'Set' : 'Not set'
      },
      { status: 500 }
    )
  }
}