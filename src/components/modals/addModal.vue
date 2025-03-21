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
        class="bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-4 w-full"
      >
        <h3 class="text-xl font-medium capitalize items-center text-center">
          Add New {{ source }}
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
                >Name</label
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
                >Surname</label
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
                >Username</label
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
                >Name</label
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
                >Surname</label
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
                >eMail</label
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
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Parent Id</label
              >
              <input
                v-model="parentId"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm cursor-pointer"
              />
            </div>
          </div>

          <!--  -->

          <label class="block text-sm font-medium text-gray-700 mb-1"
            >Password</label
          >
          <input
            v-model="password"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm cursor-pointer"
          />
        </template>

        <!-- parent list -->
        <template v-if="source === 'parents'">
          <div>
            <label
              for="parentName"
              class="block text-sm font-medium text-gray-700 mb-1"
              >Name</label
            >
            <input
              v-model="name"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm cursor-pointer"
            />
          </div>
          <div>
            <label
              for="email"
              class="block text-sm font-medium text-gray-700 mb-1"
              >Email</label
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
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Phone</label
            >
            <input
              v-model="phone"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm cursor-pointer"
            />
          </div>

          <label class="block text-sm font-medium text-gray-700 mb-1"
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
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Class Name</label
              >
              <input
                v-model="name"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm cursor-pointer"
              />
            </div>

            <div class="w-1/2">
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Capacity</label
              >
              <input
                v-model="capacity"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm cursor-pointer"
              />
            </div>
          </div>

          <!-- TODO -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Supervisor</label
            >
            <input
              v-model="supervisor"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm cursor-pointer"
            />
          </div>
        </template>

        <!-- TODO -->
        <!-- subject list -->
        <template v-else-if="source === 'subjects'">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Subject Name</label
            >
            <input
              v-model="name"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm cursor-pointer"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Teachers</label
            >
            <input
              v-model="teachers"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm cursor-pointer"
            />
          </div>
        </template>

        <!-- name, day, time, subject Id, classId -->

        <!-- lesson -->
        <template v-else-if="source === 'lessons'">
          <div class="flex gap-2">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Subject Name</label
              >
              <input
                v-model="subject"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm cursor-pointer"
              />
            </div>

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
                for="class"
                class="block text-sm font-medium text-gray-700 mb-1"
                >Select subject</label
              >
              <select
                v-model="selectedClass"
                @change="handleClassChange"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm cursor-pointer"
              >
                <option value="" selected disabled>Select subject</option>
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
          </div>

          <!--  -->
          <div class="flex gap-2">
            <div class="w-1/3">
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

            <div class="w-1/3">
              <label
                for="startTime"
                class="block text-sm font-medium text-gray-700 mb-1"
                >Start Time</label
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
                >End Time</label
              >
              <input
                type="time"
                v-model="endTime"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm cursor-pointer"
              />
            </div>
          </div>
        </template>

        <!-- exam -->
        <template v-else-if="source === 'exams'">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Subject</label
            >
            <input
              v-model="subject"
              type="text"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm cursor-pointer"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Class</label
            >
            <input
              v-model="classes"
              type="text"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm cursor-pointer"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Teacher</label
            >
            <input
              v-model="teacher"
              type="text"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm cursor-pointer"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Date</label
            >
            <input
              type="date"
              v-model="date"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm cursor-pointer"
            />
          </div>
        </template>

        <!-- assignment -->
        <template v-else-if="source === 'assignments'">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Subject</label
            >
            <input
              v-model="subject"
              type="text"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm cursor-pointer"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Class</label
            >
            <input
              v-model="classes"
              type="text"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm cursor-pointer"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Teacher</label
            >
            <input
              v-model="teacher"
              type="text"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm cursor-pointer"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Due Date</label
            >
            <input
              type="date"
              v-model="dueDate"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm cursor-pointer"
            />
          </div>
        </template>

        <!-- result -->
        <template v-else-if="source === 'results'">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Subject</label
            >
            <input
              v-model="subject"
              type="text"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm cursor-pointer"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
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
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Score</label
              >
              <input
                v-model="score"
                type="text"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm cursor-pointer"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
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
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Teacher</label
            >
            <input
              v-model="teacher"
              type="text"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm cursor-pointer"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
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
              >Title</label
            >
            <input
              type="text"
              v-model="title"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm cursor-pointer"
            />
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
            <div class="">
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Select a class[Optional]
                <select
                  v-model="selectedClass"
                  @change="handleClassChange"
                  class="mt-1 border rounded p-2 w-full focus:outline-none focus:ring-0 focus:ring-indigo-500 focus:border-indigo-500 cursor-pointer"
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
              </label>
            </div>

            <div>
              <label
                for="location"
                class="block text-sm font-medium text-gray-700 mb-1"
                >Location</label
              >
              <input
                type="text"
                v-model="location"
                class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm cursor-pointer"
              />
            </div>
          </div>

          <div class="flex gap-2">
            <div class="w-1/3">
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

            <div class="w-1/3">
              <label
                for="startTime"
                class="block text-sm font-medium text-gray-700 mb-1"
                >Start Time</label
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
                >End Time</label
              >
              <input
                type="time"
                v-model="endTime"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm cursor-pointer"
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
              >Title</label
            >
            <input
              type="text"
              v-model="title"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm cursor-pointer"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Class</label
            >
            <input
              v-model="classes"
              type="text"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm cursor-pointer"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Date</label
            >
            <input
              type="date"
              v-model="date"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm cursor-pointer"
            />
          </div>
        </template>

        <!-- buttons -->
        <div class="flex justify-end gap-2 mt-4">
          <button
            class="bg-white border border-gray-300 cursor-pointer text-gray-600 py-2 px-4 rounded-md hover:bg-gray-50 transition-colors"
            @click="handleCancel"
          >
            Cancel
          </button>
          <button
            class="hover:bg-purple-400 text-white py-2 px-4 rounded-md bg-gradient-to-br from-indigo-500 to-purple-600 transition-colors"
            @click="handleAdd"
          >
            {{ handleAdd ? "Add" : "Adding ..." }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useModalStore } from "@/store/useModalStore";
