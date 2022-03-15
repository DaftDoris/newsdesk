import { useAuthStore } from '@/store/auth'
import { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { storeToRefs } from 'pinia'
import { Provider } from '@/types/auth'
import useStorage from '@/hooks/useStorage'

export function useAuthentication () {
  return {
    async beforeEnter (before: RouteLocationNormalized, after: RouteLocationNormalized, next: NavigationGuardNext) {
      const authStore = useAuthStore()
      const { getPersistenceFirebaseUser } = useAuthStore()
      const { localStorage } = useStorage()
      const { isAuthenticated } = storeToRefs(authStore)

      const providedBy = localStorage.getItem<Provider>('provider')
      let success = false

      try {
        if (providedBy === 'Google' || providedBy === 'Github') {
          success = await getPersistenceFirebaseUser(providedBy)
        }
      } catch {
        next('/auth/login')
      }


      if (isAuthenticated.value) {
        next()
      } else {
        next('/auth/login')
      }
    }
  }
}
