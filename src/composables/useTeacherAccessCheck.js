import { computed } from 'vue';
import { useTeacherStore } from '../store/teacherStore';
import { useUserStore } from '../store/userStore';
import { useClassStore } from '../store/classStore';
import { useSubjectStore } from '../store/subjectStore';
import { useLessonStore } from '../store/lessonStore';

export function useTeacherAccessCheck() {
  const userStore = useUserStore();
  const teacherStore = useTeacherStore();
  const classStore = useClassStore();
  const subjectStore = useSubjectStore();
  const lessonStore = useLessonStore();

  const userId = computed(() => userStore.userInfo?.id);
  const isTeacher = computed(() => userStore.userInfo?.role === 'TEACHER');

  const isAssignedToSelection = (selectedClass, selectedSubject, selectedLesson) => {
    if (!isTeacher.value) return false;

    // Get selected class and subject objects
    const classObj = classStore.allClasses.find(
      (c) => c.name === selectedClass
    );
    const subject = subjectStore.subjects.find(
      (s) => s.id === selectedSubject
    );
    const lesson = lessonStore.lessons.find((l) => l.id === selectedLesson);

    // Use the getter from teacherStore
    return teacherStore.isTeacherAssigned(userId.value, classObj, subject, lesson);
  };

  return {
    isTeacher,
    userId,
    isAssignedToSelection
  };
}