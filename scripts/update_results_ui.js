const fs = require('fs');

let content = fs.readFileSync('components/results/results-page.tsx', 'utf-8');

// Replace Interface
content = content.replace(/interface ResultData \{[\s\S]*?\} \| null\n\}/, `interface ResultData {
  student: {
    id: string
    name: string
    register_number: string
    course_name?: string
    department_name?: string
  }
  results: Array<{
    semester: number
    academic_year: string
    subject_code: string
    subject_name: string
    internal_marks: number | null
    external_marks: number | null
    total_marks: number | null
    max_marks: number | null
    theory_max_marks: number | null
    theory_min_marks: number | null
    ia_max_marks: number | null
    ia_min_marks: number | null
    total_min_marks: number | null
    grade_points: number | null
    credit_points: number | null
    grade: string | null
    credits: number | null
    result_status: string | null
  }>
  summary: {
    semester: number
    academic_year: string
    examination_type?: string
    sgpa: number | null
    cgpa: number | null
    total_credits: number | null
    earned_credits: number | null
    total_max_marks: number | null
    total_marks_obtained: number | null
    percentage: number | null
    overall_result: string | null
    class_obtained: string | null
    programme_total_max_marks: number | null
    programme_total_marks_obtained: number | null
    programme_total_credits_obtained: number | null
    programme_cgpa: number | null
    programme_grade: string | null
    total_marks_words: string | null
    programme_total_marks_words: string | null
    result_status: string | null
  } | null
}`);

