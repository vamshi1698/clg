import { NextResponse } from 'next/server'
import { getSession } from '@/lib/cms/auth'
import { processStudentExcelBuffer } from '@/lib/excel/student-batch-processor'
import { logCmsActivity } from '@/lib/cms/actions'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  try {
    // 1. Authentication guard — require valid CMS admin session
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Role check
    const { canAccess } = await import('@/lib/cms/roles')
    if (!canAccess(session.role, 'students')) {
      return NextResponse.json({ error: 'Forbidden: Insufficient privileges for student records' }, { status: 403 })
    }

    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    const arrayBuffer = await file.arrayBuffer()

    // 2. Execute chunked batch processing (200 records per transaction with rollback triggers)
    const result = await processStudentExcelBuffer(arrayBuffer, {
      batchSize: 200,
      defaultDob: '2000-01-01'
    })

    if (!result.ok && result.importedCount === 0) {
      return NextResponse.json({
        error: result.errors?.[0] || 'Failed to process student records',
        errors: result.errors,
        warnings: result.warnings
      }, { status: 400 })
    }

    // 3. Log CMS activity
    try {
      await logCmsActivity(
        'IMPORT_STUDENTS_EXCEL',
        'students',
        `Imported ${result.importedCount} students (${result.insertedCount} inserted, ${result.updatedCount} updated) across ${result.batchCount} batch transactions in ${result.executionTimeMs}ms.`
      )
    } catch (logErr) {
      console.error('Audit logging error for student excel import:', logErr)
    }

    return NextResponse.json({
      ok: true,
      importedCount: result.importedCount,
      insertedCount: result.insertedCount,
      updatedCount: result.updatedCount,
      totalRows: result.totalRows,
      validRows: result.validRows,
      batchCount: result.batchCount,
      batchesSucceeded: result.batchesSucceeded,
      batchesFailed: result.batchesFailed,
      batchSize: 200,
      executionTimeMs: result.executionTimeMs,
      errors: result.errors,
      warnings: result.warnings
    })
  } catch (error: any) {
    console.error('Bulk Students Import Error:', error)
    return NextResponse.json(
      { error: error.message || 'An error occurred during student import.' },
      { status: 500 }
    )
  }
}
