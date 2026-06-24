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

    // Match UI component course/dept structure if needed
    return {
      student: {
        id: student.id,
        name: student.name,
        register_number: student.register_number,
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

