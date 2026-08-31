<template>
  <div class="dashboard-layout bg-light min-vh-100 d-flex">
    <!-- Left Sidebar Component -->
    <aside class="sidebar-wrapper">
      <dashPageView />
    </aside>

    <!-- Right Main Content Area -->
    <div class="main-wrapper flex-grow-1 min-vh-100 d-flex flex-column">
      <RouterView />

      <!-- Staff Attendance History Section -->
      <main class="attendance-section py-3 py-md-4 px-2 px-md-3">
        <div class="attendance-container bg-white rounded-3 shadow-sm p-3 p-md-4">
          <!-- =====================================================
               TITLE & MONTH SELECTOR
          ====================================================== -->

          <div
            class="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4"
          >
            <div>
              <h2 class="h4 h3-md mb-0 fw-bold text-dark">Staff Attendance History</h2>

              <p class="text-muted mb-0 small">
                View monthly attendance history, check-in, check-out and late records
              </p>
            </div>

            <div class="d-flex flex-wrap align-items-center gap-2 gap-md-3">
              <!-- Month Selector -->
              <div
                class="date-select-wrapper px-3 py-1 py-md-2 bg-light border rounded d-flex align-items-center gap-2 shadow-sm flex-grow-1 flex-md-grow-0"
              >
                <label for="month-select" class="form-label mb-0 fw-semibold text-secondary small">
                  Month:
                </label>

                <input
                  type="month"
                  id="month-select"
                  v-model="selectedMonth"
                  @change="fetchHistoryData"
                  class="form-control form-control-sm border-0 bg-transparent p-0 w-auto flex-grow-1"
                />
              </div>
            </div>
          </div>

          <!-- =====================================================
               HOLIDAY NOTICE
          ====================================================== -->

          <div
            v-if="currentMonthHolidays.length > 0"
            class="alert alert-warning border-0 shadow-sm rounded-3 d-flex align-items-start mb-4 p-3"
            role="alert"
          >
            <i class="bi bi-calendar-check-fill fs-4 me-3 text-warning"></i>

            <div>
              <h6 class="fw-bold text-dark mb-1">Holiday Notice for {{ selectedMonth }}</h6>

              <p class="mb-0 small text-secondary">
                The following holiday(s) are included in the attendance history:

                <span
                  v-for="(holiday, index) in currentMonthHolidays"
                  :key="holiday.id || index"
                  class="fw-semibold text-dark"
                >
                  <strong>
                    {{ holiday.title || 'Holiday' }}
                  </strong>

                  ({{ formatDateOnly(holiday.start_date) }}
                  to
                  {{ formatDateOnly(holiday.end_date) }})

                  <span v-if="index < currentMonthHolidays.length - 1"> , </span>
                </span>
              </p>
            </div>
          </div>

          <!-- =====================================================
               SEARCH & SUMMARY
          ====================================================== -->

          <div
            class="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-2 mb-3"
          >
            <!-- Search -->
            <div class="search-box-wrapper w-100" style="max-width: 350px">
              <div class="input-group input-group-sm">
                <span class="input-group-text bg-white border-end-0 text-muted ps-3">
                  <i class="bi bi-search"></i>
                </span>

                <input
                  type="text"
                  v-model="searchQuery"
                  class="form-control border-start-0 ps-0 shadow-none"
                  placeholder="Search Staff ID or Name..."
                />
              </div>
            </div>

            <!-- Summary -->
            <div class="text-muted small align-self-start align-self-sm-center">
              <span class="badge bg-light text-secondary border px-3 py-2 rounded-pill shadow-sm">
                Total Records:

                <strong>
                  {{ filteredHistory.length }}
                </strong>
              </span>
            </div>
          </div>

          <!-- =====================================================
               HISTORY TABLE
          ====================================================== -->

          <div class="card border-0 shadow-sm">
            <div class="card-body p-0">
              <div class="table-responsive">
                <table class="table table-hover align-middle mb-0 attendance-table">
                  <thead class="table-light">
                    <tr class="fw-semibold text-secondary small">
                      <th scope="col" class="ps-3 ps-md-4">DATE</th>

                      <th scope="col">STAFF ID</th>

                      <th scope="col">STAFF NAME</th>

                      <th scope="col">SHIFT</th>

                      <th scope="col" class="text-center">CHECK IN</th>

                      <th scope="col" class="text-center">CHECK OUT</th>

                      <th scope="col" class="text-center">WORKING TIME</th>

                      <th scope="col" class="text-center">STATUS / LATE</th>

                      <th scope="col" class="text-end pe-3 pe-md-4">NOTE</th>
                    </tr>
                  </thead>

                  <tbody>
                    <!-- Loading -->
                    <tr v-if="loading">
                      <td colspan="9" class="text-center py-4 text-muted">
                        <div class="spinner-border spinner-border-sm me-2" role="status"></div>

                        Loading attendance history...
                      </td>
                    </tr>

                    <!-- History Rows -->
                    <tr
                      v-else
                      v-for="(item, index) in filteredHistory"
                      :key="item.uniqueKey || index"
                      class="attendance-row"
                      :class="{
                        'holiday-row': item.status === 'Holiday',
                      }"
                    >
                      <!-- DATE -->
                      <td class="ps-3 ps-md-4 font-monospace small text-nowrap">
                        <span
                          class="fw-semibold"
                          :class="item.status === 'Holiday' ? 'text-warning' : 'text-dark'"
                        >
                          {{ item.date }}
                        </span>
                      </td>

                      <!-- STAFF ID -->
                      <td>
                        <div class="fw-semibold text-dark text-uppercase small">
                          {{ item.code }}
                        </div>
                      </td>

                      <!-- STAFF NAME -->
                      <td>
                        <div class="fw-bold text-dark text-uppercase small text-nowrap">
                          {{ item.name }}
                        </div>
                      </td>

                      <!-- SHIFT -->
                      <td>
                        <span
                          v-if="item.shiftNames && item.shiftNames.length"
                          class="badge bg-secondary text-white"
                        >
                          {{ item.shiftNames.join(', ') }}
                        </span>

                        <span v-else class="text-muted small"> General Shift </span>
                      </td>

                      <!-- CHECK IN -->
                      <td class="text-center font-monospace small text-nowrap">
                        <span v-if="item.checkIn" class="fw-semibold text-dark">
                          {{ item.checkIn }}
                        </span>

                        <span v-else class="text-muted"> - </span>
                      </td>

                      <!-- CHECK OUT -->
                      <td class="text-center font-monospace small text-nowrap">
                        <span v-if="item.checkOut" class="fw-semibold text-dark">
                          {{ formatTimeTo12Hr(item.checkOut) }}
                        </span>

                        <span v-else class="text-muted"> - </span>
                      </td>

                      <!-- WORKING TIME -->
                      <td class="text-center font-monospace small text-nowrap">
                        <span
                          v-if="item.workingHours"
                          class="badge bg-info bg-opacity-10 text-info fw-semibold border border-info border-opacity-25 px-2 py-1"
                        >
                          {{ item.workingHours }}
                        </span>

                        <span v-else class="text-muted"> - </span>
                      </td>

                      <!-- STATUS -->
                      <td class="text-center text-nowrap">
                        <!-- LATE -->
                        <span
                          v-if="item.status === 'Late'"
                          class="badge bg-danger rounded-pill fw-bold text-uppercase fs-8 px-2 py-1"
                        >
                          LATE: {{ item.lateMinutes }} MIN
                        </span>

                        <!-- PRESENT -->
                        <span
                          v-else-if="item.status === 'Present'"
                          class="badge bg-success rounded-pill fw-bold text-uppercase fs-8 px-2 py-1"
                        >
                          ON TIME
                        </span>

                        <!-- HOLIDAY -->
                        <span
                          v-else-if="item.status === 'Holiday'"
                          class="badge bg-warning text-dark rounded-pill fw-bold text-uppercase fs-8 px-3 py-1"
                        >
                          HOLIDAY
                        </span>

                        <!-- LEAVE -->
                        <span
                          v-else-if="item.status === 'Leave'"
                          class="badge bg-info text-dark rounded-pill fw-bold text-uppercase fs-8 px-3 py-1"
                        >
                          LEAVE
                        </span>

                        <!-- ABSENT / OTHER -->
                        <span
                          v-else
                          class="badge bg-secondary rounded-pill fw-bold text-uppercase fs-8 px-2 py-1"
                        >
                          {{ item.status }}
                        </span>
                      </td>

                      <!-- NOTE -->
                      <td
                        class="text-end pe-3 pe-md-4 small"
                        :class="
                          item.status === 'Holiday' ? 'text-warning fw-semibold' : 'text-muted'
                        "
                      >
                        {{ item.note }}
                      </td>
                    </tr>

                    <!-- Empty -->
                    <tr v-if="!loading && filteredHistory.length === 0">
                      <td colspan="9" class="text-center py-4 text-muted">
                        No attendance history found for this month.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

