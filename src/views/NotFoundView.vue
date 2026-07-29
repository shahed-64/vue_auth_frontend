<template>
  <div class="not-found">
    <!-- Subtle Background Elements -->
    <div class="bg-shape shape-1"></div>
    <div class="bg-shape shape-2"></div>

    <div class="content-card">
      <div class="badge-tag"><i class="fa-solid fa-triangle-exclamation me-1"></i> Error 404</div>

      <h1 class="error-code">404</h1>

      <h2 class="title">Oops! Page Not Found</h2>

      <p class="description">
        The page you are looking for might have been removed, had its name changed, or is
        temporarily unavailable.
      </p>

      <div class="actions">
        <router-link to="/dashboard" class="btn btn-primary-custom">
          <i class="fa-solid fa-house"></i>
          <span>Back to Dashboard</span>
        </router-link>

        <button @click="$router.back()" class="btn btn-outline-custom">
          <i class="fa-solid fa-arrow-left"></i>
          <span>Go Back</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
// Script section is ready if needed in future
</script>

<style scoped>
.not-found {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f8fafc;
  padding: 24px;
  position: relative;
  overflow: hidden;
  font-family:
    'Inter',
    system-ui,
    -apple-system,
    sans-serif;
}

/* Background Ambient Glows */
.bg-shape {
  position: absolute;
  border-radius: 50%;
  filter: blur(90px);
  z-index: 0;
  opacity: 0.6;
}

.shape-1 {
  width: 300px;
  height: 300px;
  background: rgba(37, 99, 235, 0.15);
  top: -50px;
  left: -50px;
}

.shape-2 {
  width: 350px;
  height: 350px;
  background: rgba(99, 102, 241, 0.12);
  bottom: -80px;
  right: -80px;
}

/* Main Content Card */
.content-card {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 520px;
  text-align: center;
  background: #ffffff;
  padding: 48px 36px;
  border-radius: 24px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.05);
  animation: fadeUp 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

/* Error 404 Badge */
.badge-tag {
  display: inline-flex;
  align-items: center;
  padding: 6px 14px;
  background-color: #eff6ff;
  color: #2563eb;
  font-size: 0.85rem;
  font-weight: 600;
  border-radius: 50px;
  margin-bottom: 16px;
  letter-spacing: 0.3px;
}

/* Gradient 404 Text */
.error-code {
  font-size: 100px;
  font-weight: 900;
  line-height: 1;
  margin: 0 0 10px 0;
  background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: -2px;
}

.title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 12px;
}

.description {
  color: #64748b;
  font-size: 0.95rem;
  line-height: 1.6;
  margin-bottom: 32px;
}

/* Action Buttons */
.actions {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 24px;
  border-radius: 12px;
  font-size: 0.925rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s ease;
  cursor: pointer;
  border: none;
}

.btn-primary-custom {
  background: #2563eb;
  color: #ffffff;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
}

.btn-primary-custom:hover {
  background: #1d4ed8;
  color: #ffffff;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(37, 99, 235, 0.3);
}

.btn-outline-custom {
  background: #f8fafc;
  color: #475569;
  border: 1px solid #cbd5e1;
}

.btn-outline-custom:hover {
  background: #f1f5f9;
  color: #0f172a;
  border-color: #94a3b8;
  transform: translateY(-2px);
}

/* Entrance Animation */
@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@media (max-width: 576px) {
  .content-card {
    padding: 32px 20px;
  }

  .error-code {
    font-size: 80px;
  }

  .actions {
    flex-direction: column;
    width: 100%;
  }

  .btn {
    width: 100%;
  }
}
</style>
