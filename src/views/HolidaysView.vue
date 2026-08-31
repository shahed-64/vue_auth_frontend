<template>
  <div class="dashboard-layout bg-light min-vh-100 d-flex">
    <!-- Left Sidebar -->
    <aside class="sidebar-wrapper">
      <dashPageView />
    </aside>

    <!-- Main Content -->
    <div class="main-wrapper flex-grow-1 min-vh-100 d-flex flex-column">
      <main class="holiday-management-section py-3 py-md-4 px-2 px-md-3">
        <div class="container-fluid p-0">
          <!-- Page Header & Add Button -->
          <div class="row mb-4 align-items-center">
            <div class="col-md-6">
              <h2 class="h4 fw-bold text-dark mb-1">Company Holidays Management</h2>
              <p class="text-muted small mb-0">
                Manage off days and public holidays for attendance tracking
              </p>
            </div>
            <div class="col-md-6 text-md-end mt-3 mt-md-0">
              <button class="btn btn-primary btn-sm fw-semibold" @click="openAddModal">
                + Add New Holiday
              </button>
            </div>
          </div>

          <!-- Holidays Table Card -->
          <div class="card border-0 shadow-sm rounded-3">
            <div class="card-body p-0">
              <div class="table-responsive">
                <table class="table table-hover align-middle mb-0">
                  <thead class="table-light">
                    <tr class="small text-secondary fw-semibold">
                      <th class="ps-4 py-3">TITLE / REASON</th>
                      <th class="py-3">DATE RANGE</th>
                      <th class="py-3">DESCRIPTION</th>
                      <th class="text-end pe-4 py-3">ACTION</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-if="loading">
                      <td colspan="4" class="text-center py-4 text-muted">
                        <div class="spinner-border spinner-border-sm me-2" role="status"></div>
                        Loading holidays...
                      </td>
                    </tr>
                    <tr
                      v-else-if="holidays.length > 0"
                      v-for="holiday in holidays"
                      :key="holiday.id"
                    >
                      <td class="ps-4 fw-bold text-dark">{{ holiday.title }}</td>
                      <td>
                        <span class="badge bg-secondary bg-opacity-15 text-dark border">
                          {{ holiday.start_date }} <span class="text-muted mx-1">to</span>
                          {{ holiday.end_date }}
                        </span>
                      </td>
                      <td class="text-muted small">{{ holiday.description || 'N/A' }}</td>
                      <td class="text-end pe-4">
                        <button
                          class="btn btn-sm btn-outline-danger fw-semibold"
                          @click="deleteHoliday(holiday.id)"
                        >
                          🗑️ Delete
                        </button>
                      </td>
                    </tr>
                    <tr v-else>
                      <td colspan="4" class="text-center py-4 text-muted">No holidays found.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>

    <!-- Modal for Adding Holiday -->
    <div class="modal fade" id="holidayModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow">
          <div class="modal-header bg-light">
            <h5 class="modal-title fw-bold">Add New Holiday</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <form @submit.prevent="saveHoliday">
            <div class="modal-body">
              <div class="mb-3">
                <label class="form-label fw-semibold small">Holiday Title</label>
                <input
                  type="text"
                  v-model="form.title"
                  class="form-control"
                  placeholder="e.g. Eid-ul-Fitr"
                  required
                />
              </div>
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label class="form-label fw-semibold small">Start Date</label>
                  <input type="date" v-model="form.start_date" class="form-control" required />
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label fw-semibold small">End Date</label>
                  <input type="date" v-model="form.end_date" class="form-control" required />
                </div>
              </div>
              <div class="mb-3">
                <label class="form-label fw-semibold small">Description (Optional)</label>
                <textarea
                  v-model="form.description"
                  class="form-control"
                  rows="3"
                  placeholder="Optional details..."
                ></textarea>
              </div>
            </div>
            <div class="modal-footer bg-light">
              <button type="button" class="btn btn-sm btn-secondary" data-bs-dismiss="modal">
                Cancel
              </button>
              <button type="submit" class="btn btn-sm btn-primary" :disabled="saving">
                <span v-if="saving" class="spinner-border spinner-border-sm me-1"></span>
                Save Holiday
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import * as bootstrap from 'bootstrap'
import dashPageView from './dashPageView.vue'
import api from '@/services/api'

const holidays = ref([])
const loading = ref(false)
const saving = ref(false)

const form = reactive({
  title: '',
  start_date: '',
  end_date: '',
  description: '',
})

let holidayModal = null

onMounted(() => {
  fetchHolidays()
  const modalEl = document.getElementById('holidayModal')
  if (modalEl) {
    holidayModal = new bootstrap.Modal(modalEl)
  }
})

const fetchHolidays = async () => {
  loading.value = true
  try {
    const response = await api.get('/holidays')
    // ডেটা ফরম্যাট চেক করে অ্যারে নিশ্চিত করা
    if (Array.isArray(response.data)) {
      holidays.value = response.data
    } else if (response.data && Array.isArray(response.data.data)) {
      holidays.value = response.data.data
    } else {
      holidays.value = []
    }
  } catch (error) {
    console.error('Error fetching holidays:', error)
  } finally {
    loading.value = false
  }
}

const openAddModal = () => {
  form.title = ''
  form.start_date = ''
  form.end_date = ''
  form.description = ''
  if (holidayModal) holidayModal.show()
}

const saveHoliday = async () => {
  saving.value = true
  try {
    await api.post('/holidays', form)
    if (holidayModal) holidayModal.hide()
    await fetchHolidays() // ডাটা সেভ হওয়ার পর টেবিল রিফ্রেশ করা
  } catch (error) {
    console.error('Error saving holiday:', error)
    alert(error.response?.data?.message || 'Failed to save holiday')
  } finally {
    saving.value = false
  }
}

const deleteHoliday = async (id) => {
  if (!confirm('Are you sure you want to delete this holiday?')) return
  try {
    await api.delete(`/holidays/${id}`)
    await fetchHolidays()
  } catch (error) {
    console.error('Error deleting holiday:', error)
  }
}
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
