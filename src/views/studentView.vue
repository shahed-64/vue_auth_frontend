<template>
  <dashPageView />

  <div class="content">
    <div class="topbar d-flex justify-content-between align-items-center">
      <h5 class="mb-0">Student Management</h5>

      <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addModal">
        Add Student
      </button>
    </div>

    <div class="card-box sps">
      <div class="d-flex justify-content-between mb-3">
        <input type="text" class="form-control w-25" placeholder="Search student..." />
      </div>

      <div class="table-responsive">
        <table class="table table-bordered align-middle">
          <thead class="table-dark">
            <tr>
              <th>#</th>
              <th>Photo</th>
              <th>Name</th>
              <th>Email</th>
              <th>Status</th>
              <th width="220">Action</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="(item, index) in students" :key="item.id">
              <td>{{ index + 1 }}</td>
              <td>
                <img src="https://i.pravatar.cc/100?img=1" />
              </td>
              <td>{{ item.full_name }}</td>
              <td>{{ item.email }}</td>
              <td>
                <span class="badge bg-success">Active</span>
              </td>
              <td>
                <button class="btn btn-sm btn-info">View</button>
                <button
                  class="btn btn-sm btn-warning"
                  data-bs-toggle="modal"
                  data-bs-target="#editModal"
                >
                  Edit
                </button>
                <button class="btn btn-sm btn-danger">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <!-- ADD MODAL -->
  <form @submit.prevent="student_create">
    <div class="modal fade" id="addModal">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5>Add Student</h5>
            <button class="btn-close" data-bs-dismiss="modal"></button>
          </div>

          <div class="modal-body">
            <div class="mb-3">
              <label>Full Name</label>
              <input v-model="form.full_name" class="form-control" />
            </div>

            <div class="mb-3">
              <label>Student Id</label>
              <input v-model="form.student_id" class="form-control" />
            </div>

            <div class="mb-3">
              <label>Phone</label>
              <input v-model="form.phone" class="form-control" />
            </div>

            <div class="mb-3">
              <label>Email</label>
              <input v-model="form.email" type="email" class="form-control" />
            </div>

            <div class="mb-3">
              <label>Course</label>
              <input v-model="form.course_name" class="form-control" />
            </div>

            <div class="mb-3">
              <label>Class</label>
              <select v-model="form.batch_name" class="form-control">
                <option value="">---Select---</option>
                <option v-for="n in 12" :key="n" :value="n">{{ n }}</option>
              </select>
            </div>

            <div class="mb-3">
              <label>Admission Date</label>
              <input v-model="form.admission_date" type="date" class="form-control" />
            </div>

            <div class="mb-3">
              <label>Status</label>
              <select v-model="form.status" class="form-select">
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>

            <button type="submit" class="btn btn-primary">Save</button>
          </div>
        </div>
      </div>
    </div>
  </form>

  <!-- EDIT MODAL -->
  <div class="modal fade" id="editModal">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5>Edit Student</h5>
          <button class="btn-close" data-bs-dismiss="modal"></button>
        </div>

        <div class="modal-body">
          <input class="form-control mb-2" value="John Doe" />
          <input class="form-control" value="john@example.com" />
        </div>

        <div class="modal-footer">
          <button class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          <button class="btn btn-warning">Update</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import dashPageView from './dashPageView.vue'
import { ref, reactive, onMounted } from 'vue'
import api from '@/services/api'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'

const students = ref([])

const form = reactive({
  full_name: '',
  student_id: '',
  phone: '',
  email: '',
  course_name: '',
  batch_name: '',
  admission_date: '',
  status: '',
})

const resetForm = () => {
  Object.keys(form).forEach((key) => (form[key] = ''))
}

const closeModal = () => {
  const modalEl = document.getElementById('addModal')
  const modal = bootstrap.Modal.getOrCreateInstance(modalEl)
  modal.hide()
}

const student_create = async () => {
  if (!form.full_name || !form.email) {
    alert('Field must not be empty')
    return
  }

  try {
    const res = await api.post('/student_create', form)

    alert('Created successfully')

    // ✅ এখানে modal close কোড দিবা
    const modalEl = document.getElementById('addModal')
    const modal = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl)

    modal.hide()

    resetForm()
    getstudent()
  } catch (error) {
    alert('Something went wrong')
  }
}

const getstudent = async () => {
  try {
    const res = await api.get('/students')
    students.value = res.data.students
  } catch (error) {
    console.log(error)
  }
}

onMounted(() => {
  getstudent()
})
</script>

<style>
.sps table tr {
  background-color: red !important;
}
</style>
