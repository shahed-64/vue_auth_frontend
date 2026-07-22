<template>
  <AccountMenuView />

  <div class="main-content">
    <!-- ================= Header ================= -->
    <div class="d-flex justify-content-between align-items-center flex-wrap mb-4 gap-3">
      <div>
        <h2 class="fw-bold mb-1 header-title">Student Payment Dashboard</h2>
        <p class="text-muted mb-0">Manage class wise payment reports</p>
      </div>

      <div class="search-box">
        <div class="input-group">
          <span class="input-group-text">
            <i class="fa-solid fa-magnifying-glass"></i>
          </span>
          <input
            v-model="search"
            type="text"
            class="form-control"
            placeholder="Search Student ID or Name"
            @input="currentPage = 1"
          />
        </div>
      </div>
    </div>

    <!-- ================= Summary Cards ================= -->
    <div class="row g-4 mb-4">
      <div class="col-lg-3 col-md-6">
        <div class="dash-summary-card blue">
          <div>
            <small>Total Students</small>
            <h2>{{ totalStudents }}</h2>
          </div>
          <div class="summary-icon">
            <i class="fa-solid fa-user-graduate"></i>
          </div>
        </div>
      </div>

      <div class="col-lg-3 col-md-6">
        <div class="dash-summary-card green">
          <div>
            <small>Total Collection</small>
            <h2>৳ {{ totalCollection }}</h2>
          </div>
          <div class="summary-icon">
            <i class="fa-solid fa-money-bill-wave"></i>
          </div>
        </div>
      </div>

      <div class="col-lg-3 col-md-6">
        <div class="dash-summary-card red">
          <div>
            <small>Total Due</small>
            <h2>৳ {{ totalDue }}</h2>
          </div>
          <div class="summary-icon">
            <i class="fa-solid fa-circle-exclamation"></i>
          </div>
        </div>
      </div>

      <div class="col-lg-3 col-md-6">
        <div class="dash-summary-card orange">
          <div>
            <small>Total Unpaid Students</small>
            <h2>{{ totalUnpaidStudents }}</h2>
          </div>
          <div class="summary-icon">
            <i class="fa-solid fa-user-xmark"></i>
          </div>
        </div>
      </div>
    </div>

    <!-- ================= Batch Buttons ================= -->
    <div class="card shadow-sm border-0 mb-4">
      <div class="card-body">
        <div class="d-flex flex-wrap gap-2">
          <button
            v-for="batch in batches"
            :key="batch"
            @click="selectBatch(batch)"
            class="btn"
            :class="selectedBatch === batch ? 'btn-primary' : 'btn-outline-primary'"
          >
            {{ batch }}
          </button>
        </div>
      </div>
    </div>

    <!-- ================= Table ================= -->
    <div class="card border-0 shadow-sm mb-4">
      <div
        class="card-header bg-white d-flex justify-content-between align-items-center py-3 flex-wrap gap-2"
      >
        <h5 class="fw-bold mb-0">Student Payment Report</h5>
        <span class="badge bg-primary fs-6 fw-normal"> {{ totalStudents }} Students </span>
      </div>

      <div class="table-responsive">
        <table class="table table-hover align-middle mb-0">
          <thead class="table-light">
            <tr>
              <th>ID</th>
              <th>Student Name</th>
              <th>Batch</th>
              <th>Monthly Fee</th>
              <th>Total Paid</th>
              <th>Total Due</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="payment in paginatedStudents" :key="payment.id">
              <td class="fw-bold">{{ payment.student.student_id }}</td>
              <td>{{ payment.student.full_name }}</td>
              <td>
                <span class="badge bg-light text-dark border">{{
                  payment.student.batch_name
                }}</span>
              </td>
              <td>৳ {{ payment.amount }}</td>
              <td class="text-success fw-semibold">৳ {{ payment.paid_amount }}</td>
              <td class="text-danger fw-semibold">৳ {{ payment.due_amount }}</td>
              <td>
                <span class="badge" :class="payment.status === 'paid' ? 'bg-success' : 'bg-danger'">
                  {{ payment.status }}
                </span>
              </td>
              <td>
                <button
                  class="btn btn-sm btn-primary"
                  @click="openSummary(payment.student)"
                  data-bs-toggle="modal"
                  data-bs-target="#studentModal"
                >
                  View
                </button>
              </td>
            </tr>

            <!-- Empty State -->
            <tr v-if="filteredStudents.length === 0">
              <td colspan="8" class="text-center py-4 text-muted">No record found!</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- ================= Prev - Page Numbers - Next Pagination ================= -->
      <div
        class="card-footer bg-white py-3 border-0 d-flex justify-content-between align-items-center flex-wrap gap-3"
      >
        <!-- Showing Info -->
        <span class="text-muted fs-7">
          Showing {{ showingStart }} to {{ showingEnd }} of {{ filteredStudents.length }} entries
        </span>

        <!-- Pagination Controls with Page Numbers -->
        <nav v-if="totalPages > 0">
          <ul class="pagination pagination-sm mb-0 align-items-center">
            <!-- Prev Button -->
            <li class="page-item" :class="{ disabled: currentPage === 1 }">
              <button class="page-link px-3" @click="currentPage--" :disabled="currentPage === 1">
                <i class="fa-solid fa-chevron-left me-1"></i> Prev
              </button>
            </li>

            <!-- Page Numbers -->
            <li
              v-for="page in totalPages"
              :key="page"
              class="page-item"
              :class="{ active: currentPage === page }"
            >
              <button class="page-link" @click="currentPage = page">
                {{ page }}
              </button>
            </li>

            <!-- Next Button -->
            <li
              class="page-item"
              :class="{ disabled: currentPage === totalPages || filteredStudents.length === 0 }"
            >
              <button
                class="page-link px-3"
                @click="currentPage++"
                :disabled="currentPage === totalPages || filteredStudents.length === 0"
              >
                Next <i class="fa-solid fa-chevron-right ms-1"></i>
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </div>

  <!-- Student Profile Modal -->
  <div class="modal fade" id="studentModal" tabindex="-1">
    <div class="modal-dialog modal-lg modal-dialog-centered">
      <div class="modal-content border-0 shadow-lg">
        <!-- Header -->
        <div class="modal-header border-0 pb-0">
          <h4 class="fw-bold mb-0">Student Profile</h4>
          <button class="btn-close" data-bs-dismiss="modal"></button>
        </div>

        <div class="modal-body p-4">
          <div class="row g-4">
            <!-- Left Profile Sidebar -->
            <div class="col-md-4">
              <div class="profile-card text-center">
                <img
                  :src="
                    selectedStudent.image ||
                    `https://ui-avatars.com/api/?name=${selectedStudent.full_name}`
                  "
                  class="profile-img mb-3"
                  alt="Profile Image"
                />

                <h5 class="fw-bold mb-1">
                  {{ selectedStudent.full_name }}
                </h5>

                <p class="text-muted mb-2">
                  {{ selectedStudent.student_id }}
                </p>

                <span
                  class="badge"
                  :class="selectedStudent.status == 'active' ? 'bg-success' : 'bg-danger'"
                >
                  {{ selectedStudent.status }}
                </span>

                <hr class="my-3" />

                <div class="profile-info text-start">
                  <div>
                    <small class="d-block">Batch</small>
                    <h6 class="mb-0">{{ selectedStudent.batch_name }}</h6>
                  </div>

                  <div class="mt-3">
                    <small class="d-block">Monthly Fee</small>
                    <h6 class="mb-0">
                      ৳ {{ Number(selectedStudent.monthly_fee || 0).toLocaleString() }}
                    </h6>
                  </div>
                </div>
              </div>
            </div>

            <!-- Right Summary Grid -->
            <div class="col-md-8">
              <h6 class="fw-bold mb-3">Payment Summary</h6>

              <div class="row g-3">
                <div class="col-6 col-sm-6">
                  <div class="modal-summary-card">
                    <small>Total Paid</small>
                    <h4 class="text-success">
                      ৳ {{ Number(selectedStudent.total_paid || 0).toLocaleString() }}
                    </h4>
                  </div>
                </div>

                <div class="col-6 col-sm-6">
                  <div class="modal-summary-card">
                    <small>Total Due</small>
                    <h4 class="text-danger">
                      ৳ {{ Number(selectedStudent.total_due || 0).toLocaleString() }}
                    </h4>
                  </div>
                </div>

                <div class="col-6 col-sm-6">
                  <div class="modal-summary-card">
                    <small>Unpaid Month</small>
                    <h4 style="color: brown">
                      {{ selectedStudent.unpaid_months || 0 }}
                    </h4>
                  </div>
                </div>

                <div class="col-6 col-sm-6">
                  <div class="modal-summary-card">
                    <small>Unpaid Amount</small>
                    <h4 class="text-warning">
                      ৳ {{ Number(selectedStudent.unpaid_amount || 0).toLocaleString() }}
                    </h4>
                  </div>
                </div>
              </div>

              <div class="outstanding-card mt-4">
                <small>Total Outstanding</small>
                <h2 class="text-danger fw-bold mt-2 mb-0">
                  ৳ {{ Number(selectedStudent.total_outstanding || 0).toLocaleString() }}
                </h2>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-footer border-0 pt-0">
          <button class="btn btn-secondary px-4 rounded-pill" data-bs-dismiss="modal">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import AccountMenuView from './AccountMenuView.vue'

