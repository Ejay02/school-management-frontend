<template>
  <div
    v-if="isModalVisible"
    class="fixed top-0 left-0 w-full h-full bg-gray-900/80 flex justify-center items-center z-50"
    @click.self="handleCancel"
    :key="isModalVisible"
  >
    <div
      class="max-w-lg w-full text-left bg-white cursor-pointer rounded-md h-auto mt-4 shadow-md overflow-y-auto"
    >
      <div
        class="bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-4 w-full relative"
      >
        <div class="absolute inset-0 pattern-dots opacity-10"></div>
        <h3 class="text-xl font-medium capitalize items-center text-center">
          {{ modalTitle }}
        </h3>
      </div>

      <div class="p-6 space-y-4 cursor-pointer">
        <!-- teacher list -->
        <template v-if="source === 'teachers'">
          <!-- Name and Email row -->
          <div class="flex gap-2">
            <div class="w-1/2">
              <label
                for="name"
                class="block text-sm font-medium text-gray-700 mb-1"
                >Name <span class="text-red-500">*</span></label
              >
              <input
                v-model="name"
                placeholder="John"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm cursor-pointer"
              />
            </div>
            <div class="w-1/2">
              <label
                for="surname"
                class="block text-sm font-medium text-gray-700 mb-1"
                >Surname<span class="text-red-500">*</span></label
              >
              <input
                v-model="surname"
                placeholder="Smith"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm cursor-pointer"
              />
            </div>
          </div>

          <!--  -->
          <div class="flex gap-2">
            <div class="w-1/2">
              <label
                for="username"
                class="block text-sm font-medium text-gray-700 mb-1"
                >Username <span class="text-red-500">*</span></label
              >
              <input
                v-model="username"
                placeholder="Smith"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm cursor-pointer"
              />
            </div>
            <div class="w-1/2">
              <label
                for="bloodGroup"
                class="block text-sm font-medium text-gray-700 mb-1"
                >Blood Group</label
              >
              <input
                type="text"
                v-model="bloodGroup"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm cursor-pointer"
              />
            </div>
          </div>

          <!-- Image and Address row -->
          <div class="flex gap-2">
            <div class="w-1/2">
              <label
                for="image"
                class="block text-sm font-medium text-gray-700 mb-1"
                >Image</label
              >
              <input
                type="file"
                accept=".jpg, .png, .jpeg"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm cursor-pointer"
              />
            </div>
            <div class="w-1/2">
              <label
                for="address"
                class="block text-sm font-medium text-gray-700 mb-1"
                >Address</label
              >
              <input
                v-model="address"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm cursor-pointer"
              />
            </div>
          </div>

          <!-- Subjects field -->
          <div>
            <label
              for="subjects"
              class="block text-sm font-medium text-gray-700 mb-1"
              >Subjects</label
            >
            <input
              v-model="subjects"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm cursor-pointer"
            />
          </div>

          <!-- Class and Phone row -->
          <div class="flex gap-2">
            <div class="w-1/2">
              <label
                for="class"
                class="block text-sm font-medium text-gray-700 mb-1"
                >Select a class</label
              >
              <select
                v-model="selectedClass"
                @change="handleClassChange"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm cursor-pointer max-h-40 overflow-y-auto"
              >
                <option value="" selected>No class</option>
                <option
                  v-for="(name, index) in classes"
                  :key="index"
                  :value="name"
                  class="cursor-pointer"
                >
                  {{ name }}
                </option>
              </select>
            </div>
            <div class="w-1/2">
              <label
                for="phone"
                class="block text-sm font-medium text-gray-700 mb-1"
                >Phone</label
              >
              <input
                v-model="phone"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm cursor-pointer"
              />
            </div>
          </div>
        </template>

        <!-- student List -->
        <template v-if="source === 'students'">
          <div class="flex gap-2">
            <div class="w-1/2">
              <label
                for="name"
                class="block text-sm font-medium text-gray-700 mb-1"
                >Name <span class="text-red-500">*</span></label
              >
              <input
                v-model="name"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm cursor-pointer"
              />
            </div>
            <div class="w-1/2">
              <label
                for="surname"
                class="block text-sm font-medium text-gray-700 mb-1"
                >Surname <span class="text-red-500">*</span></label
              >
              <input
                v-model="surname"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm cursor-pointer"
              />
            </div>
          </div>

          <!-- Class and Phone row -->
          <div class="flex gap-2">
            <div class="w-1/2">
              <label
                for="email"
                required
                type="email"
                class="block text-sm font-medium text-gray-700 mb-1"
                >eMail <span class="text-red-500">*</span></label
              >
              <input
                v-model="email"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm cursor-pointer"
              />
            </div>

            <div class="w-1/2">
              <label
                for="phone"
                class="block text-sm font-medium text-gray-700 mb-1"
                >Phone</label
              >
              <input
                v-model="phone"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm cursor-pointer"
              />
            </div>
          </div>
          <div class="flex gap-2 w-full">
            <div class="w-1/2">
              <label
                for="class"
                class="block text-sm font-medium text-gray-700 mb-1"
                >Select a class</label
              >
              <select
                v-model="selectedClass"
                @change="handleClassChange"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm cursor-pointer"
              >
                <option value="" selected>No class</option>
                <option
                  v-for="(name, index) in classes"
                  :key="index"
                  :value="name"
                  class="cursor-pointer"
                >
                  {{ name }}
                </option>
              </select>
            </div>

            <div class="w-1/2">
              <label
                for="parentId"
                class="block text-sm font-medium text-gray-700 mb-1"
                >Parent Id <span class="text-red-500">*</span></label
              >
              <input
                v-model="parentId"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm cursor-pointer"
              />
            </div>
          </div>

          <!--  -->

          <label
            for="password"
            class="block text-sm font-medium text-gray-700 mb-1"
            >Password</label
          >
          <input
            v-model="password"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm cursor-pointer"
          />
        </template>

        <!-- parent list -->
        <template v-if="source === 'parents'">
          <div class="flex gap-2">
            <div class="w-1/2">
              <label
                for="name"
                class="block text-sm font-medium text-gray-700 mb-1"
                >Name <span class="text-red-500">*</span></label
              >
              <input
                v-model="name"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm cursor-pointer"
              />
            </div>
            <div class="w-1/2">
              <label
                for="surname"
                class="block text-sm font-medium text-gray-700 mb-1"
                >Surname <span class="text-red-500">*</span></label
              >
              <input
                v-model="surname"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm cursor-pointer"
              />
            </div>
          </div>
          <div>
            <label
              for="email"
              class="block text-sm font-medium text-gray-700 mb-1"
              >Email <span class="text-red-500">*</span></label
            >
            <input
              v-model="email"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm cursor-pointer"
            />
          </div>
          <div>
            <label
              for="studentName"
              class="block text-sm font-medium text-gray-700 mb-1"
              >Student Name</label
            >
            <input
              v-model="student"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm cursor-pointer"
            />
          </div>
          <div>
            <label
              for="phone"
              class="block text-sm font-medium text-gray-700 mb-1"
              >Phone</label
            >
            <input
              v-model="phone"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm cursor-pointer"
            />
          </div>

          <label
            for="address"
            class="block text-sm font-medium text-gray-700 mb-1"
            >Address</label
          >
          <input
            v-model="address"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm cursor-pointer"
          />
        </template>

        <!-- class list -->
        <template v-else-if="source === 'classes'">
          <div class="flex gap-2">
            <div class="w-1/2">
              <label
                for="className"
                class="block text-sm font-medium text-gray-700 mb-1"
                >Class Name <span class="text-red-500">*</span></label
              >
              <input
                v-model="name"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm cursor-pointer"
              />
            </div>

            <div class="w-1/2">
              <label
                for="capacity"
                class="block text-sm font-medium text-gray-700 mb-1"
                >Capacity <span class="text-red-500">*</span>
              </label>
              <input
                v-model="capacity"
                type="number"
                max="30"
                min="10"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm cursor-pointer"
              />
            </div>
          </div>

          <div>
            <Dropdown
              class=""
              v-model="selectedTeacher"
              label="Select Teacher <span class='text-red-500'>*</span>"
              :options="teacherNames"
              emptyLabel="Select a teacher"
            />
          </div>
        </template>

        <!-- subject list -->
        <template v-else-if="source === 'subjects'">
          <div>
            <label
              for="subjectName"
              class="block text-sm font-medium text-gray-700 mb-1"
              >Subject Name <span class="text-red-500">*</span></label
            >
            <input
              v-model="name"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm cursor-pointer"
            />
          </div>

          <div class="flex gap-2">
            <div class="w-1/2">
              <div class="" v-if="role === 'teacher'">
                <label for="teacher" class="block text-sm font-medium text-gray-700 mb-1"
                  >Teacher <span class="text-red-500">*</span></label
                >
                <div>
                  <input
                    :value="
                      userStore.userInfo.name + ' ' + userStore.userInfo.surname
                    "
                    readonly
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm cursor-not-allowed"
                  />
                </div>
              </div>
              <Dropdown
                v-else
                class="w-full"
                v-model="selectedTeacher"
                label="Select Teacher <span class='text-red-500'>*</span>"
                :options="teacherNames"
                emptyLabel="Select a teacher"
              />
            </div>

            <Dropdown
              class="w-1/2"
              v-model="selectedClass"
              label="Select Class <span class='text-red-500'>*</span>"
              :options="classOptions"
              emptyLabel="Select a class"
            />
          </div>
        </template>

        <!-- result -->
        <template v-else-if="source === 'results'">
          <div>
            <label
              for="subject"
              class="block text-sm font-medium text-gray-700 mb-1"
              >Subject</label
            >
            <input
              v-model="subject"
              type="text"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm cursor-pointer"
            />
          </div>
          <div>
            <label
              for="student"
              class="block text-sm font-medium text-gray-700 mb-1"
              >Student</label
            >
            <input
              v-model="student"
              type="text"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm cursor-pointer"
            />
          </div>
          <div class="flex gap-2">
            <div>
              <label
                for="score"
                class="block text-sm font-medium text-gray-700 mb-1"
                >Score</label
              >
              <input
                v-model="score"
                type="text"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm cursor-pointer"
              />
            </div>
            <div>
              <label
                for="class"
                class="block text-sm font-medium text-gray-700 mb-1"
                >Class</label
              >
              <input
                v-model="classes"
                type="text"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm cursor-pointer"
              />
            </div>
          </div>

          <div>
            <label
              for="teacher"
              class="block text-sm font-medium text-gray-700 mb-1"
              >Teacher</label
            >
            <input
              v-model="teacher"
              type="text"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm cursor-pointer"
            />
          </div>

          <div>
            <label
              for="date"
              class="block text-sm font-medium text-gray-700 mb-1"
              >Date</label
            >
            <input
              type="date"
              v-model="date"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm cursor-pointer"
            />
          </div>
        </template>

        <!-- event -->
        <template v-else-if="source === 'events'">
          <div>
            <label
              for="title"
              class="block text-sm font-medium text-gray-700 mb-1"
              >Title <span class="text-red-500">*</span></label
            >
            <input
              type="text"
              v-model="title"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm cursor-pointer"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Content <span class="text-red-500">*</span>
              <textarea
                v-model="content"
                rows="4"
                type="text"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm cursor-pointer"
              />
            </label>
          </div>

          <div
            class="flex gap-2"
            v-if="haveAccess && eventVisibility.toLowerCase() !== 'private'"
          >
            <Dropdown
              class="w-1/2"
              v-model="selectedClass"
              label="Select Class "
              :options="classOptions"
              emptyLabel="Select a class"
            />

            <div class="w-1/2">
              <label
                for="targetRoles"
                class="block text-sm font-medium text-gray-700 mb-1"
                >Target Audience <span class="text-red-500">*</span>
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

            <!--  -->
          </div>

          <div class="flex gap-2">
            <div class="w-1/3">
              <label
                for="date"
                class="block text-sm font-medium text-gray-700 mb-1"
                >Date <span class="text-red-500">*</span></label
              >
              <input
                type="date"
                v-model="date"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm cursor-pointer"
              />
            </div>

            <div class="w-1/3">
              <label
                for="startTime"
                class="block text-sm font-medium text-gray-700 mb-1"
                >Start Time <span class="text-red-500">*</span></label
              >
              <input
                type="time"
                v-model="startTime"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm cursor-pointer"
              />
            </div>
            <div class="w-1/3">
              <label
                for="endTime"
                class="block text-sm font-medium text-gray-700 mb-1"
                >End Time <span class="text-red-500">*</span></label
              >
              <input
                type="time"
                v-model="endTime"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm cursor-pointer"
              />
            </div>
          </div>

          <div class="flex gap-2">
            <div class="w-1/3">
              <label
                for="eventStatus"
                class="block text-sm font-medium text-gray-700 mb-1"
                >Status</label
              >
              <input
                v-model="eventStatus"
                type="text"
                readonly
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm cursor-not-allowed"
              />
            </div>
            <div class="w-1/3">
              <CustomDropdown
                v-if="haveAccess"
                v-model="eventVisibility"
                label="Visibility"
                :options="eventVisibilityOptions"
                placeholder="Select visibility"
              />
              <div v-else>
                <label
                  for="privateVisibility"
                  class="block text-sm font-medium text-gray-700 mb-1"
                  >Status</label
                >
                <input
                  v-model="privateVisibility"
                  type="text"
                  readonly
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm cursor-not-allowed"
                />
              </div>
            </div>

            <div class="w-1/3">
              <label
                for="location"
                class="block text-sm font-medium text-gray-700 mb-1"
                >Location <span class="text-red-500">*</span></label
              >
              <input
                type="text"
                v-model="location"
                class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm cursor-pointer"
              />
            </div>
          </div>
        </template>

        <!-- announcement -->
        <template v-else-if="source === 'announcements'">
          <div>
            <label
              for="title"
              class="block text-sm font-medium text-gray-700 mb-1"
              >Title <span class="text-red-500">*</span></label
            >
            <input
              type="text"
              v-model="title"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm cursor-pointer"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Content <span class="text-red-500">*</span>
              <textarea
                v-model="content"
                rows="4"
                type="text"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm cursor-pointer"
              />
            </label>
          </div>

          <div class="flex gap-2">
            <Dropdown
              class="w-1/2"
              v-model="selectedClass"
              label="Select Class"
              :options="classOptions"
              emptyLabel="Select a class"
            />

            <div class="w-1/2">
              <label
                for="targetRoles"
                class="block text-sm font-medium text-gray-700 mb-1"
                >Target Audience <span class="text-red-500">*</span>
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

            <!--  -->
          </div>
        </template>

        <!-- buttons -->
        <div class="flex justify-end gap-2 mt-4">
          <button
            class="bg-white border border-gray-300 cursor-pointer text-gray-600 py-2 px-4 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            @click="handleCancel"
            :disabled="isLoading"
          >
            Cancel
          </button>
          <button
            class="hover:bg-purple-400 text-white py-2 px-4 rounded-md bg-gradient-to-br from-indigo-500 to-purple-600 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
            @click="handleAdd"
            :disabled="!isFormValid || isLoading"
            :class="{
              'opacity-50 cursor-not-allowed': !isFormValid || isLoading,
            }"
          >
            <span v-if="!isLoading">Add</span>
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
              Adding...
            </div>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import "@vueup/vue-quill/dist/vue-quill.snow.css";
