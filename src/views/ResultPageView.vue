<template>
  <div class="marksheet-wrapper py-5" v-if="resultData">
    <div class="container">
      <div class="marksheet-container position-relative bg-white p-4 p-md-5 mx-auto">
        <!-- ===================================================== -->
        <!-- LOGO WATERMARK -->
        <!-- ===================================================== -->
        <div v-if="institute?.logo" class="logo-watermark">
          <img
            :src="getLogoUrl(institute.logo)"
            :alt="institute?.institute_name || 'Institute Logo'"
          />
        </div>

        <!-- ===================================================== -->
        <!-- TOP HEADER -->
        <!-- ===================================================== -->
        <div class="text-center mb-4 position-relative z-1">
          <h3 class="header-title mb-1">
            {{ institute?.institute_name || 'Institute Name' }}
          </h3>

          <p class="text-muted mb-2">
            {{ institute?.location || 'DHAKA, BANGLADESH' }}
          </p>

          <h4 class="fw-bold text-dark border-bottom pb-2 d-inline-block px-4">
            {{ resultData.type }} EXAMINATION -
            {{ resultData.year }}
          </h4>

          <h5 class="text-secondary mt-1">ACADEMIC TRANSCRIPT</h5>
        </div>

        <!-- ===================================================== -->
        <!-- STUDENT INFORMATION -->
        <!-- ===================================================== -->
        <table class="info-table mb-4 position-relative z-1">
          <tr>
            <!-- LEFT SIDE -->
            <td style="width: 55%; vertical-align: top">
              <table class="table table-sm table-borderless mb-0">
                <tr>
                  <td class="fw-bold" style="width: 140px">Student's Name</td>

                  <td>: {{ resultData.student_name }}</td>
                </tr>

                <tr>
                  <td class="fw-bold">Father's Name</td>

                  <td>: {{ resultData.father_name }}</td>
                </tr>

                <tr>
                  <td class="fw-bold">Mother's Name</td>

                  <td>: {{ resultData.mother_name }}</td>
                </tr>

                <tr>
                  <td class="fw-bold">Class / Batch</td>

                  <td>: {{ resultData.class_name || 'N/A' }}</td>
                </tr>
              </table>
            </td>

            <!-- RIGHT SIDE -->
            <td style="width: 45%; vertical-align: top">
              <table class="table table-sm table-borderless mb-0">
                <tr>
                  <td class="fw-bold" style="width: 110px">Student ID.</td>

                  <td>: {{ resultData.roll }}</td>
                </tr>

                <!-- GROUP / SECTION -->
                <tr>
                  <td class="fw-bold">
                    {{ isJuniorClass(resultData.class_name) ? 'Section' : 'Group' }}
                  </td>

                  <td>
                    :
                    {{
                      isJuniorClass(resultData.class_name)
                        ? resultData.course_name || 'N/A'
                        : resultData.group_name || 'N/A'
                    }}
                  </td>
                </tr>

                <tr>
                  <td class="fw-bold">Type</td>

                  <td>: {{ resultData.type }}</td>
                </tr>

                <tr>
                  <td class="fw-bold">GPA</td>

                  <td>
                    :

                    <span class="badge bg-success fs-6">
                      {{ resultData.gpa }}
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>

        <!-- ===================================================== -->
        <!-- MARKS / GRADES TABLE -->
        <!-- ===================================================== -->

        <div class="table-responsive position-relative z-1 mb-4">
          <table class="table table-bordered text-center align-middle">
            <thead class="table-success text-dark">
              <tr>
                <th style="width: 7%">Sl. No.</th>

                <th style="width: 38%; text-align: left; padding-left: 15px">Name of Subjects</th>

                <th style="width: 13%">Marks</th>

                <th style="width: 14%">Letter Grade</th>

                <th style="width: 14%">Grade Point</th>

                <th style="width: 14%">GPA (without additional)</th>
              </tr>
            </thead>

            <tbody>
              <!-- ================================================= -->
              <!-- MAIN SUBJECTS -->
              <!-- ================================================= -->

              <tr v-for="(subject, index) in mainSubjects" :key="subject.id || index">
                <td>{{ index + 1 }}.</td>

                <td class="text-start ps-3">
                  {{ subject.subject_name }}
                </td>

                <!-- Marks -->
                <td>
                  {{ subject.marks }}
                </td>

                <!-- Grade -->
                <td>
                  {{ calculateGrade(subject.marks).grade }}
                </td>

                <!-- Point -->
                <td>
                  {{ calculateGrade(subject.marks).point }}
                </td>

                <!-- GPA Without Additional -->
                <td
                  v-if="index === 0"
                  :rowspan="mainSubjects.length"
                  class="fw-bold bg-light align-middle"
                >
                  {{ resultData.gpa_without_additional || '-' }}
                </td>
              </tr>

              <!-- ================================================= -->
              <!-- ADDITIONAL SUBJECTS -->
              <!-- ================================================= -->

              <template
                v-for="(subject, index) in additionalSubjects"
                :key="'additional-' + (subject.id || index)"
              >
                <tr class="table-light additional-row">
                  <td>{{ mainSubjects.length + index + 1 }}.</td>

                  <td class="text-start ps-3 fw-bold">
                    {{ subject.subject_name }}

                    <span class="badge bg-warning text-dark ms-2"> Additional </span>
                  </td>

                  <td>
                    {{ subject.marks }}
                  </td>

                  <td>
                    {{ calculateAdditionalGrade(subject.marks).grade }}
                  </td>

                  <td>
                    {{ calculateAdditionalGrade(subject.marks).point }}

                    <br />

                    <small class="text-muted"> (Additional) </small>
                  </td>

                  <td>-</td>
                </tr>
              </template>

              <!-- ================================================= -->
              <!-- NO SUBJECT -->
              <!-- ================================================= -->

              <tr v-if="mainSubjects.length === 0 && additionalSubjects.length === 0">
                <td colspan="6" class="text-center text-muted py-4">No subject result found.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- ===================================================== -->
        <!-- GRADING SYSTEM -->
        <!-- ===================================================== -->

        <div class="row position-relative z-1 mb-5">
          <!-- Grading Table -->
          <div class="col-7">
            <table class="table table-bordered grade-table text-center mb-0">
              <tr class="table-secondary">
                <th>Interval (%)</th>

                <th>Letter Grade</th>

                <th>Grade Point</th>
              </tr>

              <tr>
                <td>80-100</td>
                <td>A+</td>
                <td>5.00</td>
              </tr>

              <tr>
                <td>70-79</td>
                <td>A</td>
                <td>4.00</td>
              </tr>

              <tr>
                <td>60-69</td>
                <td>A-</td>
                <td>3.50</td>
              </tr>

              <tr>
                <td>50-59</td>
                <td>B</td>
                <td>3.00</td>
              </tr>

              <tr>
                <td>40-49</td>
                <td>C</td>
                <td>2.00</td>
              </tr>

              <tr>
                <td>33-39</td>
                <td>D</td>
                <td>1.00</td>
              </tr>

              <tr>
                <td>00-32</td>
                <td>F</td>
                <td>0.00</td>
              </tr>
            </table>
          </div>

          <!-- Publication Date -->
          <div class="col-5 d-flex flex-column justify-content-center">
            <div class="p-3 border bg-light rounded text-center">
              <p class="mb-1 text-muted small">Date of Publication of Results</p>

              <p class="fw-bold mb-0">
                {{ resultData.publication_date }}
              </p>
            </div>
          </div>
        </div>

        <!-- ===================================================== -->
        <!-- ADDITIONAL SUBJECT INFORMATION -->
        <!-- ===================================================== -->

        <div v-if="additionalSubjects.length" class="alert alert-info position-relative z-1 mb-4">
          <strong> Additional Subject: </strong>

          <span
            v-for="(subject, index) in additionalSubjects"
            :key="'info-' + (subject.id || index)"
          >
            {{ subject.subject_name }}

            <span v-if="index < additionalSubjects.length - 1"> , </span>
          </span>

          <div class="small mt-1">
            Additional subject is shown separately from the main GPA calculation.
          </div>
        </div>

        <!-- ===================================================== -->
        <!-- SIGNATURES -->
        <!-- ===================================================== -->

        <div class="row text-center mt-5 position-relative z-1 pt-4">
          <div class="col-4">
            <div class="border-top border-dark pt-2 mx-auto" style="width: 80%">Prepared by</div>
          </div>

          <div class="col-4">
            <div class="border-top border-dark pt-2 mx-auto" style="width: 80%">Verified by</div>
          </div>

          <div class="col-4">
            <div class="border-top border-dark pt-2 mx-auto" style="width: 80%">
              Controller of Examinations
            </div>
          </div>
        </div>
      </div>

      <!-- ===================================================== -->
      <!-- BUTTONS -->
      <!-- ===================================================== -->

      <div class="text-center mb-5 no-print mt-4">
        <button @click="printMarksheet" class="btn btn-success px-4 py-2 fw-bold shadow-sm">
          🖨️ Print / Save A4 Marksheet
        </button>

        <router-link to="/result" class="btn btn-info px-4 py-2 fw-bold shadow-sm ms-2">
          <span> Back </span>
        </router-link>
      </div>
    </div>
  </div>

  <!-- ========================================================= -->
  <!-- LOADING -->
  <!-- ========================================================= -->

  <div v-else class="text-center py-5">
    <p class="fs-5 text-muted">Loading Result...</p>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { ref, computed, onMounted } from 'vue'
