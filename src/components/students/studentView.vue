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
        <RightSingleView :shortcuts="studentShortcuts" :name="studentName" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from "vue-router";
import { computed, onMounted } from "vue";
import ErrorScreen from "../errorScreen.vue";
import LoadingScreen from "../loadingScreen.vue";
import { useStudentStore } from "../../store/studentStore";
import LeftSingleView from "../../views/singleView/leftSingleView.vue";
import RightSingleView from "../../views/singleView/rightSingleView.vue";

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
      icon: "/singleClass.png",
      value: student?.value.class?.name,
      title: "Class Name",
    },
    {
      icon: `/singleAttendance.png`,
      value: "5",
      title: "Assignment(s)",
    },
    {
      icon: "/singleLesson.png",
      value: "15",
      title: "Lesson(s)",
    },
    {
      icon: "/singleBranch.png",
      value: "6",
      title: "Event(s)",
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
    {
      icon: '<i class="fa-solid fa-envelope"></i>',
      label: "Email",
      value: student?.value.email,
    },
    { icon: "/phone.png", label: "Phone", value: student?.value.phone },
    {
      icon: '<i class="fa-solid fa-map-pin"></i>',
      label: "Address",
      value: student?.value.address,
    },
  ];
});

const studentShortcuts = computed(() => {
  if (!student.value) return [];
  return [
    {
      text: `${studentName.value}'s Lessons`,
      link: "/lessons",
      color: "bg-eduSkyLight",
    },
    {
      text: `${studentName.value}'s Teachers`,
      link: "/teachers",
      color: "bg-eduPurpleLight",
    },

    {
      text: `${studentName.value}'s Exams`,
      link: "/exams",
      color: "bg-pink-50",
    },
    {
      text: `${studentName.value}'s Assignments`,
      link: "/assignments",
      color: "bg-eduSky",
    },
    {
      text: ` ${studentName.value}'s Results`,
      link: "/results",
      color: "bg-eduYellowLight",
    },
  ];
});
</script>

<style scoped></style>