/* ============================= Search ============================= */
const search = ref('')

/* ============================= Summary Cards ============================= */
const totalStudents = ref(0)
const totalCollection = ref(0)
const totalDue = ref(0)
const totalUnpaidStudents = ref(0)

/* ============================= Data ============================= */
const payments = ref([])
const students = ref([])
const selectedStudent = ref({})

/* ============================= Pagination State ============================= */
const currentPage = ref(1)
const itemsPerPage = ref(10)

/* ============================= Batch Buttons ============================= */
const batches = ref([
  'All',
  'class-1',
  'class-2',
  'class-3',
  'class-4',
  'class-5',
  'class-6',
  'class-7',
  'class-8',
  'class-9',
  'class-10',
  'class-11',
  'class-12',
])

const selectedBatch = ref('All')

const selectBatch = (batch) => {
  selectedBatch.value = batch
  currentPage.value = 1
}

/* ============================= Load Data ============================= */
onMounted(async () => {
  try {
    const paymentRes = await axios.get('http://127.0.0.1:8000/api/payments')

    payments.value = paymentRes.data.payments
    totalStudents.value = paymentRes.data.total_students
    totalCollection.value = paymentRes.data.total_paid_amount
    totalDue.value = paymentRes.data.total_due_amount
    totalUnpaidStudents.value = paymentRes.data.total_unpaid_students

    const reportRes = await axios.get('http://127.0.0.1:8000/api/student-payment-report')
    students.value = reportRes.data.students
  } catch (error) {
    console.error('API Error:', error)
  }
})

