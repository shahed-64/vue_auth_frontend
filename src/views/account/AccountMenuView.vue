<template>
  <div>
    <!-- ================= MOBILE HEADER ================= -->

    <div class="mobile-topbar d-md-none">
      <button class="menu-btn" @click="toggleMenu">
        <i class="fa-solid fa-bars"></i>
      </button>

      <div class="mobile-brand">
        <h5>Coaching MS</h5>
        <small>Management System</small>
      </div>
    </div>

    <!-- ================= SIDEBAR ================= -->

    <div :class="['sidebar', { open: isOpen }]">
      <!-- Logo -->

      <div class="sidebar-logo">
        <div class="logo-box">
          <i class="fa-solid fa-graduation-cap"></i>
        </div>

        <div class="logo-text">
          <h4>Coaching MS</h4>
          <span>Management System</span>
        </div>
      </div>

      <!-- ================= MENU ================= -->

      <div class="sidebar-menu">
        <!-- Dashboard -->

        <router-link to="/account/dashboard" class="menu-item" active-class="active-menu">
          <i class="fa-solid fa-chart-line"></i>

          <span>Dashboard</span>
        </router-link>

        <!-- Student Payment -->

        <router-link to="/student/payment" class="menu-item" active-class="active-menu">
          <i class="fa-solid fa-money-bill-wave"></i>

          <span>Student Payment</span>
        </router-link>

        <!-- Others Payment -->

        <router-link to="/others-payment" class="menu-item" active-class="active-menu">
          <i class="fa-solid fa-wallet"></i>

          <span>Others Payment</span>
        </router-link>

        <!-- Payment Collapse -->

        <div class="payment-wrapper">
          <button
            class="payment-toggle"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#paymentMenu"
          >
            <div class="toggle-left">
              <i class="fa-solid fa-file-invoice-dollar"></i>

              <span>Payments</span>
            </div>

            <i class="fa-solid fa-chevron-down"></i>
          </button>

          <div class="collapse" id="paymentMenu">
            <router-link to="/payment/history" class="submenu-item" active-class="active-menu">
              <i class="fa-solid fa-clock-rotate-left"></i>

              <span>Payment History</span>
            </router-link>

            <router-link to="/payment/single" class="submenu-item" active-class="active-menu">
              <i class="fa-solid fa-user-check"></i>

              <span>Single Student Payment</span>
            </router-link>
          </div>
        </div>

        <!-- Expense -->

        <router-link to="/expense" class="menu-item" active-class="active-menu">
          <i class="fa-solid fa-money-check-dollar"></i>

          <span>Expense</span>
        </router-link>

        <!-- Main Dashboard -->

        <router-link to="/dashboard" class="menu-item" active-class="active-menu">
          <i class="fa-solid fa-gauge-high"></i>

          <span>Main Dashboard</span>
        </router-link>
      </div>

      <!-- Footer -->

      <div class="logout-section">
        <button @click="logout" class="btn btn-danger w-100">Logout</button>
      </div>
    </div>

    <!-- Overlay -->

    <div v-if="isOpen" class="sidebar-overlay d-md-none" @click="toggleMenu"></div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const isOpen = ref(false)

const toggleMenu = () => {
  isOpen.value = !isOpen.value
}

const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('role')
  router.push('/login')
  isOpen.value = false
}
</script>

<style scoped>
/* ==========================================
            SIDEBAR
========================================== */

.sidebar {
  width: 260px;
  min-height: 100vh;

  position: fixed;
  top: 0;
  left: 0;

  background: #111827;

  display: flex;
  flex-direction: column;

  padding: 22px 18px;

  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.18);

  z-index: 1000;

  transition: 0.35s;
  display: flex;
  flex-direction: column;
}

/* ==========================================
            LOGO
========================================== */

