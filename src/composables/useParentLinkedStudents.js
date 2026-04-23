import { computed, ref } from "vue";
import { apolloClient } from "../../apollo-client";
import { getUserById } from "../graphql/queries";
import { useUserStore } from "../store/userStore";
import { formatPersonName } from "../utils/displayValue";

const linkedStudents = ref([]);
const selectedStudentId = ref("");
const loading = ref(false);
const loaded = ref(false);
const error = ref(null);

export function useParentLinkedStudents() {
  const userStore = useUserStore();

  const isParent = computed(
    () => userStore.currentRole?.toLowerCase() === "parent",
  );
  const hasLinkedStudents = computed(() => linkedStudents.value.length > 0);
  const selectedStudent = computed(
    () =>
      linkedStudents.value.find(
        (student) => student.id === selectedStudentId.value,
      ) || null,
  );
  const selectedStudentName = computed(() =>
    formatStudentName(selectedStudent.value),
  );
  const shouldShowParentLinkEmptyState = computed(() => {
    return isParent.value && loaded.value && !hasLinkedStudents.value;
  });

  if (!loaded.value && Array.isArray(userStore.userInfo?.students)) {
    linkedStudents.value = userStore.userInfo.students;
    syncSelectedStudent(linkedStudents.value);
    loaded.value = linkedStudents.value.length > 0;
  }

  const fetchLinkedStudents = async () => {
    if (!isParent.value || !userStore.userInfo?.id) {
      loaded.value = true;
      return linkedStudents.value;
    }

    if (loaded.value) {
      return linkedStudents.value;
    }

    loading.value = true;
    error.value = null;

    try {
      const { data } = await apolloClient.query({
        query: getUserById,
        variables: { id: userStore.userInfo.id },
        fetchPolicy: "network-only",
      });

      linkedStudents.value = Array.isArray(data?.getUserById?.students)
        ? data.getUserById.students
        : [];
      syncSelectedStudent(linkedStudents.value);
      return linkedStudents.value;
    } catch (err) {
      error.value = err;
      return linkedStudents.value;
    } finally {
      loaded.value = true;
      loading.value = false;
    }
  };

  return {
    error,
    selectedStudent,
    selectedStudentId,
    selectedStudentName,
    setSelectedStudent,
    formatStudentName,
    isParent,
    loaded,
    loading,
    linkedStudents,
    hasLinkedStudents,
    fetchLinkedStudents,
    shouldShowParentLinkEmptyState,
  };
}

function syncSelectedStudent(students = linkedStudents.value) {
  if (!students.length) {
    selectedStudentId.value = "";
    return;
  }

  const hasCurrentSelection = students.some(
    (student) => student.id === selectedStudentId.value,
  );

  if (!hasCurrentSelection) {
    selectedStudentId.value = students[0].id;
  }
}

function setSelectedStudent(studentId) {
  if (!studentId) return;

  const hasStudent = linkedStudents.value.some(
    (student) => student.id === studentId,
  );
  if (hasStudent) {
    selectedStudentId.value = studentId;
  }
}

function formatStudentName(student) {
  return formatPersonName(student?.name, student?.surname, "");
}
