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
            <tr v-for="(p, index) in filteredPayments" :key="p.id">
              <td>{{ index + 1 }}</td>
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
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import AccountMenuView from './AccountMenuView.vue'
const payments = ref([])
const search = ref('')

/* ---------------- FETCH DATA ---------------- */
const getPayments = async () => {
  try {
    const res = await axios.get('http://127.0.0.1:8000/api/payments')
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
</script>

<style>
.content {
  padding: 20px;
  margin-left: 0px !important;
}

.card-box {
  background: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.08);
}
</style>
