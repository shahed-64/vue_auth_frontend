<template>
  <div class="col-md-10 next-div">
    <div class="topbar">
      <h4 class="mb-0">Dashboard</h4>
      <img src="https://i.pravatar.cc/100" width="45" style="border-radius: 50%" />
    </div>

    <div class="dashboard-content">
      <div class="row g-4 mb-4">
        <div class="col-md-3">
          <div class="card-box blue">
            <i class="fa-solid fa-users"></i>
            <h2>10,468</h2>
            <p class="mb-0">Total Members</p>
          </div>
        </div>

        <div class="col-md-3">
          <div class="card-box green">
            <i class="fa-solid fa-chart-line"></i>
            <h2>8,120</h2>
            <p class="mb-0">Visitors</p>
          </div>
        </div>

        <div class="col-md-3">
          <div class="card-box orange">
            <i class="fa-solid fa-wallet"></i>
            <h2>$12,450</h2>
            <p class="mb-0">Revenue</p>
          </div>
        </div>

        <div class="col-md-3">
          <div class="card-box red">
            <i class="fa-solid fa-user-plus"></i>
            <h2>961</h2>
            <p class="mb-0">New Customers</p>
          </div>
        </div>
      </div>

      <div class="row g-4">
        <div class="col-lg-8">
          <div class="chart-card">
            <h5 class="mb-4">Traffic Analytics</h5>
            <canvas id="trafficChart" height="110"></canvas>
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

      <div class="row mt-4">
        <div class="col-12">
          <div class="table-card">
            <h5 class="mb-3">Recent Staff</h5>

            <table class="table table-hover">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td>1</td>
                  <td>Shahed</td>
                  <td>shahed@example.com</td>
                  <td>Admin</td>
                  <td><span class="badge bg-success">Active</span></td>
                </tr>

                <tr>
                  <td>2</td>
                  <td>Rahim</td>
                  <td>rahim@example.com</td>
                  <td>Manager</td>
                  <td><span class="badge bg-warning">Pending</span></td>
                </tr>

                <tr>
                  <td>3</td>
                  <td>Karim</td>
                  <td>karim@example.com</td>
                  <td>Editor</td>
                  <td><span class="badge bg-danger">Inactive</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>

  <dashPageView />
</template>

<script setup>
import { ref } from 'vue'

import dashPageView from './dashPageView.vue'
import { onMounted } from 'vue'

import Chart from 'chart.js/auto'
onMounted(() => {
  const ctx = document.getElementById('trafficChart')

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [
        {
          label: 'Visitors',
          data: [120, 190, 170, 220, 180, 260],
          borderWidth: 3,
          tension: 0.4,
        },
      ],
    },
    options: {
      responsive: true,
    },
  })
})
const isOpen = ref(false)
const toggleMenu = () => {
  isOpen.value = !isOpen.value
}
</script>
<style>
.card-box {
  color: #333;
}
</style>
