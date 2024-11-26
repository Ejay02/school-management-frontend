<template>
  <div class="bg-white p-4 rounded-md flex-1 m-4 mt-0">
    <!-- top -->
    <TopList :txt="'All Teachers'" />

    <!-- list -->
    <div class="">
      <TeacherTable :columns="columns" :data="teachersData" />
    </div>

    <!-- pagination -->

    <Pagination />
  </div>
</template>

<script setup>
import TopList from "./topList.vue";
import Pagination from "../pagination.vue";
import { teachersData } from "../../utils/data";
import TeacherTable from "../table/teacherTable.vue";

const columns = [
  { header: "Info", accessor: "info" },
  {
    header: "Teacher ID",
    accessor: "teacherId",
    class: "hidden md:table-cell",
  },
  {
    header: "Subjects",
    accessor: "subjects",
    class: "hidden md:table-cell",
  },
  {
    header: "Classes",
    accessor: "classes",
    class: "hidden md:table-cell",
  },
  {
    header: "Phone",
    accessor: "phone",
    class: "hidden lg:table-cell",
  },
  {
    header: "Address",
    accessor: "address",
    class: "hidden lg:table-cell",
  },
  {
    header: "Actions",
    accessor: "action",
  },
];
</script>

<style scoped></style>
