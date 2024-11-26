import { createRouter, createWebHistory } from "vue-router";
import { useUserStore } from "../store/userStore";

import Home from "../views/home.vue";
import Login from "../views/auth/login.vue";
import Signup from "../views/auth/signup.vue";
import NotFound from "../components/notFound.vue";
import Dashboard from "../views/layout/dashboard.vue";
import AdminLayout from "../views/layout/adminLayout.vue";
import ParentLayout from "../views/layout/parentLayout.vue";
import TeacherLayout from "../views/layout/teacherLayout.vue";
import StudentLayout from "../views/layout/studentLayout.vue";
import Teachers from "../components/lists/teachers.vue";
import TeacherView from "../components/lists/teacherView.vue";
import Students from "../components/lists/students.vue";
import StudentView from "../components/lists/studentView.vue";
import Parents from "../components/lists/parents.vue";
import Subjects from "../components/lists/subjects.vue";
import Classes from "../components/lists/classes.vue";
import Lessons from "../components/lists/lessons.vue";
import Exams from "../components/lists/exams.vue";
import Assignments from "../components/lists/assignments.vue";
import Results from "../components/lists/results.vue";
import Events from "../components/lists/events.vue";
import Announcements from "../components/lists/announcements.vue";

// Define public routes that don't require authentication
const publicRoutes = ["Home", "Login", "Signup"];

const routes = [
  // {
  //   path: "/",
  //   name: "Home",
  //   component: Home,
  // },
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
    path: "/",
    name: "Dashboard",
    component: Dashboard,
    meta: { requiresAuth: true },
    children: [
      {
        path: "/dashboard/admin",
        name: "AdminLayout",
        component: AdminLayout,
        meta: { role: "admin" },
      },
      {
        path: "/dashboard/parent",
        name: "ParentLayout",
        component: ParentLayout,
        meta: { role: "parent" },
      },
      {
        path: "/dashboard/student",
        name: "StudentLayout",
        component: StudentLayout,
        meta: { role: "student" },
      },
      {
        path: "/dashboard/teacher",
        name: "TeacherLayout",
        component: TeacherLayout,
        meta: { role: "teacher" },
      },
      {
        path: "/list/teachers",
        name: "Teachers",
        component: Teachers,
      },
      {
        path: "/list/teachers/:id",
        name: "TeacherView",
        component: TeacherView,
      },
      {
        path: "/list/students",
        name: "Students",
        component: Students,
      },
      {
        path: "/list/students/:id",
        name: "StudentView",
        component: StudentView,
      },
      {
        path: "/list/parents",
        name: "Parents",
        component: Parents,
      },
      {
        path: "/list/subjects",
        name: "Subjects",
        component: Subjects,
      },
      {
        path: "/list/classes",
        name: "Classes",
        component: Classes,
      },
      {
        path: "/list/lessons",
        name: "Lessons",
        component: Lessons,
      },
      {
        path: "/list/exams",
        name: "Exams",
        component: Exams,
      },
      {
        path: "/list/assignments",
        name: "Assignments",
        component: Assignments,
      },
      {
        path: "/list/results",
        name: "Results",
        component: Results,
      },
      {
        path: "/list/events",
        name: "Events",
        component: Events,
      },
      {
        path: "/list/announcements",
        name: "Announcements",
        component: Announcements,
      },
    ],
  },

  {
    path: "/:catchAll(.*)",
    name: "NotFound",
    component: NotFound,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return { top: 0 };
  },
});

// Navigation guard
router.beforeEach((to, from, next) => {
  const userStore = useUserStore();
  const isAuthenticated = userStore.userInfo.id !== null; // Assuming null id means not authenticated
  const requiredRole = to.meta.role;
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);

  // Allow access to public routes
  if (publicRoutes.includes(to.name)) {
    // If user is already authenticated and tries to access login/signup, redirect to dashboard
    if (isAuthenticated && (to.name === "Login" || to.name === "Signup")) {
      const userRole = userStore.currentRole;
      next(`/dashboard/${userRole.toLowerCase()}`);
    } else {
      next();
    }
    return;
  }

  // Handle protected routes
  if (requiresAuth) {
    // if (!isAuthenticated) {
    //   // Redirect to login if not authenticated
    //   next({ name: "Login" });
    //   return;
    // }

    if (requiredRole) {
      // Check if user has the required role
      if (userStore.currentRole === requiredRole) {
        next();
      } else {
        // Redirect to appropriate dashboard based on user's role
        next(`/dashboard/${userStore.currentRole.toLowerCase()}`);
      }
      return;
    }
  }

  next();
});

export default router;
