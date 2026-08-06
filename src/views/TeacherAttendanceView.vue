<template>
  <!-- Main Dashboard Wrapper for Flex Layout -->
  <div class="dashboard-layout bg-light min-vh-100 d-flex">
    <!-- Left Sidebar Component -->
    <aside class="sidebar-wrapper">
      <dashPageView />
    </aside>

    <!-- Right Main Content Area -->
    <div class="main-wrapper flex-grow-1 min-vh-100 d-flex flex-column">
      <!-- Dynamic Router View (If any Header/Navbar exists inside) -->
      <RouterView />

      <!-- Teacher Attendance Main Section -->
      <main class="attendance-section py-3 py-md-4 px-2 px-md-3">
        <div class="attendance-container bg-white rounded-3 shadow-sm p-3 p-md-4">
          <!-- Title & Action Section -->
          <div
            class="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4"
          >
            <div>
              <h2 class="h4 h3-md mb-0 fw-bold text-dark">Teacher Attendance</h2>
              <p class="text-muted mb-0 small">
                Manage daily faculty attendance and check-in times
              </p>
            </div>

            <div class="d-flex flex-wrap align-items-center gap-2 gap-md-3">
              <!-- Syncing / Saving Status Indicator -->
              <div
                v-if="isSyncing"
                class="d-flex align-items-center text-primary small fw-semibold"
              >
                <div class="spinner-border spinner-border-sm me-2" role="status"></div>
                Saving...
              </div>
              <div v-else-if="saveSuccess" class="text-success small fw-semibold">
                <i class="bi bi-check-circle-fill me-1"></i> Saved!
              </div>

              <!-- Date Selector -->
              <div
                class="date-select-wrapper px-3 py-1 py-md-2 bg-light border rounded d-flex align-items-center gap-2 shadow-sm flex-grow-1 flex-md-grow-0"
              >
                <label for="date-select" class="form-label mb-0 fw-semibold text-secondary small"
                  >Date:</label
                >
                <input
                  type="date"
                  id="date-select"
                  v-model="selectedDate"
                  @change="fetchAttendanceData"
                  class="form-control form-control-sm border-0 bg-transparent p-0 w-auto flex-grow-1"
                />
              </div>

              <!-- Bulk Attendance Button -->
              <button
                class="btn btn-primary btn-sm btn-md-md d-flex align-items-center justify-content-center gap-2 fw-semibold shadow-sm flex-grow-1 flex-md-grow-0"
                @click="markAllPresent"
              >
                <i class="bi bi-person-check-fill"></i>
                <span>Mark All Present</span>
              </button>
            </div>
          </div>

          <!-- Shift Filter Buttons -->
          <div
            class="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3 bg-light p-2 rounded border"
          >
            <div class="btn-group btn-group-sm" role="group">
              <button
                type="button"
                class="btn"
                :class="selectedShift === '' ? 'btn-primary' : 'btn-outline-primary'"
                @click="selectedShift = ''"
              >
                All Shifts
              </button>

              <button
                v-for="shiftName in availableShifts"
                :key="shiftName"
                type="button"
                class="btn"
                :class="selectedShift === shiftName ? 'btn-primary' : 'btn-outline-primary'"
                @click="selectedShift = shiftName"
              >
                {{ shiftName }}
              </button>
            </div>

            <div class="text-muted small">
              Filtering Shift:
              <strong class="text-uppercase text-dark">{{ selectedShift || 'All Shifts' }}</strong>
            </div>
          </div>

          <!-- Search Bar & Summary Row -->
          <div
            class="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-2 mb-3"
          >
            <div class="search-box-wrapper w-100" style="max-width: 350px">
              <div class="input-group input-group-sm">
                <span class="input-group-text bg-white border-end-0 text-muted ps-3">
                  <i class="bi bi-search"></i>
                </span>
                <input
                  type="text"
                  v-model="searchQuery"
                  class="form-control border-start-0 ps-0 shadow-none"
                  placeholder="Search Teacher ID or Name..."
                />
              </div>
            </div>

            <div class="text-muted small align-self-start align-self-sm-center">
              <span class="badge bg-light text-secondary border px-3 py-2 rounded-pill shadow-sm">
                Total Records: <strong>{{ filteredTeachers.length }}</strong>
              </span>
            </div>
          </div>

          <!-- Attendance Table Card -->
          <div class="card border-0 shadow-sm">
            <div class="card-body p-0">
              <div class="table-responsive">
                <table class="table table-hover align-middle mb-0 attendance-table">
                  <thead class="table-light">
                    <tr class="fw-semibold text-secondary small">
                      <th scope="col" class="ps-3 ps-md-4">TEACHER ID</th>
                      <th scope="col">TEACHER NAME</th>
                      <th scope="col">SHIFT & START TIME</th>
                      <th scope="col" class="text-center">
                        <div class="d-flex align-items-center justify-content-center gap-1">
                          <input
                            class="form-check-input custom-checkbox"
                            type="checkbox"
                            :checked="isAllSelected"
                            @change="toggleSelectAll"
                          />
                          <span class="ms-1 d-none d-sm-inline">PRESENT</span>
                        </div>
                      </th>
                      <th scope="col" class="text-center">CHECK IN</th>
                      <th scope="col" class="text-center">LATE</th>
                      <th scope="col" class="text-end pe-3 pe-md-4">ACTION</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-if="loading">
                      <td colspan="7" class="text-center py-4 text-muted">
                        <div class="spinner-border spinner-border-sm me-2" role="status"></div>
                        Loading teachers attendance...
                      </td>
                    </tr>

                    <tr
                      v-else
                      v-for="teacher in filteredTeachers"
                      :key="teacher.uniqueKey"
                      class="attendance-row"
                      :class="{
                        'present-row': teacher.isPresent,
                        'absent-row': !teacher.isPresent,
                      }"
                    >
                      <td class="ps-3 ps-md-4">
                        <div class="fw-semibold text-dark text-uppercase small">
                          {{ teacher.teacher_code || teacher.id }}
                        </div>
                      </td>

                      <td>
                        <div class="d-flex align-items-center gap-2 gap-md-3">
                          <img
                            :src="teacher.image || getTeacherPhoto(teacher.gender)"
                            class="rounded-circle teacher-photo-placeholder flex-shrink-0 object-fit-cover"
                            alt="Teacher"
                          />
                          <div>
                            <div class="fw-bold text-dark text-uppercase small text-nowrap">
                              {{ teacher.name }}
                            </div>
                            <small class="text-muted text-uppercase small d-block">{{
                              teacher.subject || 'N/A'
                            }}</small>
                          </div>
                        </div>
                      </td>

                      <td>
                        <div class="d-flex flex-column">
                          <span class="badge bg-secondary text-white w-fit mb-1">
                            {{ teacher.shift_name }}
                          </span>
                          <small class="text-muted font-monospace" style="font-size: 0.75rem">
                            Starts: {{ teacher.shiftStartTime || '09:00' }}
                          </small>
                        </div>
                      </td>

                      <td class="text-center">
                        <div class="form-check d-flex justify-content-center m-0">
                          <input
                            class="form-check-input custom-checkbox"
                            type="checkbox"
                            v-model="teacher.isPresent"
                            @change="onCheckboxChange(teacher)"
                          />
                        </div>
                      </td>

                      <td class="text-center font-monospace small text-nowrap">
                        <span v-if="teacher.checkInTime" class="fw-semibold text-dark">
                          {{ teacher.checkInTime }}
                        </span>
                        <span v-else class="text-muted">-</span>
                      </td>

                      <td class="text-center text-nowrap">
                        <span
                          v-if="teacher.lateMinutes > 0"
                          class="badge bg-danger rounded-pill fw-bold text-uppercase fs-8 px-2 px-md-3 py-1"
                        >
                          LATE: {{ teacher.lateMinutes }} MIN
                        </span>
                        <span
                          v-else-if="teacher.isPresent"
                          class="badge bg-success rounded-pill fw-bold text-uppercase fs-8 px-2 px-md-3 py-1"
                        >
                          ON TIME
                        </span>
                        <span v-else class="text-muted fs-8">-</span>
                      </td>

                      <td class="text-end pe-3 pe-md-4">
                        <span
                          class="badge rounded-pill px-2 px-md-3 py-1 py-md-2 text-uppercase fs-8 fw-bold pill-status"
                          :class="teacher.isPresent ? 'status-present' : 'status-absent'"
                        >
                          {{ teacher.isPresent ? 'Present' : 'Absent' }}
                        </span>
                      </td>
                    </tr>

                    <tr v-if="!loading && filteredTeachers.length === 0">
                      <td colspan="7" class="text-center py-4 text-muted">
                        No teacher found matching your criteria.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <!-- Footer / Pagination -->
          <div
            class="d-flex flex-column flex-sm-row justify-content-between align-items-center gap-2 mt-3 text-muted small"
          >
            <div>Showing {{ filteredTeachers.length }} of {{ teachers.length }} entries</div>
            <nav aria-label="Page navigation">
              <ul class="pagination pagination-sm m-0">
                <li class="page-item disabled">
                  <a class="page-link" href="#" tabindex="-1" aria-disabled="true">Previous</a>
                </li>
                <li class="page-item active" aria-current="page">
                  <a class="page-link" href="#">1</a>
                </li>
                <li class="page-item">
                  <a class="page-link" href="#">Next</a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import dashPageView from './dashPageView.vue'

