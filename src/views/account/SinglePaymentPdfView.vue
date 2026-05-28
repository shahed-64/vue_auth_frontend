<template>
  <div class="container mt-4" v-if="payment">
    <div class="receipt-box p-4 border rounded bg-white">
      <!-- HEADER -->
      <div class="d-flex justify-content-between mb-4">
        <div>
          <h4>B@tchPoint</h4>
          <h5>MONEY RECEIPT</h5>
        </div>

        <div class="text-end">
          <p class="mb-0"><b>Receipt ID:</b> #{{ payment.id }}</p>
          <p class="mb-0"><b>Date:</b> {{ payment.payment_date }}</p>
        </div>
      </div>

      <hr />

      <!-- STUDENT INFO -->
      <div class="row mb-3">
        <div class="col-md-6">
          <h6>Student Info</h6>
          <p>Name: {{ payment.student?.full_name }}</p>
          <p>Class: {{ payment.student?.batch_name }}</p>
          <p>ID: {{ payment.student?.student_id }}</p>
        </div>

        <div class="col-md-6">
          <h6>Payment Info</h6>
          <p>Month: {{ payment.month }}</p>
          <p>Method: {{ payment.payment_method }}</p>
          <p>
            Status:
            <span class="badge bg-success">{{ payment.status }}</span>
          </p>
        </div>
      </div>

      <!-- TABLE -->
      <table class="table table-bordered">
        <thead>
          <tr>
            <th>Description</th>
            <th>Amount</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>Monthly Fee</td>
            <td>৳ {{ payment.amount }}</td>
          </tr>

          <tr>
            <td>Paid Amount</td>
            <td>৳ {{ payment.paid_amount }}</td>
          </tr>
        </tbody>
      </table>

      <!-- TOTAL -->
      <div class="d-flex justify-content-between mt-3">
        <h5>Total Paid</h5>
        <h4 class="text-primary">৳ {{ payment.paid_amount }}</h4>
      </div>

      <!-- ACTION -->
      <div class="text-center mt-4 no-print">
        <button class="btn btn-primary" @click="printPage">Print / Save PDF</button>

        <button class="btn btn-success ms-2" @click="sendWhatsApp">Send WhatsApp</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const payment = ref(null)

import api from '@/services/api'
/* LOAD PAYMENT */
const getPayment = async (id) => {
  console.log('REQUEST ID:', id)

  const res = await api.get(`/payments/${id}`)

  console.log('API RESPONSE:', res.data)

  payment.value = res.data.payment
}

/* PRINT */
const printPage = () => {
  window.print()
}

/* WHATSAPP */
const sendWhatsApp = async () => {
  try {
    const id = payment.value.id

    const res = await api.get(`/payments/${id}/whatsapp`)

    let phone = res.data.phone
    const message = res.data.message

    phone = phone.replace(/^0/, '')

    phone = '880' + phone

    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`

    window.open(url, '_blank')
  } catch (err) {
    console.log(err)
    alert('WhatsApp failed')
  }
}

/* INITIAL LOAD */
onMounted(() => {
  getPayment(route.params.id)
})

/* 🔥 IMPORTANT FIX: route change detect */
watch(
  () => route.params.id,
  (newId) => {
    if (newId) {
      payment.value = null
      getPayment(newId)
    }
  },
)
</script>

<style>
.receipt-box {
  max-width: 800px;
  margin: auto;
}

@media print {
  .no-print {
    display: none;
  }
}
</style>
