import { defineStore } from "pinia";
import { ref, computed } from "vue";
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
          img: "",
        };
  };

  const userInfo = ref(getInitialUserState());

  const currentRole = ref(userInfo.value.role || "");
  const notificationStore = useNotificationStore();

  // Updated setUser to handle persistence and refresh token
  const setUser = (user) => {
    const userData = {
      id: user.userId,
      name: user.name,
      email: user.email,
      role: user.role,
      address: user.address,
      bloodType: user.bloodType,
      surname: user.surname,
      sex: user.sex,
      phone: user.phone,
      token: user.token,
      refreshToken: user.refreshToken,
      img: user.img,
    };

    userInfo.value = userData;
    currentRole.value = user.role;

    // Persist to localStorage
    localStorage.setItem("userInfo", JSON.stringify(userData));
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
      // console.error("Invalid role specified");
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

  return {
    setUser,
    setRole,
    clearUser,
    userInfo,
    hasAccess,
    currentRole,
    filteredMenuItems,
  };
});