// --- API Base URL ---
const API_BASE_URL = 'http://127.0.0.1:8000/api'

// Default Date
const today = new Date().toISOString().split('T')[0]
const selectedDate = ref(today)

// States
const searchQuery = ref('')
const selectedShift = ref('')
const teachers = ref([])
const loading = ref(false)
const isSyncing = ref(false)
const saveSuccess = ref(false)

// --- API: Fetch Data ---
const fetchAttendanceData = async () => {
  loading.value = true
  try {
    const teachersRes = await axios.get(`${API_BASE_URL}/teachers`)
    let rawTeachers = Array.isArray(teachersRes.data)
      ? teachersRes.data
      : teachersRes.data.data || []

    let rawAttendance = []
    try {
      const attendanceRes = await axios.get(`${API_BASE_URL}/teacher-attendances`, {
        params: { date: selectedDate.value },
      })
      rawAttendance = Array.isArray(attendanceRes.data)
        ? attendanceRes.data
        : attendanceRes.data.data || []
    } catch (e) {
      console.warn('No attendance recorded yet for this date.')
    }

    const expandedTeachers = []

    rawTeachers.forEach((t) => {
      const teacherId = t.id
      const teacherShifts =
        t.shifts && t.shifts.length > 0
          ? t.shifts
          : [{ id: 'default', name: 'General Shift', start_time: '09:00:00' }]

      teacherShifts.forEach((shift) => {
        const shiftId = shift.id
        const shiftName = shift.name || 'General Shift'
        const shiftStartTime = shift.start_time || '09:00:00'

        const record = rawAttendance.find(
          (att) =>
            String(att.teacher_id) === String(teacherId) &&
            att.shift_name?.toLowerCase() === shiftName.toLowerCase(),
        )

        let isPresent = false
        let checkInTime = null
        let rawInTime = null
        let lateMinutes = 0

        if (record) {
          isPresent = record.status === 'Present' || record.status === 'Late'
          rawInTime = record.in_time || null
          checkInTime = rawInTime ? formatTimeTo12Hr(rawInTime) : null
          lateMinutes = calculateLateMinutes(rawInTime, shiftStartTime)
        }

        expandedTeachers.push({
          uniqueKey: `${teacherId}_${shiftId}`,
          id: teacherId,
          shift_id: shiftId,
          shift_name: shiftName,
          shiftStartTime: shiftStartTime,
          teacher_code: t.teacher_code || t.teacher_id || `TCH-${teacherId}`,
          name: t.full_name || t.name || 'Unknown',
          subject: t.department || t.subject || 'N/A',
          image: t.image || null,
          gender: (t.gender || 'male').toLowerCase(),
          isPresent: isPresent,
          checkInTime: checkInTime,
          rawInTime: rawInTime,
          lateMinutes: lateMinutes,
        })
      })
    })

    teachers.value = expandedTeachers
  } catch (error) {
    console.error('Error fetching teachers:', error)
  } finally {
    loading.value = false
  }
}

