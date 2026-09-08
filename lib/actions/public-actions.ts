'use server'

import { 
  getStudentByCredentials, 
  getStudentResults, 
  getStudentResultSummaries 
} from '@/lib/data/public'
import { postgresClient } from '@/lib/postgres/client'
import crypto from 'crypto'
import {
  sanitizeHtml,
  stripTags,
  validateInput,
  resultLookupSchema,
  contactMessageSchema,
  admissionEnquirySchema,
  testimonialSubmissionSchema,
} from '@/lib/security'

export async function lookupResults(registerNumber: string, dateOfBirth: string, semester?: string, examType?: string) {
  try {
    // Validate input
    const validated = validateInput(resultLookupSchema, { registerNumber, dateOfBirth, semester })

    const student = await getStudentByCredentials(validated.registerNumber, validated.dateOfBirth)
    if (!student) {
      return { error: 'No student found with the provided details. Please check your Register Number and Date of Birth.' }
    }

    let results = await getStudentResults(student.id)
    let summaries = await getStudentResultSummaries(student.id)

    if (validated.semester) {
      const semNum = parseInt(validated.semester, 10)
      if (!isNaN(semNum)) {
        results = results.filter((r: any) => r.semester === semNum)
        summaries = summaries.filter((s: any) => s.semester === semNum)
      }
    }

    if (examType) {
      results = results.filter((r: any) => r.examination_type === examType)
      summaries = summaries.filter((s: any) => s.examination_type === examType)
    }

    let courseName = undefined
    let deptName = undefined

    if ((student as any).course_id) {
      const { data: course } = await postgresClient
        .from('courses')
        .select('name')
        .eq('id', (student as any).course_id)
        .single()
      if (course) {
        courseName = (course as any).name
      }
    }

    if ((student as any).department_id) {
      const { data: dept } = await postgresClient
        .from('departments')
        .select('name')
        .eq('id', (student as any).department_id)
        .single()
      if (dept) {
        deptName = (dept as any).name
      }
    }

    // Match UI component course/dept structure if needed
    return {
      student: {
        id: student.id,
        name: student.name,
        register_number: student.register_number,
        course_name: courseName,
        department_name: deptName,
        date_of_birth: (student as any).date_of_birth,
      },
      results: results.map(r => ({
        semester: r.semester,
        academic_year: r.academic_year,
        subject_code: r.subject_code,
        subject_name: r.subject_name,
        internal_marks: r.internal_marks,
        external_marks: r.external_marks,
        total_marks: r.total_marks,
        max_marks: r.max_marks,
        theory_max_marks: r.theory_max_marks,
        theory_min_marks: r.theory_min_marks,
        ia_max_marks: r.ia_max_marks,
        ia_min_marks: r.ia_min_marks,
        total_min_marks: r.total_min_marks,
        grade_points: r.grade_points,
        credit_points: r.credit_points,
        grade: r.grade,
        credits: r.credits,
        result_status: r.result_status,
      })),
      summary: (validated.semester ? summaries[0] : (summaries.find((s: any) => s.semester === (student as any).semester) || summaries[0])) || null
    }
  } catch (err: any) {
    return { error: err.message || 'An error occurred while fetching results.' }
  }
}

