<template>
  <div class="dashboard-layout bg-light min-vh-100 d-flex">
    <aside class="sidebar-wrapper">
      <dashPageView />
    </aside>

    <div class="main-wrapper flex-grow-1 min-vh-100 d-flex flex-column">
      <RouterView />

      <main class="attendance-section py-3 py-md-4 px-2 px-md-3">
        <div class="container-fluid p-0">
          <!-- 1. Header & Quick Stats Cards -->
          <div class="row mb-4">
            <div class="col-12 mb-3">
              <h2 class="h4 h3-md mb-1 fw-bold text-dark">Attendance History</h2>
              <p class="text-muted small mb-0">
                Track and analyze past attendance records shift-wise
              </p>
            </div>

            <div class="col-xl-3 col-md-6 mb-3">
              <div
                class="card border-0 shadow-sm p-3 border-start border-primary border-4 rounded-3"
              >
                <small class="text-muted fw-semibold">Total Records</small>
                <h4 class="fw-bold mb-0 mt-1">{{ filteredHistory.length }}</h4>
              </div>
            </div>
            <div class="col-xl-3 col-md-6 mb-3">
              <div
                class="card border-0 shadow-sm p-3 border-start border-success border-4 rounded-3"
              >
                <small class="text-muted fw-semibold">Total Present / Late</small>
                <h4 class="fw-bold mb-0 mt-1 text-success">{{ totalPresentCount }}</h4>
              </div>
            </div>
            <div class="col-xl-3 col-md-6 mb-3">
              <div
                class="card border-0 shadow-sm p-3 border-start border-warning border-4 rounded-3"
              >
                <small class="text-muted fw-semibold">Late Arrivals</small>
                <h4 class="fw-bold mb-0 mt-1 text-warning">{{ totalLateCount }}</h4>
              </div>
            </div>
            <div class="col-xl-3 col-md-6 mb-3">
              <div
                class="card border-0 shadow-sm p-3 border-start border-danger border-4 rounded-3"
              >
                <small class="text-muted fw-semibold">Total Absents</small>
                <h4 class="fw-bold mb-0 mt-1 text-danger">{{ totalAbsentCount }}</h4>
              </div>
            </div>
          </div>

          <!-- 2. Filter Bar Section -->
          <div class="card border-0 shadow-sm mb-4 rounded-3">
            <div
              class="card-body d-flex flex-wrap justify-content-between align-items-center gap-3"
            >
              <!-- Shift Filter Buttons -->
              <div class="btn-group btn-group-sm" role="group">
                <button
                  type="button"
                  class="btn"
                  :class="selectedShift === '' ? 'btn-primary' : 'btn-outline-primary'"
                  @click="filterByShift('')"
                >
                  All Shifts
                </button>
                <button
                  v-for="shiftName in availableShifts"
                  :key="shiftName"
                  type="button"
                  class="btn"
                  :class="selectedShift === shiftName ? 'btn-primary' : 'btn-outline-primary'"
                  @click="filterByShift(shiftName)"
                >
                  {{ shiftName }}
                </button>
              </div>

              <!-- Month Filter -->
              <div class="d-flex align-items-center gap-2">
                <input
                  type="month"
                  v-model="selectedMonth"
                  @change="fetchHistoryData"
                  class="form-control form-control-sm border shadow-sm"
                />
              </div>

              <!-- Search Box -->
              <div class="search-box-wrapper" style="max-width: 250px">
                <input
                  type="text"
                  v-model="searchQuery"
                  @input="currentPage = 1"
                  class="form-control form-control-sm shadow-none"
                  placeholder="Search name or ID..."
                />
              </div>
            </div>
          </div>

          <!-- 3. History Main Table Card -->
          <div class="card border-0 shadow-sm rounded-3">
            <div class="card-body p-0">
              <div class="table-responsive">
                <table class="table table-hover align-middle mb-0">
                  <thead class="table-light">
                    <tr class="small text-secondary fw-semibold">
                      <th class="ps-3 ps-md-4 py-3">DATE</th>
                      <th class="py-3">TEACHER NAME</th>
                      <th class="py-3">SHIFTS</th>
                      <th class="text-center py-3">CHECK-IN</th>
                      <th class="text-center py-3">STATUS</th>
                      <th class="text-center py-3 text-danger">LATE TIME</th>
                      <th class="text-end pe-3 pe-md-4 py-3">NOTE</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-if="loading">
                      <td colspan="7" class="text-center py-4 text-muted">
                        <div class="spinner-border spinner-border-sm me-2" role="status"></div>
                        Loading attendance history...
                      </td>
                    </tr>

                    <tr v-else v-for="(item, index) in paginatedHistory" :key="index">
                      <td class="ps-3 ps-md-4">
                        <div class="fw-bold text-dark">{{ item.date }}</div>
                      </td>
                      <td>
                        <div class="d-flex align-items-center gap-2">
                          <div>
                            <div class="fw-bold text-dark text-uppercase small">
                              {{ item.name }}
                            </div>
                            <small class="text-muted text-uppercase">{{ item.code }}</small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div class="d-flex flex-wrap gap-1">
                          <span
                            v-for="sName in item.shiftNames"
                            :key="sName"
                            class="badge bg-secondary text-white"
                          >
                            {{ sName }}
                          </span>
                          <span
                            v-if="!item.shiftNames || item.shiftNames.length === 0"
                            class="text-muted small"
                          >
                            N/A
                          </span>
                        </div>
                      </td>
                      <td class="text-center font-monospace small fw-semibold">
                        {{ item.checkIn || '-' }}
                      </td>
                      <td class="text-center">
                        <span
                          class="badge rounded-pill px-3 py-1"
                          :class="{
                            'bg-success': item.status === 'Present',
                            'bg-warning text-dark': item.status === 'Late',
                            'bg-danger': item.status === 'Absent',
                          }"
                        >
                          {{ item.status }}
                        </span>
                      </td>
                      <td class="text-center">
                        <span
                          v-if="item.lateMinutes > 0"
                          class="badge bg-danger text-white fw-bold px-2 py-1"
                        >
                          {{ item.lateMinutes }} MIN
                        </span>
                        <span v-else class="text-muted small">-</span>
                      </td>
                      <td class="text-end pe-3 pe-md-4 text-muted small">
                        {{ item.note || '-' }}
                      </td>
                    </tr>

                    <tr v-if="!loading && paginatedHistory.length === 0">
                      <td colspan="7" class="text-center py-4 text-muted">
                        No history records found matching your criteria.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Card Footer / Pagination -->
            <div
              class="card-footer bg-white d-flex flex-column flex-sm-row justify-content-between align-items-center py-3 gap-2"
            >
              <small class="text-muted">
                Showing {{ paginatedHistory.length ? (currentPage - 1) * itemsPerPage + 1 : 0 }} to
                {{ Math.min(currentPage * itemsPerPage, filteredHistory.length) }} of
                {{ filteredHistory.length }} entries
              </small>

              <nav aria-label="Page navigation" v-if="totalPages > 1">
                <ul class="pagination pagination-sm m-0">
                  <li class="page-item" :class="{ disabled: currentPage === 1 }">
                    <button class="page-link" @click="changePage(currentPage - 1)">Previous</button>
                  </li>

                  <li
                    v-for="page in totalPages"
                    :key="page"
                    class="page-item"
                    :class="{ active: currentPage === page }"
                  >
                    <button class="page-link" @click="changePage(page)">{{ page }}</button>
                  </li>

                  <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                    <button class="page-link" @click="changePage(currentPage + 1)">Next</button>
                  </li>
                </ul>
              </nav>
            </div>
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

