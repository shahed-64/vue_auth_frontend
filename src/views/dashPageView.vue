<template>
  <!-- MOBILE HEADER -->
  <div class="mobile-header d-md-none">
    <button class="menu-btn" @click="toggleSidebar">
      <i class="fa-solid fa-bars"></i>
    </button>

    <h5 class="mb-0 text-white">Admin Panel</h5>
  </div>

  <!-- OVERLAY -->
  <div class="sidebar-overlay" :class="{ active: isSidebarOpen }" @click="toggleSidebar"></div>

  <!-- SIDEBAR -->
  <div class="sidebar" :class="{ active: isSidebarOpen }">
    <!-- Logo -->
    <div class="sidebar-logo">
      <div class="logo-icon">
        <i class="fa-solid fa-graduation-cap"></i>
      </div>

      <div class="logo-content">
        <h5 class="logo-title">Coaching MS</h5>
        <span class="logo-subtitle">Management System</span>
      </div>
    </div>

    <!-- Dashboard -->
    <router-link to="/dashboard" active-class="active-menu" @click="closeSidebar">
      <i class="fa-solid fa-gauge-high"></i>
      <span>Dashboard</span>
    </router-link>

    <!-- Result -->
    <router-link to="/result" active-class="active-menu" @click="closeSidebar">
      <i class="fa-solid fa-square-poll-vertical"></i>
      <span>Result</span>
    </router-link>

    <!-- Staff -->
    <router-link
      v-if="role === 'Manager' || role === 'Admin'"
      to="/staff"
      active-class="active-menu"
      @click="closeSidebar"
    >
      <i class="fa-solid fa-users"></i>
      <span>Staff</span>
    </router-link>

    <!-- Account -->
    <router-link
      v-if="role === 'Manager'"
      to="/account/dashboard"
      active-class="active-menu"
      @click="closeSidebar"
    >
      <i class="fa-solid fa-wallet"></i>
      <span>Account Dashboard</span>
    </router-link>

    <!-- Student Dropdown -->
    <div class="dropdown w-100 mb-2">
      <button class="student-btn dropdown-toggle" type="button" data-bs-toggle="dropdown">
        <span>
          <i class="fa-solid fa-user-graduate"></i>
          Students
        </span>
      </button>

      <ul class="dropdown-menu w-100">
        <li>
          <router-link
            class="dropdown-item"
            to="/student"
            active-class="active-menu"
            @click="closeSidebar"
          >
            <i class="fa-solid fa-list"></i>
            All Students
          </router-link>
        </li>

        <li>
          <button class="dropdown-item" data-bs-toggle="modal" data-bs-target="#addModal">
            <i class="fa-solid fa-user-plus"></i>
            Add Student
          </button>
        </li>
      </ul>
    </div>

    <!-- Settings -->
    <router-link to="/settings" active-class="active-menu" @click="closeSidebar">
      <i class="fa-solid fa-gear"></i>
      <span>Settings</span>
    </router-link>
    <button @click="backupDatabase" class="btn btn-primary">Backup Database</button>
    <!-- Logout -->
    <button @click="logout" class="btn btn-danger logout-btn">
      <i class="fa-solid fa-right-from-bracket me-2"></i>
      Logout
    </button>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const role = localStorage.getItem('role')
const router = useRouter()

const isSidebarOpen = ref(false)

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}

const closeSidebar = () => {
  isSidebarOpen.value = false
}

const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('role')

  router.push('/login')
}

//database backup
const backupDatabase = async () => {
  const response = await api.get('/backup', {
    responseType: 'blob',
  })

  const url = window.URL.createObjectURL(response.data)

  const link = document.createElement('a')
  link.href = url
  link.download = 'database_backup.sql'
  link.click()
}
</script>

<style scoped>
/* DESKTOP SIDEBAR */
/* ================= Sidebar ================= */

.sidebar {
  width: 260px;
  min-height: 100vh;

  background: #111827;

  padding: 20px;

  position: fixed;
  left: 0;
  top: 0;

  overflow-y: auto;

  z-index: 999;

  transition: all 0.3s ease;

  border-right: 1px solid rgba(255, 255, 255, 0.06);

  box-shadow: 6px 0 18px rgba(0, 0, 0, 0.18);
}

.next-div {
  margin-left: 260px;
}
/* ================= Menu ================= */

.sidebar a {
  display: flex;
  align-items: center;

  color: #e5e7eb;
  text-decoration: none;

  padding: 12px 15px;
  margin-bottom: 8px;

  border-radius: 10px;

  font-size: 15px;
  font-weight: 500;

  transition: all 0.25s ease;
}

.sidebar a:hover {
  background: rgba(255, 255, 255, 0.08);
  color: #fff;

  transform: translateX(4px);
}

.active-menu {
  background: #2563eb !important;
  color: #fff !important;

  box-shadow: 0 8px 18px rgba(37, 99, 235, 0.3);
}

.student-btn {
  width: 100%;

  background: transparent !important;
  border: none !important;
  outline: none;

  color: #e5e7eb !important;

  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 12px 15px;
  margin-bottom: 8px;

  border-radius: 10px;

  font-size: 15px;
  font-weight: 500;

  transition: all 0.25s ease;
}

