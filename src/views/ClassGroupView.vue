<template>
  <dashPageView />

  <div class="container-fluid body py-4">
    <!-- =====================================================
         PAGE HEADER
    ====================================================== -->
    <div class="row mb-4 align-items-center">
      <div class="col">
        <h2 class="fw-bold text-dark mb-1">Class Group Management</h2>
        <p class="text-muted mb-0">Manage student groups and assign optional subjects easily.</p>
      </div>

      <div class="col-auto">
        <button
          @click="openAddModal"
          class="btn btn-primary d-flex align-items-center gap-2 shadow-sm"
        >
          <i class="bi bi-plus-lg"></i>
          Add New Group
        </button>
      </div>
    </div>

    <!-- =====================================================
         ALERT MESSAGE
    ====================================================== -->
    <div
      v-if="message"
      class="alert alert-dismissible fade show shadow-sm"
      :class="isError ? 'alert-danger' : 'alert-success'"
      role="alert"
    >
      {{ message }}

      <button type="button" class="btn-close" @click="message = ''"></button>
    </div>

    <!-- =====================================================
         GROUPS TABLE
    ====================================================== -->
    <div class="card border-0 shadow-sm rounded-4 overflow-hidden">
      <div class="card-body p-0">
        <div class="table-responsive">
          <table class="table table-hover align-middle mb-0">
            <thead class="table-light text-uppercase fs-7 text-secondary">
              <tr>
                <th class="py-3 ps-4">#ID</th>
                <th class="py-3">Group Name</th>
                <th class="py-3">Optional Subjects</th>
                <th class="py-3 text-end pe-4">Actions</th>
              </tr>
            </thead>

            <tbody>
              <!-- LOADING -->
              <tr v-if="loadingGroups">
                <td colspan="4" class="text-center py-5 text-muted">
                  <div class="spinner-border spinner-border-sm me-2" role="status"></div>

                  Loading groups...
                </td>
              </tr>

              <!-- EMPTY -->
              <tr v-else-if="groups.length === 0">
                <td colspan="4" class="text-center py-5 text-muted">
                  <i class="bi bi-collection fs-3 d-block mb-2"></i>
                  No groups found.
                </td>
              </tr>

              <!-- GROUP ROW -->
              <tr v-for="(group, index) in groups" :key="group.id">
                <!-- ID -->
                <td class="ps-4 fw-semibold text-secondary">
                  {{ group.id || index + 1 }}
                </td>

                <!-- GROUP NAME -->
                <td class="fw-bold text-dark">
                  {{ group.group_name || 'N/A' }}
                </td>

                <!-- SUBJECTS -->
                <td>
                  <div
                    v-if="group.subjects && group.subjects.length"
                    class="d-flex flex-wrap gap-1"
                  >
                    <span
                      v-for="subject in group.subjects"
                      :key="subject.id"
                      class="badge bg-primary-subtle text-primary border border-primary-subtle"
                    >
                      {{ subject.name }}

                      <span v-if="subject.code" class="ms-1"> ({{ subject.code }}) </span>
                    </span>
                  </div>

                  <span v-else class="text-muted small"> No optional subjects assigned </span>
                </td>

                <!-- ACTIONS -->
                <td class="text-end pe-4">
                  <button
                    @click="openEditModal(group)"
                    class="btn btn-sm btn-outline-primary me-2 px-3"
                  >
                    <i class="bi bi-pencil me-1"></i>
                    Edit
                  </button>

                  <button @click="deleteGroup(group.id)" class="btn btn-sm btn-outline-danger px-3">
                    <i class="bi bi-trash me-1"></i>
                    Delete
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- =====================================================
         ADD / EDIT GROUP MODAL
    ====================================================== -->
    <div
      v-if="showModal"
      class="modal fade show d-block"
      tabindex="-1"
      style="background-color: rgba(0, 0, 0, 0.5)"
    >
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content border-0 shadow-lg rounded-4">
          <!-- =================================================
               MODAL HEADER
          ================================================== -->
          <div class="modal-header border-0 pb-0">
            <div>
              <h5 class="modal-title fw-bold text-dark">
                {{ isEditMode ? 'Edit Group' : 'Add New Group' }}
              </h5>

              <p class="text-muted small mb-0">
                {{
                  isEditMode
                    ? 'Update group information and assigned optional subjects.'
                    : 'Create a group and assign optional subjects.'
                }}
              </p>
            </div>

            <button type="button" class="btn-close" @click="closeModal"></button>
          </div>

          <!-- =================================================
               FORM
          ================================================== -->
          <form @submit.prevent="saveGroup">
            <div class="modal-body py-4">
              <!-- =================================================
                   GROUP NAME
              ================================================== -->
              <div class="mb-4">
                <label class="form-label fw-semibold text-secondary">
                  Group Name
                  <span class="text-danger">*</span>
                </label>

                <input
                  type="text"
                  v-model="form.group_name"
                  placeholder="e.g. Science"
                  required
                  class="form-control form-control-lg fs-6"
                />
              </div>

              <!-- =================================================
                   SUBJECT SECTION
              ================================================== -->
              <div>
                <div class="d-flex justify-content-between align-items-center mb-2">
                  <label class="form-label fw-semibold text-secondary mb-0">
                    Optional Subjects
                  </label>

                  <span class="badge bg-primary-subtle text-primary">
                    {{ form.subject_ids.length }} Selected
                  </span>
                </div>

                <div class="border rounded-3 p-3 subject-selection-box">
                  <!-- LOADING -->
                  <div v-if="subjectsLoading" class="text-center py-4 text-muted">
                    <div class="spinner-border spinner-border-sm me-2" role="status"></div>

                    Loading subjects...
                  </div>

                  <!-- NO SUBJECT -->
                  <div v-else-if="subjects.length === 0" class="text-center py-4 text-muted">
                    <i class="bi bi-book fs-3 d-block mb-2"></i>

                    No subjects found.

                    <div class="small mt-1">Please create subjects first.</div>
                  </div>

                  <!-- SUBJECT CHECKBOXES -->
                  <div v-else class="row g-2">
                    <div
                      v-for="subject in subjects"
                      :key="subject.id"
                      class="col-12 col-sm-6 col-md-4"
                    >
                      <div
                        class="form-check subject-check-card border rounded-3 p-3"
                        :class="{
                          'selected-subject': form.subject_ids.includes(Number(subject.id)),
                        }"
                      >
                        <input
                          class="form-check-input ms-0 me-2"
                          type="checkbox"
                          :id="'subject-' + subject.id"
                          :value="Number(subject.id)"
                          v-model="form.subject_ids"
                        />

                        <label class="form-check-label fw-semibold" :for="'subject-' + subject.id">
                          {{ subject.name }}

                          <span v-if="subject.code" class="d-block text-muted small mt-1">
                            {{ subject.code }}
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="form-text mt-2">
                  Select all optional subjects that should be available for this group.
                </div>
              </div>
            </div>

            <!-- =================================================
                 MODAL FOOTER
            ================================================== -->
            <div class="modal-footer border-0 pt-0">
              <button
                type="button"
                @click="closeModal"
                class="btn btn-light px-4"
                :disabled="saving"
              >
                Cancel
              </button>

              <button type="submit" class="btn btn-primary px-4" :disabled="saving">
                <span v-if="saving" class="spinner-border spinner-border-sm me-2"></span>

                <i v-else class="bi" :class="isEditMode ? 'bi-check-lg' : 'bi-plus-lg'"></i>

                {{ isEditMode ? 'Update Group' : 'Save Group' }}
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

