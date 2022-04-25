import { createWebHashHistory, createRouter, RouteRecordRaw } from "vue-router"

//  Layouts
import defaultLayout from "@/layouts/default.vue"
import authenticatedLayout from "@/layouts/authenticated.vue"

//  Pages
import Home from "@/pages/Home.vue"
import SelectPodcast from "@/pages/SelectPodcast.vue"
import Login from "@/pages/Login.vue"
import { useAuthentication } from "@/hooks/routes/auth"

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "Home",
    component: authenticatedLayout,
    children: [
      {
        path: "",
        component: SelectPodcast,
        meta: { title: "Daft Doris" },
      },
      {
        path: ":podcastId",
        component: Home,
        meta: { title: "Daft Doris" },
        props: true,
      },
    ],
    ...useAuthentication(),
  },
  {
    path: "/auth",
    name: "Auth",
    component: defaultLayout,
    children: [
      {
        path: "Login",
        component: Login,
      },
    ],
  },
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
})
