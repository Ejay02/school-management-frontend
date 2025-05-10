<template>
  <div
    v-if="isModalVisible"
    class="fixed top-0 left-0 w-full h-full bg-gray-900/80 flex justify-center items-center z-50"
    @click.self="handleCancel"
    :key="isModalVisible"
  >
    <!-- max-w-lg w-full text-left bg-white cursor-pointer rounded-md h-auto mt-4 shadow-md overflow-y-auto -->
    <div
      class="max-w-lg w-full text-left bg-white cursor-pointer rounded-md h-auto mt-4 shadow-md overflow-y-auto"
    >
      <div
        class="bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-4 relative"
      >
      <div class="absolute inset-0 pattern-dots opacity-10"></div>
        <h3 class="text-xl font-medium capitalize items-center text-center">
          Edit {{ formatSourceTitle(source) }}
        </h3>
      </div>

      <div class="p-6 space-y-4 cursor-pointer">
        <!-- teacher list -->
        <template v-if="source === 'teacherList'">
          <div class="flex gap-2">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Name
                <input
                  v-model="data.name"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm cursor-pointer"
                />
              </label>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Email
                <input
                  v-model="data.email"
                  type="email"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm cursor-pointer"
                />
              </label>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Photo
              <input
                v-model="data.photo"
                type="email"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm cursor-pointer"
              />
            </label>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Subjects
              <input
                v-model="data.subjects"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm cursor-pointer"
              />
            </label>
          </div>

          <div class="flex gap-2">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Classes
                <input
                  v-model="data.classes"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm cursor-pointer"
                />
              </label>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Phone
                <input
                  v-model="data.phone"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm cursor-pointer"
                />
              </label>
            </div>
          </div>

          <label class="block text-sm font-medium text-gray-700 mb-1"
            >Address
            <input
              v-model="data.address"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm cursor-pointer"
            />
          </label>
        </template>

        <!-- teacher card -->
        <template v-if="source === 'teacherCard'">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Name

              <input
                v-model="name"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm cursor-pointer"
              />
            </label>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Photo
              <input
                v-model="data.photo"
                type="email"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm cursor-pointer"
              />
            </label>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Description
              <input
                v-model="data.description"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm cursor-pointer"
              />
            </label>
          </div>

          <div class="flex gap-2">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Email
                <input
                  v-model="transformedData.email"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm cursor-pointer"
                />
              </label>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Birthday
                <input
                  v-model="transformedData.date"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm cursor-pointer"
                />
              </label>
            </div>
          </div>

          <div class="flex gap-2">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Blood Group
                <input
                  v-model="transformedData.bloodgroup"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm cursor-pointer"
                />
              </label>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Phone
                <input
                  v-model="transformedData.phone"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm cursor-pointer"
                />
              </label>
            </div>
          </div>
        </template>

        <!-- student List -->
        <template v-if="source === 'studentList'">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Name
              <input
                v-model="data.name"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm cursor-pointer"
              />
            </label>
          </div>

          <div class="flex gap-2">
            <div>
              <label
                class="block text-sm font-medium text-gray-700 mb-1 capitalize"
                >class
                <input
                  v-model="data.class"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm cursor-pointer"
                />
              </label>
            </div>

            <div>
              <label
                class="block text-sm font-medium text-gray-700 mb-1 capitalize"
                >grade
                <input
                  v-model="data.grade"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm cursor-pointer"
                />
              </label>
            </div>
          </div>
          <div class="flex gap-2">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Phone
                <input
                  v-model="data.phone"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm cursor-pointer"
                />
              </label>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Student Id
                <input
                  v-model="data.studentId"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm cursor-pointer"
                />
              </label>
            </div>
          </div>

          <label class="block text-sm font-medium text-gray-700 mb-1"
            >Address
            <input
              v-model="data.address"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm cursor-pointer"
            />
          </label>
        </template>

        <!-- parent list -->
        <template v-if="source === 'parentList'">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Name
              <input
                v-model="data.name"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm cursor-pointer"
              />
            </label>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Email
              <input
                v-model="data.email"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm cursor-pointer"
              />
            </label>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Student Name
              <input
                v-model="data.students"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm cursor-pointer"
              />
            </label>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Phone
              <input
                v-model="data.phone"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm cursor-pointer"
              />
            </label>
          </div>

          <label class="block text-sm font-medium text-gray-700 mb-1"
            >Address
            <input
              v-model="data.address"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm cursor-pointer"
            />
          </label>
        </template>

        <!-- class list -->
        <template v-else-if="source === 'classList'">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Class Name
              <input
                v-model="className"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm cursor-pointer"
              />
            </label>
          </div>

          <div class="flex gap-2 w-full">
            <div class="w-1/2">
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Capacity
                <input
                  v-model="classCapacity"
                  type="number"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm cursor-pointer"
                />
              </label>
            </div>
            <div class="w-1/2">
              <Dropdown
                v-model="selectedTeacher"
                label="Select Supervisor"
                :options="teacherNames"
                emptyLabel="Select a supervisor"
              />
            </div>
          </div>
        </template>

        <!-- subject list -->
        <template v-else-if="source === 'subjectList'">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Subject Name
              <input
                v-model="subjectName"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm cursor-pointer"
              />
            </label>
          </div>

          <div class="flex gap-2">
            <Dropdown
              class="w-1/2"
              v-model="selectedTeacher"
              label="Select Teacher"
              :options="teacherNames"
              emptyLabel="Select a teacher"
            />

            <Dropdown
              class="w-1/2"
              v-model="selectedClass"
              label="Select Class"
              :options="classOptions"
              emptyLabel="Select a class"
            />
          </div>
        </template>

        <!-- exam -->
        <template v-else-if="source === 'examList'">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Subject
              <input
                v-model="data.subject"
                type="text"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm cursor-pointer"
              />
            </label>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Class
              <input
                v-model="data.class"
                type="text"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm cursor-pointer"
              />
            </label>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Teacher
              <input
                v-model="data.teacher"
                type="text"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm cursor-pointer"
              />
            </label>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Date
              <input
                type="date"
                v-model="data.date"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm cursor-pointer"
              />
            </label>
          </div>
        </template>

        <!-- assignment -->
        <template v-else-if="source === 'assignmentList'">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Subject
              <input
                v-model="data.subject"
                type="text"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm cursor-pointer"
              />
            </label>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Class
              <input
                v-model="data.class"
                type="text"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm cursor-pointer"
              />
            </label>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Teacher
              <input
                v-model="data.teacher"
                type="text"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm cursor-pointer"
              />
            </label>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Due Date
              <input
                type="date"
                v-model="data.dueDate"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm cursor-pointer"
              />
            </label>
          </div>
        </template>

        <!-- result -->
        <template v-else-if="source === 'resultList'">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Subject
              <input
                v-model="data.subject"
                type="text"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm cursor-pointer"
              />
            </label>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Student
              <input
                v-model="data.student"
                type="text"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm cursor-pointer"
              />
            </label>
          </div>
          <div class="flex gap-2">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Score
                <input
                  v-model="data.score"
                  type="text"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm cursor-pointer"
                />
              </label>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Class
                <input
                  v-model="data.class"
                  type="text"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm cursor-pointer"
                />
              </label>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Teacher
              <input
                v-model="data.teacher"
                type="text"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm cursor-pointer"
              />
            </label>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Date
              <input
                type="date"
                v-model="data.date"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm cursor-pointer"
              />
            </label>
          </div>
        </template>

        <!-- announcement -->
        <template v-else-if="source === 'announcementList'">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Title
              <input
                type="text"
                v-model="announcementTitle"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm cursor-pointer"
              />
            </label>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Content
              <textarea
                v-model="content"
                rows="4"
                type="text"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm cursor-pointer"
              />
            </label>
          </div>
          <div class="flex gap-2">
            <div class="w-1/2">
              <label
                for="targetRoles"
                class="block text-sm font-medium text-gray-700 mb-1"
                >Target Audience
              </label>

              <!-- Dropdown for selecting roles -->
              <div class="relative">
                <button
                  @click="toggleTargetRolesDropdown"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-left focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm cursor-pointer"
                >
                  <span v-if="selectedTargetRoles.length === 0"
                    >Select audience</span
                  >
                  <span v-else>{{ selectedTargetRoles.length }} selected</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5 text-gray-400 absolute right-2 top-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </button>

                <!-- Dropdown menu -->
                <div
                  v-if="isTargetRolesDropdownOpen"
                  class="absolute z-50 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto"
                >
                  <!-- Select All option -->
                  <div
                    @click="selectAllTargetRoles"
                    class="px-4 py-2 text-sm text-gray-700 hover:bg-indigo-100 cursor-pointer"
                  >
                    Select All
                  </div>

                  <!-- Individual role options -->
                  <div
                    v-for="role in availableTargetRoles"
                    :key="role.value"
                    @click="toggleTargetRole(role)"
                    class="px-4 py-2 text-sm text-gray-700 hover:bg-indigo-100 cursor-pointer flex items-center"
                  >
                    <input
                      type="checkbox"
                      :checked="isTargetRoleSelected(role)"
                      class="mr-2"
                      @click.stop
                    />
                    {{ role.label }}
                  </div>
                </div>
              </div>

              <!-- Selected roles tags - moved to bottom -->
              <div
                v-if="selectedTargetRoles.length > 0"
                class="flex flex-wrap gap-1 mt-2"
              >
                <div
                  v-for="role in selectedTargetRoles"
                  :key="role.value"
                  class="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-md flex items-center"
                >
                  {{ role.label }}
                  <button
                    @click="removeTargetRole(role)"
                    class="ml-1 text-indigo-500 hover:text-indigo-700"
                  >
                    <span class="text-xs">×</span>
                  </button>
                </div>
              </div>
            </div>

            <Dropdown
              class="w-1/2"
              v-model="selectedClass"
              label="Select Class"
              :options="classOptions"
              emptyLabel="Select a class"
            />
          </div>
        </template>

        <!-- buttons -->
        <div class="flex justify-end gap-2 mt-4">
          <button
            class="bg-white border border-gray-300 cursor-pointer text-gray-600 py-2 px-4 rounded-md hover:bg-gray-50 transition-colors"
            @click="handleCancel"
            :disabled="isLoading"
          >
            Cancel
          </button>
          <button
            class="hover:bg-purple-400 text-white py-2 px-4 rounded-md bg-gradient-to-br from-indigo-500 to-purple-600 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
            @click="handleEdit"
            :disabled="isLoading"
          >
            <span v-if="!isLoading">Edit</span>
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
              Editing...
            </div>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from "vue";

