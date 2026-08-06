<template>
  <LoadingSpinner v-if="isLoading" />
  <RouterView />
  <dashPageView />
  <div class="result-page-wrapper py-4">
    <div class="container-fluid px-4">
      <!-- Top Summary Cards -->
      <div class="row g-4 mb-4">
        <!-- Card 1 -->
        <div class="col-md-3 col-sm-6">
          <div class="card border-0 shadow-sm rounded-4 p-3 border-start border-success border-4">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <p class="text-muted mb-1 small fw-bold">Exam Participants</p>
                <h4 class="fw-bold text-dark mb-0">{{ totalStudents }}</h4>
              </div>
              <div class="icon-box bg-success-subtle text-success rounded-3 p-3">🎓</div>
            </div>
          </div>
        </div>
        <!-- Card 2 -->
        <div class="col-md-3 col-sm-6">
          <div class="card border-0 shadow-sm rounded-4 p-3 border-start border-primary border-4">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <p class="text-muted mb-1 small fw-bold">Published Results</p>
                <h4 class="fw-bold text-dark mb-0">{{ publishedResults }}</h4>
              </div>
              <div class="icon-box bg-primary-subtle text-primary rounded-3 p-3">📄</div>
            </div>
          </div>
        </div>
        <!-- Card 3 -->
        <div class="col-md-3 col-sm-6">
          <div class="card border-0 shadow-sm rounded-4 p-3 border-start border-warning border-4">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <p class="text-muted mb-1 small fw-bold">Pass Rate</p>
                <h4 class="fw-bold text-dark mb-0">{{ passRate }}%</h4>
              </div>
              <div class="icon-box bg-warning-subtle text-warning rounded-3 p-3">📈</div>
            </div>
          </div>
        </div>
        <!-- Card 4 -->
        <div class="col-md-3 col-sm-6">
          <div class="card border-0 shadow-sm rounded-4 p-3 border-start border-info border-4">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <p class="text-muted mb-1 small fw-bold">Total GPA 5.00</p>
                <h4 class="fw-bold text-dark mb-0">{{ totalGpaFive }}</h4>
              </div>
              <div class="icon-box bg-info-subtle text-info rounded-3 p-3">⭐</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Section: Result History / List -->
      <div class="card border-0 shadow-sm rounded-4 p-4">
        <!-- Header, Search Bar & Add Result Button -->
        <div
          class="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3 mb-4"
        >
          <h4 class="fw-bold text-dark mb-0">Student Result List</h4>

          <div class="d-flex align-items-center gap-3">
            <div class="search-box position-relative" style="width: 260px">
              <input
                type="text"
                class="form-control"
                v-model="search"
                placeholder="Search by Student ID or Name..."
              />
              <span class="position-absolute top-50 end-0 translate-middle-y me-3 text-muted">
                🔍
              </span>
            </div>

            <!-- Add Result Modal Trigger Button -->
            <button
              type="button"
              class="btn btn-success btn-sm px-4 py-2 fw-bold rounded-pill shadow-sm d-flex align-items-center gap-2 text-nowrap"
              @click="openAddModal"
            >
              <span>+ Add Result</span>
            </button>
          </div>
        </div>

        <!-- Table -->
        <div class="table-responsive">
          <table class="table align-middle table-hover mb-0">
            <thead class="table-light text-uppercase fs-7 text-muted">
              <tr>
                <th class="py-3 ps-3" style="width: 8%">#</th>
                <th class="py-3">Student ID</th>
                <th class="py-3">Student Name</th>
                <th class="py-3">Exam Info</th>
                <th class="py-3">Exam Year</th>
                <th class="py-3 text-center" style="width: 20%">Action / Receipt</th>
              </tr>
            </thead>
            <tbody>
              <!-- ডাইনামিক লুপ -->
              <tr v-for="(result, index) in filteredResults" :key="result.id">
                <td class="ps-3 fw-semibold text-muted">{{ index + 1 }}</td>
                <td class="fw-bold text-dark">
                  {{ result.student ? result.student.student_id : 'N/A' }}
                </td>
                <td class="fw-bold text-dark">
                  {{ result.student ? result.student.full_name : 'N/A' }}
                </td>
                <td class="fw-medium text-secondary">{{ result.exam_type }}</td>
                <td>
                  <span class="badge bg-light text-dark border px-3 py-1 rounded-pill">{{
                    result.exam_year
                  }}</span>
                </td>
                <td class="text-center">
                  <a
                    :href="`/resultShow?id=${result.id}`"
                    target="_blank"
                    class="btn btn-primary btn-sm"
                  >
                    PDF
                  </a>
                </td>
              </tr>
              <!-- যদি কোনো ডাটা না থাকে -->
              <tr v-if="filteredResults.length === 0">
                <td colspan="9" class="text-center py-4 text-muted">কোনো রেজাল্ট পাওয়া যায়নি!</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination Footer -->
        <div class="d-flex justify-content-between align-items-center mt-4 pt-3 border-top">
          <p class="text-muted small mb-0">Showing entries via API</p>
          <nav>
            <ul class="pagination pagination-sm mb-0">
              <li class="page-item disabled">
                <a class="page-link rounded-start-pill" href="#">Prev</a>
              </li>
              <li class="page-item active">
                <a class="page-link bg-primary border-primary" href="#">1</a>
              </li>
              <li class="page-item"><a class="page-link rounded-end-pill" href="#">Next</a></li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  </div>

  <!-- Add Result Insert Modal -->
  <div
    class="modal fade"
    :class="{ 'show d-block': isAddModalOpen }"
    tabindex="-1"
    v-if="isAddModalOpen"
    style="background: rgba(0, 0, 0, 0.5)"
    @click.self="closeDropdown"
  >
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content border-0 shadow-lg rounded-4 p-3">
        <div class="modal-header border-0 pb-0">
          <h5 class="modal-title fw-bold text-dark">Insert Student Result & Marks</h5>
          <button type="button" class="btn-close shadow-none" @click="closeAddModal"></button>
        </div>

        <div class="modal-body">
          <form @submit.prevent="saveNewResult">
            <!-- Select Fields Row -->
            <div class="row">
              <!-- 🎯 CUSTOM SEARCHABLE STUDENT SELECT INPUT -->
              <div class="col-md-4 mb-3 position-relative">
                <label class="form-label small fw-bold text-muted">Student ID / Name</label>
                <div class="input-group">
                  <input
                    type="text"
                    class="form-control rounded-3"
                    v-model="studentSearchText"
                    placeholder="Type ID or Name to search..."
                    @focus="isDropdownOpen = true"
                    @input="isDropdownOpen = true"
                  />
                  <button
                    v-if="studentSearchText"
                    type="button"
                    class="btn btn-outline-secondary border-start-0"
                    @click="clearStudentSelection"
                  >
                    ✕
                  </button>
                </div>

                <!-- Custom Dropdown List -->
                <div
                  v-if="isDropdownOpen"
                  class="dropdown-menu show shadow-lg border rounded-3 bg-white position-absolute w-100 mt-1"
                  style="max-height: 220px; overflow-y: auto; z-index: 1060"
                >
                  <button
                    type="button"
                    v-for="student in searchableStudents"
                    :key="student.id"
                    class="dropdown-item py-2 px-3 border-bottom text-wrap text-start"
                    @click="selectStudent(student)"
                  >
                    <span class="fw-bold text-primary">{{ student.student_id }}</span> -
                    {{ student.full_name }}
                  </button>
                  <div
                    v-if="searchableStudents.length === 0"
                    class="p-3 text-muted text-center small"
                  >
                    No student found!
                  </div>
                </div>
              </div>

              <div class="col-md-4 mb-3">
                <label class="form-label small fw-bold text-muted">Exam Year</label>
                <select class="form-select rounded-3" v-model="form.exam_year" required>
                  <option value="" disabled selected>Select Year</option>
                  <option value="2026">2026</option>
                  <option value="2025">2025</option>
                  <option value="2024">2024</option>
                </select>
              </div>

              <div class="col-md-4 mb-3">
                <label class="form-label small fw-bold text-muted">Exam Type</label>
                <select class="form-select rounded-3" v-model="form.exam_type" required>
                  <option value="" disabled selected>Select Exam Type</option>
                  <option value="Half Yearly">HALF YEARLY</option>
                  <option value="FINAL">FINAL</option>
                  <option value="Test Exam">TEST</option>
                  <option value="model Test ">MODEL TEST</option>
                </select>
              </div>
            </div>

            <hr class="my-3 text-muted opacity-25" />
            <h6 class="fw-bold text-dark mb-3">Subject Marks / Grades</h6>
            <div class="row">
              <div class="col-md-4 mb-3" v-for="subject in currentSubjects" :key="subject">
                <label class="form-label fw-bold">
                  {{ subject.replaceAll('_', ' ').toUpperCase() }}
                </label>

                <input
                  type="number"
                  step="0.01"
                  class="form-control rounded-3"
                  v-model="form[subject]"
                  placeholder="Enter Marks"
                />
              </div>
            </div>

            <div class="modal-footer border-0 px-0 pb-0 pt-3">
              <button
                type="button"
                class="btn btn-outline-secondary rounded-pill px-4"
                @click="closeAddModal"
              >
                Cancel
              </button>
              <button type="submit" class="btn btn-success rounded-pill px-4 fw-bold shadow-sm">
                Add Result
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import dashPageView from './dashPageView.vue'
import { ref, reactive, onMounted, computed } from 'vue'