import { computed, onMounted, ref, watch } from "vue";
import { apolloClient } from "../../../apollo-client";
import {
  createAnnouncement,
  createClass,
  createEvent,
  createSubject,
} from "../../graphql/mutations";
import { useAnnouncementStore } from "../../store/announcementStore";
import { useClassStore } from "../../store/classStore";
import { useEventStore } from "../../store/eventStore";
import { useNotificationStore } from "../../store/notification";
import { useSubjectStore } from "../../store/subjectStore";
import { useTeacherStore } from "../../store/teacherStore";
import { useModalStore } from "../../store/useModalStore";
import { useUserStore } from "../../store/userStore";
import {
  availableTargetRoles,
  eventVisibilityOptions,
} from "../../utils/utility.js";
import CustomDropdown from "../dropdowns/customDropdown.vue";
import Dropdown from "../dropdowns/dropdown.vue";

const isLoading = ref(false);

const modalStore = useModalStore();
const classStore = useClassStore();
const teacherStore = useTeacherStore();
const eventStore = useEventStore();
const subjectStore = useSubjectStore();
const announcementStore = useAnnouncementStore();
const notificationStore = useNotificationStore();

const userStore = useUserStore();

const isModalVisible = ref(modalStore.editModal);

const capacity = ref("");

const name = ref("");
const title = ref("");

