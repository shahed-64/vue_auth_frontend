<template>
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
            <div
              class="avatar bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold"
            >
              A
            </div>
            <div class="d-none d-md-block text-start">
              <h6 class="mb-0 fw-bold text-dark fs-6">Admin User</h6>
              <small class="text-muted d-block" style="font-size: 0.75rem">Accounts Manager</small>
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
                    ৳ {{ totalPaidAmount.toLocaleString() }}
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
                    ৳ {{ totalDue.toLocaleString() }}
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
                  <th class="text-end pe-3">Receipt</th>
                </tr>
              </thead>

              <tbody>
                <tr v-for="(p, index) in paginatedPayments" :key="p.id" class="data-row">
                  <td class="ps-3 fw-semibold text-muted">
                    {{ (currentPage - 1) * perPage + index + 1 }}
                  </td>
                  <td class="fw-bold text-dark">{{ p.student?.student_id }}</td>
                  <td class="fw-medium">{{ p.student?.full_name }}</td>
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
                    <router-link
                      :to="`/singlePayment/${p.id}`"
                      class="btn btn-primary btn-sm action-btn"
                    >
                      <i class="bi bi-file-earmark-pdf me-1"></i> PDF
                    </router-link>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Empty State -->
          <div v-if="filteredPayments.length === 0" class="empty">No payment found 😢</div>

          <!-- Dynamic Pagination Footer -->
          <div v-if="filteredPayments.length > 0" class="pagination-wrapper">
            <div class="info">
              Showing <b>{{ (currentPage - 1) * perPage + 1 }}</b> -
              <b>{{ Math.min(currentPage * perPage, filteredPayments.length) }}</b>
              of <b>{{ filteredPayments.length }}</b> entries
            </div>

            <div class="controls">
              <button class="pg-btn" @click="prevPage" :disabled="currentPage === 1">
                <i class="bi bi-chevron-left"></i> Prev
              </button>

              <button
                v-for="page in totalPages"
                :key="page"
                class="pg-num-btn"
                :class="{ active: currentPage === page }"
                @click="currentPage = page"
              >
                {{ page }}
              </button>

              <button class="pg-btn" @click="nextPage" :disabled="currentPage === totalPages">
                Next <i class="bi bi-chevron-right"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import AccountMenuView from './AccountMenuView.vue'
import api from '@/services/api'

const payments = ref([])
const search = ref('')

// Summary State Values
const totalPaidAmount = ref(3000)
const totalExpense = ref(1000)
const totalDue = ref(200)
const currentCash = ref(2000)

const currentPage = ref(1)
const perPage = 10

onMounted(async () => {
  try {
    const res = await api.get('/payments')
    payments.value = res.data.payments || []
  } catch (error) {
    console.error('Error fetching payments:', error)
  }
})

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
/* ==========================================
   GLOBAL LAYOUT FIX (FIXES SCREENSHOT ISSUE)
========================================== */
.app-layout {
  display: flex;
  min-height: 100vh;
  width: 100%;
  background-color: #f4f6f9;
  position: relative;
  overflow-x: hidden; /* Prevents unwanted horizontal scrolling */
}

/* MAIN CONTENT WRAPPER */
.main-content {
  flex: 1 1 auto;
  width: 100%;
  min-width: 0; /* Critical for Flexbox child overflow */
  display: flex;
  flex-direction: column;
}

/* TOP BAR STYLING */
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

/* PAGE CONTAINER */
.page-container {
  width: 85%;
  margin-left: 263px;
}

/* Desktop / Default Styles */
.page-container {
  width: 85%;
  margin-left: 263px;
  transition: all 0.3s ease;
}

/* Tablet Responsive (992px এর নিচে) */
@media (max-width: 992px) {
  .page-container {
    width: calc(100% - 263px); /* কন্টেইনার যেন ডানে ওভারফ্লো না করে */
  }
}

/* Mobile Responsive (768px বা তার ছোট স্ক্রিনের জন্য) */
@media (max-width: 768px) {
  .page-container {
    width: 100% !important; /* মোবাইলে পুরো স্ক্রিনজুড়ে থাকবে */
    margin-left: 0 !important; /* বামের ২৬৩px ফাঁকা জায়গা সম্পূর্ণ তুলে দেওয়া হলো */
    padding: 12px; /* ছোট স্ক্রিনের জন্য হালকা প্যাডিং */
  }
}

/* SUMMARY CARDS STYLING */
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

/* CARD BOX */
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

/* TABLE STYLING */
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

/* Row Hover */
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
  padding: 4px 10px;
}

/* EMPTY STATE */
.empty {
  text-align: center;
  padding: 20px;
  color: gray;
}

/* PAGINATION STYLING */
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

/* ==========================================
   MOBILE & TABLET RESPONSIVE OVERRIDES
========================================== */
@media (max-width: 768px) {
  .app-layout {
    flex-direction: column; /* Stacks sidebar and main content vertically on mobile */
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