export async function submitContactMessage(formData: {
  name: string
  email: string
  phone?: string
  subject?: string
  message: string
}) {
  try {
    // Validate input
    const validated = validateInput(contactMessageSchema, formData)

    const id = crypto.randomUUID()
    const payload = {
      id,
      name: stripTags(validated.name),
      email: validated.email,
      phone: validated.phone ? stripTags(validated.phone) : null,
      subject: validated.subject ? stripTags(validated.subject) : null,
      message: stripTags(validated.message),
      status: 'unread',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    const { error } = await postgresClient.insert('contact_messages', payload)
    if (error) {
      throw error
    }

    // Send emails via Resend
    try {
      const { sendEmail } = await import('@/lib/mail')
      const adminEmail = process.env.ADMIN_ALERT_EMAIL || 'admissions@nationalcollege.edu'
      const safeName = sanitizeHtml(payload.name)
      const safeSubject = payload.subject ? sanitizeHtml(payload.subject) : 'General Inquiry'
      const safeMsg = sanitizeHtml(payload.message).replace(/\n/g, '<br/>')
      const safePhone = payload.phone ? sanitizeHtml(payload.phone) : '—'

      // 1. Send Alert to Admin
      await sendEmail({
        to: adminEmail,
        subject: `[Contact Form] ${safeSubject} - from ${safeName}`,
        replyTo: validated.email,
        html: `
          <div style="font-family: sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: 0 auto; border: 1px solid #f0f0f0; padding: 20px; border-radius: 8px;">
            <h2 style="color: #0f2d52; margin-top: 0; border-bottom: 2px solid #0f2d52; padding-bottom: 10px;">New Contact Message</h2>
            <p>A new message was submitted via the college contact form:</p>
            <table border="0" cellpadding="8" cellspacing="0" style="width: 100%; border-collapse: collapse; font-size: 14px;">
              <tr style="background-color: #fcfcfc;"><td style="width: 140px; font-weight: bold; border-bottom: 1px solid #eee;">From:</td><td style="border-bottom: 1px solid #eee;">${safeName}</td></tr>
              <tr><td style="font-weight: bold; border-bottom: 1px solid #eee;">Email:</td><td style="border-bottom: 1px solid #eee;"><a href="mailto:${sanitizeHtml(validated.email)}">${sanitizeHtml(validated.email)}</a></td></tr>
              <tr style="background-color: #fcfcfc;"><td style="font-weight: bold; border-bottom: 1px solid #eee;">Phone:</td><td style="border-bottom: 1px solid #eee;">${safePhone}</td></tr>
              <tr><td style="font-weight: bold; border-bottom: 1px solid #eee;">Subject:</td><td style="border-bottom: 1px solid #eee;">${safeSubject}</td></tr>
              <tr style="background-color: #fcfcfc;"><td style="font-weight: bold; vertical-align: top;">Message:</td><td>${safeMsg}</td></tr>
            </table>
            <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
            <p style="font-size: 12px; color: #888; margin-bottom: 0;">You can reply directly to this email to respond to ${safeName}.</p>
          </div>
        `
      })

      // 2. Send Acknowledgment to Sender
      await sendEmail({
        to: validated.email,
        subject: `We received your message - National College`,
        html: `
          <div style="font-family: sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: 0 auto; border: 1px solid #f0f0f0; padding: 20px; border-radius: 8px;">
            <h2 style="color: #0f2d52; margin-top: 0;">Hello ${safeName},</h2>
            <p>Thank you for reaching out to National College. We have received your message regarding "<strong>${safeSubject}</strong>".</p>
            <p>Our administrative desk is reviewing your message and will get back to you as soon as possible.</p>
            <div style="background-color: #f9fafb; padding: 12px 16px; border-left: 4px solid #0f2d52; margin: 16px 0; font-size: 13px;">
              <strong>Your message:</strong><br/>
              ${safeMsg}
            </div>
            <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
            <p style="font-size: 12px; color: #888; margin-bottom: 0;">Best regards,<br/><strong>Administrative Office</strong><br/>National College</p>
          </div>
        `
      })
    } catch (emailErr) {
      console.warn('[Contact Form] Email notification warning:', emailErr)
    }

    return { ok: true }
  } catch (err: any) {
    return { error: err.message || 'Failed to send message.' }
  }
}

export async function getActiveResultsPdfs() {
  try {
    const { data, error } = await postgresClient
      .from('results_pdfs')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (error) {
      throw error
    }
    return { data: data || [] }
  } catch (err: any) {
    console.error('Error fetching active results PDFs:', err)
    return { error: err.message || 'Failed to load official results announcements.' }
  }
}

export async function submitAdmissionEnquiry(formData: {
  name: string
  email: string
  phone: string
  level: string
  courseId: string
  percentage: string
  queries?: string
}) {
  try {
    // Validate input
    const validated = validateInput(admissionEnquirySchema, formData)

    const { sendEmail } = await import('@/lib/mail')
    const id = crypto.randomUUID()
    const now = new Date().toISOString()
    
    const percentageNum = parseFloat(validated.percentage)
    if (isNaN(percentageNum)) {
      throw new Error('Invalid percentage value')
    }

    // Sanitize all text fields before DB insert and email embedding
    const safeName = stripTags(validated.name)
    const safePhone = stripTags(validated.phone)
    const safeQueries = validated.queries ? stripTags(validated.queries) : null

    const payload = {
      id,
      name: safeName,
      email: validated.email,
      phone: safePhone,
      level: validated.level,
      course_id: validated.courseId || null,
      percentage: percentageNum,
      queries: safeQueries,
      status: 'pending',
      created_at: now,
      updated_at: now
    }

    const { error: insertError } = await postgresClient.insert('admission_enquiries', payload)
    if (insertError) {
      throw insertError
    }

    let courseName = 'Selected Course'
    if (validated.courseId) {
      const { data: courseData } = await postgresClient
        .from('courses')
        .select('name')
        .eq('id', validated.courseId)
        .single()
      if (courseData && courseData.name) {
        courseName = courseData.name
      }
    }

    // HTML-escape user content for email templates to prevent XSS
    const htmlName = sanitizeHtml(safeName)
    const htmlPhone = sanitizeHtml(safePhone)
    const htmlCourseName = sanitizeHtml(courseName)
    const htmlQueries = safeQueries ? sanitizeHtml(safeQueries).replace(/\n/g, '<br/>') : '—'

    // 1. Send confirmation email to applicant
    const applicantSubject = `Admissions Enquiry Received - National College`
    const applicantHtml = `
      <div style="font-family: sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: 0 auto; border: 1px solid #f0f0f0; padding: 20px; border-radius: 8px;">
        <h2 style="color: #0f2d52; margin-top: 0;">Dear ${htmlName},</h2>
        <p>Thank you for submitting your admission enquiry for the <strong>${htmlCourseName}</strong> program at National College.</p>
        <p>Our admissions counseling panel is currently reviewing your academic details (Marks obtained: <strong>${percentageNum}%</strong>).</p>
        <p>One of our officers will reach out to you at <strong>${htmlPhone}</strong> or via this email address shortly.</p>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="font-size: 12px; color: #888; margin-bottom: 0;">Best Regards,<br/><strong>Admissions Team</strong><br/>National College</p>
      </div>
    `
    await sendEmail({
      to: validated.email,
      subject: applicantSubject,
      html: applicantHtml,
    })

    // 2. Send alert email to college administrator
    const adminEmail = process.env.ADMIN_ALERT_EMAIL || 'admissions@nationalcollege.edu'
    const adminSubject = `[Admissions Lead] New Enquiry: ${htmlName}`
    const adminHtml = `
      <div style="font-family: sans-serif; color: #333; line-height: 1.6; max-width: 650px; margin: 0 auto; border: 1px solid #f0f0f0; padding: 20px; border-radius: 8px;">
        <h2 style="color: #0f2d52; margin-top: 0; border-bottom: 2px solid #0f2d52; padding-bottom: 10px;">New Admission Enquiry</h2>
        <p>A new admission enquiry lead has been submitted on the college portal. Details below:</p>
        <table border="0" cellpadding="8" cellspacing="0" style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tr style="background-color: #fcfcfc;"><td style="width: 180px; font-weight: bold; border-bottom: 1px solid #eee;">Name:</td><td style="border-bottom: 1px solid #eee;">${htmlName}</td></tr>
          <tr><td style="font-weight: bold; border-bottom: 1px solid #eee;">Email:</td><td style="border-bottom: 1px solid #eee;"><a href="mailto:${sanitizeHtml(validated.email)}">${sanitizeHtml(validated.email)}</a></td></tr>
          <tr style="background-color: #fcfcfc;"><td style="font-weight: bold; border-bottom: 1px solid #eee;">Phone:</td><td style="border-bottom: 1px solid #eee;">${htmlPhone}</td></tr>
          <tr><td style="font-weight: bold; border-bottom: 1px solid #eee;">Program Level:</td><td style="border-bottom: 1px solid #eee; text-transform: uppercase;">${sanitizeHtml(validated.level)}</td></tr>
          <tr style="background-color: #fcfcfc;"><td style="font-weight: bold; border-bottom: 1px solid #eee;">Desired Course:</td><td style="border-bottom: 1px solid #eee;">${htmlCourseName}</td></tr>
          <tr><td style="font-weight: bold; border-bottom: 1px solid #eee;">Marks Obtained:</td><td style="border-bottom: 1px solid #eee; font-weight: bold; color: #10b981;">${percentageNum}%</td></tr>
          <tr style="background-color: #fcfcfc;"><td style="font-weight: bold; vertical-align: top;">Queries / Notes:</td><td>${htmlQueries}</td></tr>
        </table>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="font-size: 12px; color: #888; margin-bottom: 0;">This lead has been saved in the CMS dashboard. You can manage their status under "Admission Enquiries".</p>
      </div>
    `
    await sendEmail({
      to: adminEmail,
      subject: adminSubject,
      html: adminHtml,
    })

    return { ok: true }
  } catch (err: any) {
    console.error('Error submitting enquiry:', err)
    return { error: err.message || 'Failed to submit enquiry. Please try again.' }
  }
}

export async function submitTestimonial(formData: FormData) {
  try {
    const rawData = {
      name: formData.get('name') as string,
      designation: formData.get('designation') as string,
      company: formData.get('company') as string,
      batchYear: formData.get('batchYear') as string,
      rating: Number(formData.get('rating')),
      content: formData.get('content') as string,
    }

    const validated = validateInput(testimonialSubmissionSchema, rawData)

    const payload = {
      id: crypto.randomUUID(),
      name: stripTags(validated.name),
      designation: validated.designation ? stripTags(validated.designation) : null,
      company: validated.company ? stripTags(validated.company) : null,
      batch_year: validated.batchYear ? parseInt(validated.batchYear, 10) : null,
      rating: validated.rating,
      content: sanitizeHtml(validated.content),
      is_active: false, // Default to inactive (requires CMS approval)
      is_featured: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    const { error } = await postgresClient.insert('testimonials', payload)

    if (error) {
      console.error('Error inserting testimonial:', error)
      return { error: 'Failed to submit review. Please try again later.' }
    }

    // Send admin notification via Resend
    try {
      const { sendEmail } = await import('@/lib/mail')
      const adminEmail = process.env.ADMIN_ALERT_EMAIL || 'admissions@nationalcollege.edu'
      await sendEmail({
        to: adminEmail,
        subject: `[New Testimonial] Review submitted by ${payload.name}`,
        html: `
          <div style="font-family: sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: 0 auto; border: 1px solid #f0f0f0; padding: 20px; border-radius: 8px;">
            <h2 style="color: #0f2d52; margin-top: 0;">New Testimonial Awaiting Approval</h2>
            <p>A new student/alumni review has been submitted on the portal:</p>
            <table border="0" cellpadding="6" cellspacing="0" style="width: 100%; border-collapse: collapse; font-size: 14px;">
              <tr><td style="width: 130px; font-weight: bold; border-bottom: 1px solid #eee;">Name:</td><td style="border-bottom: 1px solid #eee;">${sanitizeHtml(payload.name)}</td></tr>
              <tr><td style="font-weight: bold; border-bottom: 1px solid #eee;">Role/Company:</td><td style="border-bottom: 1px solid #eee;">${payload.designation || '—'} ${payload.company ? `@ ${payload.company}` : ''}</td></tr>
              <tr><td style="font-weight: bold; border-bottom: 1px solid #eee;">Rating:</td><td style="border-bottom: 1px solid #eee; color: #f59e0b; font-weight: bold;">${'★'.repeat(payload.rating || 5)}${'☆'.repeat(Math.max(0, 5 - (payload.rating || 5)))} (${payload.rating || 5}/5)</td></tr>
              <tr><td style="font-weight: bold; vertical-align: top;">Review:</td><td>${payload.content}</td></tr>
            </table>
            <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
            <p style="font-size: 12px; color: #888; margin-bottom: 0;">You can review and publish this testimonial from the CMS Testimonials manager.</p>
          </div>
        `
      })
    } catch (e) {
      console.warn('[Testimonial] Email alert warning:', e)
    }

    return { ok: true, message: 'Thank you! Your review has been submitted and is pending approval.' }
  } catch (error: any) {
    console.error('Testimonial submission error:', error)
    if (error?.message) return { error: error.message }
    return { error: 'Invalid submission data.' }
  }
}
