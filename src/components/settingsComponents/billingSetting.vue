<template>
  <div>
 
  <AdminBilling v-if="role.toLowerCase() === 'super_admin' || role.toLowerCase() === 'admin'" />

  <ParentsBilling v-if="role.toLowerCase() === 'parent'" />
  </div>
</template>

<script setup>
import { useUserStore } from '../../store/userStore';
import AdminBilling from '../billing/adminBilling.vue';
import ParentsBilling from '../billing/parentsBilling.vue';


const userStore = useUserStore();

const role = userStore.currentRole;


</script>

<style scoped></style>
