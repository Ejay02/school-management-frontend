<template>
  <div class="bg-white p-4 rounded-md flex-1 m-4 mt-0">
    <!-- top -->
    <TopList :txt="'All Results'" />

    <!-- list -->
    <div class="">
      <ResultsTable :columns="columns" :data="resultsData" />
    </div>

    <!-- pagination -->
    <Pagination />
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
