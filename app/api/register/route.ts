import { NextRequest, NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'
import { connectToDatabase } from '@/lib/mongodb'
import bcrypt from 'bcrypt'

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    
    const fullName = formData.get('fullName') as string
    const email = formData.get('email') as string
    const phone = formData.get('phone') as string
    const wbjeeRoll = formData.get('wbjeeRoll') as string
    const homeTown = formData.get('homeTown') as string
    const department = formData.get('department') as string
    const currentYear = formData.get('currentYear') as string
    const profilePhoto = formData.get('profilePhoto') as File

    console.log('Received data:', { fullName, email, phone, wbjeeRoll, department })

    // Connect to MongoDB
    const { db } = await connectToDatabase()
    const collection = db.collection('students')

    // Check for duplicates
    const existing = await collection.findOne({
      $or: [
        { email },
        { phone },
        { wbjeeRollLastTwo: wbjeeRoll.slice(-2) }
      ]
    })

    if (existing) {
      return NextResponse.json(
        { error: 'Email, phone, or WBJEE roll number already registered' },
        { status: 400 }
      )
    }

    // Upload photo to Cloudinary
    let profilePhotoUrl = ''
    if (profilePhoto && profilePhoto.size > 0) {
      const bytes = await profilePhoto.arrayBuffer()
      const buffer = Buffer.from(bytes)
      
      const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { folder: 'student-directory' },
          (error, result) => {
            if (error) reject(error)
            else resolve(result)
          }
        ).end(buffer)
      })
      profilePhotoUrl = (uploadResult as any).secure_url
    }

    // Save to database
    const studentData = {
      fullName,
      email,
      phone,
      wbjeeRollLastTwo: wbjeeRoll.slice(-2),
      homeTown,
      department,
      currentYear,
      profilePhotoUrl,
      createdAt: new Date()
    }

    const result = await collection.insertOne(studentData)
    console.log('Student saved:', result.insertedId)

    return NextResponse.json({ message: 'Success' }, { status: 201 })

  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json({ error: 'Failed to register' }, { status: 500 })
  }
}