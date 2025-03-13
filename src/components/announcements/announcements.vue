<template>
  <div class="rounded border border-gray-300 p-2 w-full">
    <div
      class="min-h-screen bg-gray-50 p-4 rounded-md flex-1 m-1 mt-0 shadow-xl"
    >
      <LoadingScreen v-if="loading" message="Loading announcements..." />

      <ErrorScreen v-else-if="error" />
      <!-- Main content view -->
      <main v-else class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="">
          <div
            class="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <h2 class="text-2xl font-bold text-gray-900">Announcements</h2>
              <p class="mt-1 text-sm text-gray-500">
                Stay updated with the latest school announcements
              </p>
            </div>
            <div class="mt-4 sm:mt-0 flex space-x-3">
              <!-- View tabs -->
              <div class="inline-flex rounded-md shadow-sm" role="group">
                <button
                  @click="activeView = 'main'"
                  class="px-4 py-2 text-sm font-medium border rounded-l-lg"
                  :class="
                    activeView === 'main'
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  "
                >
                  Main
                </button>
                <button
                  @click="activeView = 'archive'"
                  class="px-4 py-2 text-sm font-medium border-t border-b border-r rounded-r-lg"
                  :class="
                    activeView === 'archive'
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  "
                >
                  Archive
                  <span
                    v-if="archivedAnnouncements.length"
                    class="ml-1 px-2 py-0.5 text-xs rounded-full bg-gray-200 text-gray-800"
                  >
                    {{ archivedAnnouncements.length }}
                  </span>
                </button>
              </div>

              <div v-if="canCreateAnnouncement && activeView === 'main'">
                <button
                  @click="showNewAnnouncementModal = true"
                  class="bg-gradient-to-br from-indigo-500 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white px-4 py-2 rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  New Announcement
                </button>
              </div>
            </div>
          </div>

          <!-- Filters -->
          <div
            v-if="activeView === 'main'"
            class="mb-6 bg-white rounded-lg shadow-sm p-4"
          >
            <div
              class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4"
            >
              <div class="relative flex-1">
                <input
                  type="text"
                  v-model="searchQuery"
                  placeholder="Search announcements..."
                  class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div
                class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2"
              >
                <select
                  v-model="selectedCategory"
                  class="px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-gray-700"
                >
                  <option value="">All Categories</option>
                  <option value="class">Class Announcements</option>
                  <option value="general">General Announcements</option>
                </select>
                <select
                  v-if="isAdminOrTeacher"
                  v-model="selectedTargetRole"
                  class="px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-gray-700"
                >
                  <option value="">All Audiences</option>
                  <option
                    v-for="role in availableTargetRoles"
                    :key="role.value"
                    :value="role.value"
                  >
                    {{ role.label }}
                  </option>
                </select>
              </div>
            </div>
          </div>

          <!-- Archive Filters (simpler) -->
          <div
            v-if="activeView === 'archive'"
            class="mb-6 bg-white rounded-lg shadow-sm p-4"
          >
            <div class="flex">
              <div class="relative flex-1">
                <input
                  type="text"
                  v-model="archiveSearchQuery"
                  placeholder="Search archived announcements..."
                  class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          <!-- MAIN VIEW: Announcements List -->

          <div
            v-if="activeView === 'main' && announcements.length"
            class="space-y-4 border-t pt-4"
          >
            <div
              v-for="announcement in announcements"
              :key="announcement.id"
              class="bg-white rounded-lg shadow-sm overflow-hidden transition-all hover:shadow-md"
              :class="{ 'border-l-4 border-indigo-500': !announcement.isRead }"
            >
              <div class="p-6">
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-2">
                    <span
                      :class="{
                        'bg-blue-100 text-blue-800': announcement.classId,
                        'bg-purple-100 text-purple-800': !announcement.classId,
                      }"
                      class="px-2 py-1 text-xs font-medium rounded-md"
                    >
                      {{ announcement.classId ? "Class" : "General" }}
                    </span>
                    <span
                      v-if="
                        announcement.targetRoles &&
                        announcement.targetRoles.length
                      "
                      class="px-2 py-1 text-xs font-medium rounded-md bg-teal-100 text-teal-800"
                    >
                      For: {{ formatTargetRoles(announcement.targetRoles) }}
                    </span>
                  </div>
                  <div class="flex items-center space-x-2">
                    <span
                      v-if="!announcement.isRead"
                      class="h-2 w-2 rounded-full bg-indigo-500"
                    ></span>
                    <p class="text-sm text-gray-500">
                      {{
                        formatDate(
                          announcement.createdAt || announcement.updatedAt
                        )
                      }}
                    </p>
                  </div>
                </div>

                <h3 class="mt-3 text-lg font-medium text-gray-900">
                  {{ announcement.title }}
                </h3>
                <div
                  class="mt-2 text-sm text-gray-600"
                  v-html="announcement.content"
                ></div>

                <div class="mt-4 flex justify-between items-center">
                  <div class="flex items-center text-sm text-gray-500">
                    Posted by
                    <span>{{ creatorName }}</span>
                  </div>

                  <!-- <div class="flex items-center text-sm text-gray-500">
                    <span>
                      Posted by
                      {{ formatCreatorRole(announcement.creatorRole) }}
                      <span v-if="announcement.class"
                        >({{ announcement.class.name }})</span
                      >
                    </span>
                  </div> -->
                  <div class="flex space-x-2">
                    <button
                      v-if="!announcement.isRead"
                      @click="markAsRead(announcement.id)"
                      class="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                    >
                      Mark as Read
                    </button>
                    <button
                      v-if="canEditAnnouncement(announcement)"
                      @click="editAnnouncement(announcement)"
                      class="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                    >
                      Edit
                    </button>
                    <button
                      v-if="canDeleteAnnouncement(announcement)"
                      @click="deleteAnnouncement(announcement.id)"
                      class="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      Delete
                    </button>
                    <button
                      v-else
                      @click="archiveAnnouncement(announcement)"
                      class="text-gray-600 hover:text-gray-800 text-sm font-medium"
                    >
                      Archive
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- ARCHIVE VIEW: Archived Announcements List -->
        <div
          v-if="
            activeView === 'archive' && filteredArchivedAnnouncements.length
          "
          class="space-y-4 mt-2"
        >
          <div
            v-for="announcement in filteredArchivedAnnouncements"
            :key="announcement.id"
            class="bg-white rounded-lg shadow-sm overflow-hidden transition-all hover:shadow-md border-l-4 border-gray-300"
          >
            <div class="p-6">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-2">
                  <span
                    :class="{
                      'bg-blue-100 text-blue-800': announcement.classId,
                      'bg-purple-100 text-purple-800': !announcement.classId,
                    }"
                    class="px-2 py-1 text-xs font-medium rounded-md"
                  >
                    {{ announcement.classId ? "Class" : "General" }}
                  </span>
                  <span
                    v-if="
                      announcement.targetRoles &&
                      announcement.targetRoles.length
                    "
                    class="px-2 py-1 text-xs font-medium rounded-md bg-teal-100 text-teal-800"
                  >
                    For: {{ formatTargetRoles(announcement.targetRoles) }}
                  </span>
                  <span
                    class="px-2 py-1 text-xs font-medium rounded-md bg-gray-100 text-gray-800"
                  >
                    Archived
                  </span>
                </div>
                <div class="flex items-center space-x-2">
                  <p class="text-sm text-gray-500">
                    {{
                      formatDate(
                        announcement.createdAt || announcement.updatedAt
                      )
                    }}
                  </p>
                </div>
              </div>

              <h3 class="mt-3 text-lg font-medium text-gray-900">
                {{ announcement.title }}
              </h3>
              <div
                class="mt-2 text-sm text-gray-600"
                v-html="announcement.content"
              ></div>

              <div class="mt-4 flex justify-between items-center">
                <div class="flex items-center text-sm text-gray-500">
                  <span>
                    Posted by {{ formatCreatorRole(announcement.creatorRole) }}
                    <span v-if="announcement.class"
                      >({{ announcement.class.name }})</span
                    >
                  </span>
                </div>
                <div class="flex space-x-2">
                  <button
                    @click="restoreAnnouncement(announcement)"
                    class="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                  >
                    Restore
                  </button>
                  <button
                    @click="permanentlyDeleteAnnouncement(announcement.id)"
                    class="text-red-600 hover:text-red-800 text-sm font-medium"
                  >
                    Delete Permanently
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty state for main view -->
        <div>
          <!-- class="bg-white rounded-lg shadow-sm p-12 text-center" -->
          <div
            v-if="activeView === 'main' && !filteredAnnouncements.length"
            class="bg-gray-100 rounded-lg shadow-sm p-12 text-center mt-2"
          >
            <EmptyState
              icon="fa-solid fa-bell"
              heading=" No announcements found"
              :description="
                searchQuery || selectedCategory || selectedTargetRole
                  ? 'Try adjusting your filters'
                  : 'Check back later for updates'
              "
            />

            <div class="mt-6" v-if="canCreateAnnouncement">
              <button
                @click="showNewAnnouncementModal = true"
                class="bg-gradient-to-br from-indigo-500 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white px-4 py-2 rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Create Announcement
              </button>
            </div>
          </div>

          <div
            v-if="
              activeView === 'archive' && !filteredArchivedAnnouncements.length
            "
            class="bg-gray-100 rounded-lg shadow-sm p-12 text-center mt-2"
          >
            <!-- Empty state for archive view -->
            <EmptyState
              icon="fa-solid fa-box-archive"
              heading="No archived announcements"
              :description="
                archiveSearchQuery
                  ? 'No archived announcements match your search'
                  : 'When you archive announcements, they\'ll appear here'
              "
            />
          </div>
        </div>

        <!-- New/Edit Announcement Modal -->
        <div
          v-if="showNewAnnouncementModal"
          class="fixed inset-0 z-10 overflow-y-auto"
        >
          <div
            class="flex items-center justify-center min-h-screen px-4 text-center"
          >
            <div
              class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              @click="showNewAnnouncementModal = false"
            ></div>
            <div
              class="relative bg-white rounded-lg max-w-lg w-full p-6 text-left shadow-xl transform transition-all"
            >
              <div class="mb-4">
                <h3 class="text-md font-medium text-gray-900">
                  {{
                    editingAnnouncement
                      ? "Edit Announcement"
                      : "New Announcement"
                  }}
                </h3>
              </div>
              <form @submit.prevent="saveAnnouncement">
                <div class="space-y-4">
                  <div>
                    <label
                      for="title"
                      class="block text-sm font-medium text-gray-700"
                      >Title</label
                    >
                    <input
                      type="text"
                      id="title"
                      v-model="announcementForm.title"
                      required
                      class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label
                      for="content"
                      class="block text-sm font-medium text-gray-700"
                      >Content</label
                    >
                    <textarea
                      id="content"
                      v-model="announcementForm.content"
                      rows="5"
                      required
                      class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    ></textarea>
                  </div>

                  <!-- Admin-specific options -->
                  <div v-if="isAdmin">
                    <div>
                      <label class="block text-sm font-medium text-gray-700"
                        >Target Audience</label
                      >
                      <div class="mt-2 space-y-2">
                        <div
                          v-for="role in availableTargetRoles"
                          :key="role.value"
                          class="flex items-center"
                        >
                          <input
                            type="checkbox"
                            :id="`role-${role.value}`"
                            :value="role.value"
                            v-model="announcementForm.targetRoles"
                            class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                          />
                          <label
                            :for="`role-${role.value}`"
                            class="ml-2 block text-sm text-gray-700"
                          >
                            {{ role.label }}
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Teacher-specific options -->
                  <div v-if="isTeacher && !isAdmin">
                    <div>
                      <label
                        for="classSelect"
                        class="block text-sm font-medium text-gray-700"
                        >Class</label
                      >
                      <select
                        id="classSelect"
                        v-model="announcementForm.classId"
                        class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      >
                        <option disabled value="">Select a class</option>
                        <option
                          v-for="cls in userClasses"
                          :key="cls.id"
                          :value="cls.id"
                        >
                          {{ cls.name }}
                        </option>
                      </select>
                    </div>
                  </div>
                </div>
                <div class="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    @click="showNewAnnouncementModal = false"
                    class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    class="bg-gradient-to-br from-indigo-500 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white px-4 py-2 rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    {{ editingAnnouncement ? "Update" : "Publish" }}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <!-- Real-time notification snackbar -->
        <!-- <div
          v-if="notification.show"
          class="fixed bottom-4 right-4 bg-indigo-600 text-white px-4 py-2 rounded-md shadow-lg transition-all duration-300"
          :class="{
            'translate-y-0 opacity-100': notification.show,
            'translate-y-10 opacity-0': !notification.show,
          }"
        >
          <p>{{ notification.message }}</p>
        </div> -->
      </main>
    </div>
  </div>
