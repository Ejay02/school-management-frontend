<template>
  <div v-if="loading" class="flex justify-center items-center min-h-screen">
    <LoadingScreen />
  </div>
  <div v-else-if="error" class="flex justify-center items-center min-h-screen">
    <ErrorScreen :message="error" />
  </div>
  <div v-else class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="bg-white shadow-lg rounded-lg overflow-hidden">
      <div class="p-6">
        <div class="flex justify-between items-center mb-6">
          <div class="flex items-center space-x-4">
            <button @click="goBack" class="text-gray-600 hover:text-gray-900">
              <i class="fas fa-arrow-left"></i>
            </button>
            <h1 class="text-2xl font-bold text-gray-900">{{ announcement?.title }}</h1>
          </div>
          <div class="flex items-center space-x-2">
            <span v-if="announcement?.classId" class="px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
              {{ announcement?.class?.name }}
            </span>
            <span v-if="announcement?.targetRoles?.length" class="px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800">
              {{ formatTargetRoles(announcement.targetRoles) }}
            </span>
          </div>
        </div>

        <div class="prose max-w-none" v-html="announcement?.content"></div>

        <div class="mt-6 flex justify-between items-center pt-4 border-t">
          <div class="flex items-center space-x-2">
            <img 
              :src="creator?.img || '/default-avatar.png'" 
              class="w-10 h-10 rounded-full"
              alt="Creator avatar"
            />
            <div>
              <p class="text-sm font-medium text-gray-900">
                {{ getCreatorName }}
              </p>
              <p class="text-sm text-gray-500">
                Posted {{ formatDate(announcement?.createdAt) }}
              </p>
            </div>
          </div>
          
          <div class="flex space-x-2">
            <button
              v-if="canArchive"
              @click="handleArchive"
              class="px-4 py-2 text-sm font-medium rounded-md shadow-sm"
              :class="announcement?.isArchived 
                ? 'bg-green-50 text-green-700 hover:bg-green-100' 
                : 'bg-gray-50 text-gray-700 hover:bg-gray-100'"
            >
              <i :class="announcement?.isArchived ? 'fa-solid fa-box-open' : 'fa-solid fa-box'"></i>
              {{ announcement?.isArchived ? 'Unarchive' : 'Archive' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useUserStore } from '../../store/userStore';
import { useAnnouncementStore } from '../../store/announcementStore';
import { useApolloClient } from '@vue/apollo-composable';
import { formatDate } from '../../utils/date.holidays';
import { useNavigation } from '../../composables/useNavigation';
import LoadingScreen from '../loadingScreen.vue';
import ErrorScreen from '../errorScreen.vue';

const route = useRoute();
const router = useRouter();
const { goBack } = useNavigation();
const { client } = useApolloClient();

const userStore = useUserStore();
const announcementStore = useAnnouncementStore();

const announcement = ref(null);
const creator = ref(null);
const loading = ref(true);
const error = ref(null);

const canArchive = computed(() => {
  const userRole = userStore.userInfo?.role?.toLowerCase();
  return userRole === 'admin' || userRole === 'super_admin' || 
         announcement.value?.creatorId === userStore.userInfo?.id;
});

const getCreatorName = computed(() => {
  if (!creator.value) return '';
  return creator.value.name 
    ? `${creator.value.name} ${creator.value.surname || ''}`.trim()
    : creator.value.email;
});

const formatTargetRoles = (roles) => {
  return roles.map(role => role.toLowerCase()).join(', ');
};

const handleArchive = async () => {
  try {
    if (announcement.value.isArchived) {
      await announcementStore.restoreAnnouncement(announcement.value.id);
    } else {
      await announcementStore.archiveAnnouncement(announcement.value.id);
    }
    announcement.value.isArchived = !announcement.value.isArchived;
  } catch (err) {
    error.value = 'Failed to update archive status';
  }
};

const fetchAnnouncement = async () => {
  try {
    const data = await announcementStore.fetchAnnouncementById(route.params.id);
    announcement.value = data;
    
    // Mark as read when viewing
    if (!announcement.value.isRead) {
      await announcementStore.markAsRead(announcement.value.id);
    }

    // Fetch creator details
    if (announcement.value.creatorId) {
      creator.value = await userStore.findUserById(announcement.value.creatorId, client);
    }
  } catch (err) {
    error.value = 'Failed to load announcement';
  } finally {
    loading.value = false;
  }
};

onMounted(fetchAnnouncement);
</script>