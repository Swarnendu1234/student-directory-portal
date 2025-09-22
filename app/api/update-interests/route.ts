import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { sendOTP } from '@/lib/otp-email'

// Store OTPs temporarily (in production, use Redis or database)
const otpStore = new Map<string, { otp: string, expires: number }>()

export async function POST(request: NextRequest) {
  try {
    const { action, email, otp, interests } = await request.json()
    const { db } = await connectToDatabase()

    if (action === 'send-otp') {
      // Check if email exists in students collection
      const student = await db.collection('students').findOne({ email })
      if (!student) {
        return NextResponse.json({ error: 'Email not found in our records' }, { status: 404 })
      }

      // Generate 6-digit OTP
      const generatedOTP = Math.floor(100000 + Math.random() * 900000).toString()
      const expires = Date.now() + 10 * 60 * 1000 // 10 minutes

      // Store OTP
      otpStore.set(email, { otp: generatedOTP, expires })

      // Send OTP email
      await sendOTP(email, generatedOTP)

      return NextResponse.json({ 
        message: 'OTP sent successfully',
        currentInterests: student.interests || []
      })
    }

    if (action === 'verify-update') {
      // Verify OTP
      const storedOTP = otpStore.get(email)
      if (!storedOTP || storedOTP.expires < Date.now()) {
        return NextResponse.json({ error: 'OTP expired or invalid' }, { status: 400 })
      }

      if (storedOTP.otp !== otp) {
        return NextResponse.json({ error: 'Invalid OTP' }, { status: 400 })
      }

      // Update interests in students collection
      await db.collection('students').updateOne(
        { email },
        { 
          $set: { 
            interests,
            updatedAt: new Date()
          }
        }
      )

      // Remove used OTP
      otpStore.delete(email)

      return NextResponse.json({ message: 'Interests updated successfully' })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Update interests error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}