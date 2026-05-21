<template>
  <div class="d-flex bgc">
    <AccountMenuView />

    <div class="flex-grow-1 p-4">
      <!-- Topbar -->
      <div class="topbar d-flex justify-content-between align-items-center mb-4">
        <h4 class="mb-0">Student Management</h4>
      </div>

      <!-- Search -->
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h5 class="mb-0">Students List</h5>
        <input class="form-control w-25" placeholder="Search student..." />
      </div>

      <!-- Table -->
      <div class="table-responsive">
        <table class="table table-bordered align-middle bg-white">
          <thead class="table-dark dard">
            <tr>
              <th>#</th>
              <th>Student Id</th>
              <th>Name</th>
              <th>Email</th>
              <th>Due Months</th>
              <th>Status</th>
              <th width="220">Action</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="(s, index) in students" :key="s.id">
              <td><td>{{ index + 1 }}</td></td>
              <td>{{ s.student_id }}</td>
              <td>{{ s.full_name }}</td>
              <td>{{ s.email }}</td>
              <td>
                <span v-if="s.due_months?.length">
                  {{ s.due_months.join(', ') }}
                </span>

                <span v-else class="badge bg-success"> Paid </span>
              </td>
              <td>
                <span class="badge bg-success">{{ s.status }}</span>
              </td>

              <td>
                <router-link
                  to="/paymentPDF"
                  class="btn btn-sm btn-info me-2"
                  active-class="active-menu"
                  >View</router-link
                >
                <button
                  class="btn btn-sm btn-warning me-2"
                  data-bs-toggle="modal"
                  data-bs-target="#editModal"
                  @click="openPaymentModal(s)"
                >
                  Payment
                </button>

                <button class="btn btn-sm btn-danger">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Modal -->
      <div class="modal fade" id="editModal" tabindex="-1">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Payment</h5>
              <button class="btn-close" data-bs-dismiss="modal"></button>
            </div>

            <div class="modal-body">
              <!-- Student Display -->
              <div class="mb-3">
                <label class="form-label">Student</label>
                <div class="form-control bg-light">
                  {{ selectedStudent.student_id }} - {{ selectedStudent.full_name }}
                </div>
              </div>

              <div class="mb-3">
                <label>Amount</label>
                <input v-model="form.amount" type="number" class="form-control" />
              </div>

              <div class="mb-3">
                <label>Paid Amount</label>
                <input v-model="form.paid_amount" type="number" class="form-control" />
              </div>
              <div>
                <select v-model="form.month" class="form-select">
                  <option value="January">January</option>
                  <option value="February">February</option>
                  <option value="March">March</option>
                  <option value="April">April</option>
                  <option value="May">May</option>
                  <option value="June">June</option>
                  <option value="July">July</option>
                  <option value="August">August</option>
                  <option value="September">September</option>
                  <option value="October">October</option>
                  <option value="November">November</option>
                  <option value="December">December</option>
                </select>
              </div>

              <div class="mb-3">
                <label>Payment Method</label>
                <input v-model="form.payment_method" class="form-control" />
              </div>

              <div class="mb-3">
                <label>Payment Date</label>
                <input v-model="form.payment_date" type="date" class="form-control" />
              </div>
            </div>

            <div class="modal-footer">
              <button class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button class="btn btn-warning" @click="savePayment">Save</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import axios from 'axios'
import AccountMenuView from './AccountMenuView.vue'

const students = ref([])

const selectedStudent = reactive({
  student_id: '',
  full_name: '',
})

const form = reactive({
  student_id: '',
  amount: '',
  paid_amount: '',
  payment_method: '',
  payment_date: '',
  month: '',
})

/* OPEN MODAL */
const openPaymentModal = (student) => {
  selectedStudent.student_id = student.student_id
  selectedStudent.full_name = student.full_name

  Object.assign(form, {
    student_id: student.id,
    amount: '',
    paid_amount: '',
    payment_method: '',
    payment_date: '',
    month: '',
  })
}

/* SAVE PAYMENT */
const savePayment = async () => {
  try {
    const res = await axios.post('http://127.0.0.1:8000/api/payments', form)

    alert('Payment Saved')

    getStudents()
  } catch (err) {
    console.log(err.response?.data)
    alert('Error')
  }
}

/* GET STUDENTS */
const getStudents = async () => {
  try {
    const res = await axios.get('http://127.0.0.1:8000/api/students')

    students.value = res.data.students || [] // 🔥 FIX
  } catch (err) {
    console.log(err)
  }
}

onMounted(() => {
  getStudents()
})
</script>
<style>
.bgc {
  background-color: #e9e9e9;
  min-height: 100vh;
}
.dard th {
  background-color: #212529 !important;
}
</style>