import dashPageView from './dashPageView.vue'

import api from '@/services/api'

/* =========================================================
   CURRENT MONTH
========================================================= */

const getCurrentYearMonth = () => {
  const now = new Date()

  const year = now.getFullYear()

  const month = String(now.getMonth() + 1).padStart(2, '0')

  return `${year}-${month}`
}

/* =========================================================
   STATES
========================================================= */

const selectedMonth = ref(getCurrentYearMonth())

const historyList = ref([])

const loading = ref(false)

const searchQuery = ref('')

const holidays = ref([])

/* =========================================================
   DATE FORMATTER
========================================================= */

const formatDateOnly = (dateValue) => {
  if (!dateValue) {
    return 'N/A'
  }

  /*
   * Converts:
   *
   * 2026-08-27T00:00:00.000000Z
   *
   * to:
   *
   * 2026-08-27
   */

  return String(dateValue).split('T')[0]
}

/* =========================================================
   EXTRACT TIME
========================================================= */

const extractTimeOnly = (dateTimeStr) => {
  if (!dateTimeStr) {
    return null
  }

  if (typeof dateTimeStr !== 'string') {
    return null
  }

  if (dateTimeStr.includes('T')) {
    dateTimeStr = dateTimeStr.split('T')[1]
  } else if (dateTimeStr.includes(' ')) {
    dateTimeStr = dateTimeStr.split(' ')[1]
  }

  return dateTimeStr.substring(0, 5)
}