const email = ref("");

const score = ref("");
const classes = ref([]);
const selectedClass = ref("");

const subject = ref("");
const subjects = ref([]);

const selectedTeacher = ref("");

const content = ref("");

const phone = ref("");
const student = ref("");

const address = ref("");
const date = ref("");

const bloodGroup = ref("");

const startTime = ref("");
const endTime = ref("");
const source = ref(modalStore.source);

const eventStatus = ref("SCHEDULED");
const eventVisibility = ref("PUBLIC");
const privateVisibility = ref("PRIVATE");

const location = ref("");

const role = computed(() => userStore.currentRole.toLowerCase());
const selectedTargetRoles = ref([]);
const isTargetRolesDropdownOpen = ref(false);

const haveAccess = computed(() => {
  const allowedRoles = ["admin", "super_admin", "teacher"];
  return allowedRoles.includes(role.value);
});

const toggleTargetRolesDropdown = () => {
  isTargetRolesDropdownOpen.value = !isTargetRolesDropdownOpen.value;
};

const isTargetRoleSelected = (role) => {
  return selectedTargetRoles.value.some((r) => r.value === role.value);
};

const toggleTargetRole = (role) => {
  if (isTargetRoleSelected(role)) {
    removeTargetRole(role);
  } else {
    selectedTargetRoles.value.push(role);
  }
};

