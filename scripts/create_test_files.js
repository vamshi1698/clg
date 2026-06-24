const fs = require('fs')
const path = require('path')
const XLSX = require('xlsx')

const scratchDir = path.join(__dirname, '../scratch')
if (!fs.existsSync(scratchDir)) {
  fs.mkdirSync(scratchDir, { recursive: true })
}

// 1. Create a dummy PDF
const pdfPath = path.join(scratchDir, 'test_results_bulletin.pdf')
fs.writeFileSync(pdfPath, '%PDF-1.4\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R >>\nendobj\n4 0 obj\n<< /Length 44 >>\nstream\nBT /F1 24 Tf 100 700 Td (Official Results 2026) Tj ET\nendstream\nendobj\nxref\n0 5\n0000000000 65535 f\n0000000009 00000 n\n0000000056 00000 n\n0000000111 00000 n\n0000000212 00000 n\ntrailer\n<< /Size 5 /Root 1 0 R >>\nstartxref\n307\n%%EOF\n')
console.log('✓ Created test PDF at:', pdfPath)

// 2. Create a dummy Excel sheet for student marks
const excelPath = path.join(scratchDir, 'test_student_marks.xlsx')

const mockData = [
  {
    register_number: 'NCJ2026001',
    name: 'Vamshi Krishna',
    dob: '2001-05-15',
    course_code: 'BCA',
    department_code: 'CS',
    semester: 6,
    academic_year: '2025-2026',
    examination_type: 'Semester End Examination',
    subject_code: 'BCA601',
    subject_name: 'Software Engineering',
    internal_marks: 18,
    external_marks: 55,
    max_marks: 100,
    credits: 4,
    grade: 'A',
    status: 'PASS'
  },
  {
    register_number: 'NCJ2026001',
    name: 'Vamshi Krishna',
    dob: '2001-05-15',
    course_code: 'BCA',
    department_code: 'CS',
    semester: 6,
    academic_year: '2025-2026',
    examination_type: 'Semester End Examination',
    subject_code: 'BCA602',
    subject_name: 'Cloud Computing',
    internal_marks: 19,
    external_marks: 62,
    max_marks: 100,
    credits: 4,
    grade: 'O',
    status: 'PASS'
  },
  {
    register_number: 'NCJ2026002',
    name: 'Rohan Sharma',
    dob: '2002-09-20',
    course_code: 'BCA',
    department_code: 'CS',
    semester: 6,
    academic_year: '2025-2026',
    examination_type: 'Semester End Examination',
    subject_code: 'BCA601',
    subject_name: 'Software Engineering',
    internal_marks: 12,
    external_marks: 25,
    max_marks: 100,
    credits: 4,
    grade: 'F',
    status: 'FAIL'
  }
]

const worksheet = XLSX.utils.json_to_sheet(mockData)
const workbook = XLSX.utils.book_new()
XLSX.utils.book_append_sheet(workbook, worksheet, 'Results')
XLSX.writeFile(workbook, excelPath)

console.log('✓ Created test Excel sheet at:', excelPath)
