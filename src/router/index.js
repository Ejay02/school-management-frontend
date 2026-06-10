import { createRouter, createWebHistory } from "vue-router";
import { useUserStore } from "../store/userStore";

import NotFound from "../components/notFound.vue";
import Login from "../views/auth/login.vue";
import Signup from "../views/auth/signup.vue";
import AcceptInvite from "../views/auth/acceptInvite.vue";
import Home from "../views/home.vue";
import AdminLayout from "../views/layout/adminLayout.vue";
import Dashboard from "../views/layout/dashboard.vue";
import ParentLayout from "../views/layout/parentLayout.vue";
import StudentLayout from "../views/layout/studentLayout.vue";
import TeacherLayout from "../views/layout/teacherLayout.vue";

import Announcements from "../components/announcements/announcements.vue";
import AnnouncementView from "../components/announcements/announcementView.vue";
import Assignments from "../components/assignments/assignments.vue";
import Attendance from "../components/attendance/attendance.vue";
import Classes from "../components/classes/classes.vue";
import Events from "../components/events/events.vue";
import EventView from "../components/events/eventView.vue";
import ExamForm from "../components/exams/examForm.vue";
import Exams from "../components/exams/exams.vue";
import ExamView from "../components/exams/examView.vue";
import Lessons from "../components/lessons/lessons.vue";
import Messages from "../components/messages/messages.vue";
import Parents from "../components/parents/parents.vue";
import Results from "../components/results/results.vue";
import BillingSetting from "../components/settingsComponents/billingSetting.vue";
import IntegrationSetting from "../components/settingsComponents/integrationSetting.vue";
import NotificationSetting from "../components/settingsComponents/notificationSetting.vue";
import ProfileSetting from "../components/settingscomponents/profileSetting.vue";
import SchoolSetting from "../components/settingsComponents/schoolSetting.vue";
import TeamSetting from "../components/settingsComponents/teamSetting.vue";
import AuditLogSetting from "../components/settingsComponents/auditLogSetting.vue";
import Students from "../components/students/students.vue";
import StudentView from "../components/students/studentView.vue";
import Subjects from "../components/subjects/subjects.vue";
import Teachers from "../components/teacher/teachers.vue";
import TeacherView from "../components/teacher/teacherView.vue";
import About from "../views/infoPages/about.vue";
import Academics from "../views/infoPages/academics.vue";
import Admissions from "../views/infoPages/admissions.vue";
import Calender from "../views/infoPages/calender.vue";
import Contact from "../views/infoPages/contact.vue";
import Settings from "../views/settings.vue";