const removeTargetRole = (role) => {
  selectedTargetRoles.value = selectedTargetRoles.value.filter(
    (r) => r.value !== role.value
  );
};

const selectAllTargetRoles = () => {
  selectedTargetRoles.value = [...availableTargetRoles];
};

const currentTeacher = computed(() => {
  // Get the current user from user store
  const currentUser = userStore.userInfo;

  // If user is not a teacher, return null
  if (!currentUser || currentUser.role !== "TEACHER") {
    return null;
  }

  // Find the teacher in the teacher store that matches the current user ID
  const teacher = teacherStore.allTeachers.find(
    (t) => t.userId === currentUser.id || t.id === currentUser.id
  );

  if (teacher) {
    return teacher;
  }

  return null;
});

const teacherClasses = computed(() => {
  if (!currentTeacher.value || !currentTeacher.value.classes) {
    return [];
  }

  return currentTeacher.value.classes.map((classItem) => classItem.name);
});

const pluralToSingular = (word) => {
  const transformations = {
    teachers: "teacher",
    classes: "class",
    subjects: "subject",
    lessons: "lesson",
    exams: "exam",
    assignments: "assignment",
    results: "result",
    events: "event",
    announcements: "announcement",
  };
  return transformations[word] || word;
};

const modalTitle = computed(() => {
  return `Add New ${pluralToSingular(source.value)}`;
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
  // If we're in the assignments section and have a current teacher, show only their classes
  if (source.value === "assignments" && currentTeacher.value) {
    return teacherClasses.value;
  }

  // Otherwise, show all classes (for other sections)
  return classStore.getClassNames?.map((classItem) => classItem.name) || [];
});

