'use server'

import { 
  getStudentByCredentials, 
  getStudentResults, 
  getStudentResultSummaries 
} from '@/lib/data/public'
import { postgresClient } from '@/lib/postgres/client'
import crypto from 'crypto'

export async function lookupResults(registerNumber: string, dateOfBirth: string) {
  try {
    const student = await getStudentByCredentials(registerNumber, dateOfBirth)
    if (!student) {
      return { error: 'No student found with the provided details. Please check your Register Number and Date of Birth.' }
    }

    const results = await getStudentResults(student.id)
    const summaries = await getStudentResultSummaries(student.id)

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
        grade: r.grade,
        credits: r.credits,
        result_status: r.result_status,
      })),
      summary: summaries.find(s => s.semester === student.semester) || summaries[0] || null
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
    const id = crypto.randomUUID()
    const payload = {
      id,
      name: formData.name,
      email: formData.email,
      phone: formData.phone || null,
      subject: formData.subject || null,
      message: formData.message,
      status: 'unread',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    const { error } = await postgresClient.insert('contact_messages', payload)
    if (error) {
      throw error
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
    const { sendEmail } = await import('@/lib/mail')
    const id = crypto.randomUUID()
    const now = new Date().toISOString()
    
    const percentageNum = parseFloat(formData.percentage)
    if (isNaN(percentageNum)) {
      throw new Error('Invalid percentage value')
    }

    const payload = {
      id,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      level: formData.level,
      course_id: formData.courseId || null,
      percentage: percentageNum,
      queries: formData.queries || null,
      status: 'pending',
      created_at: now,
      updated_at: now
    }

    const { error: insertError } = await postgresClient.insert('admission_enquiries', payload)
    if (insertError) {
      throw insertError
    }

    let courseName = 'Selected Course'
    if (formData.courseId) {
      const { data: courseData } = await postgresClient
        .from('courses')
        .select('name')
        .eq('id', formData.courseId)
        .single()
      if (courseData && courseData.name) {
        courseName = courseData.name
      }
    }

    // 1. Send confirmation email to applicant
    const applicantSubject = `Admissions Enquiry Received - National College`
    const applicantHtml = `
      <div style="font-family: sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: 0 auto; border: 1px solid #f0f0f0; padding: 20px; border-radius: 8px;">
        <h2 style="color: #0f2d52; margin-top: 0;">Dear ${formData.name},</h2>
        <p>Thank you for submitting your admission enquiry for the <strong>${courseName}</strong> program at National College.</p>
        <p>Our admissions counseling panel is currently reviewing your academic details (Marks obtained: <strong>${percentageNum}%</strong>).</p>
        <p>One of our officers will reach out to you at <strong>${formData.phone}</strong> or via this email address shortly.</p>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="font-size: 12px; color: #888; margin-bottom: 0;">Best Regards,<br/><strong>Admissions Team</strong><br/>National College</p>
      </div>
    `
    await sendEmail({
      to: formData.email,
      subject: applicantSubject,
      html: applicantHtml,
    })

    // 2. Send alert email to college administrator
    const adminEmail = process.env.ADMIN_ALERT_EMAIL || 'admissions@nationalcollege.edu'
    const adminSubject = `[Admissions Lead] New Enquiry: ${formData.name}`
    const adminHtml = `
      <div style="font-family: sans-serif; color: #333; line-height: 1.6; max-width: 650px; margin: 0 auto; border: 1px solid #f0f0f0; padding: 20px; border-radius: 8px;">
        <h2 style="color: #0f2d52; margin-top: 0; border-bottom: 2px solid #0f2d52; padding-bottom: 10px;">New Admission Enquiry</h2>
        <p>A new admission enquiry lead has been submitted on the college portal. Details below:</p>
        <table border="0" cellpadding="8" cellspacing="0" style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tr style="background-color: #fcfcfc;"><td style="width: 180px; font-weight: bold; border-bottom: 1px solid #eee;">Name:</td><td style="border-bottom: 1px solid #eee;">${formData.name}</td></tr>
          <tr><td style="font-weight: bold; border-bottom: 1px solid #eee;">Email:</td><td style="border-bottom: 1px solid #eee;"><a href="mailto:${formData.email}">${formData.email}</a></td></tr>
          <tr style="background-color: #fcfcfc;"><td style="font-weight: bold; border-bottom: 1px solid #eee;">Phone:</td><td style="border-bottom: 1px solid #eee;">${formData.phone}</td></tr>
          <tr><td style="font-weight: bold; border-bottom: 1px solid #eee;">Program Level:</td><td style="border-bottom: 1px solid #eee; text-transform: uppercase;">${formData.level}</td></tr>
          <tr style="background-color: #fcfcfc;"><td style="font-weight: bold; border-bottom: 1px solid #eee;">Desired Course:</td><td style="border-bottom: 1px solid #eee;">${courseName}</td></tr>
          <tr><td style="font-weight: bold; border-bottom: 1px solid #eee;">Marks Obtained:</td><td style="border-bottom: 1px solid #eee; font-weight: bold; color: #10b981;">${percentageNum}%</td></tr>
          <tr style="background-color: #fcfcfc;"><td style="font-weight: bold; vertical-align: top;">Queries / Notes:</td><td>${formData.queries ? formData.queries.replace(/\n/g, '<br/>') : '—'}</td></tr>
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

