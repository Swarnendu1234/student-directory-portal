import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { sendSubmissionNotification } from '@/lib/submission-email'

export async function POST(request: NextRequest) {
  try {
    console.log('Received submission request')
    const formData = await request.formData()
    
    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const phone = formData.get('phone') as string
    const linkedinId = formData.get('linkedinId') as string
    const portfolioDescription = formData.get('portfolioDescription') as string
    const category = formData.get('category') as string
    const portfolioFile = formData.get('portfolioFile') as File
    const redesignFile = formData.get('redesignFile') as File

    console.log('Form data:', { name, email, phone, category })
    
    if (!name || !email || !phone) {
      console.log('Missing required fields:', { name: !!name, email: !!email, phone: !!phone })
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Allow multiple submissions - no duplicate check
    console.log('Processing submission...')

    // Upload files to Supabase Storage
    let portfolioUrl = null
    let redesignUrl = null

    if (portfolioFile && portfolioFile.size > 0) {
      const portfolioPath = `portfolios/${Date.now()}_${portfolioFile.name}`
      console.log('Uploading portfolio file:', portfolioPath)
      
      const { data: portfolioData, error: portfolioError } = await supabase.storage
        .from('attachments')
        .upload(portfolioPath, portfolioFile, {
          cacheControl: '3600',
          upsert: false
        })
      
      if (portfolioError) {
        console.error('Portfolio upload error:', portfolioError)
      } else {
        const { data: { publicUrl } } = supabase.storage
          .from('attachments')
          .getPublicUrl(portfolioPath)
        portfolioUrl = publicUrl
        console.log('Portfolio uploaded successfully:', publicUrl)
      }
    }

    if (redesignFile && redesignFile.size > 0) {
      const redesignPath = `redesigns/${Date.now()}_${redesignFile.name}`
      console.log('Uploading redesign file:', redesignPath)
      
      const { data: redesignData, error: redesignError } = await supabase.storage
        .from('attachments')
        .upload(redesignPath, redesignFile, {
          cacheControl: '3600',
          upsert: false
        })
      
      if (redesignError) {
        console.error('Redesign upload error:', redesignError)
      } else {
        const { data: { publicUrl } } = supabase.storage
          .from('attachments')
          .getPublicUrl(redesignPath)
        redesignUrl = publicUrl
        console.log('Redesign uploaded successfully:', publicUrl)
      }
    }

    // Save submission data to Supabase
    const submissionData = {
      name,
      email,
      phone,
      linkedin_id: linkedinId || null,
      portfolio_description: portfolioDescription || null,
      category,
      portfolio_file_name: portfolioFile?.name || null,
      portfolio_url: portfolioUrl,
      redesign_file_name: redesignFile?.name || null,
      redesign_url: redesignUrl,
      status: 'Submitted'
    }

    console.log('Inserting submission data:', submissionData)
    const { data: result, error } = await supabase
      .from('submissions')
      .insert([submissionData])
      .select()
      .single()

    if (error) {
      console.error('Insert error:', error)
      return NextResponse.json({ error: `Database error: ${error.message}` }, { status: 400 })
    }
    
    console.log('Submission successful:', result.id)
    
    // Send email notification (non-blocking)
    sendSubmissionNotification(result).catch(err => 
      console.error('Email notification failed:', err)
    )
    
    return NextResponse.json({ 
      message: 'Submission successful',
      id: result.id 
    }, { status: 201 })

  } catch (error) {
    console.error('Submission error:', error)
    return NextResponse.json({ 
      error: 'Failed to submit', 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}