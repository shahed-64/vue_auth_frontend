<template>
  <div
    class="d-flex align-items-center justify-content-center vh-100"
    style="background: linear-gradient(135deg, #0f172a, #2563eb)"
  >
    <div class="card form-card shadow-lg" style="max-width: 900px">
      <div class="row g-0">
        <div class="col-lg-5 left-side d-none d-lg-block">
          <h1>Welcome Back</h1>
          <p>Professional Admin Dashboard Login</p>
        </div>
        <div class="col-lg-7 bg-white p-5">
          <h2 class="fw-bold mb-4">Login</h2>
          <form action="dashboard.html">
            <div class="mb-3">
              <label>Email</label>
              <input type="email" class="form-control" />
            </div>
            <div class="mb-3">
              <label>Password</label>
              <input type="password" class="form-control" />
            </div>
            <button class="btn btn-custom w-100">Login</button>
            <p class="mt-3 text-center">No account? <a href="register.html">Register</a></p>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
