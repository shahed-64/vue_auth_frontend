<template>
  <dashPageView />
  <div class="container-fluid body py-4">
    <!-- Page Header -->
    <div class="row mb-4 align-items-center">
      <div class="col">
        <h2 class="fw-bold text-dark mb-1">Section Management</h2>
        <p class="text-muted mb-0">Manage all Students Sections for here easily.</p>
      </div>
      <div class="col-auto">
        <button
          @click="openAddModal"
          class="btn btn-primary d-flex align-items-center gap-2 shadow-sm"
        >
          <i class="bi bi-plus-lg"></i> Add New Section
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

    <!-- Sections Table Card -->
    <div class="card border-0 shadow-sm rounded-4 overflow-hidden">
      <div class="card-body p-0">
        <div class="table-responsive">
          <table class="table table-hover align-middle mb-0">
            <thead class="table-light text-uppercase fs-7 text-secondary">
              <tr>
                <th class="py-3 ps-4">#ID</th>
                <th class="py-3">Section Name</th>
                <th class="py-3">Assigned Students</th>
                <th class="py-3 text-end pe-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="sections.length === 0">
                <td colspan="4" class="text-center py-5 text-muted">No sections found.</td>
              </tr>
              <tr v-for="(section, index) in sections" :key="section.id">
                <td class="ps-4 fw-semibold text-secondary">{{ section.id || index + 1 }}</td>
                <td class="fw-bold text-dark">
                  {{ section.section_name || section.name || 'N/A' }}
                </td>
                <td>
                  <div class="d-flex flex-wrap gap-1">
                    <span class="badge bg-primary bg-opacity-10 text-primary px-2 py-1">
                      Shahed Islam
                    </span>
                  </div>
                </td>
                <td class="text-end pe-4">
                  <button
                    @click="openEditModal(section)"
                    class="btn btn-sm btn-outline-primary me-2 px-3"
                  >
                    Edit
                  </button>
                  <button
                    @click="deleteSection(section.id)"
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

    <!-- Modal for Add/Edit Section -->
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
              {{ isEditMode ? 'Edit Section' : 'Add New Section' }}
            </h5>
            <button type="button" class="btn-close" @click="closeModal"></button>
          </div>

          <form @submit.prevent="saveSection">
            <div class="modal-body py-4">
              <div class="mb-3">
                <label class="form-label fw-semibold text-secondary small">Section Name</label>
                <input
                  type="text"
                  v-model="form.section_name"
                  placeholder="e.g. Section A"
                  required
                  class="form-control form-control-lg fs-6"
                />
              </div>
            </div>

            <div class="modal-footer border-0 pt-0">
              <button type="button" @click="closeModal" class="btn btn-light px-4">Cancel</button>
              <button type="submit" class="btn btn-primary px-4">
                {{ isEditMode ? 'Update Section' : 'Save Section' }}
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

const sections = ref([])
const showModal = ref(false)
const isEditMode = ref(false)
const currentSectionID = ref(null)

const form = ref({
  section_name: '',
})

const message = ref('')
const isError = ref(false)

const openAddModal = () => {
  isEditMode.value = false
  form.value.section_name = ''
  currentSectionID.value = null
  showModal.value = true
}

const openEditModal = (sectionItem) => {
  isEditMode.value = true
  currentSectionID.value = sectionItem.id
  form.value.section_name = sectionItem.section_name || sectionItem.name || ''
  showModal.value = true
}

const fetchSections = async () => {
  try {
    const response = await api.get('/sections')

    // Flexible data handling based on API response structure
    if (Array.isArray(response.data)) {
      sections.value = response.data
    } else if (response.data.data && Array.isArray(response.data.data)) {
      sections.value = response.data.data
    } else if (response.data.sections && Array.isArray(response.data.sections)) {
      sections.value = response.data.sections
    } else {
      sections.value = []
    }
  } catch (error) {
    showAlert('Failed to fetch sections.', true)
  }
}

const saveSection = async () => {
  try {
    let response
    if (isEditMode.value) {
      response = await api.put(`/sections/${currentSectionID.value}`, form.value)
    } else {
      response = await api.post('/sections', form.value)
    }

    if (response.status === 200 || response.status === 201 || response.data.status) {
      showAlert(response.data.message || 'Saved successfully!')
      fetchSections()
      closeModal()
    }
  } catch (error) {
    showAlert(error.response?.data?.message || 'Something went wrong!', true)
  }
}

const closeModal = () => {
  showModal.value = false
}

const deleteSection = async (id) => {
  if (confirm('Are you sure you want to delete this section?')) {
    try {
      await api.delete(`/sections/${id}`)
      sections.value = sections.value.filter((s) => s.id !== id)
      showAlert('Section deleted successfully!')
      fetchSections()
    } catch (error) {
      showAlert('Failed to delete section.', true)
    }
  }
}

const showAlert = (msg, error = false) => {
  message.value = msg
  isError.value = error
  setTimeout(() => {
    message.value = ''
  }, 3000)
}

onMounted(() => {
  fetchSections()
})
</script>

<style scoped>
.body {
  width: 86%;
  margin-left: 259px;
}

@media (max-width: 768px) {
  .body {
    width: 100%;
    margin-left: 0;
    padding: 15px;
  }
}
</style>
