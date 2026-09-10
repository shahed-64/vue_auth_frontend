<template>
  <div class="result-landscape-page py-4">
    <!-- ================= ACTION BUTTONS ================= -->
    <div
      v-if="resultData"
      class="container-fluid px-4 mb-3 action-buttons-wrapper"
      style="max-width: 1400px"
    >
      <div class="d-flex justify-content-end gap-2">
        <button type="button" class="btn btn-outline-secondary action-btn" @click="printResult">
          <i class="bi bi-printer me-2"></i>
          Print
        </button>

        <button
          type="button"
          class="btn btn-primary action-btn"
          :disabled="downloading"
          @click="downloadPdf"
        >
          <span
            v-if="downloading"
            class="spinner-border spinner-border-sm me-2"
            role="status"
          ></span>

          <i v-else class="bi bi-file-earmark-pdf me-2"></i>

          {{ downloading ? 'Generating PDF...' : 'Download PDF' }}
        </button>
      </div>
    </div>

    <!-- ================= PDF / PRINT AREA ================= -->
    <div ref="resultPdf" class="container-fluid px-4" style="max-width: 1400px">
      <!-- Loading -->
      <div v-if="loading" class="d-flex justify-content-center align-items-center py-5">
        <div class="text-center">
          <div class="spinner-border text-primary mb-3" role="status"></div>

          <p class="text-muted mb-0">Loading final result...</p>
        </div>
      </div>

      <!-- Error -->
      <div v-else-if="errorMessage" class="alert alert-danger shadow-sm">
        <i class="bi bi-exclamation-triangle me-2"></i>

        {{ errorMessage }}
      </div>

      <!-- Result -->
      <div v-else-if="resultData" class="card result-card border-0 shadow-lg">
        <!-- ===================================================== -->
        <!-- SCHOOL HEADER -->
        <!-- ===================================================== -->

        <div class="card-header school-header text-center py-3 bg-white border-bottom">
          <div class="row align-items-center">
            <div class="col-2 text-start ps-4"></div>

            <div class="col-8">
              <h3 class="fw-bold text-navy mb-0">
                {{ instituteName }}
              </h3>

              <p v-if="instituteAddress" class="text-muted small mb-0 fw-semibold">
                {{ instituteAddress }}
              </p>

              <p v-if="instituteContact" class="text-muted tiny mb-0">
                {{ instituteContact }}
              </p>
            </div>

            <div class="col-2 text-end pe-4">
              <span class="text-muted tiny d-block"> Publication Date: </span>

              <strong class="small text-dark">
                {{ publicationDate }}
              </strong>
            </div>
          </div>

          <div class="mt-2">
            <h5
              class="fw-bold text-uppercase text-secondary tracking-wide d-inline-block border-bottom border-2 pb-1 px-4 mb-0"
            >
              STUDENT RESULT CARD - {{ selectedYear }}
            </h5>
          </div>
        </div>

        <!-- ===================================================== -->
        <!-- CARD BODY -->
        <!-- ===================================================== -->

        <div class="card-body p-4">
          <!-- =================================================== -->
          <!-- STUDENT INFO -->
          <!-- =================================================== -->

          <div class="student-info-bar p-3 mb-4 rounded-3 border bg-light-subtle shadow-sm">
            <div class="row align-items-center g-3">
              <!-- Student Photo -->

              <div class="col-auto">
                <div
                  class="student-photo-sm bg-white border d-flex align-items-center justify-content-center rounded shadow-sm overflow-hidden"
                >
                  <!--
                    IMPORTANT:
                    Existing project uses getImageUrl(item).
                    So here we pass the complete student object.
                  -->

                  <img
                    v-if="student.image"
                    :src="getImageUrl(student)"
                    class="student-photo-image"
                    alt="Student Photo"
                  />

                  <div v-else class="text-center text-muted">
                    <i class="bi bi-person-fill fs-3 text-secondary"></i>

                    <small class="tiny d-block"> Photo </small>
                  </div>
                </div>
              </div>

              <!-- Student Information -->
              <div class="col">
                <div class="row row-cols-2 row-cols-lg-4 g-2 text-dark small font-monospace-custom">
                  <!-- Row 1 -->

                  <div>
                    <span class="text-secondary fw-semibold"> Name: </span>

                    <strong class="text-dark ms-1">
                      {{ student.name || '-' }}
                    </strong>
                  </div>

                  <div>
                    <span class="text-secondary fw-semibold"> Student ID: </span>

                    <span class="ms-1">
                      {{ student.studentId || '-' }}
                    </span>
                  </div>

                  <div>
                    <span class="text-secondary fw-semibold"> Shift: </span>

                    <span class="ms-1">
                      {{ student.shift || '-' }}
                    </span>
                  </div>

                  <div>
                    <span class="text-secondary fw-semibold"> Class: </span>

                    <span class="ms-1">
                      {{ student.class || '-' }}
                    </span>
                  </div>

                  <!-- Row 2 -->

                  <div>
                    <span class="text-secondary fw-semibold"> Group: </span>

                    <span class="ms-1">
                      {{ student.group || '-' }}
                    </span>
                  </div>

                  <div>
                    <span class="text-secondary fw-semibold"> Section: </span>

                    <span class="ms-1">
                      {{ student.section || '-' }}
                    </span>
                  </div>

                  <div>
                    <span class="text-secondary fw-semibold"> Roll: </span>

                    <span class="ms-1">
                      {{ student.roll || '-' }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- =================================================== -->
          <!-- MARKS TABLE -->
          <!-- =================================================== -->

          <div v-if="processedSubjects.length" class="table-responsive mb-4 shadow-sm rounded-3">
            <table
              class="table table-bordered custom-result-table align-middle text-center mb-0 bg-white"
            >
              <!-- ================= HEADER ================= -->

              <thead>
                <tr class="table-header-custom">
                  <th rowspan="2" class="align-middle text-start ps-3" style="min-width: 240px">
                    Subject Name
                  </th>

                  <th rowspan="2" class="align-middle" style="min-width: 90px">Full Marks</th>

                  <!-- Dynamic Exams -->

                  <th v-for="exam in exams" :key="exam.id" colspan="1" style="min-width: 125px">
                    {{ exam.name }}
                  </th>

                  <th rowspan="2" class="align-middle" style="min-width: 110px">Obtained Total</th>

                  <th rowspan="2" class="align-middle" style="min-width: 100px">Letter Grade</th>

                  <th rowspan="2" class="align-middle" style="min-width: 90px">Grade Point</th>

                  <th rowspan="2" class="align-middle bg-gpa-head" style="min-width: 100px">
                    G.P.A
                  </th>
                </tr>

                <!-- Dynamic Exam Percentage -->

                <tr class="table-header-sub">
                  <th v-for="exam in exams" :key="`percentage-${exam.id}`">
                    {{ formatPercentage(exam.percentage) }}
                  </th>
                </tr>
              </thead>

              <!-- ================= BODY ================= -->

              <tbody>
                <tr
                  v-for="(subject, index) in processedSubjects"
                  :key="subject.id || index"
                  class="table-row-hover"
                >
                  <!-- Subject -->

                  <td class="text-start ps-3 fw-semibold text-dark">
                    {{ subject.name }}
                  </td>

                  <!-- Full Marks -->

                  <td>
                    {{ displayFullMark(subject) }}
                  </td>

                  <!-- Dynamic Exam Marks -->

                  <td v-for="exam in exams" :key="`${subject.id}-${exam.id}`">
                    {{ getExamMarks(subject, exam.id) }}
                  </td>

                  <!-- Final Weighted Total -->

                  <td class="fw-bold text-primary">
                    {{ subject.obtainedTotal }}
                  </td>

                  <!-- Grade -->

                  <td>
                    <span
                      class="badge grade-badge px-2 py-1"
                      :class="getBadgeClass(subject.letterGrade)"
                    >
                      {{ subject.letterGrade }}
                    </span>
                  </td>

                  <!-- Point -->

                  <td class="fw-semibold">
                    {{ subject.gradePoint }}
                  </td>

                  <!-- GPA -->

                  <td
                    v-if="index === 0"
                    :rowspan="processedSubjects.length"
                    class="align-middle gpa-cell bg-light"
                  >
                    <div class="gpa-box py-3">
                      <span class="gpa-value text-success display-6 fw-bold">
                        {{ overallGPA }}
                      </span>

                      <small class="text-muted tiny d-block mt-1 uppercase"> Final GPA </small>
                    </div>
                  </td>
                </tr>
              </tbody>

              <!-- ================= FOOTER ================= -->

              <tfoot>
                <tr class="table-footer-row fw-bold">
                  <td :colspan="2 + exams.length" class="text-end pe-3 text-secondary">
                    Total Weighted Score:
                  </td>

                  <td colspan="4" class="text-start ps-3 text-dark fs-6">
                    {{ totalObtainedMarks }}

                    <span class="text-muted fw-normal small">
                      (Calculated via Percentage Weight)
                    </span>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          <!-- No Subjects -->

          <div v-else class="alert alert-warning text-center">
            <i class="bi bi-info-circle me-2"></i>

            No result subjects were found for this student.
          </div>

          <!-- =================================================== -->
          <!-- SIGNATURES -->
          <!-- =================================================== -->

          <div class="row text-center g-4 mt-4 pt-3 border-top">
            <div class="col-4">
              <div class="signature-area px-3">
                <div class="signature-space mb-2"></div>

                <div class="border-top border-dark w-100 mx-auto pt-2">
                  <p class="fw-semibold mb-0 small text-dark">
                    Class Teacher's Remarks & Signature
                  </p>
                </div>
              </div>
            </div>

            <div class="col-4">
              <div class="signature-area px-3">
                <div class="signature-space mb-2"></div>

                <div class="border-top border-dark w-100 mx-auto pt-2">
                  <p class="fw-semibold mb-0 small text-dark">Assistant Head Teacher</p>

                  <small class="text-muted tiny"> Shift in-Charge </small>
                </div>
              </div>
            </div>

            <div class="col-4">
              <div class="signature-area px-3">
                <div class="signature-space mb-2"></div>

                <div class="border-top border-dark w-100 mx-auto pt-2">
                  <p class="fw-semibold mb-0 small text-dark">Head Teacher / Headmaster</p>

                  <small class="text-muted tiny"> Authorized Signature </small>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- ===================================================== -->
        <!-- FOOTER -->
        <!-- ===================================================== -->

        <div
          class="card-footer bg-light text-muted d-flex justify-content-between align-items-center py-2 px-4 small border-top"
        >
          <span>
            Software developed by:
            {{ softwareDeveloper }}
          </span>

          <span>
            Prepared by:
            {{ preparedBy }}
          </span>

          <span>
            Print Date:
            {{ printDate }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import api from '@/services/api'
import { getImageUrl } from '@/utils/img'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

/**
 * |--------------------------------------------------------------------------
 * | Route
 * |--------------------------------------------------------------------------
 */

const route = useRoute()

/**
 * |--------------------------------------------------------------------------
 * | State
 * |--------------------------------------------------------------------------
 */

const loading = ref(true)
const errorMessage = ref('')
const resultData = ref(null)
const student = ref({})
const exams = ref([])
const subjects = ref([])
const resultPdf = ref(null)
const downloading = ref(false)

/**
 * |--------------------------------------------------------------------------
 * | Year & Student
 * |--------------------------------------------------------------------------
 */

const selectedYear = computed(() => {
  return route.query.year || ''
})

const selectedStudentId = computed(() => {
  return route.query.student_id || ''
})

/**
 * |--------------------------------------------------------------------------
 * | Institute / Footer Information
 * |--------------------------------------------------------------------------
 */

const instituteName = ref('Institute Name')
const instituteAddress = ref('')
const instituteContact = ref('')
const softwareDeveloper = ref('ADDIE Soft Ltd.')
const preparedBy = ref('IT Section')

/**
 * |--------------------------------------------------------------------------
 * | Dates
 * |--------------------------------------------------------------------------
 */

const currentDate = new Date()

const formatDate = (date) => {
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()

  return `${day}-${month}-${year}`
}

const publicationDate = computed(() => {
  return formatDate(currentDate)
})

const printDate = computed(() => {
  return formatDate(currentDate)
})

/**
 * |--------------------------------------------------------------------------
 * | Load Institute Information
 * |--------------------------------------------------------------------------
 */

const loadInstituteInfo = async () => {
  try {
    const response = await api.get('/institute-info')

    if (!response.data?.success) {
      return
    }

    const data = response.data?.data

    if (!data) {
      return
    }

    instituteName.value = data.institute_name || 'Institute Name'

    instituteAddress.value = data.location || ''

    const contactParts = []

    if (data.contact) {
      contactParts.push(`Contact: ${data.contact}`)
    }

    if (data.email) {
      contactParts.push(`Email: ${data.email}`)
    }

    instituteContact.value = contactParts.join(' | ')
  } catch (error) {
    console.error('Institute information loading error:', error)
  }
}

/**
 * |--------------------------------------------------------------------------
 * | Load Final Result
 * |--------------------------------------------------------------------------
 */

const loadFinalResult = async () => {
  loading.value = true
  errorMessage.value = ''

  try {
    if (!selectedYear.value) {
      throw new Error('Examination year is missing.')
    }

    if (!selectedStudentId.value) {
      throw new Error('Student ID is missing.')
    }

    const response = await api.get(`/final-results/student/${selectedStudentId.value}`, {
      params: {
        year: selectedYear.value,
      },
    })

    if (!response.data?.status) {
      throw new Error(response.data?.message || 'Unable to load final result.')
    }

    resultData.value = response.data

    /**
     * |--------------------------------------------------------------------------
     * | Student
     * |--------------------------------------------------------------------------
     */

    student.value = response.data.student || {}

    /**
     * |--------------------------------------------------------------------------
     * | Make backend student_id available as studentId
     * |--------------------------------------------------------------------------
     */

    if (!student.value.studentId && student.value.student_id) {
      student.value.studentId = student.value.student_id
    }

    /**
     * |--------------------------------------------------------------------------
     * | Exams
     * |--------------------------------------------------------------------------
     */

    exams.value = response.data.exams || []

    /**
     * |--------------------------------------------------------------------------
     * | Subjects
     * |--------------------------------------------------------------------------
     */

    subjects.value = response.data.subjects || []
  } catch (error) {
    console.error('Final result loading error:', error)

    errorMessage.value =
      error.response?.data?.message || error.message || 'Failed to load final result.'
  } finally {
    loading.value = false
  }
}

/**
 * |--------------------------------------------------------------------------
 * | Processed Subjects
 * |--------------------------------------------------------------------------
 */

const processedSubjects = computed(() => {
  return subjects.value.map((subject) => {
    const obtainedTotal = Number(subject.obtained_total ?? 0)

    const gradeInfo = calculateGradeAndPoint(obtainedTotal)

    return {
      ...subject,

      obtainedTotal: obtainedTotal.toFixed(2),

      letterGrade: subject.letter_grade || gradeInfo.grade,

      gradePoint:
        subject.grade_point !== undefined
          ? Number(subject.grade_point).toFixed(2)
          : gradeInfo.point.toFixed(2),
    }
  })
})

/**
 * |--------------------------------------------------------------------------
 * | Overall GPA
 * |--------------------------------------------------------------------------
 */

const overallGPA = computed(() => {
  /**
   * |--------------------------------------------------------------------------
   * | Prefer backend GPA
   * |--------------------------------------------------------------------------
   */

  if (resultData.value?.overall_gpa !== undefined && resultData.value?.overall_gpa !== null) {
    return Number(resultData.value.overall_gpa).toFixed(2)
  }

  /**
   * |--------------------------------------------------------------------------
   * | Fallback Frontend Calculation
   * |--------------------------------------------------------------------------
   */

  const validSubjects = processedSubjects.value.filter(
    (subject) => subject.gradePoint !== '-' && subject.letterGrade !== 'F',
  )

  if (!validSubjects.length) {
    return '0.00'
  }

  const totalPoint = validSubjects.reduce((sum, subject) => sum + Number(subject.gradePoint), 0)

  const gpa = totalPoint / validSubjects.length

  return Math.min(5, gpa).toFixed(2)
})

/**
 * |--------------------------------------------------------------------------
 * | Total Weighted Marks
 * |--------------------------------------------------------------------------
 */

const totalObtainedMarks = computed(() => {
  const total = processedSubjects.value.reduce((sum, subject) => {
    const value = Number(subject.obtainedTotal)

    return sum + (Number.isFinite(value) ? value : 0)
  }, 0)

  return total.toFixed(2)
})

/**
 * |--------------------------------------------------------------------------
 * | Display Full Mark
 * |--------------------------------------------------------------------------
 */

const displayFullMark = (subject) => {
  if (subject.full_mark !== undefined && subject.full_mark !== null) {
    return subject.full_mark
  }

  /**
   * |--------------------------------------------------------------------------
   * | Find largest full mark from exams
   * |--------------------------------------------------------------------------
   */

  const marks = exams.value
    .map((exam) => {
      return subject.exams?.[exam.id]?.full_mark
    })
    .filter((value) => value !== null && value !== undefined)
    .map(Number)

  if (!marks.length) {
    return '-'
  }

  return Math.max(...marks)
}

/**
 * |--------------------------------------------------------------------------
 * | Get Exam Marks
 * |--------------------------------------------------------------------------
 */

const getExamMarks = (subject, examId) => {
  const examData = subject.exams?.[examId]

  if (!examData) {
    return '-'
  }

  if (examData.marks === null || examData.marks === undefined) {
    return '-'
  }

  return examData.marks
}

/**
 * |--------------------------------------------------------------------------
 * | Format Percentage
 * |--------------------------------------------------------------------------
 */

const formatPercentage = (percentage) => {
  const value = Number(percentage)

  if (!Number.isFinite(value)) {
    return '0%'
  }

  return `${value}%`
}

/**
 * |--------------------------------------------------------------------------
 * | Grade Calculation
 * |--------------------------------------------------------------------------
 */

const calculateGradeAndPoint = (marks) => {
  const percentage = Number(marks)

  if (percentage >= 80) {
    return {
      grade: 'A+',
      point: 5.0,
    }
  }

  if (percentage >= 70) {
    return {
      grade: 'A',
      point: 4.0,
    }
  }

  if (percentage >= 60) {
    return {
      grade: 'A-',
      point: 3.5,
    }
  }

  if (percentage >= 50) {
    return {
      grade: 'B',
      point: 3.0,
    }
  }

  if (percentage >= 40) {
    return {
      grade: 'C',
      point: 2.0,
    }
  }

  if (percentage >= 33) {
    return {
      grade: 'D',
      point: 1.0,
    }
  }

  return {
    grade: 'F',
    point: 0.0,
  }
}

/**
 * |--------------------------------------------------------------------------
 * | Grade Badge
 * |--------------------------------------------------------------------------
 */

const getBadgeClass = (grade) => {
  if (grade === 'A+' || grade === 'A') {
    return 'bg-success'
  }

  if (grade === 'A-' || grade === 'B') {
    return 'bg-primary'
  }

  if (grade === 'C' || grade === 'D') {
    return 'bg-warning text-dark'
  }

  return 'bg-danger'
}

/**
 * |--------------------------------------------------------------------------
 * | Print Result
 * |--------------------------------------------------------------------------
 */

const printResult = () => {
  window.print()
}

/**
 * |--------------------------------------------------------------------------
 * | Download PDF
 * |--------------------------------------------------------------------------
 */

const downloadPdf = async () => {
  if (!resultPdf.value) {
    return
  }

  downloading.value = true

  try {
    /**
     * |--------------------------------------------------------------------------
     * | Give browser time to finish rendering
     * |--------------------------------------------------------------------------
     */

    await new Promise((resolve) => {
      setTimeout(resolve, 300)
    })

    const element = resultPdf.value

    /**
     * |--------------------------------------------------------------------------
     * | Generate Canvas
     * |--------------------------------------------------------------------------
     */

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: false,
      backgroundColor: '#ffffff',
      logging: false,
      windowWidth: element.scrollWidth,
    })

    const imageData = canvas.toDataURL('image/jpeg', 0.95)

    /**
     * |--------------------------------------------------------------------------
     * | Create A4 Landscape PDF
     * |--------------------------------------------------------------------------
     */

    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4',
    })

    const pageWidth = pdf.internal.pageSize.getWidth()

    const pageHeight = pdf.internal.pageSize.getHeight()

    /**
     * |--------------------------------------------------------------------------
     * | Calculate PDF Image Size
     * |--------------------------------------------------------------------------
     */

    const margin = 5

    const imageWidth = pageWidth - margin * 2

    const imageHeight = (canvas.height * imageWidth) / canvas.width

    /**
     * |--------------------------------------------------------------------------
     * | Keep Result Centered
     * |--------------------------------------------------------------------------
     */

    let positionY = (pageHeight - imageHeight) / 2

    if (positionY < margin) {
      positionY = margin
    }

    /**
     * |--------------------------------------------------------------------------
     * | Add Result Image
     * |--------------------------------------------------------------------------
     */

    pdf.addImage(imageData, 'JPEG', margin, positionY, imageWidth, imageHeight)

    /**
     * |--------------------------------------------------------------------------
     * | PDF File Name
     * |--------------------------------------------------------------------------
     */

    const safeStudentId = String(
      student.value.studentId || student.value.student_id || selectedStudentId.value || 'student',
    ).replace(/[^a-zA-Z0-9-_]/g, '-')

    const safeYear = String(selectedYear.value || 'year').replace(/[^a-zA-Z0-9-_]/g, '-')

    const fileName = `Final-Result-${safeStudentId}-${safeYear}.pdf`

    /**
     * |--------------------------------------------------------------------------
     * | Download
     * |--------------------------------------------------------------------------
     */

    pdf.save(fileName)
  } catch (error) {
    console.error('PDF generation error:', error)

    alert('Unable to generate PDF. Please try again.')
  } finally {
    downloading.value = false
  }
}

