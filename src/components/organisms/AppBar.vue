<template>
  <header v-if="isAuthenticated" v-bind="$attrs">
    <div
      class="mx-auto w-full sm:flex block sm:justify-between items-center py-2"
    >
      <div
        class="text-2xl font-bold flex items-center dark:text-gray-50 transition-colors w-full"
      >
        <img
          src="/logo.svg"
          alt="News Desk Daft Doris"
          class="h-12 dark:invert mx-auto sm:mx-0 sm:pl-1 mb-1 sm:mb-0"
        />
      </div>
      <div
        class="block sm:flex sm:ml-0 mb-1 sm:mb-0 sm:mr-10"
        v-if="routeName !== 'SelectPodcast'"
      >
        <Menu
          as="div"
          v-slot="{ open }"
          class="relative inline-block text-left w-56 sm:w-52 menu-show left-2/4 sm:left-0"
        >
          <div>
            <MenuButton
              class="inline-flex whitespace-nowrap justify-between w-full items-center rounded-lg border border-black shadow-sm px-2 py-1 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500"
            >
              {{
                store.getPodcasts.filter(
                  (podcast) => podcast.id === route.params.podcastId,
                )[0]?.name || "select a podcast"
              }}
              <ArrowCircleDownIcon
                v-if="!open"
                class="-mr-1 ml-2 h-6 w-6"
                aria-hidden="true"
              />
              <ArrowCircleUpIcon
                v-if="open"
                class="-mr-1 ml-2 h-6 w-6"
                aria-hidden="true"
              />
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
              class="origin-top-right absolute left-0 mt-2 sm:w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
            >
              <div class="py-1">
                <MenuItem
                  v-slot="{ active }"
                  v-for="podcast in store.getPodcasts"
                  :key="podcast.id"
                >
                  <a
                    :href="`#${podcast.id}`"
                    :class="[
                      active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                      'block px-4 py-2 text-sm',
                    ]"
                    >{{ podcast.name }}</a
                  >
                </MenuItem>
              </div>
            </MenuItems>
          </transition>
        </Menu>
        <div
          class="date-input sm:ml-2 sm:mt-0 mt-1 w-56 sm:w-36 mx-auto sm:mx-0"
        >
          <input
            class="inline-flex justify-between w-full items-center rounded-lg border border-black shadow-sm px-2 py-1 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500"
            type="date"
            v-model="date"
          />
        </div>
      </div>
      <div v-else class="flex items-center mr-10">
        <button
          id="darklight"
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
          id="logout"
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
import { computed, ref } from "vue"
import { useRoute, useRouter } from "vue-router"
import { useAuthStore } from "@/store/auth"
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/vue"
import { ArrowCircleDownIcon,ArrowCircleUpIcon, MoonIcon, SunIcon } from "@heroicons/vue/outline"
import { usePodcastStore } from "@/store/podcasts"
import { useDark, useToggle } from "@vueuse/core"

const authStore = useAuthStore()
const route = useRoute()
const router = useRouter()
const store = usePodcastStore()
const date = new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split("T")[0]
const title = computed(() => route.meta.title || "Home")
const routeName = computed(() => route.name)
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
  @apply ss-furniture;
  // px-4 py-4 justify-between sticky top-0 left-0 right-0 z-10 bg-white dark:bg-gray-800 transition-all outline-none border-none;
}
.round-btn {
  @apply w-10 h-10 rounded-full;
}
.date-input input::-webkit-calendar-picker-indicator {
  background: url("/arrow-down-circle.svg") center/110% no-repeat;
  opacity: 1;
}
@media (max-width: 640px) {
  .menu-show {
    transform: translateX(-50%);
  }
}
</style>
