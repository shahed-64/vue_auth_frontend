<template>
  <div class="d-flex">
    <div class="bg-dark text-white p-3 vh-100" style="width: 250px">
      <h4>School Panel</h4>
      <hr />
      <router-link to="/account/dashboard" class="text-white d-block mb-2"> Dashboard </router-link>

      <router-link to="/student/payment" class="text-white d-block mb-2">
        Student Payment
      </router-link>

      <router-link to="/payment/history" class="text-white d-block ph">
        Payment History
      </router-link>
      <router-link to="/dashboard" class="text-white d-block ph">Main Dashboard </router-link>
      <br />
      <button @click="logout" class="btn btn-danger">Logout</button>
    </div>
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
.ph {
  background-color: transparent !important;
  border: none;
}
router-link {
  text-decoration: none !important;
}
</style>
