import { defineStore } from "pinia";
import { ref } from "vue";

export const useNotificationStore = defineStore("notification", () => {
  const notifications = ref([]);
  const nextId = ref(0);

  const addNotification = ({ type = "info", message, timeout = 2000 }) => {
    const id = nextId.value++;

    notifications.value.push({
      id,
      type,
      message,
      timestamp: new Date(),
    });

    if (timeout) {
      setTimeout(() => {
        removeNotification(id);
      }, timeout);
    }

    return id;
  };

  const removeNotification = (id) => {
    const index = notifications.value.findIndex((n) => n.id === id);
    if (index > -1) {
      notifications.value.splice(index, 1);
    }
  };

  const clearAll = () => {
    notifications.value = [];
  };

  return {
    notifications,
    addNotification,
    removeNotification,
    clearAll,
  };
});
