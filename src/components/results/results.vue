<template>
  <div class="rounded border border-gray-300 p-2 w-full">
    <div class="bg-white p-4 rounded-md flex-1 m-1 mt-0 shadow-xl">
      <!-- top -->
      <div class="border-b p-4">
        <TopList :txt="'All Results'" />
      </div>

      <!-- list -->
      <div class="">
        <ResultsTable :columns="columns" :data="resultsData" />
      </div>

      <!-- pagination -->
      <Pagination />
    </div>
  </div>
</template>

<script setup>
import TopList from "../lists/topList.vue";
import Pagination from "../pagination.vue";
import { resultsData } from "../../utils/data";
import ResultsTable from "./resultsTable.vue";

const columns = [
  {
    header: "Subject",
    accessor: "subject",
  },
  {
    header: "Student",
    accessor: "student",
    class: "hidden md:table-cell",
  },
  {
    header: "Score",
    accessor: "score",
    class: "hidden md:table-cell",
  },
  {
    header: "Teacher",
    accessor: "teacher",
    class: "hidden md:table-cell",
  },
  {
    header: "Class",
    accessor: "class",
    class: "hidden md:table-cell",
  },
  // {
  //   header: "Type",
  //   accessor: "type",
  //   class: "hidden md:table-cell",
  // },
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