// --- Checkbox Change Handler ---
const onCheckboxChange = (teacher) => {
  if (teacher.isPresent) {
    teacher.rawInTime = getCurrent24HrTime()
    teacher.checkInTime = formatTimeTo12Hr(teacher.rawInTime)
    teacher.lateMinutes = calculateLateMinutes(teacher.rawInTime, teacher.shiftStartTime)
  } else {
    teacher.checkInTime = null
    teacher.rawInTime = null
    teacher.lateMinutes = 0
  }

  autoSaveSingleTeacher(teacher)
}

// --- API: Save Single Teacher ---
const autoSaveSingleTeacher = async (teacher) => {
  isSyncing.value = true
  saveSuccess.value = false
  try {
    const payload = {
      date: selectedDate.value,
      attendances: [
        {
          teacher_id: teacher.id,
          shift_name: teacher.shift_name,
          status: teacher.isPresent ? (teacher.lateMinutes > 0 ? 'Late' : 'Present') : 'Absent',
          in_time: teacher.isPresent ? teacher.rawInTime || getCurrent24HrTime() : null,
          out_time: null,
          note: teacher.lateMinutes > 0 ? `Late by ${teacher.lateMinutes} mins` : null,
        },
      ],
    }

    await axios.post(`${API_BASE_URL}/teacher-attendances`, payload)

    saveSuccess.value = true
    setTimeout(() => {
      saveSuccess.value = false
    }, 2000)
  } catch (error) {
    console.error('Auto-save error:', error)
  } finally {
    isSyncing.value = false
  }
}