/* =========================================================
   GROUPS
========================================================= */

const groups = ref([])

const loadingGroups = ref(false)

/* =========================================================
   SUBJECTS
========================================================= */

const subjects = ref([])

const subjectsLoading = ref(false)

/* =========================================================
   MODAL
========================================================= */

const showModal = ref(false)

const isEditMode = ref(false)

const currentGroupID = ref(null)

const saving = ref(false)

/* =========================================================
   FORM
========================================================= */

const form = ref({
  group_name: '',
  subject_ids: [],
})

/* =========================================================
   ALERT
========================================================= */

const message = ref('')

const isError = ref(false)

/* =========================================================
   OPEN ADD MODAL
========================================================= */

const openAddModal = async () => {
  isEditMode.value = false

  currentGroupID.value = null

  form.value = {
    group_name: '',
    subject_ids: [],
  }

  message.value = ''

  showModal.value = true

  await fetchSubjects()
}

/* =========================================================
   OPEN EDIT MODAL
========================================================= */

const openEditModal = async (group) => {
  isEditMode.value = true

  currentGroupID.value = group.id

  form.value.group_name = group.group_name || ''

  form.value.subject_ids = Array.isArray(group.subjects)
    ? group.subjects.map((subject) => Number(subject.id))
    : []

  message.value = ''

  showModal.value = true

  await fetchSubjects()
}

/* =========================================================
   FETCH GROUPS
========================================================= */

const fetchGroups = async () => {
  loadingGroups.value = true

  try {
    const response = await api.get('/class_group')

    if (Array.isArray(response.data)) {
      groups.value = response.data
    } else if (response.data && Array.isArray(response.data.data)) {
      groups.value = response.data.data
    } else if (response.data && Array.isArray(response.data.groups)) {
      groups.value = response.data.groups
    } else {
      groups.value = []
    }
  } catch (error) {
    console.error('Failed to fetch groups:', error)

    showAlert(error.response?.data?.message || 'Failed to fetch groups.', true)
  } finally {
    loadingGroups.value = false
  }
}

/* =========================================================
   FETCH SUBJECTS
========================================================= */