import { ref, watch } from "vue";
import { classes } from "../../utils/data";

const modalStore = useModalStore();
const isModalVisible = ref(modalStore.addModal);

const title = ref("");
const teacher = ref("");
const teachers = ref([]);
const studentId = ref("");
const grade = ref("");
const capacity = ref("");
const supervisor = ref("");
const name = ref("");
const email = ref("");
const photo = ref("");
const score = ref("");
const subject = ref("");
const subjects = ref([]);
const selectedClass = ref("");
const phone = ref("");
const student = ref("");
const address = ref("");
const date = ref("");
const dueDate = ref("");
const birthday = ref("");
const bloodGroup = ref("");

const startTime = ref("");
const endTime = ref("");
const source = ref(modalStore.source);

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

const handleCancel = () => {
  modalStore.addModal = false;
  modalStore.modalId = null;
};

const handleAdd = async () => {
  try {
    if (source.value === "teachers") {
      console.log("hello from teachers");
    } else if (source.value === "students") {
      console.log("hello from students");
    } else if (source.value === "parents") {
      console.log("hello from parents");
    } else if (source.value === "subjects") {
      console.log("hello from subjects");
    } else if (source.value === "classes") {
      console.log("hello from classes");
    } else if (source.value === "lessons") {
      console.log("hello from lessons");
    } else if (source.value === "exams") {
      console.log("hello from exams");
    } else if (source.value === "assignments") {
      console.log("hello from assignments");
    } else if (source.value === "results") {
      console.log("hello from results");
    } else if (source.value === "events") {
      console.log("hello from events");
    } else if (source.value === "announcements") {
      console.log("hello from announcements");
    }
    modalStore.addModal = false;
  } catch (error) {
    console.error(error);
  }
};
</script>
