<template>
  <div class="rounded border border-gray-300 p-2 w-full">
    <div class="flex h-screen shadow-lg">
      <!-- Chat sidebar -->
      <div
        dir="ltr"
        class="w-64 bg-white shadow-md overflow-y-auto rounded-s-lg"
      >
        <div class="p-4 border-b">
          <h2 class="font-semibold text-lg text-gray-800">Chats</h2>
          <div class="mt-2">
            <div class="relative">
              <input
                type="text"
                placeholder="Search conversations..."
                class="w-full pl-8 pr-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <svg
                class="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        <!-- New chat button -->
        <div class="p-3">
          <button
            class="w-full flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
            New Chat
          </button>
        </div>

        <!-- Chat tabs -->
        <div class="px-3 border-b">
          <div class="flex">
            <button
              @click="activeTab = 'direct'"
              :class="[
                'flex-1 py-2 text-sm font-medium text-center',
                activeTab === 'direct'
                  ? 'text-blue-600 border-b-2 border-blue-500'
                  : 'text-gray-500 hover:text-gray-700',
              ]"
            >
              Direct
            </button>
            <button
              @click="activeTab = 'groups'"
              :class="[
                'flex-1 py-2 text-sm font-medium text-center',
                activeTab === 'groups'
                  ? 'text-blue-600 border-b-2 border-blue-500'
                  : 'text-gray-500 hover:text-gray-700',
              ]"
            >
              Groups
            </button>
          </div>
        </div>

        <!-- Chat list -->
        <div class="p-2">
          <div v-if="activeTab === 'direct'">
            <div
              v-for="contact in directChats"
              :key="contact.id"
              :class="[
                'flex items-center px-2 py-3 rounded-md my-1 cursor-pointer',
                contact.id === activeChat ? 'bg-blue-100' : 'hover:bg-gray-100',
              ]"
              @click="activeChat = contact.id"
            >
              <div class="relative">
                <img
                  :src="contact.imageUrl"
                  class="h-10 w-10 rounded-full mr-3"
                  alt=""
                />
                <div
                  v-if="contact.online"
                  class="absolute bottom-0 right-2 h-3 w-3 rounded-full bg-green-500 border-2 border-white"
                ></div>
              </div>
              <div class="min-w-0 flex-1">
                <div class="flex items-center justify-between">
                  <p class="text-sm font-medium truncate">{{ contact.name }}</p>
                  <p class="text-xs text-gray-500">
                    {{ contact.lastMessageTime }}
                  </p>
                </div>
                <div class="flex">
                  <p class="text-xs text-gray-500 truncate">
                    {{ contact.preview }}
                  </p>
                  <span
                    v-if="contact.unread"
                    class="ml-2 inline-flex items-center justify-center bg-blue-500 text-white text-xs rounded-full h-5 w-5 leading-none flex-shrink-0"
                  >
                    {{ contact.unread }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div v-else>
            <div
              v-for="group in groupChats"
              :key="group.id"
              :class="[
                'flex items-center px-2 py-3 rounded-md my-1 cursor-pointer',
                group.id === activeChat ? 'bg-blue-100' : 'hover:bg-gray-100',
              ]"
              @click="activeChat = group.id"
            >
              <div
                class="relative bg-gray-200 h-10 w-10 rounded-full mr-3 flex items-center justify-center"
              >
                <span class="text-sm font-medium text-gray-600">{{
                  group.acronym
                }}</span>
              </div>
              <div class="min-w-0 flex-1">
                <div class="flex items-center justify-between">
                  <p class="text-sm font-medium truncate">{{ group.name }}</p>
                  <p class="text-xs text-gray-500">
                    {{ group.lastMessageTime }}
                  </p>
                </div>
                <div class="flex">
                  <p class="text-xs text-gray-500 truncate">
                    <span class="font-medium">{{ group.lastSender }}:</span>
                    {{ group.preview }}
                  </p>
                  <!--  -->
                  <span
                    v-if="group.unread"
                    class="ml-2 inline-flex items-center justify-center bg-blue-500 text-white text-xs rounded-full h-5 w-5 leading-none flex-shrink-0"
                  >
                    {{ group.unread }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Main chat area -->
      <div class="flex-1 flex flex-col">
        <!-- Chat header -->
        <div
          class="border-b bg-white px-4 py-3 flex items-center shadow-sm rounded-tr-lg"
        >
          <div v-if="currentChatInfo" class="flex items-center">
            <div v-if="currentChatInfo.type === 'direct'" class="relative">
              <img
                :src="currentChatInfo.imageUrl"
                class="h-10 w-10 rounded-full mr-3"
                alt=""
              />
              <div
                v-if="currentChatInfo.online"
                class="absolute bottom-0 right-2 h-3 w-3 rounded-full bg-green-500 border-2 border-white"
              ></div>
            </div>
            <div
              v-else
              class="bg-gray-200 h-10 w-10 rounded-full mr-3 flex items-center justify-center"
            >
              <span class="text-sm font-medium text-gray-600">{{
                currentChatInfo.acronym
              }}</span>
            </div>
            <div>
              <h2 class="font-semibold text-gray-800">
                {{ currentChatInfo.name }}
              </h2>
              <p
                v-if="currentChatInfo.type === 'direct'"
                class="text-xs text-gray-500"
              >
                {{ currentChatInfo.role }}
                <span v-if="currentChatInfo.online" class="text-green-500 ml-2"
                  >Online</span
                >
                <span v-else class="text-gray-500 ml-2">{{
                  currentChatInfo.lastSeen
                }}</span>
              </p>
              <p v-else class="text-xs text-gray-500">
                {{ currentChatInfo.members }} members
              </p>
            </div>
          </div>
          <div class="ml-auto flex space-x-2">
            <button class="p-2 rounded-full hover:bg-gray-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
            </button>
            <button class="p-2 rounded-full hover:bg-gray-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            </button>
            <button class="p-2 rounded-full hover:bg-gray-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>

        <!-- Chat messages area -->
        <div class="flex-1 overflow-y-auto p-4 bg-gray-120 cursor-pointer">
          <div v-if="currentChatInfo">
            <div class="text-center text-xs text-gray-500 mb-4">
              {{ currentChatInfo.date || "Today" }}
            </div>

            <div
              v-for="(message, index) in currentChatInfo.messages"
              :key="index"
              class="mb-4"
            >
              <div
                v-if="message.type === 'date'"
                class="text-center text-xs text-gray-500 my-4"
              >
                {{ message.text }}
              </div>

              <div
                v-else-if="message.type === 'system'"
                class="text-center text-xs bg-gray-100 text-gray-500 rounded-full px-4 py-1 mx-auto my-4 inline-block"
              >
                {{ message.text }}
              </div>

              <div
                v-else
                class="flex items-start"
                :class="[message.fromMe ? 'justify-end' : 'justify-start']"
              >
                <template
                  v-if="
                    !message.fromMe &&
                    currentChatInfo.type === 'group' &&
                    !message.continued
                  "
                >
                  <img
                    :src="message.senderImg"
                    class="h-8 w-8 rounded-full mr-2 mt-1"
                    alt=""
                  />
                </template>
                <template
                  v-else-if="
                    !message.fromMe && currentChatInfo.type === 'group'
                  "
                >
                  <div class="w-8 mr-2"></div>
                </template>

                <div
                  :class="[
                    'max-w-xs sm:max-w-md rounded-lg p-3 mb-1',
                    message.fromMe
                      ? 'bg-blue-500 text-white rounded-br-none'
                      : 'bg-white text-gray-800 shadow-sm rounded-bl-none',
                  ]"
                >
                  <p
                    v-if="
                      !message.fromMe &&
                      currentChatInfo.type === 'group' &&
                      !message.continued
                    "
                    class="text-xs font-medium mb-1"
                    :style="{ color: message.senderColor }"
                  >
                    {{ message.sender }}
                  </p>
                  <div
                    v-if="message.files && message.files.length"
                    class="mb-2"
                  >
                    <div
                      v-for="(file, fileIndex) in message.files"
                      :key="fileIndex"
                      class="mb-2 last:mb-0"
                    >
                      <div
                        v-if="file.type === 'image'"
                        class="rounded overflow-hidden"
                      >
                        <img
                          :src="file.url"
                          class="w-full h-auto max-h-40 object-cover"
                          alt="Image"
                        />
                      </div>
                      <div
                        v-else-if="file.type === 'document'"
                        class="flex items-center p-2 bg-gray-100 rounded"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          class="h-6 w-6 text-gray-500 mr-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                          />
                        </svg>
                        <div>
                          <p class="text-xs font-medium">{{ file.name }}</p>
                          <p class="text-xs">{{ file.size }}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <p class="text-sm">{{ message.text }}</p>
                </div>
              </div>

              <div
                v-if="
                  !message.continued &&
                  message.type !== 'date' &&
                  message.type !== 'system'
                "
                :class="[
                  'text-xs text-gray-500',
                  message.fromMe
                    ? 'text-right'
                    : message.sender
                    ? 'ml-10'
                    : 'ml-0',
                ]"
              >
                {{ message.time }}
                <span v-if="message.fromMe" class="ml-1">
                  <svg
                    v-if="message.read"
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-3 w-3 inline text-blue-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  <svg
                    v-else
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-3 w-3 inline text-gray-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </span>
              </div>
            </div>
          </div>
          <div v-else class="h-full flex items-center justify-center">
            <div class="text-center text-gray-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-12 w-12 mx-auto text-gray-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                />
              </svg>
              <p class="mt-2">Select a conversation or start a new chat</p>
            </div>
          </div>
        </div>

        <!-- Message input area -->
        <div v-if="currentChatInfo" class="border-t bg-white p-3 rounded-br-lg">
          <div class="pb-2">
            <button class="p-2 rounded hover:bg-gray-100 text-gray-500">
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
                  d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                />
              </svg>
            </button>
          </div>
          <div class="flex items-center">
            <div class="flex-1 bg-gray-100 rounded-lg px-4 py-2">
              <input
                type="text"
                placeholder="Type a message..."
                class="w-full bg-transparent border-0 focus:outline-none cursor-pointer"
              />
            </div>
            <button
              class="ml-4 w-10 h-10 flex items-center justify-center rounded-full bg-blue-500 hover:bg-blue-600 text-white"
            >
              <i class="fa-solid fa-paper-plane text-sm"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";


