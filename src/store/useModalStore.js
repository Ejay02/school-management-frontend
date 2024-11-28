import { defineStore } from "pinia";

export const useModalStore = defineStore("modal", {
  state: () => ({
    deleteModal: false,
    editModal: false,
    addModal: false,
    modalId: null,
    modalTitle: "",
  }),
});