// Replace render card
const cardRegex = /<CardContent className="p-6 space-y-6 print:p-0">[\s\S]*?<\/CardContent>/;
const newCardContent = `<CardContent className="p-6 space-y-6 print:p-0">
                      {/* Print-Only Header */}
                      <div className="hidden print:flex flex-col items-center justify-center text-center mb-6 pb-2">
                        <div className="flex items-center gap-3 justify-center mb-1">
                          <Image src={logoImage} alt="Logo" width={48} height={48} className="flex-shrink-0" />
                          <div>
                            <p className="text-[10px] text-gray-600 font-medium">The National Education Society of Karnataka (R.)</p>
                            <h1 className="font-display text-2xl font-bold uppercase tracking-wider text-academic-900 leading-none">
                              THE NATIONAL COLLEGE
                            </h1>
                            <p className="text-[11px] font-semibold tracking-widest">AUTONOMOUS</p>
                            <p className="text-[10px] text-gray-700 font-medium uppercase mt-0.5">NAAC ACCREDITED - 'A++' GRADE</p>
                            <p className="text-[10px] text-gray-700">Affiliated to Bangalore University</p>
                            <p className="text-[9px] text-gray-500">36th B Cross, 7th Block, Jayanagar, Bengaluru - 560 070</p>
                          </div>
                        </div>
                        
                        <div className="w-full border-b border-gray-400 my-2"></div>
                        <h2 className="font-display text-xs font-bold uppercase tracking-widest text-academic-900 mt-1 underline">
                          STATEMENT OF MARKS
                        </h2>
                        <h3 className="text-[11px] font-semibold mt-1 uppercase">
                          {result.summary?.semester === 1 ? 'I' : result.summary?.semester === 2 ? 'II' : result.summary?.semester === 3 ? 'III' : result.summary?.semester === 4 ? 'IV' : result.summary?.semester === 5 ? 'V' : result.summary?.semester === 6 ? 'VI' : result.summary?.semester} SEMESTER - {result.summary?.examination_type || 'EXAMINATION'}
                        </h3>
                      </div>

                      {/* Student Info */}
                      <div className="grid grid-cols-2 gap-x-12 gap-y-1 p-4 bg-gray-50 print:bg-white rounded-lg print:rounded-none border border-gray-100 print:border-none print:py-1 print:my-1 text-sm print:text-[11px]">
                        <div className="flex"><span className="w-32 font-semibold">Academic Year</span><span>: {result.summary?.academic_year || '-'}</span></div>
                        <div className="flex"><span className="w-32 font-semibold">Programme Name</span><span className="uppercase font-bold">: {result.student.course_name || '-'}</span></div>
                        <div className="flex"><span className="w-32 font-semibold">Register No.</span><span className="uppercase font-bold">: {result.student.register_number}</span></div>
                        <div className="flex"><span className="w-32 font-semibold">Student Name</span><span className="uppercase font-bold">: {result.student.name}</span></div>
                      </div>

                      {/* Results Table */}
                      {result.results.length > 0 ? (
                        <div className="overflow-x-auto border border-gray-300 rounded-lg print:border-gray-400 print:rounded-none print:my-2">
                          <table className="w-full text-sm print:text-[9px] border-collapse">
                            <thead className="bg-gray-50 print:bg-gray-100 border-b print:border-gray-400 text-academic-900">
                              <tr>
                                <th rowSpan={2} className="border-r print:border-gray-400 px-1 py-1 text-center font-bold w-6">Sl.<br/>No</th>
                                <th rowSpan={2} className="border-r print:border-gray-400 px-2 py-1 text-left font-bold w-20">Subject/Code</th>
                                <th rowSpan={2} className="border-r print:border-gray-400 px-2 py-1 text-left font-bold">Subject/Paper</th>
                                <th colSpan={3} className="border-r border-b print:border-gray-400 px-1 py-1 text-center font-bold">Theory / Practical</th>
                                <th colSpan={3} className="border-r border-b print:border-gray-400 px-1 py-1 text-center font-bold">IA/Viva</th>
                                <th colSpan={3} className="border-r border-b print:border-gray-400 px-1 py-1 text-center font-bold">Total</th>
                                <th rowSpan={2} className="border-r print:border-gray-400 px-1 py-1 text-center font-bold w-6">Cr.</th>
                                <th rowSpan={2} className="border-r print:border-gray-400 px-1 py-1 text-center font-bold w-8">Gr.<br/>Pts.</th>
                                <th rowSpan={2} className="border-r print:border-gray-400 px-1 py-1 text-center font-bold w-8">Cr. Pts.</th>
                                <th rowSpan={2} className="border-r print:border-gray-400 px-1 py-1 text-center font-bold w-10">Letter<br/>Grade</th>
                                <th rowSpan={2} className="px-2 py-1 text-center font-bold w-12">Remarks</th>
                              </tr>
                              <tr>
                                <th className="border-r print:border-gray-400 px-1 py-1 text-center font-medium">Max.<br/>Marks</th>
                                <th className="border-r print:border-gray-400 px-1 py-1 text-center font-medium">Min.<br/>Marks</th>
                                <th className="border-r print:border-gray-400 px-1 py-1 text-center font-medium">Marks<br/>Scored</th>
                                <th className="border-r print:border-gray-400 px-1 py-1 text-center font-medium">Max.<br/>Marks</th>
                                <th className="border-r print:border-gray-400 px-1 py-1 text-center font-medium">Min.<br/>Marks</th>
                                <th className="border-r print:border-gray-400 px-1 py-1 text-center font-medium">Marks<br/>Scored</th>
                                <th className="border-r print:border-gray-400 px-1 py-1 text-center font-medium">Max.<br/>Marks</th>
                                <th className="border-r print:border-gray-400 px-1 py-1 text-center font-medium">Min.<br/>Marks</th>
                                <th className="border-r print:border-gray-400 px-1 py-1 text-center font-medium">Marks<br/>Scored</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y print:divide-gray-400 font-medium">
                              {result.results.map((r, i) => (
                                <tr key={i} className="hover:bg-gray-50/50">
                                  <td className="border-r print:border-gray-400 px-1 py-1 text-center">{i + 1}</td>
                                  <td className="border-r print:border-gray-400 px-2 py-1 uppercase">{r.subject_code}</td>
                                  <td className="border-r print:border-gray-400 px-2 py-1 uppercase">{r.subject_name}</td>
                                  <td className="border-r print:border-gray-400 px-1 py-1 text-center">{r.theory_max_marks ?? 60}</td>
                                  <td className="border-r print:border-gray-400 px-1 py-1 text-center">{r.theory_min_marks ?? 21}</td>
                                  <td className="border-r print:border-gray-400 px-1 py-1 text-center font-bold">{r.external_marks ?? '-'}</td>
                                  <td className="border-r print:border-gray-400 px-1 py-1 text-center">{r.ia_max_marks ?? 40}</td>
                                  <td className="border-r print:border-gray-400 px-1 py-1 text-center">{r.ia_min_marks ?? 14}</td>
                                  <td className="border-r print:border-gray-400 px-1 py-1 text-center font-bold">{r.internal_marks ?? '-'}</td>
                                  <td className="border-r print:border-gray-400 px-1 py-1 text-center">{r.max_marks ?? 100}</td>
                                  <td className="border-r print:border-gray-400 px-1 py-1 text-center">{r.total_min_marks ?? 35}</td>
                                  <td className="border-r print:border-gray-400 px-1 py-1 text-center font-bold">{r.total_marks ?? '-'}</td>
                                  <td className="border-r print:border-gray-400 px-1 py-1 text-center">{r.credits ?? '-'}</td>
                                  <td className="border-r print:border-gray-400 px-1 py-1 text-center">{r.grade_points != null ? Number(r.grade_points).toFixed(2) : '-'}</td>
                                  <td className="border-r print:border-gray-400 px-1 py-1 text-center font-bold">{r.credit_points != null ? Number(r.credit_points).toFixed(2) : '-'}</td>
                                  <td className="border-r print:border-gray-400 px-1 py-1 text-center font-bold">{r.grade || '-'}</td>
                                  <td className="px-2 py-1 text-center uppercase">{r.result_status || '-'}</td>
                                </tr>
                              ))}
                              {/* Grand Total Row */}
                              <tr className="bg-gray-50 print:bg-gray-100 font-bold border-t-2 print:border-gray-400">
                                <td colSpan={11} className="border-r print:border-gray-400 px-2 py-1 text-left">Grand Total</td>
                                <td className="border-r print:border-gray-400 px-1 py-1 text-center">{result.summary?.total_marks_obtained || '-'}</td>
                                <td className="border-r print:border-gray-400 px-1 py-1 text-center">{result.summary?.earned_credits || '-'}</td>
                                <td className="border-r print:border-gray-400 px-1 py-1 text-center bg-gray-200 print:bg-gray-200"></td>
                                <td className="border-r print:border-gray-400 px-1 py-1 text-center">{result.results.reduce((acc, curr) => acc + (curr.credit_points || 0), 0).toFixed(2)}</td>
                                <td colSpan={2} className="px-2 py-1 text-center bg-gray-200 print:bg-gray-200"></td>
                              </tr>
                            </tbody>
                          </table>
                          <div className="flex justify-between items-center border-t print:border-gray-400 bg-gray-50 print:bg-gray-100 px-2 py-1 text-sm print:text-[10px] font-bold">
                            <div>Total Marks Secured in Words: <span className="font-normal">{result.summary?.total_marks_words || '-'}</span></div>
                            <div className="flex gap-6">
                              <div>Percentage: <span className="font-normal">{result.summary?.percentage != null ? Number(result.summary.percentage).toFixed(2) : '-'}</span></div>
                              <div>SGPA: <span className="font-normal">{result.summary?.sgpa != null ? Number(result.summary.sgpa).toFixed(2) : '-'}</span></div>
                              <div>Grade: <span className="font-normal">{result.summary?.programme_grade || '-'}</span></div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                          <p>No results details available yet.</p>
                        </div>
                      )}

                      {/* Semester-Wise Result Table */}
                      <div className="overflow-x-auto border border-gray-300 rounded-lg print:border-gray-400 print:rounded-none mt-2">
                          <table className="w-full text-sm print:text-[9px] border-collapse">
                            <thead className="bg-gray-50 print:bg-gray-100 border-b print:border-gray-400 text-academic-900">
                              <tr>
                                <th className="border-r print:border-gray-400 px-2 py-1 text-left font-bold w-24">Semester-Wise Result</th>
                                <th className="border-r print:border-gray-400 px-1 py-1 text-center font-bold">I</th>
                                <th className="border-r print:border-gray-400 px-1 py-1 text-center font-bold">II</th>
                                <th className="border-r print:border-gray-400 px-1 py-1 text-center font-bold">III</th>
                                <th className="border-r print:border-gray-400 px-1 py-1 text-center font-bold">IV</th>
                                <th className="border-r print:border-gray-400 px-1 py-1 text-center font-bold">V</th>
                                <th className="border-r print:border-gray-400 px-1 py-1 text-center font-bold">VI</th>
                                <th className="px-2 py-1 text-center font-bold bg-gray-200 print:bg-gray-200 w-32">Programme Total</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y print:divide-gray-400 font-medium">
                              <tr>
                                <td className="border-r print:border-gray-400 px-2 py-1 font-semibold">Maximum Marks</td>
                                <td className="border-r print:border-gray-400 px-1 py-1 text-center">-</td>
                                <td className="border-r print:border-gray-400 px-1 py-1 text-center">-</td>
                                <td className="border-r print:border-gray-400 px-1 py-1 text-center">-</td>
                                <td className="border-r print:border-gray-400 px-1 py-1 text-center">-</td>
                                <td className="border-r print:border-gray-400 px-1 py-1 text-center">-</td>
                                <td className="border-r print:border-gray-400 px-1 py-1 text-center">{result.summary?.total_max_marks || '-'}</td>
                                <td className="px-2 py-1 text-center font-bold bg-gray-100 print:bg-gray-100">{result.summary?.programme_total_max_marks || '-'}</td>
                              </tr>
                              <tr>
                                <td className="border-r print:border-gray-400 px-2 py-1 font-semibold">Marks Obtained</td>
                                <td className="border-r print:border-gray-400 px-1 py-1 text-center">-</td>
                                <td className="border-r print:border-gray-400 px-1 py-1 text-center">-</td>
                                <td className="border-r print:border-gray-400 px-1 py-1 text-center">-</td>
                                <td className="border-r print:border-gray-400 px-1 py-1 text-center">-</td>
                                <td className="border-r print:border-gray-400 px-1 py-1 text-center">-</td>
                                <td className="border-r print:border-gray-400 px-1 py-1 text-center">{result.summary?.total_marks_obtained || '-'}</td>
                                <td className="px-2 py-1 text-center font-bold bg-gray-100 print:bg-gray-100">{result.summary?.programme_total_marks_obtained || '-'}</td>
                              </tr>
                              <tr>
                                <td className="border-r print:border-gray-400 px-2 py-1 font-semibold">Credits Obtained</td>
                                <td className="border-r print:border-gray-400 px-1 py-1 text-center">-</td>
                                <td className="border-r print:border-gray-400 px-1 py-1 text-center">-</td>
                                <td className="border-r print:border-gray-400 px-1 py-1 text-center">-</td>
                                <td className="border-r print:border-gray-400 px-1 py-1 text-center">-</td>
                                <td className="border-r print:border-gray-400 px-1 py-1 text-center">-</td>
                                <td className="border-r print:border-gray-400 px-1 py-1 text-center">{result.summary?.earned_credits || '-'}</td>
                                <td className="px-2 py-1 text-center font-bold bg-gray-100 print:bg-gray-100">{result.summary?.programme_total_credits_obtained || '-'}</td>
                              </tr>
                              <tr>
                                <td className="border-r print:border-gray-400 px-2 py-1 font-semibold">SGPA</td>
                                <td className="border-r print:border-gray-400 px-1 py-1 text-center">-</td>
                                <td className="border-r print:border-gray-400 px-1 py-1 text-center">-</td>
                                <td className="border-r print:border-gray-400 px-1 py-1 text-center">-</td>
                                <td className="border-r print:border-gray-400 px-1 py-1 text-center">-</td>
                                <td className="border-r print:border-gray-400 px-1 py-1 text-center">-</td>
                                <td className="border-r print:border-gray-400 px-1 py-1 text-center">{result.summary?.sgpa != null ? Number(result.summary.sgpa).toFixed(2) : '-'}</td>
                                <td className="px-2 py-1 text-center font-bold bg-gray-100 print:bg-gray-100">Programme CGPA : {result.summary?.programme_cgpa != null ? Number(result.summary.programme_cgpa).toFixed(2) : '-'}</td>
                              </tr>
                              <tr>
                                <td className="border-r print:border-gray-400 px-2 py-1 font-semibold">Grade</td>
                                <td className="border-r print:border-gray-400 px-1 py-1 text-center">-</td>
                                <td className="border-r print:border-gray-400 px-1 py-1 text-center">-</td>
                                <td className="border-r print:border-gray-400 px-1 py-1 text-center">-</td>
                                <td className="border-r print:border-gray-400 px-1 py-1 text-center">-</td>
                                <td className="border-r print:border-gray-400 px-1 py-1 text-center">-</td>
                                <td className="border-r print:border-gray-400 px-1 py-1 text-center">-</td>
                                <td className="px-2 py-1 text-center font-bold bg-gray-100 print:bg-gray-100">Programme Grade : {result.summary?.programme_grade || '-'}</td>
                              </tr>
                              <tr>
                                <td className="border-r print:border-gray-400 px-2 py-1 font-semibold">Year of Pass</td>
                                <td className="border-r print:border-gray-400 px-1 py-1 text-center">-</td>
                                <td className="border-r print:border-gray-400 px-1 py-1 text-center">-</td>
                                <td className="border-r print:border-gray-400 px-1 py-1 text-center">-</td>
                                <td className="border-r print:border-gray-400 px-1 py-1 text-center">-</td>
                                <td className="border-r print:border-gray-400 px-1 py-1 text-center">-</td>
                                <td className="border-r print:border-gray-400 px-1 py-1 text-center">{result.summary?.academic_year?.split('-')[1] || '-'}</td>
                                <td className="px-2 py-1 text-center font-bold bg-gray-100 print:bg-gray-100">{result.summary?.academic_year?.split('-')[1] || '-'}</td>
                              </tr>
                            </tbody>
                          </table>
                      </div>

                      {/* Final Footer Row */}
                      <div className="border border-gray-400 p-1 flex justify-between items-center text-sm print:text-[10px] font-bold mt-2">
                        <div>Marks Secured in Words : <span className="font-normal">{result.summary?.programme_total_marks_words || '-'}</span></div>
                        <div className="flex gap-6">
                          <div className="border-l border-gray-400 pl-2">Overall Percentage : <span className="font-normal">{result.summary?.percentage != null ? Number(result.summary.percentage).toFixed(2) : '-'}</span></div>
                          <div className="border-l border-gray-400 pl-2">Overall Result : <span className="font-normal uppercase">{result.summary?.overall_result || '-'}</span></div>
                          <div className="border-l border-gray-400 pl-2">Class : <span className="font-normal uppercase">{result.summary?.class_obtained || '-'}</span></div>
                        </div>
                      </div>

                      {/* Print-Only Signature & Verification Block */}
                      <div className="hidden print:grid grid-cols-3 gap-4 pt-12 mt-2 text-[11px] justify-items-center w-full">
                        <div className="flex flex-col items-center justify-end h-16 w-32 relative">
                          <div className="absolute -top-4 w-20 h-20 border-2 border-academic-900 rounded-full flex items-center justify-center opacity-30 pointer-events-none transform -rotate-12">
                            <span className="text-center text-[7px] leading-tight font-bold text-academic-900">THE NATIONAL COLLEGE<br/>AUTONOMOUS</span>
                          </div>
                        </div>
                        <div className="flex flex-col items-center justify-end h-16">
                          <div className="border-t border-gray-800 w-32 text-center pt-1 font-bold text-academic-900">
                            Principal
                          </div>
                        </div>
                        <div className="flex flex-col items-center justify-end h-16">
                          <div className="border-t border-gray-800 w-40 text-center pt-1 font-bold text-academic-900">
                            Controller of Examinations
                          </div>
                        </div>
                        
                        <div className="col-span-3 text-left w-full text-[9px] font-bold text-gray-700 mt-2">
                          M.C.No : -<br/>
                          Printed Date : {new Date().toLocaleDateString('en-GB')}
                        </div>
                      </div>

                      {/* Print Actions */}
                      <div className="flex justify-end gap-4 print:hidden">
                        <Button onClick={handlePrint} className="bg-academic-950 text-white hover:bg-academic-900 font-semibold rounded-xl">
                          <Printer className="h-4 w-4 mr-2" />
                          Print Result Sheet
                        </Button>
                      </div>
                    </CardContent>`;
                    
content = content.replace(cardRegex, newCardContent);

fs.writeFileSync('components/results/results-page.tsx', content);
console.log('updated');
