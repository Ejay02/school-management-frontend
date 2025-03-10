import { onMounted, onUnmounted } from "vue";

export function useStorageSync(key, onChange) {
  const syncHandler = (event) => {
    if (event.key === key) {
      try {
        const newValue = JSON.parse(event.newValue);
        onChange(newValue);
      } catch (err) {
        console.error("Error parsing storage value:", err);
      }
    }
  };

  onMounted(() => {
    window.addEventListener("storage", syncHandler);
  });

  onUnmounted(() => {
    window.removeEventListener("storage", syncHandler);
  });
}
