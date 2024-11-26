<template>
  <div class="bg-white p-4 rounded-md flex-1 m-4 mt-0">
    <!-- top -->
    <TopList :txt="'All Events'" />

    <!-- list -->
    <div class="">
      <EventsTable :columns="columns" :data="eventsData" />
    </div>

    <!-- pagination -->
    <Pagination />
  </div>
</template>

<script setup>
import TopList from "../lists/topList.vue";
import Pagination from "../pagination.vue";
import { eventsData } from "../../utils/data";
import EventsTable from "./eventsTable.vue";

const columns = [
  {
    header: "Title",
    accessor: "title",
  },
  {
    header: "Class",
    accessor: "class",
    class: "hidden md:table-cell",
  },
  {
    header: "Date",
    accessor: "date",
    class: "hidden md:table-cell",
  },
  {
    header: "Start Time",
    accessor: "startTime",
    class: "hidden md:table-cell",
  },
  {
    header: "End Time",
    accessor: "endTime",
    class: "hidden md:table-cell",
  },

  {
    header: "Actions",
    accessor: "action",
  },
];
</script>

<style scoped></style>
