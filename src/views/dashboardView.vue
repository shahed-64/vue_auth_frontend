<template>
  <dashPageView />
  <div class="col-12 col-md-10 next-div">
    <div class="topbar">
      <div class="topbar-left">
        <h3 class="page-title">Dashboard</h3>
        <p class="page-subtitle">Welcome back! Here's today's coaching overview.</p>
      </div>

      <div class="topbar-right">
        <div class="profile-info">
          <span class="admin-name">Administrator</span>
          <small>System Admin</small>
        </div>

        <img src="https://i.pravatar.cc/100" class="profile-img" alt="Profile" />
      </div>
    </div>
    <div class="dashboard-content">
      <div class="row g-4 mb-4">
        <div class="col-md-6 col-lg-3">
          <div class="card-box blue">
            <div class="card-icon">
              <i class="fa-solid fa-users"></i>
            </div>

            <div class="card-content">
              <h3>{{ totalStaff }}</h3>
              <p>Total Staff</p>
            </div>
          </div>
        </div>
        <div class="col-md-6 col-lg-3">
          <div class="card-box green">
            <div class="card-icon">
              <i class="fa-solid fa-user-graduate"></i>
            </div>

            <div class="card-content">
              <h3>{{ totalStudents }}</h3>
              <p>Total Students</p>
            </div>
          </div>
        </div>

        <div class="col-md-6 col-lg-3">
          <div class="card-box orange">
            <div class="card-icon">
              <i class="fa-solid fa-wallet"></i>
            </div>

            <div class="card-content">
              <h3>{{ totalPayments }}</h3>
              <p>Total Payments</p>
            </div>
          </div>
        </div>

        <div class="col-md-6 col-lg-3">
          <div class="card-box red">
            <div class="card-icon">
              <i class="fa-solid fa-sack-dollar"></i>
            </div>

            <div class="card-content">
              <h3>৳ {{ totalCollection }}</h3>
              <p>Total Collection</p>
            </div>
          </div>
        </div>
      </div>

      <div class="row g-4">
        <div class="col-lg-8">
          <div class="chart-card">
            <div class="chart-header">
              <div>
                <h5>Traffic Analytics</h5>
                <p>Monthly collection overview</p>
              </div>

              <div class="chart-filter">
                <i class="fa-solid fa-calendar-days"></i>
                Yearly
              </div>
            </div>

            <div class="chart-wrapper">
              <canvas id="trafficChart"></canvas>
            </div>
          </div>
        </div>
        <div class="col-lg-4">
          <div class="profile-card">
            <img src="https://i.pravatar.cc/150?img=12" />
            <h4 class="mt-3">Jim Doe</h4>
            <p class="text-muted">Project Manager</p>

            <div class="row mt-4">
              <div class="col">
                <h5>750</h5>
                <small>Tweets</small>
              </div>

              <div class="col">
                <h5>865</h5>
                <small>Following</small>
              </div>

              <div class="col">
                <h5>3645</h5>
                <small>Followers</small>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- RECENT STAFF TABLE -->

      <div class="row mt-4">
        <div class="col-12">
          <div class="table-card">
            <div class="table-header">
              <div>
                <h5>Recent Staff</h5>

                <p>Latest registered staff members</p>
              </div>

              <div class="staff-count">
                <i class="fa-solid fa-users"></i>

                {{ recentStaff.length }}
              </div>
            </div>

            <div class="table-responsive">
              <table class="table custom-table">
                <thead>
                  <tr>
                    <th>#</th>

                    <th>Staff</th>

                    <th>Email</th>

                    <th>Role</th>

                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  <tr v-for="(staff, index) in recentStaff.slice(0, 5)" :key="staff.id">
                    <td>
                      {{ index + 1 }}
                    </td>

                    <td>
                      <div class="staff-profile">
                        <img src="https://i.pravatar.cc/50" />

                        <span>
                          {{ staff.name }}
                        </span>
                      </div>
                    </td>

                    <td>
                      {{ staff.email }}
                    </td>

                    <td>
                      <span class="role-badge">
                        {{ staff.role }}
                      </span>
                    </td>

                    <td>
                      <span class="status-badge">
                        <i class="fa-solid fa-circle"></i>

                        Registered
                      </span>
                    </td>
                  </tr>

                  <tr v-if="recentStaff.length === 0">
                    <td colspan="5" class="text-center">No staff found</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import Chart from 'chart.js/auto'
import dashPageView from './dashPageView.vue'

const totalStaff = ref(0)
const totalStudents = ref(0)
const totalPayments = ref(0)
const totalCollection = ref(0)
const recentStaff = ref([])
const monthlyCollection = ref([])

