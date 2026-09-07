<template>
  <div class="login-page">
    <div class="login-card-wrapper">
      <div class="login-left-form">
        <div class="logo-container">
          <div class="logo-box">C</div>
          <span class="logo-title">Crexfio</span>
        </div>

        <div class="form-header">
          <h2>Welcome Back!</h2>
          <p>Sign in to your account to continue</p>
        </div>

        <form @submit.prevent="login">
          <div class="input-group-custom">
            <label>Email or Staff ID*</label>
            <input
              v-model="email"
              type="text"
              placeholder="manager@school.edu"
              autocomplete="email"
            />
          </div>

          <div class="input-group-custom">
            <label>Password*</label>
            <input
              v-model="password"
              type="password"
              placeholder="••••••••"
              autocomplete="current-password"
            />
          </div>

          <button type="submit" class="login-button">Log In</button>

          <p v-if="errorMsg" class="error-message">
            {{ errorMsg }}
          </p>
        </form>

        <div class="social-logins">
          <button type="button" class="social-btn"> Apple</button>
          <button type="button" class="social-btn">G Google</button>
        </div>

        <div class="footer-note">
          Need Help?
          <a :href="whatsappUrl" target="_blank" rel="noopener noreferrer">Contact Support</a>
        </div>
      </div>

      <div class="login-right-visual">
        <div class="close-badge">×</div>

        <div class="floating-announcement">
          <span class="dot"></span>
          <div>
            <strong>Task Review With Team</strong>
            <p>10:00AM-10:30AM</p>
          </div>
        </div>

        <div class="floating-calendar">
          <div class="cal-days">
            <span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span
            ><span>Fri</span><span>Sat</span>
          </div>
          <div class="cal-dates">
            <span>22</span><span>23</span><span>24</span><span>25</span><span>26</span
            ><span>27</span><span>28</span>
          </div>
        </div>

        <div class="floating-tasks">
          <strong>Daily Meeting</strong>
          <p>10:00AM-10:30AM</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/api'

const router = useRouter()

const email = ref('')
const password = ref('')
const errorMsg = ref('')

// WhatsApp Support Link Setup
const whatsappNumber = '8801753787564'
const whatsappMessage = encodeURIComponent(
  'Hello, I need help with School/Coaching Management login.',
)
const whatsappUrl = ref(`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`)

const login = async () => {
  try {
    errorMsg.value = ''
    const res = await api.post('/login', {
      email: email.value,
      password: password.value,
    })

    const token = res.data.token
    if (!token) {
      errorMsg.value = 'Token not received from server'
      return
    }

    localStorage.setItem('token', token)
    router.push('/dashboard')
  } catch (error) {
    errorMsg.value = error.response?.data?.message || 'Login failed'
  }
}
</script>

<style scoped>
/* =========================================
   MAIN BACKDROP & CONTAINER
========================================= */

.login-page {
  width: 100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  box-sizing: border-box;
  background-color: #e2e8f0;
}

.login-card-wrapper {
  display: flex;
  width: 1040px;
  height: 620px;
  background: #fbf9f4;
  border-radius: 28px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  padding: 32px;
  gap: 32px;
  box-sizing: border-box;
}

/* =========================================
   LEFT SIDE (FORM SECTION)
========================================= */

.login-left-form {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 5px 5px;
}

