<template>
  <div class="bg-white p-4 rounded-md flex-1 m-4 mt-0">
    <!-- top -->
    <TopList :txt="'All Classes'" />

    <!-- list -->
    <div class="">
      <ClassesTable :columns="columns" :data="classesData" />
    </div>

    <!-- pagination -->
    <Pagination />
  </div>
</template>

<script setup>
import TopList from "./topList.vue";
import Pagination from "../pagination.vue";
import { classesData } from "../../utils/data";
import ClassesTable from "../table/classesTable.vue";

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
