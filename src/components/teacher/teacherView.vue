<template>
  <div class="rounded border border-gray-300 p-2 w-full">
    <!-- loading -->
    <LoadingScreen v-if="loading" message="Loading Teacher deets..." />

    <ErrorScreen v-else-if="error" />
    <div
      v-else-if="!error && !loading"
      class="flex-1 flex flex-col md:flex-row gap-4"
    >
      <div class="w-full md:w-2/3">
        <LeftSingleView
          :heading="`${teacherName}'s Schedule`"
          :infoCards="teacherInfoCards"
          :profileImage="teacher?.img || ''"
          :name="teacherName"
          :surname="teacher?.surname || ''"
          :description="teacher?.description || 'No description available.'"
          :details="teacherDetails"
        />
      </div>
      <div class="w-full md:w-1/3">
        <RightSingleView :shortcuts="teacherShortcuts" :name="teacherName" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from "vue-router";
import { computed, onMounted } from "vue";
import ErrorScreen from "../../components/errorScreen.vue";
import { useTeacherStore } from "../../store/teacherStore";
import LoadingScreen from "../../components/loadingScreen.vue";
import LeftSingleView from "../../views/singleView/leftSingleView.vue";
import RightSingleView from "../../views/singleView/rightSingleView.vue";

const route = useRoute();
const teacherId = route.params.id;

const teacherStore = useTeacherStore();

onMounted(() => {
  teacherStore.fetchTeacherById(teacherId);
});

const teacher = computed(() => teacherStore.selectedTeacher);

const loading = computed(() => teacherStore.loading);
const error = computed(() => teacherStore.error);

const teacherName = computed(() => {
  const name = teacher.value?.name;
  if (!name) return "";
  return name.charAt(0).toUpperCase() + name.slice(1);
});

const teacherInfoCards = computed(() => {
  if (!teacher.value) return [];
  return [
    {
      icon: `/singleAttendance.png`,
      value: teacher?.value.attendance || "0%",
      title: "Assignments",
    },
    {
      icon: "/singleBranch.png",
      value: teacher?.value.events || "9",
      title: "Events",
    },
    {
      icon: "/singleLesson.png",
      value: teacher?.value.lessons ? teacher?.value.lessons.length : "5",
      title: "Lessons",
    },
    {
      icon: "/singleClass.png",
      value: teacher?.value.classes ? teacher.value.classes.length : "6",
      title: "Classes",
    },
  ];
});

// Map teacher data to details (adjust labels as needed)
const teacherDetails = computed(() => {
  if (!teacher.value) return [];

  let formattedDate = "N/A";
  if (teacher.value?.createdAt) {
    const dateObj = new Date(teacher.value.createdAt);
    const day = dateObj.getDate().toString().padStart(2, "0");
    const month = (dateObj.getMonth() + 1).toString().padStart(2, "0");
    const year = dateObj.getFullYear();
    formattedDate = `${day}-${month}-${year}`;
  }

  return [
    {
      icon: "/blood.png",
      label: "Blood Group",
      value: teacher?.value.bloodType || "A+",
    },
    {
      icon: "/date.png",
      label: "Joined",
      value: formattedDate,
    },
    { icon: "/mail.png", label: "Email", value: teacher?.value.email },
    { icon: "/phone.png", label: "Phone", value: teacher?.value.phone },
    {
      icon: '<i class="fa-solid fa-map-pin"></i>',
      label: "Address",
      value: teacher?.value.address,
    },
  ];
});

const teacherShortcuts = computed(() => {
  if (!teacher.value) return [];
  return [
    {
      text: `${teacherName.value}'s Classes`,
      link: "/list/classes",
      color: "bg-eduSkyLight",
    },
    {
      text: `${teacherName.value}'s Students`,
      link: "/list/students",
      color: "bg-eduPurpleLight",
    },
    {
      text: `${teacherName.value}'s Lessons`,
      link: "/list/lessons",
      color: "bg-eduYellowLight",
    },
    {
      text: `${teacherName.value}'s Exams`,
      link: "/list/exams",
      color: "bg-pink-50",
    },
    {
      text: `${teacherName.value}'s Assignments`,
      link: "/list/assignments",
      color: "bg-eduSky",
    },
  ];
});
</script>

<style scoped></style>
