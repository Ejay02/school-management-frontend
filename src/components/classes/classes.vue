<template>
  <div class="rounded border border-gray-300 p-2 w-full">
    <div class="bg-white p-4 rounded-md flex-1 m-1 mt-0 shadow-xl">
      <!-- top -->
      <div class="border-b p-4">
        <TopList :txt="'All Classes'" />
      </div>
      <!-- list -->
      <div class="">
        <ClassesTable :columns="columns" :data="classesData" />
      </div>

      <!-- pagination -->
      <Pagination />
    </div>
  </div>
</template>

<script setup>
import TopList from "../lists/topList.vue";
import Pagination from "../pagination.vue";
import { classesData } from "../../utils/data";
import ClassesTable from "./classesTable.vue";

const columns = [
  {
    header: "Class Name",
    accessor: "name",
  },
  {
    header: "Capacity",
    accessor: "capacity",
    class: "hidden md:table-cell",
  },
  {
    header: "Grade",
    accessor: "grade",
    class: "hidden md:table-cell",
  },
  {
    header: "Supervisor",
    accessor: "supervisor",
    class: "hidden md:table-cell",
  },
  {
    header: "Actions",
    accessor: "action",
  },
];
</script>

<style scoped></style>
