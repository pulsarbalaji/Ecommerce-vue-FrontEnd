import { createRouter, createWebHistory } from "vue-router";
import Login from "../pages/Login.vue";
import ForgotPassword from "../pages/ForgotPassword.vue";
import ResetPassword from "../pages/ResetPassword.vue";

const routes = [
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/forgot-password",
    name: "ForgotPassword",
    component: ForgotPassword,
  },
  {
    path: "/reset-password/:uid/:token",   // <-- dynamic route
    name: "ResetPassword",
    component: ResetPassword,
    props: true, // makes uid & token available as props
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
