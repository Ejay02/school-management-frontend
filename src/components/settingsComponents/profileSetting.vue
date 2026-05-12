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
                  <i class="text-black fa-regular fa-copy"></i>
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
        <div class="rounded-xl border border-gray-200 p-6 shadow-sm">
          <div
            class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between border-b border-gray-200 pb-2"
          >
            <div class="">
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
            </div>
          </div>

          <div class="mt-6 flex justify-center">
            <div class="id-flip">
              <div class="id-flip-inner">
                <div class="id-flip-face id-front">
                  <div class="id-card">
                    <div class="id-header">
                      <div class="flex items-center gap-4 min-w-0">
                        <div class="id-logo-box">
                          <img
                            v-if="userStore.schoolInfo.schoolLogo"
                            :src="userStore.schoolInfo.schoolLogo"
                            alt="School logo"
                            class="h-full w-full object-cover"
                          />
                          <div v-else class="text-white text-sm font-bold">
                            EDU
                          </div>
                        </div>
                        <div class="min-w-0">
                          <div class="id-school-name">
                            {{ userStore.schoolInfo.schoolName || "My School" }}
                          </div>
                          <div class="id-subtitle">Official ID Card</div>
                        </div>
                      </div>

                      <div class="id-role-pill">
                        {{
                          String(userStore.userInfo.role || "")
                            .replace("_", " ")
                            .toUpperCase()
                        }}
                      </div>
                    </div>

                    <div class="id-front-body">
                      <div class="id-avatar">
                        <img
                          v-if="profilePreview || userStore?.userInfo?.image"
                          :src="profilePreview || userStore?.userInfo?.image"
                          class="h-full w-full object-cover"
                          alt="Profile avatar"
                        />
                        <div v-else class="id-avatar-initials">
                          {{ initials }}
                        </div>
                      </div>

                      <div class="min-w-0 flex-1 id-front-content">
                        <div class="id-user-name">
                          {{ formData.name }} {{ formData.surname }}
                        </div>
                        <div class="id-username">@{{ formData.username }}</div>
                        <div class="id-member-label">Member ID</div>
                        <div class="id-member-id">
                          {{ roleId || "Generating..." }}
                        </div>
                      </div>
                    </div>

                    <div class="id-sep"></div>
                    <div class="id-footer justify-center">
                      {{ userStore.schoolInfo.schoolName || "My School" }}
                      ·
                      {{ cardYear }}
                    </div>
                  </div>
                </div>

                <div class="id-flip-face id-back">
                  <div class="id-card">
                    <div class="id-header id-header-compact"></div>
                    <div class="id-back-space"></div>
                    <div class="id-magstripe"></div>

                    <div class="id-back-body">
                      <div class="grid grid-cols-2 gap-4">
                        <div class="id-disclaimer">
                          This card is property of
                          {{ userStore.schoolInfo.schoolName || "My School" }}.
                          If found, please return to the issuing office.
                        </div>

                        <div class="id-qr-box">
                          <img
                            v-if="cardQrUrl"
                            :src="cardQrUrl"
                            alt="QR code"
                            class="h-full w-full object-contain"
                          />
                        </div>
                      </div>

                      <div class="id-meta-row">
                        <div class="id-meta-col">
                          <div class="id-meta-item">
                            <div class="id-meta-label">Issued</div>
                            <div class="id-meta-value">{{ issuedLabel }}</div>
                          </div>
                          <div class="id-meta-item">
                            <div class="id-meta-label">Valid Until</div>
                            <div class="id-meta-value">
                              {{ validUntilLabel }}
                            </div>
                          </div>
                          <div class="id-meta-item">
                            <div class="id-meta-label">Status</div>
                            <div class="id-meta-value">
                              {{ cardStatusLabel }}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div class="id-sep"></div>
                    <div class="id-footer justify-center">
                      {{ userStore.schoolInfo.schoolName || "My School" }}
                      · Official Identification · {{ cardYear }}
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

const qrValue = computed(() => {
  const userId = String(userStore.userInfo?.id || "").trim();
  if (!userId) return "";
  return `school:v1:user:${userId}`;
});

