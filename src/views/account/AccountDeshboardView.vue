<template>
  <div class="d-flex bgc">
    <AccountMenuView />
    <div class="flex-grow-1 p-4">
      <h2>Dashboard</h2>
      <div class="row mt-4">
        <div class="col-md-4">
          <div class="card p-3">
            <h5>Total Students</h5>
            <h2>120</h2>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card p-3">
            <h5>Total Due</h5>
            <h2>35</h2>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card p-3">
            <h5>Total Revenue</h5>
            <h2>৳ 2,40,000</h2>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import AccountMenuView from './AccountMenuView.vue'
</script>
<style>
.flex-grow-1 {
  margin-left: 240px !important;
}
.ph {
  background-color: transparent !important;
  border: none;
}
</style>
