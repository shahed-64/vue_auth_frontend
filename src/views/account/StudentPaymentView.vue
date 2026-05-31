<template>
  <div class="layout bgc">
    <!-- Sidebar -->
    <AccountMenuView />

    <!-- Content -->
    <div class="content">
      <div class="card-box">
        <!-- TOPBAR -->
        <div class="topbar">
          <h3>Student Management</h3>

          <div class="filters">
            <select v-model="selectedClass" class="form-control search-box">
              <option value="">---Select a Class---</option>
              <option v-for="cls in uniqueClasses" :key="cls" :value="cls">
                {{ cls }}
              </option>
            </select>

            <input
              v-model="search"
              type="text"
              class="form-control search-box"
              placeholder="Search student ID, name, email..."
            />
          </div>
        </div>

        <hr />

        <!-- TABLE -->
        <div class="table-responsive">
          <table class="table table-hover align-middle">
            <thead>
              <tr>
                <th>#</th>
                <th>Student ID</th>
                <th>Name</th>
                <th>Class</th>
                <th>Email</th>
                <th>Due Months</th>
                <th>Status</th>
                <th width="220">Action</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="(s, index) in paginatedStudents" :key="s.id">
                <td>{{ (currentPage - 1) * perPage + index + 1 }}</td>
                <td>{{ s.student_id }}</td>
                <td>{{ s.full_name }}</td>
                <td>{{ s.batch_name }}</td>
                <td>{{ s.email }}</td>

                <td>
                  <span v-if="s.due_months?.length">
                    {{ s.due_months.join(', ') }}
                  </span>
                  <span v-else class="badge bg-success">Paid</span>
                </td>

                <td>
                  <span class="badge bg-success">
                    {{ s.status }}
                  </span>
                </td>

                <td>
                  <button
                    class="btn btn-primary btn-sm px-3"
                    data-bs-toggle="modal"
                    data-bs-target="#paymentModal"
                    @click="openPaymentModal(s)"
                  >
                    Payment
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- EMPTY -->
        <div v-if="filteredStudents.length === 0" class="text-center py-4 text-muted">
          No student found 😢
        </div>

        <!-- PAGINATION -->
        <div v-if="filteredStudents.length > 0" class="pagination-wrapper mt-4">
          <div class="pagination-info">
            Showing {{ (currentPage - 1) * perPage + 1 }} -
            {{ Math.min(currentPage * perPage, filteredStudents.length) }}
            of {{ filteredStudents.length }} students
          </div>

          <div class="d-flex align-items-center gap-2">
            <button class="btn pagination-btn" @click="prevPage" :disabled="currentPage === 1">
              ← Previous
            </button>

            <div class="page-badge">{{ currentPage }} / {{ totalPages }}</div>

            <button
              class="btn pagination-btn active-btn"
              @click="nextPage"
              :disabled="currentPage === totalPages"
            >
              Next →
            </button>
          </div>
        </div>
      </div>

      <!-- MODAL -->
      <div class="modal fade" id="paymentModal" tabindex="-1">
        <div class="modal-dialog">
          <div class="modal-content modal-custom">
            <div class="modal-header border-0">
              <h5 class="modal-title">Student Payment</h5>
              <button class="btn-close" data-bs-dismiss="modal"></button>
            </div>

            <div class="modal-body">
              <div class="mb-3">
                <label>Student</label>
                <div class="form-control bg-light">
                  {{ selectedStudent.student_id }} - {{ selectedStudent.full_name }}
                </div>
              </div>

              <input v-model="form.amount" class="form-control mb-2" placeholder="Amount" />
              <input v-model="form.paid_amount" class="form-control mb-2" placeholder="Paid" />

              <select v-model="form.month" class="form-select mb-2">
                <option disabled value="">Month</option>
                <option>January</option>
                <option>February</option>
                <option>March</option>
                <option>April</option>
                <option>May</option>
                <option>June</option>
                <option>July</option>
                <option>August</option>
                <option>September</option>
                <option>October</option>
                <option>November</option>
                <option>December</option>
              </select>

              <input v-model="form.payment_method" class="form-control mb-2" placeholder="Method" />
              <input v-model="form.payment_date" type="date" class="form-control" />
            </div>

            <div class="modal-footer border-0">
              <button class="btn btn-light" data-bs-dismiss="modal">Close</button>
              <button class="btn btn-success" @click="savePayment">Save Payment</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, watch } from 'vue'

