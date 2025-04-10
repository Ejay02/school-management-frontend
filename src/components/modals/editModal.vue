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
        class="bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-4"
      >
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

        <!-- lesson -->
        <template v-else-if="source === 'lessonList'">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Lesson

              <input
                v-model="data.name"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm cursor-pointer"
              />
            </label>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Subject

              <input
                v-model="data.subject.name"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm cursor-pointer"
              />
            </label>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Class
              <input
                v-model="data.class.name"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm cursor-pointer"
              />
            </label>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Teacher

              <input
                v-model="fullTeacherName"
                class="capitalize mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm cursor-pointer"
              />
            </label>
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

        <!-- event -->
        <template v-else-if="source === 'eventList'">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Title
              <input
                type="text"
                v-model="data.title"
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
              >Date
              <input
                type="date"
                v-model="data.date"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm cursor-pointer"
              />
            </label>
          </div>
          <div class="flex gap-2">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Start Time
                <input
                  type="datetime"
                  v-model="data.startTime"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm cursor-pointer"
                />
              </label>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >End Time
                <input
                  type="datetime"
                  v-model="data.endTime"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm cursor-pointer"
                />
              </label>
            </div>
          </div>
        </template>

        <!-- announcement -->
        <template v-else-if="source === 'announcementList'">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Title
              <input
                type="text"
                v-model="data.title"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm cursor-pointer"
              />
            </label>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Content
              <textarea
                v-model="data.content"
                rows="4"
                type="text"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm cursor-pointer"
              />
            </label>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Target Roles
              <input
                type="text"
                v-model="data.targetRole"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm cursor-pointer"
              />
            </label>
          </div>
          <div class="">
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Select a class[Optional]
              <select
                v-model="selectedClass"
                @change="handleClassChange"
                class="border rounded p-2 w-full focus:outline-none focus:ring-0 focus:border-eduPurple cursor-pointer"
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
            @click="handleEdit"
          >
            {{ handleEdit ? "Edit" : "Editing ..." }}
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
import { updateClass, updateSubject } from "../../graphql/mutations";
import { useClassStore } from "../../store/classStore";
import { useNotificationStore } from "../../store/notification";
import { useSubjectStore } from "../../store/subjectStore";
import { useTeacherStore } from "../../store/teacherStore";
import Dropdown from "../dropdowns/dropdown.vue";
import { useTeacherAccessCheck } from "../../composables/useTeacherAccessCheck";

const modalStore = useModalStore();
const classStore = useClassStore();
const teacherStore = useTeacherStore();
const subjectStore = useSubjectStore();

const notificationStore = useNotificationStore();

const teachers = computed(() => teacherStore.allTeachers);

const isModalVisible = ref(modalStore.editModal);

const title = ref(modalStore.modalTitle);
const source = ref(modalStore.source);
const data = ref(modalStore.data);

const classes = ref([]);

const subjectName = ref("");
const selectedClass = ref("");
const selectedTeacher = ref("");

const className = ref("");
const classCapacity = ref("");

const transformedData = ref({});

const { isTeacher, userId, isAssignedToSelection } = useTeacherAccessCheck();



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
    } else if (source.value === "lessonList") {
      console.log("hello from lessons");
    } else if (source.value === "examList") {
      console.log("hello from exams");
    } else if (source.value === "assignmentList") {
      console.log("hello from assignments");
    } else if (source.value === "resultList") {
      console.log("hello from results");
    } else if (source.value === "eventList") {
      console.log("hello from events");
    } else if (source.value === "announcementList") {
      console.log("hello from announcements");
    }
    modalStore.editModal = false;
  } catch (error) {
    notificationStore.addNotification({
      type: "error",
      message: `Error creating ${source.value}: ${error.message}`,
    });
  }
};

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
