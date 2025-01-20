<template>
  <div class="rounded border border-gray-300 p-2 w-full">
    <div class="bg-white p-4 rounded-md flex-1 m-1 mt-0 shadow-xl">
      <!-- top -->
       <div class="border-b p-4">

         <TopList :txt="'All Teachers'" />
        </div>

      <!-- list -->
      <div class="">
        <TeacherTable :columns="columns" :data="teachersData" />
      </div>

      <!-- pagination -->

      <Pagination />
    </div>
  </div>
</template>

<script setup>
import TopList from "../lists/topList.vue";
import Pagination from "../pagination.vue";
import { teachersData } from "../../utils/data";
import TeacherTable from "./teacherTable.vue";

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