import AccountMenuView from './AccountMenuView.vue'
import { useRouter } from 'vue-router'
import api from '@/services/api'

const router = useRouter()

const students = ref([])
const search = ref('')
const selectedClass = ref('')

/* Pagination */
const currentPage = ref(1)
const perPage = 10

/* Student */
const selectedStudent = reactive({
  student_id: '',
  full_name: '',
})

/* Form */
const form = reactive({
  student_id: '',
  amount: '',
  paid_amount: '',
  payment_method: '',
  payment_date: '',
  month: '',
})

/* Search */
const filteredStudents = computed(() => {
  return students.value.filter((s) => {
    const keyword = search.value.toLowerCase()

    const matchSearch =
      s.student_id?.toLowerCase().includes(keyword) ||
      s.full_name?.toLowerCase().includes(keyword) ||
      s.email?.toLowerCase().includes(keyword)

    const matchClass = !selectedClass.value || s.batch_name === selectedClass.value

    return matchSearch && matchClass
  })
})

/* Total Pages */
const totalPages = computed(() => {
  return Math.ceil(filteredStudents.value.length / perPage)
})

/* Paginated Data */
const paginatedStudents = computed(() => {
  const start = (currentPage.value - 1) * perPage

  return filteredStudents.value.slice(start, start + perPage)
})

/* Page */
const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++
}

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--
}

/* Reset page on search */
watch(search, () => {
  currentPage.value = 1
})

/* Modal */
const openPaymentModal = (student) => {
  selectedStudent.student_id = student.student_id

  selectedStudent.full_name = student.full_name

  form.student_id = student.id
  form.amount = ''
  form.paid_amount = ''
  form.payment_method = ''
  form.payment_date = ''
  form.month = ''
}

/* Save Payment */

const savePayment = async () => {
  try {
    const res = await api.post('/payments', form)
    const paymentId = res.data.payment.id

    const modalEl = document.getElementById('paymentModal')
    const modalInstance = bootstrap.Modal.getOrCreateInstance(modalEl)
    modalInstance.hide()

    // ✅ CRITICAL FIX (layout break + blur + stuck backdrop fix)
    setTimeout(() => {
      document.querySelectorAll('.modal-backdrop').forEach((el) => el.remove())
      document.body.classList.remove('modal-open')
      document.body.style.overflow = ''
    }, 200)

    router.push(`/singlePayment/${paymentId}`)
  } catch (err) {
    console.log(err)
    alert('Payment save failed')
  }
}
/* Get Students */
const getStudents = async () => {
  try {
    const res = await api.get('/students')

    students.value = res.data.students || []
  } catch (err) {
    console.log(err)
  }
}

const uniqueClasses = computed(() => {
  const classes = students.value.map((s) => s.batch_name).filter(Boolean)

  return [...new Set(classes)]
})

onMounted(() => {
  getStudents()
})
</script>
<style>
/* =========================
   LAYOUT
========================= */
.bgc {
  background: #f4f6f9;
  min-height: 100vh;
  width: 100%;
}

.layout {
  display: flex;
  width: 100%;
  min-height: 100vh;
}

.content {
  flex: 1;
  margin-left: 250px;
  padding: 20px;
  width: calc(100% - 250px);
}

/* =========================
   CARD
========================= */
.card-box {
  background: #fff;
  border-radius: 18px;
  padding: 22px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.06);
}

/* =========================
   TOPBAR (FIXED)
========================= */
.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.filters {
  display: flex;
  gap: 10px;
  align-items: center;
}

.search-box {
  width: 260px;
  border-radius: 10px;
}

/* =========================
   TABLE
========================= */
.table-responsive {
  width: 100%;
  overflow-x: auto;
}

.table thead th {
  background: #0d6efd;
  color: #fff;
  white-space: nowrap;
}

.table td,
.table th {
  white-space: nowrap;
}

/* =========================
   PAGINATION
========================= */
.pagination-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 15px;
}

/* =========================
   MOBILE FIX (IMPORTANT)
========================= */
@media (max-width: 768px) {
  .content {
    margin-left: 0;
    width: 100%;
    padding: 12px;
  }

  .topbar {
    flex-direction: column;
    align-items: stretch;
  }

  .filters {
    flex-direction: column;
    width: 100%;
  }

  .search-box {
    width: 100% !important;
  }
}
</style>
