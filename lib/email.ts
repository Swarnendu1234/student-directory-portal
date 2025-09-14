import nodemailer from 'nodemailer'
import { connectToDatabase } from './mongodb'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
})

export async function sendNoticeEmail(notice: any) {
  try {
    const { db } = await connectToDatabase()
    
    const students = await db.collection('students').find({}, { projection: { email: 1 } }).toArray()
    const emails = students.map(student => student.email).filter(Boolean)
    
    if (emails.length === 0) {
      console.log('No student emails found')
      return
    }
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      bcc: emails,
      subject: `GCETT Notice: ${notice.title}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">${notice.title}</h2>
          <div style="background: #f3f4f6; padding: 10px; border-radius: 5px; margin: 10px 0;">
            <span style="background: #dc2626; color: white; padding: 2px 8px; border-radius: 3px; font-size: 12px;">
              ${notice.priority}
            </span>
            <span style="background: #6b7280; color: white; padding: 2px 8px; border-radius: 3px; font-size: 12px; margin-left: 5px;">
              ${notice.type}
            </span>
          </div>
          <p style="line-height: 1.6;">${notice.content}</p>
          <hr style="margin: 20px 0;">
          <p style="color: #6b7280; font-size: 12px;">
            This is an automated message from GCETT Student Directory Portal.
          </p>
          <p style="margin-top: 20px; font-weight: bold;">
            Swarnendu Majumder
          </p>
        </div>
      `
    }
    
    await transporter.sendMail(mailOptions)
  } catch (error) {
    console.error('Email sending failed:', error)
  }
}