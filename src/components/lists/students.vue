<template>
  <div class="bg-white p-4 rounded-md flex-1 m-4 mt-0">
    <!-- top -->
    <TopList :txt="'All Students'" />

    <!-- list -->
    <div class="">
      <StudentTable :columns="columns" :data="studentsData" />
    </div>

    <!-- pagination -->

    <Pagination />
  </div>
</template>

<script setup>
import TopList from "./topList.vue";
import Pagination from "../pagination.vue";
import { studentsData } from "../../utils/data";
import StudentTable from "../table/studentTable.vue";

const columns = [
  { header: "Info", accessor: "info" },
  {
    header: "Student ID",
    accessor: "studentId",
    class: "hidden md:table-cell",
  },
  {
    header: "Grade",
    accessor: "grade",
    class: "hidden md:table-cell",
  },

  {
    header: "Phone",
    accessor: "phone",
    class: "hidden md:table-cell",
  },
  {
    header: "Address",
    accessor: "address",
    class: "hidden md:table-cell",
  },
  {
    header: "Actions",
    accessor: "action",
  },
];
</script>

<style scoped></style>