</template>

<script setup>
import EmptyState from "../emptyState.vue";
import { ref, computed, onMounted, watch } from "vue";
import { useUserStore } from "../../store/userStore";
import { formatDate } from "../../utils/date.holidays";
import { useAnnouncementStore } from "../../store/announcementStore";
import LoadingScreen from "../loadingScreen.vue";
import ErrorScreen from "../errorScreen.vue";

const announcementStore = useAnnouncementStore();

const announcements = computed(() => announcementStore?.announcements);
console.log('announcements:', announcements)

const loading = computed(() => announcementStore.loading);
const error = computed(() => announcementStore.error);

const userStore = useUserStore();

const creators = ref({});
const creatorName = ref("");

const creatorIds = computed(() => announcements.value.map((a) => a.creatorId));

console.log("creatorId:", creatorIds);

async function fetchCreatorName() {
  try {
    const user = await user.findUserById(creatorIds);
    console.log("user:", user);
    // creatorName.value = user.name;
    // creatorSurname.value = user.surname;
  } catch (error) {
    console.error("Error fetching creator details:", error);
    creatorName.value = "Unknown";
  }
}

onMounted(() => {
  fetchCreatorName();
});

const editingAnnouncement = ref(null);
const announcementForm = ref({
  title: "",
  content: "",
  targetRoles: [],
  classId: "",
});

