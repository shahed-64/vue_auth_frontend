<template>
  <LoadingSpinner v-if="isLoading" />
  <RouterView />
  <div class="app-layout">
    <!-- Sidebar -->
    <AccountMenuView />

    <!-- Main Content Area -->
    <main class="main-content">
      <!-- Top Navigation Bar -->
      <header class="top-bar">
        <div class="d-flex align-items-center gap-2">
          <h5 class="mb-0 fw-bold text-dark fs-6 fs-md-5">Accounts Dashboard</h5>
        </div>

        <div class="d-flex align-items-center gap-3">
          <!-- Notification Icon -->
          <button class="btn btn-light rounded-circle position-relative p-2 top-icon-btn">
            <i class="bi bi-bell fs-5 text-secondary"></i>
            <span
              class="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle"
            >
              <span class="visually-hidden">New alerts</span>
            </span>
          </button>

          <!-- User Profile -->
          <div class="d-flex align-items-center gap-2 ps-2 border-start">
            <div v-if="currentUser.image">
              <img
                :src="currentUser.image"
                @error="onImageError"
                alt="Profile"
                class="avatar rounded-circle object-fit-cover"
                style="width: 36px; height: 36px"
              />
            </div>
            <div
              v-else
              class="avatar bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold"
              style="width: 36px; height: 36px"
            >
              {{ currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'A' }}
            </div>

            <div class="d-none d-md-block text-start">
              <h6 class="mb-0 fw-bold text-dark fs-6">{{ currentUser.name }}</h6>
              <small class="text-muted d-block" style="font-size: 0.75rem">{{
                currentUser.role
              }}</small>
            </div>
          </div>
        </div>
      </header>

      <!-- Page Content -->
      <div class="page-container">
        <!-- Summary Cards Section -->
        <div class="row g-3 mb-4">
          <!-- Paid Amount -->
          <div class="col-12 col-sm-6 col-xl-3">
            <div class="card custom-card border-top-green border-0 shadow-sm rounded-4 h-100">
              <div class="card-body p-3 p-md-4 d-flex align-items-center justify-content-between">
                <div>
                  <span class="card-title-text text-muted">Paid Amount</span>
                  <h3 class="fw-bold mb-0 text-success mt-1 fs-4 fs-md-3">
                    ৳ {{ calculatedPaidAmount.toLocaleString() }}
                  </h3>
                </div>
                <div class="card-icon-box bg-green-light text-success">
                  <i class="bi bi-wallet2 fs-4"></i>
                </div>
              </div>
            </div>
          </div>

          <!-- Total Expense -->
          <div class="col-12 col-sm-6 col-xl-3">
            <div class="card custom-card border-top-red border-0 shadow-sm rounded-4 h-100">
              <div class="card-body p-3 p-md-4 d-flex align-items-center justify-content-between">
                <div>
                  <span class="card-title-text text-muted">Total Expense</span>
                  <h3 class="fw-bold mb-0 text-danger mt-1 fs-4 fs-md-3">
                    ৳ {{ totalExpense.toLocaleString() }}
                  </h3>
                </div>
                <div class="card-icon-box bg-red-light text-danger">
                  <i class="bi bi-arrow-down-circle-fill fs-4"></i>
                </div>
              </div>
            </div>
          </div>

          <!-- Total Due -->
          <div class="col-12 col-sm-6 col-xl-3">
            <div class="card custom-card border-top-yellow border-0 shadow-sm rounded-4 h-100">
              <div class="card-body p-3 p-md-4 d-flex align-items-center justify-content-between">
                <div>
                  <span class="card-title-text text-muted">Total Due</span>
                  <h3 class="fw-bold mb-0 text-warning mt-1 fs-4 fs-md-3">
                    ৳ {{ totalDueAmount.toLocaleString() }}
                  </h3>
                </div>
                <div class="card-icon-box bg-yellow-light text-warning">
                  <i class="bi bi-exclamation-circle-fill fs-4"></i>
                </div>
              </div>
            </div>
          </div>

          <!-- Current Cash -->
          <div class="col-12 col-sm-6 col-xl-3">
            <div class="card custom-card border-top-blue border-0 shadow-sm rounded-4 h-100">
              <div class="card-body p-3 p-md-4 d-flex align-items-center justify-content-between">
                <div>
                  <span class="card-title-text text-muted">Current Cash</span>
                  <h3 class="fw-bold mb-0 text-primary mt-1 fs-4 fs-md-3">
                    ৳ {{ currentCash.toLocaleString() }}
                  </h3>
                </div>
                <div class="card-icon-box bg-blue-light text-primary">
                  <i class="bi bi-cash-stack fs-4"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Main Payment History Table Card -->
        <div class="card-box">
          <!-- Header -->
          <div
            class="header d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3"
          >
            <h3 class="fw-bold text-dark mb-0 fs-5 fs-md-4">Payment History</h3>

            <input
              v-model="search"
              type="text"
              class="form-control search"
              placeholder="Search name, ID, month..."
            />
          </div>

          <hr class="my-3" />

          <!-- Table -->
          <div class="table-responsive">
            <table class="my-custom-table w-100 align-middle">
              <thead>
                <tr>
                  <th class="ps-3">#</th>
                  <th>Student ID</th>
                  <th>Name</th>
                  <th>Month</th>
                  <th>Amount</th>
                  <th>Method</th>
                  <th>Date</th>
                  <th class="text-end pe-3">Actions</th>
                </tr>
              </thead>

              <tbody>
                <tr v-for="(p, index) in paginatedPayments" :key="p.id" class="data-row">
                  <td class="ps-3 fw-semibold text-muted">
                    {{ (currentPage - 1) * perPage + index + 1 }}
                  </td>
                  <td class="fw-bold text-dark">{{ p.student?.student_id || 'N/A' }}</td>
                  <td class="fw-medium" style="color: #000">{{ p.student?.full_name || 'N/A' }}</td>
                  <td>
                    <span class="badge bg-light text-dark border px-2 py-1 fw-normal">
                      {{ p.month }}
                    </span>
                  </td>
                  <td class="fw-bold text-success">
                    ৳ {{ Number(p.paid_amount || 0).toLocaleString() }}
                  </td>
                  <td>
                    <span
                      class="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill px-3 py-1"
                    >
                      {{ p.payment_method }}
                    </span>
                  </td>
                  <td class="text-muted small">{{ p.payment_date }}</td>

                  <td class="text-end pe-3">
                    <div class="d-inline-flex gap-1">
                      <!-- PDF Receipt Link -->
                      <router-link
                        :to="`/singlePayment/${p.id}`"
                        class="btn btn-outline-primary btn-sm action-btn"
                        title="View PDF"
                      >
                        pdf
                      </router-link>

                      <!-- Edit Button -->
                      <button
                        @click="openEditModal(p)"
                        class="btn btn-outline-warning btn-sm action-btn"
                        title="Edit Payment"
                      >
                        Edit
                      </button>

                      <!-- Delete Button -->
                      <button
                        @click="deletePayment(p.id)"
                        class="btn btn-outline-danger btn-sm action-btn"
                        title="Delete Payment"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Empty State -->
          <div v-if="filteredPayments.length === 0" class="empty text-center py-4 text-muted">
            No payment found 😢
          </div>

          <!-- Dynamic Pagination Footer -->
          <div
            v-if="filteredPayments.length > 0"
            class="pagination-wrapper mt-3 d-flex justify-content-between align-items-center"
          >
            <div class="info text-muted">
              Showing <b>{{ (currentPage - 1) * perPage + 1 }}</b> -
              <b>{{ Math.min(currentPage * perPage, filteredPayments.length) }}</b>
              of <b>{{ filteredPayments.length }}</b> entries
            </div>

            <div class="controls d-flex gap-1">
              <button
                class="btn btn-sm btn-outline-secondary"
                @click="prevPage"
                :disabled="currentPage === 1"
              >
                <i class="bi bi-chevron-left"></i> Prev
              </button>

              <button
                v-for="page in totalPages"
                :key="page"
                class="btn btn-sm"
                :class="currentPage === page ? 'btn-primary' : 'btn-outline-secondary'"
                @click="currentPage = page"
              >
                {{ page }}
              </button>

              <button
                class="btn btn-sm btn-outline-secondary"
                @click="nextPage"
                :disabled="currentPage === totalPages"
              >
                Next <i class="bi bi-chevron-right"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Edit Payment Modal -->
    <div
      v-if="showEditModal"
      class="modal fade show d-block backdrop-blur"
      tabindex="-1"
      style="background: rgba(0, 0, 0, 0.5)"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow rounded-4">
          <div class="modal-header border-0 pb-0">
            <h5 class="modal-title fw-bold">Edit Payment Record</h5>
            <button type="button" class="btn-close" @click="closeEditModal"></button>
          </div>
          <form @submit.prevent="updatePayment">
            <div class="modal-body">
              <div class="mb-3">
                <label class="form-label fw-semibold">Student Name</label>
                <input
                  type="text"
                  class="form-control bg-light"
                  :value="editForm.student_name"
                  disabled
                />
              </div>

              <div class="row">
                <div class="col-md-6 mb-3">
                  <label class="form-label fw-semibold">Month</label>
                  <input v-model="editForm.month" type="text" class="form-control" required />
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label fw-semibold">Payment Method</label>
                  <select v-model="editForm.payment_method" class="form-select" required>
                    <option value="Cash">Cash</option>
                    <option value="bKash">bKash</option>
                    <option value="Nagad">Nagad</option>
                    <option value="Bank">Bank</option>
                  </select>
                </div>
              </div>

              <div class="mb-3">
                <label class="form-label fw-semibold">Paid Amount (৳)</label>
                <input
                  v-model.number="editForm.paid_amount"
                  type="number"
                  class="form-control"
                  required
                />
              </div>
            </div>

            <div class="modal-footer border-0">
              <button type="button" class="btn btn-light rounded-3 px-4" @click="closeEditModal">
                Cancel
              </button>
              <button type="submit" class="btn btn-primary rounded-3 px-4" :disabled="isSubmitting">
                <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-1"></span>
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import AccountMenuView from './AccountMenuView.vue'
import api from '@/services/api'
import LoadingSpinner from '../../components/LoadingSpinner.vue'
import { isLoading } from '../../utils/loading'
// Table & Main State
const payments = ref([])
const search = ref('')