const API_BASE_URL = 'http://127.0.0.1:8000/api'

const SCHEDULED_HOUR = 9
const SCHEDULED_MINUTE = 0

const currentDateObj = new Date()
const currentMonthStr = `${currentDateObj.getFullYear()}-${String(currentDateObj.getMonth() + 1).padStart(2, '0')}`

const selectedShift = ref('')
const selectedMonth = ref(currentMonthStr)
const searchQuery = ref('')
const loading = ref(false)
const historyList = ref([])

const currentPage = ref(1)
const itemsPerPage = ref(10)

const formatTimeTo12Hr = (time24) => {
  if (!time24) return null
  const [h, m] = time24.split(':')
  let hours = parseInt(h)
  const ampm = hours >= 12 ? 'PM' : 'AM'
  hours = hours % 12 || 12
  return `${String(hours).padStart(2, '0')}:${m} ${ampm}`
}

const calculateLateMinutes = (time24) => {
  if (!time24) return 0
  const [h, m] = time24.split(':').map(Number)
  const currentMinutes = h * 60 + m
  const scheduledMinutes = SCHEDULED_HOUR * 60 + SCHEDULED_MINUTE
  return currentMinutes > scheduledMinutes ? currentMinutes - scheduledMinutes : 0
}

const fetchHistoryData = async () => {
  loading.value = true
  try {
    const response = await axios.get(`${API_BASE_URL}/teacher-attendances`, {
      params: { month: selectedMonth.value },
    })

    let rawData = Array.isArray(response.data) ? response.data : response.data.data || []

    historyList.value = rawData.map((att) => {
      const teacher = att.teacher || {}
      const rawInTime = att.in_time || null
      const lateMins = calculateLateMinutes(rawInTime)

      let shiftNamesArr = []
      if (Array.isArray(teacher.shifts)) {
        shiftNamesArr = teacher.shifts.map((s) => s.name || s).filter(Boolean)
      } else if (teacher.shift) {
        if (typeof teacher.shift === 'object' && teacher.shift.name) {
          shiftNamesArr = [teacher.shift.name]
        } else if (typeof teacher.shift === 'string') {
          shiftNamesArr = [teacher.shift]
        }
      }

      return {
        date: att.date || 'N/A',
        name: teacher.name || teacher.full_name || 'Unknown',
        code: teacher.teacher_code || teacher.id || 'N/A',
        shiftNames: shiftNamesArr,
        checkIn: rawInTime ? formatTimeTo12Hr(rawInTime) : null,
        status: att.status || 'Absent',
        lateMinutes: lateMins,
        note: att.note || '-',
      }
    })
    currentPage.value = 1
  } catch (error) {
    console.error('Error fetching attendance history:', error)
  } finally {
    loading.value = false
  }
}

