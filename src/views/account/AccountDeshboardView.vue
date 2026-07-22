<template>
  <!-- Sidebar -->
  <AccountMenuView />

  <!-- Main Dashboard -->
  <div class="d-flex bg-light min-vh-100">
    <div class="dashboard-content">
      <!-- Header -->

      <div class="dashboard-header">
        <div class="welcome-content">
          <div class="welcome-icon">
            <i class="bi bi-speedometer2"></i>
          </div>

          <div>
            <h2>Welcome Back, Administrator 👋</h2>

            <p>Manage your students, payments and coaching activities from one place.</p>
          </div>
        </div>

        <div class="header-right">
          <div class="date-card">
            <i class="bi bi-calendar3"></i>

            <div>
              <small> Today </small>

              <strong> Dashboard </strong>
            </div>
          </div>
        </div>
      </div>
      <!-- ================= TOP STATISTICS ================= -->

      <div class="row g-4">
        <!-- Paid -->

        <div class="col-xl-3 col-md-6">
          <div class="dashboard-card paid-card">
            <div class="card-content">
              <span> Paid Amount </span>

              <h2 class="text-success">
                ৳
                {{
                  Number(totalPaidAmount) +
                  Number(admissionExamCollection) +
                  Number(totalOtherPayment)
                }}
              </h2>
            </div>

            <div class="stat-icon success">
              <i class="bi bi-wallet2"></i>
            </div>
          </div>
        </div>

        <!-- Expense -->

        <div class="col-xl-3 col-md-6">
          <div class="dashboard-card expense-card">
            <div class="card-content">
              <span> Total Expense </span>

              <h2 class="text-danger">৳ {{ totalExpense }}</h2>
            </div>

            <div class="stat-icon danger">
              <i class="bi bi-cash-stack"></i>
            </div>
          </div>
        </div>

        <!-- Due -->

        <div class="col-xl-3 col-md-6">
          <div class="dashboard-card due-card">
            <div class="card-content">
              <span> Total Due </span>

              <h2 class="text-warning">৳ {{ totalDueAmount }}</h2>
            </div>

            <div class="stat-icon warning">
              <i class="bi bi-exclamation-circle"></i>
            </div>
          </div>
        </div>

        <!-- Cash -->

        <div class="col-xl-3 col-md-6">
          <div class="dashboard-card cash-card">
            <div class="card-content">
              <span> Current Cash </span>

              <h2 class="text-primary">৳ {{ currentCash }}</h2>
            </div>

            <div class="stat-icon primary">
              <i class="bi bi-bank"></i>
            </div>
          </div>
        </div>
      </div>

      <!-- ================= CHART + QUICK OVERVIEW ================= -->

      <div class="row g-4 mt-4">
        <!-- Chart -->

        <div class="col-lg-8">
          <div class="dashboard-box chart-box">
            <div class="box-header">
              <div>
                <h5>
                  <i class="bi bi-bar-chart-line-fill text-primary"></i>

                  Monthly Payment Chart
                </h5>

                <p>Monthly collection performance</p>
              </div>

              <button class="btn btn-light btn-sm">This Year</button>
            </div>

            <div class="chart-area">
              <MonthlyPaymentChart :payments="monthlyPayments" />
            </div>
          </div>
        </div>

        <!-- Quick Overview -->

        <div class="col-lg-4">
          <div class="dashboard-box quick-box">
            <h5 class="mb-4">Quick Overview</h5>

            <div class="quick-item">
              <i class="bi bi-currency-dollar text-success"></i>

              <div>
                <h4>৳ {{ thisMonthCollection }}</h4>

                <small> This Month Collection </small>
              </div>
            </div>

            <div class="quick-item">
              <i class="bi bi-bag-check text-primary"></i>

              <div>
                <h4>৳ {{ totalOtherPayment.toLocaleString() }}</h4>

                <small> Other Collection </small>
              </div>
            </div>

            <div class="quick-item">
              <i class="bi bi-calendar-x text-danger"></i>

              <div>
                <h4>৳ {{ thisMonthDue }}</h4>

                <small> This Month Due </small>
              </div>
            </div>

            <div class="quick-item">
              <i class="bi bi-person-x text-warning"></i>

              <div>
                <h4>
                  {{ runningMonthUnpaidStudents }}
                </h4>

                <small> Unpaid Students </small>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ================= STUDENT STATISTICS ================= -->

      <div class="row g-4 mt-4">
        <div class="col-md-3">
          <div class="dashboard-box small-stat">
            <i class="bi bi-mortarboard text-primary"></i>

            <h3>
              {{ totalStudents }}
            </h3>

            <p>Total Students</p>
          </div>
        </div>

        <div class="col-md-3">
          <div class="dashboard-box small-stat">
            <i class="bi bi-exclamation-triangle text-danger"></i>

            <h3>
              {{ dueStudents }}
            </h3>

            <p>Due Students</p>
          </div>
        </div>

        <div class="col-md-3">
          <div class="dashboard-box small-stat">
            <i class="bi bi-cash-coin text-success"></i>

            <h3>৳ {{ todayCollection }}</h3>

            <p>Today's Collection</p>
          </div>
        </div>

        <div class="col-md-3">
          <div class="dashboard-box small-stat">
            <i class="bi bi-receipt text-warning"></i>

            <h3>৳ {{ admissionExamCollection }}</h3>

            <p>Admission + Exam Fee</p>
          </div>
        </div>
      </div>

      <!-- ================= RECENT PAYMENTS ================= -->

      <div class="dashboard-box payment-box mt-4">
        <div class="box-header">
          <div>
            <h5>
              <i class="bi bi-clock-history text-success"></i>

              Recent Payments
            </h5>

            <p>Latest student transactions</p>
          </div>

          <button class="btn btn-primary btn-sm">View All</button>
        </div>

        <div class="table-responsive">
          <table class="table payment-table">
            <thead>
              <tr>
                <th>#</th>

                <th>Student</th>

                <th>Amount</th>

                <th>Status</th>

                <th>Date</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="(payment, index) in recentPayments.slice(0, 5)" :key="payment.id">
                <td>
                  {{ index + 1 }}
                </td>

                <td>
                  {{ payment.student.full_name }}
                </td>

                <td>৳ {{ payment.paid_amount }}</td>

                <td>
                  <span
                    class="badge"
                    :class="payment.status === 'paid' ? 'bg-success' : 'bg-danger'"
                  >
                    {{ payment.status }}
                  </span>
                </td>

                <td>
                  {{ payment.payment_date }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import AccountMenuView from './AccountMenuView.vue'
import MonthlyPaymentChart from '@/components/MonthlyPaymentChart.vue'

import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

// =====================
// Dashboard States
// =====================

const totalPaidAmount = ref(0)
const totalDueAmount = ref(0)
const totalStudents = ref(0)
const dueStudents = ref(0)
const recentPayments = ref([])
const monthlyPayments = ref([])
const thisMonthDue = ref(0)
const payments = ref([])
const totalExpense = ref(0)
const totalOtherPayment = ref(0)
const runningMonthUnpaidStudents = ref(0)
const rawOtherPayments = ref([]) // আদার্স পেমেন্টের মূল ডাটা রাখার জন্য

// =====================
// Admission + Exam Fee
// =====================

const admissionExamCollection = computed(() => {
  return payments.value.reduce((total, payment) => {
    return total + Number(payment.admission_fee || 0) + Number(payment.exam_fee || 0)
  }, 0)
})

// =====================
// Current Cash
// =====================

const currentCash = computed(() => {
  return (
    Number(totalPaidAmount.value) +
    Number(admissionExamCollection.value) +
    Number(totalOtherPayment.value) -
    Number(totalExpense.value)
  )
})

// ==========================================
// Computed: This Month Collection (Updated)
// ==========================================
const thisMonthCollection = computed(() => {
  const currentDate = new Date()
  const currentYear = currentDate.getFullYear()
  const currentMonth = currentDate.getMonth() // 0 - 11

  // ১. এই মাসের Regular Payments + Admission Fee + Exam Fee
  const mainPaymentsThisMonth = payments.value.reduce((total, payment) => {
    if (!payment.payment_date) return total
    const pDate = new Date(payment.payment_date)

    if (pDate.getFullYear() === currentYear && pDate.getMonth() === currentMonth) {
      const paid = Number(payment.paid_amount || 0)
      const admission = Number(payment.admission_fee || 0)
      const exam = Number(payment.exam_fee || 0)
      return total + paid + admission + exam
    }
    return total
  }, 0)

  // ২. এই মাসের Other Payments
  const otherPaymentsThisMonth = rawOtherPayments.value.reduce((total, payment) => {
    const pDate = new Date(payment.created_at || payment.date)
    if (pDate.getFullYear() === currentYear && pDate.getMonth() === currentMonth) {
      return total + Number(payment.total_amount || 0)
    }
    return total
  }, 0)

  return mainPaymentsThisMonth + otherPaymentsThisMonth
})

// ==========================================
// Computed: Today's Collection (Updated)
// ==========================================
const todayCollection = computed(() => {
  const todayStr = new Date().toISOString().slice(0, 10) // YYYY-MM-DD ফরম্যাট

  // ১. আজকের Regular Payments + Admission Fee + Exam Fee
  const mainPaymentsToday = payments.value.reduce((total, payment) => {
    if (!payment.payment_date) return total
    const paymentDateStr = payment.payment_date.slice(0, 10)

    if (paymentDateStr === todayStr) {
      const paid = Number(payment.paid_amount || 0)
      const admission = Number(payment.admission_fee || 0)
      const exam = Number(payment.exam_fee || 0)
      return total + paid + admission + exam
    }
    return total
  }, 0)

  // ২. আজকের Other Payments
  const otherPaymentsToday = rawOtherPayments.value.reduce((total, payment) => {
    const paymentDateStr = (payment.created_at || payment.date || '').slice(0, 10)
    if (paymentDateStr === todayStr) {
      return total + Number(payment.total_amount || 0)
    }
    return total
  }, 0)

  return mainPaymentsToday + otherPaymentsToday
})

// =====================
// Get Dashboard Data
// =====================

const getDashboardData = async () => {
  try {
    const response = await axios.get('http://127.0.0.1:8000/api/payments')
    const data = response.data

    totalPaidAmount.value = data.total_paid_amount || 0
    totalDueAmount.value = data.total_due_amount || 0
    totalStudents.value = data.total_students || 0
    dueStudents.value = data.due_students || 0
    recentPayments.value = data.recent_payments || []
    monthlyPayments.value = data.monthly_payments || []
    thisMonthDue.value = data.this_month_due || 0
    runningMonthUnpaidStudents.value = data.running_month_unpaid_students || 0
    payments.value = data.payments || []
  } catch (error) {
    console.log('Dashboard Payment Error:', error)
  }
}

// =====================
// Total Expense
// =====================

const getTotalExpense = async () => {
  try {
    const response = await axios.get('http://127.0.0.1:8000/api/expenses')

    totalExpense.value = response.data.expenses.reduce((total, expense) => {
      return total + Number(expense.salary_amount || 0)
    }, 0)
  } catch (error) {
    console.log('Expense Error:', error)
  }
}

// =====================
// Other Payments
// =====================

const getTotalOtherPayment = async () => {
  try {
    const response = await axios.get('http://127.0.0.1:8000/api/other-payments')

    // মূল অ্যারেটি পরে ফিল্টার করার জন্য সেভ করে রাখা হলো
    rawOtherPayments.value = response.data.data || []

    totalOtherPayment.value = rawOtherPayments.value.reduce((total, payment) => {
      return total + Number(payment.total_amount || 0)
    }, 0)
  } catch (error) {
    console.log('Other Payment Error:', error)
  }
}

// =====================
// Mounted
// =====================

onMounted(() => {
  getDashboardData()
  getTotalExpense()
  getTotalOtherPayment()
})
</script>
<style scoped>
/* =========================
   GLOBAL
========================= */

.dashboard-content {
  margin-left: 250px;

  width: calc(100% - 250px);

  padding: 30px;

  background: #f8fafc;

  min-height: 100vh;
}

/* =========================
   HEADER
========================= */

.dashboard-header {
  background: linear-gradient(135deg, #2563eb, #4f46e5);

  padding: 35px 40px;

  border-radius: 25px;

  color: white;

  margin-bottom: 35px;

  display: flex;

  justify-content: space-between;

  align-items: center;

  position: relative;

  overflow: hidden;

  box-shadow: 0 20px 40px rgba(37, 99, 235, 0.25);
}

/* background decoration */

.dashboard-header::before {
  content: '';

  position: absolute;

  width: 220px;

  height: 220px;

  background: rgba(255, 255, 255, 0.08);

  border-radius: 50%;

  right: 80px;

  top: -80px;
}

.dashboard-header::after {
  content: '';

  position: absolute;

  width: 150px;

  height: 150px;

  background: rgba(255, 255, 255, 0.05);

  border-radius: 50%;

  right: 20px;

  bottom: -60px;
}

.welcome-content {
  display: flex;

  align-items: center;

  gap: 20px;

  z-index: 1;
}

.welcome-icon {
  width: 70px;

  height: 70px;

  border-radius: 20px;

  background: rgba(255, 255, 255, 0.15);

  display: flex;

  align-items: center;

  justify-content: center;

  font-size: 35px;

  backdrop-filter: blur(10px);
}

.welcome-content h2 {
  font-size: 32px;

  font-weight: 700;

  margin-bottom: 8px;
}

.welcome-content p {
  color: #dbeafe;

  margin: 0;

  font-size: 15px;
}

.header-right {
  z-index: 1;
}

.date-card {
  background: rgba(255, 255, 255, 0.15);

  padding: 12px 18px;

  border-radius: 16px;

  display: flex;

  align-items: center;

  gap: 12px;

  backdrop-filter: blur(10px);
}

.date-card i {
  font-size: 28px;
}

.date-card small {
  display: block;

  color: #dbeafe;
}

.date-card strong {
  font-size: 15px;
}

.dashboard-header h2 {
  font-size: 32px;

  font-weight: 700;
}

.dashboard-header p {
  color: #dbeafe;

  margin: 0;
}

.header-date {
  background: linear-gradient(135deg, #3b82f6, #6366f1);

  padding: 10px 18px;

  border-radius: 14px;

  backdrop-filter: blur(10px);
}

/* =========================
 STATISTICS CARD
========================= */

.dashboard-card {
  background: white;

  border-radius: 22px;

  padding: 25px;

  display: flex;

  justify-content: space-between;

  align-items: center;

  border: none;

  box-shadow: 0 8px 20px rgba(15, 23, 42, 0.08);

  transition: 0.35s ease;

  position: relative;

  overflow: hidden;
}

.dashboard-card::before {
  content: '';

  position: absolute;

  width: 100%;

  height: 5px;

  top: 0;

  left: 0;
}

.dashboard-card:hover {
  transform: translateY(-8px);

  box-shadow: 0 20px 40px rgba(15, 23, 42, 0.15);
}

.paid-card::before {
  background: #16a34a;
}

.expense-card::before {
  background: #dc2626;
}

.due-card::before {
  background: #f59e0b;
}

.cash-card::before {
  background: #2563eb;
}

.card-content span {
  color: #64748b;

  font-size: 14px;

  font-weight: 500;
}

.card-content h2 {
  margin-top: 12px;

  font-size: 28px;

  font-weight: 700;
}

.stat-icon {
  width: 65px;

  height: 65px;

  border-radius: 18px;

  display: flex;

  align-items: center;

  justify-content: center;

  font-size: 28px;
}

.stat-icon.success {
  background: #dcfce7;

  color: #16a34a;
}

.stat-icon.danger {
  background: #fee2e2;

  color: #dc2626;
}

.stat-icon.warning {
  background: #fef3c7;

  color: #d97706;
}

.stat-icon.primary {
  background: #dbeafe;

  color: #2563eb;
}

/* =========================
 BOX COMMON
========================= */

.dashboard-box {
  background: white;

  border-radius: 22px;

  padding: 25px;

  border: none;

  box-shadow: 0 8px 20px rgba(15, 23, 42, 0.08);

  transition: 0.35s ease;
}

.dashboard-box:hover {
  transform: translateY(-6px);

  box-shadow: 0 18px 35px rgba(15, 23, 42, 0.12);
}

.box-header {
  display: flex;

  justify-content: space-between;

  align-items: center;

  margin-bottom: 20px;
}

.box-header h5 {
  font-weight: 700;

  color: #111827;
}

.box-header p {
  margin: 5px 0 0;

  color: #64748b;

  font-size: 14px;
}

/* =========================
 CHART
========================= */

.chart-area {
  height: 320px;
}

/* =========================
 QUICK OVERVIEW
========================= */

.quick-box h5 {
  font-weight: 700;
}

.quick-item {
  display: flex;

  align-items: center;

  gap: 18px;

  padding: 15px;

  background: #f8fafc;

  border-radius: 16px;

  margin-bottom: 15px;

  transition: 0.3s;
}

.quick-item:hover {
  background: #eff6ff;

  transform: translateX(5px);
}

.quick-item i {
  font-size: 32px;
}

.quick-item h4 {
  margin: 0;

  font-weight: 700;
}

.quick-item small {
  color: #64748b;
}

/* =========================
 SMALL STAT
========================= */

.small-stat {
  text-align: center;
}

.small-stat i {
  font-size: 45px;
}

.small-stat h3 {
  margin-top: 15px;

  font-weight: 700;
}

.small-stat p {
  color: #64748b;

  margin: 0;
}

/* =========================
 TABLE
========================= */

.payment-box {
  margin-bottom: 30px;
}

.payment-table {
  margin: 0;
}

.payment-table thead th {
  background: #f8fafc;

  color: #64748b;

  font-size: 13px;

  border: none;

  padding: 15px;
}

.payment-table tbody td {
  padding: 16px;

  vertical-align: middle;

  border-bottom: 1px solid #f1f5f9;
}

.payment-table tbody tr {
  transition: 0.25s;
}

.payment-table tbody tr:hover {
  background: #f8fafc;

  transform: scale(1.01);
}

.badge {
  padding: 7px 14px;

  border-radius: 20px;

  font-size: 12px;
}

/* =========================
 BUTTON
========================= */

.btn {
  border-radius: 12px;
}

/* =========================
 RESPONSIVE
========================= */

@media (max-width: 991px) {
  .dashboard-content {
    margin-left: 0;

    width: 100%;

    padding: 20px;
  }

  .dashboard-header {
    flex-direction: column;

    align-items: flex-start;

    gap: 20px;
  }
}

@media (max-width: 576px) {
  .dashboard-header h2 {
    font-size: 24px;
  }

  .dashboard-card {
    padding: 20px;
  }

  .stat-icon {
    width: 55px;

    height: 55px;
  }
}
</style>
