import { defineStore } from "pinia";

export const useModalStore = defineStore("modal", {
  state: () => ({
    deleteModal: false,
    editModal: false,
    addModal: false,
    cancelModal: false,
    modalId: null,
    modalTitle: "",
    data: null, // This will store the full item data
    createFeeStructureModal:false
    
  }),
  
});
 