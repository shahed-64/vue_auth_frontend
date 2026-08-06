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
                <h2 class="h4 fw-bold text-dark mb-1">Teacher Attendance Yearly Summary</h2>
                <p class="text-muted small mb-0">
                  Overview of teachers' attendance and month-wise breakdown
                </p>
              </div>
              <!-- Year Filter -->
              <div>
                <select
                  v-model="selectedYear"
                  @change="fetchSummaryData"
                  class="form-select form-select-sm"
                >
                  <option value="2026">2026</option>
                  <option value="2025">2025</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Main Table: All Teachers Summary -->
          <div class="card border-0 shadow-sm rounded-3">
            <div class="card-body p-0">
              <div class="table-responsive">
                <table class="table table-hover align-middle mb-0">
                  <thead class="table-light">
                    <tr class="small text-secondary fw-semibold">
                      <th class="ps-4 py-3">TEACHER NAME</th>
                      <th class="py-3">SHIFT</th>
                      <th class="text-center py-3 text-success">TOTAL PRESENT</th>
                      <th class="text-center py-3 text-warning">TOTAL LATE</th>
                      <th class="text-center py-3 text-danger">TOTAL ABSENT</th>
                      <th class="text-end pe-4 py-3">ACTION</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-if="loading">
                      <td colspan="6" class="text-center py-4 text-muted">
                        <div class="spinner-border spinner-border-sm me-2" role="status"></div>
                        Loading summary reports...
                      </td>
                    </tr>
                    <tr v-else v-for="teacher in summaryList" :key="teacher.id">
                      <td class="ps-4">
                        <div class="fw-bold text-dark text-uppercase">{{ teacher.name }}</div>
                        <small class="text-muted text-uppercase">{{ teacher.code }}</small>
                      </td>
                      <td>
                        <span class="badge bg-secondary">{{ teacher.shift }}</span>
                      </td>
                      <td class="text-center fw-bold text-success">{{ teacher.total_present }}</td>
                      <td class="text-center fw-bold text-warning">{{ teacher.total_late }}</td>
                      <td class="text-center fw-bold text-danger">{{ teacher.total_absent }}</td>
                      <td class="text-end pe-4">
                        <button
                          class="btn btn-sm btn-outline-primary fw-semibold"
                          @click="viewTeacherDetails(teacher.id)"
                        >
                          👁️ View Report
                        </button>
                      </td>
                    </tr>
                    <tr v-if="!loading && summaryList.length === 0">
                      <td colspan="6" class="text-center py-4 text-muted">
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

    <!-- Modal for Single Teacher Month-wise Report (January -> December) -->
    <div class="modal fade" id="teacherReportModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content border-0 shadow">
          <div class="modal-header bg-light">
            <h5 class="modal-title fw-bold">
              {{ selectedTeacherData?.teacher?.name }} - Yearly Report ({{ selectedYear }})
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
                    <th class="text-center">ABSENT</th>
                    <th class="text-center">TOTAL RECORDS</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="mReport in selectedTeacherData?.monthly_reports"
                    :key="mReport.month_number"
                  >
                    <td class="ps-3 fw-bold text-primary">{{ mReport.month_name }}</td>
                    <td class="text-center text-success fw-semibold">{{ mReport.present }}</td>
                    <td class="text-center text-warning fw-semibold">{{ mReport.late }}</td>
                    <td class="text-center text-danger fw-semibold">{{ mReport.absent }}</td>
                    <td class="text-center">{{ mReport.total_days }}</td>
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
import { ref, onMounted } from 'vue'
import axios from 'axios'
import * as bootstrap from 'bootstrap'
import dashPageView from './dashPageView.vue'

const API_BASE_URL = 'http://127.0.0.1:8000/api'

const selectedYear = ref('2026')
const summaryList = ref([])
const loading = ref(false)
const selectedTeacherData = ref(null)

// সব শিক্ষকের সামারি ফেচ করা
const fetchSummaryData = async () => {
  loading.value = true
  try {
    const response = await axios.get(`${API_BASE_URL}/teachers/attendance-summary`, {
      params: { year: selectedYear.value },
    })
    // আপনার কন্ট্রোলার সরাসরি কালেকশন/অ্যােরে রিটার্ন করছে
    summaryList.value = Array.isArray(response.data) ? response.data : []
  } catch (error) {
    console.error('Error fetching summary:', error)
  } finally {
    loading.value = false
  }
}

// নির্দিষ্ট শিক্ষকের ভিউ বাটনে ক্লিক করলে মাসভিত্তিক রিপোর্ট আনা এবং মোডাল ওপেন করা
const viewTeacherDetails = async (teacherId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/teachers/${teacherId}/yearly-report`, {
      params: { year: selectedYear.value },
    })
    selectedTeacherData.value = response.data

    // Bootstrap Modal ওপেন করার কোড
    const modalElement = document.getElementById('teacherReportModal')
    const modal = new bootstrap.Modal(modalElement)
    modal.show()
  } catch (error) {
    console.error('Error fetching teacher details:', error)
  }
}

onMounted(() => {
  fetchSummaryData()
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