// Helper Functions
const getCurrent24HrTime = () => {
  const now = new Date()
  return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
}

const formatTimeTo12Hr = (time24) => {
  if (!time24) return null
  const [h, m] = time24.split(':')
  let hours = parseInt(h)
  const ampm = hours >= 12 ? 'PM' : 'AM'
  hours = hours % 12 || 12
  return `${String(hours).padStart(2, '0')}:${m} ${ampm}`
}

// --- Dynamic Late Minutes Calculator (Shift Wise) ---
// --- Dynamic Late Minutes Calculator (Fixed & Safe) ---
const calculateLateMinutes = (checkInTime24, shiftStartTime) => {
  if (!checkInTime24 || !shiftStartTime) return 0

  // যদি শিফট স্টার্ট টাইম সেকেন্ড সহ থাকে (যেমন "09:00:00"), তবে শুধু ঘণ্টা ও মিনিট নেব ("09:00")
  const cleanShiftTime = shiftStartTime.substring(0, 5)
  const cleanCheckInTime = checkInTime24.substring(0, 5)

  const [sH, sM] = cleanShiftTime.split(':').map(Number)
  const [cH, cM] = cleanCheckInTime.split(':').map(Number)

  const scheduledMinutes = sH * 60 + sM
  const currentMinutes = cH * 60 + cM

  // যদি বর্তমান চেক-ইন সময় শিফটের সময়ের চেয়ে বেশি হয়, তবেই লেট মিনিট রিটার্ন করবে
  return currentMinutes > scheduledMinutes ? currentMinutes - scheduledMinutes : 0
}

// Bulk Mark All Present
const markAllPresent = async () => {
  filteredTeachers.value.forEach((teacher) => {
    teacher.isPresent = true
    teacher.rawInTime = getCurrent24HrTime()
    teacher.checkInTime = formatTimeTo12Hr(teacher.rawInTime)
    teacher.lateMinutes = calculateLateMinutes(teacher.rawInTime, teacher.shiftStartTime)
  })

  const payload = {
    date: selectedDate.value,
    attendances: filteredTeachers.value.map((t) => ({
      teacher_id: t.id,
      shift_name: t.shift_name,
      status: t.lateMinutes > 0 ? 'Late' : 'Present',
      in_time: t.rawInTime,
      out_time: null,
      note: t.lateMinutes > 0 ? `Late by ${t.lateMinutes} mins` : null,
    })),
  }

  isSyncing.value = true
  try {
    await axios.post(`${API_BASE_URL}/teacher-attendances`, payload)
    saveSuccess.value = true
    setTimeout(() => {
      saveSuccess.value = false
    }, 2000)
  } catch (e) {
    console.error(e)
  } finally {
    isSyncing.value = false
  }
}