import api from '@/services/api'

// ============================================================
// ROUTE
// ============================================================

const route = useRoute()

// ============================================================
// RESULT DATA
// ============================================================

const resultData = ref(null)

// ============================================================
// INSTITUTE DATA
// ============================================================

const institute = ref(null)

// ============================================================
// FETCH INSTITUTE INFORMATION
// ============================================================

const fetchInstitute = async () => {
  try {
    const response = await api.get('/institute-info')

    institute.value = response.data.data
  } catch (error) {
    console.error('Failed to fetch institute information:', error)
  }
}

// ============================================================
// LOGO URL
// ============================================================

const getLogoUrl = (logo) => {
  if (!logo) {
    return ''
  }

  // If backend already returns complete URL
  if (logo.startsWith('http://') || logo.startsWith('https://')) {
    return logo
  }

  // Laravel storage path
  return `/storage/${logo}`
}

// ============================================================
// FETCH SINGLE RESULT
// ============================================================

const fetchSingleResult = async () => {
  const resultId = route.query.id

  if (!resultId) {
    console.error('No result ID provided in query params.')

    return
  }

  try {
    const response = await api.get(`/results/${resultId}`)

    resultData.value = response.data.result
  } catch (error) {
    console.error('Error fetching result details:', error)
  }
}

