<template>
  <div class="container mt-4" v-if="payment">
    <div class="receipt-box p-4 border rounded bg-white">
      <!-- HEADER -->
      <div class="d-flex justify-content-between mb-4">
        <div>
          <h4>MONEY RECEIPT</h4>
          <h5>B@tchPoint</h5>
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

      <!-- PRINT -->
      <div class="text-center mt-4 no-print">
        <button class="btn btn-primary" @click="printPage">Print / Save PDF</button> -

        <button class="btn btn-success" @click="sendWhatsApp">Send WhatsApp</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const payment = ref(null)

/* LOAD SINGLE PAYMENT */
const getPayment = async () => {
  try {
    const id = route.params.id

    const res = await axios.get(`http://127.0.0.1:8000/api/payments/${id}`)

    payment.value = res.data.payment
  } catch (err) {
    console.log('API ERROR:', err)
  }
}

const printPage = () => {
  window.print()
}

const sendWhatsApp = async () => {
  try {
    if (!payment.value) return

    const id = payment.value.id

    const res = await axios.get(`http://127.0.0.1:8000/api/payments/${id}/receipt`)

    const pdfUrl = res.data.url

    const p = payment.value

    const phone = p.student?.phone?.replace(/^0/, '88')

    if (!phone) {
      alert('Phone missing')
      return
    }

    const message = `Your payment receipt is ready:
Receipt ID: ${p.id}
Name: ${p.student.full_name}
Month: ${p.month}
Paid: ৳${p.paid_amount}
Status: ${p.status}

Download Receipt:
${pdfUrl}`

    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank')
  } catch (err) {
    console.log('WHATSAPP ERROR:', err.response || err)
    alert('WhatsApp send failed')
  }
}

onMounted(() => {
  getPayment()
})
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
