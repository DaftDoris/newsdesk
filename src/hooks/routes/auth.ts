import { useAuthStore } from "@/store/auth"
import { NavigationGuardNext, RouteLocationNormalized } from "vue-router"
import { storeToRefs } from "pinia"
import { Provider } from "@/types/auth"

export function useAuthentication() {
  return {
    async beforeEnter(
      to: RouteLocationNormalized,
      after: RouteLocationNormalized,
      next: NavigationGuardNext,
    ) {
      const authStore = useAuthStore()
      const { getPersistenceFirebaseUser } = useAuthStore()
      const { isAuthenticated } = storeToRefs(authStore)
      try {
        await getPersistenceFirebaseUser(<Provider>"Google")
      } catch {
        next("/auth/login")
      }
      if (to.meta.requiresAuth) {
        if (isAuthenticated.value) {
          next()
        } else {
          next("/auth/login")
        }
      }
      if (to.meta.requiresVisitor) {
        if (isAuthenticated.value) {
          return next("/")
        }
        next()
      }
    },
  }
}
