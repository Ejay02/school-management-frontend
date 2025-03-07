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

import Settings from "../views/settings.vue";
import Exams from "../components/exams/exams.vue";
import Events from "../components/events/events.vue";
import Classes from "../components/classes/classes.vue";
import Parents from "../components/parents/parents.vue";
import Results from "../components/results/results.vue";
import Lessons from "../components/lessons/lessons.vue";
import Teachers from "../components/teacher/teachers.vue";
import Subjects from "../components/subjects/subjects.vue";
import Students from "../components/students/students.vue";
import TeacherView from "../components/teacher/teacherView.vue";
import StudentView from "../components/students/studentView.vue";
import Assignments from "../components/assignments/assignments.vue";
import Announcements from "../components/announcements/announcements.vue";
import Messages from "../components/messages/messages.vue";
import Admissions from "../views/infoPages/admissions.vue";
import Calender from "../views/infoPages/calender.vue";
import Contact from "../views/infoPages/contact.vue";
import Academics from "../views/infoPages/academics.vue";
import About from "../views/infoPages/about.vue";
import ProfileSetting from "../components/settingsComponents/profileSetting.vue";
import NotificationSetting from "../components/settingsComponents/notificationSetting.vue";
import BillingSetting from "../components/settingsComponents/billingSetting.vue";
import TeamSetting from "../components/settingsComponents/teamSetting.vue";
import IntegrationSetting from "../components/settingsComponents/integrationSetting.vue";
import Attendance from "../components/attendance/attendance.vue";
import EventView from "../components/events/eventView.vue";

const publicRoutes = [
  "Home",
  "Login",
  "Signup",
  "About",
  "Academics",
  "Admissions",
  "Contact",
  "Calender",
];

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
    path: "/about",
    name: "About",
    component: About,
  },
  {
    path: "/academics",
    name: "Academics",
    component: Academics,
  },
  {
    path: "/admissions",
    name: "Admissions",
    component: Admissions,
  },
  {
    path: "/contact",
    name: "Contact",
    component: Contact,
  },
  {
    path: "/calender",
    name: "Calender",
    component: Calender,
  },

  {
    path: "/dashboard",
    name: "Dashboard",
    component: Dashboard,
    meta: { requiresAuth: true },
    children: [
      {
        path: "/dashboard/admin",
        name: "AdminLayout",
        component: AdminLayout,
        meta: { role: ["admin", "super_admin"] },
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
        path: "/teachers",
        name: "Teachers",
        component: Teachers,
      },
      {
        path: "/teacher/:id",
        name: "TeacherView",
        component: TeacherView,
      },
      {
        path: "/students",
        name: "Students",
        component: Students,
      },
      {
        path: "/student/:id",
        name: "StudentView",
        component: StudentView,
      },
      {
        path: "/parents",
        name: "Parents",
        component: Parents,
      },
      {
        path: "/subjects",
        name: "Subjects",
        component: Subjects,
      },
      {
        path: "/classes",
        name: "Classes",
        component: Classes,
      },
      {
        path: "/lessons",
        name: "Lessons",
        component: Lessons,
      },
      {
        path: "/exams",
        name: "Exams",
        component: Exams,
      },
      {
        path: "/assignments",
        name: "Assignments",
        component: Assignments,
      },
      {
        path: "/results",
        name: "Results",
        component: Results,
      },

      {
        path: "/events",
        name: "Events",
        component: Events,
      },
      {
        path: "/event/:id",
        name: "EventView",
        component: EventView,
      },
      {
        path: "/messages",
        name: "Messages",
        component: Messages,
      },
      {
        path: "/announcements",
        name: "Announcements",
        component: Announcements,
      },
      {
        path: "/attendance",
        name: "Attendance",
        component: Attendance,
      },
      {
        path: "/settings",
        name: "Settings",
        component: Settings,
        children: [
          {
            path: "profile",
            name: "profile",
            component: ProfileSetting,
          },
          {
            path: "notifications",
            name: "notifications",
            component: NotificationSetting,
          },
          {
            path: "billing",
            name: "billing",
            component: BillingSetting,
          },
          {
            path: "team",
            name: "team",
            component: TeamSetting,
          },
          {
            path: "integrations",
            name: "integrations",
            component: IntegrationSetting,
          },
        ],
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
    if (savedPosition) {
      return savedPosition;
    } else {
      // Otherwise, scroll to a specific position (or top-left)
      return { left: 0, top: 0 };
    }
  },
});

router.beforeEach((to, from, next) => {
  const userStore = useUserStore();
  const userRole = userStore.currentRole?.toLowerCase();

  const token = userStore.userInfo.token;

  const isAuthenticated = !!token;

  // Check if route requires authentication
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);

  // If route is public, allow access
  if (publicRoutes.includes(to.name)) {
    return next();
  }

  // If requires auth and not authenticated
  if (requiresAuth && !isAuthenticated) {
    return next("/login");
  }

  // If authenticated and trying to access login/signup
  if (isAuthenticated && ["Login", "Signup"].includes(to.name)) {
    return next("/dashboard");
  }

  // Check role requirements for all matched route segments
  const hasValidRole = to.matched.every((record) => {
    if (!record.meta.role) return true;
    return record.meta.role.includes(userRole);
  });

  if (!hasValidRole) {
    return next("/dashboard");
  }

  // If no other conditions matched, allow navigation
  next();
});

export default router;