// State
const activeView = ref("main");
const searchQuery = ref("");
const archiveSearchQuery = ref("");
const selectedCategory = ref("");
const selectedTargetRole = ref("");
const showNewAnnouncementModal = ref(false);

// Computed properties
const availableTargetRoles = computed(() => [
  { value: "STUDENT", label: "Students" },
  { value: "TEACHER", label: "Teachers" },
  { value: "PARENT", label: "Parents" },
]);

const userClasses = computed(() => {
  return userStore.userInfo?.classes || [];
});

const resetForm = () => {
  announcementForm.value = {
    title: "",
    content: "",
    targetRoles: [],
    classId: "",
  };
  editingAnnouncement.value = null;
};

// const announcements = computed(() => {
//   const data = announcementStore.announcements;
//   return Array.isArray(data) ? data : [];
// });

const archivedAnnouncements = computed(() => {
  // Temporarily return empty array until archive endpoint is ready
  return [];
});

const filteredAnnouncements = computed(() => {
  let filtered = announcements.value;

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(
      (a) =>
        a.title.toLowerCase().includes(query) ||
        a.content.toLowerCase().includes(query)
    );
  }

  if (selectedCategory.value) {
    filtered = filtered.filter((a) =>
      selectedCategory.value === "class" ? a.classId : !a.classId
    );
  }

  if (selectedTargetRole.value) {
    filtered = filtered.filter((a) =>
      a.targetRoles?.includes(selectedTargetRole.value)
    );
  }

  return filtered;
});

