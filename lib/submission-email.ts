import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
})

export async function sendSubmissionNotification(submission: any) {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'swarnendumajumdert2007@gmail.com',
      subject: `New ${submission.category} Portfolio Submission - ${submission.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">New Portfolio Submission</h2>
          
          <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h3 style="margin-top: 0; color: ${submission.category === 'AI/ML' ? '#2563eb' : '#ea580c'};">
              ${submission.category} Portfolio
            </h3>
          </div>

          <div style="margin: 20px 0;">
            <h4>Candidate Details:</h4>
            <p><strong>Name:</strong> ${submission.name}</p>
            <p><strong>Email:</strong> ${submission.email}</p>
            <p><strong>Phone:</strong> ${submission.phone}</p>
            ${submission.linkedin_id ? `<p><strong>LinkedIn:</strong> <a href="${submission.linkedin_id}" target="_blank">${submission.linkedin_id}</a></p>` : '<p><strong>LinkedIn:</strong> Not provided</p>'}
          </div>

          ${submission.portfolio_file_name ? `
          <div style="margin: 20px 0;">
            <h4>Portfolio File:</h4>
            <p><strong>File:</strong> ${submission.portfolio_file_name}</p>
            ${submission.portfolio_url ? `<p><a href="${submission.portfolio_url}" target="_blank" style="color: #2563eb;">Download Portfolio</a></p>` : ''}
          </div>
          ` : ''}

          ${submission.redesign_file_name ? `
          <div style="margin: 20px 0; background: #fff7ed; padding: 15px; border-radius: 8px; border-left: 4px solid #ea580c;">
            <h4 style="color: #ea580c; margin-top: 0;">Redesign Challenge:</h4>
            <p><strong>File:</strong> ${submission.redesign_file_name}</p>
            ${submission.redesign_url ? `<p><a href="${submission.redesign_url}" target="_blank" style="color: #ea580c;">Download Redesign</a></p>` : ''}
          </div>
          ` : ''}

          ${submission.portfolio_description ? `
          <div style="margin: 20px 0;">
            <h4>Description:</h4>
            <p style="background: #f9fafb; padding: 10px; border-radius: 5px;">${submission.portfolio_description}</p>
          </div>
          ` : ''}

          <div style="margin: 20px 0; padding: 15px; background: #f0f9ff; border-radius: 8px;">
            <p style="margin: 0;"><strong>Submitted:</strong> ${new Date(submission.created_at).toLocaleString()}</p>
          </div>

          <hr style="margin: 30px 0;">
          <p style="color: #6b7280; font-size: 12px;">
            This notification was sent from the Student Directory Portal.
          </p>
        </div>
      `
    }
    
    await transporter.sendMail(mailOptions)
    console.log('Submission notification sent successfully')
  } catch (error) {
    console.error('Failed to send submission notification:', error)
  }
}