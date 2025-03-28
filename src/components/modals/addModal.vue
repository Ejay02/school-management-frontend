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
              <label
                for="parentId"
                class="block text-sm font-medium text-gray-700 mb-1"
                >Parent Id</label
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
                >Class Name</label
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
                >Capacity</label
              >
              <input
                v-model="capacity"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm cursor-pointer"
              />
            </div>
          </div>

          <!-- TODO  add supervison on the BE-->
          <div>
            <label
              for="supervisor"
              class="block text-sm font-medium text-gray-700 mb-1"
              >Supervisor</label
            >
            <input
              v-model="supervisor"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm cursor-pointer"
            />
          </div>
        </template>

        <!-- -->
        <!-- subject list -->
        <template v-else-if="source === 'subjects'">
          <div>
            <label
              for="subjectName"
              class="block text-sm font-medium text-gray-700 mb-1"
              >Subject Name</label
            >
            <input
              v-model="name"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm cursor-pointer"
            />
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

        <!-- name, day, time, subject Id, classId -->

        <!-- lesson  -->
        <template v-else-if="source === 'lessons'">
          <div class="flex gap-2">
            <div class="w-1/2">
              <label
                for="subjectName"
                class="block text-sm font-medium text-gray-700 mb-1"
                >Subject Name</label
              >
              <input
                v-model="name"
                placeholder="subject name"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm cursor-pointer"
              />
            </div>

            <div class="w-1/2">
              <label
                for="date"
                class="block text-sm font-medium text-gray-700 mb-1"
                >Date</label
              >
              <input
                type="date"
                v-model="day"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm cursor-pointer"
              />
            </div>
          </div>
          <!--  -->
          <div class="flex gap-2">
            <Dropdown
              class="w-1/2"
              v-model="selectedClass"
              label="Select Class"
              :options="classOptions"
              emptyLabel="Select a class"
            />
            <!--  -->
            <div class="w-1/2">
              <CustomDropdown
                v-model="selectedSubject"
                label="Select Subject"
                :options="
                  filteredSubjects.map((subject) => ({
                    value: subject.id,
                    label: subject.name,
                  }))
                "
                placeholder="Select a subject"
                :disabled="!selectedClass"
              />
            </div>
          </div>

          <!--  -->
          <div class="flex gap-2">
            <div class="w-1/2">
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
            <div class="w-1/2">
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

        <!-- TODO implement markdown -->
        <!-- exam -->
        <template v-else-if="source === 'exams'">
          <div>
            <label
              for="title"
              class="block text-sm font-medium text-gray-700 mb-1"
              >Title</label
            >
            <input
              v-model="title"
              type="text"
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
            <Dropdown
              class="w-1/2"
              v-model="selectedClass"
              label="Select Class"
              :options="classOptions"
              emptyLabel="Select a class"
            />
            <!--  -->
            <div class="w-1/2">
              <CustomDropdown
                v-model="selectedSubject"
                label="Select Subject"
                :options="
                  filteredSubjects.map((subject) => ({
                    value: subject.id,
                    label: subject.name,
                  }))
                "
                placeholder="Select a subject"
                :disabled="!selectedClass"
              />
            </div>
          </div>
          <!--  -->
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

          <div class="flex gap-2">
            <div class="w-1/2">
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
            <div class="w-1/2">
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

        <!-- assignment -->
        <template v-else-if="source === 'assignments'">
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
          <Dropdown
            class="w-full"
            v-model="selectedClass"
            label="Select Class"
            :options="classes"
            emptyLabel="Select a class"
          />
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
              for="dueDate"
              class="block text-sm font-medium text-gray-700 mb-1"
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
            :disabled="!isFormValid"
            :class="{ 'opacity-50 cursor-not-allowed': !isFormValid }"
          >
            {{ handleAdd ? "Add" : "Adding ..." }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { apolloClient } from "../../../apollo-client";
import {
  createAnnouncement,
  createClass,
  createEvent,
  createExam,
  createLesson,
} from "../../graphql/mutations";
import { useClassStore } from "../../store/classStore";
import { useLessonStore } from "../../store/lessonStore";
import { useNotificationStore } from "../../store/notification";
import { useSubjectStore } from "../../store/subjectStore";
import { useTeacherStore } from "../../store/teacherStore";
import { useModalStore } from "../../store/useModalStore";
import CustomDropdown from "../dropdowns/customDropdown.vue";
import Dropdown from "../dropdowns/dropdown.vue";

const modalStore = useModalStore();
const classStore = useClassStore();
const teacherStore = useTeacherStore();
const subjectStore = useSubjectStore();
const lessonStore = useLessonStore();
const notificationStore = useNotificationStore();

const isModalVisible = ref(modalStore.editModal);

const capacity = ref("");
const supervisor = ref("");

const name = ref("");
const title = ref("");

const email = ref("");

const score = ref("");
const classes = ref([]);
const selectedClass = ref("");

const subject = ref("");
const subjects = ref([]);
const selectedSubject = ref("");

const selectedTeacher = ref("");

const content = ref("");

const phone = ref("");
const student = ref("");

const address = ref("");
const date = ref("");
const day = ref("");
const dueDate = ref("");

const bloodGroup = ref("");

const startTime = ref("");
const endTime = ref("");
const source = ref(modalStore.source);

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

const classOptions = computed(() => {
  return classStore.getClassNames?.map((classItem) => classItem.name) || [];
});

const getClassIdByName = (className) => {
  const classItem = classStore.getClassNames.find((c) => c.name === className);
  return classItem ? classItem.id : null;
};

const filteredSubjects = computed(() => {
  if (!selectedClass.value) return [];

  // Find the selected class object
  const classObj = classStore.allClasses.find(
    (c) => c.name === selectedClass.value
  );

  // Return the subjects from the selected class if available
  return classObj?.subjects || [];
});

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
  } else if (source.value === "lessons") {
    return (
      name.value &&
      day.value &&
      selectedClass.value &&
      selectedSubject.value &&
      startTime.value &&
      endTime.value
    );
  } else if (source.value === "exams") {
    return (
      title.value &&
      date.value &&
      selectedClass.value &&
      selectedSubject.value &&
      startTime.value &&
      endTime.value &&
      content.value
    );
  } else if (source.value === "assignments") {
    return (
      subject.value && selectedClass.value && teacher.value && dueDate.value
    );
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
      location.value
    );
  } else if (source.value === "announcements") {
    return title.value && content.value;
  }

  return false;
});

