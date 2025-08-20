import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../views/Dashboard.vue'
import Main from '@/layouts/main.vue'
import Auth from '@/layouts/Auth.vue'
import Login from '@/views/Login.vue'
import { useAuthStore } from '@/stores/auth'
import HeadOfFamilies from '@/views/head-of-family/HeadOfFamilies.vue'
import HeadOfFamily from '@/views/head-of-family/HeadOfFamily.vue'
import HeadOfFamilyCreate from '@/views/head-of-family/HeadOfFamilyCreate.vue'
import SocialAssistances from '@/views/social-assistance/SocialAssistances.vue'
import SocialAssistance from '@/views/social-assistance/SocialAssistance.vue'
import SocialAssistanceEdit from '@/views/social-assistance/SocialAssistanceEdit.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: Main,
      children: [
        {
          path: '',
          name: 'dashboard',
          component: Dashboard,
          meta: { requiresAuth: true, permission: 'dashboard-menu' }
        },
        {
          path: 'head-of-family',
          name: 'head-of-family',
          component: HeadOfFamilies,
          meta: { requiresAuth: true, permission: 'head-of-family-list' }
        },
        {
          path: 'head-of-family/:id',
          name: 'manage-head-of-family',
          component: HeadOfFamily,
          meta: { requiresAuth: true, permission: 'head-of-family-list' }
        },
        {
          path: 'head-of-family/create',
          name: 'create-head-of-family',
          component: HeadOfFamilyCreate,
          meta: { requiresAuth: true, permission: 'head-of-family-create' }
        },
        {
          path: 'social-assistance',
          name: 'social-assistance',
          component: SocialAssistances,
          meta: { requiresAuth: true, permission: 'social-assistance-list' }
        },  
        {
          path: 'social-assistance/:id',
          name: 'manage-social-assistance',
          component: SocialAssistance,
          meta: { requiresAuth: true, permission: 'social-assistance-list' }
        },
        {
          path: 'social-assistance/edit/:id',
          name: 'edit-social-assistance',
          component: SocialAssistanceEdit,
          meta: { requiresAuth: true, permission: 'social-assistance-edit' }
        },
      ]
    },
    {
      path: '/login',
      component: Auth,
      children: [
        {
          path: '',
          name: 'login',
          component: Login,
          meta: { requiresUnauth: true }
        }
      ]
    },
  ],
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  console.log('Guard check:', { token: authStore.token, user: authStore.user })

  if (to.meta.requiresAuth) {
    if(authStore.token) {
      try {
        if (!authStore.user) {
          await authStore.checkAuth()
        }
        next()
      } catch {
        next({ name: 'login' })
      }
    } else {
      next({ name: 'login' })
    }
  } else if (to.meta.requiresUnauth && authStore.token) {
    next({ name: 'dashboard' })
  } else {
    next()
  }
})


export default router
