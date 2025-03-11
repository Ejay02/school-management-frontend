// composables/useNavigation.js
import { useRouter } from "vue-router";

export function useNavigation() {
  const router = useRouter();

  const goBack = () => {
    router.back();
  };

  const goTo = (path) => {
    router.push(path);
  };

  return {
    goBack,
    goTo,
  };
}