// Dashboard Calculation States
const totalPaidAmount = ref(0)
const totalDueAmount = ref(0)
const totalExpense = ref(0)
const totalOtherPayment = ref(0)

// Profile State
const currentUser = ref({
  name: '',
  role: '',
  image: '',
})

// Pagination
const currentPage = ref(1)
const perPage = 10

// Edit Modal
const showEditModal = ref(false)
const isSubmitting = ref(false)
const editForm = ref({
  id: null,
  student_name: '',
  month: '',
  paid_amount: 0,
  payment_method: 'Cash',
})

// Avatar Builder
import { getImageUrl } from '@/utils/img'
const onImageError = (e) => {
  e.target.onerror = null
  e.target.src = defaultAvatar
}

/* ==========================================
    DASHBOARD-BASED COMPUTED CALCULATIONS
========================================== */

// Admission + Exam Fee Calculation
const admissionExamCollection = computed(() => {
  return payments.value.reduce((total, payment) => {
    return total + Number(payment.admission_fee || 0) + Number(payment.exam_fee || 0)
  }, 0)
})

// Total Paid Calculation (Same as Dashboard Header Card)
const calculatedPaidAmount = computed(() => {
  return (
    Number(totalPaidAmount.value) +
    Number(admissionExamCollection.value) +
    Number(totalOtherPayment.value)
  )
})

