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
      path: '/dashboard',
      name: 'dashboardView',
      component: () => import('../views/dashboardView.vue'),
      meta: { requiresAuth: true, role: ['Admin', 'Manager'] },
    },

    {
      path: '/resultShow',
      name: 'ResultPage',
      component: () => import('../views/ResultPageView.vue'),
      meta: { requiresAuth: true, role: ['Admin', 'Manager'] },
    },
    {
      path: '/result',
      name: 'Result',
      component: () => import('../views/ResultView.vue'),
      meta: { requiresAuth: true, role: ['Admin', 'Manager'] },
    },
    {
      path: '/student',
      name: 'studentView',
      component: () => import('../views/studentView.vue'),
      meta: { requiresAuth: true, role: ['Admin', 'Manager'] },
    },

    {
      path: '/staff',
      name: 'staffView',
      component: () => import('../views/staffView.vue'),
      meta: { requiresAuth: true, role: ['Admin', 'Manager'] },
    },

    {
      path: '/account/dashboard',
      name: 'AccountDashboard',
      component: () => import('@/views/account/AccountDeshboardView.vue'),
      meta: { requiresAuth: true, role: ['Accountant', 'Manager'] },
    },

    {
      path: '/payment/history',
      name: 'PaymentHistory',
      component: () => import('@/views/account/PaymentHistoryView.vue'),
      meta: { requiresAuth: true, role: ['Accountant', 'Manager'] },
    },

    {
      path: '/paymentPDF/:id',
      name: 'paymentPDF',
      component: () => import('@/views/account/PaymentPdfView.vue'),
      meta: { requiresAuth: true, role: ['Accountant', 'Manager'] },
    },

    {
      path: '/singlePayment/:id',
      name: 'singlePayment',
      component: () => import('@/views/account/SinglePaymentPdfView.vue'),
      meta: { requiresAuth: true, role: ['Accountant', 'Manager'] },
    },
    {
      path: '/payment/single',
      name: 'singleStudentPayment',
      component: () => import('@/views/account/SingleStudentPaymentView.vue'),
      meta: { requiresAuth: true, role: ['Accountant', 'Manager'] },
    },
    {
      path: '/student/payment',
      name: 'StudentPayment',
      component: () => import('@/views/account/StudentPaymentView.vue'),
      meta: { requiresAuth: true, role: ['Accountant', 'Manager'] },
    },

    {
      path: '/dash-page',
      name: 'dashPageView',
      component: () => import('../views/dashPageView.vue'),
      meta: { requiresAuth: true },
    },

    {
      path: '/others-payment',
      name: 'othersPayment',
      component: () => import('@/views/account/OthersPaymentView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/expense',
      name: 'expense',
      component: () => import('@/views/account/ExpenseDashboardView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('../views/NotFoundView.vue'),
    },
  ],
})

/* 🔥 CLEAN GLOBAL GUARD */
router.beforeEach((to) => {
  const token = localStorage.getItem('token')
  const role = localStorage.getItem('role')

  // Login Required
  if (to.meta.requiresAuth && !token) {
    return '/login'
  }

  // Guest Route (Already Logged In)
  if (to.meta.guest && token) {
    if (role === 'Accountant') {
      return '/account/dashboard'
    }

    return '/dashboard'
  }

  // Role Permission
  if (to.meta.role && !to.meta.role.includes(role)) {
    if (role === 'Accountant') {
      return '/account/dashboard'
    }

    return '/dashboard'
  }

  return true
})

export default router
