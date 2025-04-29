/*──────────────────────────────────────────────*
 |                                              |
 |    _____  _                                  |
 |   | ____|(_)                                 |
 |   |  _|  | |                                 |
 |   | |___ | |                                 |
 |   |_____|/ |                                 |
 |        |__/                                  |
 |                                              |
 |    🔧 Crafted with 🖤 by Ej                  |
 |    🔗 github.com/Ejay02                      |
 |    🚀 Clean. Scalable. Sharp.                |
 |                                              |
 *──────────────────────────────────────────────*/


<template>
  <RouterView />
  <EditModal v-if="modalStore.editModal" />
  <DeleteModal v-if="modalStore.deleteModal" />
  <AddModal v-if="modalStore.addModal" />
  <CancelModal v-if="modalStore.cancelModal" />
   <CreateFeeStructureModal v-if="modalStore.createFeeStructureModal" />
  <NotificationContainer />
</template>

<script setup>
import AddModal from "./components/modals/addModal.vue";
import DeleteModal from "./components/modals/deleteModal.vue";
import EditModal from "./components/modals/editModal.vue";
import NotificationContainer from "./components/notificationContainer.vue";
import { useModalStore } from "./store/useModalStore";
import CancelModal from "./components/modals/cancelModal.vue";
import CreateFeeStructureModal from "./components/modals/CreateFeeStructureModal.vue";

const modalStore = useModalStore();
</script>

<style scoped></style>