.sidebar-logo {
  display: flex;
  align-items: center;
  gap: 14px;

  padding-bottom: 22px;

  margin-bottom: 22px;

  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.logo-box {
  width: 52px;
  height: 52px;

  background: #2563eb;

  border-radius: 14px;

  display: flex;
  justify-content: center;
  align-items: center;

  color: #fff;

  font-size: 24px;

  box-shadow: 0 10px 18px rgba(37, 99, 235, 0.35);
}

.logo-text {
  display: flex;
  flex-direction: column;
}

.logo-text h4 {
  color: #fff;

  margin: 0;

  font-size: 18px;

  font-weight: 700;
}

.logo-text span {
  color: #94a3b8;

  font-size: 13px;
}

/* ==========================================
            MENU WRAPPER
========================================== */

.sidebar-menu {
  flex: 1;
}

/* ==========================================
            MOBILE HEADER
========================================== */

.mobile-topbar {
  display: none;

  position: sticky;

  top: 0;

  background: #111827;

  color: #fff;

  padding: 14px 18px;

  align-items: center;

  gap: 14px;

  z-index: 999;

  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
}

.mobile-brand {
  display: flex;
  flex-direction: column;
}

.mobile-brand h5 {
  margin: 0;

  font-size: 18px;

  font-weight: 700;
}

.mobile-brand small {
  color: #94a3b8;
}

.menu-btn {
  background: none;

  border: none;

  color: #fff;

  font-size: 24px;

  cursor: pointer;
}
/* ==========================================
            MENU
========================================== */

.menu-item {
  display: flex;
  align-items: center;
  gap: 14px;

  width: 100%;

  padding: 13px 16px;

  margin-bottom: 8px;

  border-radius: 12px;

  text-decoration: none;

  color: #d1d5db;

  font-size: 15px;

  font-weight: 500;

  transition: 0.25s ease;
}

.menu-item i {
  width: 20px;

  text-align: center;

  font-size: 16px;

  color: #9ca3af;

  transition: 0.25s;
}

.menu-item span {
  flex: 1;
}

.menu-item:hover {
  background: rgba(255, 255, 255, 0.08);

  color: #fff;

  transform: translateX(4px);
}

.menu-item:hover i {
  color: #60a5fa;
}

/* ==========================================
          ACTIVE MENU
========================================== */

.active-menu {
  background: #2563eb !important;

  color: #fff !important;

  box-shadow: 0 8px 18px rgba(37, 99, 235, 0.35);
}

.active-menu i {
  color: #fff !important;
}

/* ==========================================
        PAYMENT COLLAPSE
========================================== */

.payment-toggle {
  width: 100%;

  border: none;

  background: transparent;

  color: #d1d5db;

  padding: 13px 16px;

  border-radius: 12px;

  display: flex;

  justify-content: space-between;

  align-items: center;

  cursor: pointer;

  transition: 0.25s;
}

.payment-toggle:hover {
  background: rgba(255, 255, 255, 0.08);
}

.toggle-left {
  display: flex;

  align-items: center;

  gap: 14px;
}

.toggle-left i {
  width: 20px;

  text-align: center;

  color: #9ca3af;
}

.payment-toggle:hover .toggle-left i {
  color: #60a5fa;
}

/* ==========================================
            SUB MENU
========================================== */

#paymentMenu {
  margin-top: 8px;

  margin-left: 18px;

  border-left: 2px solid rgba(255, 255, 255, 0.08);

  padding-left: 12px;
}

.submenu-item {
  display: flex;

  align-items: center;

  gap: 12px;

  padding: 10px 14px;

  margin-bottom: 6px;

  border-radius: 8px;

  color: #cbd5e1;

  text-decoration: none;

  font-size: 14px;

  transition: 0.25s;
}

.submenu-item i {
  width: 18px;

  text-align: center;
}

.submenu-item:hover {
  background: rgba(255, 255, 255, 0.08);

  color: #fff;

  transform: translateX(4px);
}

.submenu-item.active-menu {
  background: #2563eb !important;

  color: #fff !important;
}
/* ==========================================
            SIDEBAR FOOTER
========================================== */

.sidebar-footer {
  margin-top: auto;

  padding-top: 20px;

  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.logout-btn {
  width: 100%;

  border: none;

  outline: none;

  background: #ef4444;

  color: #fff;

  padding: 13px 16px;

  border-radius: 12px;

  display: flex;

  align-items: center;

  justify-content: center;

  gap: 10px;

  font-size: 15px;

  font-weight: 600;

  cursor: pointer;

  transition: 0.25s;
}

.logout-btn:hover {
  background: #dc2626;

  transform: translateY(-2px);

  box-shadow: 0 10px 20px rgba(239, 68, 68, 0.35);
}

/* ==========================================
              SCROLLBAR
========================================== */

.sidebar::-webkit-scrollbar {
  width: 6px;
}

.sidebar::-webkit-scrollbar-track {
  background: transparent;
}

.sidebar::-webkit-scrollbar-thumb {
  background: #334155;

  border-radius: 20px;
}

.sidebar::-webkit-scrollbar-thumb:hover {
  background: #475569;
}

/* ==========================================
              OVERLAY
========================================== */

.overlay {
  position: fixed;

  inset: 0;

  background: rgba(0, 0, 0, 0.45);

  backdrop-filter: blur(2px);

  z-index: 999;
}

/* ==========================================
              MOBILE
========================================== */

@media (max-width: 767px) {
  .mobile-topbar {
    display: flex;
  }

  .sidebar {
    left: -280px;

    width: 260px;

    height: 100vh;

    overflow-y: auto;
  }

  .sidebar.open {
    left: 0;
  }
}

/* ==========================================
              DESKTOP
========================================== */

@media (min-width: 768px) {
  .sidebar {
    left: 0;
  }
}

/* ==========================================
            SMOOTH EFFECT
========================================== */

.menu-item,
.submenu-item,
.payment-toggle,
.logout-btn {
  transition: all 0.25s ease;
}

/* ==========================================
            SMALL POLISH
========================================== */

.menu-item:active,
.payment-toggle:active,
.logout-btn:active {
  transform: scale(0.98);
}

.sidebar * {
  box-sizing: border-box;
}
.logout-section {
  margin-top: auto;
  padding-top: 20px;
}
</style>
