<template>
  <div class="container mx-auto rounded border border-gray-300 p-2 w-full">
    <div class="max-w-7xl mx-auto bg-white rounded-lg shadow-md">
      <div
        class="bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-6 rounded-t-lg"
      >
        <h1 class="text-2xl font-bold">
          {{ isEditing ? "Edit Event" : "Create New Event" }}
        </h1>
      </div>

      <div class="p-6">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Title -->
          <div>
            <label
              for="title"
              class="block text-sm font-medium text-gray-700 mb-1"
            >
              Title <span class="text-red-500">*</span>
            </label>
            <input
              v-model="title"
              type="text"
              id="title"
              required
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <!-- Date and Time -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                for="date"
                class="block text-sm font-medium text-gray-700 mb-1"
              >
                Date <span class="text-red-500">*</span>
              </label>
              <input
                v-model="date"
                type="date"
                id="date"
                required
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label
                for="time"
                class="block text-sm font-medium text-gray-700 mb-1"
              >
                Time <span class="text-red-500">*</span>
              </label>
              <div class="grid grid-cols-2 gap-2">
                <input
                  v-model="startTime"
                  type="time"
                  id="startTime"
                  required
                  placeholder="Start"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                <input
                  v-model="endTime"
                  type="time"
                  id="endTime"
                  required
                  placeholder="End"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>
          </div>

          <!-- Location -->
          <div>
            <label
              for="location"
              class="block text-sm font-medium text-gray-700 mb-1"
            >
              Location <span class="text-red-500">*</span>
            </label>
            <input
              v-model="location"
              type="text"
              id="location"
              required
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <!-- Target Audience -->
          <div>
            <label for="targetAudience" class="block text-sm font-medium text-gray-700 mb-1">
              Target Audience <span class="text-red-500">*</span>
            </label>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div class="flex items-center">
                <input
                  id="target-all"
                  v-model="targetRoles"
                  type="checkbox"
                  value="ALL"
                  class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label
                  for="target-all"
                  class="ml-2 block text-sm text-gray-700"
                >
                  All
                </label>
              </div>
              <div class="flex items-center">
                <input
                  id="target-admin"
                  v-model="targetRoles"
                  type="checkbox"
                  value="ADMIN"
                  class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label
                  for="target-admin"
                  class="ml-2 block text-sm text-gray-700"
                >
                  Admins
                </label>
              </div>
              <div class="flex items-center">
                <input
                  id="target-teacher"
                  v-model="targetRoles"
                  type="checkbox"
                  value="TEACHER"
                  class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label
                  for="target-teacher"
                  class="ml-2 block text-sm text-gray-700"
                >
                  Teachers
                </label>
              </div>
              <div class="flex items-center">
                <input
                  id="target-student"
                  v-model="targetRoles"
                  type="checkbox"
                  value="STUDENT"
                  class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label
                  for="target-student"
                  class="ml-2 block text-sm text-gray-700"
                >
                  Students
                </label>
              </div>
              <div class="flex items-center">
                <input
                  id="target-parent"
                  v-model="targetRoles"
                  type="checkbox"
                  value="PARENT"
                  class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label
                  for="target-parent"
                  class="ml-2 block text-sm text-gray-700"
                >
                  Parents
                </label>
              </div>
              <div class="flex items-center">
                <input
                  id="target-none"
                  v-model="targetRoles"
                  type="checkbox"
                  value="NONE"
                  class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label
                  for="target-none"
                  class="ml-2 block text-sm text-gray-700"
                >
                  None
                </label>
              </div>
            </div>
          </div>

          <!-- Class Selection (Optional) -->
          <div>
            <label
              for="class"
              class="block text-sm font-medium text-gray-700 mb-1"
            >
              Class (Optional)
            </label>
            <select
              v-model="selectedClass"
              id="class"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="">All Classes</option>
              <option
                v-for="classItem in classes"
                :key="classItem.id"
                :value="classItem.id"
              >
                {{ classItem.name }}
              </option>
            </select>
          </div>

          <!-- Description -->
          <div>
            <label
              for="description"
              class="block text-sm font-medium text-gray-700 mb-1"
            >
              Description <span class="text-red-500">*</span>
            </label>
            <textarea
              v-model="description"
              id="description"
              rows="5"
              required
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            ></textarea>
          </div>

          <!-- Action Buttons -->
          <div class="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              @click="goBack"
              class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="loading"
              class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center"
            >
              <svg
                v-if="loading"
                class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              {{ isEditing ? "Update Event" : "Create Event" }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { apolloClient } from "../../../apollo-client";
import { useNavigation } from "../../composables/useNavigation";
import { createEvent, updateEvent } from "../../graphql/mutations";
import { getEventById } from "../../graphql/queries";
import { useClassStore } from "../../store/classStore";
import { useEventStore } from "../../store/eventStore";
import { useNotificationStore } from "../../store/notification";

const route = useRoute();
const router = useRouter();
const notificationStore = useNotificationStore();
const eventStore = useEventStore();
const classStore = useClassStore();
const { goBack } = useNavigation();

// Form data
const title = ref("");
const date = ref("");
const startTime = ref("");
const endTime = ref("");
const location = ref("");
const description = ref("");
const targetRoles = ref([]);
const selectedClass = ref("");
const loading = ref(false);
const event = ref(null);

// Computed properties
const isEditing = computed(() => !!route.params.id);
const eventId = computed(() => route.params.id);
const classes = computed(() => classStore.classes);

// Fetch classes and event data if editing
onMounted(async () => {
  loading.value = true;

  try {
    // Fetch classes for dropdown
    if (classStore.classes.length === 0) {
      await classStore.fetchClasses();
    }

    // If editing, fetch event details
    if (isEditing.value) {
      await fetchEventDetails();
    }
  } catch (error) {
    notificationStore.addNotification({
      type: "error",
      message: `Error initializing form: ${error.message}`,
    });
    console.error("Error initializing form:", error);
  } finally {
    loading.value = false;
  }
});

// Fetch event details if editing
const fetchEventDetails = async () => {
  try {
    // First check if the event is already in the store
    const cachedEvent = eventStore.allEvents.find(
      (e) => e.id === eventId.value
    );

    if (cachedEvent) {
      event.value = cachedEvent;
      console.log("Using cached event:", event.value);
    } else {
      // If not in store, fetch from API
      const { data } = await apolloClient.query({
        query: getEventById,
        variables: { id: eventId.value },
        fetchPolicy: "network-only",
      });

      event.value = data.getEventById;
      console.log("Fetched event from API:", event.value);
    }

    // Populate form with event data
    if (event.value) {
      title.value = event.value.title || "";
      location.value = event.value.location || "";
      description.value = event.value.description || "";

      // Format date from event.date (YYYY-MM-DD)
      if (event.value.date) {
        const eventDate = new Date(event.value.date);
        date.value = eventDate.toISOString().split("T")[0];
      }

      // Handle start and end times from startTime and endTime fields
      if (event.value.startTime) {
        // If it's a full ISO date string, extract just the time part
        if (event.value.startTime.includes("T")) {
          const startDate = new Date(event.value.startTime);
          startTime.value = `${startDate
            .getHours()
            .toString()
            .padStart(2, "0")}:${startDate
            .getMinutes()
            .toString()
            .padStart(2, "0")}`;
        } else {
          // If it's already in HH:MM format
          startTime.value = event.value.startTime.substring(0, 5);
        }
      }

      if (event.value.endTime) {
        // If it's a full ISO date string, extract just the time part
        if (event.value.endTime.includes("T")) {
          const endDate = new Date(event.value.endTime);
          endTime.value = `${endDate
            .getHours()
            .toString()
            .padStart(2, "0")}:${endDate
            .getMinutes()
            .toString()
            .padStart(2, "0")}`;
        } else {
          // If it's already in HH:MM format
          endTime.value = event.value.endTime.substring(0, 5);
        }
      }

      // Handle target roles - ensure it's an array
      if (event.value.targetRoles) {
        if (Array.isArray(event.value.targetRoles)) {
          targetRoles.value = [...event.value.targetRoles];
        } else if (typeof event.value.targetRoles === "string") {
          // If it's a comma-separated string
          if (event.value.targetRoles.includes(",")) {
            targetRoles.value = event.value.targetRoles
              .split(",")
              .map((role) => role.trim());
          } else {
            targetRoles.value = [event.value.targetRoles];
          }
        }
      }

      // Handle class selection
      selectedClass.value = event.value.classId || "";

      console.log("Form populated with values:", {
        title: title.value,
        date: date.value,
        startTime: startTime.value,
        endTime: endTime.value,
        location: location.value,
        targetRoles: targetRoles.value,
        selectedClass: selectedClass.value,
      });
    }
  } catch (error) {
    notificationStore.addNotification({
      type: "error",
      message: `Error fetching event: ${error.message}`,
    });
    console.error("Error fetching event:", error);
  }
};

// Submit form
const handleSubmit = async () => {
  loading.value = true;

  try {
    // Validate form
    if (
      !title.value ||
      !date.value ||
      !startTime.value ||
      !location.value ||
      !description.value
    ) {
      throw new Error("Please fill in all required fields");
    }

    if (targetRoles.value.length === 0) {
      throw new Error("Please select at least one target audience");
    }

    // Create event data object
    const eventData = {
      title: title.value,
      date: date.value, // YYYY-MM-DD format
      startTime: startTime.value, // HH:MM format
      endTime: endTime.value || startTime.value, // Use startTime as fallback
      location: location.value,
      description: description.value,
      targetRoles: targetRoles.value,
      classId: selectedClass.value || null,
    };

    console.log("Submitting event data:", eventData);

    let result;

    if (isEditing.value) {
      // Update existing event
      const { data } = await apolloClient.mutate({
        mutation: updateEvent,
        variables: {
          eventId: eventId.value,
          updateEventInput: eventData,
        },
      });

      result = data.updateEvent;

      // Update the event in the store
      eventStore.updateEvent(result);

      notificationStore.addNotification({
        type: "success",
        message: "Event updated successfully!",
      });
    } else {
      // Create new event
      const { data } = await apolloClient.mutate({
        mutation: createEvent,
        variables: {
          createEventInput: eventData,
        },
      });

      result = data.createEvent;

      // Add the new event to the store
      eventStore.addNewEvent(result);

      notificationStore.addNotification({
        type: "success",
        message: "Event created successfully!",
      });
    }

    // Refresh events in the store
    await eventStore.refreshEvents();

    // Navigate back to events list or event view
    if (isEditing.value) {
      router.push(`/event/${eventId.value}`);
    } else {
      router.push("/events");
    }
  } catch (error) {
    notificationStore.addNotification({
      type: "error",
      message: `Error saving event: ${error.message}`,
    });
    console.error("Error saving event:", error);
  } finally {
    loading.value = false;
  }
};
</script>
