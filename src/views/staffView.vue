<template>
  <dashPageView />

  <div class="content">
    <div class="card-box">
      <!-- SEARCH -->
      <div class="d-flex flex-column flex-md-row justify-content-between gap-2 mb-3">
        <input type="text" class="form-control staff-search" placeholder="Search staff..." />
      </div>

      <!-- TABLE -->
      <div class="table-responsive">
        <table class="table table-bordered align-middle">
          <thead class="table-dark">
            <tr>
              <th>#</th>
              <th>Photo</th>
              <th>Name</th>
              <th>User Name</th>
              <th>Skill</th>
              <th>Email</th>
              <th>Role</th>
              <th width="220">Action</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="(item, index) in staff" :key="item.id">
              <td>{{ index + 1 }}</td>

              <td>
                <img src="https://i.pravatar.cc/100?img=1" width="45" class="rounded-circle" />
              </td>

              <td>{{ item.name }}</td>
              <td>{{ item.user_name }}</td>
              <td>{{ item.skill }}</td>
              <td>{{ item.email }}</td>
              <td>{{ item.role }}</td>

              <td class="action-buttons">
                <!-- VIEW -->
                <button class="btn btn-sm btn-info" @click="openView(item)">View</button>

                <!-- EDIT -->
                <button
                  class="btn btn-sm btn-warning"
                  data-bs-toggle="modal"
                  data-bs-target="#editModal"
                  @click="openEdit(item)"
                  v-if="
                    currentRole === 'Manager' ||
                    currentRole === 'Accountant' ||
                    (currentRole === 'Admin' && item.role !== 'Manager')
                  "
                >
                  Edit
                </button>

                <!-- DELETE -->
                <button
                  class="btn btn-sm btn-danger"
                  @click="deleteStaff(item.id)"
                  v-if="
                    currentRole === 'Manager' ||
                    currentRole === 'Accountant' ||
                    (currentRole === 'Admin' && item.role !== 'Manager')
                  "
                >
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <div v-if="staff.length === 0" class="text-center py-3 text-muted">No staff found</div>
      </div>
    </div>
  </div>

  <!-- EDIT MODAL -->
  <div class="modal fade" id="editModal" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Edit Staff</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>

        <div class="modal-body">
          <input v-model="selectedStaff.name" class="form-control mb-2" placeholder="Name" />
          <input
            v-model="selectedStaff.user_name"
            class="form-control mb-2"
            placeholder="User Name"
          />
          <input v-model="selectedStaff.skill" class="form-control mb-2" placeholder="Skill" />
          <input v-model="selectedStaff.email" class="form-control mb-2" placeholder="Email" />

          <select v-model="selectedStaff.role" class="form-control mb-2">
            <option value="Admin">Admin</option>
            <option value="Manager">Manager</option>
            <option value="Accountant">Accountant</option>
            <option value="Staff">Staff</option>
          </select>

          <input
            v-model="selectedStaff.password"
            type="password"
            class="form-control mb-2"
            placeholder="New Password (Optional)"
          />
          <input
            v-model="selectedStaff.password_confirmation"
            type="password"
            class="form-control"
            placeholder="Confirm Password"
          />
        </div>

        <div class="modal-footer">
          <button class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          <button class="btn btn-primary" @click="updateStaff">Update</button>
        </div>
      </div>
    </div>
  </div>

  <!-- VIEW MODAL -->
  <div class="modal fade" id="viewModal" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header bg-primary text-white">
          <h5 class="modal-title">Staff Details</h5>
          <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
        </div>

        <div class="modal-body">
          <div class="text-center mb-3">
            <img src="https://i.pravatar.cc/120" class="rounded-circle border" width="90" />
          </div>

          <div class="list-group">
            <div class="list-group-item"><strong>Name:</strong> {{ viewData.name }}</div>
            <div class="list-group-item"><strong>User Name:</strong> {{ viewData.user_name }}</div>
            <div class="list-group-item"><strong>Email:</strong> {{ viewData.email }}</div>
            <div class="list-group-item"><strong>Skill:</strong> {{ viewData.skill }}</div>
            <div class="list-group-item"><strong>Role:</strong> {{ viewData.role }}</div>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import dashPageView from './dashPageView.vue'
import { ref, onMounted } from 'vue'
import api from '@/services/api'

const staff = ref([])
const currentRole = localStorage.getItem('role')
const token = localStorage.getItem('token')

/* VIEW */
const viewData = ref({
  name: '',
  user_name: '',
  email: '',
  skill: '',
  role: '',
})

const openView = (item) => {
  viewData.value = { ...item }

  // SAFE Bootstrap modal open
  const modalEl = document.getElementById('viewModal')
  if (modalEl) {
    const modal = bootstrap.Modal.getOrCreateInstance(modalEl)
    modal.show()
  }
}

/* EDIT */
const selectedStaff = ref({
  id: null,
  name: '',
  user_name: '',
  skill: '',
  email: '',
  role: '',
  password: '',
  password_confirmation: '',
})

const openEdit = (item) => {
  selectedStaff.value = { ...item, password: '', password_confirmation: '' }
}

/* GET */
const getStaff = async () => {
  try {
    const res = await api.get('/staff', {
      headers: { Authorization: `Bearer ${token}` },
    })

    staff.value = res.data.staff
  } catch (error) {
    console.log(error.response?.data)
  }
}

/* UPDATE */
const updateStaff = async () => {
  try {
    const payload = { ...selectedStaff.value }

    const res = await api.put(`/staff/${selectedStaff.value.id}`, payload, {
      headers: { Authorization: `Bearer ${token}` },
    })

    alert('Updated successfully')
    await getStaff()

    document.querySelector('#editModal .btn-close')?.click()
  } catch (error) {
    console.log(error.response?.data)
  }
}

/* DELETE */
const deleteStaff = async (id) => {
  if (!confirm('Are you sure?')) return

  await api.delete(`/staff/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  })

  staff.value = staff.value.filter((i) => i.id !== id)
}

/* INIT */
onMounted(() => {
  getStaff()
})
</script>