import api from '@/services/api'
import LoadingSpinner from '../components/LoadingSpinner.vue'
import { isLoading } from '../utils/loading'

const resultsList = ref([])
const search = ref('')
const isAddModalOpen = ref(false)
const studentsList = ref([])
const currentSubjects = ref([])

// 🎯 Searchable Student States
const studentSearchText = ref('')
const isDropdownOpen = ref(false)

// ১. ICT সহ সব সাবজেক্টের নাম ছোট হাতের অক্ষরে রাখা হয়েছে
const classSubjects = {
  'Class-1': ['bangla', 'english', 'general_math'],
  'Class-2': ['bangla', 'english', 'general_math'],
  'Class-3': ['bangla', 'english', 'general_math', 'religion', 'bgs', 'general_science'],
  'Class-4': ['bangla', 'english', 'general_math', 'religion', 'bgs', 'general_science'],
  'Class-5': ['bangla', 'english', 'general_math', 'religion', 'bgs', 'general_science'],
  'Class-6': ['bangla', 'english', 'general_math', 'religion', 'bgs', 'general_science', 'ict'],
  'Class-7': ['bangla', 'english', 'general_math', 'religion', 'bgs', 'general_science', 'ict'],
  'Class-8': ['bangla', 'english', 'general_math', 'religion', 'bgs', 'general_science', 'ict'],
  'Class-9': ['bangla', 'english', 'general_math', 'religion', 'bgs', 'general_science', 'ict'],
  'Class-10': ['bangla', 'english', 'general_math', 'religion', 'bgs', 'general_science', 'ict'],
}

