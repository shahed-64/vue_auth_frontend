<template>
  <AccountMenuView />

  <div class="mid">
    <div class="container-fluid py-4">
      <!-- Header -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 class="fw-bold mb-1 header-title">Expense Management</h2>
          <p class="text-muted mb-0">Manage all coaching expenses, staff payments and bills.</p>
        </div>

        <button
          class="btn btn-primary px-4 py-2 fw-semibold rounded-3"
          data-bs-toggle="modal"
          data-bs-target="#expenseModal"
          @click="resetForm"
        >
          <i class="bi bi-plus-circle me-2"></i>
          Add Expense
        </button>
      </div>

      <!-- Summary Cards (Image Style) -->
      <div class="row g-3 mb-4">
        <div class="col-lg-3 col-md-6">
          <div class="dash-summary-card card-blue">
            <div>
              <small>Total Expense</small>
              <h2>৳ {{ totalExpense }}</h2>
            </div>
            <div class="summary-icon">
              <i class="bi bi-wallet2"></i>
            </div>
          </div>
        </div>

        <div class="col-lg-3 col-md-6">
          <div class="dash-summary-card card-green">
            <div>
              <small>Monthly Expense</small>
              <h2>৳ {{ monthlyExpense }}</h2>
            </div>
            <div class="summary-icon">
              <i class="bi bi-calendar-check"></i>
            </div>
          </div>
        </div>

        <div class="col-lg-3 col-md-6">
          <div class="dash-summary-card card-orange">
            <div>
              <small>Total Paid</small>
              <h2>৳ {{ totalPaid }}</h2>
            </div>
            <div class="summary-icon">
              <i class="bi bi-check-circle"></i>
            </div>
          </div>
        </div>

        <div class="col-lg-3 col-md-6">
          <div class="dash-summary-card card-purple">
            <div>
              <small>Pending Due</small>
              <h2>৳ {{ totalDue }}</h2>
            </div>
            <div class="summary-icon">
              <i class="bi bi-clock-history"></i>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Card Container -->
      <div class="card shadow-sm border-0 rounded-4 overflow-hidden mb-4">
        <!-- Search Bar Header Area -->
        <div class="card-body bg-white border-bottom py-3">
          <div class="row g-3 justify-content-end align-items-center">
            <div class="col-md-4 col-lg-3">
              <input
                type="text"
                class="form-control rounded-3"
                placeholder="Search ID / Name / Method"
                v-model="search"
                @input="currentPage = 1"
              />
            </div>
          </div>
        </div>

        <!-- Table with Blue Header -->
        <div class="table-responsive">
          <table class="table table-hover align-middle mb-0">
            <thead class="custom-blue-header">
              <tr>
                <th width="50">#</th>
                <th>Expense Type</th>
                <th>Employee Name</th>
                <th>Salary</th>
                <th>Paid</th>
                <th>Due</th>
                <th>Paid Months</th>
                <th>Method</th>
                <th>Date</th>
                <th width="160" class="text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="(expense, index) in paginatedExpenses" :key="expense.id">
                <td class="fw-semibold text-muted">
                  {{ (currentPage - 1) * itemsPerPage + index + 1 }}
                </td>
                <td class="fw-bold text-dark">{{ expense.expense_type }}</td>
                <td>{{ expense.employee_name || '-' }}</td>
                <td>৳ {{ expense.salary_amount }}</td>
                <td>
                  <span
                    class="badge bg-success-subtle text-success border border-success-subtle px-2 py-1"
                    >৳ {{ expense.paid_amount }}</span
                  >
                </td>
                <td>
                  <span
                    class="badge bg-danger-subtle text-danger border border-danger-subtle px-2 py-1"
                    >৳ {{ expense.due_amount }}</span
                  >
                </td>
                <td class="text-success fw-semibold">
                  {{ formatPaymentMonth(expense.payment_month) }}
                </td>
                <td>{{ expense.payment_method }}</td>
                <td>{{ expense.payment_date }}</td>
                <td>
                  <!-- Fixed Action Buttons Alignment -->
                  <div class="d-flex justify-content-center gap-2">
                    <button
                      class="btn btn-sm btn-warning fw-semibold px-3 text-white"
                      @click="editExpense(expense)"
                      data-bs-toggle="modal"
                      data-bs-target="#expenseModal"
                    >
                      Edit
                    </button>

                    <button
                      class="btn btn-sm btn-danger fw-semibold px-3"
                      @click="deleteExpense(expense.id)"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>

              <tr v-if="filteredExpenses.length === 0">
                <td colspan="10" class="text-center py-5 text-muted">No Expense Record Found</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination Controls (Matching Image Design) -->
        <div
          class="card-footer bg-white py-3 border-0 d-flex justify-content-between align-items-center flex-wrap gap-3"
        >
          <span class="text-secondary fw-semibold fs-7">
            Showing {{ showingStart }} - {{ showingEnd }} of {{ filteredExpenses.length }} Expenses
          </span>

          <div class="d-flex align-items-center gap-2" v-if="totalPages > 0">
            <!-- Prev Button -->
            <button
              class="btn btn-light border px-3 fw-semibold text-muted"
              :class="{ disabled: currentPage === 1 }"
              @click="currentPage--"
              :disabled="currentPage === 1"
            >
              Previous
            </button>

            <!-- Page Number Display (1 / 1 Style) -->
            <span
              class="badge bg-primary-subtle text-primary border border-primary-subtle px-3 py-2 fs-6 fw-bold"
            >
              {{ currentPage }} / {{ totalPages }}
            </span>

            <!-- Next Button -->
            <button
              class="btn btn-light border px-3 fw-semibold text-muted"
              :class="{ disabled: currentPage === totalPages || filteredExpenses.length === 0 }"
              @click="currentPage++"
              :disabled="currentPage === totalPages || filteredExpenses.length === 0"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <!-- Modal -->
      <div class="modal fade" id="expenseModal" tabindex="-1">
        <div class="modal-dialog modal-lg modal-dialog-centered">
          <div class="modal-content border-0 shadow-lg rounded-4">
            <form @submit.prevent="saveExpense">
              <div class="modal-header border-bottom-0 pb-0">
                <h5 class="modal-title fw-bold">
                  {{ isEditing ? 'Update Expense' : 'Add Expense' }}
                </h5>
                <button class="btn-close" data-bs-dismiss="modal" type="button"></button>
              </div>

              <div class="modal-body p-4">
                <div class="row g-3">
                  <!-- Expense Type -->
                  <div class="col-md-6">
                    <label class="form-label fw-semibold"> Expense Type </label>
                    <select class="form-select rounded-3" v-model="form.expense_type" required>
                      <option value="">Select Expense Type</option>
                      <option v-for="type in expenseTypes" :key="type.id" :value="type.name">
                        {{ type.name }}
                      </option>
                    </select>
                  </div>

                  <!-- Employee -->
                  <div class="col-md-6">
                    <label class="form-label fw-semibold"> Employee Name </label>
                    <input
                      class="form-control rounded-3"
                      v-model="form.employee_name"
                      placeholder="Optional"
                    />
                  </div>

                  <!-- Salary -->
                  <div class="col-md-4">
                    <label class="form-label fw-semibold"> Salary Amount </label>
                    <input
                      type="number"
                      class="form-control rounded-3"
                      v-model="form.salary_amount"
                      required
                    />
                  </div>

                  <!-- Paid -->
                  <div class="col-md-4">
                    <label class="form-label fw-semibold"> Paid Amount </label>
                    <input
                      type="number"
                      class="form-control rounded-3"
                      v-model="form.paid_amount"
                      required
                    />
                  </div>

                  <!-- Due -->
                  <div class="col-md-4">
                    <label class="form-label fw-semibold"> Due Amount </label>
                    <input
                      type="number"
                      class="form-control rounded-3 bg-light"
                      :value="form.due_amount"
                      readonly
                    />
                  </div>

                  <!-- Payment Month -->
                  <div class="col-md-6">
                    <label class="form-label fw-semibold"> Payment Month </label>
                    <input
                      type="month"
                      class="form-control rounded-3"
                      v-model="form.payment_month"
                    />
                  </div>

                  <!-- Payment Method -->
                  <div class="col-md-6">
                    <label class="form-label fw-semibold"> Payment Method </label>
                    <select class="form-select rounded-3" v-model="form.payment_method" required>
                      <option value="">Select Payment Method</option>
                      <option v-for="method in paymentMethods" :key="method" :value="method">
                        {{ method }}
                      </option>
                    </select>
                  </div>

                  <!-- Date -->
                  <div class="col-md-12">
                    <label class="form-label fw-semibold"> Payment Date </label>
                    <input
                      type="date"
                      class="form-control rounded-3"
                      v-model="form.payment_date"
                      required
                    />
                  </div>
                </div>
              </div>

              <div class="modal-footer border-top-0 pt-0">
                <button class="btn btn-light px-4 rounded-3" data-bs-dismiss="modal" type="button">
                  Cancel
                </button>
                <button class="btn btn-primary px-4 rounded-3" type="submit">
                  {{ isEditing ? 'Update Expense' : 'Save Expense' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import axios from 'axios'
import AccountMenuView from './AccountMenuView.vue'

// ===============================
// API URL
// ===============================
const API_URL = 'http://127.0.0.1:8000/api/expenses'

// ===============================
// State
// ===============================
const expenses = ref([])
const search = ref('')
const isEditing = ref(false)
const editingId = ref(null)

// ===============================
// Pagination State
// ===============================
const currentPage = ref(1)
const itemsPerPage = ref(10)

// ===============================
// Form
// ===============================
const form = ref({
  expense_type: '',
  employee_name: '',
  salary_amount: '',
  paid_amount: '',
  due_amount: 0,
  payment_month: '',
  payment_method: '',
  payment_date: '',
})

// ===============================
// Expense Types & Methods
// ===============================
const expenseTypes = [
  { id: 1, name: 'Staff Payment' },
  { id: 2, name: 'Teacher Payment' },
  { id: 3, name: 'Rent' },
  { id: 4, name: 'Electricity Bill' },
  { id: 5, name: 'Internet Bill' },
  { id: 6, name: 'Office Expense' },
  { id: 7, name: 'Others' },
]

const paymentMethods = ['Cash', 'Bkash', 'Nagad', 'Bank']

// ===============================
// Auto Calculate Due Amount
// ===============================
watch(
  () => [form.value.salary_amount, form.value.paid_amount],
  () => {
    const salary = Number(form.value.salary_amount) || 0
    const paid = Number(form.value.paid_amount) || 0

    form.value.due_amount = salary - paid

    if (form.value.due_amount < 0) {
      form.value.due_amount = 0
    }
  },
)

// ===============================
// Filter & Pagination
// ===============================
const filteredExpenses = computed(() => {
  if (!search.value) {
    return expenses.value
  }

  return expenses.value.filter(
    (expense) =>
      expense.expense_type?.toLowerCase().includes(search.value.toLowerCase()) ||
      expense.employee_name?.toLowerCase().includes(search.value.toLowerCase()) ||
      expense.payment_method?.toLowerCase().includes(search.value.toLowerCase()),
  )
})

const paginatedExpenses = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredExpenses.value.slice(start, end)
})

