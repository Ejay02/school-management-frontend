<template>
  <div class="rounded-xl border border-gray-250 bg-white p-6 shadow-sm space-y-6">
    <!-- Header & Selection Filters -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h2 class="text-xl font-bold text-gray-800">Gradebook Grid</h2>
        <p class="text-xs text-gray-500 mt-1">
          Record student marks and view term averages in real-time. Click any cell to grade.
        </p>
      </div>

      <div class="flex flex-wrap gap-4 w-full sm:w-auto">
        <!-- Class Dropdown -->
        <div class="flex flex-col gap-1 w-full sm:w-52">
          <label class="text-xs font-semibold text-gray-500">Class</label>
          <select
            v-model="selectedClassId"
            class="px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="" disabled>Select a class</option>
            <option
              v-for="cls in classes"
              :key="cls.id"
              :value="cls.id"
            >
              {{ cls.name }}
            </option>
          </select>
        </div>

        <!-- Subject Dropdown -->
        <div class="flex flex-col gap-1 w-full sm:w-52">
          <label class="text-xs font-semibold text-gray-500">Subject</label>
          <select
            v-model="selectedSubjectId"
            class="px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="" disabled>Select a subject</option>
            <option
              v-for="sub in subjects"
              :key="sub.id"
              :value="sub.id"
            >
              {{ sub.name }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <!-- Empty Selection State -->
    <div
      v-if="!selectedClassId || !selectedSubjectId"
      class="border-2 border-dashed border-gray-200 rounded-xl p-12 text-center"
    >
      <div class="h-12 w-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4">
        <i class="fa-solid fa-table text-xl"></i>
      </div>
      <h3 class="text-sm font-semibold text-gray-700">No Class or Subject Selected</h3>
      <p class="text-xs text-gray-500 mt-1 max-w-xs mx-auto leading-relaxed">
        Choose a class and a subject from the filters above to populate the spreadsheet gradebook.
      </p>
    </div>

    <!-- Grid Layout -->
    <div v-else class="space-y-4">
      <LoadingScreen v-if="loading" message="Fetching gradebook grid..." />
      <ErrorScreen v-else-if="error" />
      
      <!-- Empty Gradebook State -->
      <div
        v-else-if="!students.length || !columns.length"
        class="border-2 border-dashed border-gray-200 rounded-xl p-12 text-center"
      >
        <div class="h-12 w-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4">
          <i class="fa-solid fa-circle-exclamation text-xl"></i>
        </div>
        <h3 class="text-sm font-semibold text-gray-700">No Assessment Data</h3>
        <p class="text-xs text-gray-500 mt-1 max-w-sm mx-auto leading-relaxed">
          There are either no active students in this class, or no assignments and exams created for this subject yet.
        </p>
      </div>

      <!-- Spreadsheet Grid Table -->
      <div v-else class="overflow-x-auto rounded-lg border border-gray-200">
        <table class="min-w-full divide-y divide-gray-250 table-fixed">
          <thead class="bg-gray-50">
            <tr>
              <!-- Student Header -->
              <th
                scope="col"
                class="w-64 px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider sticky left-0 bg-gray-50 z-10 border-r border-gray-200 shadow-[2px_0_5px_rgba(0,0,0,0.05)]"
              >
                Student Name
              </th>
              
              <!-- Term Average Header -->
              <th
                scope="col"
                class="w-28 px-4 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider border-r border-gray-200"
              >
                Class Avg
              </th>

              <!-- Dynamic Assessment Headers -->
              <th
                v-for="col in columns"
                :key="col.id"
                scope="col"
                class="w-48 px-4 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider border-r border-gray-200"
              >
                <div class="flex items-center gap-2">
                  <span
                    class="px-2 py-0.5 rounded text-[10px]"
                    :class="[
                      col.type === 'EXAM' 
                        ? 'bg-amber-100 text-amber-800' 
                        : 'bg-purple-100 text-purple-800'
                    ]"
                  >
                    {{ col.type }}
                  </span>
                  <span class="truncate block max-w-[100px]" :title="col.title">
                    {{ col.title }}
                  </span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr
              v-for="student in students"
              :key="student.id"
              class="hover:bg-indigo-50/30 transition-colors"
            >
              <!-- Student Row Name -->
              <td
                class="px-6 py-3 whitespace-nowrap sticky left-0 bg-white hover:bg-indigo-50/30 z-10 border-r border-gray-200 shadow-[2px_0_5px_rgba(0,0,0,0.05)] flex items-center gap-3 h-[52px]"
              >
                <div class="h-8 w-8 rounded-full bg-eduPurpleLight flex items-center justify-center text-indigo-700 font-bold text-sm shrink-0">
                  {{ student.name.charAt(0) }}{{ student.surname.charAt(0) }}
                </div>
                <div class="text-sm font-semibold text-gray-900 truncate">
                  {{ student.surname }}, {{ student.name }}
                </div>
              </td>

              <!-- Student Calculated Average -->
              <td class="px-4 py-3 whitespace-nowrap text-center border-r border-gray-200 h-[52px]">
                <span
                  class="inline-block px-2.5 py-1 rounded-full text-xs font-bold"
                  :class="getAverageBadgeStyle(getStudentAverage(student.id))"
                >
                  {{ getStudentAverage(student.id) }}%
                </span>
              </td>

              <!-- Dynamic Grades Inputs -->
              <td
                v-for="col in columns"
                :key="col.id"
                class="px-4 py-2 border-r border-gray-200 transition-colors cursor-pointer group hover:bg-gray-50 h-[52px]"
                @click="startEditing(student.id, col.id)"
              >
                <!-- Edit Input Mode -->
                <div
                  v-if="isEditing(student.id, col.id)"
                  class="flex items-center gap-1"
                >
                  <input
                    type="number"
                    v-model="editValue"
                    ref="editInput"
                    min="0"
                    max="100"
                    class="w-20 px-2 py-1 bg-white border border-indigo-500 rounded text-sm font-medium text-gray-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                    @keydown.enter="saveCurrentCell"
                    @keydown.esc="cancelEditing"
                    @blur="saveCurrentCell"
                  />
                  <button
                    @click.stop="saveCurrentCell"
                    class="text-emerald-600 hover:text-emerald-500 p-0.5"
                  >
                    <i class="fa-solid fa-check text-xs"></i>
                  </button>
                </div>

                <!-- Static Score View Mode -->
                <div v-else class="flex justify-between items-center h-full">
                  <span
                    class="text-sm font-semibold"
                    :class="getCellScoreStyle(getScore(student.id, col.id))"
                  >
                    {{ getScore(student.id, col.id) !== null ? `${getScore(student.id, col.id)}%` : '-' }}
                  </span>
                  <span class="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity text-xs">
                    <i class="fa-solid fa-pen text-[10px]"></i>
                  </span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch, nextTick } from "vue";