// Header Select/Deselect All
const toggleSelectAll = async (event) => {
  const checkState = event.target.checked
  filteredTeachers.value.forEach((teacher) => {
    teacher.isPresent = checkState
    if (checkState) {
      teacher.rawInTime = getCurrent24HrTime()
      teacher.checkInTime = formatTimeTo12Hr(teacher.rawInTime)
      teacher.lateMinutes = calculateLateMinutes(teacher.rawInTime, teacher.shiftStartTime)
    } else {
      teacher.checkInTime = null
      teacher.rawInTime = null
      teacher.lateMinutes = 0
    }
  })

  const payload = {
    date: selectedDate.value,
    attendances: filteredTeachers.value.map((t) => ({
      teacher_id: t.id,
      shift_name: t.shift_name,
      status: t.isPresent ? (t.lateMinutes > 0 ? 'Late' : 'Present') : 'Absent',
      in_time: t.isPresent ? t.rawInTime : null,
      out_time: null,
      note: null,
    })),
  }

  isSyncing.value = true
  try {
    await axios.post(`${API_BASE_URL}/teacher-attendances`, payload)
    saveSuccess.value = true
    setTimeout(() => {
      saveSuccess.value = false
    }, 2000)
  } catch (e) {
    console.error(e)
  } finally {
    isSyncing.value = false
  }
}

// ইউনিক শিফটের নাম এক্সট্রাক্ট করা
const availableShifts = computed(() => {
  const allShiftNames = []
  teachers.value.forEach((t) => {
    if (t.shift_name) allShiftNames.push(t.shift_name)
  })
  return [...new Set(allShiftNames)]
})

// Computed Filter (Search + Database Shift Filter)
const filteredTeachers = computed(() => {
  return teachers.value.filter((t) => {
    const matchesShift =
      !selectedShift.value || t.shift_name.toLowerCase() === selectedShift.value.toLowerCase()

    const query = searchQuery.value.toLowerCase().trim()
    const matchesSearch =
      !query ||
      t.name.toLowerCase().includes(query) ||
      String(t.teacher_code).toLowerCase().includes(query) ||
      t.subject.toLowerCase().includes(query)

    return matchesShift && matchesSearch
  })
})

const isAllSelected = computed(() => {
  return filteredTeachers.value.length > 0 && filteredTeachers.value.every((t) => t.isPresent)
})

const getTeacherPhoto = (gender) => {
  return gender === 'male' || gender === 'm'
    ? 'https://via.placeholder.com/32?text=M'
    : 'https://via.placeholder.com/32?text=F'
}

onMounted(() => {
  fetchAttendanceData()
})
</script>

<style scoped>
/* Main Layout Container */
.dashboard-layout {
  display: flex;
  width: 100%;
  overflow-x: hidden;
}

/* Sidebar Area Wrapper */
.sidebar-wrapper {
  flex-shrink: 0;
  min-width: 250px;
  z-index: 1000;
}

/* Main Content Right Wrapper */
.main-wrapper {
  flex-grow: 1;
  width: calc(100% - 250px);
  overflow-y: auto;
}

/* Responsive Handling for Mobile & Tablet */
@media (max-width: 768px) {
  .dashboard-layout {
    flex-direction: column;
  }
  .sidebar-wrapper {
    width: 100%;
    min-width: 100%;
  }
  .main-wrapper {
    width: 100%;
  }
}

.search-box-wrapper .input-group-text,
.search-box-wrapper .form-control {
  border-color: #e2e8f0;
  border-radius: 6px;
}

.search-box-wrapper .form-control:focus {
  border-color: #cbd5e1;
}

.attendance-table {
  border-collapse: separate;
  border-spacing: 0;
}

.attendance-table thead th {
  border-bottom: 2px solid #e2e8f0 !important;
  font-size: 0.75rem;
  letter-spacing: 0.05em;
  padding-top: 0.85rem;
  padding-bottom: 0.85rem;
}

.attendance-row {
  border-bottom: 1px solid #e2e8f0;
}

.pill-status {
  letter-spacing: 0.05em;
  border: 1px solid transparent;
}

.status-present {
  background-color: rgba(25, 135, 84, 0.1) !important;
  color: #198754 !important;
  border-color: rgba(25, 135, 84, 0.2) !important;
}

.status-absent {
  background-color: rgba(220, 53, 69, 0.1) !important;
  color: #dc3545 !important;
  border-color: rgba(220, 53, 69, 0.2) !important;
}

.custom-checkbox {
  width: 1.25rem;
  height: 1.25rem;
  cursor: pointer;
  border-radius: 4px;
}

.custom-checkbox:checked {
  background-color: #198754;
  border-color: #198754;
}

.teacher-photo-placeholder {
  width: 32px;
  height: 32px;
  background-color: #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.fs-8 {
  font-size: 0.7rem;
}

@media (max-width: 576px) {
  .attendance-table th,
  .attendance-table td {
    padding-left: 0.5rem !important;
    padding-right: 0.5rem !important;
  }
}
</style>
