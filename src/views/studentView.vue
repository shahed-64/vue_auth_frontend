<template>
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
            <h4>
              {{ students.length }}
            </h4>

            <span> Total Students </span>
          </div>
        </div>

        <button class="btn btn-light add-btn" data-bs-toggle="modal" data-bs-target="#addModal">
          <i class="bi bi-person-plus-fill"></i>

          Add Student
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

              <th>Class</th>

              <th>Email</th>

              <th>Status</th>

              <th width="180">Action</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="(item, index) in paginatedStudents" :key="item.id">
              <td>
                {{ (currentPage - 1) * perPage + index + 1 }}
              </td>

              <td>
                <img src="https://i.pravatar.cc/100?img=1" class="staff-avatar" />
              </td>

              <td>
                <div class="staff-name">
                  <strong>
                    {{ item.full_name }}
                  </strong>

                  <small>
                    {{ item.student_id }}
                  </small>
                </div>
              </td>

              <td>
                <span class="skill-badge">
                  {{ item.batch_name }}
                </span>
              </td>

              <td>
                {{ item.email }}
              </td>

              <td>
                <span class="role-badge" :class="item.status?.toLowerCase()">
                  {{ item.status }}
                </span>
              </td>

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

      <!-- EMPTY -->

      <div v-if="filteredStudents.length === 0" class="empty-state">
        <i class="bi bi-person-x"></i>

        <h5>No Student Found</h5>

        <p>Try changing search or filter</p>
      </div>

      <!-- PAGINATION -->

      <div v-if="filteredStudents.length > 0" class="pagination-box">
        <div>
          Showing

          <b>
            {{ (currentPage - 1) * perPage + 1 }}
          </b>

          to

          <b>
            {{ Math.min(currentPage * perPage, filteredStudents.length) }}
          </b>

          of

          <b>
            {{ filteredStudents.length }}
          </b>
        </div>

        <div class="page-buttons">
          <button class="page-btn" @click="prevPage" :disabled="currentPage === 1">
            <i class="bi bi-chevron-left"></i>
          </button>

          <span> {{ currentPage }} / {{ totalPages }} </span>

          <button class="page-btn" @click="nextPage" :disabled="currentPage === totalPages">
            <i class="bi bi-chevron-right"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- ================= ADD MODAL ================= -->

    <div class="modal fade" id="addModal">
      <div class="modal-dialog">
        <div class="modal-content student-modal">
          <div class="modal-header">
            <h5>Add Student</h5>

            <button class="btn-close" data-bs-dismiss="modal"></button>
          </div>

          <div class="modal-body">
            <input v-model="form.full_name" class="form-control mb-3" placeholder="Full Name" />

            <input v-model="form.phone" class="form-control mb-3" placeholder="Phone" />

            <input v-model="form.email" class="form-control mb-3" placeholder="Email" />

            <input v-model="form.course_name" class="form-control mb-3" placeholder="Course" />

            <select v-model="form.batch_name" class="form-control mb-3">
              <option value="">Select Class</option>

              <option v-for="n in 12" :key="n" :value="'class-' + n">Class {{ n }}</option>
            </select>

            <input v-model="form.admission_date" type="date" class="form-control mb-3" />

            <select v-model="form.status" class="form-control">
              <option value="Active">Active</option>

              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <div class="modal-footer">
            <button class="btn btn-secondary" data-bs-dismiss="modal">Close</button>

            <button class="btn btn-primary" @click="student_create">Save</button>
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
            <img src="https://i.pravatar.cc/150" class="student-modal-avatar" />

            <h4 class="mt-3">
              {{ selectedStudent.full_name }}
            </h4>

            <p>
              {{ selectedStudent.email }}
            </p>

            <hr />

            <p>
              Class:
              <b>
                {{ selectedStudent.batch_name }}
              </b>
            </p>

            <p>
              Phone:
              <b>
                {{ selectedStudent.phone }}
              </b>
            </p>

            <p>
              Status:
              <b>
                {{ selectedStudent.status }}
              </b>
            </p>
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
            <input
              v-model="selectedStudent.full_name"
              class="form-control mb-3"
              placeholder="Name"
            />

            <input v-model="selectedStudent.phone" class="form-control mb-3" placeholder="Phone" />

            <input v-model="selectedStudent.email" class="form-control mb-3" placeholder="Email" />

            <select v-model="selectedStudent.batch_name" class="form-control mb-3">
              <option v-for="cls in uniqueClasses" :key="cls">
                {{ cls }}
              </option>
            </select>

            <select v-model="selectedStudent.status" class="form-control">
              <option>Active</option>

              <option>Inactive</option>
            </select>
          </div>

          <div class="modal-footer">
            <button class="btn btn-secondary" data-bs-dismiss="modal">Close</button>

            <button class="btn btn-primary" @click="updateStudent">Update</button>
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

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'

// ===============================
// STATES
// ===============================

const students = ref([])

const search = ref('')

const selectedClass = ref('')

const loading = ref(false)

// ===============================
// PAGINATION
// ===============================

const currentPage = ref(1)

const perPage = ref(10)

// ===============================
// FORM
// ===============================

const form = reactive({
  full_name: '',

  student_id: '',

  phone: '',

  email: '',

  course_name: '',

  batch_name: '',

  admission_date: '',

  status: 'Active',
})

// ===============================
// SELECTED STUDENT
// ===============================

const selectedStudent = ref({
  id: null,

  full_name: '',

  student_id: '',

  phone: '',

  email: '',

  course_name: '',

  batch_name: '',

  admission_date: '',

  status: '',
})

