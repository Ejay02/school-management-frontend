import { defineStore } from "pinia";

export const useModalStore = defineStore("modal", {
  state: () => ({
    deleteModal: false,
    editModal: false,
    addModal: false,
    cancelModal: false,
    suspendModal: false,
    modalId: null,
    modalTitle: "",
    modalMessage: "",
    confirmAction: "",
    source: "",
    data: null, // This will store the full item data
    createFeeStructureModal:false,
    viewFeeDetailsModal:false
    
  }),
  
});
 
