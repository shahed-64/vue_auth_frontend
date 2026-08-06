<template>
  <div class="marksheet-wrapper py-5" v-if="resultData">
    <div class="container">
      <div class="marksheet-container position-relative bg-white p-4 p-md-5 mx-auto">
        <!-- Watermark Background -->
        <div class="watermark">BOARD</div>

        <!-- Top Header -->
        <div class="text-center mb-4">
          <h3 class="header-title mb-1">B@TCHPOINT COACHING CENTER</h3>
          <p class="text-muted mb-2">DHAKA, BANGLADESH</p>
          <h4 class="fw-bold text-dark border-bottom pb-2 d-inline-block px-4">
            {{ resultData.type }} EXAMINATION - {{ resultData.year }}
          </h4>
          <h5 class="text-secondary mt-1">ACADEMIC TRANSCRIPT</h5>
        </div>

        <!-- Student Info Table (Side by Side fixed for A4 & Screen) -->
        <table class="info-table mb-4 position-relative z-1">
          <tr>
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
                  <td>: {{ resultData.class_name }}</td>
                </tr>
              </table>
            </td>
            <td style="width: 45%; vertical-align: top">
              <table class="table table-sm table-borderless mb-0">
                <tr>
                  <td class="fw-bold" style="width: 110px">Student ID.</td>
                  <td>: {{ resultData.roll }}</td>
                </tr>

                <tr>
                  <!-- 🎯 ক্লাসের ওপর ভিত্তি করে লেবেল "Section" নাকি "Group" হবে তা ঠিক করা -->
                  <td class="fw-bold">
                    {{ isJuniorClass(resultData.class_name) ? 'Section' : 'Group' }}
                  </td>
                  <td>: {{ resultData.course_name }}</td>
                </tr>
                <tr>
                  <td class="fw-bold">Type</td>
                  <td>: {{ resultData.type }}</td>
                </tr>
                <tr>
                  <td class="fw-bold">GPA</td>
                  <td>
                    : <span class="badge bg-success fs-6">{{ resultData.gpa }}</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>

        <!-- Marks / Grades Table Design with Marks Column -->
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
              <!-- মূল সাবজেক্টগুলোর মার্কস লুপ করা -->
              <tr v-for="(subject, index) in resultData.subjects" :key="subject.id || index">
                <td>{{ index + 1 }}.</td>
                <td class="text-start ps-3">{{ subject.subject_name }}</td>
                <!-- ডেটাবেজ থেকে আসা মার্কস -->
                <td>{{ subject.marks }}</td>
                <!-- ফাংশন থেকে স্বয়ংক্রিয় গ্রেড আসবে -->
                <td>{{ calculateGrade(subject.marks).grade }}</td>
                <td>{{ calculateGrade(subject.marks).point }}</td>

                <td
                  v-if="index === 0"
                  :rowspan="resultData.subjects.length"
                  class="fw-bold bg-light align-middle"
                >
                  {{ resultData.gpa_without_additional || '-' }}
                </td>
              </tr>

              <!-- Additional Subject (যদি থাকে) -->
              <tr class="table-light" v-if="resultData.additional_subject">
                <td colspan="2" class="text-end fw-bold">
                  Additional Subject: {{ resultData.additional_subject.subject_name }}
                </td>
                <td>{{ resultData.additional_subject.marks }}</td>
                <td>{{ calculateGrade(resultData.additional_subject.marks).grade }}</td>
                <td>
                  {{ calculateGrade(resultData.additional_subject.marks).point }} <br />
                  <small class="text-muted">(Above 2.00)</small>
                </td>
                <td>-</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Grading System Reference Table -->
        <div class="row position-relative z-1 mb-5">
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
          <div class="col-5 d-flex flex-column justify-content-center">
            <div class="p-3 border bg-light rounded text-center">
              <p class="mb-1 text-muted small">Date of Publication of Results</p>
              <p class="fw-bold mb-0">{{ resultData.publication_date }}</p>
            </div>
          </div>
        </div>

        <!-- Signatures -->
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

      <!-- Print Button -->
      <div class="text-center mb-5 no-print mt-4">
        <button @click="printMarksheet" class="btn btn-success px-4 py-2 fw-bold shadow-sm">
          🖨️ Print / Save A4 Marksheet
        </button>
      </div>
    </div>
  </div>

  <!-- ডেটা লোড হওয়ার আগে দেখানোর জন্য -->
  <div v-else class="text-center py-5">
    <p class="fs-5 text-muted">Loading Result...</p>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { ref, onMounted } from 'vue'
import api from '@/services/api'

const route = useRoute()
const resultData = ref(null)

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
// Class 1 থেকে 8 হলে true রিটার্ন করবে (যার ফলে Section দেখাবে)
const isJuniorClass = (className) => {
  if (!className) return false

  // ক্লাসের নাম থেকে শুধু সংখ্যাটুকু বের করা (যেমন: "Class 8" থেকে 8)
  const numericClass = parseInt(className.toString().replace(/\D/g, ''), 10)

  if (!isNaN(numericClass)) {
    return numericClass >= 1 && numericClass <= 8
  }

  // যদি ক্লাসের নাম লেখায় থাকে (যেমন: Six, Seven, Eight)
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

onMounted(() => {
  fetchSingleResult()
})

const printMarksheet = () => {
  window.print()
}

// মার্কস অনুযায়ী গ্রেড ও পয়েন্ট হিসাব করার ফাংশন
const calculateGrade = (marks) => {
  const m = Number(marks)
  if (m >= 80) return { grade: 'A+', point: '5.00' }
  if (m >= 70) return { grade: 'A', point: '4.00' }
  if (m >= 60) return { grade: 'A-', point: '3.50' }
  if (m >= 50) return { grade: 'B', point: '3.00' }
  if (m >= 40) return { grade: 'C', point: '2.00' }
  if (m >= 33) return { grade: 'D', point: '1.00' }
  return { grade: 'F', point: '0.00' }
}
</script>
<style scoped>
.marksheet-wrapper {
  background-color: #f2f4f7;
  font-family: 'Arial', sans-serif;
  min-height: 100vh;
}
.marksheet-container {
  max-width: 850px;
  border: 5px solid #198754;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
  position: relative;
}
.watermark {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 8rem;
  color: rgba(25, 135, 84, 0.04);
  z-index: 0;
  font-weight: bold;
  pointer-events: none;
  user-select: none;
}
.header-title {
  color: #198754;
  font-weight: bold;
}
.info-table {
  width: 100%;
  border-collapse: collapse;
}
.table-bordered th,
.table-bordered td {
  border-color: #dee2e6 !important;
  vertical-align: middle;
}
.grade-table th,
.grade-table td {
  font-size: 0.85rem;
  padding: 4px;
}

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
  }
  .no-print {
    display: none !important;
  }
}
</style>
