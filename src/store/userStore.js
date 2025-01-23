import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { menuItems } from "../utils";

export const useUserStore = defineStore("user", () => {
  // const currentRole = ref("student"); // Default role
  // const currentRole = ref("admin");
  // const currentRole = ref("parent");
  const currentRole = ref("teacher");
  const userInfo = ref({
    id: null,
    name: "",
    email: "",
    role: currentRole.value,
  });

  // Method to set user role
  const setRole = (role) => {
    if (["admin", "teacher", "student", "parent"].includes(role)) {
      currentRole.value = role;
      userInfo.value.role = role;
    } else {
      console.error("Invalid role specified");
    }
  };

  // Computed property to filter menu items based on current role
  const filteredMenuItems = computed(() => {
    return menuItems.map((section) => ({
      ...section,
      items: section.items.filter((item) =>
        item.visible.includes(currentRole.value)
      ),
    }));
  });

  // logout function
  // clear  localStorage.setItem("bannerDismissed", "true"); 

  // Method to check if current user has access to a specific route
  const hasAccess = (route) => {
    const allMenuItems = menuItems.flatMap((section) => section.items);
    const menuItem = allMenuItems.find((item) => item.href === route);
    return menuItem ? menuItem.visible.includes(currentRole.value) : false;
  };

  return {
    currentRole,
    userInfo,
    setRole,
    filteredMenuItems,
    hasAccess,
  };
});