const getClassIdByName = (className) => {
  const classItem = classStore.getClassNames.find((c) => c.name === className);
  return classItem ? classItem.id : null;
};

const handleCancel = () => {
  if (isLoading.value) return;
  modalStore.addModal = false;
  modalStore.modalId = null;
};

const isFormValid = computed(() => {
  if (source.value === "teachers") {
    return name.value && surname.value && phone.value;
  } else if (source.value === "students") {
    return (
      name.value &&
      surname.value &&
      email.value &&
      phone.value &&
      selectedClass.value &&
      password.value
    );
  } else if (source.value === "parents") {
    return (
      name.value && email.value && student.value && phone.value && address.value
    );
  } else if (source.value === "subjects") {
    return name.value && selectedTeacher.value && selectedClass.value;
  } else if (source.value === "classes") {
    return name.value && capacity.value;
  } else if (source.value === "results") {
    return (
      subject.value &&
      student.value &&
      score.value &&
      classes.value &&
      teacher.value &&
      date.value
    );
  } else if (source.value === "events") {
    return (
      title.value &&
      content.value &&
      date.value &&
      startTime.value &&
      endTime.value &&
      (eventVisibility.value || privateVisibility.value) &&
      location.value
    );
  } else if (source.value === "announcements") {
    return title.value && content.value && selectedTargetRoles.value.length > 0;
  }

  return false;
});