import { useClassStore } from "../../store/classStore";
import { useSubjectStore } from "../../store/subjectStore";
import { useResultStore } from "../../store/resultStore";
import LoadingScreen from "../loadingScreen.vue";
import ErrorScreen from "../errorScreen.vue";

const classStore = useClassStore();
const subjectStore = useSubjectStore();
const resultStore = useResultStore();

// Selection Filters State
const selectedClassId = ref("");
const selectedSubjectId = ref("");

// Grid Editing State
const editingCell = ref(null); // { studentId, columnId }
const editValue = ref("");
const editInput = ref(null);

// Getters from Stores
const classes = computed(() => classStore.getClassNames || []);
const subjects = computed(() => subjectStore.allSubjects || []);
const loading = computed(() => resultStore.loading);
const error = computed(() => resultStore.error);

// Gradebook Grid Payload Elements
const students = computed(() => resultStore.gradebookData?.students || []);
const columns = computed(() => resultStore.gradebookData?.columns || []);
const cells = computed(() => resultStore.gradebookData?.cells || []);

// Fetch filter lists on mount
onMounted(async () => {
  if (!classStore.getClassNames || classStore.getClassNames.length === 0) {
    await classStore.fetchClasses();
  }
  if (!subjectStore.allSubjects || subjectStore.allSubjects.length === 0) {
    await subjectStore.fetchSubjects({ limit: 1000 });
  }

  // Prepopulate if lists are available
  if (classes.value.length > 0) {
    selectedClassId.value = classes.value[0].id;
  }
  if (subjects.value.length > 0) {
    selectedSubjectId.value = subjects.value[0].id;
  }
});