import { useModalStore } from "@/store/useModalStore";
import { apolloClient } from "../../../apollo-client";
import { useTeacherAccessCheck } from "../../composables/useTeacherAccessCheck";
import {
  editAnnouncement,
  updateClass,
  updateSubject,
} from "../../graphql/mutations";
import { useClassStore } from "../../store/classStore";
import { useNotificationStore } from "../../store/notification";
import { useSubjectStore } from "../../store/subjectStore";
import { useTeacherStore } from "../../store/teacherStore";
import { availableTargetRoles } from "../../utils/utility";
import { useAnnouncementStore } from "../../store/announcementStore";

import Dropdown from "../dropdowns/dropdown.vue";

const modalStore = useModalStore();

const classStore = useClassStore();
const teacherStore = useTeacherStore();
const subjectStore = useSubjectStore();

const announcementStore = useAnnouncementStore();

const notificationStore = useNotificationStore();

const isLoading = ref(false);

const teachers = computed(() => teacherStore.allTeachers);

const isModalVisible = ref(modalStore.editModal);

const title = ref(modalStore.modalTitle);
const source = ref(modalStore.source);
const data = ref(modalStore.data);

const classes = ref([]);

const isTargetRolesDropdownOpen = ref(false);
const selectedTargetRoles = ref([]);