const handleAdd = async () => {
  try {
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
      // Create subject logic
      console.log("Creating subject...");
      // Example: const result = await apolloClient.mutate({
      //   mutation: createSubject,
      //   variables: {
      //     input: {
      //       name: name.value,
      //       teachers: teachers.value
      //     }
      //   }
      // });
    } else if (source.value === "classes") {
      await apolloClient.mutate({
        mutation: createClass,
        variables: {
          input: {
            name: name.value,
            capacity: parseInt(capacity.value),
            // supervisor: supervisor.value,  // FIXME: Add supervisor from the BE
          },
        },
      });

      await classStore.refreshClasses();
      notificationStore.addNotification({
        type: "success",
        message: "Class created successfully!",
      });
    } else if (source.value === "lessons") {
      await apolloClient.mutate({
        mutation: createLesson,
        variables: {
          classId: getClassIdByName(selectedClass.value),
          subjectId: selectedSubject.value,
          createLessonInput: {
            name: name.value,
            day: day.value,
            startTime: startTime.value,
            endTime: endTime.value,
          },
        },
      });
      await lessonStore.refreshLessons();
      notificationStore.addNotification({
        type: "success",
        message: "Lesson created successfully!",
      });
    } else if (source.value === "exams") {
      // Create exam logic
      // FIXME: update the mutation, take out lesson add content, day etc
      console.log("Creating exam...");
      await apolloClient.mutate({
        mutation: createExam,
        variables: {
          input: {
            classId: getClassIdByName(selectedClass.value),
            subjectId: selectedSubject.value,
            startTime: startTime.value,
            endTime: endTime.value,
            title: title.value,
            date: day.value,
            content: content.value,
          },
        },
      });
      notificationStore.addNotification({
        type: "success",
        message: "Exam created successfully!",
      });
    } else if (source.value === "assignments") {
      // Create assignment logic
      console.log("Creating assignment...");
      await apolloClient.mutate({
        mutation: createAssignment,
        variables: {
          input: {
            subject: subject.value,
            classes: classes.value,
            teacher: teacher.value,
            dueDate: dueDate.value,
          },
        },
      });
      notificationStore.addNotification({
        type: "success",
        message: "Assignment created successfully!",
      });
    } else if (source.value === "results") {
      // Create result logic
      console.log("Creating result...");
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
      // Create event logic
      console.log("Creating event...");
      await apolloClient.mutate({
        mutation: createEvent,
        variables: {
          data: {
            title: title.value,
            description: content.value,
            classId: selectedClass.value || null,
            location: location.value,
            startTime: new Date(
              `${date.value}T${startTime.value}`
            ).toISOString(),
            endTime: new Date(`${date.value}T${endTime.value}`).toISOString(),
            type: "GENERAL",
            visibility: "PUBLIC",
            targetRoles: ["ADMIN", "TEACHER", "STUDENT", "PARENT"],
          },
        },
      });
      notificationStore.addNotification({
        type: "success",
        message: "Event created successfully!",
      });
    } else if (source.value === "announcements") {
      // Create announcement logic
      console.log("Creating announcement...");
      await apolloClient.mutate({
        mutation: createAnnouncement,
        variables: {
          title: title.value,
          content: content.value || "",
          classId: selectedClass.value || null,
          targetRoles: ["ADMIN", "TEACHER", "STUDENT", "PARENT"],
        },
      });
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
      message: `Error creating ${source.value}: ${error.message}`,
    });
  }
};

onMounted(async () => {
  await Promise.all([
    classStore.fetchClasses(),
    teacherStore.fetchTeachers(),
    subjectStore.fetchSubjects(),
  ]);
});
</script>
