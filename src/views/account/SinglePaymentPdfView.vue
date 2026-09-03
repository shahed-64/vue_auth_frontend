<template>
  <div class="container mt-4" v-if="payment">
    <div class="receipt-box p-4 border rounded bg-white">
<<<<<<< HEAD
      <!-- =====================================================
           HEADER
      ====================================================== -->

      <div class="receipt-header d-flex justify-content-between align-items-center mb-4">
        <!-- Institute -->
        <div class="institute-info d-flex align-items-center gap-3">
          <!-- Institute Logo -->
          <div class="receipt-logo">
            <img
              v-if="institute?.logo"
              :src="getLogoUrl(institute.logo)"
              :alt="institute?.institute_name || 'Institute Logo'"
              class="institute-logo"
            />

            <!-- Default Icon -->
            <i v-else class="fa-solid fa-graduation-cap"></i>
          </div>

          <!-- Institute Name -->
          <div>
            <h4 class="institute-name mb-1">
              {{ institute?.institute_name || 'Coaching MS' }}
            </h4>

            <h5 class="receipt-title mb-0">MONEY RECEIPT</h5>
          </div>
        </div>

        <!-- Receipt Info -->
        <div class="text-end">
          <p class="mb-0">
            <b>Receipt ID:</b>
            #{{ payment.id }}
          </p>

          <p class="mb-0">
            <b>Date:</b>
            {{ payment.payment_date }}
          </p>
=======
      <!-- HEADER -->
      <div class="d-flex justify-content-between mb-4">
        <div>
          <h4>B@tchPoint</h4>
          <h5>MONEY RECEIPT</h5>
        </div>

        <div class="text-end">
          <p class="mb-0"><b>Receipt ID:</b> #{{ payment.id }}</p>
          <p class="mb-0"><b>Date:</b> {{ payment.payment_date }}</p>
>>>>>>> 64d30f5f98655572445e8294219453b5bbe1bc6b
        </div>
      </div>

      <hr />

<<<<<<< HEAD
      <!-- =====================================================
           STUDENT INFO
      ====================================================== -->

      <div class="row mb-3">
        <div class="col-md-6">
          <h6>Student Info</h6>

          <p>
            <b>Name:</b>
            {{ payment.student?.full_name }}
          </p>

          <p>
            <b>Class:</b>
            {{ payment.student?.class_info?.class_name || 'N/A' }}
          </p>
          <p>
            <b>Section:</b>
            {{ payment.student?.section?.section_name || 'N/A' }}
          </p>
          <p>
            <b>ID:</b>
            {{ payment.student?.student_id }}
          </p>
=======
      <!-- STUDENT INFO -->
      <div class="row mb-3">
        <div class="col-md-6">
          <h6>Student Info</h6>
          <p>Name: {{ payment.student?.full_name }}</p>
          <p>Class: {{ payment.student?.batch_name }}</p>
          <p>ID: {{ payment.student?.student_id }}</p>
>>>>>>> 64d30f5f98655572445e8294219453b5bbe1bc6b
        </div>

        <div class="col-md-6">
          <h6>Payment Info</h6>
<<<<<<< HEAD

          <p>
            <b>Month:</b>
            {{ payment.month }}
          </p>

          <p>
            <b>Method:</b>
            {{ payment.payment_method }}
          </p>

          <p>
            <b>Status:</b>

            <span class="badge bg-success">
              {{ payment.status }}
            </span>
=======
          <p>Month: {{ payment.month }}</p>
          <p>Method: {{ payment.payment_method }}</p>
          <p>
            Status:
            <span class="badge bg-success">{{ payment.status }}</span>
>>>>>>> 64d30f5f98655572445e8294219453b5bbe1bc6b
          </p>
        </div>
      </div>

<<<<<<< HEAD
      <!-- =====================================================
           PAYMENT TABLE
      ====================================================== -->

      <table class="table table-bordered payment-table">
        <thead>
          <tr>
            <th>Description</th>

            <th width="35%">Amount</th>
=======
      <!-- TABLE -->
      <table class="table table-bordered">
        <thead>
          <tr>
            <th>Description</th>
            <th>Amount</th>
>>>>>>> 64d30f5f98655572445e8294219453b5bbe1bc6b
          </tr>
        </thead>

        <tbody>
