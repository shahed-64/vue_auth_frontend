<template>
  <LoadingSpinner v-if="isLoading" />
  <RouterView />
  <dashPageView />

  <div class="content">
    <!-- ================= HEADER ================= -->
    <div class="staff-header">
      <div>
        <h2>Student Management</h2>
        <p>Manage students, classes and academic information</p>
      </div>

      <div class="staff-header-right">
        <div class="staff-summary">
          <div class="summary-icon">
            <i class="bi bi-mortarboard-fill"></i>
          </div>
          <div>
            <h4>{{ students.length }}</h4>
            <span>Total Students</span>
          </div>
        </div>

        <button
          class="btn btn-light add-btn"
          data-bs-toggle="modal"
          data-bs-target="#addModal"
          @click="resetForm"
        >
          <i class="bi bi-person-plus-fill"></i> Add Student
        </button>
      </div>
    </div>

    <!-- ================= MAIN CARD ================= -->
    <div class="staff-table-card">
      <!-- TOOLBAR -->
      <div class="staff-toolbar">
        <div class="search-box">
          <i class="bi bi-search"></i>
          <input v-model="search" type="text" placeholder="Search student..." />
        </div>

        <select v-model="selectedClass" class="class-filter">
          <option value="">All Classes</option>
          <option v-for="cls in uniqueClasses" :key="cls" :value="cls">
            {{ cls }}
          </option>
        </select>
      </div>

      <!-- TABLE -->
      <div class="table-responsive">
        <table class="table staff-table align-middle">
          <thead>
            <tr>
              <th>#</th>
              <th>Photo</th>
              <th>Name</th>
              <th>Batch/Class</th>
              <th>Email</th>
              <th>Course</th>
              <th width="180">Action</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="(item, index) in paginatedStudents" :key="item.id">
              <td>{{ (currentPage - 1) * perPage + index + 1 }}</td>
              <td>
                <img
                  :src="item ? getImageUrl(item) : defaultAvatar"
                  class="staff-avatar"
                  alt="Student Photo"
                />
              </td>
              <td>
                <div class="staff-name">
                  <strong>{{ item.full_name }}</strong>
                  <small>{{ item.student_id }}</small>
                </div>
              </td>
              <td>
                <span class="skill-badge">{{ item.batch_name }}</span>
              </td>
              <td>{{ item.email }}</td>
              <td>{{ item.course_name }}</td>
              <td>
                <div class="action-buttons">
                  <button
                    class="action-btn view"
                    @click="openView(item)"
                    data-bs-toggle="modal"
                    data-bs-target="#viewModal"
                  >
                    <i class="bi bi-eye"></i>
                  </button>

                  <button
                    class="action-btn edit"
                    @click="openEdit(item)"
                    data-bs-toggle="modal"
                    data-bs-target="#editModal"
                  >
                    <i class="bi bi-pencil"></i>
                  </button>

                  <button class="action-btn delete" @click="deleteStudent(item.id)">
                    <i class="bi bi-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- EMPTY STATE -->
      <div v-if="filteredStudents.length === 0" class="empty-state">
        <i class="bi bi-person-x"></i>
        <h5>No Student Found</h5>
        <p>Try changing search or filter</p>
      </div>

      <!-- PAGINATION -->
      <div v-if="filteredStudents.length > 0" class="pagination-box">
        <div>
          Showing <b>{{ (currentPage - 1) * perPage + 1 }}</b> to
          <b>{{ Math.min(currentPage * perPage, filteredStudents.length) }}</b> of
          <b>{{ filteredStudents.length }}</b>
        </div>

        <div class="page-buttons">
          <button class="page-btn" @click="prevPage" :disabled="currentPage === 1">
            <i class="bi bi-chevron-left"></i>
          </button>
          <span>{{ currentPage }} / {{ totalPages }}</span>
          <button class="page-btn" @click="nextPage" :disabled="currentPage === totalPages">
            <i class="bi bi-chevron-right"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- ================= ADD MODAL ================= -->
    <div class="modal fade" id="addModal" ref="addModalRef">
      <div class="modal-dialog">
        <div class="modal-content student-modal">
          <div class="modal-header">
            <h5>Add Student</h5>
            <button class="btn-close" data-bs-dismiss="modal"></button>
          </div>

          <div class="modal-body">
            <!-- IMAGE PREVIEW & INPUT -->
            <div class="text-center mb-3">
              <img
                :src="addPreview || defaultAvatar"
                class="image-preview mb-2"
                alt="Add Preview"
              />
              <input
                type="file"
                ref="addFileInput"
                class="form-control"
                @change="handleFileChange($event, 'add')"
                accept="image/*"
              />
            </div>

            <input v-model="form.full_name" class="form-control mb-3" placeholder="Full Name *" />
            <input
              v-model="form.fathers_name"
              class="form-control mb-3"
              placeholder="Fathers Name *"
            />
            <input
              v-model="form.mothers_name"
              class="form-control mb-3"
              placeholder="Mothers Name *"
            />
            <input v-model="form.phone" class="form-control mb-3" placeholder="Phone *" />
            <input v-model="form.email" class="form-control mb-3" placeholder="Email *" />
            <input
              v-model="form.course_name"
              class="form-control mb-3"
              placeholder="Group/section *"
            />

            <!-- SELECT DROPDOWN FOR BATCH/CLASS -->
            <select v-model="form.batch_name" class="form-control mb-3">
              <option value="" disabled selected>Select Batch/Class *</option>
              <option value="Class-1">Class-1</option>
              <option value="Class-2">Class-2</option>
              <option value="Class-3">Class-3</option>
              <option value="Class-4">Class-4</option>
              <option value="Class-5">Class-5</option>
              <option value="Class-6">Class-6</option>
              <option value="Class-7">Class-7</option>
              <option value="Class-8">Class-8</option>
              <option value="Class-9">Class-9</option>
              <option value="Class-10">Class-10</option>
            </select>
            <input
              type="number"
              v-model="form.monthly_fee"
              class="form-control"
              placeholder="Enter Monthly Fee"
            />
          </div>

          <div class="modal-footer">
            <button class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button class="btn btn-primary" :disabled="loading" @click="student_create">
              {{ loading ? 'Saving...' : 'Save' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- ================= VIEW MODAL ================= -->
    <div class="modal fade" id="viewModal">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content student-modal">
          <div class="modal-header bg-primary text-white">
            <h5>Student Details</h5>
            <button class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
          </div>

          <div class="modal-body text-center">
            <img
              :src="getImageUrl(selectedStudent.image)"
              class="student-modal-avatar mb-3"
              alt="Student Avatar"
            />
            <h4>{{ selectedStudent.full_name }}</h4>
            <p class="text-muted">{{ selectedStudent.student_id }}</p>
            <hr />

            <div class="text-start px-3">
              <p><strong>Email:</strong> {{ selectedStudent.email }}</p>
              <p><strong>Phone:</strong> {{ selectedStudent.phone }}</p>
              <p><strong>Class/Batch:</strong> {{ selectedStudent.batch_name }}</p>
              <p><strong>Course:</strong> {{ selectedStudent.course_name }}</p>
              <p><strong>Admission Date:</strong> {{ selectedStudent.admission_date }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ================= EDIT MODAL ================= -->
    <div class="modal fade" id="editModal">
      <div class="modal-dialog">
        <div class="modal-content student-modal">
          <div class="modal-header">
            <h5>Edit Student</h5>
            <button class="btn-close" data-bs-dismiss="modal"></button>
          </div>

          <div class="modal-body">
            <!-- IMAGE PREVIEW & INPUT FOR EDIT -->
            <div class="text-center mb-3">
              <img
                :src="editPreview || getImageUrl(selectedStudent.image)"
                class="image-preview mb-2"
                alt="Edit Preview"
              />
              <input
                type="file"
                ref="editFileInput"
                class="form-control"
                @change="handleFileChange($event, 'edit')"
                accept="image/*"
              />
            </div>

            <label class="form-label">Full Name</label>
            <input
              v-model="selectedStudent.full_name"
              class="form-control mb-3"
              placeholder="Name"
            />

            <label class="form-label">Phone</label>
            <input v-model="selectedStudent.phone" class="form-control mb-3" placeholder="Phone" />

            <label class="form-label">Email</label>
            <input v-model="selectedStudent.email" class="form-control mb-3" placeholder="Email" />

            <label class="form-label">Course</label>
            <input
              v-model="selectedStudent.course_name"
              class="form-control mb-3"
              placeholder="Course Name"
            />

            <label class="form-label">Batch/Class</label>

            <select v-model="selectedStudent.batch_name" class="form-control mb-3">
              <option value="Class-1">Class-1</option>
              <option value="Class-2">Class-2</option>
              <option value="Class-3">Class-3</option>
              <option value="Class-4">Class-4</option>
              <option value="Class-5">Class-5</option>
              <option value="Class-6">Class-6</option>
              <option value="Class-7">Class-7</option>
              <option value="Class-8">Class-8</option>
              <option value="Class-9">Class-9</option>
              <option value="Class-10">Class-10</option>
            </select>

            <label class="form-label">Admission Date</label>
            <input v-model="selectedStudent.admission_date" type="date" class="form-control mb-3" />
          </div>

          <div class="modal-footer">
            <button class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button class="btn btn-primary" :disabled="loading" @click="updateStudent">
              {{ loading ? 'Updating...' : 'Update' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import dashPageView from './dashPageView.vue'
import { ref, reactive, computed, watch, onMounted } from 'vue'
import api from '@/services/api'
import * as bootstrap from 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'

import LoadingSpinner from '../components/LoadingSpinner.vue'
import { isLoading } from '../utils/loading'
// CONFIG & DEFAULTS
// GET IMAGE FULL URL
import { getImageUrl } from '@/utils/img'
const defaultAvatar = 'https://i.pravatar.cc/150'

// STATES
const students = ref([])
const search = ref('')
const selectedClass = ref('')
const loading = ref(false)

// FILE STATES
const addImageFile = ref(null)
const editImageFile = ref(null)
const addPreview = ref(null)
const editPreview = ref(null)

const addFileInput = ref(null)
const editFileInput = ref(null)

// PAGINATION
const currentPage = ref(1)
const perPage = ref(10)

// FORM
const form = reactive({
  full_name: '',
  fathers_name: '',
  mothers_name: '',
  phone: '',
  email: '',
  course_name: '',
  batch_name: '',
  admission_date: '',
  monthly_fee: '',
})

// SELECTED STUDENT
const selectedStudent = ref({
  id: null,
  full_name: '',
  student_id: '',
  phone: '',
  email: '',
  course_name: '',
  batch_name: '',
  admission_date: '',
  image: null,
})

// FILE SELECTION & PREVIEW HANDLER
const handleFileChange = (event, type) => {
  const file = event.target.files[0]
  if (!file) return

  if (type === 'add') {
    if (addPreview.value) URL.revokeObjectURL(addPreview.value)
    addImageFile.value = file
    addPreview.value = URL.createObjectURL(file)
  } else {
    if (editPreview.value) URL.revokeObjectURL(editPreview.value)
    editImageFile.value = file
    editPreview.value = URL.createObjectURL(file)
  }
}

// RESET FORM
const resetForm = () => {
  form.full_name = ''
  form.fathers_name = ''
  form.mothers_name = ''
  form.phone = ''
  form.email = ''
  form.course_name = ''
  form.batch_name = ''
  form.admission_date = ''
  addImageFile.value = null
  form.monthly_fee = ''
  if (addPreview.value) {
    URL.revokeObjectURL(addPreview.value)
    addPreview.value = null
  }

  if (addFileInput.value) addFileInput.value.value = ''
}

// GET ALL STUDENTS
const getStudent = async () => {
  try {
    loading.value = true
    const res = await api.get('/students')
    students.value = res.data.students || []
  } catch (error) {
    console.error('Error fetching students:', error)
  } finally {
    loading.value = false
  }
}

// CREATE STUDENT
const student_create = async () => {
  try {
    loading.value = true
    const formData = new FormData()
    formData.append('full_name', form.full_name)
    formData.append('fathers_name', form.fathers_name)
    formData.append('mothers_name', form.mothers_name)
    formData.append('phone', form.phone)
    formData.append('email', form.email)
    formData.append('batch_name', form.batch_name ? form.batch_name.trim() : '')
    formData.append('course_name', form.course_name)
    formData.append('admission_date', form.admission_date)
    formData.append('monthly_fee', form.monthly_fee)

    if (addImageFile.value) {
      formData.append('image', addImageFile.value)
    }

    const res = await api.post('/students', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })

    alert(res.data.message || 'Student Created Successfully')
    closeModal('addModal')
    resetForm()
    await getStudent()
  } catch (error) {
    console.error('Create student error:', error.response?.data)
    alert(error.response?.data?.message || 'Failed to create student')
  } finally {
    loading.value = false
  }
}

// OPEN VIEW
const openView = (student) => {
  selectedStudent.value = { ...student }
}

// OPEN EDIT
const openEdit = (student) => {
  selectedStudent.value = JSON.parse(JSON.stringify(student))

  // Trim spaces to align with select options
  if (selectedStudent.value.batch_name) {
    selectedStudent.value.batch_name = selectedStudent.value.batch_name.trim()
  }

  editImageFile.value = null
  if (editPreview.value) {
    URL.revokeObjectURL(editPreview.value)
    editPreview.value = null
  }
  if (editFileInput.value) editFileInput.value.value = ''
}

// UPDATE STUDENT
const updateStudent = async () => {
  try {
    loading.value = true

    const formData = new FormData()
    formData.append('full_name', selectedStudent.value.full_name || '')
    formData.append('phone', selectedStudent.value.phone || '')
    formData.append('email', selectedStudent.value.email || '')
    formData.append('course_name', selectedStudent.value.course_name || '')
    formData.append(
      'batch_name',
      selectedStudent.value.batch_name ? selectedStudent.value.batch_name.trim() : '',
    )
    formData.append('admission_date', selectedStudent.value.admission_date || '')

    // Laravel Multipart FormData Method Override
    formData.append('_method', 'PUT')

    if (editImageFile.value) {
      formData.append('image', editImageFile.value)
    }

    await api.post(`/students/${selectedStudent.value.id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })

    alert('Updated successfully')
    closeModal('editModal')
    await getStudent()
  } catch (error) {
    console.error('Error updating student:', error.response?.data)
    alert(error.response?.data?.message || 'Update failed')
  } finally {
    loading.value = false
  }
}

// DELETE STUDENT
const deleteStudent = async (id) => {
  if (!confirm('Are you sure you want to delete this student?')) return

  try {
    await api.delete(`/students/${id}`)
    students.value = students.value.filter((item) => item.id !== id)
    alert('Deleted successfully')
  } catch (error) {
    console.error('Error deleting student:', error.response?.data)
    alert('Failed to delete student')
  }
}

// CLOSE MODAL HELPER
const closeModal = (modalId) => {
  const modalEl = document.getElementById(modalId)
  if (modalEl) {
    const modal = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl)
    modal.hide()
  }

  setTimeout(() => {
    document.querySelectorAll('.modal-backdrop').forEach((el) => el.remove())
    document.body.classList.remove('modal-open')
    document.body.style.overflow = ''
    document.body.style.paddingRight = ''
  }, 300)
}

// COMPUTED PROPERTIES
const uniqueClasses = computed(() => {
  const classes = students.value
    .map((item) => (item.batch_name ? item.batch_name.trim() : ''))
    .filter(Boolean)
  return [...new Set(classes)]
})

const filteredStudents = computed(() => {
  const keyword = search.value.toLowerCase().trim()

  return students.value.filter((student) => {
    const matchSearch =
      student.full_name?.toLowerCase().includes(keyword) ||
      student.email?.toLowerCase().includes(keyword) ||
      student.student_id?.toLowerCase().includes(keyword)

    const studentBatch = student.batch_name ? student.batch_name.trim() : ''
    const matchClass = !selectedClass.value || studentBatch === selectedClass.value.trim()

    return matchSearch && matchClass
  })
})

const totalPages = computed(() => {
  return Math.ceil(filteredStudents.value.length / perPage.value) || 1
})

const paginatedStudents = computed(() => {
  const start = (currentPage.value - 1) * perPage.value
  return filteredStudents.value.slice(start, start + perPage.value)
})

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++
}

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--
}

watch([search, selectedClass], () => {
  currentPage.value = 1
})

onMounted(() => {
  getStudent()
})
</script>

<style scoped>
/* Image Preview Style */
.image-preview {
  width: 90px;
  height: 90px;
  object-fit: cover;
  border-radius: 50%;
  border: 3px solid #2563eb;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

/* Base Styles */
.content {
  margin-left: 250px;
  padding: 25px;
  background: #f8fafc;
  min-height: 100vh;
}

.staff-header {
  background: linear-gradient(135deg, #2563eb, #4f46e5);
  padding: 28px 32px;
  border-radius: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;
  margin-bottom: 25px;
  box-shadow: 0 10px 30px rgba(37, 99, 235, 0.25);
}

.staff-header h2 {
  font-weight: 700;
  margin-bottom: 6px;
}

.staff-header p {
  margin: 0;
  color: #dbeafe;
}

.staff-header-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.staff-summary {
  background: white;
  color: #111827;
  padding: 12px 18px;
  border-radius: 15px;
  display: flex;
  align-items: center;
  gap: 15px;
}

.summary-icon {
  width: 45px;
  height: 45px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #dbeafe;
  color: #2563eb;
  font-size: 22px;
}

.staff-summary h4 {
  margin: 0;
  font-weight: 700;
}

.staff-summary span {
  font-size: 13px;
  color: #6b7280;
}

.add-btn {
  color: #2563eb;
  font-weight: 600;
  border-radius: 12px;
  padding: 12px 20px;
}

.staff-table-card {
  background: white;
  border-radius: 20px;
  padding: 25px;
  box-shadow: 0 10px 25px rgba(15, 23, 42, 0.08);
}

.staff-toolbar {
  display: flex;
  justify-content: space-between;
  gap: 15px;
  margin-bottom: 20px;
}

.search-box {
  position: relative;
  width: 350px;
}

.search-box i {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
}

.search-box input {
  width: 100%;
  padding: 12px 15px 12px 45px;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  outline: none;
}

.search-box input:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
}

.class-filter {
  width: 200px;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  padding: 10px;
}

.staff-table {
  border-collapse: separate;
  border-spacing: 0 10px;
}

.staff-table thead th {
  background: #f1f5f9;
  border: none;
  padding: 15px;
  color: #374151;
  font-size: 14px;
}

.staff-table tbody tr {
  background: white;
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.05);
  transition: 0.3s;
}

.staff-table tbody tr:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
}

.staff-table td {
  padding: 15px;
  border: none;
}

.staff-avatar {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #dbeafe;
}

.staff-name {
  display: flex;
  flex-direction: column;
}

.staff-name small {
  color: #6b7280;
  font-size: 12px;
}

.skill-badge {
  background: #eff6ff;
  color: #2563eb;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.action-btn {
  width: 38px;
  height: 38px;
  border: none;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  transition: 0.3s;
}

.action-btn:hover {
  transform: translateY(-3px);
}

.action-btn.view {
  background: #dbeafe;
  color: #2563eb;
}

.action-btn.edit {
  background: #fef3c7;
  color: #d97706;
}

.action-btn.delete {
  background: #fee2e2;
  color: #dc2626;
}

.empty-state {
  text-align: center;
  padding: 50px;
  color: #6b7280;
}

.empty-state i {
  font-size: 45px;
  color: #9ca3af;
}

.pagination-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  color: #6b7280;
}

.page-buttons {
  display: flex;
  align-items: center;
  gap: 10px;
}

.page-btn {
  border: none;
  background: #2563eb;
  color: white;
  width: 38px;
  height: 38px;
  border-radius: 10px;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.student-modal {
  border: none;
  border-radius: 20px;
  overflow: hidden;
}

.modal-header {
  padding: 20px 25px;
}

.modal-body {
  padding: 25px;
}

.modal-footer {
  padding: 18px 25px;
}

.modal .form-control {
  border-radius: 12px;
  padding: 12px;
}

.student-modal-avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 5px solid #dbeafe;
  object-fit: cover;
}

@media (max-width: 768px) {
  .content {
    margin-left: 0;
    padding: 15px;
  }

  .staff-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
  }

  .staff-header-right {
    width: 100%;
    justify-content: space-between;
  }

  .staff-toolbar {
    flex-direction: column;
  }

  .search-box,
  .class-filter {
    width: 100%;
  }

  .staff-table {
    min-width: 900px;
  }

  .staff-table-card {
    overflow: hidden;
  }

  .pagination-box {
    flex-direction: column;
    gap: 15px;
  }
}
</style>
