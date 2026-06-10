/*──────────────────────────────────────────────*
 |                                              |
 |    _____  _                                  |
 |   | ____|(_)                                 |
 |   |  _|  | |                                 |
 |   | |___ | |                                 |
 |   |_____|/ |                                 |
 |        |__/                                  |
 |                                              |
 |    🔧 Crafted with 🖤 by Ej                  |
 |    🔗 github.com/Ejay02                      |
 |    🚀 Clean. Scalable. Sharp.                |
 |                                              |
 *──────────────────────────────────────────────*/
export const menuItems = [
  {
    title: "MENU",
    items: [
      {
        icon: "/home.png",
        label: "Home",
        href: "/dashboard",
        visible: ["super_admin", "admin", "teacher", "student", "parent"],
        roleLabels: {
          parent: "Overview",
        },
      },
      {
        icon: "/teacher.png",
        label: "Teachers",
        href: "/teachers",
        visible: ["super_admin", "admin"],
      },
      {
        icon: "/parent.png",
        label: "Parents",
        href: "/parents",
        visible: ["super_admin", "admin", "teacher"],
      },
      {
        icon: "/student.png",
        label: "Students",
        href: "/students",
        visible: ["super_admin", "admin", "teacher"],
      },
      {
        icon: "/class.png",
        label: "Classes",
        href: "/classes",
        visible: ["super_admin", "admin", "teacher"],
      },
      {
        icon: "/subject.png",
        label: "Subjects",
        href: "/subjects",
        visible: ["super_admin", "admin", "teacher", "student", "parent"],
        roleLabels: {
          parent: "Subjects",
        },
      },
      {
        icon: "/lesson.png",
        label: "Lessons",
        href: "/lessons",
        visible: ["super_admin", "admin", "teacher", "student", "parent"],
        roleLabels: {
          parent: "Timetable",
        },
      },
      {
        icon: "/assignment.png",
        label: "Assignments",
        href: "/assignments",
        visible: ["super_admin", "admin", "teacher", "student", "parent"],
        roleLabels: {
          parent: "Schoolwork",
        },
      },
      {
        icon: "/exam.png",
        label: "Exams",
        href: "/exams",
        visible: ["super_admin", "admin", "teacher", "student"],
      },
      {
        icon: "/result.png",
        label: "Results",
        href: "/results",
        visible: ["super_admin", "admin", "teacher", "student", "parent"],
        roleLabels: {
          parent: "Results",
        },
      },
      {
        icon: "/attendance.png",
        label: "Attendance",
        href: "/attendance",
        visible: ["super_admin", "admin", "teacher", "student", "parent"],
        roleLabels: {
          parent: "Attendance",
        },
      },
      {
        icon: "/calendar.png",
        label: "Events",
        href: "/events",
        visible: ["super_admin", "admin", "teacher", "student", "parent"],
        roleLabels: {
          parent: "Calendar",
        },
      },
      {
        icon: "/message.png",
        label: "Messages",
        href: "/messages",
        visible: ["super_admin", "admin", "teacher", "parent"],
      },
      {
        icon: "/announcement.png",
        label: "Announcements",
        href: "/announcements",
        visible: ["super_admin", "admin", "teacher", "student", "parent"],
        roleLabels: {
          parent: "Updates",
        },
      },
    ],
  },
];