const totalPages = computed(() => {
  return Math.ceil(filteredExpenses.value.length / itemsPerPage.value) || 1
})

const showingStart = computed(() => {
  if (filteredExpenses.value.length === 0) return 0
  return (currentPage.value - 1) * itemsPerPage.value + 1
})

const showingEnd = computed(() => {
  const end = currentPage.value * itemsPerPage.value
  return end > filteredExpenses.value.length ? filteredExpenses.value.length : end
})

// ===============================
// Dashboard Cards
// ===============================
const totalExpense = computed(() => {
  return expenses.value.reduce((total, expense) => total + Number(expense.salary_amount || 0), 0)
})

const totalPaid = computed(() => {
  return expenses.value.reduce((total, expense) => total + Number(expense.paid_amount || 0), 0)
})

const totalDue = computed(() => {
  return expenses.value.reduce((total, expense) => total + Number(expense.due_amount || 0), 0)
})

const monthlyExpense = computed(() => {
  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()

  return expenses.value
    .filter((expense) => {
      if (!expense.payment_date) return false
      const date = new Date(expense.payment_date)
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear
    })
    .reduce((total, expense) => total + Number(expense.salary_amount || 0), 0)
})

// ===============================
// Actions
// ===============================
const resetForm = () => {
  isEditing.value = false
  editingId.value = null

  form.value = {
    expense_type: '',
    employee_name: '',
    salary_amount: '',
    paid_amount: '',
    due_amount: 0,
    payment_month: '',
    payment_method: '',
    payment_date: '',
  }
}

