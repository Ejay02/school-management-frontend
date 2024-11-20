import { createRouter, createWebHistory } from "vue-router";

import Home from "../views/home.vue";
import Login from "../views/auth/login.vue";
import Signup from "../views/auth/signup.vue";
import NotFound from "../components/notFound.vue";
import AdminLayout from "../views/layout/adminLayout.vue";
import ParentLayout from "../views/layout/parentLayout.vue";
import TeacherLayout from "../views/layout/teacherLayout.vue";
import StudentLayout from "../views/layout/studentLayout.vue";
import DashboardLayout from "../views/layout/dashboardLayout.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/signup",
    name: "Signup",
    component: Signup,
  },
  {
    path: "/layout",
    name: "DashboardLayout",
    component: DashboardLayout,
    children: [
      {
        path: "/layout/admin",
        name: "AdminLayout",
        component: AdminLayout,
      },
      {
        path: "/layout/parent",
        name: "ParentLayout",
        component: ParentLayout,
      },
      {
        path: "/layout/student",
        name: "StudentLayout",
        component: StudentLayout,
      },
      {
        path: "/layout/teacher",
        name: "TeacherLayout",
        component: TeacherLayout,
      },
    ],
  },

  {
    path: "/student",
    name: "StudentLayout",
    component: StudentLayout,
  },
  {
    // path: "*",
    path: "/:catchAll(.*)",
    name: "NotFound",
    component: NotFound,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  // eslint-disable-next-line no-unused-vars
  scrollBehavior(to, from, savedPosition) {
    return { top: 0 };
  },
});

export default router;