const subjectName = ref("");
const selectedClass = ref("");
const selectedTeacher = ref("");
const announcementTitle = ref("");
const content = ref("");

const className = ref("");
const classCapacity = ref("");

const transformedData = ref({});

const { isTeacher, userId, isAssignedToSelection } = useTeacherAccessCheck();

const toggleTargetRolesDropdown = () => {
  isTargetRolesDropdownOpen.value = !isTargetRolesDropdownOpen.value;
};

const toggleTargetRole = (role) => {
  const index = selectedTargetRoles.value.findIndex(
    (r) => r.value === role.value
  );
  if (index === -1) {
    selectedTargetRoles.value.push(role);
  } else {
    selectedTargetRoles.value.splice(index, 1);
  }
};

const isTargetRoleSelected = (role) => {
  return selectedTargetRoles.value.some((r) => r.value === role.value);
};

const selectAllTargetRoles = () => {
  if (selectedTargetRoles.value.length === availableTargetRoles.length) {
    selectedTargetRoles.value = [];
  } else {
    selectedTargetRoles.value = [...availableTargetRoles];
  }
};

const removeTargetRole = (role) => {
  const index = selectedTargetRoles.value.findIndex(
    (r) => r.value === role.value
  );
  if (index !== -1) {
    selectedTargetRoles.value.splice(index, 1);
  }
};

