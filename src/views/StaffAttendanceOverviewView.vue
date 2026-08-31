<template>
  <div class="dashboard-layout bg-light min-vh-100 d-flex">
    <!-- Left Sidebar -->
    <aside class="sidebar-wrapper">
      <dashPageView />
    </aside>

    <!-- Main Content -->
    <div class="main-wrapper flex-grow-1 min-vh-100 d-flex flex-column">
      <RouterView />

      <main class="attendance-summary-section py-3 py-md-4 px-2 px-md-3">
        <div class="container-fluid p-0">
          <!-- Page Header -->
          <div class="row mb-4">
            <div class="col-12 d-flex justify-content-between align-items-center">
              <div>
                <h2 class="h4 fw-bold text-dark mb-1">Staff Attendance Yearly Summary</h2>
                <p class="text-muted small mb-0">
                  Overview of staff attendance, shift-wise late time, and working hours
                </p>
              </div>
              <!-- Year Filter -->
              <div>
                <select
                  v-model="selectedYear"
                  @change="fetchAllData"
                  class="form-select form-select-sm"
                >
                  <option value="2026">2026</option>
                  <option value="2025">2025</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Main Table: All Staff Summary -->
          <div class="card border-0 shadow-sm rounded-3">
            <div class="card-body p-0">
              <div class="table-responsive">
                <table class="table table-hover align-middle mb-0">
                  <thead class="table-light">
                    <tr class="small text-secondary fw-semibold">
                      <th class="ps-4 py-3">STAFF NAME</th>
                      <th class="py-3">SHIFT(S)</th>
                      <th class="text-center py-3 text-success">TOTAL PRESENT</th>
                      <th class="text-center py-3 text-warning">TOTAL LATE</th>
                      <th class="text-center py-3 text-danger">TOTAL LATE TIME</th>
                      <th class="text-center py-3 text-danger">TOTAL ABSENT</th>
                      <th class="text-center py-3 text-secondary">TOTAL LEAVE</th>
                      <th class="text-center py-3 text-info">TOTAL WORKING TIME</th>
                      <th class="text-end pe-4 py-3">ACTION</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-if="loading">
                      <td colspan="9" class="text-center py-4 text-muted">
                        <div class="spinner-border spinner-border-sm me-2" role="status"></div>
                        Calculating yearly reports...
                      </td>
                    </tr>
                    <tr v-else v-for="staff in computedStaffSummary" :key="staff.id">
                      <td class="ps-4">
                        <div class="fw-bold text-dark text-uppercase">{{ staff.name }}</div>
                        <small class="text-muted text-uppercase">{{ staff.code }}</small>
                      </td>
                      <td>
                        <div class="d-flex flex-wrap gap-1">
                          <span v-for="s in staff.shifts" :key="s" class="badge bg-secondary">
                            {{ s }}
                          </span>
                        </div>
                      </td>
                      <td class="text-center fw-bold text-success">{{ staff.total_present }}</td>
                      <td class="text-center fw-bold text-warning">{{ staff.total_late }}</td>
                      <td class="text-center font-monospace">
                        <span
                          class="badge bg-danger bg-opacity-10 text-danger fw-semibold border border-danger border-opacity-25 px-2 py-1"
                        >
                          {{ staff.totalLateTimeFormatted }}
                        </span>
                      </td>
                      <td class="text-center fw-bold text-danger">{{ staff.total_absent }}</td>
                      <td class="text-center fw-bold text-secondary">{{ staff.total_leave }}</td>
                      <td class="text-center font-monospace">
                        <span
                          class="badge bg-info bg-opacity-10 text-info fw-semibold border border-info border-opacity-25 px-2 py-1"
                        >
                          {{ staff.yearlyWorkingTime }}
                        </span>
                      </td>
                      <td class="text-end pe-4">
                        <button
                          class="btn btn-sm btn-outline-primary fw-semibold"
                          @click="viewStaffDetails(staff)"
                        >
                          👁️ View Report
                        </button>
                      </td>
                    </tr>
                    <tr v-if="!loading && computedStaffSummary.length === 0">
                      <td colspan="9" class="text-center py-4 text-muted">
                        No records found for this year.
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

    <!-- Modal for Single Staff Month-wise Report -->
    <div class="modal fade" id="staffReportModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-xl modal-dialog-centered">
        <div class="modal-content border-0 shadow">
          <div class="modal-header bg-light">
            <h5 class="modal-title fw-bold">
              {{ selectedStaff?.name }} - Yearly Report ({{ selectedYear }})
            </h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body p-0">
            <div class="table-responsive">
              <table class="table table-bordered mb-0 align-middle">
                <thead class="table-dark text-white small">
                  <tr>
                    <th class="ps-3">MONTH</th>
                    <th class="text-center">PRESENT</th>
                    <th class="text-center">LATE</th>
                    <th class="text-center">LATE TIME</th>
                    <th class="text-center">ABSENT</th>
                    <th class="text-center">LEAVE</th>
                    <th class="text-center">TOTAL RECORDS</th>
                    <th class="text-center">MONTHLY WORKING TIME</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="month in selectedStaffMonthlyReports" :key="month.monthNumber">
                    <td class="ps-3 fw-bold text-primary">{{ month.monthName }}</td>
                    <td class="text-center text-success fw-semibold">{{ month.present }}</td>
                    <td class="text-center fw-semibold text-warning">{{ month.late }}</td>
                    <td class="text-center text-danger fw-bold font-monospace">
                      <span
                        class="badge bg-danger bg-opacity-10 text-danger border border-danger border-opacity-25 px-2 py-1"
                      >
                        {{ month.totalLateTimeFormatted }}
                      </span>
                    </td>
                    <td class="text-center text-danger fw-semibold">{{ month.absent }}</td>
                    <td class="text-center text-secondary fw-semibold">{{ month.leave }}</td>
                    <td class="text-center">{{ month.totalRecords }}</td>
                    <td class="text-center font-monospace">
                      <span
                        class="badge bg-info bg-opacity-10 text-info fw-semibold border border-info border-opacity-25 px-2 py-1"
                      >
                        {{ month.monthlyWorkingTime }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div class="modal-footer bg-light">
            <button type="button" class="btn btn-sm btn-secondary" data-bs-dismiss="modal">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import * as bootstrap from 'bootstrap'
import dashPageView from './dashPageView.vue'
import api from '@/services/api'

const selectedYear = ref('2026')
const staffList = ref([])
const allAttendances = ref([])
const loading = ref(false)

const selectedStaff = ref(null)
const selectedStaffMonthlyReports = ref([])

const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

const fetchAllData = async () => {
  loading.value = true
  try {
    const [staffRes, attendanceRes] = await Promise.all([
      api.get('/staff'),
      api.get('/staff-attendances', { params: { year: selectedYear.value } }),
    ])

    staffList.value = Array.isArray(staffRes.data)
      ? staffRes.data
      : staffRes.data.data || staffRes.data.staff || []

    allAttendances.value = Array.isArray(attendanceRes.data)
      ? attendanceRes.data
      : attendanceRes.data.data || attendanceRes.data.attendances || []
  } catch (error) {
    console.error('Error fetching data:', error)
  } finally {
    loading.value = false
  }
}

const extractTimeOnly = (dateTimeStr) => {
  if (!dateTimeStr) return null
  if (dateTimeStr.includes('T')) {
    dateTimeStr = dateTimeStr.split('T')[1]
  } else if (dateTimeStr.includes(' ')) {
    dateTimeStr = dateTimeStr.split(' ')[1]
  }
  return dateTimeStr.substring(0, 5)
}

const getMinutesBetweenTimes = (inTime, outTime) => {
  const cleanIn = extractTimeOnly(inTime)
  const cleanOut = extractTimeOnly(outTime)
  if (!cleanIn || !cleanOut) return 0
  const [inH, inM] = cleanIn.split(':').map(Number)
  const [outH, outM] = cleanOut.split(':').map(Number)
  const inMins = inH * 60 + inM
  const outMins = outH * 60 + outM
  return outMins > inMins ? outMins - inMins : 0
}

const formatMinutes = (totalMins) => {
  if (!totalMins || totalMins <= 0) return '0h 0m'
  const hours = Math.floor(totalMins / 60)
  const minutes = totalMins % 60
  return `${hours}h ${minutes}m`
}

const calculateLateMinutes = (checkInTime24, shiftStartTime) => {
  const cleanIn = extractTimeOnly(checkInTime24)
  const cleanShift = extractTimeOnly(shiftStartTime)
  if (!cleanIn || !cleanShift) return 0

  const [shiftHours, shiftMinutes] = cleanShift.split(':').map(Number)
  const [checkInHours, checkInMinutes] = cleanIn.split(':').map(Number)

  const scheduledTotalMinutes = shiftHours * 60 + shiftMinutes
  const checkInTotalMinutes = checkInHours * 60 + checkInMinutes

  if (checkInTotalMinutes > scheduledTotalMinutes) {
    return checkInTotalMinutes - scheduledTotalMinutes
  }

  return 0
}

const computedStaffSummary = computed(() => {
  return staffList.value.map((stf) => {
    const staffId = String(stf.id)

    const staffRecords = allAttendances.value.filter((att) => {
      const attStaffId = String(att.staff_id || att.employee_id || att.staff?.id || '')
      const attYear = att.date ? String(att.date).split('-')[0] : ''
      return attStaffId === staffId && attYear === selectedYear.value
    })

    let presentCount = 0
    let lateCount = 0
    let absentCount = 0
    let leaveCount = 0
    let totalMins = 0
    let totalLateMins = 0
    const shiftsSet = new Set()

    staffRecords.forEach((rec) => {
      const status = rec.status ? rec.status.toLowerCase() : ''

      const shiftStart = rec.shift?.start_time || rec.shift_start_time || '09:00:00'
      const lateMins = calculateLateMinutes(rec.in_time, shiftStart)

      if (status === 'present') {
        presentCount++
      } else if (status === 'late' || lateMins > 0) {
        presentCount++
        lateCount++
        totalLateMins += lateMins
      } else if (status === 'absent') {
        absentCount++
      } else if (status === 'leave') {
        leaveCount++
      }

      if (rec.shift_name) shiftsSet.add(rec.shift_name)
      else if (rec.shift?.name) shiftsSet.add(rec.shift.name)

      if (rec.in_time && rec.out_time) {
        totalMins += getMinutesBetweenTimes(rec.in_time, rec.out_time)
      }
    })

    if (stf.shifts && Array.isArray(stf.shifts)) {
      stf.shifts.forEach((s) => shiftsSet.add(s.name || s))
    }
    if (shiftsSet.size === 0) shiftsSet.add('General Shift')

    return {
      id: stf.id,
      name: stf.full_name || stf.name || 'Unknown',
      code: stf.staff_code || stf.employee_code || stf.id,
      shifts: [...shiftsSet],
      total_present: presentCount,
      total_late: lateCount,
      totalLateTimeFormatted: formatMinutes(totalLateMins),
      total_absent: absentCount,
      total_leave: leaveCount,
      yearlyWorkingTime: formatMinutes(totalMins),
      records: staffRecords,
    }
  })
})

const viewStaffDetails = (staff) => {
  selectedStaff.value = staff

  selectedStaffMonthlyReports.value = monthNames.map((name, index) => {
    const monthNum = String(index + 1).padStart(2, '0')

    const monthRecords = staff.records.filter((rec) => {
      if (!rec.date) return false
      const parts = String(rec.date).split('-')
      return parts.length >= 2 && parts[1] === monthNum
    })

    let mPresent = 0
    let mLate = 0
    let mAbsent = 0
    let mLeave = 0
    let mMins = 0
    let mTotalLateMins = 0

    monthRecords.forEach((rec) => {
      const status = rec.status ? rec.status.toLowerCase() : ''

      const shiftStart = rec.shift?.start_time || rec.shift_start_time || '09:00:00'
      const lateMins = calculateLateMinutes(rec.in_time, shiftStart)

      if (status === 'present') {
        mPresent++
      } else if (status === 'late' || lateMins > 0) {
        mPresent++
        mLate++
        mTotalLateMins += lateMins
      } else if (status === 'absent') {
        mAbsent++
      } else if (status === 'leave') {
        mLeave++
      }

      if (rec.in_time && rec.out_time) {
        mMins += getMinutesBetweenTimes(rec.in_time, rec.out_time)
      }
    })

    return {
      monthNumber: monthNum,
      monthName: name,
      present: mPresent,
      late: mLate,
      totalLateTimeFormatted: formatMinutes(mTotalLateMins),
      absent: mAbsent,
      leave: mLeave,
      totalRecords: monthRecords.length,
      monthlyWorkingTime: formatMinutes(mMins),
    }
  })

  const modalElement = document.getElementById('staffReportModal')
  const modal = new bootstrap.Modal(modalElement)
  modal.show()
}

onMounted(() => {
  fetchAllData()
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
