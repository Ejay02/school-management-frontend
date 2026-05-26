<template>
  <div class="container mx-auto rounded border border-gray-300 p-2 w-full">
    <div class="max-w-7xl mx-auto bg-white rounded-lg shadow-md">
      <div
        class="bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-6 rounded-t-lg relative"
      >
        <div class="absolute inset-0 pattern-dots opacity-10"></div>
        <div class="flex gap-2">
          <button
            @click="$router.back()"
            class="top-4 left-4 bg-white/20 backdrop-blur-sm p-2 rounded-full text-white hover:bg-white/30 transition-all animate-bounce-once"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
          </button>

          <h1 class="text-2xl font-bold">
            {{ isEditing ? "Edit Lesson" : "Create New Lesson" }}
          </h1>
        </div>
      </div>

      <div class="p-6">
        <div class="flex flex-col lg:flex-row gap-6 mb-14">
          <!-- Left Column - Basic Info -->
          <div class="flex-1 space-y-6">
            <!-- Title -->
            <div>
              <label
                for="title"
                class="block text-sm font-medium text-gray-700 mb-1"
                >Title <span class="text-red-500">*</span></label
              >
              <input
                v-model="title"
                type="text"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <!-- Class and Subject Selection -->
            <div class="flex gap-4">
              <Dropdown
                v-if="showClassSelect"
                class="w-1/2"
                v-model="selectedClass"
                label="Select Class <span class='text-red-500'>*</span>"
                :options="classOptions"
                emptyLabel="Select a class"
              />
              <div v-else class="w-1/2">
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Class <span class="text-red-500">*</span></label
                >
                <div
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm text-gray-700"
                >
                  {{ selectedClass }}
                </div>
              </div>
              <CustomDropdown
                v-if="showSubjectSelect"
                class="w-1/2"
                v-model="selectedSubject"
                label="Select Subject <span class='text-red-500'>*</span>"
                :options="filteredSubjects"
                placeholder="Select a subject"
                :disabled="!selectedClass"
              />
              <div v-else class="w-1/2">
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Subject <span class="text-red-500">*</span></label
                >
                <div
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm text-gray-700"
                >
                  {{ filteredSubjects[0]?.label || "" }}
                </div>
              </div>
            </div>

            <!-- Day and Time -->
            <div class="grid grid-cols-3 gap-4">
              <div>
                <label
                  for="day"
                  class="block text-sm font-medium text-gray-700 mb-1"
                  >Day <span class="text-red-500">*</span></label
                >
                <select
                  v-model="day"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="Monday">Monday</option>
                  <option value="Tuesday">Tuesday</option>
                  <option value="Wednesday">Wednesday</option>
                  <option value="Thursday">Thursday</option>
                  <option value="Friday">Friday</option>
                </select>
              </div>
              <div>
                <label
                  for="startTime"
                  class="block text-sm font-medium text-gray-700 mb-1"
                  >Start Time <span class="text-red-500">*</span></label
                >
                <input
                  type="time"
                  v-model="startTime"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label
                  for="endTime"
                  class="block text-sm font-medium text-gray-700 mb-1"
                  >End Time <span class="text-red-500">*</span></label
                >
                <input
                  type="time"
                  v-model="endTime"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>
          </div>

          <!-- Right Column - Content -->
          <div class="flex-1 space-y-6">
            <!-- Description -->
            <div>
              <label
                for="description"
                class="block text-sm font-medium text-gray-700 mb-1"
                >Description <span class="text-red-500">*</span></label
              >
              <textarea
                v-model="description"
                rows="2"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm cursor-pointer"
              ></textarea>
            </div>

            <!-- Content -->
            <div class="h-[200px]">
              <label
                for="quill"
                class="block text-sm font-medium text-gray-700 mb-1"
                >Content <span class="text-red-500">*</span></label
              >
              <div class="h-[calc(100%-28px)]">
                <QuillEditor
                  v-model:content="content"
                  contentType="html"
                  theme="snow"
                  toolbar="essential"
                  class="cursor-pointer"
                  placeholder="Enter your lesson content here..."
                />
              </div>
            </div>

            <div class="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <div class="flex items-center justify-between mb-3">
                <h3 class="text-sm font-semibold text-gray-800">
                  Lesson Media
                </h3>
              </div>

              <div class="grid grid-cols-1 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1"
                    >Video URL</label
                  >
                  <input
                    v-model="videoUrl"
                    type="url"
                    placeholder="YouTube/Vimeo or any video link"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                  <div class="flex gap-2 mt-2">
                    <button
                      type="button"
                      class="px-3 py-2 rounded-md text-sm text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 disabled:text-gray-600"
                      :disabled="!canInsertVideo"
                      @click="addVideoToContent"
                    >
                      Add to lesson
                    </button>
                  </div>

                  <div v-if="videoEmbedUrl" class="mt-3">
                    <div
                      class="relative w-full overflow-hidden rounded-lg border border-gray-200 bg-black"
                      style="padding-bottom: 56.25%"
                    >
                      <iframe
                        class="absolute inset-0 w-full h-full"
                        :src="videoEmbedUrl"
                        title="Video preview"
                        frameborder="0"
                        allow="
                          accelerometer;
                          autoplay;
                          clipboard-write;
                          encrypted-media;
                          gyroscope;
                          picture-in-picture;
                          web-share;
                        "
                        allowfullscreen
                      ></iframe>
                    </div>
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1"
                    >Live Lesson Link</label
                  >
                  <input
                    v-model="liveLessonUrl"
                    type="url"
                    placeholder="Zoom / Google Meet / Microsoft Teams link"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                  <div class="flex flex-wrap gap-2 mt-2">
                    <button
                      type="button"
                      class="px-3 py-2 rounded-md text-sm text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 disabled:text-gray-600"
                      :disabled="!canInsertLive"
                      @click="addLiveLinkToContent"
                    >
                      Save link to lesson
                    </button>
                    <button
                      type="button"
                      class="px-3 py-2 rounded-md text-sm border border-indigo-600 text-indigo-700 hover:bg-indigo-50 disabled:border-gray-300 disabled:text-gray-500 disabled:bg-gray-100"
                      :disabled="!canInsertLive"
                      @click="startLiveLesson"
                    >
                      Start live lesson
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex justify-end gap-4 mt-6 border-t pt-6">
          <button
            @click="$router.back()"
            class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            @click="handleSubmit"
            class="px-4 py-2 rounded-md transition-colors duration-200"
            :class="{
              'bg-gradient-to-br from-indigo-500 to-purple-600 text-white hover:bg-indigo-600':
                isFormValid,
              'bg-gray-300 text-gray-500 cursor-not-allowed': !isFormValid,
            }"
            :disabled="!isFormValid"
          >
            {{ isEditing ? "Update" : "Create" }} Lesson
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { QuillEditor } from "@vueup/vue-quill";
import { computed, nextTick, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { apolloClient } from "../../../apollo-client";
import { createLesson, editLesson } from "../../graphql/mutations";
import { getLessonById } from "../../graphql/queries";
import { useClassStore } from "../../store/classStore";
import { useLessonStore } from "../../store/lessonStore";
import { useNotificationStore } from "../../store/notification";
import { useSubjectStore } from "../../store/subjectStore";
import { useUserStore } from "../../store/userStore";
import CustomDropdown from "../dropdowns/customDropdown.vue";
import Dropdown from "../dropdowns/dropdown.vue";

const route = useRoute();
const router = useRouter();
const classStore = useClassStore();
const lessonStore = useLessonStore();
const subjectStore = useSubjectStore();
const notificationStore = useNotificationStore();
const userStore = useUserStore();

// Form fields
const title = ref("");
const description = ref("");
const content = ref("");
const selectedClass = ref("");
const selectedSubject = ref("");
const day = ref("Monday");
const startTime = ref("");
const endTime = ref("");
const videoUrl = ref("");
const liveLessonUrl = ref("");

const isEditing = computed(() => route.params.id !== undefined);

const isTeacher = computed(
  () => String(userStore.currentRole || "").toLowerCase() === "teacher",
);

const classOptions = computed(() => {
  return classStore.getClassNames?.map((classItem) => classItem.name) || [];
});

const showClassSelect = computed(
  () => !isTeacher.value || classOptions.value.length > 1,
);

const filteredSubjects = computed(() => {
  if (!selectedClass.value) return [];
  const userId = userStore.userInfo?.id;
  const subjects = isTeacher.value
    ? classStore.getTeacherSubjectsForClass(selectedClass.value, userId)
    : classStore.getSubjectsForClass(selectedClass.value);

  return (
    subjects?.map((subject) => ({
      value: subject.id,
      label: subject.name,
    })) || []
  );
});

const showSubjectSelect = computed(
  () => !isTeacher.value || filteredSubjects.value.length > 1,
);

const isFormValid = computed(() => {
  return (
    title.value &&
    selectedClass.value &&
    selectedSubject.value &&
    day.value &&
    startTime.value &&
    endTime.value
  );
});

const normalizeUrl = (raw) => {
  const value = String(raw || "").trim();
  if (!value) return "";
  if (/^https?:\/\//i.test(value)) return value;
  return `https://${value}`;
};

const toYoutubeEmbed = (url) => {
  const u = normalizeUrl(url);
  if (!u) return "";
  const match =
    u.match(
      /(?:youtube\.com\/watch\?v=|youtube\.com\/embed\/|youtu\.be\/)([A-Za-z0-9_-]{6,})/i,
    ) || u.match(/youtube\.com\/shorts\/([A-Za-z0-9_-]{6,})/i);
  const id = match?.[1];
  return id ? `https://www.youtube.com/embed/${id}` : "";
};

const toVimeoEmbed = (url) => {
  const u = normalizeUrl(url);
  if (!u) return "";
  const match =
    u.match(/vimeo\.com\/(?:video\/)?(\d{6,})/i) ||
    u.match(/player\.vimeo\.com\/video\/(\d{6,})/i);
  const id = match?.[1];
  return id ? `https://player.vimeo.com/video/${id}` : "";
};

const videoEmbedUrl = computed(() => {
  return toYoutubeEmbed(videoUrl.value) || toVimeoEmbed(videoUrl.value) || "";
});

const canInsertVideo = computed(() => Boolean(normalizeUrl(videoUrl.value)));
const canInsertLive = computed(() =>
  Boolean(normalizeUrl(liveLessonUrl.value)),
);

const buildResourceHtml = ({ label, url, embedUrl }) => {
  const safeUrl = normalizeUrl(url);
  const safeLabel = String(label || "").trim() || "Resource";

  const embed = embedUrl
    ? `<div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;border-radius:12px;border:1px solid #e5e7eb;background:#000;"><iframe src="${embedUrl}" style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></div>`
    : "";

  const link = `<div style="margin-top:10px;"><a href="${safeUrl}" target="_blank" rel="noopener noreferrer" style="color:#4f46e5;text-decoration:underline;">${safeLabel}</a></div>`;

  return `<div style="border:1px solid #e5e7eb;border-radius:12px;padding:12px;margin-top:12px;">${embed}${link}</div>`;
};

const ensureResourcesHeader = (html) => {
  const value = String(html || "");
  if (value.includes('data-lesson-resources="true"')) return value;
  const header = `<div data-lesson-resources="true" style="margin-top:16px;"><h3 style="font-weight:700;font-size:16px;margin:0 0 8px 0;">Resources</h3></div>`;
  if (!value.trim()) return header;
  return `${value}${header}`;
};

const appendResourceToContent = ({ label, url, embedUrl }) => {
  const next = ensureResourcesHeader(content.value);
  const snippet = buildResourceHtml({ label, url, embedUrl });
  content.value = `${next}${snippet}`;
};

const addVideoToContent = () => {
  const url = normalizeUrl(videoUrl.value);
  if (!url) return;
  const embedUrl = videoEmbedUrl.value || "";
  appendResourceToContent({
    label: "Video",
    url,
    embedUrl,
  });
};

const addLiveLinkToContent = () => {
  const url = normalizeUrl(liveLessonUrl.value);
  if (!url) return;
  appendResourceToContent({
    label: "Live lesson link",
    url,
    embedUrl: "",
  });
};

const startLiveLesson = () => {
  const url = normalizeUrl(liveLessonUrl.value);
  if (!url) return;
  globalThis.open(url, "_blank", "noopener,noreferrer");
};

const getClassIdByName = (className) => {
  const classItem = classStore.getClassNames.find((c) => c.name === className);
  return classItem ? classItem.id : null;
};

const toWeekdayIndex = (dayLabel) => {
  const normalized = String(dayLabel || "")
    .trim()
    .toLowerCase();
  const map = {
    sunday: 0,
    monday: 1,
    tuesday: 2,
    wednesday: 3,
    thursday: 4,
    friday: 5,
    saturday: 6,
    sun: 0,
    mon: 1,
    tue: 2,
    tues: 2,
    wed: 3,
    thu: 4,
    thur: 4,
    thurs: 4,
    fri: 5,
    sat: 6,
  };
  return Object.prototype.hasOwnProperty.call(map, normalized)
    ? map[normalized]
    : null;
};

const toMinutes = (hhmm) => {
  const [h, m] = String(hhmm || "")
    .split(":")
    .map((v) => Number(v));
  if (Number.isNaN(h) || Number.isNaN(m)) return null;
  return h * 60 + m;
};

const applyCalendarPrefill = () => {
  if (isEditing.value) return;

  const dayParam = route.query?.day;
  const startTimeParam = route.query?.startTime;
  const endTimeParam = route.query?.endTime;
  const dateParam = route.query?.date;
  const classNameParam = route.query?.className;
  const subjectIdParam = route.query?.subjectId;

  if (typeof startTimeParam === "string" && startTimeParam) {
    startTime.value = startTimeParam;
  }
  if (typeof endTimeParam === "string" && endTimeParam) {
    endTime.value = endTimeParam;
  }

  if (typeof classNameParam === "string" && classNameParam) {
    selectedClass.value = classNameParam;
  }
  if (typeof subjectIdParam === "string" && subjectIdParam) {
    selectedSubject.value = subjectIdParam;
  }

  if (typeof dayParam === "string" && dayParam) {
    day.value = dayParam;
    return;
  }

  if (typeof dateParam === "string" && dateParam) {
    const d = new Date(`${dateParam}T00:00:00`);
    if (!Number.isNaN(d.getTime())) {
      day.value = d.toLocaleDateString("en-US", { weekday: "long" });
    }
  }
};

const handleSubmit = async () => {
  try {
    const weekdayIndex = toWeekdayIndex(day.value);
    if (weekdayIndex === null) {
      notificationStore.addNotification({
        type: "error",
        message: "Please select a valid weekday (Monday to Friday).",
      });
      return;
    }
    if (weekdayIndex === 0 || weekdayIndex === 6) {
      notificationStore.addNotification({
        type: "error",
        message: "Lessons can only be scheduled Monday to Friday.",
      });
      return;
    }

    const startMinutes = toMinutes(startTime.value);
    const endMinutes = toMinutes(endTime.value);
    if (startMinutes === null || endMinutes === null) {
      notificationStore.addNotification({
        type: "error",
        message: "Please enter a valid start and end time.",
      });
      return;
    }
    if (endMinutes <= startMinutes) {
      notificationStore.addNotification({
        type: "error",
        message: "End time must be after start time.",
      });
      return;
    }
    if (startMinutes < 9 * 60 || endMinutes > 14 * 60) {
      notificationStore.addNotification({
        type: "error",
        message: "School hours are 9:00am to 2:00pm (Mon-Fri).",
      });
      return;
    }
    if (startMinutes < 13 * 60 && endMinutes > 12 * 60) {
      notificationStore.addNotification({
        type: "error",
        message: "Break time is 12:00pm to 1:00pm. Please choose another time.",
      });
      return;
    }

    const formattedContent = content.value || "";
    const formattedDescription = description.value || "";

    const lessonData = {
      name: title.value,
      description: formattedDescription,
      content: formattedContent,
      day: day.value,
      startTime: startTime.value,
      endTime: endTime.value,
    };

    if (isEditing.value) {
      await apolloClient.mutate({
        mutation: editLesson,
        variables: {
          lessonId: route.params.id,
          editLessonInput: lessonData,
        },
      });
      await lessonStore.refreshLessons();
      notificationStore.addNotification({
        type: "success",
        message: "Lesson updated successfully!",
      });
    } else {
      await apolloClient.mutate({
        mutation: createLesson,
        variables: {
          classId: getClassIdByName(selectedClass.value),
          subjectId: selectedSubject.value,
          createLessonInput: lessonData,
        },
      });
      await lessonStore.refreshLessons();
      notificationStore.addNotification({
        type: "success",
        message: "Lesson created successfully!",
      });
    }

    router.push("/lessons");
  } catch (error) {
    notificationStore.addNotification({
      type: "error",
      message: "Failed to save lesson: " + error.message,
    });
  }
};

// Load lesson data if editing
onMounted(async () => {
  applyCalendarPrefill();
  if (!classStore.classes.length) {
    await classStore.fetchClasses();
  }
  if (!subjectStore.subjects.length) {
    await subjectStore.fetchSubjects();
  }
  if (!isEditing.value && isTeacher.value) {
    if (!selectedClass.value && classOptions.value.length === 1) {
      selectedClass.value = classOptions.value[0];
    }
    if (
      selectedClass.value &&
      !selectedSubject.value &&
      filteredSubjects.value.length === 1
    ) {
      selectedSubject.value = filteredSubjects.value[0].value;
      await nextTick();
    }
  }
  if (!isEditing.value && selectedClass.value && route.query?.subjectId) {
    await nextTick();
  }
  if (isEditing.value) {
    const { data } = await apolloClient.query({
      query: getLessonById,
      variables: { id: route.params.id },
    });

    const lesson = data.getLessonById;
    title.value = lesson.name;
    description.value = lesson.description;
    content.value = lesson.content;
    day.value = lesson.day;
    startTime.value = lesson.startTime;
    endTime.value = lesson.endTime;

    if (lesson.class && lesson.class.name) {
      selectedClass.value = lesson.class.name;
    }
    // Wait for the next tick to ensure filteredSubjects is updated
    await nextTick();

    // Set subject ID directly from the response
    if (lesson.subject && lesson.subject.id) {
      selectedSubject.value = lesson.subject.id;
    }
  }
});
</script>
