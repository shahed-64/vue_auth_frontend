<template>
  <div class="d-flex bgc">
    <AccountMenuView />

    <div class="content flex-grow-1">
      <!-- Header -->
      <div class="topbar">
        <h3>Student Management</h3>

        <input
          v-model="search"
          type="text"
          class="form-control search-box"
          placeholder="Search student ID, name, email..."
        />
      </div>

      <!-- Table Card -->
      <div class="card-box mt-3">
        <div class="table-responsive">
          <table class="table table-hover align-middle">
            <thead>
              <tr>
                <th>#</th>
                <th>Student ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Due Months</th>
                <th>Status</th>
                <th width="220">Action</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="(s, index) in paginatedStudents" :key="s.id">
                <td>
                  {{ (currentPage - 1) * perPage + index + 1 }}
                </td>

                <td>{{ s.student_id }}</td>
                <td>{{ s.full_name }}</td>
                <td>{{ s.email }}</td>

                <td>
                  <span v-if="s.due_months?.length">
                    {{ s.due_months.join(', ') }}
                  </span>

                  <span v-else class="badge bg-success"> Paid </span>
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

        <!-- Empty -->
        <div v-if="filteredStudents.length === 0" class="text-center py-4 text-muted">
          No student found 😢
        </div>

        <!-- Pagination -->
        <div v-if="filteredStudents.length > 0" class="pagination-wrapper mt-4">
          <div class="pagination-info">
            Showing
            <strong>
              {{ (currentPage - 1) * perPage + 1 }}
            </strong>
            -
            <strong>
              {{ Math.min(currentPage * perPage, filteredStudents.length) }}
            </strong>
            of
            <strong>
              {{ filteredStudents.length }}
            </strong>
            students
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
              <!-- Student -->
              <div class="mb-3">
                <label class="form-label"> Student </label>

                <div class="form-control bg-light">
                  {{ selectedStudent.student_id }}
                  -
                  {{ selectedStudent.full_name }}
                </div>
              </div>

              <!-- Amount -->
              <div class="mb-3">
                <label>Amount</label>

                <input v-model="form.amount" type="number" class="form-control" />
              </div>

              <!-- Paid -->
              <div class="mb-3">
                <label>Paid Amount</label>

                <input v-model="form.paid_amount" type="number" class="form-control" />
              </div>

              <!-- Month -->
              <div class="mb-3">
                <label>Month</label>

                <select v-model="form.month" class="form-select">
                  <option disabled value="">Select Month</option>

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
              </div>

              <!-- Method -->
              <div class="mb-3">
                <label>Payment Method</label>

                <input v-model="form.payment_method" class="form-control" />
              </div>

              <!-- Date -->
              <div class="mb-3">
                <label>Payment Date</label>

                <input v-model="form.payment_date" type="date" class="form-control" />
              </div>
            </div>

            <div class="modal-footer border-0">
              <button class="btn btn-light" data-bs-dismiss="modal">Close</button>

              <button class="btn btn-success px-4" @click="savePayment">Save Payment</button>
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

    return (
      s.student_id?.toLowerCase().includes(keyword) ||
      s.full_name?.toLowerCase().includes(keyword) ||
      s.email?.toLowerCase().includes(keyword)
    )
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

    const modal = document.getElementById('paymentModal')

    const modalInstance = bootstrap.Modal.getInstance(modal)

    modalInstance.hide()

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

onMounted(() => {
  getStudents()
})
</script>

<style>
.bgc {
  background: #f4f6f9;
  min-height: 100vh;
}

.content {
  padding: 24px;
}

.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.search-box {
  width: 300px;
  border-radius: 12px;
}

.card-box {
  background: #fff;
  border-radius: 18px;
  padding: 22px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.06);
}

.table thead th {
  background: #0d6efd;
  color: #fff;
}

.table tbody tr:hover {
  background: #f8fbff;
}

.pagination-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.pagination-btn {
  border: 1px solid #ddd;
  border-radius: 10px;
}

.active-btn {
  background: #0d6efd;
  color: white;
}

.page-badge {
  background: #fff;
  border: 1px solid #ddd;
  padding: 8px 16px;
  border-radius: 10px;
  font-weight: bold;
}

.modal-custom {
  border-radius: 18px;
}
</style>
