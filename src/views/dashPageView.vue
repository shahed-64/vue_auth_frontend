<template>
  <div class="sidebar">
    <h4>Admin Panel</h4>

    <router-link to="/dashboard" active-class="active-menu"> Dashboard </router-link>

    <router-link
      v-if="role === 'Manager' || role === 'Admin'"
      to="/staff"
      active-class="active-menu"
    >
      Staff
    </router-link>
    <router-link to="/account/dashboard" class="text-white d-block ph"
      >Account Dashboard
    </router-link>

    <div class="dropdown bgc">
      <button
        class="btn btn-secondary sss dropdown-toggle"
        style="background-color: transparent !important; border: none"
        type="button"
        data-bs-toggle="dropdown"
      >
        Students
      </button>

      <ul class="dropdown-menu" style="background-color: #1e293b !important">
        <li class="dropdown-item text-white">
          <router-link to="/student" active-class="active-menu">All students </router-link>
        </li>

        <li>
          <button
            class="dropdown-item text-white"
            data-bs-toggle="modal"
            data-bs-target="#addModal"
          >
            Add Student
          </button>
        </li>
      </ul>
    </div>
    <a href="#">Settings</a>
    <button @click="logout" class="btn btn-danger">Logout</button>
  </div>
</template>
<script setup>
const role = localStorage.getItem('role')
import { useRouter } from 'vue-router'

const router = useRouter()

const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('role')

  router.push('/login')
}
</script>
<style>
.bgc {
  background-color: #bgc;
}
</style>
