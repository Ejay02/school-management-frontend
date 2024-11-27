<template>
  <div class="flex-1 p-4 flex flex-col md:flex-row gap-4">
    <div class="w-full md:w-2/3">
      <LeftSingleView
        :heading="`Teacher's Schedule`"
        :infoCards="teacherInfoCards"
        :profileImage="'https://images.pexels.com/photos/2888150/pexels-photo-2888150.jpeg?auto=compress&cs=tinysrgb&w=1200'"
        :name="'Didi Gobbler'"
        :description="'Lorem ipsum dolor sit amet consectetur adipisicing elit. Nam, accusantium?'"
        :details="teacherDetails"
      />
    </div>
    <div class="w-full md:w-1/3">
      <RightSingleView :shortcuts="teacherShortcuts" />
    </div>
  </div>
</template>

<script setup>
import LeftSingleView from "../../views/singleView/leftSingleView.vue";
import RightSingleView from "../../views/singleView/rightSingleView.vue";

const teacherShortcuts = [
  {
    text: "Teacher's Classes",
    link: "/list/classes",
    color: "bg-eduSkyLight",
  },
  {
    text: "Teacher's Students",
    link: "/list/students",
    color: "bg-eduPurpleLight",
  },
  {
    text: "Teacher's Lessons",
    link: "/list/lessons",
    color: "bg-eduYellowLight",
  },
  {
    text: "Teacher's Exams",
    link: "/list/exams",
    color: "bg-pink-50",
  },
  {
    text: "Teacher's Assignments",
    link: "/list/assignments",
    color: "bg-eduSky",
  },
];

const teacherInfoCards = [
  {
    icon: `/singleAttendance.png`,
    value: "90%",
    title: "Attendance",
  },
  {
    icon: "/singleBranch.png",
    value: "9",
    title: "Branches",
  },
  {
    icon: "/singleLesson.png",
    value: "5",
    title: "Lessons",
  },
  {
    icon: "/singleClass.png",
    value: "6",
    title: "Classes",
  },
];

const teacherDetails = [
  { icon: "/blood.png", label: "Blood Group", value: "A+" },
  { icon: "/date.png", label: "Date", value: "January 2025" },
  { icon: "/mail.png", label: "Email", value: "dgobbler@test.com" },
  { icon: "/phone.png", label: "Phone", value: "1234560" },
];
</script>

<style scoped></style>