// ============================================================
// MAIN SUBJECTS
// ============================================================

const mainSubjects = computed(() => {
  if (!resultData.value || !Array.isArray(resultData.value.subjects)) {
    return []
  }

  return resultData.value.subjects.filter((subject) => subject.is_additional !== true)
})

// ============================================================
// ADDITIONAL SUBJECTS
// ============================================================

const additionalSubjects = computed(() => {
  if (!resultData.value) {
    return []
  }

  // Backend থেকে সরাসরি additional_subject
  if (Array.isArray(resultData.value.additional_subject)) {
    return resultData.value.additional_subject
  }

  // Fallback: subjects থেকে বের করা
  if (Array.isArray(resultData.value.subjects)) {
    return resultData.value.subjects.filter((subject) => subject.is_additional === true)
  }

  return []
})

// ============================================================
// JUNIOR CLASS CHECK
// ============================================================

const isJuniorClass = (className) => {
  if (!className) {
    return false
  }

  const numericClass = parseInt(className.toString().replace(/\D/g, ''), 10)

  if (!isNaN(numericClass)) {
    return numericClass >= 1 && numericClass <= 8
  }

  const juniorClasses = [
    'one',
    'two',
    'three',
    'four',
    'five',
    'six',
    'seven',
    'eight',

    'class 1',
    'class 2',
    'class 3',
    'class 4',
    'class 5',
    'class 6',
    'class 7',
    'class 8',
  ]

  return juniorClasses.some((c) => className.toString().toLowerCase().includes(c))
}

// ============================================================
// NORMAL GRADE CALCULATOR
// ============================================================

const calculateGrade = (marks) => {
  if (marks === null || marks === undefined || marks === '') {
    return {
      grade: '-',
      point: '-',
    }
  }

  const m = Number(marks)

  if (isNaN(m)) {
    return {
      grade: '-',
      point: '-',
    }
  }

  if (m >= 80) {
    return {
      grade: 'A+',
      point: '5.00',
    }
  }

  if (m >= 70) {
    return {
      grade: 'A',
      point: '4.00',
    }
  }

  if (m >= 60) {
    return {
      grade: 'A-',
      point: '3.50',
    }
  }

  if (m >= 50) {
    return {
      grade: 'B',
      point: '3.00',
    }
  }

  if (m >= 40) {
    return {
      grade: 'C',
      point: '2.00',
    }
  }

  if (m >= 33) {
    return {
      grade: 'D',
      point: '1.00',
    }
  }

  return {
    grade: 'F',
    point: '0.00',
  }
}