/* =========================================================
   FORMAT TIME
========================================================= */

const formatTimeTo12Hr = (time24) => {
  const cleanTime = extractTimeOnly(time24)

  if (!cleanTime) {
    return null
  }

  const [h, m] = cleanTime.split(':')

  let hours = parseInt(h)

  const ampm = hours >= 12 ? 'PM' : 'AM'

  hours = hours % 12 || 12

  return `${String(hours).padStart(2, '0')}:${m} ${ampm}`
}

/* =========================================================
   CALCULATE LATE MINUTES
========================================================= */

const calculateLateMinutes = (checkInTime24, shiftStartTime) => {
  const cleanIn = extractTimeOnly(checkInTime24)

  const cleanShift = extractTimeOnly(shiftStartTime)

  if (!cleanIn || !cleanShift) {
    return 0
  }

  const [shiftHours, shiftMinutes] = cleanShift.split(':').map(Number)

  const [checkInHours, checkInMinutes] = cleanIn.split(':').map(Number)

  const scheduledTotalMinutes = shiftHours * 60 + shiftMinutes

  const checkInTotalMinutes = checkInHours * 60 + checkInMinutes

  if (checkInTotalMinutes > scheduledTotalMinutes) {
    return checkInTotalMinutes - scheduledTotalMinutes
  }

  return 0
}

