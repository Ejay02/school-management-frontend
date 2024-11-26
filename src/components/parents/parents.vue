<template>
  <div class="bg-white p-4 rounded-md flex-1 m-4 mt-0">
    <!-- top -->
    <TopList :txt="'All Parents'" />

    <!-- list -->
    <div class="">
      <ParentsTable :columns="columns" :data="parentsData" />
    </div>

    <!-- pagination -->

    <Pagination />
  </div>
</template>

<script setup>
import TopList from "../lists/topList.vue";
import Pagination from "../pagination.vue";
import { parentsData } from "../../utils/data";
import ParentsTable from "./parentsTable.vue";

const columns = [
  { header: "Info", accessor: "info" },
  {
    header: "Student Name",
    accessor: "students",
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