const handleAdd = async () => {
  if (!isFormValid.value) return;

  try {
    isLoading.value = true;

    if (source.value === "teachers") {
      // Create teacher logic
      console.log("Creating teacher...");
      // Example: const result = await apolloClient.mutate({
      //   mutation: createTeacher,
      //   variables: {
      //     input: {
      //       name: name.value,
      //       surname: surname.value,
      //       username: username.value,
      //       bloodGroup: bloodGroup.value,
      //       address: address.value,
      //       subjects: subjects.value,
      //       classId: selectedClass.value,
      //       phone: phone.value
      //     }
      //   }
      // });
    } else if (source.value === "students") {
      // Create student logic
      console.log("Creating student...");
      // Example: const result = await apolloClient.mutate({
      //   mutation: createStudent,
      //   variables: {
      //     input: {
      //       name: name.value,
      //       surname: surname.value,
      //       email: email.value,
      //       phone: phone.value,
      //       classId: selectedClass.value,
      //       parentId: parentId.value,
      //       password: password.value
      //     }
      //   }
      // });
    } else if (source.value === "parents") {
      // Create parent logic
      console.log("Creating parent...");
      // Example: const result = await apolloClient.mutate({
      //   mutation: createParent,
      //   variables: {
      //     input: {
      //       name: name.value,
      //       email: email.value,
      //       student: student.value,
      //       phone: phone.value,
      //       address: address.value
      //     }
      //   }
      // });
    } else if (source.value === "subjects") {
      await apolloClient.mutate({
        mutation: createSubject,
        variables: {
          input: {
            name: name.value,
            classId: getClassIdByName(selectedClass.value),
            teacherId: getTeacherIdByName(selectedTeacher.value),
          },
        },
      });

      await subjectStore.refreshSubjects();
      notificationStore.addNotification({
        type: "success",
        message: "Subject created successfully!",
      });
    } else if (source.value === "classes") {
      await apolloClient.mutate({
        mutation: createClass,
        variables: {
          input: {
            name: name.value,
            capacity: parseInt(capacity.value),
            supervisorId: getTeacherIdByName(selectedTeacher.value),
          },
        },
      });

      await classStore.refreshClasses();
      notificationStore.addNotification({
        type: "success",
        message: "Class created successfully!",
      });
    } else if (source.value === "results") {
      await apolloClient.mutate({
        mutation: createResult,
        variables: {
          input: {
            subject: subject.value,
            student: student.value,
            score: score.value,
            classes: classes.value,
            teacher: teacher.value,
            date: date.value,
          },
        },
      });
      notificationStore.addNotification({
        type: "success",
        message: "Result created successfully!",
      });
    } else if (source.value === "events") {
      // Extract the class ID determination logic
      let eventClassId = null;
      if (eventVisibility.value.toLowerCase() !== "private") {
        if (selectedClass.value) {
          eventClassId = getClassIdByName(selectedClass.value);
        }
      }

      // Extract the target roles determination logic
      let eventTargetRoles = ["ADMIN", "TEACHER", "STUDENT", "PARENT"];
      if (eventVisibility.value.toLowerCase() === "private") {
        eventTargetRoles = [role.value.toUpperCase()];
      } else if (selectedTargetRoles.value.length > 0) {
        eventTargetRoles = selectedTargetRoles.value.map((role) => role.value);
      }

      await apolloClient.mutate({
        mutation: createEvent,
        variables: {
          data: {
            title: title.value,
            description: content.value,
            classId: eventClassId,
            location: location.value,
            startTime: new Date(
              `${date.value}T${startTime.value}`
            ).toISOString(),
            endTime: new Date(`${date.value}T${endTime.value}`).toISOString(),
            status: "SCHEDULED",
            visibility: haveAccess.value
              ? eventVisibility.value
              : privateVisibility.value,
            targetRoles: eventTargetRoles,
          },
        },
      });
      await eventStore.refetchAll();

      notificationStore.addNotification({
        type: "success",
        message: "Event created successfully!",
      });
    } else if (source.value === "announcements") {
      await apolloClient.mutate({
        mutation: createAnnouncement,
        variables: {
          title: title.value,
          content: content.value || "",
          classId: selectedClass.value
            ? getClassIdByName(selectedClass.value)
            : null,
          // classId: selectedClass.value || null,
          targetRoles:
            selectedTargetRoles.value.length > 0
              ? selectedTargetRoles.value.map((role) => role.value)
              : ["ADMIN", "TEACHER", "STUDENT", "PARENT"],
        },
      });

      await announcementStore.refetchAll();

      notificationStore.addNotification({
        type: "success",
        message: "Announcement created successfully!",
      });
    }

    // Close modal after successful creation
    modalStore.addModal = false;
  } catch (error) {
    notificationStore.addNotification({
      type: "error",
      message: `Error creating ${pluralToSingular(source.value)}: ${
        error.message
      }`,
    });
  } finally {
    isLoading.value = false;
  }
};

// Watchers to sync with modal store
watch(
  () => modalStore.addModal,
  (newVal) => {
    isModalVisible.value = newVal;
  },
  { immediate: true }
);

watch(
  () => modalStore.source,
  (newVal) => {
    source.value = newVal;
  }
);

onMounted(async () => {
  await Promise.all([
    classStore.fetchClasses(),
    teacherStore.fetchTeachers(),
    subjectStore.fetchSubjects(),
  ]);
});

onMounted(() => {
  document.addEventListener("click", (e) => {
    if (isTargetRolesDropdownOpen.value) {
      const dropdown = document.querySelector(".target-roles-dropdown");
      if (dropdown && !dropdown.contains(e.target)) {
        isTargetRolesDropdownOpen.value = false;
      }
    }
  });
});
</script>
