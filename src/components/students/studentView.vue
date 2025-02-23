<template>
  <div class="rounded border border-gray-300 p-2 w-full">
    <LoadingScreen v-if="loading" message="Loading Student deets..." />

    <ErrorScreen v-else-if="error" />

    <div
      class="flex-1 flex flex-col md:flex-row gap-4"
      v-else-if="!error && !loading"
    >
      <div class="w-full md:w-2/3">
        <LeftSingleView
          :heading="`${studentName}'s Schedule`"
          :infoCards="studentInfoCards"
          :profileImage="student?.img || ''"
          :name="studentName"
          :surname="student?.surname || ''"
          :description="student?.description || 'No description available.'"
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
import { useRoute } from "vue-router";
import ErrorScreen from "../errorScreen.vue";
import LoadingScreen from "../loadingScreen.vue";
import { useStudentStore } from "../../store/studentStore";
import LeftSingleView from "../../views/singleView/leftSingleView.vue";
import RightSingleView from "../../views/singleView/rightSingleView.vue";
import { computed, onMounted } from 'vue';

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

const route = useRoute();
const studentId = route.params.id;

const studentStore = useStudentStore();

onMounted(() => {
  studentStore.fetchStudentById(studentId);
});

const student = computed(() => studentStore.selectedStudent);

const loading = computed(() => studentStore.loading);
const error = computed(() => studentStore.error);

const studentName = computed(() => {
  const name = student?.value?.name;
  if (!name) return "";
  return name.charAt(0).toUpperCase() + name.slice(1);
});

const studentInfoCards = computed(() => {
  if (!student.value) return [];
  return [
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
});

const studentDetails = computed(() => {
  if (!student.value) return [];

  let formattedDate = "N/A";
  if (student?.value?.createdAt) {
    const dateObj = new Date(student.value.createdAt);
    const day = dateObj.getDate().toString().padStart(2, "0");
    const month = (dateObj.getMonth() + 1).toString().padStart(2, "0");
    const year = dateObj.getFullYear();
    formattedDate = `${day}-${month}-${year}`;
  }

  return [
    {
      icon: "/blood.png",
      label: "Blood Group",
      value: student?.value.bloodType || "A+",
    },
    { icon: "/date.png", label: "Date", value: formattedDate },
    { icon: "/mail.png", label: "Email", value: student?.value.email },
    { icon: "/phone.png", label: "Phone", value: student?.value.phone },
    {
      icon: '<i class="fa-solid fa-map-pin"></i>',
      label: "Address",
      value: student?.value.address,
    },
  ];

});
</script>

<style scoped></style>
