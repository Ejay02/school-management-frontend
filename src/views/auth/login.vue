<template>
  <div class="flex h-screen">
    <!-- Left Section -->
    <div
      class="left w-full lg:w-1/2 flex flex-col justify-center px-6 py-12 lg:px-8 bg-gray-50"
    >
      <!-- back arrow -->
      <div class="pl-4">
        <div class="group" @click="goBack">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="text-gray-600 h-6 w-6 cursor-pointer group-hover:animate-bounce"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M6.75 15.75 3 12m0 0 3.75-3.75M3 12h18"
            />
          </svg>
        </div>
      </div>

      <!-- Icon and Header -->
      <div class="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2
          class="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-800"
        >
          Welcome back!
        </h2>
        <h6 class="text-sm text-center text-indigo-400">
          Log in to your account
        </h6>
      </div>

      <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form class="space-y-6" @submit.prevent="login">
          <div>
            <label
              for="email"
              class="block text-sm/6 font-medium text-indigo-600"
            >
              Username
            </label>
            <div class="mt-2">
              <input
                type="text"
                name="username"
                id="username"
                autofocus
                v-model="username"
                autocomplete="username"
                placeholder="janebond007"
                required
                class="cursor-pointer block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-800 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-eduPurpleLight sm:text-sm/6"
              />
            </div>
          </div>

          <div>
            <div class="flex items-center justify-between">
              <label
                for="password"
                class="block text-sm/6 font-medium text-indigo-600"
              >
                Password
              </label>
              <div class="text-xs">
                <a
                  href="#"
                  class="font-semibold text-indigo-500 hover:text-indigo-500"
                >
                  Forgot password?
                </a>
              </div>
            </div>
            <div class="mt-2 relative">
              <input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                name="password"
                id="password"
                autocomplete="current-password"
                placeholder="my-super-secret-password"
                required
                class="cursor-pointer block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-800 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-eduPurpleLight sm:text-sm/6"
              />
              <button
                type="button"
                class="cursor-pointer absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                @click="showPassword = !showPassword"
              >
                <i
                  class="fa-regular"
                  :class="showPassword ? 'fa-eye-slash' : 'fa-eye'"
                ></i>
              </button>
            </div>
          </div>

          <div>
            <button
              type="submit"
              :disabled="loading || !username || !password"
              class="flex w-full justify-center rounded-md bg-gradient-to-br from-indigo-500 to-purple-600 hover:from-blue-500 hover:to-purple-500 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="loading" class="flex items-center gap-2">
                <svg
                  class="animate-spin h-5 w-5 text-white"
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
                Logging in...
              </span>
              <span v-else>Log in</span>
            </button>
          </div>
        </form>

        <p class="mt-10 text-center text-sm/6 text-gray-500">
          Not a member?
          <router-link
            to="/signup"
            class="font-semibold text-indigo-600 hover:text-indigo-500"
          >
            Create account
          </router-link>
        </p>
      </div>
    </div>

    <!-- Right Section -->
    <div class="right hidden lg:block lg:w-1/2 h-screen">
      <img
        src="/kimberly-farmer-lUaaKCUANVI-unsplash.jpg"
        alt="Background pix"
        class="h-full w-full object-cover"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { updateToken } from "../../socket/socket";
import { useUserStore } from "../../store/userStore";
import { useMutation } from "@vue/apollo-composable";
import { loginMutation } from "../../graphql/mutations";
import { useNotificationStore } from "../../store/notification";
import { useNavigation } from "../../composables/useNavigation";

const router = useRouter();
const userStore = useUserStore();

const notificationStore = useNotificationStore();
const { goBack } = useNavigation();

const username = ref("");
const password = ref("");
const showPassword = ref(false);

const { mutate: loginMutate, loading } = useMutation(loginMutation);

const login = async () => {
  try {
    const res = await loginMutate({
      input: {
        username: username.value,
        password: password.value,
      },
    });

    if (res?.data?.login) {
      const userData = res.data.login;
      const role = userData.role.toLowerCase();

      userStore.setUser(userData);
      localStorage.setItem("token", userData.token);
      localStorage.setItem("refreshToken", userData.refreshToken);

      updateToken(userData.token);

      const dashboardPath =
        role === "super_admin" ? "/dashboard/admin" : `/dashboard/${role}`;
      await router.push(dashboardPath);

      notificationStore.addNotification({
        type: "success",
        message: `Welcome back ${userStore.userInfo.name}!`,
      });
    }
  } catch (e) {
    notificationStore.addNotification({
      type: "error",
      message: `Login unsuccessful: ${e.message}`,
    });
  }
};
</script>

<style scoped></style>
