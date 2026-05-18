<template>
  <div class="container py-5">
    <div class="card register-card shadow-lg border-0 overflow-hidden">
      <div class="row g-0">
        <!-- Left -->
        <div class="col-lg-5 left-side d-none d-lg-flex">
          <div>
            <h1>Create Account</h1>
            <p>Modern and professional Bootstrap registration form design.</p>

            <div class="icons mt-4">
              <i class="bi bi-shield-check"></i>
              <i class="bi bi-stars"></i>
              <i class="bi bi-person-badge"></i>
            </div>
          </div>
        </div>

        <!-- Right -->
        <div class="col-lg-7 bg-white">
          <div class="p-5">
            <h2 class="mb-4 fw-bold text-dark">Registration Form</h2>

            <form @submit.prevent="register">
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label class="form-label">Name</label>
                  <input
                    v-model="form.name"
                    type="text"
                    class="form-control"
                    placeholder="Enter your name"
                  />
                </div>

                <div class="col-md-6 mb-3">
                  <label class="form-label">User Name</label>
                  <input
                    v-model="form.user_name"
                    type="text"
                    class="form-control"
                    placeholder="Username"
                  />
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label">Skill</label>
                  <input
                    v-model="form.skill"
                    type="text"
                    class="form-control"
                    placeholder="Username"
                  />
                </div>

                <div class="col-md-6 mb-3">
                  <label class="form-label">Email</label>
                  <input
                    v-model="form.email"
                    type="email"
                    class="form-control"
                    placeholder="example@mail.com"
                  />
                </div>

                <div class="col-md-6 mb-3">
                  <label class="form-label">Role</label>
                  <select v-model="form.role" class="form-select">
                    <option value="" disabled>Select Role</option>
                    <option value="Admin">Admin</option>
                    <option value="Manager">Manager</option>
                    <option value="Editor">Editor</option>
                    <option value="Accountant">Accountant</option>
                  </select>
                </div>

                <div class="col-md-6 mb-3">
                  <label class="form-label">Password</label>
                  <input
                    v-model="form.password"
                    type="password"
                    class="form-control"
                    placeholder="********"
                  />
                </div>

                <div class="col-md-6 mb-3">
                  <label class="form-label">Confirm Password</label>
                  <input
                    v-model="form.password_confirmation"
                    type="password"
                    class="form-control"
                    placeholder="********"
                  />
                </div>

                <div class="col-12">
                  <button type="submit" class="btn btn-register w-100">
                    <i class="bi bi-person-plus-fill me-2"></i>
                    Create Account
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/api'

const router = useRouter()

const form = reactive({
  name: '',
  user_name: '',
  skill: '',
  role: '',
  email: '',
  password: '',
  password_confirmation: '',
})

const register = async () => {
  try {
    const res = await api.post('/register', form)

    alert(res.data.message || 'Registered successfully')

    router.push('/dashboard')
  } catch (error) {
    // 🔥 SAFE ERROR HANDLING
    if (error.response) {
      console.log('ERROR DATA:', error.response.data)

      const msg =
        error.response.data.message ||
        Object.values(error.response.data.errors || {})
          .flat()
          .join('\n')

      alert(msg)
    } else {
      console.log('NETWORK ERROR:', error)
      alert('Network / Server error')
    }
  }
}
</script>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
