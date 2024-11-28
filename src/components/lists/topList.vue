<template>
  <div class="flex items-center justify-between">
    <h1 class="hidden md:block text-lg font-semibold">{{ txt }}</h1>
    <div class="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
      <TableSearch />
      <div class="flex items-center gap-4 self-end">
        <button>
          <img
            src="/filter.png"
            alt="filter icon"
            class="p-2 h-8 w-8 flex items-center justify-center rounded-full bg-eduYellow"
          />
        </button>
        <button>
          <img
            src="/sort.png"
            alt="filter icon"
            class="p-2 h-8 w-8 flex items-center justify-center rounded-full bg-eduYellow"
          />
        </button>
        <button @click="showAddModal(`${url}`)">
          <img
            src="/plus.png"
            alt="filter icon"
            class="p-2 h-8 w-8 flex items-center justify-center rounded-full bg-eduYellow"
          />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import TableSearch from "../tableSearch.vue";
import { useModalStore } from "../../store/useModalStore";

const props = defineProps({
  txt: {
    type: String,
    required: true,
  },
});

const modalStore = useModalStore();

const route = useRoute();

const url = ref("");

const extractUrlPath = () => {
  // Use a regex to match the last word after the final slash
  const match = route.path.match(/\/([^/]+)$/);
  url.value = match ? match[1].toLowerCase() : "";
};

// Extract URL path when component is mounted
onMounted(extractUrlPath);

const showAddModal = (type) => {
  modalStore.addModal = true;
  // modalStore.modalId = id;
  // modalStore.modalTitle = title;
  modalStore.source = type;
};
</script>

<style scoped></style>