const filteredArchivedAnnouncements = computed(() => {
  if (!archiveSearchQuery.value) return archivedAnnouncements.value;

  const query = archiveSearchQuery.value.toLowerCase();
  return archivedAnnouncements.value.filter(
    (a) =>
      a.title.toLowerCase().includes(query) ||
      a.content.toLowerCase().includes(query)
  );
});

const editAnnouncement = (announcement) => {
  editingAnnouncement.value = announcement;
  announcementForm.value = {
    title: announcement.title,
    content: announcement.content,
    targetRoles: announcement.targetRoles || [],
    classId: announcement.classId || "",
  };
  showNewAnnouncementModal.value = true;
};

const showNotification = (message, type = "success") => {
  console.log(`${type}: ${message}`);
};
// Permissions
const isAdminOrTeacher = computed(() => {
  const role = userStore.userInfo?.role?.toLowerCase();
  return role === "admin" || role === "teacher" || role === "super_admin";
});

const isAdmin = computed(() => {
  const role = userStore.userInfo?.role?.toLowerCase();
  return role === "admin" || role === "super_admin";
});

const isTeacher = computed(() => {
  return userStore.userInfo?.role?.toLowerCase() === "teacher";
});

const canCreateAnnouncement = computed(() => isAdminOrTeacher.value);

