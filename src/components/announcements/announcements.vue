<template>
  <div class="rounded border border-gray-300 p-2 w-full">
    <div
      class="min-h-screen bg-gray-50 p-4 rounded-md flex-1 m-1 mt-0 shadow-xl"
    >
      <!-- Main content view -->
      <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
            v-if="activeView === 'main' && filteredAnnouncements.length"
            class="space-y-4 border-t pt-4"
          >
            <div
              v-for="announcement in filteredAnnouncements"
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
                    <span>
                      Posted by
                      {{ formatCreatorRole(announcement.creatorRole) }}
                      <span v-if="announcement.class"
                        >({{ announcement.class.name }})</span
                      >
                    </span>
                  </div>
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

        <div>
          <!-- Empty state for main view -->
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
        <div
          v-if="notification.show"
          class="fixed bottom-4 right-4 bg-indigo-600 text-white px-4 py-2 rounded-md shadow-lg transition-all duration-300"
          :class="{
            'translate-y-0 opacity-100': notification.show,
            'translate-y-10 opacity-0': !notification.show,
          }"
        >
          <p>{{ notification.message }}</p>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import EmptyState from "../emptyState.vue";

// Role enum to match backend
const Roles = {
  SUPER_ADMIN: "SUPER_ADMIN",
  ADMIN: "ADMIN",
  TEACHER: "TEACHER",
  STUDENT: "STUDENT",
  PARENT: "PARENT",
};

// Mock user state - would be from auth store in real app
const currentUser = ref({
  id: "user123",
  role: Roles.TEACHER, // Change to test different roles
  name: "John Smith",
});

const userRole = computed(() => {
  const roles = {
    [Roles.SUPER_ADMIN]: "Super Admin",
    [Roles.ADMIN]: "Admin",
    [Roles.TEACHER]: "Teacher",
    [Roles.STUDENT]: "Student",
    [Roles.PARENT]: "Parent",
  };
  return roles[currentUser.value.role] || "User";
});

const userInitials = computed(() => {
  const nameParts = currentUser.value.name.split(" ");
  if (nameParts.length > 1) {
    return `${nameParts[0][0]}${nameParts[1][0]}`;
  }
  return nameParts[0].substring(0, 2).toUpperCase();
});

// Role-based computed properties
const isAdmin = computed(() =>
  [Roles.ADMIN, Roles.SUPER_ADMIN].includes(currentUser.value.role)
);

const isTeacher = computed(() => currentUser.value.role === Roles.TEACHER);
const isStudent = computed(() => currentUser.value.role === Roles.STUDENT);
const isParent = computed(() => currentUser.value.role === Roles.PARENT);
const isAdminOrTeacher = computed(() => isAdmin.value || isTeacher.value);

const canCreateAnnouncement = computed(() =>
  [Roles.ADMIN, Roles.SUPER_ADMIN, Roles.TEACHER].includes(
    currentUser.value.role
  )
);

// Mock classes for teachers
const userClasses = ref([
  { id: "class1", name: "Grade 10-A" },
  { id: "class2", name: "Grade 11-B" },
  { id: "class3", name: "Grade 9-C" },
]);

// Available target roles based on user's role
const availableTargetRoles = computed(() => {
  if (isAdmin.value) {
    return [
      { value: Roles.TEACHER, label: "All Teachers" },
      { value: Roles.STUDENT, label: "All Students" },
      { value: Roles.PARENT, label: "All Parents" },
    ];
  }

  if (isTeacher.value) {
    return [
      { value: Roles.STUDENT, label: "Students" },
      { value: Roles.PARENT, label: "Parents" },
    ];
  }

  return [];
});

// Announcement state
const announcements = ref([]);
const archivedAnnouncements = ref([]); // New: store for archived announcements
const unreadCount = ref(0);
const searchQuery = ref("");
const archiveSearchQuery = ref(""); // New: separate search for archives
const selectedCategory = ref("");
const selectedTargetRole = ref("");
const showNewAnnouncementModal = ref(false);
const editingAnnouncement = ref(null);
const notification = ref({ show: false, message: "" });
const activeView = ref("main"); // New: track active view (main/archive)

const announcementForm = ref({
  title: "",
  content: "",
  targetRoles: [],
  classId: "",
});