const publicRoutes = [
  "Home",
  "Login",
  "Signup",
  "AcceptInvite",
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
    path: "/accept-invite",
    name: "AcceptInvite",
    component: AcceptInvite,
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
        meta: { role: ["admin", "super_admin"] },
      },
      {
        path: "/teacher/:id",
        name: "TeacherView",
        component: TeacherView,
        meta: { role: ["admin", "super_admin"] },
      },
      {
        path: "/students",
        name: "Students",
        component: Students,
        meta: { role: ["admin", "super_admin", "teacher"] },
      },
      {
        path: "/student/:id",
        name: "StudentView",
        component: StudentView,
        meta: { role: ["admin", "super_admin", "teacher"] },
      },
      {
        path: "/parents",
        name: "Parents",
        component: Parents,
        meta: { role: ["admin", "super_admin", "teacher"] },
      },
      {
        path: "/subjects",
        name: "Subjects",
        component: Subjects,
        meta: {
          role: ["admin", "super_admin", "teacher", "student", "parent"],
        },
      },
      {
        path: "/classes",
        name: "Classes",
        component: Classes,
        meta: { role: ["admin", "super_admin", "teacher"] },
      },
      {
        path: "/lessons",
        name: "Lessons",
        component: Lessons,
        meta: {
          role: ["admin", "super_admin", "teacher", "student", "parent"],
        },
      },

      {
        path: "/lesson/:id",
        name: "lesson-view",
        component: () => import("../components/lessons/lessonView.vue"),
        meta: {
          requiresAuth: true,
          role: ["admin", "super_admin", "teacher", "student", "parent"],
        },
      },
      {
        path: "lesson/new",
        name: "AddLesson",
        component: () => import("../components/lessons/lessonForm.vue"),
        meta: { requiresAuth: true, role: ["admin", "super_admin", "teacher"] },
      },
      {
        path: "lesson/edit/:id",
        name: "EditLesson",
        component: () => import("../components/lessons/lessonForm.vue"),
        meta: { requiresAuth: true, role: ["admin", "super_admin", "teacher"] },
      },
      {
        path: "/exams",
        name: "Exams",
        component: Exams,
        meta: { role: ["admin", "super_admin", "teacher", "student"] },
      },
      {
        path: "exam/new",
        name: "CreateExam",
        component: ExamForm,
        meta: { requiresAuth: true, role: ["admin", "super_admin", "teacher"] },
      },
      {
        path: "exam/:id/edit",
        name: "EditExam",
        component: ExamForm,
        meta: { requiresAuth: true, role: ["admin", "super_admin", "teacher"] },
      },
      {
        path: "/exams/:id",
        name: "ExamView",
        component: ExamView,
        meta: {
          requiresAuth: true,
          role: ["admin", "super_admin", "teacher", "student"],
        },
      },
      {
        path: "/assignments",
        name: "Assignments",
        component: Assignments,
        meta: {
          role: ["admin", "super_admin", "teacher", "student", "parent"],
        },
      },
      {
        path: "/submissions",
        name: "Submissions",
        component: () => import("../components/submissions/submissions.vue"),
        meta: {
          role: ["teacher"],
        },
      },
      {
        path: "/assignment/:id",
        name: "AssignmentView",
        component: () => import("../components/assignments/assignmentView.vue"),
        meta: {
          requiresAuth: true,
          role: ["admin", "super_admin", "teacher", "student", "parent"],
        },
      },
      {
        path: "assignment/new",
        name: "CreateAssignment",
        component: () => import("../components/assignments/assignmentForm.vue"),
        meta: { requiresAuth: true, role: ["admin", "super_admin", "teacher"] },
      },
      {
        path: "assignment/:id/edit",
        name: "EditAssignment",
        component: () => import("../components/assignments/assignmentForm.vue"),
        meta: { requiresAuth: true, role: ["admin", "super_admin", "teacher"] },
      },
      {
        path: "/results",
        name: "Results",
        component: Results,
        meta: {
          role: ["admin", "super_admin", "teacher", "student", "parent"],
        },
      },

      {
        path: "/events",
        name: "Events",
        component: Events,
        meta: {
          role: ["admin", "super_admin", "teacher", "student", "parent"],
        },
      },
      {
        path: "/event/:id",
        name: "EventView",
        component: EventView,
        meta: {
          role: ["admin", "super_admin", "teacher", "student", "parent"],
        },
      },
      {
        path: "/events/edit/:id",
        name: "EditEvent",
        component: () => import("../components/events/eventForm.vue"),
        meta: { role: ["admin", "super_admin", "teacher"] },
      },
      {
        path: "/messages",
        name: "Messages",
        component: Messages,
        meta: {
          role: ["admin", "super_admin", "teacher", "parent"],
        },
      },
      {
        path: "/announcements",
        name: "Announcements",
        component: Announcements,
        meta: {
          role: ["admin", "super_admin", "teacher", "student", "parent"],
        },
      },
      {
        path: "/announcement/:id",
        name: "AnnouncementView",
        component: AnnouncementView,
        meta: {
          requiresAuth: true,
          role: ["admin", "super_admin", "teacher", "student", "parent"],
        },
      },
      {
        path: "/attendance",
        name: "Attendance",
        component: Attendance,
        meta: {
          requiresAuth: true,
          role: ["admin", "super_admin", "teacher", "student", "parent"],
        },
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
            meta: {
              role: ["admin", "super_admin", "teacher", "student", "parent"],
            },
          },
          {
            path: "notifications",
            name: "notifications",
            component: NotificationSetting,
            meta: {
              role: ["admin", "super_admin", "teacher", "student", "parent"],
            },
          },
          {
            path: "billing",
            name: "billing",
            component: BillingSetting,
            meta: { role: ["admin", "super_admin", "parent"] },
          },
          {
            path: "team",
            name: "team",
            component: TeamSetting,
            meta: { role: ["admin", "super_admin", "teacher"] },
          },
          {
            path: "school",
            name: "school",
            component: SchoolSetting,
            meta: { role: ["admin", "super_admin"] },
          },
          {
            path: "activity-log",
            name: "activity-log",
            component: AuditLogSetting,
            meta: { role: ["admin", "super_admin"] },
          },
          {
            path: "integrations",
            name: "integrations",
            component: IntegrationSetting,
            meta: {
              role: ["admin", "super_admin"],
            },
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
  const userRole = String(
    userStore.currentRole || userStore.userInfo?.role || "",
  ).toLowerCase();

  const token = String(
    userStore.userInfo?.token || localStorage.getItem("token") || "",
  );

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

  const isProfileCompletionRoute =
    to.path === "/settings/profile" || to.path === "/settings";

  if (
    isAuthenticated &&
    userStore.requiresProfileCompletion &&
    !isProfileCompletionRoute
  ) {
    return next("/settings/profile");
  }

  // Check role requirements for all matched route segments
  const hasValidRole = to.matched.every((record) => {
    if (!record.meta.role) return true;
    if (Array.isArray(record.meta.role)) {
      return record.meta.role.includes(userRole);
    }
    if (typeof record.meta.role === "string") {
      return record.meta.role === userRole;
    }
    return true;
  });

  if (!hasValidRole) {
    return next("/dashboard");
  }

  // If no other conditions matched, allow navigation
  next();
});

export default router;