const fetchSubjects = async () => {
  subjectsLoading.value = true

  try {
    const response = await api.get('/subjects')

    if (Array.isArray(response.data)) {
      subjects.value = response.data
    } else if (response.data && Array.isArray(response.data.data)) {
      subjects.value = response.data.data
    } else {
      subjects.value = []
    }
  } catch (error) {
    console.error('Failed to fetch subjects:', error)

    subjects.value = []

    showAlert(error.response?.data?.message || 'Failed to fetch subjects.', true)
  } finally {
    subjectsLoading.value = false
  }
}

/* =========================================================
   SAVE GROUP
========================================================= */

const saveGroup = async () => {
  if (saving.value) {
    return
  }

  if (!form.value.group_name.trim()) {
    showAlert('Please enter group name.', true)

    return
  }

  saving.value = true

  try {
    const payload = {
      group_name: form.value.group_name.trim(),

      subject_ids: form.value.subject_ids.map((id) => Number(id)),
    }

    /* =====================================================
       UPDATE
    ====================================================== */

    if (isEditMode.value) {
      const response = await api.put(`/class_group/${currentGroupID.value}`, payload)

      if (response.status === 200 || response.data?.success) {
        showAlert(response.data?.message || 'Group updated successfully!')

        closeModal()

        await fetchGroups()
      }
    } else {
      /* =====================================================
       CREATE
    ====================================================== */
      const response = await api.post('/class_group', payload)

      if (response.status === 201 || response.status === 200 || response.data?.success) {
        showAlert(response.data?.message || 'Group created successfully!')

        closeModal()

        await fetchGroups()
      }
    }
  } catch (error) {
    console.error('Group save error:', error)

    console.error('Validation errors:', error.response?.data?.errors)

    if (error.response?.status === 422) {
      const validationErrors = error.response?.data?.errors || {}

      const firstError = Object.values(validationErrors)[0]?.[0]

      showAlert(
        firstError || error.response?.data?.message || 'Please check the form fields.',
        true,
      )
    } else {
      showAlert(error.response?.data?.message || 'Something went wrong!', true)
    }
  } finally {
    saving.value = false
  }
}

/* =========================================================
   CLOSE MODAL
========================================================= */

const closeModal = () => {
  if (saving.value) {
    return
  }

  showModal.value = false

  isEditMode.value = false

  currentGroupID.value = null

  form.value = {
    group_name: '',
    subject_ids: [],
  }
}

/* =========================================================
   DELETE GROUP
========================================================= */

const deleteGroup = async (id) => {
  if (!confirm('Are you sure you want to delete this group?')) {
    return
  }

  try {
    await api.delete(`/class_group/${id}`)

    groups.value = groups.value.filter((group) => group.id !== id)

    showAlert('Group deleted successfully!')
  } catch (error) {
    console.error('Failed to delete group:', error)

    showAlert(error.response?.data?.message || 'Failed to delete group.', true)
  }
}

/* =========================================================
   ALERT
========================================================= */

const showAlert = (msg, error = false) => {
  message.value = msg

  isError.value = error

  setTimeout(() => {
    message.value = ''
  }, 3000)
}

/* =========================================================
   ON MOUNT
========================================================= */

onMounted(() => {
  fetchGroups()
})
</script>

<style scoped>
/* =========================================================
   BODY
========================================================= */

.body {
  width: 86%;
  margin-left: 259px;
}

/* =========================================================
   SUBJECT SELECTION BOX
========================================================= */

.subject-selection-box {
  background-color: #f8f9fa;

  max-height: 320px;

  overflow-y: auto;
}

/* =========================================================
   SUBJECT CHECK CARD
========================================================= */

.subject-check-card {
  background-color: #ffffff;

  cursor: pointer;

  transition: all 0.2s ease;

  min-height: 70px;

  display: flex;

  align-items: flex-start;
}

/* =========================================================
   HOVER
========================================================= */

.subject-check-card:hover {
  border-color: #86b7fe !important;

  background-color: #f8fbff;
}

/* =========================================================
   SELECTED
========================================================= */

.subject-check-card.selected-subject {
  border-color: #0d6efd !important;

  background-color: rgba(13, 110, 253, 0.06);
}

/* =========================================================
   CHECKBOX
========================================================= */

.subject-check-card .form-check-input {
  margin-top: 3px;

  cursor: pointer;
}

/* =========================================================
   LABEL
========================================================= */

.subject-check-card .form-check-label {
  cursor: pointer;

  flex: 1;
}

/* =========================================================
   TABLE
========================================================= */

.table th {
  font-size: 0.8rem;

  letter-spacing: 0.03em;
}

.table td {
  vertical-align: middle;
}

/* =========================================================
   MODAL
========================================================= */

.modal {
  z-index: 1055;
}

/* =========================================================
   MOBILE
========================================================= */

@media (max-width: 768px) {
  .body {
    width: 100%;

    margin-left: 0;

    padding: 15px;
  }
}
</style>