// Filter announcements
const filteredAnnouncements = computed(() => {
  return announcements.value
    .filter((announcement) => {
      // Filter by search query
      if (
        searchQuery.value &&
        !announcement.title
          .toLowerCase()
          .includes(searchQuery.value.toLowerCase()) &&
        !announcement.content
          .toLowerCase()
          .includes(searchQuery.value.toLowerCase())
      ) {
        return false;
      }

      // Filter by category (class vs general)
      if (selectedCategory.value === "class" && !announcement.classId) {
        return false;
      }

      if (selectedCategory.value === "general" && announcement.classId) {
        return false;
      }

      // Filter by target role
      if (
        selectedTargetRole.value &&
        (!announcement.targetRoles ||
          !announcement.targetRoles.includes(selectedTargetRole.value))
      ) {
        return false;
      }

      return true;
    })
    .sort((a, b) => {
      // Unread first, then sort by date
      if (a.isRead !== b.isRead) {
        return a.isRead ? 1 : -1;
      }
      return (
        new Date(b.createdAt || b.updatedAt) -
        new Date(a.createdAt || a.updatedAt)
      );
    });
});

// New: Filter archived announcements
const filteredArchivedAnnouncements = computed(() => {
  return archivedAnnouncements.value
    .filter((announcement) => {
      // Only filter by archive search query
      if (
        archiveSearchQuery.value &&
        !announcement.title
          .toLowerCase()
          .includes(archiveSearchQuery.value.toLowerCase()) &&
        !announcement.content
          .toLowerCase()
          .includes(archiveSearchQuery.value.toLowerCase())
      ) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      // Most recently archived first
      return (
        new Date(b.archivedAt || b.updatedAt || b.createdAt) -
        new Date(a.archivedAt || a.updatedAt || a.createdAt)
      );
    });
});

