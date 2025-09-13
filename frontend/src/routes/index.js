//import vue router
import { createRouter, createWebHistory } from "vue-router";

//import js cookies
import Cookie from "js-cookie";

// Utility to get the token
const getToken = () => Cookie.get("token");

//define a routes
const routes = [
  {
    path: "/",
    component: () => import("../../pages/default.vue"),
    children: [
      {
        path: "",
        redirect: { name: "dashboard" },
      },
      {
        path: "admin/dashboard",
        name: "dashboard",
        component: () => import("../views/admin/dashboard/index.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "admin/cart",
        name: "cart",
        component: () => import("../views/admin/cart/index.vue"),
        meta: { requiresAuth: true },
      },
      // Tambahkan child lain di sini jika perlu
    ],
  },
  {
    path: "/login",
    name: "login",
    component: () => import("../views/auth/login.vue"),
  },
];

//create router
const router = createRouter({
  history: createWebHistory(),
  routes, // <-- routes,
});

// Global navigation guard
router.beforeEach((to, from, next) => {
  // Ambil token otentikasi pengguna
  const token = getToken();

  // Jika rute tujuan membutuhkan otentikasi dan pengguna tidak memiliki token
  if (to.matched.some((record) => record.meta.requiresAuth) && !token) {
    // Alihkan pengguna ke halaman login
    next({ name: "login" });
  }
  // Jika rute tujuan adalah halaman login atau register dan pengguna sudah login
  else if ((to.name === "login" || to.name === "register") && token) {
    // Alihkan pengguna ke halaman dashboard
    next({ name: "dashboard" });
  }
  // Jika tidak ada kondisi khusus, izinkan navigasi ke rute tujuan
  else {
    next();
  }
});

export default router;