<<<<<<< HEAD
          <!-- Monthly Fee -->
          <tr>
            <td>Monthly Fee</td>

            <td>৳ {{ payment.amount }}</td>
          </tr>

          <!-- Paid Amount -->
          <tr>
            <td>
              <strong> Paid Amount </strong>
            </td>

            <td>
              <strong> ৳ {{ payment.paid_amount }} </strong>
            </td>
          </tr>

          <!-- Admission Fee -->
          <tr v-if="payment.admission_fee">
            <td>Admission Fee</td>

            <td>৳ {{ payment.admission_fee }}</td>
          </tr>

          <!-- Exam Fee -->
          <tr v-if="payment.exam_fee">
            <td>Exam Fee</td>

            <td>৳ {{ payment.exam_fee }}</td>
=======
          <tr>
            <td>Monthly Fee</td>
            <td>৳ {{ payment.amount }}</td>
          </tr>

          <tr>
            <td>Paid Amount</td>
            <td>৳ {{ payment.paid_amount }}</td>
>>>>>>> 64d30f5f98655572445e8294219453b5bbe1bc6b
          </tr>
        </tbody>
      </table>

<<<<<<< HEAD
      <!-- =====================================================
           TOTAL
      ====================================================== -->

      <div class="d-flex justify-content-between mt-3">
        <h5>Total Paid</h5>

        <h4 class="text-primary">
          ৳

          {{
            Number(payment.paid_amount || 0) +
            Number(payment.admission_fee || 0) +
            Number(payment.exam_fee || 0)
          }}
        </h4>
      </div>

      <!-- =====================================================
           ACTION BUTTONS
      ====================================================== -->

      <div class="text-center mt-4 no-print">
        <button class="btn btn-primary" @click="printPage">
          <i class="fa-solid fa-print me-1"></i>
          Print / Save PDF
        </button>

        <button class="btn btn-success ms-2" @click="sendWhatsApp">
          <i class="fa-brands fa-whatsapp me-1"></i>
          Send WhatsApp
        </button>

        <router-link to="/payment/history" class="btn btn-info ms-2">
          <span> Back </span>
        </router-link>
      </div>
    </div>
  </div>

  <!-- =====================================================
       LOADING
  ====================================================== -->

  <div v-else class="text-center py-5">
    <div class="spinner-border text-primary mb-3" role="status"></div>

    <p class="text-muted">Loading Payment Receipt...</p>
  </div>
=======
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
>>>>>>> 64d30f5f98655572445e8294219453b5bbe1bc6b
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
<<<<<<< HEAD
import api from '@/services/api'

// ============================================================
// ROUTE
// ============================================================

const route = useRoute()

// ============================================================
// PAYMENT
// ============================================================

const payment = ref(null)

// ============================================================
// INSTITUTE
// ============================================================

const institute = ref(null)

// ============================================================
// FETCH INSTITUTE INFORMATION
// ============================================================

const fetchInstitute = async () => {
  try {
    const response = await api.get('/institute-info')

    institute.value = response.data.data
  } catch (error) {
    console.error('Failed to fetch institute information:', error)
  }
}

// ============================================================
// LOGO URL
// ============================================================

const getLogoUrl = (logo) => {
  if (!logo) {
    return ''
  }

  // Full URL
  if (logo.startsWith('http://') || logo.startsWith('https://')) {
    return logo
  }

  // Already storage path
  if (logo.startsWith('/storage/')) {
    return logo
  }

  // Laravel storage
  return `/storage/${logo}`
}

// ============================================================
// LOAD PAYMENT
// ============================================================

const getPayment = async (id) => {
  console.log('REQUEST ID:', id)

  try {
    const res = await api.get(`/payments/${id}`)

    console.log('API RESPONSE:', res.data)

    payment.value = res.data.payment
  } catch (error) {
    console.error('Failed to load payment:', error)
  }
}

// ============================================================
// PRINT
// ============================================================

=======

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
>>>>>>> 64d30f5f98655572445e8294219453b5bbe1bc6b
const printPage = () => {
  window.print()
}

<<<<<<< HEAD
// ============================================================
// WHATSAPP
// ============================================================

