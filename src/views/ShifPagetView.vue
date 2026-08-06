<template>
  <LoadingSpinner v-if="isLoading" />
  <RouterView />
  <dashPageView />

  <div class="container-fluid body py-4">
    <!-- Page Header -->
    <div class="row mb-4 align-items-center">
      <div class="col">
        <h2 class="fw-bold text-dark mb-1">Shift Management</h2>
        <p class="text-muted mb-0">Manage all teacher shifts and schedules easily.</p>
      </div>
      <div class="col-auto">
        <button
          @click="openAddModal"
          class="btn btn-primary d-flex align-items-center gap-2 shadow-sm"
        >
          <i class="bi bi-plus-lg"></i> Add New Shift
        </button>
      </div>
    </div>

    <!-- Alert Message -->
    <div
      v-if="message"
      class="alert alert-dismissible fade show shadow-sm"
      :class="isError ? 'alert-danger' : 'alert-success'"
      role="alert"
    >
      {{ message }}
    </div>

    <!-- Shifts Table Card -->
    <div class="card border-0 shadow-sm rounded-4 overflow-hidden">
      <div class="card-body p-0">
        <div class="table-responsive">
          <table class="table table-hover align-middle mb-0">
            <thead class="table-light text-uppercase fs-7 text-secondary">
              <tr>
                <th class="py-3 ps-4">#ID</th>
                <th class="py-3">Shift Name</th>
                <th class="py-3">Start Time</th>
                <th class="py-3">Assigned Teachers</th>
                <th class="py-3 text-end pe-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="loading">
                <td colspan="5" class="text-center py-5 text-muted">
                  <div
                    class="spinner-border spinner-border-sm text-primary me-2"
                    role="status"
                  ></div>
                  Loading shifts...
                </td>
              </tr>
              <tr v-else-if="shifts.length === 0">
                <td colspan="5" class="text-center py-5 text-muted">No shifts found.</td>
              </tr>
              <tr v-for="(shift, index) in shifts" :key="shift.id">
                <td class="ps-4 fw-semibold text-secondary">{{ index + 1 }}</td>
                <td class="fw-bold text-dark">{{ shift.name }}</td>
                <td>
                  <span class="badge bg-light text-dark border font-monospace">
                    {{ shift.start_time || 'N/A' }}
                  </span>
                </td>
                <td>
                  <div
                    v-if="shift.teachers && shift.teachers.length > 0"
                    class="d-flex flex-wrap gap-1"
                  >
                    <span
                      v-for="teacher in shift.teachers"
                      :key="teacher.id"
                      class="badge bg-primary bg-opacity-10 text-primary px-2 py-1"
                    >
                      {{ teacher.full_name }}
                    </span>
                  </div>
                  <span v-else class="text-muted fst-italic small">No teachers assigned</span>
                </td>
                <td class="text-end pe-4">
                  <button
                    @click="openEditModal(shift)"
                    class="btn btn-sm btn-outline-primary me-2 px-3"
                  >
                    Edit
                  </button>
                  <button @click="deleteShift(shift.id)" class="btn btn-sm btn-outline-danger px-3">
                    Delete
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Modal for Add/Edit Shift -->
    <div
      v-if="showModal"
      class="modal fade show d-block"
      tabindex="-1"
      style="background-color: rgba(0, 0, 0, 0.5)"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow-lg rounded-4">
          <div class="modal-header border-0 pb-0">
            <h5 class="modal-title fw-bold text-dark">
              {{ isEditMode ? 'Edit Shift' : 'Add New Shift' }}
            </h5>
            <button type="button" class="btn-close" @click="closeModal"></button>
          </div>

          <form @submit.prevent="saveShift">
            <div class="modal-body py-4">
              <div class="mb-3">
                <label class="form-label fw-semibold text-secondary small">Shift Name</label>
                <input
                  type="text"
                  v-model="form.name"
                  placeholder="e.g. Morning Shift"
                  required
                  class="form-control form-control-lg fs-6"
                />
              </div>
              <div class="mb-3">
                <label class="form-label fw-semibold text-secondary small">Shift Start Time</label>
                <input type="time" v-model="form.start_time" class="form-control" required />
              </div>
            </div>

            <div class="modal-footer border-0 pt-0">
              <button type="button" @click="closeModal" class="btn btn-light px-4">Cancel</button>
              <button type="submit" class="btn btn-primary px-4">
                {{ isEditMode ? 'Update Shift' : 'Save Shift' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../services/api'
import dashPageView from './dashPageView.vue'
import LoadingSpinner from '../components/LoadingSpinner.vue'
import { isLoading } from '../utils/loading'

const shifts = ref([])
const loading = ref(false)
const showModal = ref(false)
const isEditMode = ref(false)
const currentShiftId = ref(null)

const form = ref({
  name: '',
  start_time: '09:00', // ডিফল্ট টাইম
})

const message = ref('')
const isError = ref(false)

// সব শিফট ফেচ করা
const fetchShifts = async () => {
  loading.value = true
  try {
    const response = await api.get('/shifts')
    if (response.data.status) {
      shifts.value = response.data.data
    }
  } catch (error) {
    showAlert('Failed to fetch shifts.', true)
  } finally {
    loading.value = false
  }
}

// মোডাল ওপেন (Add)
const openAddModal = () => {
  isEditMode.value = false
  form.value.name = ''
  form.value.start_time = '09:00'
  currentShiftId.value = null
  showModal.value = true
}

// মোডাল ওপেন (Edit)
const openEditModal = (shift) => {
  isEditMode.value = true
  form.value.name = shift.name
  form.value.start_time = shift.start_time || '09:00'
  currentShiftId.value = shift.id
  showModal.value = true
}

// মোডাল বন্ধ করা
const closeModal = () => {
  showModal.value = false
}

// শিফট সেভ বা আপডেট করা
const saveShift = async () => {
  try {
    let response
    if (isEditMode.value) {
      response = await api.put(`/shifts/${currentShiftId.value}`, form.value)
    } else {
      response = await api.post('/shifts', form.value)
    }

    if (response.data.status) {
      showAlert(response.data.message)
      fetchShifts()
      closeModal()
    }
  } catch (error) {
    showAlert(error.response?.data?.message || 'Something went wrong!', true)
  }
}

// শিফট ডিলিট করা
const deleteShift = async (id) => {
  if (confirm('Are you sure you want to delete this shift?')) {
    try {
      const response = await api.delete(`/shifts/${id}`)
      if (response.data.status) {
        showAlert(response.data.message)
        fetchShifts()
      }
    } catch (error) {
      showAlert('Failed to delete shift.', true)
    }
  }
}

// এলার্ট দেখানোর ফাংশন
const showAlert = (msg, error = false) => {
  message.value = msg
  isError.value = error
  setTimeout(() => {
    message.value = ''
  }, 3000)
}

onMounted(() => {
  fetchShifts()
})
</script>

<style scoped>
.body {
  width: 86%;
  margin-left: 259px;
}

/* মোবাইল ও ছোট ডিভাইসের জন্য রেসপন্সিভ স্টাইল */
@media (max-width: 768px) {
  .body {
    width: 100%;
    margin-left: 0;
    padding: 15px;
  }
}
</style>