const qrEncodedValue = computed(() => {
  const memberId = String(roleId.value || "").trim();
  if (memberId) return memberId;
  return String(userStore.userInfo?.id || "").trim();
});

const qrUrl = computed(() => {
  if (!qrEncodedValue.value) return "";
  const size = "220x220";
  const data = encodeURIComponent(qrEncodedValue.value);
  const color = "17-24-39";
  const bgcolor = "255-255-255";
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}&ecc=H&color=${color}&bgcolor=${bgcolor}&data=${data}`;
});

const cardQrUrl = computed(() => {
  if (!qrEncodedValue.value) return "";
  const size = "96x96";
  const data = encodeURIComponent(qrEncodedValue.value);
  const color = "17-24-39";
  const bgcolor = "255-255-255";
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}&ecc=H&color=${color}&bgcolor=${bgcolor}&data=${data}`;
});

const cardYear = computed(() => new Date().getFullYear());
const issuedLabel = computed(() => {
  const now = new Date();
  return now.toLocaleString("en-US", { month: "short", year: "numeric" });
});
const validUntilLabel = computed(() => `Dec ${cardYear.value}`);

const userExists = ref(true);
const userIsActive = ref(true);

const cardStatusLabel = computed(() => {
  if (!userExists.value) return "Inactive";
  if (!userIsActive.value) return "Suspended";
  return "Active";
});