// ===============================
// RESET FORM
// ===============================

const resetForm = () => {
  Object.keys(form).forEach((key) => {
    form[key] = ''
  })

  form.status = 'Active'
}

// ===============================
// GET STUDENT
// ===============================

const getStudent = async () => {
  try {
    loading.value = true

    const res = await api.get('/students')

    students.value = res.data.students || []
  } catch (error) {
    console.log(error)
  } finally {
    loading.value = false
  }
}

// ===============================
// CREATE STUDENT
// ===============================

const student_create = async () => {
  try {
    await api.post(
      '/student_create',

      form,
    )

    alert('Student created successfully')

    closeModal('addModal')

    resetForm()

    await getStudent()
  } catch (error) {
    console.log(error.response?.data)

    alert('Something went wrong')
  }
}

// ===============================
// OPEN VIEW
// ===============================

const openView = (student) => {
  selectedStudent.value = {
    ...student,
  }
}

// ===============================
// OPEN EDIT
// ===============================

const openEdit = (student) => {
  selectedStudent.value = {
    ...student,
  }
}

// ===============================
// UPDATE STUDENT
// ===============================

const updateStudent = async () => {
  try {
    await api.put(
      `/students/${selectedStudent.value.id}`,

      selectedStudent.value,
    )

    alert('Updated successfully')

    closeModal('editModal')

    await getStudent()
  } catch (error) {
    console.log(error.response?.data)
  }
}

// ===============================
// DELETE STUDENT
// ===============================

const deleteStudent = async (id) => {
  if (!confirm('Are you sure you want to delete?')) return

  try {
    await api.delete(`/students/${id}`)

    students.value = students.value.filter((item) => item.id !== id)

    alert('Deleted successfully')
  } catch (error) {
    console.log(error.response?.data)
  }
}

// ===============================
// CLOSE MODAL FIX
// ===============================

const closeModal = (id) => {
  const modalEl = document.getElementById(id)

  if (modalEl) {
    const modal = bootstrap.Modal.getInstance(modalEl)

    if (modal) {
      modal.hide()
    }
  }

  setTimeout(() => {
    document.querySelectorAll('.modal-backdrop').forEach((el) => el.remove())

    document.body.classList.remove('modal-open')

    document.body.style.overflow = ''

    document.body.style.paddingRight = ''
  }, 300)
}

// ===============================
// UNIQUE CLASS
// ===============================

const uniqueClasses = computed(() => {
  const classes = students.value

    .map((item) => item.batch_name)

    .filter(Boolean)

  return [...new Set(classes)]
})

// ===============================
// FILTER
// ===============================

const filteredStudents = computed(() => {
  const keyword = search.value.toLowerCase()

  return students.value.filter((student) => {
    const matchSearch =
      student.full_name

        ?.toLowerCase()

        .includes(keyword) ||
      student.email

        ?.toLowerCase()

        .includes(keyword) ||
      student.student_id

        ?.toLowerCase()

        .includes(keyword)

    const matchClass = !selectedClass.value || student.batch_name === selectedClass.value

    return matchSearch && matchClass
  })
})

// ===============================
// PAGINATION
// ===============================

const totalPages = computed(() => {
  return Math.ceil(filteredStudents.value.length / perPage.value)
})

const paginatedStudents = computed(() => {
  const start = (currentPage.value - 1) * perPage.value

  return filteredStudents.value.slice(
    start,

    start + perPage.value,
  )
})

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

// RESET PAGE

watch(
  [search, selectedClass],

  () => {
    currentPage.value = 1
  },
)

// INIT

onMounted(() => {
  getStudent()
})
</script>
<style scoped>
/* =========================
GLOBAL CONTENT
========================= */

.content {
  margin-left: 250px;

  padding: 25px;

  background: #f8fafc;

  min-height: 100vh;
}

/* =========================
HEADER
========================= */

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

/* SUMMARY */

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

/* =========================
MAIN CARD
========================= */

.staff-table-card {
  background: white;

  border-radius: 20px;

  padding: 25px;

  box-shadow: 0 10px 25px rgba(15, 23, 42, 0.08);
}

/* =========================
TOOLBAR
========================= */

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

/* =========================
TABLE
========================= */

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

/* IMAGE */

.staff-avatar {
  width: 45px;

  height: 45px;

  border-radius: 50%;

  object-fit: cover;

  border: 3px solid #dbeafe;
}

/* NAME */

.staff-name {
  display: flex;

  flex-direction: column;
}

.staff-name small {
  color: #6b7280;

  font-size: 12px;
}

/* BADGE */

.skill-badge {
  background: #eff6ff;

  color: #2563eb;

  padding: 6px 12px;

  border-radius: 20px;

  font-size: 13px;

  font-weight: 600;
}

.role-badge {
  padding: 6px 12px;

  border-radius: 20px;

  font-size: 13px;

  font-weight: 600;

  background: #dcfce7;

  color: #15803d;
}

.role-badge.inactive {
  background: #fee2e2;

  color: #dc2626;
}

/* =========================
ACTION BUTTON
========================= */

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

/* =========================
EMPTY STATE
========================= */

.empty-state {
  text-align: center;

  padding: 50px;

  color: #6b7280;
}

.empty-state i {
  font-size: 45px;

  color: #9ca3af;
}

/* =========================
PAGINATION
========================= */

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

/* =========================
MODAL
========================= */

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
}

/* =========================
MOBILE
========================= */

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
