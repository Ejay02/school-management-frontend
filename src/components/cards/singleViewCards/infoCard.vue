<template>
  <div class="bg-eduSky py-4 px-4 rounded-md gap-4 lg:w-1/2 cursor-pointer">
    <div class="flex">
      <div class="">
        <img
          :src="profileImage"
          :alt="`${name} image`"
          class="w-24 h-24 rounded-full object-cover"
        />
      </div>

      <!--  -->
      <div class="w-2/3 flex-col justify-between p-2">
        <div class="flex gap-2">
          <div class="text-xl font-semibold">{{ name || "NA" }}</div>
          <div
            class=""
            @click="showEditModal(id, name, details, 'teacherCard')"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="size-4"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
              />
            </svg>
          </div>
        </div>
        <p class="text-sm text-gray-500 mt-2">{{ description || "NA" }}</p>
      </div>
    </div>
    <!-- desc -->
    <div class="flex justify-between gap-2 flex-wrap text-xs font-medium">
      <div
        v-for="(detail, index) in details"
        :key="index"
        class="w-full md:w-1/3 lg:w-1/3 flex items-center"
      >
        <img :src="detail.icon" :alt="`${detail.label} icon`" class="h-3 w-3" />
        <span class="flex text-xs ml-2"> {{ detail.value || "NA" }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from "vue-router";
import { useModalStore } from "../../../store/useModalStore";

const props = defineProps({
  profileImage: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  details: {
    type: Array,
    required: true,
  },
});

const route = useRoute();
const id = route.params.id;

const modalStore = useModalStore();

const showEditModal = (id, name, data, type) => {
  modalStore.editModal = true;
  modalStore.modalId = id;
  modalStore.modalTitle = name;
  modalStore.data = data;
  modalStore.source = type;
};
</script>

<style scoped></style>
