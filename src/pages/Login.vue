<template>
  <div class="h-screen">
    <div class="w-5/12 mx-auto relative top-2/4 login-logo">
      <img src="/logo.svg" alt="DaftDoris" class="w-full dark:invert" />
      <List>
        <template v-for="(provider, index) in loginProviderList" :key="index">
          <ListItem>
            <Button
              class="btn border border-black text-black flex items-center mx-auto w-fit rounded-lg"
              @click="events.onClickLogin(provider.provider, provider.name)"
            >
              Login <ArrowCircleRightIcon class="h-8 w-8 pl-2" />
            </Button>
          </ListItem>
        </template>
      </List>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { Nullable } from '@/types/base'
import { GoogleAuthProvider, GithubAuthProvider, AuthProvider } from 'firebase/auth'
import { useAuthStore } from '@/store/auth'
import { useRouter } from 'vue-router'
import { ArrowCircleRightIcon } from "@heroicons/vue/outline"

import Button from '@/components/atoms/Button.vue'
import List from '@/components/atoms/List.vue'
import ListItem from '@/components/atoms/ListItem.vue'
import { Provider } from '@/types/auth'

interface LoginProvider {
  name: Provider
  provider: AuthProvider
}

const btnRef = ref<Nullable<HTMLElement>>(null)
const { loginWithFirebase } = useAuthStore()
const router = useRouter()

const loginProviderList: LoginProvider[] = [
  {
    name: 'Google',
    provider: new GoogleAuthProvider(),
  },
]

const events = {
  async onClickLogin (provider: AuthProvider, name: Provider) {
    await loginWithFirebase(provider, name)
    localStorage.setItem('provider', name)
    await router.push('/')
  },
}
</script>

<style scoped lang="scss">
.login-logo {
  transform: translatey(-50%);
  button {
    color: black !important;
    border-radius: 0.6rem;
    padding: 4px 12px !important;
  }
}
</style>
