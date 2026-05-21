import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),

  routes: [
    {
      path: '/',
      redirect: '/login',
    },

    {
      path: '/login',
      name: 'loginView',
      component: () => import('../views/loginView.vue'),
      meta: { guest: true },
    },

    {
      path: '/register',
      name: 'registerView',
      component: () => import('../views/registerView.vue'),
      meta: { guest: true },
    },

    {
      path: '/dashboard',
      name: 'dashboardView',
      component: () => import('../views/dashboardView.vue'),
      meta: { requiresAuth: true },
    },

    {
      path: '/student',
      name: 'studentView',
      component: () => import('../views/studentView.vue'),
      meta: { requiresAuth: true },
    },

    {
      path: '/staff',
      name: 'staffView',
      component: () => import('../views/staffView.vue'),
      meta: { requiresAuth: true },
    },

    {
      path: '/account/dashboard',
      name: 'AccountDashboard',
      component: () => import('@/views/account/AccountDeshboardView.vue'),
    },

    {
      path: '/payment/history',
      name: 'PaymentHistory',
      component: () => import('@/views/account/PaymentHistoryView.vue'),
    },

    {
      path: '/paymentPDF/:id',
      name: 'paymentPDF',
      component: () => import('@/views/account/PaymentPdfView.vue'),
    },

    {
      path: '/singlePayment/:id',
      name: 'singlePayment',
      component: () => import('@/views/account/SinglePaymentPdfView.vue'),
    },

    {
      path: '/student/payment',
      name: 'StudentPayment',
      component: () => import('@/views/account/StudentPaymentView.vue'),
    },

    {
      path: '/dash-page',
      name: 'dashPageView',
      component: () => import('../views/dashPageView.vue'),
      meta: { requiresAuth: true },
    },
  ],
})

/* 🔥 CLEAN GLOBAL GUARD */
router.beforeEach((to, from) => {
  const token = localStorage.getItem('token')

  // auth required route
  if (to.meta.requiresAuth && !token) {
    return '/login'
  }

  // guest route (login/register)
  if (to.meta.guest && token) {
    return '/dashboard'
  }

  return true
})

export default router