const groupSubjects = {
  science: [
    'bangla',
    'english',
    'higher_math',
    'physics_1',
    'physics_2',
    'chemistry_1',
    'chemistry_2',
    'biology',
    'ict',
  ],
  arts: ['bangla', 'english', 'history', 'geography', 'ict'],
  commerce: ['bangla', 'english', 'accounting', 'finance', 'ict'],
}

// 🎯 Search Filter Logic (১০০০+ স্টুডেন্টের জন্য পারফরম্যান্স অপটিমাইজড)
const searchableStudents = computed(() => {
  if (!studentSearchText.value.trim()) {
    return studentsList.value.slice(0, 50)
  }
  const text = studentSearchText.value.toLowerCase().trim()
  return studentsList.value.filter((student) => {
    const id = student.student_id ? student.student_id.toString().toLowerCase() : ''
    const name = student.full_name ? student.full_name.toLowerCase() : ''
    return id.includes(text) || name.includes(text)
  })
})

// 🎯 Student Selection Handler
const selectStudent = (student) => {
  form.student_id = student.id
  studentSearchText.value = `${student.student_id} - ${student.full_name}`
  isDropdownOpen.value = false
  studentChanged()
}

// Clear Selection
const clearStudentSelection = () => {
  studentSearchText.value = ''
  form.student_id = ''
  currentSubjects.value = []
  isDropdownOpen.value = true
}

const closeDropdown = () => {
  isDropdownOpen.value = false
}

// ২. studentChanged ফাংশন আপডেট
const studentChanged = () => {
  const student = studentsList.value.find((item) => item.id == form.student_id)
  if (!student) return

  // batch_name ও course_name কে Trim ও Lowercase করে চেক করা
  const batch = student.batch_name ? student.batch_name.trim() : ''
  const course = student.course_name ? student.course_name.trim().toLowerCase() : ''

  const isHighSchool = ['Class-9', 'Class-10', 'Class-11', 'Class-12'].includes(batch)

  if (isHighSchool && groupSubjects[course]) {
    // যদি Group (Science, Arts, Commerce) পাওয়া যায়
    currentSubjects.value = groupSubjects[course]
  } else if (classSubjects[batch]) {
    // সাধারণ Class অনুযায়ী সাবজেক্ট নির্ধারণ
    currentSubjects.value = classSubjects[batch]
  } else {
    currentSubjects.value = []
  }
}

const form = reactive({
  student_id: '',
  exam_year: '',
  exam_type: '',
  bangla: '',
  english: '',
  general_math: '',
  higher_math: '',
  physics_1: '',
  physics_2: '',
  chemistry_1: '',
  chemistry_2: '',
  biology: '',
  ict: '',
  bgs: '',
  general_science: '',
  religion: '',
  history: '',
  geography: '',
  accounting: '',
  finance: '',
})