/* ============================= Modal ============================= */
const openSummary = (student) => {
  const reportStudent = students.value.find((s) => Number(s.id) === Number(student.id))

  if (reportStudent) {
    selectedStudent.value = { ...reportStudent }
  } else {
    selectedStudent.value = {
      ...student,
      total_paid: 0,
      total_due: 0,
      unpaid_months: 0,
      unpaid_amount: 0,
      total_outstanding: 0,
    }
  }
}

/* ============================= Table Filter & Pagination ============================= */
const filteredStudents = computed(() => {
  const uniqueStudents = []

  payments.value.forEach((payment) => {
    const exists = uniqueStudents.find((item) => item.student.id === payment.student.id)
    if (!exists) {
      uniqueStudents.push(payment)
    }
  })

  return uniqueStudents.filter((payment) => {
    const student = payment.student

    const batchMatch = selectedBatch.value === 'All' || student.batch_name === selectedBatch.value

    const searchMatch =
      student.full_name.toLowerCase().includes(search.value.toLowerCase()) ||
      student.student_id.toLowerCase().includes(search.value.toLowerCase())

    return batchMatch && searchMatch
  })
})

/* Computed for Paginated Data */
const paginatedStudents = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredStudents.value.slice(start, end)
})

/* Total Pages */
const totalPages = computed(() => {
  return Math.ceil(filteredStudents.value.length / itemsPerPage.value) || 1
})

/* Helper Texts */
const showingStart = computed(() => {
  if (filteredStudents.value.length === 0) return 0
  return (currentPage.value - 1) * itemsPerPage.value + 1
})

const showingEnd = computed(() => {
  const end = currentPage.value * itemsPerPage.value
  return end > filteredStudents.value.length ? filteredStudents.value.length : end
})
</script>

<style scoped>
/* =========================
   MAIN LAYOUT & CONTAINER
========================= */
.main-content {
  margin-left: 260px;
  width: calc(100% - 260px);
  min-height: 100vh;
  padding: 30px;
  background: #f4f7fb;
  transition: all 0.3s ease;
}

/* =========================
   HEADER & SEARCH
========================= */
.search-box {
  width: 320px;
}

.search-box .input-group {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);
}

.search-box .input-group-text {
  background: #fff;
  border: none;
}

.search-box .form-control {
  border: none;
  box-shadow: none;
}

/* =========================
   DASHBOARD SUMMARY CARDS
========================= */
.dash-summary-card {
  border-radius: 18px;
  padding: 25px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
  transition: all 0.3s ease;
  cursor: pointer;
  min-height: 120px;
}