// Watch selections to reload gradebook grid
watch([selectedClassId, selectedSubjectId], () => {
  if (selectedClassId.value && selectedSubjectId.value) {
    resultStore.fetchGradebook(selectedClassId.value, selectedSubjectId.value);
  }
});

// Get score from cells list
function getScore(studentId, columnId) {
  const match = cells.value.find(
    (c) => c.studentId === studentId && c.columnId === columnId
  );
  return match && typeof match.score === "number" ? match.score : null;
}

// Calculate dynamic average for a student
function getStudentAverage(studentId) {
  const studentCells = cells.value.filter((c) => c.studentId === studentId && typeof c.score === "number");
  if (studentCells.length === 0) return 0;
  const sum = studentCells.reduce((acc, c) => acc + c.score, 0);
  return Math.round(sum / studentCells.length);
}

// Edit Mode Helpers
function isEditing(studentId, columnId) {
  return (
    editingCell.value &&
    editingCell.value.studentId === studentId &&
    editingCell.value.columnId === columnId
  );
}

function startEditing(studentId, columnId) {
  const current = getScore(studentId, columnId);
  editValue.value = current !== null ? current.toString() : "";
  editingCell.value = { studentId, columnId };
  
  nextTick(() => {
    if (editInput.value && editInput.value[0]) {
      editInput.value[0].focus();
      editInput.value[0].select();
    }
  });
}

function cancelEditing() {
  editingCell.value = null;
  editValue.value = "";
}

async function saveCurrentCell() {
  if (!editingCell.value) return;
  const { studentId, columnId } = editingCell.value;
  const column = columns.value.find((c) => c.id === columnId);
  if (!column) return;

  const scoreText = editValue.value.trim();
  if (scoreText === "") {
    cancelEditing();
    return;
  }

  const scoreNum = parseInt(scoreText);
  if (isNaN(scoreNum) || scoreNum < 0 || scoreNum > 100) {
    cancelEditing();
    return;
  }

  // Only trigger mutation if score changed
  const oldScore = getScore(studentId, columnId);
  if (oldScore === scoreNum) {
    cancelEditing();
    return;
  }

  try {
    await resultStore.saveGrade({
      studentId,
      score: scoreNum,
      columnId,
      type: column.type,
    });
  } catch (err) {
    console.error("Failed to save grade", err);
  } finally {
    cancelEditing();
  }
}

// styling utilities
function getAverageBadgeStyle(avg) {
  if (avg >= 85) return "bg-emerald-100 text-emerald-800";
  if (avg >= 70) return "bg-indigo-100 text-indigo-800";
  if (avg >= 50) return "bg-amber-100 text-amber-800";
  return "bg-rose-100 text-rose-800";
}

function getCellScoreStyle(score) {
  if (score === null) return "text-gray-400";
  if (score >= 85) return "text-emerald-700";
  if (score >= 50) return "text-gray-900";
  return "text-rose-600 font-bold";
}
</script>

<style scoped>
/* Remove standard spin buttons for clean input appearance */
input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type="number"] {
  -moz-appearance: textfield;
}
</style>