const people = [
  {
    name: "Leslie Alexander",
    email: "leslie.alexander@example.com",
    role: "Admin",
    imageUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    lastSeen: "30m ago",
    lastSeenDateTime: "2023-01-23T13:23Z",
  },
  {
    name: "Michael Foster",
    email: "michael.foster@example.com",
    role: "Teacher | JSS 3",
    imageUrl:
      "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    lastSeen: "3h ago",
    lastSeenDateTime: "2023-01-23T13:23Z",
  },
  {
    name: "Dries Vincent",
    email: "dries.vincent@example.com",
    role: "Student | Primary 2",
    imageUrl:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    lastSeen: null,
  },
  {
    name: "Lindsay Walton",
    email: "lindsay.walton@example.com",
    role: "Admin",
    imageUrl:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    lastSeen: "1h ago",
    lastSeenDateTime: "2023-01-23T13:23Z",
  },
  {
    name: "Courtney Henry",
    email: "courtney.henry@example.com",
    role: "Teacher | SS 3",
    imageUrl:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    lastSeen: "30s ago",
    lastSeenDateTime: "2023-01-23T13:23Z",
  },
  {
    name: "Tom Cook",
    email: "tom.cook@example.com",
    role: "Teacher | JSS 1",
    imageUrl:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    lastSeen: null,
  },
];