.dash-summary-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 20px 35px rgba(0, 0, 0, 0.18);
}

.dash-summary-card small {
  opacity: 0.9;
  font-size: 15px;
}

.dash-summary-card h2 {
  margin-top: 10px;
  font-size: 28px;
  font-weight: 700;
  color: #ffffff !important;
  margin-bottom: 0;
}

/* GRADIENTS */
.blue {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
}
.green {
  background: linear-gradient(135deg, #22c55e, #16a34a);
}
.red {
  background: linear-gradient(135deg, #ef4444, #dc2626);
}
.orange {
  background: linear-gradient(135deg, #f59e0b, #ea580c);
}

.summary-icon {
  width: 65px;
  height: 65px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  flex-shrink: 0;
}

/* =========================
   CARDS & BUTTONS
========================= */
.card {
  border: none;
  border-radius: 18px;
  overflow: hidden;
}

.btn-outline-primary,
.btn-primary {
  padding: 9px 22px;
  border-radius: 30px;
  font-weight: 600;
  transition: all 0.25s ease;
}

.btn-outline-primary:hover {
  transform: translateY(-2px);
}

.btn-sm {
  padding: 7px 16px;
  border-radius: 10px;
}

/* =========================
   TABLE STYLING
========================= */
.table {
  margin-bottom: 0;
}

.table thead th {
  background: #f8fafc;
  font-weight: 700;
  white-space: nowrap;
  padding: 15px;
}

.table td {
  padding: 15px;
  vertical-align: middle;
  white-space: nowrap;
}

.table tbody tr {
  transition: all 0.25s ease;
}

.table tbody tr:hover {
  background: #f7fbff;
}

.badge {
  padding: 8px 14px;
  border-radius: 30px;
  font-size: 13px;
}

.table-responsive::-webkit-scrollbar {
  height: 8px;
}

.table-responsive::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 20px;
}

/* =========================
   PAGINATION STYLING
========================= */
.pagination .page-item .page-link {
  border: 1px solid #e5e7eb;
  padding: 6px 14px;
  margin: 0 3px;
  border-radius: 8px;
  color: #4b5563;
  font-weight: 600;
  box-shadow: none;
  transition: all 0.2s ease;
}

.pagination .page-item .page-link:hover {
  background-color: #f3f4f6;
  color: #2563eb;
}

.pagination .page-item.active .page-link {
  background-color: #2563eb;
  border-color: #2563eb;
  color: #fff;
}

.pagination .page-item.disabled .page-link {
  background-color: #f9fafb;
  border-color: #e5e7eb;
  color: #d1d5db;
  cursor: not-allowed;
}

/* =========================
   MODAL SPECIFIC STYLES
========================= */
.profile-card {
  background: #f8fafc;
  border: 1px solid #e9ecef;
  border-radius: 18px;
  padding: 25px;
  text-align: center;
  height: 100%;
}

.profile-img {
  width: 110px;
  height: 110px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid white;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
}

.profile-info small {
  color: #6c757d;
}

.profile-info h6 {
  margin-top: 5px;
  font-weight: 600;
}

.modal-summary-card {
  background: white;
  border: 1px solid #ececec;
  border-radius: 15px;
  padding: 18px;
  transition: all 0.25s ease;
}

.modal-summary-card:hover {
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

.modal-summary-card small {
  color: #6c757d;
  font-size: 13px;
}

.modal-summary-card h4 {
  margin-top: 8px;
  margin-bottom: 0;
  font-weight: 700;
}

.outstanding-card {
  background: #f8f9fa;
  border-radius: 16px;
  border-left: 5px solid #dc3545;
  padding: 20px;
}

/* =========================
   RESPONSIVE MEDIA QUERIES
========================= */
@media (max-width: 992px) {
  .main-content {
    margin-left: 0 !important;
    width: 100% !important;
    padding: 18px;
  }

  .search-box {
    width: 100%;
  }

  .dash-summary-card {
    min-height: 105px;
  }
}

@media (max-width: 768px) {
  .header-title {
    font-size: 1.5rem;
  }

  .dash-summary-card h2 {
    font-size: 22px;
  }

  .summary-icon {
    width: 50px;
    height: 50px;
    font-size: 22px;
  }

  .table {
    font-size: 14px;
  }

  .modal-summary-card {
    padding: 12px;
  }

  .modal-summary-card h4 {
    font-size: 1.1rem;
  }
}
</style>