/* =========================================================
   CALCULATE WORKING HOURS
========================================================= */

const calculateWorkingHours = (inTime24, outTime24) => {
  const cleanIn = extractTimeOnly(inTime24)

  const cleanOut = extractTimeOnly(outTime24)

  if (!cleanIn || !cleanOut) {
    return null
  }

  const [inH, inM] = cleanIn.split(':').map(Number)

  const [outH, outM] = cleanOut.split(':').map(Number)

  const inTotalMins = inH * 60 + inM

  const outTotalMins = outH * 60 + outM

  if (outTotalMins <= inTotalMins) {
    return '0h 0m'
  }

  const diffMins = outTotalMins - inTotalMins

  const hours = Math.floor(diffMins / 60)

  const minutes = diffMins % 60

  return `${hours}h ${minutes}m`
}

/* =========================================================
   FETCH HOLIDAYS
========================================================= */

const fetchHolidays = async () => {
  try {
    const response = await api.get('/holidays')

    holidays.value = response.data.data || response.data || []

    if (!Array.isArray(holidays.value)) {
      holidays.value = []
    }
  } catch (error) {
    console.error('Error fetching holidays:', error)

    holidays.value = []
  }
}

/* =========================================================
   HOLIDAYS OF SELECTED MONTH
========================================================= */

const currentMonthHolidays = computed(() => {
  if (!Array.isArray(holidays.value)) {
    return []
  }

  const monthStart = `${selectedMonth.value}-01`

  const [year, month] = selectedMonth.value.split('-').map(Number)

  const lastDay = new Date(year, month, 0).getDate()

  const monthEnd = `${selectedMonth.value}-${String(lastDay).padStart(2, '0')}`

  return holidays.value.filter((holiday) => {
    if (!holiday || !holiday.start_date || !holiday.end_date) {
      return false
    }

    const startDate = formatDateOnly(holiday.start_date)

    const endDate = formatDateOnly(holiday.end_date)

    /*
     * Detect date-range overlap.
     */

    return startDate <= monthEnd && endDate >= monthStart
  })
})

/* =========================================================
   GET HOLIDAY DATES
========================================================= */