// Chat tab state
const activeTab = ref("direct");
const activeChat = ref(1);


const directChats = [
  {
    id: 1,
    type: "direct",
    name: "Michael Foster",
    role: "Teacher | JSS 3",
    imageUrl:
      "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    preview: "Let me know if you have any questions",
    lastMessageTime: "10:42 AM",
    unread: 0,
    online: true,
    messages: [
      {
        type: "date",
        text: "Today",
      },
      {
        text: "Hello Mr. Foster, I had a question about the math assignment",
        time: "9:30 AM",
        fromMe: true,
        read: true,
      },
      {
        text: "Hi there! Of course, what specific part is giving you trouble?",
        time: "9:45 AM",
        fromMe: false,
        read: true,
      },
      {
        text: "I'm confused about question 4, the one about probability",
        time: "9:47 AM",
        fromMe: true,
        read: true,
      },
      {
        text: "Let me explain that one. For probability problems, remember to identify all possible outcomes first, then the favorable outcomes.",
        time: "9:52 AM",
        fromMe: false,
        read: true,
      },
      {
        text: "In this case, you need to calculate the probability of drawing a specific card from a standard deck.",
        time: "9:53 AM",
        fromMe: false,
        read: true,
        continued: true,
      },
      {
        text: "Oh, I see! So the total number of outcomes is 52, and I need to find how many cards meet the specific condition.",
        time: "10:01 AM",
        fromMe: true,
        read: true,
      },
      {
        text: "Exactly! Let me know if you have any other questions.",
        time: "10:42 AM",
        fromMe: false,
        read: true,
      },
    ],
  },
  {
    id: 2,
    type: "direct",
    name: "Lindsay Walton",
    role: "Admin",
    imageUrl:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    preview: "The meeting is confirmed for 3 PM",
    lastMessageTime: "Yesterday",
    unread: 1,
    online: false,
    lastSeen: "20m ago",
    date: "Yesterday",
    messages: [
      {
        type: "date",
        text: "Yesterday",
      },
      {
        text: "Hello Ms. Walton, I wanted to schedule a meeting to discuss my child's progress",
        time: "2:30 PM",
        fromMe: true,
        read: true,
      },
      {
        text: "Hi! I'd be happy to arrange that. How does tomorrow at 3 PM sound?",
        time: "2:45 PM",
        fromMe: false,
        read: true,
      },
      {
        text: "That works perfectly for me. Thank you!",
        time: "2:50 PM",
        fromMe: true,
        read: true,
      },
      {
        text: "Great! The meeting is confirmed for 3 PM. It will be in the main office conference room.",
        time: "3:00 PM",
        fromMe: false,
        read: false,
      },
      {
        files: [
          {
            type: "document",
            name: "Meeting_Details.pdf",
            size: "245 KB",
          },
        ],
        text: "I've attached the student progress report for your review before our meeting.",
        time: "3:01 PM",
        fromMe: false,
        read: false,
        continued: true,
      },
    ],
  },
  {
    id: 3,
    type: "direct",
    name: "Courtney Henry",
    role: "Teacher | SS 3",
    imageUrl:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    preview: "Your child did very well on the recent test",
    lastMessageTime: "Mar 8",
    unread: 0,
    online: false,
    lastSeen: "1h ago",
    date: "March 8, 2025",
    messages: [
      {
        type: "date",
        text: "March 8, 2025",
      },
      {
        text: "Hello! I wanted to let you know that your child did very well on the recent chemistry test.",
        time: "1:30 PM",
        fromMe: false,
        read: true,
      },
      {
        text: "They scored in the top 10% of the class.",
        time: "1:31 PM",
        fromMe: false,
        read: true,
        continued: true,
      },
      {
        text: "That's wonderful news! Thank you for letting me know. We've been working hard on study habits at home.",
        time: "2:00 PM",
        fromMe: true,
        read: true,
      },
      {
        text: "It definitely shows. I'd encourage them to consider joining the science club as well.",
        time: "2:15 PM",
        fromMe: false,
        read: true,
      },
    ],
  },
  {
    id: 4,
    type: "direct",
    name: "Dries Vincent",
    role: "Student | Primary 2",
    imageUrl:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    preview: "When is the assignment due?",
    lastMessageTime: "Mar 7",
    unread: 0,
    online: true,
    date: "March 7, 2025",
    messages: [
      {
        type: "date",
        text: "March 7, 2025",
      },
      {
        text: "Teacher, when is the math assignment due?",
        time: "11:20 AM",
        fromMe: false,
        read: true,
      },
      {
        text: "Hello Dries, the assignment is due next Friday. Do you need any help with it?",
        time: "11:30 AM",
        fromMe: true,
        read: true,
      },
      {
        text: "Thank you! I think I understand most of it, but I might need help with the last problem.",
        time: "11:45 AM",
        fromMe: false,
        read: true,
      },
    ],
  },
];

