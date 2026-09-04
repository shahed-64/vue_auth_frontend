<template>
  <LoadingSpinner v-if="isLoading" />

  <div v-else-if="payment" class="receipt-page">
    <div class="receipt-container">
      <!-- Receipt -->
      <div class="receipt-box">
        <!-- Institute Header -->
        <div class="receipt-header">
          <div class="institute-logo-wrapper" v-if="getLogoUrl(institute?.logo)">
            <img :src="getLogoUrl(institute?.logo)" alt="Institute Logo" class="institute-logo" />
          </div>

          <div class="institute-info">
            <h1>
              {{ institute?.institute_name || 'Coaching MS' }}
            </h1>

            <p v-if="institute?.established_year">Estd. {{ institute.established_year }}</p>

            <p v-if="institute?.location">
              {{ institute.location }}
            </p>

            <p v-if="institute?.contact">Contact: {{ institute.contact }}</p>
          </div>
        </div>

        <div class="receipt-title">
          <h2>MONEY RECEIPT</h2>
        </div>

        <!-- Receipt Information -->
        <div class="receipt-meta">
          <div>
            <strong>Receipt ID:</strong>
            {{ payment.id }}
          </div>

          <div>
            <strong>Date:</strong>
            {{ formatDate(payment.payment_date) }}
          </div>
        </div>

        <hr />

        <!-- Student Information -->
        <div class="section-title">Student Information</div>

        <div class="student-info-grid">
          <div>
            <strong>Name:</strong>
            {{ payment.student?.full_name || 'N/A' }}
          </div>

          <div>
            <strong>Student ID:</strong>
            {{ payment.student?.student_id || 'N/A' }}
          </div>

          <div>
            <strong>Class:</strong>
            {{ payment.student?.class_info?.class_name || 'N/A' }}
          </div>

          <div>
            <strong>Section:</strong>
            {{ payment.student?.section?.section_name || 'N/A' }}
          </div>

          <div>
            <strong>Phone:</strong>
            {{ payment.student?.phone || 'N/A' }}
          </div>

          <div>
            <strong>Month:</strong>
            {{ payment.month || 'N/A' }}
          </div>
        </div>

        <hr />

        <!-- Payment Information -->
        <div class="section-title">Payment Information</div>

        <table class="payment-table">
          <thead>
            <tr>
              <th>Description</th>
              <th class="amount-column">Amount</th>
            </tr>
          </thead>

          <tbody>
            <!-- Monthly Fee -->
            <tr>
              <td>
                Monthly Fee
                <span v-if="payment.month"> ({{ payment.month }}) </span>
              </td>

              <td class="amount-column">৳{{ formatAmount(payment.paid_amount) }}</td>
            </tr>

            <!-- Admission Fee -->
            <tr v-if="Number(payment.admission_fee) > 0">
              <td>Admission Fee</td>

              <td class="amount-column">৳{{ formatAmount(payment.admission_fee) }}</td>
            </tr>

            <!-- Exam Fee -->
            <tr v-if="Number(payment.exam_fee) > 0">
              <td>Exam Fee</td>

              <td class="amount-column">৳{{ formatAmount(payment.exam_fee) }}</td>
            </tr>

            <!-- Total -->
            <tr class="total-row">
              <td>
                <strong>Total Paid</strong>
              </td>

              <td class="amount-column">
                <strong> ৳{{ formatAmount(totalPaid) }} </strong>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Payment Details -->
        <div class="payment-details">
          <div>
            <strong>Payment Method:</strong>
            {{ payment.payment_method || 'N/A' }}
          </div>

          <div>
            <strong>Status:</strong>

            <span
              class="status-badge"
              :class="payment.status === 'paid' ? 'status-paid' : 'status-due'"
            >
              {{ payment.status || 'N/A' }}
            </span>
          </div>
        </div>

        <!-- Footer -->
        <div class="receipt-footer">
          <p>Thank you for your payment.</p>

          <p>This is a computer-generated receipt.</p>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="receipt-actions no-print">
        <button type="button" class="btn btn-primary" @click="printReceipt">
          <i class="bi bi-printer"></i>
          Print / Save PDF
        </button>

        <button type="button" class="btn btn-success" @click="sendWhatsApp">
          <i class="bi bi-whatsapp"></i>
          Send WhatsApp
        </button>

        <RouterLink to="/payment/history" class="btn btn-secondary">
          <i class="bi bi-arrow-left"></i>
          Back
        </RouterLink>
      </div>
    </div>
  </div>

  <!-- Loading / Not Found -->
  <div v-else class="empty-state">
    <h4>Payment not found</h4>

    <RouterLink to="/payment/history" class="btn btn-primary mt-3">
      Back to Payment History
    </RouterLink>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import api from '@/services/api'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import { isLoading } from '@/utils/loading'

