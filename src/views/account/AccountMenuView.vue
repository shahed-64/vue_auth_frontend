<template>
  <div class="d-flex">
    <div class="bg-dark text-white p-3 vh-100 sidebar" style="width: 250px">
      <h4>School Panel</h4>
      <hr />

      <router-link to="/account/dashboard" class="text-white d-block mb-2"> Dashboard </router-link>

      <router-link to="/student/payment" class="text-white d-block mb-2">
        Student Payment
      </router-link>

      <router-link to="/payment/history" class="text-white d-block ph">
        Payment History
      </router-link>

      <router-link to="/dashboard" class="text-white d-block ph"> Main Dashboard </router-link>

      <br />

      <button @click="logout" class="btn btn-danger w-100 logout-btn">Logout</button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const role = localStorage.getItem('role')
const router = useRouter()

const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('role')
  router.push('/login')
}
</script>

<style scoped>
/* তোমার existing class রাখা হয়েছে */
.ph {
  background-color: transparent !important;
  border: none;
  padding: 6px 0;
  transition: 0.2s;
}

.ph:hover {
  color: #ffffff;
  transform: translateX(4px);
}

/* router-link fix (Vue এর জন্য proper selector) */
a.router-link-active {
  font-weight: bold;
  color: #ffffff !important;
}

/* sidebar enhancement only */
.sidebar {
  border-right: 1px solid rgba(255, 255, 255, 0.1);
}

/* logout button little polish */
.logout-btn {
  margin-top: 20px;
  border-radius: 8px;
  font-weight: 600;
}
</style>
