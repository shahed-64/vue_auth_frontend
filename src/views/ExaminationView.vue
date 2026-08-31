<template>
  <LoadingSpinner v-if="isLoading" />
  <RouterView />
  <dashPageView />

  <div class="container-fluid body py-4">
    <!-- Page Header -->
    <div class="row mb-4 align-items-center">
      <div class="col">
        <h2 class="fw-bold text-dark mb-1">Examination Management</h2>
        <p class="text-muted mb-0">Manage all teacher examinations and schedules easily.</p>
      </div>
      <div class="col-auto">
        <button
          @click="openAddModal"
          class="btn btn-primary d-flex align-items-center gap-2 shadow-sm"
        >
          <i class="bi bi-plus-lg"></i> Add New Examination
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

    <!-- Examinations Table Card -->
    <div class="card border-0 shadow-sm rounded-4 overflow-hidden">
      <div class="card-body p-0">
        <div class="table-responsive">
          <table class="table table-hover align-middle mb-0">
            <thead class="table-light text-uppercase fs-7 text-secondary">
              <tr>
                <th class="py-3 ps-4">#ID</th>
                <th class="py-3">Examination Name</th>
                <th class="py-3">Examination Year</th>
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
                  Loading examinations...
                </td>
              </tr>
              <tr v-else-if="examinations.length === 0">
                <td colspan="5" class="text-center py-5 text-muted">No examinations found.</td>
              </tr>
              <tr v-for="(examination, index) in examinations" :key="examination.id">
                <td class="ps-4 fw-semibold text-secondary">{{ index + 1 }}</td>
                <td class="fw-bold text-dark">{{ examination.examination_type }}</td>
                <td class="fw-bold text-dark">{{ examination.examination_year }}</td>
                <td>
                  <!-- আগের মতো এভাবে সরাসরি না রেখে -->
                  <!-- <span>{{ examination.start_time }}</span> -->
                </td>
                <td></td>
                <td class="text-end pe-4">
                  <button
                    @click="openEditModal(examination)"
                    class="btn btn-sm btn-outline-primary me-2 px-3"
                  >
                    Edit
                  </button>
                  <button
                    @click="deleteExamination(examination.id)"
                    class="btn btn-sm btn-outline-danger px-3"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Modal for Add/Edit Examination -->
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
              {{ isEditMode ? 'Edit Examination' : 'Add New Examination' }}
            </h5>
            <button type="button" class="btn-close" @click="closeModal"></button>
          </div>

          <form @submit.prevent="saveExamination">
            <div class="modal-body py-4">
              <div class="mb-3">
                <label class="form-label fw-semibold text-secondary small">Examination Name</label>
                <input
                  type="text"
                  v-model="form.examination_type"
                  @input="form.examination_type = form.examination_type.toUpperCase()"
                  placeholder="e.g. MORNING EXAMINATION"
                  required
                  class="form-control form-control-lg fs-6 text-uppercase"
                />
                <label class="form-label fw-semibold text-secondary small">Examination Name</label>
                <input
                  type="text"
                  v-model="form.examination_year"
                  placeholder="e.g. Examination Year"
                  required
                  class="form-control form-control-lg fs-6"
                />
              </div>
            </div>

            <div class="modal-footer border-0 pt-0">
              <button type="button" @click="closeModal" class="btn btn-light px-4">Cancel</button>
              <button type="submit" class="btn btn-primary px-4">
                {{ isEditMode ? 'Update Examination' : 'Save Examination' }}
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

const examinations = ref([])
const loading = ref(false)
const showModal = ref(false)
const isEditMode = ref(false)
const currentExaminationId = ref(null)

const form = ref({
  examination_type: '',
  examination_year: '',
})

const message = ref('')
const isError = ref(false)

// সব এক্সামিনেশন ফেচ করা
const fetchExaminations = async () => {
  loading.value = true
  try {
    const response = await api.get('/examinations')
    if (response.data.status) {
      examinations.value = response.data.data
    }
  } catch (error) {
    showAlert('Failed to fetch examinations.', true)
  } finally {
    loading.value = false
  }
}

// মোডাল ওপেন (Add)
const openAddModal = () => {
  isEditMode.value = false
  form.value.examination_type = ''
  form.value.examination_year = ''
  currentExaminationId.value = null
  showModal.value = true
}

// মোডাল ওপেন (Edit)
const openEditModal = (examination) => {
  isEditMode.value = true
  form.value.examination_type = examination.examination_type
  form.value.examination_year = examination.examination_year
  currentExaminationId.value = examination.id
  showModal.value = true
}

// মোডাল বন্ধ করা
const closeModal = () => {
  showModal.value = false
}

// এক্সামিনেশন সেভ বা আপডেট করা
const saveExamination = async () => {
  try {
    let response
    if (isEditMode.value) {
      response = await api.put(`/examinations/${currentExaminationId.value}`, form.value)
    } else {
      response = await api.post('/examinations', form.value)
    }

    if (response.data.status) {
      showAlert(response.data.message)
      fetchExaminations()
      closeModal()
    }
  } catch (error) {
    showAlert(error.response?.data?.message || 'Something went wrong!', true)
  }
}

// এক্সামিনেশন ডিলিট করা
const deleteExamination = async (id) => {
  if (confirm('Are you sure you want to delete this examination?')) {
    try {
      const response = await api.delete(`/examinations/${id}`)
      if (response.data.status) {
        showAlert(response.data.message)
        fetchExaminations()
      }
    } catch (error) {
      showAlert('Failed to delete examination.', true)
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
  fetchExaminations()
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
