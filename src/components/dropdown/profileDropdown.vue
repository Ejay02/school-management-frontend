<template>
  <div
    class="absolute top-20 right-4 z-50 w-64 rounded-md bg-white p-3 shadow-md"
    style="isolation: isolate"
  >
    <!-- Profile -->
    <div
      class="grid grid-cols-[auto,1fr] items-center gap-x-1 rounded-md border-b border-gray-300 px-2 py-1.5 hover:bg-eduSkyLight group"
    >
      <div class="relative shrink-0">
        <img
          v-if="userStore?.userInfo?.image"
          :src="userStore?.userInfo?.image"
          :alt="`${displayName} image`"
          class="w-12 h-12 rounded-full object-cover border-2 border-indigo-200 shadow-sm"
        />

        <div
          v-else
          class="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white shadow-sm border-2 border-indigo-200 capitalize"
        >
          {{ initials }}
        </div>
      </div>

      <div class="-ml-1 min-w-0 leading-none">
        <span
          class="block text-sm font-medium text-gray-800 group-hover:text-indigo-500 capitalize"
        >
          {{ displayName }}
        </span>
        <span
          class="mt-0.5 block break-all text-xs text-gray-400 group-hover:text-indigo-500"
          :title="userStore?.userInfo?.email"
        >
          {{ userStore?.userInfo?.email }}
        </span>
        <div
          v-if="roleId"
          class="mt-0.5 flex items-center gap-2 text-[11px] text-gray-400 group-hover:text-indigo-500"
          :title="roleId"
        >
          <span class="truncate">ID: {{ roleId }}</span>
          <i
            class="fa-regular fa-copy cursor-pointer text-xs"
            @click.stop="copyRoleId"
          ></i>
        </div>
      </div>
    </div>

    <!-- Settings -->
    <router-link
      to="/settings/profile"
      class="flex items-center gap-3 p-2 border-b border-gray-300 hover:bg-eduSkyLight rounded-md group"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="w-6 h-6 text-gray-700 group-hover:text-indigo-500"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z"
        />
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
        />
      </svg>
      <span class="text-sm text-gray-800 group-hover:text-indigo-500">
        Manage Account
      </span>
    </router-link>

    <!-- Logout -->
    <div
      class="flex items-center gap-3 p-2 hover:bg-eduSkyLight rounded-md cursor-pointer group"
      @click="logout"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="w-6 h-6 text-gray-700 group-hover:text-indigo-500"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
        />
      </svg>
      <span class="text-sm text-gray-800 group-hover:text-indigo-500"
        >Logout</span
      >
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useMutation } from "@vue/apollo-composable";
import { useUserStore } from "../../store/userStore";
import { logoutMutation } from "../../graphql/mutations";
import { useNotificationStore } from "../../store/notification";
import { formatPersonName, getInitials } from "../../utils/displayValue";
import { formatAuthErrorMessage } from "../../utils/graphqlError";
import { apolloClient } from "../../../apollo-client";

const router = useRouter();
const userStore = useUserStore();
const notificationStore = useNotificationStore();
const displayName = computed(() =>
  formatPersonName(userStore?.userInfo?.name, userStore?.userInfo?.surname, ""),
);
const initials = computed(() =>
  getInitials(userStore?.userInfo?.name, userStore?.userInfo?.surname),
);

const roleId = computed(() => {
  const role = String(userStore?.userInfo?.role || "").toLowerCase();
  if (role === "admin" || role === "super_admin")
    return userStore?.userInfo?.adminId;
  if (role === "teacher") return userStore?.userInfo?.teacherId;
  if (role === "student") return userStore?.userInfo?.studentId;
  if (role === "parent") return userStore?.userInfo?.id;
  return "";
});

const copyRoleId = async () => {
  if (!roleId.value) return;
  try {
    await navigator.clipboard.writeText(roleId.value);
    notificationStore.addNotification({
      type: "info",
      message: "ID copied to clipboard!",
    });
  } catch (error) {
    notificationStore.addNotification({
      type: "error",
      message: `Failed to copy ID: ${error.message}`,
    });
  }
};

onMounted(() => {
  if (!roleId.value) {
    userStore.syncCurrentUser(apolloClient);
  }
});

const { mutate: logoutMutate } = useMutation(logoutMutation);

const logout = async () => {
  try {
    const refreshToken =
      localStorage.getItem("refreshToken") || userStore.userInfo.refreshToken;

    if (refreshToken) {
      await logoutMutate({
        refreshToken: refreshToken,
      });

      userStore.clearUser();
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      router.push("/");
      notificationStore.addNotification({
        type: "success",
        message: "Logged out successfully",
      });
    }
  } catch (e) {
    // Still clear everything even if the mutation fails
    userStore.clearUser();
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    router.push("/");
    notificationStore.addNotification({
      type: "error",
      message: formatAuthErrorMessage(e, "Logged out locally"),
    });
  }
};
</script>