let chart = null

const getDashboardData = async () => {
  try {
    const response = await axios.get('http://127.0.0.1:8000/api/staff/dashboard', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })

    totalStaff.value = response.data.total_staff
    totalStudents.value = response.data.total_students
    totalPayments.value = response.data.total_payments
    totalCollection.value = response.data.total_collection
    recentStaff.value = response.data.recent_staff
    monthlyCollection.value = response.data.monthly_collection
  } catch (error) {
    console.log(error)
  }
}

const createChart = () => {
  const months = Array(12).fill(0)

  monthlyCollection.value.forEach((item) => {
    months[item.month - 1] = Number(item.total)
  })

  const ctx = document.getElementById('trafficChart')

  if (chart) {
    chart.destroy()
  }

  chart = new Chart(ctx, {
    type: 'bar',

    data: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],

      datasets: [
        {
          label: 'Collection',

          data: months,

          backgroundColor: '#2563eb',

          borderRadius: 10,

          barThickness: 18,

          hoverBackgroundColor: '#1d4ed8',
        },
      ],
    },

    options: {
      responsive: true,

      maintainAspectRatio: false,

      plugins: {
        legend: {
          display: false,
        },

        tooltip: {
          backgroundColor: '#111827',

          padding: 12,

          titleFont: {
            size: 14,
          },

          bodyFont: {
            size: 13,
          },

          callbacks: {
            label: function (context) {
              return ' ৳ ' + context.raw.toLocaleString()
            },
          },
        },
      },

      scales: {
        y: {
          beginAtZero: true,

          grid: {
            color: '#f1f5f9',
          },

          ticks: {
            callback: function (value) {
              return '৳ ' + value
            },
          },
        },

        x: {
          grid: {
            display: false,
          },
        },
      },
    },
  })
}
onMounted(async () => {
  await getDashboardData()

  createChart()
})

const isOpen = ref(false)

const toggleMenu = () => {
  isOpen.value = !isOpen.value
}
</script>

<style scoped>
.card-box {
  background: #ffffff;
  border-radius: 18px;
  padding: 25px 20px;

  box-shadow: 0 8px 20px rgba(15, 23, 42, 0.08);
  border: 1px solid #f1f5f9;

  transition: all 0.3s ease;

  text-align: center;
}

.card-box:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 30px rgba(15, 23, 42, 0.12);
}

.card-box i {
  font-size: 38px;
  margin-bottom: 15px;
}

.card-box h3 {
  font-size: 32px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 8px;
}

.card-box p {
  color: #6b7280;
  font-size: 15px;
  font-weight: 500;
}

/* Icon Colors */

.blue i {
  color: #2563eb;
}

.green i {
  color: #16a34a;
}

.orange i {
  color: #f59e0b;
}

.red i {
  color: #ef4444;
}

.next-div {
  margin-left: 250px;
  padding: 20px;
}

/* ======= TOPBAR ======= */

.topbar {
  background: #ffffff;
  border-radius: 16px;
  padding: 18px 24px;

  display: flex;
  justify-content: space-between;
  align-items: center;

  margin-bottom: 25px;

  box-shadow: 0 8px 20px rgba(15, 23, 42, 0.08);
}

.page-title {
  margin: 0;
  font-size: 26px;
  font-weight: 700;
  color: #111827;
}

.page-subtitle {
  margin-top: 4px;
  color: #6b7280;
  font-size: 14px;
}

.topbar-right {
  display: flex;
  align-items: center;
  gap: 15px;
}

.profile-info {
  text-align: right;
}

.admin-name {
  display: block;
  font-weight: 600;
  color: #111827;
}

.profile-info small {
  color: #6b7280;
}

.profile-img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: 3px solid #2563eb;
  object-fit: cover;
}

/* MOBILE */
@media (max-width: 768px) {
  .next-div {
    margin-left: 0;
    padding: 15px;
    margin-top: 10px;
  }

  .topbar {
    flex-direction: row;
    gap: 10px;
  }

  .card-box {
    text-align: center;
  }

  .table-responsive {
    overflow-x: auto;
  }

  table {
    min-width: 700px;
  }

  canvas {
    width: 100% !important;
    height: auto !important;
  }
}
/* ===== Traffic Analytics Card ===== */

.chart-card {
  background: #ffffff;

  border-radius: 20px;

  padding: 25px;

  height: 420px;

  border: 1px solid #f1f5f9;

  box-shadow: 0 8px 20px rgba(15, 23, 42, 0.08);

  transition: all 0.35s ease;

  cursor: pointer;
}