// Group chat conversations
const groupChats = [
  {
    id: 5,
    type: "group",
    name: "SS3 Mathematics",
    acronym: "SM",
    members: 32,
    lastSender: "Tom Cook",
    preview: "The formula sheet has been uploaded",
    lastMessageTime: "11:23 AM",
    unread: 3,
    date: "Today",
    messages: [
      {
        type: "date",
        text: "Today",
      },
      {
        type: "system",
        text: "Courtney Henry added you to the group",
      },
      {
        text: "Good morning everyone! I've uploaded the formula sheet for the upcoming exam",
        time: "9:15 AM",
        fromMe: false,
        sender: "Tom Cook",
        senderColor: "#4f46e5",
        senderImg:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        read: true,
      },
      {
        files: [
          {
            type: "document",
            name: "Mathematics_Formula_Sheet.pdf",
            size: "356 KB",
          },
        ],
        text: "Please review it and let me know if you have any questions",
        time: "9:16 AM",
        fromMe: false,
        sender: "Tom Cook",
        senderColor: "#4f46e5",
        senderImg:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        continued: true,
        read: true,
      },
      {
        text: "Thank you Mr. Cook! Will this be the only reference material we can use during the exam?",
        time: "9:45 AM",
        fromMe: false,
        sender: "Lindsay Walton",
        senderColor: "#0369a1",
        senderImg:
          "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        read: true,
      },
      {
        text: "Yes, this will be the only reference sheet. The formula sheet has been updated with all necessary equations.",
        time: "11:23 AM",
        fromMe: true,
        read: false,
      },
    ],
  },
  {
    id: 6,
    type: "group",
    name: "Primary 2 Parents",
    acronym: "P2",
    members: 28,
    lastSender: "Courtney Henry",
    preview: "Don't forget about the field trip tomorrow",
    lastMessageTime: "Yesterday",
    unread: 0,
    date: "Yesterday",
    messages: [
      {
        type: "date",
        text: "Yesterday",
      },
      {
        text: "Just a reminder to all parents that we have the science museum field trip tomorrow",
        time: "2:30 PM",
        fromMe: false,
        sender: "Courtney Henry",
        senderColor: "#be185d",
        senderImg:
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        read: true,
      },
      {
        text: "Please make sure your children bring their permission slips and arrive by 8:30 AM",
        time: "2:31 PM",
        fromMe: false,
        sender: "Courtney Henry",
        senderColor: "#be185d",
        senderImg:
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        continued: true,
        read: true,
      },
      {
        text: "Will lunch be provided or should they bring their own?",
        time: "3:15 PM",
        fromMe: true,
        read: true,
      },
      {
        text: "Great question! They should bring their own lunch as we'll be eating at the museum's picnic area",
        time: "3:30 PM",
        fromMe: false,
        sender: "Courtney Henry",
        senderColor: "#be185d",
        senderImg:
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        read: true,
      },
    ],
  },
  {
    id: 7,
    type: "group",
    name: "School Admin Team",
    acronym: "SA",
    members: 12,
    lastSender: "Leslie Alexander",
    preview: "Budget meeting scheduled for Friday",
    lastMessageTime: "Mar 6",
    unread: 0,
    date: "March 6, 2025",
    messages: [
      {
        type: "date",
        text: "March 6, 2025",
      },
      {
        text: "Hello team, we need to schedule our quarterly budget review",
        time: "10:00 AM",
        fromMe: false,
        sender: "Leslie Alexander",
        senderColor: "#0891b2",
        senderImg:
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        read: true,
      },
      {
        text: "I'm proposing this Friday at 2:00 PM. Please let me know if this works for everyone",
        time: "10:01 AM",
        fromMe: false,
        sender: "Leslie Alexander",
        senderColor: "#0891b2",
        senderImg:
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        continued: true,
        read: true,
      },
      {
        text: "That works for me",
        time: "10:15 AM",
        fromMe: true,
        read: true,
      },
    ],
  },
];

// Computed property to get the current chat information
const currentChatInfo = computed(() => {
  // First check direct chats
  const directChat = directChats.find((chat) => chat.id === activeChat.value);
  if (directChat) return directChat;

  // Then check group chats
  const groupChat = groupChats.find((chat) => chat.id === activeChat.value);
  if (groupChat) return groupChat;

  return null;
});
</script>
