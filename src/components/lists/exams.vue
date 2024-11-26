<template>
  <div class="bg-white p-4 rounded-md flex-1 m-4 mt-0">
    <!-- top -->
    <TopList :txt="'All Exams'" />

    <!-- list -->
    <div class="">
      <ExamsTable :columns="columns" :data="examsData" />
    </div>

    <!-- pagination -->
    <Pagination />
  </div>
</template>

<script setup>
import TopList from "./topList.vue";
import Pagination from "../pagination.vue";
import { examsData } from "../../utils/data";
import ExamsTable from "../table/examsTable.vue";

const columns = [
  {
    header: "Subject Name",
    accessor: "subject",
  },
  {
    header: "Class",
    accessor: "class",
    class: "hidden md:table-cell",
  },
  {
    header: "Teacher",
    accessor: "teacher",
    class: "hidden md:table-cell",
  },
  {
    header: "Date",
    accessor: "date",
    class: "hidden md:table-cell",
  },
  {
    header: "Actions",
    accessor: "action",
  },
];
</script>

<style scoped></style>