const sendWhatsApp = async () => {
  try {
    if (!payment.value) {
      return
    }

    const id = payment.value.id

    // Get receipt PDF URL
    const res = await api.get(`/payments/${id}/receipt`)

    const pdfUrl = res.data.url

    const p = payment.value

    // ========================================================
    // PHONE
    // ========================================================

    let phone = p.student?.phone

    if (!phone) {
      alert('Phone missing')

      return
    }

    // Bangladesh phone format
    phone = '880' + phone.replace(/^0+/, '')

    // ========================================================
    // INSTITUTE NAME
    // ========================================================

    const instituteName = institute.value?.institute_name || 'Coaching MS'

    // ========================================================
    // TOTAL
    // ========================================================

    const totalPaid =
      Number(p.paid_amount || 0) + Number(p.admission_fee || 0) + Number(p.exam_fee || 0)

    // ========================================================
    // WHATSAPP MESSAGE
    // ========================================================

    const message = `Hello ${p.student?.full_name || ''},

Your payment receipt from ${instituteName} is ready.

📌 Receipt ID: ${p.id}

📅 Month: ${p.month}

💰 Total Paid: ৳${totalPaid}

📊 Status: ${p.status}

👉 Download Receipt:

${pdfUrl}`

    // ========================================================
    // WHATSAPP LINK
    // ========================================================

    const waLink = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`

    window.open(waLink, '_blank')
  } catch (err) {
    console.error('WHATSAPP ERROR:', err)

    alert('WhatsApp send failed')
  }
}

// ============================================================
// INITIAL LOAD
// ============================================================

onMounted(() => {
  fetchInstitute()

  getPayment(route.params.id)
})

// ============================================================
// ROUTE CHANGE DETECT
// ============================================================

watch(
  () => route.params.id,

  (newId) => {
    if (newId) {
      payment.value = null

=======
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
>>>>>>> 64d30f5f98655572445e8294219453b5bbe1bc6b
      getPayment(newId)
    }
  },
)
</script>

<<<<<<< HEAD
<style scoped>
/* =========================================================
   RECEIPT BOX
========================================================= */

.receipt-box {
  max-width: 800px;

  margin: auto;

  background: #fff;
}

/* =========================================================
   HEADER
========================================================= */

.receipt-header {
  min-height: 75px;
}

/* =========================================================
   INSTITUTE INFO
========================================================= */

.institute-info {
  min-width: 0;
}

/* =========================================================
   RECEIPT LOGO
========================================================= */

.receipt-logo {
  width: 62px;

  height: 62px;

  border-radius: 12px;

  background: #f1f5f9;

  display: flex;

  align-items: center;

  justify-content: center;

  overflow: hidden;

  flex-shrink: 0;

  border: 1px solid #e2e8f0;
}

.institute-logo {
  width: 100%;

  height: 100%;

  object-fit: contain;

  padding: 5px;
}

.receipt-logo i {
  font-size: 28px;

  color: #2563eb;
}

/* =========================================================
   INSTITUTE NAME
========================================================= */

.institute-name {
  color: #198754;

  font-weight: 700;

  font-size: 22px;

  line-height: 1.2;

  word-break: break-word;
}

/* =========================================================
   RECEIPT TITLE
========================================================= */

.receipt-title {
  color: #495057;

  font-size: 17px;

  font-weight: 600;

  letter-spacing: 0.5px;
}

/* =========================================================
   PAYMENT TABLE
========================================================= */

.payment-table th {
  background: #f8f9fa;

  font-weight: 600;
}

.payment-table td,
.payment-table th {
  vertical-align: middle;
}

/* =========================================================
   PRINT
========================================================= */

@media print {
  @page {
    size: A4 portrait;

    margin: 10mm;
  }

  body {
    background: #fff !important;
  }

  .container {
    width: 100% !important;

    max-width: 100% !important;

    margin: 0 !important;

    padding: 0 !important;
  }

  .receipt-box {
    max-width: 100% !important;

    width: 100% !important;

    border: 1px solid #000 !important;

    box-shadow: none !important;

    margin: 0 !important;

    padding: 20px !important;
  }

  .no-print {
    display: none !important;
  }

  .receipt-logo {
    border: 1px solid #ddd;
  }

  .institute-name {
    color: #000 !important;
  }
}

/* =========================================================
   MOBILE
========================================================= */

@media (max-width: 576px) {
  .receipt-box {
    padding: 18px !important;
  }

  .receipt-header {
    align-items: flex-start !important;
  }

  .receipt-logo {
    width: 50px;

    height: 50px;
  }

  .receipt-logo i {
    font-size: 22px;
  }

  .institute-name {
    font-size: 17px;
  }

  .receipt-title {
    font-size: 14px;
  }

  .receipt-header > .text-end {
    font-size: 12px;
=======
<style>
.receipt-box {
  max-width: 800px;
  margin: auto;
}

@media print {
  .no-print {
    display: none;
>>>>>>> 64d30f5f98655572445e8294219453b5bbe1bc6b
  }
}
</style>
