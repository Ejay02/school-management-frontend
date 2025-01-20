<template>
  <div class="rounded border border-gray-300 p-2 w-full">
    <div class="bg-white p-4 rounded-md flex-1 m-1 mt-0 shadow-xl">
      <!-- top -->
      <div class="border-b p-4">
        <TopList :txt="'All Events'" />
      </div>

      <!-- list -->
      <div class="">
        <EventsTable :columns="columns" :data="eventsData" />
      </div>

      <!-- pagination -->
      <Pagination />
    </div>
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
