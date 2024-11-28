<template>
  <RouterView />
  <EditModal v-if="modalStore.editModal" />
  <DeleteModal v-if="modalStore.deleteModal" />
  <AddModal v-if="modalStore.addModal" />
</template>

<script setup>
import { useModalStore } from "./store/useModalStore";
import EditModal from "./components/modals/editModal.vue";
import AddModal from "./components/modals/addModal.vue";
import DeleteModal from "./components/modals/deleteModal.vue";

const modalStore = useModalStore();
</script>

<style scoped></style>