.chart-card:hover {
  transform: translateY(-8px);

  box-shadow: 0 18px 40px rgba(37, 99, 235, 0.15);

  border-color: #dbeafe;
}

.chart-card h5 {
  font-size: 20px;

  font-weight: 700;

  color: #111827;
}

.chart-card canvas {
  margin-top: 10px;
}

.chart-header {
  display: flex;

  justify-content: space-between;

  align-items: center;
}

.chart-header p {
  color: #6b7280;

  font-size: 14px;

  margin-top: 5px;
}

.chart-filter {
  background: #eff6ff;

  color: #2563eb;

  padding: 8px 14px;

  border-radius: 12px;

  font-size: 13px;

  font-weight: 600;

  transition: 0.3s ease;
}

.chart-card:hover .chart-filter {
  background: #2563eb;

  color: white;
}

.chart-wrapper {
  height: 300px;
}
.profile-card {
  background: #ffffff;

  border-radius: 20px;

  padding: 30px 20px;

  text-align: center;

  height: 420px;

  border: 1px solid #f1f5f9;

  box-shadow: 0 8px 20px rgba(15, 23, 42, 0.08);

  transition: all 0.35s ease;

  cursor: pointer;
}

.profile-card:hover {
  transform: translateY(-8px);

  box-shadow: 0 18px 35px rgba(37, 99, 235, 0.18);

  border-color: #dbeafe;
}

.profile-card img {
  width: 120px;

  height: 120px;

  border-radius: 50%;

  object-fit: cover;

  border: 5px solid #eff6ff;

  transition: 0.3s ease;
}

.profile-card:hover img {
  border-color: #2563eb;

  transform: scale(1.05);
}

.profile-card h4 {
  font-weight: 700;

  color: #111827;
}

.profile-card p {
  font-size: 14px;
}

.profile-card .row {
  background: #f8fafc;

  border-radius: 15px;

  padding: 15px 5px;
}

.profile-card h5 {
  font-size: 22px;

  font-weight: 700;

  color: #111827;

  margin-bottom: 3px;
}

.profile-card small {
  color: #6b7280;

  font-size: 13px;
}

.profile-card .col {
  transition: 0.3s ease;
}

.profile-card:hover .col {
  transform: translateY(-3px);
}
/* ===== Recent Staff Table ===== */

.table-card {
  background: #ffffff;

  border-radius: 20px;

  padding: 25px;

  border: 1px solid #f1f5f9;

  box-shadow: 0 8px 20px rgba(15, 23, 42, 0.08);

  transition: 0.3s ease;
}

.table-card:hover {
  transform: translateY(-5px);

  box-shadow: 0 18px 35px rgba(15, 23, 42, 0.12);
}

.table-header {
  display: flex;

  justify-content: space-between;

  align-items: center;

  margin-bottom: 20px;
}

.table-header h5 {
  margin: 0;

  font-size: 20px;

  font-weight: 700;

  color: #111827;
}

.table-header p {
  margin: 5px 0 0;

  font-size: 14px;

  color: #6b7280;
}

.staff-count {
  background: #eff6ff;

  color: #2563eb;

  padding: 8px 15px;

  border-radius: 12px;

  font-weight: 600;

  font-size: 14px;
}

.custom-table {
  margin: 0;
}

.custom-table thead th {
  background: #f8fafc;

  color: #64748b;

  font-size: 13px;

  font-weight: 600;

  border: none;

  padding: 14px;
}

.custom-table tbody td {
  padding: 16px 14px;

  vertical-align: middle;

  color: #374151;

  border-bottom: 1px solid #f1f5f9;
}

.custom-table tbody tr {
  transition: 0.25s ease;
}

.custom-table tbody tr:hover {
  background: #f8fafc;

  transform: scale(1.01);
}

.staff-profile {
  display: flex;

  align-items: center;

  gap: 12px;
}

.staff-profile img {
  width: 38px;

  height: 38px;

  border-radius: 50%;

  object-fit: cover;

  border: 2px solid #dbeafe;
}

.staff-profile span {
  font-weight: 600;

  color: #111827;
}

.role-badge {
  background: #ede9fe;

  color: #7c3aed;

  padding: 6px 12px;

  border-radius: 20px;

  font-size: 12px;

  font-weight: 600;
}

.status-badge {
  background: #dcfce7;

  color: #16a34a;

  padding: 6px 12px;

  border-radius: 20px;

  font-size: 12px;

  font-weight: 600;
}

.status-badge i {
  font-size: 8px;

  margin-right: 5px;
}
</style>