const downloadIdCard = () => {
  const schoolName = userStore.schoolInfo.schoolName || "My School";
  const schoolLogo = userStore.schoolInfo.schoolLogo || "";
  const avatar = profilePreview.value || userStore.userInfo?.image || "";
  const fullName = `${formData.name || ""} ${formData.surname || ""}`.trim();
  const username = formData.username ? `@${formData.username}` : "";
  const role = String(userStore.userInfo?.role || "")
    .toLowerCase()
    .replace("_", " ");

  const displayId = roleId.value || "";

  const qr = cardQrUrl.value || "";
  const year = String(cardYear.value);
  const issued = String(issuedLabel.value);
  const validUntil = String(validUntilLabel.value);
  const status = String(cardStatusLabel.value);

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
        .card{width:380px;height:240px;border:1px solid #e5e7eb;border-radius:16px;background:#fff;box-shadow:0 14px 34px rgba(0,0,0,.3);overflow:hidden;display:flex;flex-direction:column}
        .header{height:52px;padding:10px 14px;background:linear-gradient(135deg,#6366f1,#9333ea);color:#fff;display:flex;align-items:center;justify-content:space-between;gap:12px}
        .brand{display:flex;gap:12px;align-items:center;min-width:0}
        .logo{width:36px;height:36px;border-radius:12px;background:rgba(255,255,255,.16);overflow:hidden;flex:0 0 auto;display:flex;align-items:center;justify-content:center}
        .logo img{width:100%;height:100%;object-fit:cover}
        .school{font-weight:500;font-size:18px;line-height:1.15;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
        .sub{font-size:12px;color:rgba(255,255,255,.75);margin-top:2px}
        .pill{font-size:11px;padding:7px 12px;border-radius:999px;background:rgba(255,255,255,.18);box-shadow:inset 0 0 0 1px rgba(255,255,255,.22);font-weight:500;text-transform:uppercase;letter-spacing:.04em;white-space:nowrap}
        .body{padding:14px;display:flex;gap:14px;align-items:center;flex:1}
        .avatar{width:72px;height:90px;border-radius:16px;background:linear-gradient(135deg,#6366f1,#9333ea);overflow:hidden;flex:0 0 auto;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:500;font-size:22px}
        .avatar img{width:100%;height:100%;object-fit:cover}
        .name{font-size:20px;font-weight:500;line-height:1.2;margin:0;color:#111827;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
        .user{font-size:13px;color:#4f46e5;font-weight:400;margin-top:4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
        .label{font-size:12px;color:#888;margin-top:10px}
        .mid{font-size:14px;font-weight:500;letter-spacing:.08em;margin-top:4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
        .sep{height:2px;background:#e5e7eb}
        .footer{height:32px;padding:0 14px;background:#F1F0FF;color:#6b7280;font-size:10px;display:flex;align-items:center}
        .backTop{height:24px;background:linear-gradient(135deg,#6366f1,#9333ea)}
        .backSpace{height:10px;background:#fff}
        .stripe{height:38px;background:#111827}
        .backBody{padding:12px 14px;flex:1}
        .note{font-size:11px;color:#6b7280;line-height:1.5}
        .account{margin-top:10px;border:1px dashed rgba(108,99,255,.35);border-radius:12px;background:#F5F4FF;padding:10px 12px}
        .account .k{font-size:10px;color:#888;font-weight:400}
        .account .v{margin-top:6px;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New";font-size:11px;color:#4f46e5;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
        .qrBox{width:96px;height:96px;border-radius:6px;border:none;background:#fff;display:flex;align-items:center;justify-content:center;margin-left:auto;overflow:hidden}
        .qrBox img{width:96px;height:96px;border-radius:6px;object-fit:contain}
        .metaRow{margin-top:10px}
        .metaCol{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px}
        .metaK{font-size:10px;color:#888}
        .metaV{margin-top:2px;font-size:12px;font-weight:500;color:#111827}
        .hint{font-size:12px;color:#6b7280;margin-top:12px;text-align:center}
        @media print{body{background:#fff;padding:0}.wrap{max-width:none}.row{gap:24px}.hint{display:none}}
      </style>
    </head>
    <body>
      <div class="wrap">
        <div class="row">
          <div class="card">
            <div class="header">
              <div class="brand">
                <div class="logo">${schoolLogo ? `<img src="${schoolLogo}" alt="logo" />` : ""}</div>
                <div style="min-width:0">
                  <div class="school">${escapeHtml(schoolName || "My School")}</div>
                  <div class="sub">Official ID Card</div>
                </div>
              </div>
              <div class="pill">${escapeHtml(String(role).toUpperCase())}</div>
            </div>

            <div class="body">
              <div class="avatar">${avatar ? `<img src="${avatar}" alt="avatar" />` : escapeHtml(initials)}</div>
              <div style="min-width:0;flex:1">
                <p class="name">${escapeHtml(fullName)}</p>
                <div class="user">${escapeHtml(username)}</div>
                <div class="label">Member ID</div>
                <div class="mid">${escapeHtml(displayId)}</div>
              </div>
            </div>

            <div class="sep"></div>
            <div class="footer">${escapeHtml(schoolName || "My School")} · ${escapeHtml(year)}</div>
          </div>

          <div class="card">
            <div class="backTop"></div>
            <div class="backSpace"></div>
            <div class="stripe"></div>

            <div class="backBody">
              <div style="display:flex;gap:18px;align-items:flex-start">
                <div style="flex:1;min-width:0">
                  <div class="note">This card is property of ${escapeHtml(schoolName || "My School")}. If found, please return to the issuing office.</div>
                </div>
                <div class="qrBox">${qr ? `<img src="${qr}" alt="qr" />` : ""}</div>
              </div>

              <div class="metaRow">
                <div class="metaCol">
                  <div>
                    <div class="metaK">Issued</div>
                    <div class="metaV">${escapeHtml(issued)}</div>
                  </div>
                  <div>
                    <div class="metaK">Valid Until</div>
                    <div class="metaV">${escapeHtml(validUntil)}</div>
                  </div>
                  <div>
                    <div class="metaK">Status</div>
                    <div class="metaV">${escapeHtml(status)}</div>
                  </div>
                </div>
              </div>
            </div>

            <div class="sep"></div>
            <div class="footer">${escapeHtml(schoolName || "My School")} · Official Identification · ${escapeHtml(year)}</div>
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

  if (!input.sex) {
    delete input.sex;
  }

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

  if (!userStore.userInfo?.id) {
    userExists.value = false;
    userIsActive.value = false;
    return;
  }

  userStore
    .findUserById(userStore.userInfo.id, apolloClient)
    .then((u) => {
      userExists.value = Boolean(u);
      userIsActive.value = u ? u.isActive !== false : false;
    })
    .catch(() => {
      userExists.value = false;
      userIsActive.value = false;
    });
});
</script>

<style scoped>
.id-flip {
  perspective: 1200px;
  width: 100%;
  max-width: 380px;
}

.id-flip-inner {
  position: relative;
  width: 100%;
  height: 240px;
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
  background: transparent;
}

.id-back {
  background: transparent;
  transform: rotateY(180deg);
}

.id-card {
  height: 100%;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 14px 34px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
}

.id-header {
  height: 52px;
  padding: 10px 14px;
  background: linear-gradient(135deg, #6366f1, #9333ea);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
}

.id-header-compact {
  height: 24px;
  padding: 0;
  background: linear-gradient(135deg, #6366f1, #9333ea);
}

.id-logo-box {
  width: 36px;
  height: 36px;
  border-radius: 12px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.16);
  display: flex;
  align-items: center;
  justify-content: center;
}

.id-school-name {
  font-weight: 500;
  font-size: 18px;
  line-height: 1.15;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.id-subtitle {
  margin-top: 2px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.75);
}

.id-role-pill {
  font-size: 11px;
  padding: 7px 12px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.18);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.22);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  white-space: nowrap;
}

.id-front-body {
  padding: 14px;
  display: flex;
  gap: 14px;
  align-items: center;
  flex: 1;
}

.id-front-content {
  padding-left: 6px;
}

.id-avatar {
  width: 72px;
  height: 72px;
  border-radius: 16px;
  background: linear-gradient(135deg, #6366f1, #9333ea);
  overflow: hidden;
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
}

.id-avatar-initials {
  font-size: 22px;
  font-weight: 500;
  color: #ffffff;
}

.id-user-name {
  font-size: 20px;
  font-weight: 500;
  line-height: 1.2;
  color: #111827;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.id-username {
  margin-top: 4px;
  font-size: 13px;
  color: #4f46e5;
  font-weight: 400;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.id-member-label {
  margin-top: 10px;
  font-size: 12px;
  color: #888888;
  font-weight: 400;
}

.id-member-id {
  margin-top: 4px;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.08em;
  color: #111827;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.id-sep {
  height: 2px;
  background: #e5e7eb;
  margin-top: auto;
}

.id-footer {
  height: 32px;
  padding: 0 14px;
  background: #f1f0ff;
  color: #6b7280;
  font-size: 10px;
  display: flex;
  align-items: center;
}

.id-back-space {
  height: 10px;
  background: #ffffff;
}

.id-magstripe {
  height: 38px;
  background: #111827;
}

.id-back-body {
  padding: 12px 14px;
  flex: 1;
}

.id-disclaimer {
  font-size: 11px;
  line-height: 1.5;
  color: #6b7280;
}

.id-account-box {
  border: 1px dashed rgba(108, 99, 255, 0.35);
  border-radius: 12px;
  background: #f5f4ff;
  padding: 10px 12px;
}

.id-account-label {
  font-size: 10px;
  color: #888888;
  font-weight: 400;
}

.id-account-value {
  margin-top: 6px;
  font-size: 11px;
  color: #4f46e5;
  font-weight: 400;
  font-family:
    ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono",
    "Courier New", monospace;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.id-qr-box {
  width: 96px;
  height: 96px;
  border-radius: 6px;
  border: none;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: auto;
  overflow: hidden;
}

.id-qr-box img {
  width: 96px;
  height: 96px;
  border-radius: 6px;
  object-fit: contain;
}

.id-meta-row {
  margin-top: 10px;
}

.id-meta-col {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
}

.id-meta-item {
  min-width: 0;
}

.id-meta-label {
  font-size: 10px;
  color: #888888;
  font-weight: 400;
}

.id-meta-value {
  margin-top: 2px;
  font-size: 12px;
  font-weight: 500;
  color: #111827;
}
</style>
