import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { apolloClient } from "../../apollo-client";
import {
  getAllAdminUsers,
  getSetupStateQuery,
  getUserById,
} from "../graphql/queries";
import { menuItems } from "../utils";
import {
  PROFILE_COMPLETION_STORAGE_KEY,
  getIncompleteProfileFieldLabels,
  isProfileComplete,
} from "../utils/profileCompletion";
import { useNotificationStore } from "./notification";

export const useUserStore = defineStore("user", () => {
  // Initialize state from localStorage if available
  const getInitialUserState = () => {
    const savedUser = localStorage.getItem("userInfo");
    return savedUser
      ? JSON.parse(savedUser)
      : {
          id: null,
          adminId: "",
          teacherId: "",
          studentId: "",
          institutionalEmail: "",
          name: "",
          email: "",
          role: "",
          address: "",
          bloodType: "",
          surname: "",
          sex: "",
          phone: "",
          token: "",
          refreshToken: "",
          image: "",
          dateOfBirth: "",
          aboutMe: "",
        };
  };

  const userInfo = ref(getInitialUserState());
  const requiresProfileCompletion = ref(
    localStorage.getItem(PROFILE_COMPLETION_STORAGE_KEY) === "true",
  );

  const currentRole = ref(userInfo.value.role.toLowerCase() || "");
  const schoolInfo = ref({ schoolName: "", schoolLogo: "" });

  const notificationStore = useNotificationStore();

  const userCache = ref({});
  const loading = ref(false);
  const error = ref(null);

  const allUsers = ref({ admins: [], teachers: [] });

  const totalPages = ref(1);
  const hasMore = ref(false);
  const totalCount = ref(0);

  const setProfileCompletionRequired = (required) => {
    requiresProfileCompletion.value = required;

    if (required) {
      localStorage.setItem(PROFILE_COMPLETION_STORAGE_KEY, "true");
      return;
    }

    localStorage.removeItem(PROFILE_COMPLETION_STORAGE_KEY);
  };

  const syncProfileCompletionState = (userData = userInfo.value) => {
    if (
      requiresProfileCompletion.value &&
      isProfileComplete(userData, userData.role)
    ) {
      setProfileCompletionRequired(false);
    }
  };

  // Updated setUser to handle persistence and refresh token
  const setUser = (user) => {
    const normalizedRole = String(user.role || "")
      .trim()
      .toLowerCase();

    const userData = {
      id: user.userId,
      adminId: user.adminId || "",
      teacherId: user.teacherId || "",
      studentId: user.studentId || "",
      institutionalEmail: user.institutionalEmail || "",
      name: user.name,
      surname: user.surname,
      email: user.email,
      role: user.role,
      address: user.address,
      bloodType: user.bloodType,
      sex: user.sex,
      phone: user.phone,
      token: user.token,
      refreshToken: user.refreshToken,
      image: user.image,
      username: user.username,
      dateOfBirth: user.dateOfBirth,
      aboutMe: user.aboutMe,
    };

    userInfo.value = userData;
    currentRole.value = normalizedRole;

    // Persist to localStorage
    localStorage.setItem("userInfo", JSON.stringify(userData));
    syncProfileCompletionState(userData);
  };

  const applySchoolBranding = (nextSchoolInfo = schoolInfo.value) => {
    const title = nextSchoolInfo?.schoolName?.trim() || "My School";
    document.title = title;

    const href = nextSchoolInfo?.schoolLogo?.trim();
    if (!href) return;

    const existing =
      document.querySelector("link[rel='icon']") ||
      document.querySelector("link[rel='shortcut icon']") ||
      document.querySelector("link[rel*='icon']");

    const link = existing || document.createElement("link");
    link.setAttribute("rel", "icon");
    link.setAttribute("href", href);
    if (!existing) document.head.appendChild(link);
  };

  const setSchoolInfo = (setupState) => {
    schoolInfo.value = {
      schoolName: setupState?.schoolName || "",
      schoolLogo: setupState?.schoolLogo || "",
    };

    applySchoolBranding(schoolInfo.value);
  };

  const fetchSchoolInfo = async () => {
    const token = localStorage.getItem("token") || userInfo.value?.token;
    if (!token) return null;

    const { data } = await apolloClient.query({
      query: getSetupStateQuery,
      fetchPolicy: "network-only",
    });

    if (data?.getSetupState) {
      setSchoolInfo(data.getSetupState);
      return data.getSetupState;
    }

    return null;
  };

  // New method to update user profile after mutation
  const updateUserProfile = (userData) => {
    // Preserve existing data that might not be returned from the API
    const updatedUserData = {
      ...userInfo.value,
      ...userData,
      userId: userInfo.value.id, // Ensure userId is preserved
      role: userInfo.value.role, // Preserve role
      token: userInfo.value.token, // Preserve token
      refreshToken: userInfo.value.refreshToken, // Preserve refreshToken
    };

    setUser(updatedUserData);
  };

  const syncCurrentUser = async (apolloClient) => {
    if (!userInfo.value?.id) return null;

    const currentUser = await findUserById(userInfo.value.id, apolloClient);
    if (!currentUser) return null;

    const normalizedUser = {
      ...currentUser,
      role:
        currentUser.role ||
        currentUser.adminRole ||
        currentUser.teacherRole ||
        currentUser.studentRole ||
        currentUser.parentRole ||
        userInfo.value.role,
      email:
        currentUser.institutionalEmail ||
        currentUser.email ||
        userInfo.value.email,
      institutionalEmail:
        currentUser.institutionalEmail || userInfo.value.institutionalEmail,
    };

    updateUserProfile(normalizedUser);
    return normalizedUser;
  };

  const setRole = (role) => {
    if (
      ["super_admin", "admin", "teacher", "student", "parent"].includes(role)
    ) {
      currentRole.value = role;
      userInfo.value.role = role.toUpperCase();
      // Update persisted data
      localStorage.setItem("userInfo", JSON.stringify(userInfo.value));
    } else {
      notificationStore.addNotification({
        type: "warning",
        message: `Invalid role specified: ${role}`,
      });
    }
  };

  // Clear all user data on logout
  const clearUser = () => {
    userInfo.value = getInitialUserState();
    currentRole.value = "";
    localStorage.removeItem("userInfo");
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("bannerDismissed");
    setProfileCompletionRequired(false);
  };

  // Updated to handle super_admin same as admin
  const filteredMenuItems = computed(() => {
    return menuItems.map((section) => ({
      ...section,
      items: section.items
        .filter((item) => {
          const role = currentRole.value.toLowerCase();

          if (role.toLowerCase() === "super_admin") {
            return item.visible.includes("admin");
          }
          return item.visible.includes(role);
        })
        .map((item) => {
          const role = currentRole.value.toLowerCase();
          return {
            ...item,
            label: item.roleLabels?.[role] || item.label,
          };
        }),
    }));
  });

  const hasAccess = (route) => {
    const allMenuItems = menuItems.flatMap((section) => section.items);
    const menuItem = allMenuItems.find((item) => item.href === route);

    if (currentRole.value === "super_admin") {
      return menuItem ? menuItem.visible.includes("admin") : false;
    }
    return menuItem ? menuItem.visible.includes(currentRole.value) : false;
  };

  const findUserById = async (id, apolloClient) => {
    if (!id) return null;

    // Check cache first
    if (userCache.value[id]) {
      return userCache.value[id];
    }

    loading.value = true;
    error.value = null;

    try {
      const { data } = await apolloClient.query({
        query: getUserById,
        variables: { id },
        fetchPolicy: "network-only",
      });

      if (data?.getUserById) {
        userCache.value[id] = data.getUserById;
        return data.getUserById;
      }
      return null;
    } catch (error) {
      notificationStore.addNotification({
        type: "error",
        message: `Failed to fetch user details for ID ${id}:`,
        error,
      });

      return null;
    } finally {
      loading.value = false;
    }
  };

  const fetchAdminUsers = async (
    apolloClient,
    { page = 1, limit = 10 } = {},
  ) => {
    loading.value = true;
    error.value = null;
    try {
      if (
        allUsers.value.admins.length === 0 &&
        allUsers.value.teachers.length === 0
      ) {
        const { data } = await apolloClient.query({
          query: getAllAdminUsers,
          fetchPolicy: "network-only",
        });

        if (data?.getAllAdminUsers) {
          allUsers.value = {
            admins: data.getAllAdminUsers.admins || [],
            teachers: data.getAllAdminUsers.teachers || [],
          };

          totalCount.value =
            allUsers.value.admins.length + allUsers.value.teachers.length;
          totalPages.value = Math.ceil(totalCount.value / limit);
        }
      }
      const allCombined = [
        ...allUsers.value.admins,
        ...allUsers.value.teachers,
      ];
      const start = (page - 1) * limit;
      const end = start + limit;
      const paginatedCombined = allCombined.slice(start, end);

      // Set hasMore flag
      hasMore.value = end < totalCount.value;

      return {
        admins: paginatedCombined.filter(
          (user) => user.role === "ADMIN" || user.role === "admin",
        ),
        teachers: paginatedCombined.filter(
          (user) => user.role === "TEACHER" || user.role === "teacher",
        ),
        totalPages: totalPages.value,
        hasMore: hasMore.value,
      };
    } catch (error) {
      notificationStore.addNotification({
        type: "error",
        message: `${error.message}`,
      });
      return { admins: [], teachers: [] };
    } finally {
      loading.value = false;
    }
  };

  const refreshUsers = async (apolloClient, paginationOptions) => {
    // Reset users to force a fresh fetch
    allUsers.value = { admins: [], teachers: [] };
    return await fetchAdminUsers(apolloClient, paginationOptions);
  };

  const incompleteProfileFields = computed(() => {
    if (!requiresProfileCompletion.value) return [];
    return getIncompleteProfileFieldLabels(userInfo.value, currentRole.value);
  });

  return {
    error,
    setUser,
    setRole,
    loading,
    clearUser,
    incompleteProfileFields,
    totalPages,
    hasMore,
    totalCount,
    requiresProfileCompletion,
    setProfileCompletionRequired,
    userInfo,
    hasAccess,
    currentRole,
    schoolInfo,
    setSchoolInfo,
    fetchSchoolInfo,
    refreshUsers,
    findUserById,
    syncCurrentUser,
    fetchAdminUsers,
    filteredMenuItems,
    updateUserProfile,
  };
});
