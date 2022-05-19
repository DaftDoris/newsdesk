import { useAuthStore } from "@/store/auth"
import { NavigationGuardNext, RouteLocationNormalized } from "vue-router"
import { storeToRefs } from "pinia"

export function useAuthentication() {
  return {
    async beforeEnter(
      to: RouteLocationNormalized,
      after: RouteLocationNormalized,
      next: NavigationGuardNext,
    ) {
      const authStore = useAuthStore()

      await authStore.checkAuth()
      const { isAuthenticated } = storeToRefs(authStore)
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