const route = useRoute()

const payment = ref(null)
const institute = ref(null)

/*
|--------------------------------------------------------------------------
| Format Amount
|--------------------------------------------------------------------------
*/
const formatAmount = (amount) => {
  return Number(amount || 0).toFixed(2)
}

/*
|--------------------------------------------------------------------------
| Format Date
|--------------------------------------------------------------------------
*/
const formatDate = (date) => {
  if (!date) {
    return 'N/A'
  }

  const parsedDate = new Date(date)

  if (Number.isNaN(parsedDate.getTime())) {
    return date
  }

  return parsedDate.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

/*
|--------------------------------------------------------------------------
| Total Paid
|--------------------------------------------------------------------------
*/
const totalPaid = computed(() => {
  return (
    Number(payment.value?.paid_amount || 0) +
    Number(payment.value?.admission_fee || 0) +
    Number(payment.value?.exam_fee || 0)
  )
})

/*
|--------------------------------------------------------------------------
| Institute Logo URL
|--------------------------------------------------------------------------
*/
const getLogoUrl = (logo) => {
  if (!logo) {
    return ''
  }

  if (logo.startsWith('http://') || logo.startsWith('https://')) {
    return logo
  }

  if (logo.startsWith('/storage/')) {
    return logo
  }

  return `/storage/${logo}`
}

/*
|--------------------------------------------------------------------------
| Fetch Institute Information
|--------------------------------------------------------------------------
*/
const fetchInstitute = async () => {
  try {
    const response = await api.get('/institute-info')

    institute.value = response.data.data
  } catch (error) {
    console.error('Failed to fetch institute information:', error)
  }
}

/*
|--------------------------------------------------------------------------
| Fetch Payment
|--------------------------------------------------------------------------
*/
const getPayment = async (id) => {
  try {
    const response = await api.get(`/payments/${id}`)

    payment.value = response.data.payment
  } catch (error) {
    console.error('Failed to fetch payment:', error)

    payment.value = null
  }
}

/*
|--------------------------------------------------------------------------
| Print Receipt
|--------------------------------------------------------------------------
*/
const printReceipt = () => {
  window.print()
}

/*
|--------------------------------------------------------------------------
| Send Receipt via WhatsApp
|--------------------------------------------------------------------------
*/
const sendWhatsApp = async () => {
  try {
    if (!payment.value) {
      return
    }

    const phoneNumber = payment.value.student?.phone

    if (!phoneNumber) {
      alert('Student phone number is not available.')
      return
    }

    /*
     * Get receipt PDF URL from backend
     */
    const response = await api.get(`/payments/${payment.value.id}/receipt`)

    const pdfUrl = response.data?.url || response.data?.pdf_url || response.data?.receipt_url

    /*
     * Normalize Bangladesh phone number
     */
    let phone = String(phoneNumber).replace(/\D/g, '')

    if (phone.startsWith('0')) {
      phone = phone.replace(/^0+/, '')
    }

    if (!phone.startsWith('880')) {
      phone = `880${phone}`
    }

    const instituteName = institute.value?.institute_name || 'Coaching MS'

    const message = `
Assalamu Alaikum,

${instituteName}

Payment Receipt

Receipt ID: ${payment.value.id}
Student: ${payment.value.student?.full_name || 'N/A'}
Student ID: ${payment.value.student?.student_id || 'N/A'}
Month: ${payment.value.month || 'N/A'}

Total Paid: ৳${formatAmount(totalPaid.value)}
Payment Status: ${payment.value.status || 'N/A'}

${pdfUrl ? `Receipt PDF: ${pdfUrl}` : ''}

Thank you.
`.trim()

    const waLink = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`

    window.open(waLink, '_blank')
  } catch (error) {
    console.error('Failed to send WhatsApp receipt:', error)

    alert('Unable to prepare WhatsApp receipt.')
  }
}

/*
|--------------------------------------------------------------------------
| Mounted
|--------------------------------------------------------------------------
*/
onMounted(async () => {
  await fetchInstitute()
  await getPayment(route.params.id)
})

/*
|--------------------------------------------------------------------------
| Watch Route ID
|--------------------------------------------------------------------------
*/
watch(
  () => route.params.id,
  async (newId) => {
    if (!newId) {
      return
    }

    payment.value = null

    await getPayment(newId)
  },
)
</script>

<style scoped>
.receipt-page {
  min-height: 100vh;
  background: #f5f6f8;
  padding: 30px 15px;
}

.receipt-container {
  max-width: 850px;
  margin: 0 auto;
}

.receipt-box {
  background: #ffffff;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 35px;
  box-shadow: 0 3px 15px rgba(0, 0, 0, 0.08);
}

/* Institute Header */

.receipt-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  text-align: center;
}

.institute-logo-wrapper {
  flex-shrink: 0;
}

.institute-logo {
  width: 90px;
  height: 90px;
  object-fit: contain;
  border-radius: 8px;
}

.institute-info h1 {
  margin: 0;
  font-size: 28px;
  font-weight: 700;
}

.institute-info p {
  margin: 3px 0;
  color: #555;
  font-size: 14px;
}

/* Receipt Title */

.receipt-title {
  text-align: center;
  margin-top: 25px;
}

.receipt-title h2 {
  display: inline-block;
  margin: 0;
  padding: 8px 25px;
  border: 2px solid #222;
  border-radius: 5px;
  font-size: 20px;
  font-weight: 700;
}

/* Receipt Meta */

.receipt-meta {
  display: flex;
  justify-content: space-between;
  margin-top: 25px;
  font-size: 14px;
}

/* Section */

.section-title {
  font-size: 17px;
  font-weight: 700;
  margin-bottom: 15px;
}

/* Student Info */

.student-info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px 30px;
  font-size: 14px;
}

.student-info-grid strong {
  margin-right: 5px;
}

/* Payment Table */

.payment-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

.payment-table th,
.payment-table td {
  border: 1px solid #ddd;
  padding: 12px;
  font-size: 14px;
}

.payment-table th {
  background: #f5f5f5;
  font-weight: 700;
}

.amount-column {
  text-align: right;
}

.total-row td {
  background: #f8f8f8;
  font-size: 15px;
}

/* Payment Details */

.payment-details {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  font-size: 14px;
}

.status-badge {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: capitalize;
}

.status-paid {
  background: #d1e7dd;
  color: #0f5132;
}

.status-due {
  background: #f8d7da;
  color: #842029;
}

/* Footer */

.receipt-footer {
  text-align: center;
  margin-top: 35px;
  padding-top: 15px;
  border-top: 1px dashed #bbb;
  color: #777;
  font-size: 12px;
}

.receipt-footer p {
  margin: 3px 0;
}

/* Actions */

.receipt-actions {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 20px;
}

.receipt-actions .btn {
  min-width: 150px;
}

/* Empty */

.empty-state {
  min-height: 70vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

/* Print */

@media print {
  @page {
    size: A4;
    margin: 15mm;
  }

  body {
    background: #ffffff !important;
  }

  .receipt-page {
    background: #ffffff !important;
    padding: 0 !important;
  }

  .receipt-container {
    max-width: 100%;
  }

  .receipt-box {
    border: none;
    box-shadow: none;
    padding: 0;
  }

  .no-print {
    display: none !important;
  }
}

/* Mobile */

@media (max-width: 600px) {
  .receipt-page {
    padding: 15px 8px;
  }

  .receipt-box {
    padding: 20px 15px;
  }

  .receipt-header {
    flex-direction: column;
    gap: 10px;
  }

  .institute-logo {
    width: 75px;
    height: 75px;
  }

  .institute-info h1 {
    font-size: 22px;
  }

  .receipt-meta {
    flex-direction: column;
    gap: 5px;
  }

  .student-info-grid {
    grid-template-columns: 1fr;
    gap: 8px;
  }

  .payment-details {
    flex-direction: column;
    gap: 10px;
  }

  .receipt-actions {
    flex-direction: column;
  }

  .receipt-actions .btn {
    width: 100%;
  }
}
</style>