// ============================================================
// ADDITIONAL SUBJECT GRADE
// ============================================================

const calculateAdditionalGrade = (marks) => {
  if (marks === null || marks === undefined || marks === '') {
    return {
      grade: '-',
      point: '-',
    }
  }

  const m = Number(marks)

  if (isNaN(m)) {
    return {
      grade: '-',
      point: '-',
    }
  }

  if (m >= 80) {
    return {
      grade: 'A+',
      point: '5.00',
    }
  }

  if (m >= 70) {
    return {
      grade: 'A',
      point: '4.00',
    }
  }

  if (m >= 60) {
    return {
      grade: 'A-',
      point: '3.50',
    }
  }

  if (m >= 50) {
    return {
      grade: 'B',
      point: '3.00',
    }
  }

  if (m >= 40) {
    return {
      grade: 'C',
      point: '2.00',
    }
  }

  if (m >= 33) {
    return {
      grade: 'D',
      point: '1.00',
    }
  }

  return {
    grade: 'F',
    point: '0.00',
  }
}

// ============================================================
// PRINT
// ============================================================

const printMarksheet = () => {
  window.print()
}

// ============================================================
// MOUNT
// ============================================================

onMounted(() => {
  fetchInstitute()

  fetchSingleResult()
})
</script>

<style scoped>
/* =========================================================
   MARKSHEET WRAPPER
========================================================= */

.marksheet-wrapper {
  background-color: #f2f4f7;

  font-family: 'Arial', sans-serif;

  min-height: 100vh;
}

/* =========================================================
   MARKSHEET CONTAINER
========================================================= */

.marksheet-container {
  max-width: 850px;

  border: 5px solid #198754;

  box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);

  position: relative;

  overflow: hidden;
}

/* =========================================================
   LOGO WATERMARK
========================================================= */

.logo-watermark {
  position: absolute;

  top: 50%;

  left: 50%;

  transform: translate(-50%, -50%);

  width: 430px;

  height: 430px;

  display: flex;

  align-items: center;

  justify-content: center;

  z-index: 0;

  pointer-events: none;

  user-select: none;
}

/* =========================================================
   WATERMARK IMAGE
========================================================= */

.logo-watermark img {
  width: 100%;

  height: 100%;

  object-fit: contain;

  opacity: 0.055;

  filter: grayscale(100%);
}

/* =========================================================
   HEADER
========================================================= */

.header-title {
  color: #198754;

  font-weight: bold;
}

/* =========================================================
   INFORMATION TABLE
========================================================= */

.info-table {
  width: 100%;

  border-collapse: collapse;
}

/* =========================================================
   TABLE
========================================================= */

.table-bordered th,
.table-bordered td {
  border-color: #dee2e6 !important;

  vertical-align: middle;
}

/* =========================================================
   GRADING TABLE
========================================================= */

.grade-table th,
.grade-table td {
  font-size: 0.85rem;

  padding: 4px;
}

/* =========================================================
   ADDITIONAL SUBJECT
========================================================= */

.additional-row {
  border-top: 2px solid #ffc107 !important;
}

/* =========================================================
   PRINT
========================================================= */

@media print {
  @page {
    size: A4 portrait;

    margin: 10mm;
  }

  body {
    background-color: #fff;
  }

  .marksheet-wrapper {
    background-color: #fff;

    padding: 0 !important;
  }

  .marksheet-container {
    border: 3px solid #000;

    box-shadow: none;

    margin: 0;

    padding: 15px !important;

    width: 100%;

    max-width: 100%;

    overflow: hidden;
  }

  /* Keep logo watermark in print */

  .logo-watermark {
    display: flex !important;

    position: absolute;

    top: 50%;

    left: 50%;

    transform: translate(-50%, -50%);
  }

  .logo-watermark img {
    opacity: 0.055;
  }

  .no-print {
    display: none !important;
  }
}

/* =========================================================
   MOBILE
========================================================= */

@media (max-width: 576px) {
  .marksheet-container {
    border-width: 3px;

    padding: 15px !important;
  }

  .logo-watermark {
    width: 300px;

    height: 300px;
  }

  .header-title {
    font-size: 20px;
  }
}
</style>
