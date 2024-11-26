<template>
  <table class="w-full mt-4 cursor-pointer">
    <thead>
      <tr class="text-left text-gray-500 text-sm">
        <th
          v-for="column in columns"
          :key="column?.header"
          :class="['flex-1', 'text-left', 'p-2', column?.class || '']"
        >
          {{ column?.header }}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="item in data"
        :key="item?.id"
        class="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-eduPurpleLight"
      >
        <td class="flex items-center gap-4 p-2">
          <div class="flex flex-col">
            <div class="font-semibold">{{ item?.subject }}</div>
          </div>
        </td>

        <td class="hidden md:table-cell">{{ item?.class }}</td>
        <td class="hidden md:table-cell">{{ item?.teacher }}</td>
        <td class="hidden md:table-cell">{{ item?.date }}</td>

        <td>
          <div class="flex items-center gap-2">
            <router-link :to="`/list/teacher/${item?.id}`">
              <button
                class="w-6 h-6 flex items-center justify-center rounded-full bg-eduSky"
              >
                <img src="/view.png" alt="view" class="h-3 w-3" />
              </button>
            </router-link>

            <button
              v-if="role == 'admin'"
              class="w-6 h-6 flex items-center justify-center rounded-full bg-eduPurple"
            >
              <img src="/delete.png" alt="delete" class="h-3 w-3" />
            </button>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup>
import { useUserStore } from "../../store/userStore";

const props = defineProps({
  columns: {
    type: Array,
    required: true,
  },
  data: {
    type: Array,
    required: true,
  },
});

const userStore = useUserStore();

const role = userStore.currentRole;
</script>

<style scoped></style>
