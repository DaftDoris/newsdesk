import { createApp } from 'vue'
import { router } from '@/routes'
import { createPinia } from 'pinia'
import { createRippleDirective } from 'vue-create-ripple'

import App from './App.vue'

import '@/plugins/firebase'

import "@/assets/styles/tailwind.scss";
import "@/assets/styles/main.scss";

const app = createApp(App)
  .directive(
    "ripple",
    createRippleDirective({
      class: "bg-black opacity-30",
    })
  )
  .use(createPinia())
  .use(router)
  .mount("#app");
