import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { getAllAdminUsers, getUserById } from "../graphql/queries";
import { menuItems } from "../utils";
import { useNotificationStore } from "./notification";

export const useUserStore = defineStore("user", () => {
  // Initialize state from localStorage if available
  const getInitialUserState = () => {
    const savedUser = localStorage.getItem("userInfo");
    return savedUser
      ? JSON.parse(savedUser)
      : {
          id: null,
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
        };
  };

  const userInfo = ref(getInitialUserState());

  const currentRole = ref(userInfo.value.role.toLowerCase() || "");

  const notificationStore = useNotificationStore();

  const userCache = ref({});
  const loading = ref(false);
  const error = ref(null);

  const allUsers = ref({ admins: [], teachers: [] });

  const totalPages = ref(1);
  const hasMore = ref(false);
  const totalCount = ref(0);

  // Updated setUser to handle persistence and refresh token
  const setUser = (user) => {
    const userData = {
      id: user.userId,
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
    };

    userInfo.value = userData;
    currentRole.value = user.role;

    // Persist to localStorage
    localStorage.setItem("userInfo", JSON.stringify(userData));
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

  const setRole = (role) => {
    if (
      ["super_admin", "admin", "teacher", "student", "parent"].includes(role)
    ) {
      currentRole.value = role;
      userInfo.value.role = role;
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
    localStorage.removeItem("bannerDismissed");
  };

  // Updated to handle super_admin same as admin
  const filteredMenuItems = computed(() => {
    return menuItems.map((section) => ({
      ...section,
      items: section.items.filter((item) => {
        const role = currentRole.value.toLowerCase();

        if (role.toLowerCase() === "super_admin") {
          return item.visible.includes("admin");
        }
        return item.visible.includes(role);
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
    { page = 1, limit = 10 } = {}
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
          (user) => user.role === "ADMIN" || user.role === "admin"
        ),
        teachers: paginatedCombined.filter(
          (user) => user.role === "TEACHER" || user.role === "teacher"
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

  return {
    error,
    setUser,
    setRole,
    loading,
    clearUser,
    totalPages,
    hasMore,
    totalCount,
    userInfo,
    hasAccess,
    currentRole,
    refreshUsers,
    findUserById,
    fetchAdminUsers,
    filteredMenuItems,
    updateUserProfile, // Add the new method to the returned object
  };
});