// Current Cash Calculation (Same as Dashboard Header Card)
const currentCash = computed(() => {
  return Number(calculatedPaidAmount.value) - Number(totalExpense.value)
})

/* ==========================================
    API FETCH FUNCTIONS
========================================== */

// Fetch Payments Data
const fetchPayments = async () => {
  try {
    const response = await api.get('/payments')
    const data = response.data

    payments.value = data.payments || data.data || []
    totalPaidAmount.value = data.total_paid_amount || 0
    totalDueAmount.value = data.total_due_amount || 0

    // User Profile Handling
    const loggedUser = data.user || data.manager || data.logged_in_user || data.accountant
    if (loggedUser) {
      currentUser.value = {
        name: loggedUser.name || loggedUser.full_name || loggedUser.username || 'Administrator',
        role:
          loggedUser.role || loggedUser.user_type || loggedUser.designation || 'Accounts Manager',
        image: getImageUrl(
          loggedUser.image || loggedUser.profile_photo || loggedUser.avatar || loggedUser.photo,
        ),
      }
    }
  } catch (error) {
    console.error('Error fetching payments:', error)
  }
}

// Fetch Expense Data (From /expenses API)
const fetchTotalExpense = async () => {
  try {
    const response = await api.get('/expenses')
    totalExpense.value = (response.data.expenses || []).reduce((total, expense) => {
      return total + Number(expense.salary_amount || 0)
    }, 0)
  } catch (error) {
    console.error('Expense Error:', error)
  }
}