// Format date for display
const formatDate = (dateString) => {
  if (!dateString) return "";

  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

// Format target roles for display
const formatTargetRoles = (roles) => {
  if (!roles || !roles.length) return "";

  const roleMap = {
    [Roles.TEACHER]: "Teachers",
    [Roles.STUDENT]: "Students",
    [Roles.PARENT]: "Parents",
  };

  return roles.map((role) => roleMap[role] || role).join(", ");
};

// Format creator role for display
const formatCreatorRole = (role) => {
  const roleMap = {
    [Roles.SUPER_ADMIN]: "Admin",
    [Roles.ADMIN]: "Admin",
    [Roles.TEACHER]: "Teacher",
  };

  return roleMap[role] || role;
};

// Check if user can edit announcement
const canEditAnnouncement = (announcement) => {
  if (isAdmin.value) return true;

  if (isTeacher.value) {
    // Teachers can edit their own announcements
    return announcement.creatorId === currentUser.value.id;
  }

  return false;
};

// Check if user can delete announcement
const canDeleteAnnouncement = (announcement) => {
  if (isAdmin.value) return true;

  if (isTeacher.value) {
    // Teachers can delete their own announcements
    return announcement.creatorId === currentUser.value.id;
  }

  return false;
};

// Edit announcement
const editAnnouncement = (announcement) => {
  editingAnnouncement.value = announcement;
  announcementForm.value = {
    title: announcement.title,
    content: announcement.content,
    targetRoles: [...(announcement.targetRoles || [])],
    classId: announcement.classId || "",
  };
  showNewAnnouncementModal.value = true;
};

// Delete announcement
const deleteAnnouncement = async (id) => {
  if (confirm("Are you sure you want to delete this announcement?")) {
    try {
      // This would be an API call in a real app
      // await api.delete(`/announcements/${id}`);

      // For now, just remove from local state
      announcements.value = announcements.value.filter((a) => a.id !== id);

      // Show notification
      showNotification("Announcement deleted successfully");
    } catch (error) {
      console.error("Failed to delete announcement", error);
      showNotification("Failed to delete announcement");
    }
  }
};

// Mark as read
const markAsRead = async (id) => {
  try {
    // This would be an API call in a real app
    // await api.post(`/announcements/${id}/read`);

    // Update local state
    const index = announcements.value.findIndex((a) => a.id === id);
    if (index !== -1) {
      announcements.value[index].isRead = true;

      // Update unread count
      unreadCount.value = Math.max(0, unreadCount.value - 1);
    }
  } catch (error) {
    console.error("Failed to mark announcement as read", error);
  }
};

// Hide announcement (personal delete)
const hideAnnouncement = async (id) => {
  try {
    // This would be an API call in a real app
    // await api.post(`/announcements/${id}/hide`);

    // For now, just remove from local state
    announcements.value = announcements.value.filter((a) => a.id !== id);

    // Show notification
    showNotification("Announcement hidden");
  } catch (error) {
    console.error("Failed to hide announcement", error);
    showNotification("Failed to hide announcement");
  }
};

// Save announcement
const saveAnnouncement = async () => {
  try {
    const formData = {
      ...announcementForm.value,
      // Add required fields based on role
      creatorId: currentUser.value.id,
      creatorRole: currentUser.value.role,
    };

    let savedAnnouncement;

    if (editingAnnouncement.value) {
      // Update existing announcement - would be API call in real app
      // const response = await api.put(`/announcements/${editingAnnouncement.value.id}`, formData);
      // savedAnnouncement = response.data;

      // For now, update locally
      const index = announcements.value.findIndex(
        (a) => a.id === editingAnnouncement.value.id
      );
      if (index !== -1) {
        savedAnnouncement = {
          ...announcements.value[index],
          ...formData,
          updatedAt: new Date().toISOString(),
        };
        announcements.value[index] = savedAnnouncement;
      }

      showNotification("Announcement updated successfully");
    } else {
      // Create new announcement - would be API call in real app
      // const response = await api.post('/announcements', formData);
      // savedAnnouncement = response.data;

      // For now, create locally
      savedAnnouncement = {
        ...formData,
        id: `ann_${Date.now()}`,
        createdAt: new Date().toISOString(),
        isRead: true, // Creator has read their own announcement
      };
      announcements.value.unshift(savedAnnouncement);

      showNotification("Announcement published successfully");
    }

    // Reset form and close modal
    resetForm();
    showNewAnnouncementModal.value = false;
  } catch (error) {
    console.error("Failed to save announcement", error);
    showNotification("Failed to save announcement");
  }
};

// Reset form
const resetForm = () => {
  announcementForm.value = {
    title: "",
    content: "",
    targetRoles: [],
    classId: "",
  };
  editingAnnouncement.value = null;
};

// Show notification
const showNotification = (message) => {
  notification.value = { show: true, message };

  // Auto-hide after 3 seconds
  setTimeout(() => {
    notification.value.show = false;
  }, 3000);
};

// Mock WebSocket for real-time updates
let mockWebSocket = null;

const setupWebSocketListeners = () => {
  // This would be a real WebSocket in production
  mockWebSocket = {
    onNewAnnouncement: (data) => {
      // Add new announcement to the list
      const newAnnouncement = {
        ...data,
        isRead: false,
      };

      announcements.value.unshift(newAnnouncement);
      unreadCount.value++;

      showNotification("New announcement received");
    },

    onAnnouncementUpdated: (data) => {
      // Update existing announcement
      const index = announcements.value.findIndex((a) => a.id === data.id);
      if (index !== -1) {
        announcements.value[index] = {
          ...announcements.value[index],
          ...data,
          updatedAt: new Date().toISOString(),
        };

        showNotification("An announcement has been updated");
      }
    },

    disconnect: () => {
      // Clean up websocket
      console.log("WebSocket disconnected");
    },
  };
};

// Fetch announcements and unread count
const fetchAnnouncements = async () => {
  try {
    // This would be an API call in a real app
    // const response = await api.get('/announcements', { params: { page: 1, limit: 20 } });
    // announcements.value = response.data.items;

    // For now, use mock data
    announcements.value = [
      {
        id: "ann1",
        title: "School Closed Due to Weather",
        content:
          "Due to the expected snowstorm, school will be closed tomorrow. Stay safe and warm!",
        creatorId: "admin1",
        creatorRole: Roles.ADMIN,
        targetRoles: [Roles.TEACHER, Roles.STUDENT, Roles.PARENT],
        createdAt: "2025-03-10T08:00:00Z",
        isRead: false,
      },
      {
        id: "ann2",
        title: "Parent-Teacher Conference Schedule",
        content:
          "The parent-teacher conferences are scheduled for next week. Please check the attached schedule and sign up for your preferred time slot.",
        creatorId: currentUser.value.id,
        creatorRole: Roles.TEACHER,
        classId: "class1",
        targetRoles: [Roles.PARENT],
        createdAt: "2025-03-09T14:30:00Z",
        isRead: true,
      },
      {
        id: "ann3",
        title: "Math Quiz Reminder",
        content:
          "Reminder that the algebra quiz will be held tomorrow. Topics covered: linear equations, quadratic functions, and polynomials.",
        creatorId: currentUser.value.id,
        creatorRole: Roles.TEACHER,
        classId: "class2",
        createdAt: "2025-03-08T10:15:00Z",
        isRead: false,
      },
      {
        id: "ann4",
        title: "New Curriculum Updates",
        content:
          "Please review the updated curriculum guidelines for the next semester. Important changes have been made to the science and math programs.",
        creatorId: "admin2",
        creatorRole: Roles.ADMIN,
        targetRoles: [Roles.TEACHER],
        createdAt: "2025-03-07T09:00:00Z",
        isRead: false,
      },
    ];

    // Count unread announcements
    unreadCount.value = announcements.value.filter((a) => !a.isRead).length;
  } catch (error) {
    console.error("Failed to fetch announcements", error);
  }
};

// Lifecycle hooks
onMounted(() => {
  fetchAnnouncements();
  setupWebSocketListeners();
});

onUnmounted(() => {
  if (mockWebSocket) {
    mockWebSocket.disconnect();
  }
});
</script>