const fullTeacherName = computed({
  get() {
    // Returns both name and surname concatenated or NA if null
    if (!data?.value?.teacher?.name && !data?.value?.teacher?.surname) {
      return "NA";
    }
    return `${data?.value?.teacher?.name || ""} ${
      data?.value?.teacher?.surname || ""
    }`.trim();
  },
  set(newValue) {
    // If NA is entered, set both name and surname to empty
    if (newValue === "NA") {
      if (data.value && data.value.teacher) {
        data.value.teacher.name = "";
        data.value.teacher.surname = "";
      }
      return;
    }

    // Split the input value into parts
    const parts = newValue.split(" ");
    if (data.value && data.value.teacher) {
      data.value.teacher.name = parts.shift() || "";
      data.value.teacher.surname = parts.join(" ");
    }
  },
});

const teacherNames = computed(() => {
  return teacherStore.getTeacherNames?.map((teacher) => teacher.name) || [];
});

const getTeacherIdByName = (teacherName) => {
  const teacher = teacherStore.allTeachers.find(
    (t) => `${t.name} ${t.surname}` === teacherName
  );
  return teacher?.id || null;
};

const classOptions = computed(() => {
  return classStore.getClassNames || [];
});

// Helper function to format source title
const formatSourceTitle = (src) => {
  // Remove 'List' and capitalize first letter
  return src.replace("List", "").charAt(0).toUpperCase() + src.slice(1, -4);
};

const handleCancel = () => {
  if (isLoading.value) return;
  modalStore.editModal = false;
  modalStore.modalId = null;
};

const getClassIdByName = (className) => {
  const classObj = classStore.allClasses.find((c) => c.name === className);
  return classObj?.id || null;
};

