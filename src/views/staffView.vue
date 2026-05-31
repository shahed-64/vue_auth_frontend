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
                <button class="btn btn-sm btn-info" @click="viewStaff(item)">View</button>

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
                  v-if="
                    currentRole === 'Manager' ||
                    currentRole === 'Accountant' ||
                    (currentRole === 'Admin' && item.role !== 'Manager')
                  "
                  @click="deleteStaff(item.id)"
                >
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- EMPTY -->
        <div v-if="staff.length === 0" class="text-center py-3 text-muted">No staff found</div>
      </div>
    </div>
  </div>

  <!-- EDIT MODAL -->
  <div class="modal fade" id="editModal" tabindex="-1" aria-hidden="true">
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
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>

          <button class="btn btn-primary" @click="updateStaff">Update</button>
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

const getStaff = async () => {
  try {
    const res = await api.get('/staff')

    staff.value = res.data.staff
  } catch (error) {
    console.log(error.response?.data)
  }
}

const openEdit = (item) => {
  selectedStaff.value = {
    ...item,
    password: '',
    password_confirmation: '',
  }
}

const updateStaff = async () => {
  try {
    const res = await api.put(`/staff/${selectedStaff.value.id}`, selectedStaff.value, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    console.log(res.data)

    alert('Updated successfully')

    // staff list refresh
    await getStaff()

    // modal close
    document.querySelector('#editModal .btn-close')?.click()
  } catch (error) {
    console.log(error.response?.data)

    alert(JSON.stringify(error.response?.data))
  }
}
const deleteStaff = async (id) => {
  if (!confirm('Are you sure to delete this staff?')) return

  try {
    await api.delete(`/staff/${id}`)

    staff.value = staff.value.filter((item) => item.id !== id)

    alert('Deleted successfully')
  } catch (error) {
    console.log(error.response?.data)
  }
}

const viewStaff = (item) => {
  alert(
    `Name: ${item.name}
Email: ${item.email}
Role: ${item.role}
Skill: ${item.skill}`,
  )
}

onMounted(() => {
  getStaff()
})
</script>

<style scoped>
.content {
  margin-left: 250px;
  padding: 20px;
}

.staff-search {
  width: 25%;
}

.table-responsive {
  overflow-x: auto;
}

.action-buttons .btn {
  margin: 2px;
}

@media (max-width: 768px) {
  .content {
    margin-left: 0;
    padding: 15px;
  }

  .staff-search {
    width: 100%;
  }

  table {
    min-width: 850px;
  }

  .action-buttons {
    white-space: nowrap;
  }

  .btn-sm {
    margin-bottom: 5px;
  }
}
</style>
