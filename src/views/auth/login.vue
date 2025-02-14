<template>
  <div class="flex h-screen">
    <!-- Left Section -->

    <div
      class="left w-full lg:w-1/2 flex flex-col justify-center px-6 py-12 lg:px-8 bg-gray-50"
    >
      <!-- back arrow -->
      <div class="pl-4">
        <router-link to="/" class="group">
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
        </router-link>
      </div>

      <!-- icon -->
      <div class="sm:mx-auto sm:w-full sm:max-w-sm">
        <router-link to="/">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="mx-auto h-10 w-auto text-indigo-500"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5"
            />
          </svg>
        </router-link>

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
              >Username</label
            >
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
                >Password</label
              >
              <div class="text-xs">
                <a
                  href="#"
                  class="font-semibold text-indigo-500 hover:text-indigo-500"
                  >Forgot password?</a
                >
              </div>
            </div>
            <div class="mt-2">
              <input
                v-model="password"
                type="password"
                name="password"
                id="password"
                autocomplete="current-password"
                placeholder="mySuperSecretPassword"
                required
                class="cursor-pointer block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-800 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-eduPurpleLight sm:text-sm/6"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Log in
            </button>
          </div>
        </form>

        <p class="mt-10 text-center text-sm/6 text-gray-500">
          Not a member?
          <router-link
            to="/signup"
            class="font-semibold text-indigo-600 hover:text-indigo-500"
            >Create account</router-link
          >
        </p>
      </div>
    </div>

    <!-- Right Section -->
    <div class="right hidden lg:block lg:w-1/2 h-screen">
      <img
        src="/kimberly-farmer-lUaaKCUANVI-unsplash.jpg"
        alt="Background Image"
        class="h-full w-full object-cover"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "../../store/userStore";
import { useMutation } from "@vue/apollo-composable";
import { loginMutation } from "../../graphql/mutations";
import { useNotificationStore } from "../../store/notification";

const router = useRouter();
const userStore = useUserStore();
const notificationStore = useNotificationStore();

const username = ref("");
const password = ref("");

const { mutate: loginMutate } = useMutation(loginMutation);

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

      userStore.setUser(userData);

      localStorage.setItem("token", userData.token);
      localStorage.setItem("refreshToken", userData.refreshToken);

      const role = userData.role.toLowerCase();
      router.push(
        role === "super_admin" ? "/dashboard/admin" : `/dashboard/${role}`
      );

      notificationStore.addNotification({
        type: "success",
        message: `Login Successful!`,
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