const saveAnnouncement = async () => {
  try {
    const formData = {
      ...announcementForm.value,
      creatorId: userStore.userInfo?.id,
      creatorRole: userStore.userInfo?.role,
    };

    if (editingAnnouncement.value) {
      await announcementStore.updateAnnouncement(
        editingAnnouncement.value.id,
        formData
      );
      showNotification("Announcement updated successfully");
    } else {
      await announcementStore.createAnnouncement(formData);
      showNotification("Announcement published successfully");
    }

    resetForm();
    showNewAnnouncementModal.value = false;
  } catch (error) {
    console.error("Failed to save announcement", error);
    showNotification("Failed to save announcement", "error");
  }
};

const canEditAnnouncement = (announcement) => {
  const userId = userStore.userInfo?.id;
  const userRole = userStore.userInfo?.role?.toLowerCase();
  return (
    userRole === "admin" ||
    userRole === "super_admin" ||
    announcement.creatorId === userId
  );
};

const canDeleteAnnouncement = canEditAnnouncement;

// Actions
const markAsRead = async (id) => {
  try {
    await announcementStore.markAsRead(id);
  } catch (error) {
    console.error("Failed to mark as read:", error);
  }
};

const archiveAnnouncement = async (announcement) => {
  try {
    await announcementStore.archiveAnnouncement(announcement.id);
  } catch (error) {
    console.error("Failed to archive:", error);
  }
};

const restoreAnnouncement = async (announcement) => {
  try {
    await announcementStore.restoreAnnouncement(announcement.id);
  } catch (error) {
    console.error("Failed to restore:", error);
  }
};

const deleteAnnouncement = async (id) => {
  if (!confirm("Are you sure you want to delete this announcement?")) return;

  try {
    await announcementStore.deleteAnnouncement(id);
  } catch (error) {
    console.error("Failed to delete:", error);
  }
};

// Helpers
const formatTargetRoles = (roles) => {
  return roles.map((role) => role.toLowerCase()).join(", ");
};

const formatCreatorRole = (role) => {
  return role?.toLowerCase() || "unknown";
};

const handleViewChange = async (newView) => {
  if (newView === "main") {
    await announcementStore.fetchAnnouncements();
  } else if (newView === "archive") {
    console.log("Archive feature coming soon");
    // Uncomment when archive endpoint is ready
    // await announcementStore.fetchArchivedAnnouncements();
  }
};

watch(activeView, handleViewChange);

// Update lifecycle hook
onMounted(async () => {
  try {
    await announcementStore.fetchAnnouncements();
    // Remove or comment out archived announcements fetch
    // await announcementStore.fetchArchivedAnnouncements();
  } catch (error) {
    console.error("Failed to fetch announcements:", error);
  }
});

// onMounted(async () => {
//   if (creatorId) {
//     creator.value = await findUserById(props.creatorId, apolloClient);
//   }
// });
</script>
