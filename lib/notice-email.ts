import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
})

export async function sendNoticeToAllUsers(notice: any, userEmails: string[]) {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      bcc: userEmails, // Send to all users as BCC
      subject: `📢 New Notice: ${notice.title}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">📢 New Notice</h1>
          </div>
          
          <div style="padding: 20px; background: #f9fafb;">
            <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <div style="margin-bottom: 15px;">
                <span style="background: ${getPriorityColor(notice.priority)}; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold;">
                  ${notice.priority.toUpperCase()}
                </span>
                <span style="background: #e5e7eb; color: #374151; padding: 4px 8px; border-radius: 4px; font-size: 12px; margin-left: 8px;">
                  ${notice.type}
                </span>
              </div>
              
              <h2 style="color: #1f2937; margin: 0 0 15px 0;">${notice.title}</h2>
              
              <div style="color: #4b5563; line-height: 1.6; margin-bottom: 15px;">
                ${notice.content.replace(/\n/g, '<br>')}
              </div>
              
              <div style="border-top: 1px solid #e5e7eb; padding-top: 15px; color: #6b7280; font-size: 14px;">
                <strong>Posted:</strong> ${new Date(notice.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
          
          <div style="padding: 15px; text-align: center; color: #6b7280; font-size: 12px;">
            This notice was sent from the Student Directory Portal by Swarnendu Majumder.
          </div>
        </div>
      `
    }
    
    await transporter.sendMail(mailOptions)
    console.log(`Notice email sent to ${userEmails.length} users`)
  } catch (error) {
    console.error('Failed to send notice email:', error)
  }
}

function getPriorityColor(priority: string) {
  switch (priority) {
    case 'High': return '#dc2626'
    case 'Medium': return '#d97706'
    case 'Low': return '#059669'
    default: return '#6b7280'
  }
}