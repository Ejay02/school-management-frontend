import { defineStore } from "pinia";

export const useModalStore = defineStore("modal", {
  state: () => ({
    deleteModal: false,
    editModal: false,
    addModal: false,
    modalId: null,
    modalTitle: "",
    data: null, // This will store the full item data
  }),
  // actions: {
  //   openEditModal(data, type) {
  //     this.editModal = true;
  //     this.editModalData = data; // Store the full item data
  //     this.modalId = data.id;
  //     this.modalTitle = data.name;
  //     this.source = type;
  //   },
  //   closeEditModal() {
  //     this.editModal = false;
  //     this.editModalData = null;
  //     this.modalId = null;
  //     this.modalTitle = "";
  //     this.source = null;
  //   },
  // },
});
