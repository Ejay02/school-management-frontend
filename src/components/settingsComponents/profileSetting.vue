<template>
  <div>
    <form @submit.prevent="saveSettings" class="p-6">
      <!-- Profile Image Section - Moved to top -->
      <div class="flex justify-center mb-6">
        <div class="flex flex-col items-center space-y-2">
          <div class="relative">
            <!-- Use profile preview or user's image from userStore -->
            <img
              v-if="profilePreview || userStore?.userInfo?.image"
              :src="profilePreview || userStore?.userInfo?.image"
              class="h-32 w-32 rounded-full object-cover border-2 border-white shadow-lg"
              alt="Profile avatar"
            />
            <!-- Fallback to initials if no image is available -->
            <div
              v-else
              class="h-32 w-32 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white shadow-sm border-2 border-indigo-200 text-2xl capitalize"
            >
              {{ initials }}
            </div>
            <button
              type="button"
              @click="$refs.fileInput.click()"
              class="absolute bottom-0 right-0 h-8 w-8 bg-eduSky rounded-full flex items-center justify-center text-white hover:bg-eduPurple transition-colors"
            >
              <i class="fas fa-camera"></i>
            </button>
            <input
              type="file"
              ref="fileInput"
              @change="handleImageChange"
              accept="image/*"
              class="hidden"
            />
          </div>
          <!-- File type text moved below image -->
          <div class="text-center font-semibold text-gray-600 text-xs">
            <span>JPG, GIF or PNG</span>
            <span class="block"
              >1MB max <span class="text-red-500">*</span></span
            >
          </div>
        </div>
      </div>

      <!-- Form Fields Section - Now full width -->
      <div class="max-w-3xl mx-auto">
        <div class="space-y-6">
          <!-- Name Fields -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label for="name" class="block text-sm font-medium text-gray-500"
                >First Name</label
              >
              <input
                type="text"
                v-model="formData.name"
                required
                class="cursor-pointer block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-400 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-eduPurple sm:text-sm/6"
              />
            </div>
            <div>
              <label
                for="surname"
                class="block text-sm font-medium text-gray-500"
                >Last Name</label
              >
              <input
                type="text"
                v-model="formData.surname"
                required
                class="cursor-pointer block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-400 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-eduPurple sm:text-sm/6"
              />
            </div>
          </div>

          <!-- Username, ID and DOB Fields -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label
                for="username"
                class="block text-sm font-medium text-gray-500"
                >Username</label
              >
              <input
                v-model="formData.username"
                type="text"
                required
                class="cursor-pointer block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-400 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-eduPurple sm:text-sm/6"
                placeholder="Choose a username"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-500">
                {{ roleIdLabel }}
              </label>
              <div class="flex items-center gap-2">
                <input
                  type="text"
                  readonly
                  :value="roleId"
                  placeholder="Generating..."
                  class="cursor-pointer block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-400 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-eduPurple sm:text-sm/6"
                />
                <button
                  type="button"
                  class="h-10 w-10 shrink-0 flex items-center justify-center rounded-md bg-eduSky text-white hover:bg-eduPurple transition-colors"
                  @click="copyRoleId"
                  :disabled="!roleId"
                >
                  <i class="fa-regular fa-copy"></i>
                </button>
              </div>
            </div>
            <div>
              <label
                for="dateOfBirth"
                class="block text-sm font-medium text-gray-500"
                >Date of Birth</label
              >
              <input
                v-model="formData.dateOfBirth"
                type="date"
                required
                class="cursor-pointer block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-400 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-eduPurple sm:text-sm/6"
              />
            </div>
          </div>

          <!-- Additional Fields -->
          <div>
            <label for="aboutMe" class="block text-sm font-medium text-gray-500"
              >About Me</label
            >
            <textarea
              v-model="formData.aboutMe"
              rows="3"
              class="cursor-pointer block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-400 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-eduPurple sm:text-sm/6"
              placeholder="Tell us about yourself"
            ></textarea>
          </div>

          <!-- Sex and Blood Type Fields -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label for="sex" class="block text-sm font-medium text-gray-500"
                >Sex</label
              >
              <select
                v-model="formData.sex"
                class="cursor-pointer block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-400 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-eduPurple sm:text-sm/6"
              >
                <option value="">Select</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
            <div>
              <label
                for="bloodType"
                class="block text-sm font-medium text-gray-500"
                >Blood Type</label
              >
              <select
                v-model="formData.bloodType"
                class="cursor-pointer block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-400 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-eduPurple sm:text-sm/6"
              >
                <option value="">Select</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>
          </div>

          <!-- Address and Phone Fields -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                for="address"
                class="block text-sm font-medium text-gray-500"
                >Address</label
              >
              <input
                type="text"
                v-model="formData.address"
                class="cursor-pointer block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-400 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-eduPurple sm:text-sm/6"
                placeholder="Your address"
              />
            </div>
            <div>
              <label for="phone" class="block text-sm font-medium text-gray-500"
                >Phone</label
              >
              <input
                type="tel"
                v-model="formData.phone"
                class="cursor-pointer block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-400 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-eduPurple sm:text-sm/6"
                placeholder="Your phone number"
              />
            </div>
          </div>
        </div>
      </div>

      <div class="max-w-3xl mx-auto mt-10">
        <div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 class="text-lg font-semibold text-gray-800">My ID Card</h2>
              <p class="mt-1 text-sm text-gray-500">
                Hover to see the back. Download a copy when you need it.
              </p>
            </div>
            <div class="flex flex-wrap gap-2">
              <button
                type="button"
                class="inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
                :disabled="!qrValue"
                @click="downloadIdCard"
              >
                Download ID
              </button>
              <a
                v-if="qrUrl"
                :href="qrUrl"
                class="inline-flex items-center justify-center rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
                target="_blank"
                rel="noreferrer"
              >
                View QR
              </a>
            </div>
          </div>

          <div class="mt-6">
            <div class="id-flip">
              <div class="id-flip-inner">
                <div class="id-flip-face id-front">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-3">
                      <div class="h-10 w-10 overflow-hidden rounded-md bg-gray-100">
                        <img
                          v-if="userStore.schoolInfo.schoolLogo"
                          :src="userStore.schoolInfo.schoolLogo"
                          alt="School logo"
                          class="h-full w-full object-cover"
                        />
                        <div v-else class="flex h-full w-full items-center justify-center text-xs font-semibold text-gray-500">
                          EDU
                        </div>
                      </div>
                      <div class="min-w-0">
                        <div class="text-sm font-semibold text-gray-800 truncate">
                          {{ userStore.schoolInfo.schoolName || "EduHub Portal" }}
                        </div>
                        <div class="text-xs text-gray-500">
                          {{ roleIdLabel }}
                        </div>
                      </div>
                    </div>
                    <span class="inline-flex items-center rounded-full bg-eduPurpleLight px-3 py-1 text-xs font-medium text-purple-700 capitalize">
                      {{ userStore.userInfo.role?.toLowerCase().replace("_", " ") }}
                    </span>
                  </div>

                  <div class="mt-5 flex items-center gap-4">
                    <div class="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600">
                      <img
                        v-if="profilePreview || userStore?.userInfo?.image"
                        :src="profilePreview || userStore?.userInfo?.image"
                        class="h-full w-full object-cover"
                        alt="Profile avatar"
                      />
                      <div
                        v-else
                        class="flex h-full w-full items-center justify-center text-xl font-bold text-white capitalize"
                      >
                        {{ initials }}
                      </div>
                    </div>

                    <div class="min-w-0 flex-1">
                      <div class="text-lg font-semibold text-gray-900 truncate">
                        {{ formData.name }} {{ formData.surname }}
                      </div>
                      <div class="mt-1 text-sm text-gray-600 truncate">
                        @{{ formData.username }}
                      </div>
                      <div class="mt-2 text-sm font-medium text-gray-700">
                        {{ roleId || "Generating..." }}
                      </div>
                    </div>
                  </div>

                  <div class="mt-6 flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3">
                    <div class="text-xs text-gray-600">
                      <div class="font-semibold text-gray-700">Account ID</div>
                      <div class="mt-1 font-mono text-[11px] text-gray-600 truncate max-w-[220px]">
                        {{ qrValue || "-" }}
                      </div>
                    </div>
                    <div class="text-xs text-gray-500">Hover to flip</div>
                  </div>
                </div>

                <div class="id-flip-face id-back">
                  <div class="flex items-center justify-between">
                    <div class="text-sm font-semibold text-gray-800">
                      Scan to verify
                    </div>
                    <div class="text-xs text-gray-500">
                      {{ userStore.schoolInfo.schoolName || "EduHub Portal" }}
                    </div>
                  </div>

                  <div class="mt-5 flex items-center justify-center">
                    <div class="rounded-xl border border-gray-200 bg-white p-3">
                      <img
                        v-if="qrUrl"
                        :src="qrUrl"
                        alt="QR code"
                        class="h-40 w-40"
                      />
                      <div v-else class="h-40 w-40 flex items-center justify-center text-sm text-gray-500">
                        QR unavailable
                      </div>
                    </div>
                  </div>

                  <div class="mt-5 text-center">
                    <div class="text-sm font-semibold text-gray-800">
                      {{ formData.name }} {{ formData.surname }}
                    </div>
                    <div class="mt-1 text-xs text-gray-500">
                      Present this QR when requested.
                    </div>
                  </div>

                  <div class="mt-6 rounded-lg bg-gray-50 px-4 py-3">
                    <div class="text-xs font-medium text-gray-700">QR payload</div>
                    <div class="mt-1 font-mono text-[11px] text-gray-600 break-all">
                      {{ qrValue || "-" }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Save Button  -->
      <div class="flex justify-end mt-4 border-t border-gray-200">
        <button
          type="submit"
          class="mt-4 px-4 py-2 text-sm font-medium text-white bg-gradient-to-br from-indigo-500 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          :disabled="loading"
        >
          <span v-if="!loading">Save Changes</span>
          <div v-else class="flex items-center">
            <svg
              class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
            Saving...
          </div>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from "vue";
import { apolloClient } from "../../../apollo-client";
import {
  updateAdminProfile,
  updateParentProfile,
  updateStudentProfile,
  updateTeacherProfile,
} from "../../graphql/mutations";
import { useNotificationStore } from "../../store/notification";
import { useUserStore } from "../../store/userStore";
import { getInitials } from "../../utils/displayValue";

const userStore = useUserStore();
const notificationStore = useNotificationStore();
const loading = ref(false);

const profilePreview = ref(null);
const fileInput = ref(null);
const imageFile = ref(null);
const imageBase64 = ref(null);
const initials = getInitials(
  userStore?.userInfo?.name,
  userStore?.userInfo?.surname,
);

const roleId = computed(() => {
  const role = String(userStore?.userInfo?.role || "").toLowerCase();
  if (role === "admin" || role === "super_admin")
    return userStore?.userInfo?.adminId || "";
  if (role === "teacher") return userStore?.userInfo?.teacherId || "";
  if (role === "student") return userStore?.userInfo?.studentId || "";
  if (role === "parent") return userStore?.userInfo?.id || "";
  return "";
});

const roleIdLabel = computed(() => {
  const role = String(userStore?.userInfo?.role || "").toLowerCase();
  if (role === "admin" || role === "super_admin") return "Admin ID";
  if (role === "teacher") return "Teacher ID";
  if (role === "student") return "Student ID";
  if (role === "parent") return "Parent ID";
  return "ID";
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

const qrValue = computed(() => String(userStore.userInfo?.id || "").trim());
const qrUrl = computed(() => {
  if (!qrValue.value) return "";
  const size = "220x220";
  const data = encodeURIComponent(qrValue.value);
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}&data=${data}`;
});

const downloadIdCard = () => {
  const schoolName = userStore.schoolInfo.schoolName || "EduHub Portal";
  const schoolLogo = userStore.schoolInfo.schoolLogo || "";
  const avatar = profilePreview.value || userStore.userInfo?.image || "";
  const fullName = `${formData.name || ""} ${formData.surname || ""}`.trim();
  const username = formData.username ? `@${formData.username}` : "";
  const role = String(userStore.userInfo?.role || "")
    .toLowerCase()
    .replace("_", " ");
  const idLabel = roleIdLabel.value || "ID";
  const displayId = roleId.value || "";
  const accountId = qrValue.value || "";
  const qr = qrUrl.value || "";

  const w = window.open("", "_blank", "width=900,height=700");
  if (!w) return;

  const html = `<!doctype html>
  <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>ID Card</title>
      <style>
        body{font-family:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,Arial,"Noto Sans";margin:0;padding:24px;background:#f3f4f6;color:#111827}
        .wrap{max-width:900px;margin:0 auto}
        .row{display:flex;gap:16px;flex-wrap:wrap}
        .card{width:360px;border:1px solid #e5e7eb;border-radius:16px;background:#fff;box-shadow:0 1px 2px rgba(0,0,0,.06);overflow:hidden}
        .pad{padding:16px}
        .top{display:flex;justify-content:space-between;gap:12px;align-items:center}
        .brand{display:flex;gap:10px;align-items:center;min-width:0}
        .logo{width:40px;height:40px;border-radius:10px;background:#f3f4f6;overflow:hidden;flex:0 0 auto}
        .logo img{width:100%;height:100%;object-fit:cover}
        .school{font-weight:700;font-size:14px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
        .meta{font-size:11px;color:#6b7280;margin-top:2px}
        .pill{font-size:11px;padding:6px 10px;border-radius:999px;background:#f3e8ff;color:#6b21a8;font-weight:600;text-transform:capitalize;white-space:nowrap}
        .mid{display:flex;gap:14px;align-items:center;margin-top:16px}
        .avatar{width:84px;height:84px;border-radius:16px;background:linear-gradient(135deg,#6366f1,#a855f7);overflow:hidden;flex:0 0 auto;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:800;font-size:22px}
        .avatar img{width:100%;height:100%;object-fit:cover}
        .name{font-size:18px;font-weight:800;margin:0;line-height:1.2}
        .user{font-size:13px;color:#4b5563;margin-top:4px}
        .idline{margin-top:10px;font-size:13px;color:#374151;font-weight:700}
        .box{margin-top:14px;border-radius:12px;background:#f9fafb;padding:12px;display:flex;justify-content:space-between;gap:12px;align-items:center}
        .mono{font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New";font-size:11px;color:#4b5563;word-break:break-all}
        .qrwrap{display:flex;justify-content:center;margin-top:14px}
        .qr{width:180px;height:180px;border:1px solid #e5e7eb;border-radius:12px;padding:10px;background:#fff}
        .qr img{width:100%;height:100%}
        .hint{font-size:11px;color:#6b7280;margin-top:8px;text-align:center}
        @media print{body{background:#fff;padding:0}.wrap{max-width:none}.row{gap:24px}.hint{display:none}}
      </style>
    </head>
    <body>
      <div class="wrap">
        <div class="row">
          <div class="card">
            <div class="pad">
              <div class="top">
                <div class="brand">
                  <div class="logo">${schoolLogo ? `<img src="${schoolLogo}" alt="logo" />` : ""}</div>
                  <div style="min-width:0">
                    <div class="school">${escapeHtml(schoolName)}</div>
                    <div class="meta">${escapeHtml(idLabel)}</div>
                  </div>
                </div>
                <div class="pill">${escapeHtml(role)}</div>
              </div>

              <div class="mid">
                <div class="avatar">${avatar ? `<img src="${avatar}" alt="avatar" />` : escapeHtml(initials)}</div>
                <div style="min-width:0;flex:1">
                  <p class="name">${escapeHtml(fullName)}</p>
                  <div class="user">${escapeHtml(username)}</div>
                  <div class="idline">${escapeHtml(displayId)}</div>
                </div>
              </div>

              <div class="box">
                <div>
                  <div class="meta" style="font-weight:700;color:#374151">Account ID</div>
                  <div class="mono">${escapeHtml(accountId)}</div>
                </div>
              </div>
            </div>
          </div>

          <div class="card">
            <div class="pad">
              <div class="top">
                <div class="school">Scan to verify</div>
                <div class="meta">${escapeHtml(schoolName)}</div>
              </div>

              <div class="qrwrap">
                <div class="qr">${qr ? `<img src="${qr}" alt="qr" />` : ""}</div>
              </div>

              <div class="hint">${escapeHtml(fullName)} • ${escapeHtml(role)}</div>

              <div class="box">
                <div style="min-width:0">
                  <div class="meta" style="font-weight:700;color:#374151">QR payload</div>
                  <div class="mono">${escapeHtml(accountId)}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="hint" style="margin-top:16px">Use your browser print dialog to save as PDF.</div>
      </div>
      <script>window.focus();window.print();<\/script>
    </body>
  </html>`;

  w.document.open();
  w.document.write(html);
  w.document.close();
};

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

// Format date to YYYY-MM-DD for input[type="date"]
const formatDateForInput = (dateString) => {
  if (!dateString) return "";

  // Try to parse the date
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return ""; // Invalid date

  // Format as YYYY-MM-DD
  return date.toISOString().split("T")[0];
};

// Initialize form data with user info from store
const formData = reactive({
  name: userStore.userInfo.name || "",
  surname: userStore.userInfo.surname || "",
  username:
    userStore.userInfo.username ||
    userStore.userInfo.email?.split("@")[0] ||
    "",
  dateOfBirth: formatDateForInput(userStore.userInfo.dateOfBirth) || "",
  emailNotifications: true,
  pushNotifications: false,
  aboutMe: userStore.userInfo.aboutMe ?? "",
  sex: userStore.userInfo.sex || "",
  bloodType: userStore.userInfo.bloodType || "",
  address: userStore.userInfo.address || "",
  phone: userStore.userInfo.phone || "",
});

const handleImageChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    // Check file size (1MB max)
    if (file.size > 1024 * 1024) {
      notificationStore.addNotification({
        type: "error",
        message: "File size exceeds 1MB limit",
      });
      return;
    }

    imageFile.value = file;
    const reader = new FileReader();
    reader.onload = (e) => {
      profilePreview.value = e.target.result;
      imageBase64.value = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};

// Helper function to handle role-specific operations
const getRoleSpecificData = (operation, data = null) => {
  const role = userStore.currentRole.toLowerCase();

  if (role === "admin" || role === "super_admin") {
    return operation === "mutation"
      ? updateAdminProfile
      : data?.updateAdminProfile;
  } else if (role === "teacher") {
    return operation === "mutation"
      ? updateTeacherProfile
      : data?.updateTeacherProfile;
  } else if (role === "student") {
    return operation === "mutation"
      ? updateStudentProfile
      : data?.updateStudentProfile;
  } else if (role === "parent") {
    return operation === "mutation"
      ? updateParentProfile
      : data?.updateParentProfile;
  }

  if (operation === "mutation") {
    throw new Error(`No profile update mutation available for role: ${role}`);
  }
  return null;
};

const getProfileMutation = () => getRoleSpecificData("mutation");

// Prepare form data for upload
const prepareFormData = () => {
  // Prepare the input object
  const input = {
    name: formData.name,
    surname: formData.surname,
    username: formData.username,
    dateOfBirth: formData.dateOfBirth,
    aboutMe: formData.aboutMe,
    sex: formData.sex,
    bloodType: formData.bloodType,
    address: formData.address,
    phone: formData.phone,
  };

  // If an image file is selected, add the base64 string to the input
  if (imageBase64.value) {
    input.image = imageBase64.value;
  }

  return input;
};

const saveSettings = async () => {
  try {
    loading.value = true;

    // Get the appropriate mutation based on user role
    const mutation = getProfileMutation();

    // Prepare the input data including image as base64 string
    const input = prepareFormData();

    // Execute the GraphQL mutation with the base64 string
    const { data } = await apolloClient.mutate({
      mutation,
      variables: { input },
    });

    // Extract the response data based on the mutation type
    const userData = getRoleSpecificData("response", data);

    // Update local user store with the returned data
    if (userData) {
      userStore.updateUserProfile(userData);

      notificationStore.addNotification({
        type: "success",
        message: userStore.requiresProfileCompletion
          ? "Profile updated successfully!"
          : "Profile updated successfully. Your account is now fully unlocked.",
      });
    }
  } catch (error) {
    notificationStore.addNotification({
      type: "error",
      message: `Error saving settings: ${error.message}`,
    });
  } finally {
    loading.value = false;
  }
};

// Ensure date is properly formatted when component mounts
onMounted(() => {
  // Re-format the date in case it wasn't properly formatted initially
  formData.dateOfBirth = formatDateForInput(userStore.userInfo.dateOfBirth);
  if (!roleId.value) {
    userStore.syncCurrentUser(apolloClient);
  }
});
</script>

<style scoped>
.id-flip {
  perspective: 1200px;
  width: 100%;
  max-width: 520px;
}

.id-flip-inner {
  position: relative;
  width: 100%;
  height: 340px;
  transition: transform 0.6s;
  transform-style: preserve-3d;
}

.id-flip:hover .id-flip-inner {
  transform: rotateY(180deg);
}

.id-flip-face {
  position: absolute;
  inset: 0;
  backface-visibility: hidden;
  border-radius: 16px;
  overflow: hidden;
}

.id-front {
  background: white;
  border: 1px solid #e5e7eb;
  padding: 16px;
}

.id-back {
  background: white;
  border: 1px solid #e5e7eb;
  padding: 16px;
  transform: rotateY(180deg);
}
</style>