const formatPaymentMonth = (monthStr) => {
  if (!monthStr) return '-'

  const parts = monthStr.split('-')
  if (parts.length === 2) {
    const year = parts[0]
    const monthIndex = parseInt(parts[1], 10) - 1
    const date = new Date(year, monthIndex, 1)
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  }

  return monthStr
}

const getExpenses = async () => {
  try {
    const response = await axios.get(API_URL)
    expenses.value = response.data.expenses || response.data || []
  } catch (error) {
    console.error('Error fetching expenses:', error)
  }
}

const saveExpense = async () => {
  try {
    if (isEditing.value) {
      await axios.put(`${API_URL}/${editingId.value}`, form.value)
      alert('Expense Updated Successfully')
    } else {
      await axios.post(API_URL, form.value)
      alert('Expense Added Successfully')
    }

    await getExpenses()
    resetForm()

    const modalElement = document.getElementById('expenseModal')
    if (modalElement) {
      const modal = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement)
      modal.hide()
    }
  } catch (error) {
    console.error('Error saving expense:', error)
    if (error.response?.data?.errors) {
      alert(Object.values(error.response.data.errors).flat().join('\n'))
    } else {
      alert('Something went wrong.')
    }
  }
}

const editExpense = (expense) => {
  isEditing.value = true
  editingId.value = expense.id

  form.value = {
    expense_type: expense.expense_type || '',
    employee_name: expense.employee_name || '',
    salary_amount: expense.salary_amount || '',
    paid_amount: expense.paid_amount || '',
    due_amount: expense.due_amount || 0,
    payment_month: expense.payment_month || '',
    payment_method: expense.payment_method || '',
    payment_date: expense.payment_date || '',
  }
}