/**
 * |--------------------------------------------------------------------------
 * | Mounted
 * |--------------------------------------------------------------------------
 */

onMounted(async () => {
  await Promise.all([loadInstituteInfo(), loadFinalResult()])
})
</script>

<style scoped>
.result-landscape-page {
  background-color: #f1f5f9;
  min-height: 100vh;
  font-family: 'Inter', 'Segoe UI', Tahoma, sans-serif;
}

.result-card {
  background: #ffffff;
  border-radius: 14px;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.08) !important;
  overflow: hidden;
}

.text-navy {
  color: #0f172a;
}

.tiny {
  font-size: 0.75rem;
}

.student-info-bar {
  background-color: #f8fafc;
  border: 1px solid #e2e8f0 !important;
}

.student-photo-sm {
  width: 75px;
  height: 90px;
  border-radius: 6px;
  flex-shrink: 0;
}

.student-photo-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.custom-result-table {
  font-size: 0.88rem;
  border-color: #e2e8f0 !important;
}

.table-header-custom {
  background-color: #0f172a !important;
  color: #ffffff;
}

.table-header-sub {
  background-color: #1e293b !important;
  color: #f8fafc !important;
  font-size: 0.8rem;
}

.custom-result-table th,
.custom-result-table td {
  padding: 10px 8px;
  vertical-align: middle;
}

