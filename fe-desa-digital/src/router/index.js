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
import SocialAssistanceCreate from '@/views/social-assistance/SocialAssistanceCreate.vue'
import SocialAssistanceRecipients from '@/views/social-assistance-recipient/SocialAssistanceRecipients.vue'
import SocialAssistanceRecipient from '@/views/social-assistance-recipient/SocialAssistanceRecipient.vue'
import Developments from '@/views/development/Developments.vue'
import Development from '@/views/development/Development.vue'
import DevelopmentEdit from '@/views/development/DevelopmentEdit.vue'
import DevelopmentCreate from '@/views/development/DevelopmentCreate.vue'
import Events from '@/views/event/Events.vue'
import Event from '@/views/event/Event.vue'
import EventEdit from '@/views/event/EventEdit.vue'

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
        {
          path: 'social-assistance/create',
          name: 'create-social-assistance',
          component: SocialAssistanceCreate,
          meta: { requiresAuth: true, permission: 'social-assistance-create' }
        },
        {
          path: 'social-assistance-recipient',
          name: 'social-assistance-recipient',
          component: SocialAssistanceRecipients,
          meta: { requiresAuth: true, permission: 'social-assistance-recipient-list' }
        },
        {
          path: 'social-assistance-recipient/:id',
          name: 'manage-social-assistance-recipient',
          component: SocialAssistanceRecipient,
          meta: { requiresAuth: true, permission: 'social-assistance-recipient-list' }
        },  
        {
          path: 'development',
          name: 'development',
          component: Developments,
          meta: { requiresAuth: true, permission: 'development-list' }
        },
        {
          path: 'development/:id',
          name: 'manage-development',
          component: Development,
          meta: { requiresAuth: true, permission: 'development-list' }
        },  
        {
          path: 'development/edit/:id',
          name: 'edit-development',
          component: DevelopmentEdit,
          meta: { requiresAuth: true, permission: 'development-edit' }
        },
        {
          path: 'development/create',
          name: 'create-development',
          component: DevelopmentCreate,
          meta: { requiresAuth: true, permission: 'development-create' }
        },
        {
          path: 'event',
          name: 'event',
          component: Events,
          meta: { requiresAuth: true, permission: 'event-list' }
        },
        {
          path: 'event/:id',
          name: 'manage-event',
          component: Event,
          meta: { requiresAuth: true, permission: 'event-list' }
        },
        {
          path: 'event/edit/:id',
          name: 'edit-event',
          component: EventEdit,
          meta: { requiresAuth: true, permission: 'event-edit' }
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
