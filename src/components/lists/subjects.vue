<template>
  <div class="bg-white p-4 rounded-md flex-1 m-4 mt-0">
    <!-- top -->
    <TopList :txt="'All Subjects'" />

    <!-- list -->
    <div class="">
      <SubjectTable :columns="columns" :data="subjectsData" />
    </div>

    <!-- pagination -->
    <Pagination />
  </div>
</template>

<script setup>
import TopList from "./topList.vue";
import Pagination from "../pagination.vue";
import { subjectsData } from "../../utils/data";
import SubjectTable from "../table/subjectTable.vue";

const columns = [
  {
    header: "Subject Name",
    accessor: "subject",
  },
  {
    header: "Teachers",
    accessor: "teachers",
    class: "hidden md:table-cell",
  },
  {
    header: "Actions",
    accessor: "action",
  },
];
</script>

<style scoped></style>
