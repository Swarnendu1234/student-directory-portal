import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
})

export async function sendOTP(email: string, otp: string) {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: '🔐 OTP for Interest Update - GCETT Portal',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">🔐 Verification Code</h1>
          </div>
          
          <div style="padding: 30px; background: #f9fafb;">
            <div style="background: white; padding: 25px; border-radius: 8px; text-align: center;">
              <h2 style="color: #1f2937; margin-bottom: 15px;">Update Your Interests</h2>
              <p style="color: #6b7280; margin-bottom: 25px;">Enter this OTP to update your interests:</p>
              
              <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <span style="font-size: 32px; font-weight: bold; color: #2563eb; letter-spacing: 5px;">${otp}</span>
              </div>
              
              <p style="color: #ef4444; font-size: 14px; margin-top: 20px;">
                ⏰ This OTP expires in 10 minutes
              </p>
            </div>
          </div>
          
          <div style="padding: 15px; text-align: center; color: #6b7280; font-size: 12px;">
            GCETT Student Directory Portal
          </div>
        </div>
      `
    }
    
    await transporter.sendMail(mailOptions)
    console.log(`OTP sent to ${email}`)
  } catch (error) {
    console.error('Failed to send OTP:', error)
    throw error
  }
}