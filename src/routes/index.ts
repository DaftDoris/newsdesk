import { createWebHistory, createRouter, RouteRecordRaw } from 'vue-router'

//  Layouts
import defaultLayout from '@/layouts/default.vue'
import authenticatedLayout from '@/layouts/authenticated.vue'

//  Pages
import Home from "@/pages/Home.vue";
import Login from "@/pages/Login.vue";
import { useAuthentication } from '@/hooks/routes/auth'

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "Home",
    component: authenticatedLayout,
    children: [
      {
        path: "",
        component: Home,
        meta: { title: "Daft Doris" },
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
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return { top: 0 }
  },
})