.table-row-hover:hover {
  background-color: #f8fafc !important;
}

.grade-badge {
  font-weight: 600;
  font-size: 0.8rem;
}

.gpa-cell {
  background-color: #f8fafc !important;
  border-left: 2px solid #cbd5e1 !important;
}

.bg-gpa-head {
  background-color: #1d4ed8 !important;
}

.gpa-box {
  min-width: 80px;
}

.gpa-value {
  line-height: 1;
}

.table-footer-row {
  background-color: #f1f5f9 !important;
}

.signature-space {
  height: 35px;
}

.tracking-wide {
  letter-spacing: 0.08em;
}

.uppercase {
  text-transform: uppercase;
}

.font-monospace-custom {
  font-family: 'Segoe UI', Tahoma, sans-serif;
}

.school-header {
  min-height: 125px;
}

/**
 * |--------------------------------------------------------------------------
 * | Action Buttons
 * |--------------------------------------------------------------------------
 */

.action-buttons-wrapper {
  position: relative;
  z-index: 10;
}

.action-btn {
  min-width: 120px;
  font-weight: 600;
}

/**
 * |--------------------------------------------------------------------------
 * | Print
 * |--------------------------------------------------------------------------
 */

@media print {
  .action-buttons-wrapper {
    display: none !important;
  }

  .result-landscape-page {
    background: #ffffff !important;
    padding: 0 !important;
  }

  .container-fluid {
    max-width: 100% !important;
    padding-left: 0 !important;
    padding-right: 0 !important;
  }

  .result-card {
    box-shadow: none !important;
    border-radius: 0 !important;
  }

  .card-header,
  .card-body,
  .card-footer {
    background: #ffffff !important;
  }

  .table-responsive {
    overflow: visible !important;
  }

  .custom-result-table {
    font-size: 10px;
  }

  .custom-result-table th,
  .custom-result-table td {
    padding: 6px 5px;
  }

  @page {
    size: landscape;
    margin: 8mm;
  }
}

/**
 * |--------------------------------------------------------------------------
 * | Responsive
 * |--------------------------------------------------------------------------
 */

@media (max-width: 992px) {
  .result-landscape-page {
    padding: 10px 0 !important;
  }

  .container-fluid {
    padding-left: 10px !important;
    padding-right: 10px !important;
  }

  .school-header .col-2,
  .school-header .col-8 {
    width: 100%;
    text-align: center !important;
    padding-left: 10px !important;
    padding-right: 10px !important;
    margin-bottom: 8px;
  }

  .school-header .col-2:first-child {
    order: 2;
  }

  .school-header .col-8 {
    order: 1;
  }

  .school-header .col-2:last-child {
    order: 3;
  }
}
</style>