const deleteExpense = async (id) => {
  if (!confirm('Are you sure you want to delete this expense?')) return

  try {
    await axios.delete(`${API_URL}/${id}`)
    alert('Expense Deleted Successfully')
    getExpenses()
  } catch (error) {
    console.error('Error deleting expense:', error)
  }
}

onMounted(() => {
  getExpenses()
})
</script>

<style scoped>
/* =========================
   SUMMARY CARDS (MATCHING IMAGE)
========================= */
.dash-summary-card {
  border-radius: 12px;
  padding: 20px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
  transition: all 0.25s ease;
}

.dash-summary-card small {
  opacity: 0.9;
  font-size: 14px;
  font-weight: 500;
}

.dash-summary-card h2 {
  margin-top: 8px;
  font-size: 26px;
  font-weight: 700;
  color: #ffffff !important;
  margin-bottom: 0;
}

/* Background Colors like Image */
.card-blue {
  background: #1d4ed8;
}
.card-green {
  background: #15803d;
}
.card-orange {
  background: #c2410c;
}
.card-purple {
  background: #6d28d9;
}

.summary-icon {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  flex-shrink: 0;
}

/* =========================
   TABLE HEADER (BLUE STYLE)
========================= */
.custom-blue-header {
  background-color: #2563eb !important;
}

.custom-blue-header th {
  background-color: #2563eb !important;
  color: #ffffff !important;
  font-weight: 600;
  padding: 14px;
  border: none;
  white-space: nowrap;
}

.table td {
  padding: 14px;
  white-space: nowrap;
}

/* Layout Adjustment */
.mid {
  width: calc(100% - 266px);
  margin-left: 266px;
  transition: all 0.3s ease;
}

@media (max-width: 991.98px) {
  .mid {
    width: 100%;
    margin-left: 0;
    padding: 15px;
  }
}
</style>