/* Logo */
.logo-container {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo-box {
  width: 36px;
  height: 36px;
  background: #111827;
  color: #fff;
  font-size: 15px;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
}

.logo-title {
  font-size: 17px;
  font-weight: 700;
  color: #1f2937;
}

/* Header */
.form-header h2 {
  margin: 0 0 6px;
  color: #111827;
  font-size: 30px;
  font-weight: 700;
  letter-spacing: -0.5px;
}

.form-header p {
  margin: 0 0 20px;
  color: #6b7280;
  font-size: 14px;
}

/* Inputs */
.input-group-custom {
  margin-bottom: 18px;
}

.input-group-custom label {
  display: block;
  margin-bottom: 8px;
  color: #374151;
  font-size: 14px;
  font-weight: 600;
}

.input-group-custom input {
  width: 100%;
  height: 48px;
  padding: 0 18px;
  border: 1px solid #d1d5db;
  border-radius: 12px;
  background: #ffffff;
  color: #1f2937;
  font-size: 15px;
  outline: none;
  box-sizing: border-box;
  transition: all 0.2s;
}

.input-group-custom input:focus {
  border-color: #facc15;
  box-shadow: 0 0 0 3px rgba(250, 204, 21, 0.15);
}

/* Submit Button */
.login-button {
  width: 100%;
  height: 50px;
  border: none;
  border-radius: 12px;
  background: #fde047;
  color: #1f2937;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s;
  margin-top: 10px;
}

.login-button:hover {
  background: #facc15;
}

/* Social Logins */
.social-logins {
  display: flex;
  gap: 12px;
  margin-top: 12px;
}

.social-btn {
  flex: 1;
  height: 44px;
  border: 1px solid #d1d5db;
  border-radius: 12px;
  background: #fff;
  color: #374151;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.social-btn:hover {
  background: #f9fafb;
}

/* Footer & Error */
.footer-note {
  font-size: 13px;
  color: #6b7280;
  text-align: center;
  margin-top: 10px;
}

.footer-note a {
  color: #111827;
  font-weight: 600;
  text-decoration: none;
}

.error-message {
  margin: 10px 0 0;
  text-align: center;
  color: #dc3545;
  font-size: 13px;
}

/* =========================================
   RIGHT SIDE (PICTURE BANNER SECTION)
========================================= */

.login-right-visual {
  flex: 1.25;
  position: relative;
  background-image: url('@/assets/school-login-banner.jpg');
  background-size: cover;
  background-position: center;
  border-radius: 20px;
  overflow: hidden;
  box-sizing: border-box;
  padding: 16px;
}

.floating-announcement,
.floating-calendar,
.floating-tasks,
.close-badge {
  position: absolute;
  z-index: 2;
}

/* Close Button Corner */
.close-badge {
  top: 14px;
  right: 14px;
  width: 26px;
  height: 26px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
  font-weight: bold;
  color: #333;
  cursor: pointer;
}

/* Floating Announcement Box */
.floating-announcement {
  top: 20px;
  left: 20px;
  background: #fde047;
  padding: 10px 14px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  font-size: 10px;
  color: #111;
}

.floating-announcement .dot {
  width: 6px;
  height: 6px;
  background: #111;
  border-radius: 50%;
}

.floating-announcement p {
  margin: 2px 0 0 0;
  font-size: 9px;
  color: #4b5563;
}

/* Floating Glass Calendar Widget */
.floating-calendar {
  bottom: 100px;
  left: 20px;
  right: 20px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.35);
  padding: 10px 14px;
  border-radius: 12px;
  color: #fff;
  font-size: 10px;
}

.cal-days,
.cal-dates {
  display: flex;
  justify-content: space-between;
  font-weight: 600;
}

.cal-dates {
  font-size: 12px;
  margin-top: 4px;
}

/* Floating Tasks Widget */
.floating-tasks {
  bottom: 20px;
  left: 20px;
  background: rgba(255, 255, 255, 0.95);
  padding: 12px 14px;
  border-radius: 12px;
  font-size: 10px;
  color: #1f2937;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  width: 170px;
}

.floating-tasks strong {
  display: block;
  margin-bottom: 2px;
  font-size: 11px;
}

.floating-tasks p {
  margin: 0;
  color: #6b7280;
  font-size: 9px;
}

/* =========================================
   RESPONSIVE DESIGN
========================================= */

@media (max-width: 900px) {
  .login-card-wrapper {
    flex-direction: column;
    height: auto;
    width: 100%;
    max-width: 440px;
  }
  .login-right-visual {
    height: 320px;
    width: 100%;
  }
}
</style>