// Fetch Other Payment Data (From /other-payments API)
const fetchTotalOtherPayment = async () => {
  try {
    const response = await api.get('/other-payments')
    const rawOtherPayments = response.data.data || []
    totalOtherPayment.value = rawOtherPayments.reduce((total, payment) => {
      return total + Number(payment.total_amount || 0)
    }, 0)
  } catch (error) {
    console.error('Other Payment Error:', error)
  }
}

onMounted(() => {
  fetchPayments()
  fetchTotalExpense()
  fetchTotalOtherPayment()
})

/* ==========================================
    EDIT & DELETE ACTIONS
========================================== */
const openEditModal = (payment) => {
  editForm.value = {
    id: payment.id,
    student_name: payment.student?.full_name || 'N/A',
    month: payment.month,
    paid_amount: payment.paid_amount,
    payment_method: payment.payment_method || 'Cash',
  }
  showEditModal.value = true
}

const closeEditModal = () => {
  showEditModal.value = false
}

const updatePayment = async () => {
  isSubmitting.value = true
  try {
    const res = await api.put(`/payments/${editForm.value.id}`, {
      paid_amount: editForm.value.paid_amount,
      payment_method: editForm.value.payment_method,
      month: editForm.value.month,
    })

    if (res.status === 200 || res.data.status) {
      alert('Payment details updated successfully!')
      closeEditModal()
      fetchPayments()
    }
  } catch (error) {
    console.error('Failed to update payment:', error)
    alert(error.response?.data?.message || 'Failed to update payment details.')
  } finally {
    isSubmitting.value = false
  }
}

const deletePayment = async (id) => {
  if (!confirm('Are you sure you want to delete this payment record?')) return

  try {
    const res = await api.delete(`/payments/${id}`)
    if (res.status === 200 || res.status === 204 || res.data.status) {
      alert('Payment deleted successfully!')
      fetchPayments()
    }
  } catch (error) {
    console.error('Failed to delete payment:', error)
    alert('Failed to delete payment.')
  }
}

/* ==========================================
    SEARCH & PAGINATION COMPUTED
========================================== */
const filteredPayments = computed(() => {
  return payments.value.filter((p) => {
    const k = search.value.toLowerCase()
    return (
      p.student?.full_name?.toLowerCase().includes(k) ||
      p.student?.student_id?.toLowerCase().includes(k) ||
      p.month?.toLowerCase().includes(k)
    )
  })
})

const totalPages = computed(() => Math.ceil(filteredPayments.value.length / perPage) || 1)

const paginatedPayments = computed(() => {
  const start = (currentPage.value - 1) * perPage
  return filteredPayments.value.slice(start, start + perPage)
})

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++
}

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--
}