const getHolidayDatesForSelectedMonth = () => {
  const result = []

  const monthStart = `${selectedMonth.value}-01`

  const [year, month] = selectedMonth.value.split('-').map(Number)

  const lastDay = new Date(year, month, 0).getDate()

  const monthEnd = `${selectedMonth.value}-${String(lastDay).padStart(2, '0')}`

  currentMonthHolidays.value.forEach((holiday) => {
    let startDate = formatDateOnly(holiday.start_date)

    let endDate = formatDateOnly(holiday.end_date)

    /*
     * Keep only dates
     * inside selected month.
     */

    if (startDate < monthStart) {
      startDate = monthStart
    }

    if (endDate > monthEnd) {
      endDate = monthEnd
    }

    let current = new Date(`${startDate}T00:00:00`)

    const end = new Date(`${endDate}T00:00:00`)

    while (current <= end) {
      const date = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(
        2,
        '0',
      )}-${String(current.getDate()).padStart(2, '0')}`

      result.push({
        date: date,

        title: holiday.title || 'Holiday',

        holiday_id: holiday.id || null,
      })

      current.setDate(current.getDate() + 1)
    }
  })

  /*
   * Remove duplicate holiday dates.
   */

  const uniqueDates = []

  const seen = new Set()

  result.forEach((item) => {
    if (!seen.has(item.date)) {
      seen.add(item.date)

      uniqueDates.push(item)
    }
  })

  return uniqueDates
}

/* =========================================================
   FETCH STAFF ATTENDANCE HISTORY
========================================================= */

const fetchHistoryData = async () => {
  loading.value = true

  try {
    /* =====================================================
       FETCH STAFF
    ====================================================== */

    let staffList = []

    try {
      const staffResponse = await api.get('/staff')

      const rawStaff = staffResponse.data

      if (Array.isArray(rawStaff)) {
        staffList = rawStaff
      } else if (rawStaff && Array.isArray(rawStaff.data)) {
        staffList = rawStaff.data
      }
    } catch (staffError) {
      console.warn('Could not fetch staff list:', staffError)
    }

    /* =====================================================
       FETCH ATTENDANCE
    ====================================================== */

    const response = await api.get('/staff-attendances', {
      params: {
        month: selectedMonth.value,
      },
    })

    let rawData = []

    if (Array.isArray(response.data)) {
      rawData = response.data
    } else if (response.data && Array.isArray(response.data.data)) {
      rawData = response.data.data
    }

    /* =====================================================
       MAP ATTENDANCE
    ====================================================== */

    const attendanceRows = rawData.map((att, index) => {
      const staff = att.staff || att.employee || {}

      const rawInTime = att.in_time || null

      const rawOutTime = att.out_time || null

      const shiftStart =
        att.shift?.start_time || att.shift_start_time || staff.shift?.start_time || '09:00:00'

      const lateMins = calculateLateMinutes(rawInTime, shiftStart)

      const workingHours = calculateWorkingHours(rawInTime, rawOutTime)

      /* =================================================
             SHIFT
          ================================================== */

      let shiftNamesArr = []

      if (att.shift_name) {
        shiftNamesArr = [att.shift_name]
      } else if (att.shift && att.shift.name) {
        shiftNamesArr = [att.shift.name]
      } else if (Array.isArray(staff.shifts)) {
        shiftNamesArr = staff.shifts
          .map((shift) => (typeof shift === 'object' ? shift.name : shift))
          .filter(Boolean)
      }

      /* =================================================
             STATUS
          ================================================== */

      let computedStatus = att.status || 'Absent'

      /*
       * Preserve Leave and Holiday.
       */

      if (computedStatus !== 'Leave' && computedStatus !== 'Holiday') {
        if (rawInTime && lateMins > 0) {
          computedStatus = 'Late'
        } else if (rawInTime && lateMins === 0) {
          computedStatus = 'Present'
        }
      }

      /* =================================================
             DATE
          ================================================== */

      const rawDate = att.date || att.attendance_date || null

      /*
       * IMPORTANT:
       *
       * Converts:
       * 2026-08-27T00:00:00.000000Z
       *
       * to:
       * 2026-08-27
       */

      const formattedDate = formatDateOnly(rawDate)

      return {
        uniqueKey: `attendance-${att.id || index}`,

        date: formattedDate,

        name: staff.name || staff.full_name || att.staff_name || 'Unknown',

        code: staff.staff_code || staff.employee_code || staff.id || att.staff_id || 'N/A',

        shiftNames: shiftNamesArr,

        checkIn: rawInTime ? formatTimeTo12Hr(rawInTime) : null,

        checkOut: rawOutTime,

        workingHours: workingHours,

        status: computedStatus,

        lateMinutes: lateMins,

        note: att.note || '-',

        staffId: att.staff_id || staff.id || null,

        isHoliday: computedStatus === 'Holiday',
      }
    })

    /* =====================================================
       HOLIDAY ROWS
    ====================================================== */

    const holidayDates = getHolidayDatesForSelectedMonth()

    let staffForHoliday = staffList

    /*
     * If /staff didn't return data,
     * use staff from attendance.
     */

    if (staffForHoliday.length === 0) {
      const staffMap = new Map()

      rawData.forEach((att) => {
        const staff = att.staff || att.employee || {}

        const staffId = att.staff_id || staff.id

        if (staffId && !staffMap.has(String(staffId))) {
          staffMap.set(String(staffId), {
            ...staff,
            id: staffId,
          })
        }
      })

      staffForHoliday = Array.from(staffMap.values())
    }

    const holidayRows = []

    holidayDates.forEach((holiday) => {
      staffForHoliday.forEach((staff) => {
        const staffId = staff.id || staff.staff_id

        /*
         * Check if attendance already exists
         * for this staff on this date.
         */

        const existingAttendance = attendanceRows.find(
          (row) => row.date === holiday.date && String(row.staffId) === String(staffId),
        )

        /*
         * If attendance exists,
         * don't create duplicate Holiday row.
         */

        if (existingAttendance) {
          return
        }

        /* =================================================
               STAFF SHIFT
            ================================================== */

        let shiftNamesArr = []

        if (Array.isArray(staff.shifts) && staff.shifts.length > 0) {
          shiftNamesArr = staff.shifts
            .map((shift) => (typeof shift === 'object' ? shift.name : shift))
            .filter(Boolean)
        } else if (staff.shift) {
          if (typeof staff.shift === 'object' && staff.shift.name) {
            shiftNamesArr = [staff.shift.name]
          } else if (typeof staff.shift === 'string') {
            shiftNamesArr = [staff.shift]
          }
        }

        /* =================================================
               CREATE HOLIDAY ROW
            ================================================== */

        holidayRows.push({
          uniqueKey: `holiday-${holiday.date}-${staffId}`,

          date: holiday.date,

          name: staff.name || staff.full_name || 'Unknown',

          code: staff.staff_code || staff.employee_code || staff.id || 'N/A',

          shiftNames: shiftNamesArr,

          checkIn: null,

          checkOut: null,

          workingHours: null,

          status: 'Holiday',

          lateMinutes: 0,

          note: holiday.title || 'Holiday',

          staffId: staffId,

          isHoliday: true,
        })
      })
    })

    /* =====================================================
       MERGE
    ====================================================== */

    const mergedRows = [...attendanceRows, ...holidayRows]

    /* =====================================================
       SORT BY DATE
    ====================================================== */

    mergedRows.sort((a, b) => {
      if (a.date !== b.date) {
        return a.date.localeCompare(b.date)
      }

      return String(a.name).localeCompare(String(b.name))
    })

    historyList.value = mergedRows
  } catch (error) {
    console.error('Error fetching staff attendance history:', error)

    historyList.value = []
  } finally {
    loading.value = false
  }
}

/* =========================================================
   FILTERED HISTORY
========================================================= */

const filteredHistory = computed(() => {
  const query = searchQuery.value.toLowerCase().trim()

  return historyList.value.filter((item) => {
    return (
      !query ||
      String(item.name || '')
        .toLowerCase()
        .includes(query) ||
      String(item.code || '')
        .toLowerCase()
        .includes(query)
    )
  })
})

/* =========================================================
   ON MOUNT
========================================================= */

onMounted(async () => {
  await fetchHolidays()

  await fetchHistoryData()
})
</script>

<style scoped>
.dashboard-layout {
  display: flex;
  width: 100%;
  overflow-x: hidden;
}

.sidebar-wrapper {
  flex-shrink: 0;
  min-width: 250px;
  z-index: 1000;
}

.main-wrapper {
  flex-grow: 1;
  width: calc(100% - 250px);
  overflow-y: auto;
}

/* =========================================================
   SEARCH BOX
========================================================= */

.search-box-wrapper .input-group-text,
.search-box-wrapper .form-control {
  border-color: #e2e8f0;
  border-radius: 6px;
}

/* =========================================================
   ATTENDANCE TABLE
========================================================= */

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

/* =========================================================
   HOLIDAY ROW
========================================================= */

.holiday-row {
  background-color: #fffaf0 !important;
}

.holiday-row td {
  border-bottom: 1px solid #ffe69c !important;
}

/* =========================================================
   SMALL BADGE
========================================================= */

.fs-8 {
  font-size: 0.7rem;
}

/* =========================================================
   MOBILE
========================================================= */

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
</style>
