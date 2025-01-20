<template>
  <div class="rounded border border-gray-300 p-2 w-full">
    <div class="flex-1 flex flex-col md:flex-row gap-4">
      <div class="w-full md:w-2/3">
        <LeftSingleView
          :heading="`Student's Schedule`"
          :infoCards="studentInfoCards"
          :profileImage="'https://images.pexels.com/photos/1102341/pexels-photo-1102341.jpeg?auto=compress&cs=tinysrgb&w=1200'"
          :name="'Rain Xazi'"
          :description="'Lorem ipsum dolor sit amet consectetur adipisicing elit. Nam, accusantium?'"
          :details="studentDetails"
        />
      </div>
      <div class="w-full md:w-1/3">
        <RightSingleView :shortcuts="studentShortcuts" />
      </div>
    </div>
  </div>
</template>

<script setup>
import LeftSingleView from "../../views/singleView/leftSingleView.vue";
import RightSingleView from "../../views/singleView/rightSingleView.vue";

const studentShortcuts = [
  {
    text: "Student's Lessons",
    link: "/list/lessons",
    color: "bg-eduSkyLight",
  },
  {
    text: "Student's Teachers",
    link: "/list/teachers",
    color: "bg-eduPurpleLight",
  },
  {
    text: "Student's Lessons",
    link: "/list/lessons",
    color: "bg-eduYellowLight",
  },
  {
    text: "Student's Exams",
    link: "/list/exams",
    color: "bg-pink-50",
  },
  {
    text: "Student's Assignments",
    link: "/list/assignments",
    color: "bg-eduSky",
  },
  {
    text: "Student's Results",
    link: "/list/results",
    color: "bg-eduSkyLight",
  },
];

const studentInfoCards = [
  {
    icon: `/singleAttendance.png`,
    value: "95%",
    title: "Attendance",
  },
  {
    icon: "/singleBranch.png",
    value: "6",
    title: "Grade",
  },
  {
    icon: "/singleLesson.png",
    value: "15",
    title: "Lessons",
  },
  {
    icon: "/singleClass.png",
    value: "6A",
    title: "Class Name",
  },
];

const studentDetails = [
  { icon: "/blood.png", label: "Blood Group", value: "A+" },
  { icon: "/date.png", label: "Date", value: "January 2025" },
  { icon: "/mail.png", label: "Email", value: "rain@gmail.com" },
  { icon: "/phone.png", label: "Phone", value: "+1 234 567 90" },
];
</script>

<style scoped></style>
