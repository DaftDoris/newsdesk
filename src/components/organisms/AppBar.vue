<template>
  <header v-if="isAuthenticated" v-bind="$attrs">
    <div class="mx-auto w-full flex justify-between">
      <div
        class="text-2xl font-bold flex items-center dark:text-gray-50 transition-colors"
      >
        {{ title }}
      </div>
      <Menu as="div" class="relative inline-block text-left">
        <div>
          <MenuButton
            class="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500"
          >
            Smart Seven 🇬🇧
            <ChevronDownIcon class="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />
          </MenuButton>
        </div>

        <transition
          enter-active-class="transition ease-out duration-100"
          enter-from-class="transform opacity-0 scale-95"
          enter-to-class="transform opacity-100 scale-100"
          leave-active-class="transition ease-in duration-75"
          leave-from-class="transform opacity-100 scale-100"
          leave-to-class="transform opacity-0 scale-95"
        >
          <MenuItems
            class="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
          >
            <div class="py-1">
              <MenuItem v-slot="{ active }">
                <a
                  href="#"
                  :class="[
                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                    'block px-4 py-2 text-sm',
                  ]"
                  >Smart Seven 🇬🇧</a
                >
              </MenuItem>
              <MenuItem v-slot="{ active }">
                <a
                  href="#"
                  :class="[
                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                    'block px-4 py-2 text-sm',
                  ]"
                  >Smart Seven Ireland 🇮🇪</a
                >
              </MenuItem>
              <MenuItem v-slot="{ active }">
                <a
                  href="#"
                  :class="[
                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                    'block px-4 py-2 text-sm',
                  ]"
                  >Another podcast 🤖</a
                >
              </MenuItem>
            </div>
          </MenuItems>
        </transition>
      </Menu>
      <div class="flex items-center">
        <button
          type="button"
          class="round-btn mr-2 px-1 py-1"
          @click.prevent.stop="events.onClickToggleDarkMode"
        >
          <transition mode="out-in" name="fade">
            <MoonIcon
              v-if="isDarkMode"
              class="dark:text-white bg-transparent transition-colors"
            />
            <SunIcon
              v-else
              class="dark:text-white bg-transparent transition-colors"
            />
          </transition>
        </button>
        <button
          v-ripple
          type="button"
          class="round-btn"
          @click="events.onClickProfile"
        >
          <img
            class="rounded-full shadow-lg"
            alt="profile image"
            :src="user?.thumbnailImage"
          />
        </button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { useRoute, useRouter } from "vue-router"
import { useDark, useToggle } from "@vueuse/core"
import { useAuthStore } from "@/store/auth"
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/vue"
import {
  ChevronDownIcon,
  MoonIcon,
  SunIcon,
} from "@heroicons/vue/outline"

const authStore = useAuthStore()
const route = useRoute()
const router = useRouter()

const title = computed(() => route.meta.title || "Home")
const user = computed(() => authStore.user)
const isAuthenticated = computed(() => authStore.isAuthenticated)

const isDarkMode = useDark()
const toggleDarkMode = useToggle(isDarkMode)

const events = {
  async onClickProfile() {
    await authStore.logout()
    await router.push("/auth/login")
  },
  onClickToggleDarkMode() {
    toggleDarkMode()
  },
}
</script>

<style scoped lang="scss">
header {
  @apply px-4 py-4 flex justify-between sticky top-0 left-0 right-0 z-10 bg-white dark:bg-gray-800 transition-all outline-none border-none;
}
.round-btn {
  @apply w-10 h-10 rounded-full;
}
</style>
