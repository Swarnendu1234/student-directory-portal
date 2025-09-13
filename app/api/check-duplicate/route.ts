import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'

export async function POST(request: NextRequest) {
  try {
    const { field, value } = await request.json()
    
    const { db } = await connectToDatabase()
    const collection = db.collection('students')
    
    let query: any = {}
    
    if (field === 'email') {
      query = { email: value }
    } else if (field === 'phone') {
      query = { phone: value }
    } else if (field === 'wbjeeRoll') {
      query = { wbjeeRollLastTwo: value.slice(-2) }
    }
    
    const existing = await collection.findOne(query)
    
    return NextResponse.json({ exists: !!existing })
  } catch (error) {
    return NextResponse.json({ exists: false })
  }
}