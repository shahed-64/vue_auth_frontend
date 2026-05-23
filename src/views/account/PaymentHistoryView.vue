<template>
  <div class="d-flex bgc">
    <!-- Sidebar -->
    <AccountMenuView />

    <!-- Content -->
    <div class="content flex-grow-1">
      <div class="card-box">
        <!-- Header -->
        <div class="d-flex justify-content-between align-items-center">
          <h3>Payment History</h3>

          <input
            v-model="search"
            type="text"
            class="form-control w-25"
            placeholder="Search name, ID, month..."
          />
        </div>

        <hr />

        <!-- Table -->
        <table class="table table-striped table-bordered align-middle">
          <thead class="table-primary">
            <tr>
              <th>#</th>
              <th>Student ID</th>
              <th>Name</th>
              <th>Month</th>
              <th>Amount</th>
              <th>Method</th>
              <th>Date</th>
              <th>Receipt</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="(p, index) in paginatedPayments" :key="p.id">
              <td>
                {{ (currentPage - 1) * perPage + index + 1 }}
              </td>

              <td>{{ p.student?.student_id }}</td>
              <td>{{ p.student?.full_name }}</td>
              <td>{{ p.month }}</td>
              <td>৳ {{ p.paid_amount }}</td>
              <td>{{ p.payment_method }}</td>
              <td>{{ p.payment_date }}</td>

              <td>
                <router-link :to="`/singlePayment/${p.id}`" class="btn btn-primary btn-sm">
                  PDF
                </router-link>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Empty state -->
        <div v-if="filteredPayments.length === 0" class="text-center mt-3">No payment found 😢</div>

        <!-- Pagination -->
        <!-- Pagination -->
        <div v-if="filteredPayments.length > 0" class="pagination-wrapper mt-4">
          <div class="pagination-info">
            Showing
            <strong>
              {{ (currentPage - 1) * perPage + 1 }}
            </strong>
            -
            <strong>
              {{ Math.min(currentPage * perPage, filteredPayments.length) }}
            </strong>
            of
            <strong>{{ filteredPayments.length }}</strong>
            payments
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
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import AccountMenuView from './AccountMenuView.vue'
import api from '@/services/api'

const payments = ref([])
const search = ref('')

/* ---------------- PAGINATION ---------------- */
const currentPage = ref(1)
const perPage = 10

/* ---------------- FETCH DATA ---------------- */
const getPayments = async () => {
  try {
    const res = await api.get('/payments')
    payments.value = res.data.payments || []
  } catch (err) {
    console.log(err)
  }
}

/* ---------------- LIFECYCLE ---------------- */
onMounted(() => {
  getPayments()
})

/* ---------------- SEARCH FILTER ---------------- */
const filteredPayments = computed(() => {
  return payments.value.filter((p) => {
    const keyword = search.value.toLowerCase()

    return (
      p.student?.full_name?.toLowerCase().includes(keyword) ||
      p.student?.student_id?.toLowerCase().includes(keyword) ||
      p.month?.toLowerCase().includes(keyword)
    )
  })
})

/* ---------------- TOTAL PAGE ---------------- */
const totalPages = computed(() => {
  return Math.ceil(filteredPayments.value.length / perPage)
})

/* ---------------- PAGINATED DATA ---------------- */
const paginatedPayments = computed(() => {
  const start = (currentPage.value - 1) * perPage
  const end = start + perPage

  return filteredPayments.value.slice(start, end)
})

/* ---------------- PAGE CONTROL ---------------- */
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

/* ---------------- RESET PAGE ON SEARCH ---------------- */
watch(search, () => {
  currentPage.value = 1
})
</script>
<style>
.bgc {
  background: #f4f6f9;
  min-height: 100vh;
}

.content {
  padding: 24px;
  margin-left: 240 !important;
}

.card-box {
  background: #fff;
  padding: 24px;
  border-radius: 18px;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.06);
  border: 1px solid #eef1f5;
}

/* Header */
h3 {
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0;
}

/* Search */
.search-box {
  width: 280px !important;
  border-radius: 12px;
  border: 1px solid #dbe1ea;
  padding: 10px 14px;
  transition: 0.3s;
}

.search-box:focus {
  border-color: #0d6efd;
  box-shadow: 0 0 0 0.15rem rgba(13, 110, 253, 0.15);
}

/* Table */
.table {
  border-radius: 12px;
  overflow: hidden;
}

.table thead th {
  background: #0d6efd !important;
  color: white;
  font-weight: 600;
  border: none;
  padding: 14px;
}

.table tbody td {
  padding: 14px;
  vertical-align: middle;
}

.table tbody tr {
  transition: 0.2s ease;
}

.table tbody tr:hover {
  background: #f8fbff;
}

/* PDF Button */
.btn-sm {
  border-radius: 10px;
  padding: 6px 14px;
  font-weight: 500;
}

/* Pagination */
.pagination-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f8fafc;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  padding: 14px 18px;
}

.pagination-info {
  color: #475569;
  font-size: 14px;
}

.pagination-btn {
  border-radius: 12px;
  border: 1px solid #dbe1ea;
  background: white;
  padding: 8px 18px;
  font-weight: 600;
  transition: 0.3s;
}

.pagination-btn:hover:not(:disabled) {
  background: #eef4ff;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.active-btn {
  background: #0d6efd;
  color: white;
  border: none;
}

.active-btn:hover:not(:disabled) {
  background: #0b5ed7;
  color: white;
}

.page-badge {
  background: white;
  border: 1px solid #dbe1ea;
  border-radius: 10px;
  padding: 8px 16px;
  font-weight: 700;
  color: #334155;
}
</style>
