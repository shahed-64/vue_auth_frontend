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
      path: '/Institure-Info',
      name: 'InstututeInfo',
      component: () => import('../views/InstituteInformationView.vue'),
      meta: { requiresAuth: true, role: ['Admin', 'Manager'] },
    },
    {
      path: '/shift',
      name: 'shiftView',
      component: () => import('../views/ShifPagetView.vue'),
      meta: { requiresAuth: true, role: ['Admin', 'Manager'] },
    },
    {
      path: '/section',
      name: 'SectionView',
      component: () => import('../views/SectionView.vue'),
      meta: { requiresAuth: true, role: ['Admin', 'Manager'] },
    },
    {
      path: '/class',
      name: 'ClassView',
      component: () => import('../views/ClassView.vue'),
      meta: { requiresAuth: true, role: ['Admin', 'Manager'] },
    },
    {
      path: '/exam',
      name: 'ExaminationView',
      component: () => import('../views/ExaminationView.vue'),
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
      path: '/subject',
      name: 'subjectView',
      component: () => import('../views/SubjectView.vue'),
      meta: { requiresAuth: true, role: ['Admin', 'Manager'] },
    },
    {
      path: '/staff',
      name: 'staffView',
      component: () => import('../views/staffView.vue'),
      meta: { requiresAuth: true, role: ['Admin', 'Manager'] },
    },
    {
      path: '/staffAttendance',
      name: 'StaffAttendanceView',
      component: () => import('../views/StaffAttendanceView.vue'),
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
      path: '/ClassGroup',
      name: 'ClassGroup',
      component: () => import('../views/ClassGroupView.vue'),
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
    {
      path: '/teacherView',
      name: 'teacher',
      component: () => import('../views/TeachersView.vue'),
      meta: { requiresAuth: true, role: ['Admin', 'Manager'] },
    },
    {
      path: '/teachers',
      name: 'teachersView',
      component: () => import('../views/TeachersView.vue'),
      meta: { requiresAuth: true, role: ['Admin', 'Manager'] },
    },
    {
      path: '/teacherattendance',
      name: 'teacherAttendence',
      component: () => import('../views/TeacherAttendanceView.vue'),
      meta: { requiresAuth: true, role: ['Admin', 'Manager'] },
    },
    {
      path: '/AttendanceHistry',
      name: 'teacherAttendanceHistryView',
      component: () => import('../views/AttendanceHistryView.vue'),
      meta: { requiresAuth: true, role: ['Admin', 'Manager'] },
    },
    {
      path: '/StaffAttendanceHistry',
      name: 'StaffAttendanceHistryView',
      component: () => import('../views/StaffAttendanceHistryView.vue'),
      meta: { requiresAuth: true, role: ['Admin', 'Manager'] },
    },
    {
      path: '/AttendancOverview',
      name: 'teacherAttendanceOverview',
      component: () => import('../views/AttendanceOverviewView.vue'),
      meta: { requiresAuth: true, role: ['Admin', 'Manager'] },
    },
    {
      path: '/StaffAttendancOverview',
      name: 'StaffAttendanceOverview',
      component: () => import('../views/StaffAttendanceOverviewView.vue'),
      meta: { requiresAuth: true, role: ['Admin', 'Manager'] },
    },
    {
      path: '/holiday',
      name: 'HOlidaysView',
      component: () => import('../views/HolidaysView.vue'),
      meta: { requiresAuth: true, role: ['Admin', 'Manager'] },
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