// 🔹 API Call (GET Results & Students)
const fetchData = async () => {
  try {
    const response = await api.get('/results')
    resultsList.value = response.data.results
    if (response.data.students) {
      studentsList.value = response.data.students
    }
  } catch (error) {
    console.error('Error fetching data:', error)
  }
}

// 🔹 ১. মার্কস থেকে GPA & Status বের করার Helper Function
const calculateResultDetails = (result) => {
  const allMainSubjects = [
    'bangla',
    'english',
    'general_math',
    'physics_1',
    'physics_2',
    'chemistry_1',
    'chemistry_2',
    'ict',
    'bgs',
    'biology',
    'general_science',
    'religion',
    'history',
    'geography',
    'accounting',
    'finance',
  ]

  let totalPoints = 0
  let subjectCount = 0
  let hasFailed = false

  const getPoint = (marks) => {
    if (marks === null || marks === '') return null
    const m = parseFloat(marks)
    if (m >= 80) return 5.0
    if (m >= 70) return 4.0
    if (m >= 60) return 3.5
    if (m >= 50) return 3.0
    if (m >= 40) return 2.0
    if (m >= 33) return 1.0
    return 0.0
  }

  allMainSubjects.forEach((subject) => {
    if (result[subject] !== null && result[subject] !== undefined && result[subject] !== '') {
      const point = getPoint(result[subject])
      if (point !== null) {
        totalPoints += point
        subjectCount++
        if (point === 0) hasFailed = true
      }
    }
  })

  let bonusPoint = 0
  if (
    result.higher_math !== null &&
    result.higher_math !== undefined &&
    result.higher_math !== ''
  ) {
    const hmPoint = getPoint(result.higher_math)
    if (hmPoint !== null && hmPoint > 2.0) {
      bonusPoint = hmPoint - 2.0
    }
  }

  if (subjectCount === 0 || hasFailed) {
    return { gpa: 0, status: 'Fail' }
  }

  const finalGpa = Math.min(5.0, (totalPoints + bonusPoint) / subjectCount)
  return {
    gpa: parseFloat(finalGpa.toFixed(2)),
    status: 'Pass',
  }
}

// 🔹 ২. Summary Cards Computed Properties
const totalStudents = computed(() => resultsList.value.length)
const publishedResults = computed(() => resultsList.value.length)

const passRate = computed(() => {
  if (!resultsList.value.length) return '0.0'

  const passedCount = resultsList.value.filter((item) => {
    const res = calculateResultDetails(item)
    return res.status === 'Pass'
  }).length

  return ((passedCount / resultsList.value.length) * 100).toFixed(1)
})

const totalGpaFive = computed(() => {
  return resultsList.value.filter((item) => {
    const res = calculateResultDetails(item)
    return res.status === 'Pass' && res.gpa >= 5.0
  }).length
})

const filteredResults = computed(() => {
  if (!search.value.trim()) {
    return resultsList.value
  }

  const keyword = search.value.toLowerCase()

  return resultsList.value.filter((result) => {
    const studentId = result.student?.student_id?.toLowerCase() || ''
    const fullName = result.student?.full_name?.toLowerCase() || ''

    return studentId.includes(keyword) || fullName.includes(keyword)
  })
})

onMounted(() => {
  fetchData()
})

const openAddModal = () => {
  Object.keys(form).forEach((key) => {
    form[key] = ''
  })
  studentSearchText.value = ''
  currentSubjects.value = []
  isAddModalOpen.value = true
}

const closeAddModal = () => {
  isAddModalOpen.value = false
  isDropdownOpen.value = false
}

// 🔹 API Call (POST New Result)
const saveNewResult = async () => {
  if (!form.student_id) {
    alert('Please select a student from the search list!')
    return
  }

  try {
    const response = await api.post('/results', form)

    if (response.data.success) {
      alert(response.data.message)
      closeAddModal()
      fetchData()
    }
  } catch (error) {
    if (error.response && error.response.status === 422) {
      alert('Validation error! Please check your inputs.')
      console.log(error.response.data.errors)
    } else {
      alert('Something went wrong!')
    }
  }
}
</script>

<style scoped>
.result-page-wrapper {
  background-color: #f8f9fa;
  min-height: 100vh;
  font-family: 'Arial', sans-serif;
  width: 86%;
  margin-left: 259px;
}
.fs-7 {
  font-size: 0.75rem;
  letter-spacing: 0.5px;
}
.card {
  transition: all 0.2s ease-in-out;
}
.table td,
.table th {
  vertical-align: middle;
}

@media (max-width: 992px) {
  .result-page-wrapper {
    width: 100% !important;
    margin-left: 0 !important;
    padding-left: 15px;
    padding-right: 15px;
  }
}
</style>
