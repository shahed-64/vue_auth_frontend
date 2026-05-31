<template>
  <div class="layout bgc">
    <!-- Sidebar -->
    <AccountMenuView />

    <!-- Content -->
    <div class="content">
      <div class="card-box">
        <!-- Header -->
        <div class="header">
          <h3>Payment History</h3>

          <input
            v-model="search"
            type="text"
            class="form-control search"
            placeholder="Search name, ID, month..."
          />
        </div>

        <hr />

        <!-- Table -->
        <div class="table-responsive">
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
                <td>{{ (currentPage - 1) * perPage + index + 1 }}</td>
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
        </div>

        <!-- Empty -->
        <div v-if="filteredPayments.length === 0" class="empty">No payment found 😢</div>

        <!-- Pagination -->
        <div v-if="filteredPayments.length > 0" class="pagination-wrapper">
          <div class="info">
            Showing <b>{{ (currentPage - 1) * perPage + 1 }}</b> -
            <b>{{ Math.min(currentPage * perPage, filteredPayments.length) }}</b>
            of <b>{{ filteredPayments.length }}</b>
          </div>

          <div class="controls">
            <button class="btn" @click="prevPage" :disabled="currentPage === 1">← Prev</button>

            <span class="badge">{{ currentPage }} / {{ totalPages }}</span>

            <button class="btn" @click="nextPage" :disabled="currentPage === totalPages">
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

const currentPage = ref(1)
const perPage = 10

onMounted(async () => {
  const res = await api.get('/payments')
  payments.value = res.data.payments || []
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

const totalPages = computed(() => Math.ceil(filteredPayments.value.length / perPage))

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

<style>
/* LAYOUT */
/* LAYOUT */
.layout {
  display: flex;
  min-height: 100vh;
  width: 100%;
  background: #f4f6f9;
}

/* CONTENT */
.content {
  margin-left: 250px;
  padding: 20px;
  width: calc(100% - 250px);
}

/* CARD */
.card-box {
  background: #fff;
  padding: 20px;
  border-radius: 16px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.06);
}

/* HEADER */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.search {
  width: 300px;
  border-radius: 10px;
}

/* TABLE */
.table-responsive {
  width: 100%;
  overflow-x: auto;
}

table {
  min-width: 900px;
}

/* EMPTY */
.empty {
  text-align: center;
  padding: 20px;
  color: gray;
}

/* =========================
   PAGINATION FIX
========================= */
.pagination-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  flex-wrap: wrap;
  gap: 12px;
}

.info {
  font-size: 15px;
  color: #000;
  font-weight: 500;
}

.controls {
  display: flex;
  align-items: center;
  gap: 10px;
}

.controls .btn {
  background: #0d6efd;
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 8px 16px;
  font-weight: 500;
}

.controls .btn:hover {
  opacity: 0.9;
}

.controls .btn:disabled {
  background: #cfcfcf;
  color: #666;
  cursor: not-allowed;
}

.badge {
  background: #0d6efd !important;
  color: #fff !important;
  padding: 8px 14px;
  border-radius: 10px;
  font-weight: 600;
}

/* MOBILE */
@media (max-width: 768px) {
  .content {
    margin-left: 0 !important;
    width: 100% !important;
    padding: 12px;
  }

  .header {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .search {
    width: 100%;
    max-width: 320px;
  }

  .pagination-wrapper {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  table {
    min-width: 800px;
  }
}
</style>
