import { useAuthStore } from "@/store/auth"
import { NavigationGuardNext, RouteLocationNormalized } from "vue-router"
import { storeToRefs } from "pinia"
import { Provider } from "@/types/auth"

export function useAuthentication() {
  return {
    async beforeEnter(
      before: RouteLocationNormalized,
      after: RouteLocationNormalized,
      next: NavigationGuardNext,
    ) {
      const authStore = useAuthStore()
      const { getPersistenceFirebaseUser } = useAuthStore()
      const { isAuthenticated } = storeToRefs(authStore)

      let success = false

      try {
        success = await getPersistenceFirebaseUser(<Provider>"Google")
      } catch {
        next("/auth/login")
      }

      if (isAuthenticated.value) {
        next()
      } else {
        next("/auth/login")
      }
    },
  }
}
