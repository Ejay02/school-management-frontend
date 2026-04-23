<template>
  <div v-if="hasLinkedStudents" class="flex flex-col gap-2 rounded-md bg-slate-50 p-4">
    <label class="text-sm font-medium text-gray-600">
      {{ linkedStudents.length > 1 ? "Viewing child" : "Child" }}
    </label>

    <div v-if="linkedStudents.length === 1" class="text-sm font-semibold text-gray-800">
      {{ selectedStudentName }}
    </div>

    <select
      v-else
      :value="selectedStudentId"
      class="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-eduPurple focus:outline-none"
      @change="handleSelectionChange"
    >
      <option
        v-for="student in linkedStudents"
        :key="student.id"
        :value="student.id"
      >
        {{ formatStudentName(student) }}
      </option>
    </select>
  </div>
</template>

<script setup>
import { useParentLinkedStudents } from "../../composables/useParentLinkedStudents";

const {
  formatStudentName,
  hasLinkedStudents,
  linkedStudents,
  selectedStudentId,
  selectedStudentName,
  setSelectedStudent,
} = useParentLinkedStudents();

function handleSelectionChange(event) {
  setSelectedStudent(event.target.value);
}
</script>