const filterByShift = (shiftName) => {
  selectedShift.value = shiftName
  currentPage.value = 1
}

const availableShifts = computed(() => {
  const allShiftNames = []
  historyList.value.forEach((item) => {
    if (Array.isArray(item.shiftNames)) {
      item.shiftNames.forEach((name) => {
        if (name) allShiftNames.push(name)
      })
    }
  })
  return [...new Set(allShiftNames)]
})

const filteredHistory = computed(() => {
  return historyList.value.filter((item) => {
    const matchesShift =
      !selectedShift.value ||
      (Array.isArray(item.shiftNames) &&
        item.shiftNames.some((name) => name.toLowerCase() === selectedShift.value.toLowerCase()))

    const query = searchQuery.value.toLowerCase().trim()
    const matchesSearch =
      !query ||
      item.name.toLowerCase().includes(query) ||
      String(item.code).toLowerCase().includes(query)

    return matchesShift && matchesSearch
  })
})

const totalPages = computed(() => {
  return Math.ceil(filteredHistory.value.length / itemsPerPage.value) || 1
})

const paginatedHistory = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredHistory.value.slice(start, end)
})

const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

const totalPresentCount = computed(() => {
  return filteredHistory.value.filter((item) => item.status === 'Present' || item.status === 'Late')
    .length
})

const totalLateCount = computed(() => {
  return filteredHistory.value.filter((item) => item.status === 'Late' || item.lateMinutes > 0)
    .length
})

const totalAbsentCount = computed(() => {
  return filteredHistory.value.filter((item) => item.status === 'Absent').length
})

onMounted(() => {
  fetchHistoryData()
})
</script>

<style scoped>
.main-wrapper {
  margin-left: 260px;
  width: calc(100% - 260px);
}

@media (max-width: 768px) {
  .main-wrapper {
    margin-left: 0;
    width: 100%;
  }
}
</style>