// Update the handleEdit function to use the refs
const handleEdit = async () => {
  try {
    isLoading.value = true;

    if (source.value === "teacherList") {
      console.log("hello from teachers");
    } else if (source.value === "teacherCard") {
      console.log("hello from teacherCard");
    } else if (source.value === "parentList") {
      console.log("hello from parents");
    } else if (source.value === "studentList") {
      console.log("hello from students");
    } else if (source.value === "classList") {
      await apolloClient.mutate({
        mutation: updateClass,
        variables: {
          classId: modalStore.modalId,
          input: {
            name: className.value,
            capacity: parseInt(classCapacity.value),
            supervisorId: getTeacherIdByName(selectedTeacher.value),
          },
        },
      });

      await classStore.refreshClasses();

      notificationStore.addNotification({
        type: "success",
        message: "Class updated successfully",
      });
    } else if (source.value === "subjectList") {
      await apolloClient.mutate({
        mutation: updateSubject,
        variables: {
          subjectId: modalStore.modalId,
          input: {
            name: subjectName.value,
            classId: getClassIdByName(selectedClass.value),
            teacherId: getTeacherIdByName(selectedTeacher.value),
          },
        },
      });

      await subjectStore.refreshSubjects();
      notificationStore.addNotification({
        type: "success",
        message: "Subject updated successfully",
      });
    } else if (source.value === "examList") {
      console.log("hello from exams");
    } else if (source.value === "assignmentList") {
      console.log("hello from assignments");
    } else if (source.value === "resultList") {
      console.log("hello from results");
  
    } else if (source.value === "announcementList") {
      await apolloClient.mutate({
        mutation: editAnnouncement,
        variables: {
          announcementId: modalStore.modalId,
          title: announcementTitle.value,
          content: content.value,
          targetRoles: selectedTargetRoles.value.map((role) => role.value),
          classId: getClassIdByName(selectedClass.value),
        },
      });

      await announcementStore.refetchAll();

      notificationStore.addNotification({
        type: "success",
        message: "Announcement updated successfully",
      });
    }
    modalStore.editModal = false;
  } catch (error) {
    notificationStore.addNotification({
      type: "error",
      message: `Error creating ${source.value}: ${error.message}`,
    });
  } finally {
    isLoading.value = false;
  }
};

watch(
  () => data.value?.targetRoles,
  (newVal) => {
    if (newVal && availableTargetRoles) {
      selectedTargetRoles.value = availableTargetRoles.filter((role) =>
        newVal.includes(role.value)
      );
    }
  },
  { immediate: true }
);

watch(
  () => data.value,
  (newVal) => {
    if (newVal && newVal.supervisor) {
      selectedTeacher.value =
        `${newVal.supervisor.name} ${newVal.supervisor.surname}`.trim();
    } else {
      selectedTeacher.value = "";
    }
  },
  { immediate: true }
);

// Watchers to sync with modal store
watch(
  () => modalStore.editModal,
  (newVal) => {
    isModalVisible.value = newVal;
  },
  { immediate: true }
);

watch(
  () => modalStore.modalTitle,
  (newVal) => {
    title.value = newVal;
  }
);

watch(
  () => modalStore.source,
  (newVal) => {
    source.value = newVal;
  }
);

watch(
  () => modalStore.data,
  (newVal) => {
    data.value = newVal;
  }
);

// Update the watch to properly initialize the class data
watch(
  () => data.value,
  (newVal) => {
    if (newVal) {
      if (source.value === "classList") {
        className.value = newVal.name || "";
        classCapacity.value = newVal.capacity || "";
        if (newVal.supervisor) {
          selectedTeacher.value =
            `${newVal.supervisor.name} ${newVal.supervisor.surname}`.trim();
        } else {
          selectedTeacher.value = "";
        }
      } else if (source.value === "subjectList") {
        subjectName.value = newVal.name || "";
        if (newVal.class) {
          selectedClass.value = newVal.class.name || "";
        }
        if (newVal.teachers && newVal.teachers.length > 0) {
          const teacher = newVal.teachers[0];
          selectedTeacher.value = `${teacher.name} ${teacher.surname}`.trim();
        }
      } else if (source.value === "announcementList") {
        // Initialize selected class if it exists in the data
         announcementTitle.value = newVal.title || "";
         content.value = newVal.content || "";
        if (newVal.class) {
          selectedClass.value = newVal.class.name || "";
        }
        // Initialize target roles if they exist in the data
        if (newVal.targetRoles) {
          selectedTargetRoles.value = availableTargetRoles.filter((role) =>
            newVal.targetRoles.includes(role.value)
          );
        }
      }
    }
  },
  { immediate: true }
);

onMounted(async () => {
  classes.value = classStore.getClassNames;

  if (teachers.value.length === 0) {
    await teacherStore.fetchTeachers();
  }
});
</script>