.student-btn:hover {
  background: rgba(255, 255, 255, 0.08) !important;
  color: #fff !important;

  transform: translateX(4px);
}

.student-btn::after {
  margin-left: auto;
}
/* MOBILE TOPBAR */
.mobile-header {
  position: sticky;
  top: 0;
  z-index: 998;
  background: #111827;
  padding: 14px 16px;
  display: flex;
  align-items: center;
  gap: 15px;
}

.menu-btn {
  border: none;
  background: transparent;
  color: white;
  font-size: 30px;
  line-height: 1;
}

/* OVERLAY */
.sidebar-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  visibility: hidden;
  opacity: 0;
  transition: 0.3s;
  z-index: 997;
}

.sidebar-overlay.active {
  visibility: visible;
  opacity: 1;
}

/* MOBILE */
@media (max-width: 768px) {
  .sidebar {
    left: -100%;
    width: 260px;
  }

  .sidebar.active {
    left: 0;
  }
}

/* DESKTOP */
@media (min-width: 769px) {
  .mobile-header {
    display: none;
  }
}
.dropdown-menu {
  background-color: #111827 !important;
}
.adstu {
  color: aliceblue !important;
}
/* ---------- Logo ---------- */

.sidebar-logo {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-bottom: 20px;
  margin-bottom: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.logo-icon {
  width: 50px;
  height: 50px;
  background: #2563eb;
  border-radius: 12px;

  display: flex;
  justify-content: center;
  align-items: center;

  color: #fff;
  font-size: 22px;
}

.logo-title {
  color: #fff;
  font-weight: 700;
}

.logo-subtitle {
  color: #94a3b8;
}
.student-btn {
  width: 100%;
  background: transparent !important;
  border: none !important;
  color: #fff !important;
  text-align: left;
  padding: 12px 15px;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: 0.3s;
}

.student-btn:hover {
  background: rgba(255, 255, 255, 0.1) !important;
}
/* ================= Dropdown ================= */

.dropdown-menu {
  width: 100%;

  background: #1f2937 !important;

  border: 1px solid rgba(255, 255, 255, 0.08);

  border-radius: 10px;

  padding: 6px;

  margin-top: 6px !important;

  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.25);
}

.dropdown-item {
  display: flex;
  align-items: center;

  color: #e5e7eb !important;

  padding: 10px 12px;

  border-radius: 8px;

  font-size: 14px;

  transition: all 0.25s ease;
}

.dropdown-item:hover {
  background: #2563eb !important;
  color: #fff !important;

  transform: translateX(3px);
}

.dropdown-item i {
  width: 18px;
}
/* ================= Logo ================= */

.sidebar-logo {
  display: flex;
  align-items: center;
  gap: 14px;

  padding-bottom: 20px;
  margin-bottom: 22px;

  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.logo-icon {
  width: 52px;
  height: 52px;

  display: flex;
  align-items: center;
  justify-content: center;

  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  color: #fff;

  border-radius: 14px;

  font-size: 22px;

  box-shadow: 0 10px 25px rgba(37, 99, 235, 0.35);
}

.logo-content {
  display: flex;
  flex-direction: column;
}

.logo-title {
  margin: 0;
  color: #fff;
  font-size: 18px;
  font-weight: 700;
  line-height: 1.2;
}

.logo-subtitle {
  color: #94a3b8;
  font-size: 12px;
  letter-spacing: 0.5px;
}

/* ================= Logout ================= */

.sidebar .btn-danger {
  width: 100%;

  border: none;

  border-radius: 10px;

  padding: 12px 15px;

  margin-top: 20px;

  font-weight: 600;

  background: #dc2626;

  transition: all 0.25s ease;
}

.sidebar .btn-danger {
  position: absolute;
  bottom: 20px;
  left: 20px;

  width: calc(100% - 40px);

  border: none;
  border-radius: 10px;

  padding: 12px 15px;

  font-weight: 600;

  background: #dc2626;

  transition: all 0.25s ease;
}

.sidebar .btn-danger:hover {
  background: #b91c1c;
  transform: translateY(-2px);
}
/* ================= Scrollbar ================= */

.sidebar::-webkit-scrollbar {
  width: 6px;
}

.sidebar::-webkit-scrollbar-thumb {
  background: #334155;
  border-radius: 20px;
}

.sidebar::-webkit-scrollbar-thumb:hover {
  background: #475569;
}

/* ================= Overlay ================= */

.sidebar-overlay {
  backdrop-filter: blur(2px);
}

/* ================= Mobile Header ================= */

.mobile-header {
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
}

/* ================= Animation ================= */

.sidebar a,
.student-btn,
.dropdown-item,
.btn-danger {
  transition: all 0.25s ease;
}

/* ================= Divider ================= */

.sidebar hr {
  border-color: rgba(255, 255, 255, 0.08);
}

/* ================= Small Polish ================= */

.logo-icon,
.student-btn,
.sidebar a,
.btn-danger {
  user-select: none;
}
.sidebar a {
  display: flex;
  align-items: center;
  gap: 12px;
}

.sidebar a i {
  width: 22px;
  text-align: center;
  font-size: 16px;
}

.student-btn span {
  display: flex;
  align-items: center;
  gap: 12px;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.dropdown-item i {
  width: 20px;
  text-align: center;
}

.logout-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
}
</style>