watch(search, () => {
  currentPage.value = 1
})
</script>
<style scoped>
.app-layout {
  display: flex;
  min-height: 100vh;
  width: 100%;
  background-color: #f4f6f9;
  position: relative;
  overflow-x: hidden;
}

.main-content {
  flex: 1 1 auto;
  width: 100%;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.top-bar {
  background: #ffffff;
  padding: 12px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e2e8f0;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);
  position: sticky;
  top: 0;
  z-index: 99;
}

.top-icon-btn {
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar {
  width: 36px;
  height: 36px;
  font-size: 0.95rem;
}

.page-container {
  width: 85%;
  margin-left: 263px;
  transition: all 0.3s ease;
}

@media (max-width: 992px) {
  .page-container {
    width: calc(100% - 263px);
  }
}

@media (max-width: 768px) {
  .page-container {
    width: 100% !important;
    margin-left: 0 !important;
    padding: 12px;
  }
}

.custom-card {
  background-color: #ffffff;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.custom-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.06) !important;
}

.border-top-green {
  border-top: 4px solid #10b981 !important;
}
.border-top-red {
  border-top: 4px solid #ef4444 !important;
}
.border-top-yellow {
  border-top: 4px solid #f59e0b !important;
}
.border-top-blue {
  border-top: 4px solid #3b82f6 !important;
}

.card-icon-box {
  width: 46px;
  height: 46px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.bg-green-light {
  background-color: #d1fae5;
}
.bg-red-light {
  background-color: #fee2e2;
}
.bg-yellow-light {
  background-color: #fef3c7;
}
.bg-blue-light {
  background-color: #dbeafe;
}

.card-title-text {
  font-size: 0.85rem;
  font-weight: 500;
}

.card-box {
  background: #ffffff;
  padding: 20px;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
}

.search {
  width: 100%;
  max-width: 300px;
  border-radius: 10px;
}

.table-responsive {
  width: 100%;
  overflow-x: auto;
}

.my-custom-table {
  border-collapse: collapse;
}

.my-custom-table thead tr {
  background-color: #f8fafc;
  color: #64748b;
  font-size: 0.82rem;
  text-transform: uppercase;
  border-bottom: 2px solid #e2e8f0;
}

.my-custom-table th,
.my-custom-table td {
  padding: 12px;
  white-space: nowrap;
}

.my-custom-table tbody tr.data-row {
  border-bottom: 1px solid #f1f5f9;
  background-color: #ffffff;
  transition: background-color 0.2s ease;
}

.my-custom-table tbody tr.data-row:hover {
  background-color: #f0fdf4 !important;
  box-shadow: inset 4px 0 0 #10b981;
}

.action-btn {
  border-radius: 8px;
  padding: 4px 8px;
}

.empty {
  text-align: center;
  padding: 20px;
  color: gray;
}

.pagination-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  flex-wrap: wrap;
  gap: 12px;
}

.info {
  font-size: 14px;
  color: #475569;
  font-weight: 500;
}

.controls {
  display: flex;
  align-items: center;
  gap: 6px;
}

.pg-btn {
  background: #ffffff;
  border: 1px solid #cbd5e1;
  color: #475569;
  padding: 5px 12px;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 500;
  transition: all 0.2s ease;
}

.pg-btn:hover:not(:disabled) {
  background-color: #0d6efd;
  border-color: #0d6efd;
  color: #ffffff;
}

.pg-btn:disabled {
  background-color: #f1f5f9;
  color: #94a3b8;
  cursor: not-allowed;
  border-color: #e2e8f0;
}

.pg-num-btn {
  background: #ffffff;
  border: 1px solid #cbd5e1;
  color: #475569;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.pg-num-btn:hover {
  background-color: #e2e8f0;
}

.pg-num-btn.active {
  background-color: #0d6efd;
  border-color: #0d6efd;
  color: #ffffff;
}

@media (max-width: 768px) {
  .app-layout {
    flex-direction: column;
  }

  .page-container {
    padding: 12px;
  }

  .top-bar {
    padding: 10px 14px;
  }

  .search {
    max-width: 100%;
  }

  .pagination-wrapper {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
}
</style>
