/*──────────────────────────────────────────────*
 |                                              |
 |    _____  _                                  |
 |   | ____|(_)                                 |
 |   |  _|  | |                                 |
 |   | |___ | |                                 |
 |   |_____|/ |                                 |
 |        |__/                                  |
 |                                              |
 |    🔧 Crafted with 🖤 by Ej                  |
 |    🔗 github.com/Ejay02                      |
 |    🚀 Clean. Scalable. Sharp.                |
 |                                              |
 *──────────────────────────────────────────────*/
import gql from "graphql-tag";

export const adminSignupMutation = gql`
  mutation AdminSignup($input: AdminSignupInput!) {
    adminSignup(input: $input) {
      id
      token
      refreshToken
      userId
      role
      email
      username
      name
      surname
    }
  }
`;

export const teacherSignupMutation = gql`
  mutation TeacherSignup($input: TeacherSignupInput!) {
    teacherSignup(input: $input) {
      id
      token
      refreshToken
      userId
      role
      email
      username
      name
      surname
    }
  }
`;

export const studentSignupMutation = gql`
  mutation StudentSignup($input: StudentSignupInput!) {
    studentSignup(input: $input) {
      id
      token
      refreshToken
      userId
      role
      email
      username
      name
      surname
    }
  }
`;

export const parentSignupMutation = gql`
  mutation ParentSignup($input: ParentSignupInput!) {
    parentSignup(input: $input) {
      id
      token
      refreshToken
      userId
      role
      email
      username
      name
      surname
    }
  }
`;

export const loginMutation = gql`
  mutation Login($input: BaseLoginInput!) {
    login(input: $input) {
      token
      refreshToken
      userId
      role
      email
      username
      name
      surname
    }
  }
`;

export const refreshTokensMutation = gql`
  mutation RefreshTokens($refreshToken: String!) {
    refreshTokens(refreshToken: $refreshToken) {
      accessToken
      refreshToken
    }
  }
`;

export const logoutMutation = gql`
  mutation Logout($refreshToken: String!) {
    logout(refreshToken: $refreshToken)
  }
`;

export const resetPasswordMutation = gql`
  mutation ResetPassword($input: ResetPasswordInput!) {
    resetPassword(input: $input) {
      accessToken
      refreshToken
      user {
        id
        username
        email
      }
    }
  }
`;

export const markAttendance = gql`
  mutation MarkAttendance(
    $lessonId: String!
    $attendanceData: [MarkAttendanceInput!]!
  ) {
    markAttendance(lessonId: $lessonId, attendanceData: $attendanceData) {
      id
      date
      present
      studentId
      lessonId
      student {
        name
        surname
      }
      class {
        name
      }
      lesson {
        name
      }
    }
  }
`;

export const createEvent = gql`
  mutation CreateEvent($data: CreateEventInput!) {
    createEvent(data: $data) {
      id
      title
      description
      class {
        id
        name
      }
      classId
      creatorId
      startTime
      endTime
      type
      location
      status
      visibility
      targetRoles
      createdAt
      updatedAt
    }
  }
`;

export const updateEvent = gql`
  mutation updateEvent($eventId: String!, $input: EditEventInput!) {
    updateEvent(eventId: $eventId, input: $input) {
      id
      title
      description
      class {
        id
        name
      }
      classId
      creatorId
      startTime
      endTime
      type
      location
      status
      visibility
      targetRoles
      createdAt
      updatedAt
    }
  }
`;

export const markEventAsRead = gql`
  mutation markEventAsRead($eventId: String!) {
    markEventAsRead(eventId: $eventId)
  }
`;

export const deleteEvent = gql`
  mutation deleteEvent($eventId: String!) {
    deleteEvent(eventId: $eventId)
  }
`;

export const createAnnouncement = gql`
  mutation createAnnouncement(
    $title: String!
    $content: String!
    $classId: String
    $targetRoles: [String!]!
  ) {
    createAnnouncement(
      title: $title
      content: $content
      classId: $classId
      targetRoles: $targetRoles
    ) {
      id
      title
      content
      classId
      class {
        id
        name
      }
      targetRoles
      creatorId
      creatorRole
      isArchived
      createdAt
    }
  }
`;

export const editAnnouncement = gql`
  mutation editAnnouncement(
    $announcementId: String!
    $title: String!
    $content: String!
    $targetRoles: [String!]
  ) {
    editAnnouncement(
      announcementId: $announcementId
      title: $title
      content: $content
      targetRoles: $targetRoles
    ) {
      id
      title
      content
      createdAt
      classId
      targetRoles
    }
  }
`;

export const markAnnouncementAsRead = gql`
  mutation markAnnouncementAsRead($announcementId: String!) {
    markAnnouncementAsRead(announcementId: $announcementId)
  }
`;

export const globalAnnouncementDelete = gql`
  mutation globalAnnouncementDelete($announcementId: String!) {
    globalAnnouncementDelete(announcementId: $announcementId)
  }
`;

export const personalAnnouncementDelete = gql`
  mutation personalAnnouncementDelete($announcementId: String!) {
    personalAnnouncementDelete(announcementId: $announcementId)
  }
`;

export const archiveAnnouncement = gql`
  mutation archiveAnnouncement($announcementId: String!) {
    archiveAnnouncement(announcementId: $announcementId)
  }
`;

export const unarchiveAnnouncement = gql`
  mutation unarchiveAnnouncement($announcementId: String!) {
    unarchiveAnnouncement(announcementId: $announcementId)
  }
`;

export const createClass = gql`
  mutation CreateClass($input: CreateClassInput!) {
    createClass(input: $input) {
      id
      name
      capacity
      supervisor {
        id
        name
        surname
      }
      supervisorId
      students {
        id
        name
        surname
      }
    }
  }
`;

export const updateClass = gql`
  mutation UpdateClass($classId: String!, $input: UpdateClassInput!) {
    updateClass(classId: $classId, input: $input) {
      id
      name
      capacity
      supervisor {
        id
        name
        surname
      }
      supervisorId
      students {
        id
        name
        surname
      }
    }
  }
`;

export const deleteClass = gql`
  mutation deleteClass($classId: String!) {
    deleteClass(classId: $classId) {
      success
      message
    }
  }
`;

export const createExam = gql`
  mutation CreateExam($input: CreateExamInput!) {
    createExam(input: $input) {
      id
      title
      date
      description
      instructions
      content
      questions {
        id
        type
        content
        options
        correctAnswer
        points
      }
      class {
        id
        name
        students {
          id
          name
          surname
        }
      }

      classId
      startTime
      endTime

      teacher {
        id
        name
        surname
      }
    }
  }
`;

export const updateExam = gql`
  mutation updateExam($examId: String!, $input: UpdateExamInput!) {
    updateExam(examId: $examId, input: $input) {
      id
      title
      startTime
      endTime
      date
      description
      instructions
      content
      questions {
        id
        type
        content
        options
        correctAnswer
        points
      }
      subject {
        id
        name
      }
      class {
        id
        name
      }
      teacher {
        id
        name
      }
    }
  }
`;

export const deleteExam = gql`
  mutation deleteExam($examId: String!) {
    deleteExam(examId: $examId) {
      message
      success
    }
  }
`;

export const createLesson = gql`
  mutation CreateLesson(
    $classId: String!
    $createLessonInput: CreateLessonInput!
    $subjectId: String!
  ) {
    createLesson(
      createLessonInput: $createLessonInput
      classId: $classId
      subjectId: $subjectId
    ) {
      id
      name
      day
      content
      description
      class {
        id
        name
        students {
          id
          name
          surname
        }
      }

      classId
      startTime
      endTime

      teacher {
        id
        name
        surname
      }
    }
  }
`;

export const editLesson = gql`
  mutation EditLesson($lessonId: String!, $editLessonInput: EditLessonInput!) {
    editLesson(lessonId: $lessonId, editLessonInput: $editLessonInput) {
      id
      name
      day
      content
      description
      class {
        id
        name
        students {
          id
          name
          surname
        }
      }

      classId
      startTime
      endTime

      teacher {
        id
        name
        surname
      }
    }
  }
`;

export const deleteLesson = gql`
  mutation deleteLesson($lessonId: String!) {
    deleteLesson(lessonId: $lessonId) {
      message
      success
    }
  }
`;

export const createAssignment = gql`
  mutation CreateAssignment($createAssignmentInput: CreateAssignmentInput!) {
    createAssignment(createAssignmentInput: $createAssignmentInput) {
      id
      title
      startDate
      dueDate
      description
      instructions
      content
      questions {
        id
        type
        content
        options
        correctAnswer
        points
      }
      lesson {
        id
        name
      }

      classId
      dueDate
      teacher {
        id
        name
        surname
      }
    }
  }
`;

export const editAssignment = gql`
  mutation editAssignment(
    $assignmentId: String!
    $editAssignmentInput: EditAssignmentInput!
  ) {
    editAssignment(
      assignmentId: $assignmentId
      editAssignmentInput: $editAssignmentInput
    ) {
      id
      title
      startDate
      dueDate
      description
      instructions
      content
      questions {
        id
        type
        content
        options
        correctAnswer
        points
      }
      subject {
        id
        name
      }
      class {
        id
        name
      }
      teacher {
        id
        name
      }
      lesson {
        id
        name
      }
    }
  }
`;

export const createSubject = gql`
  mutation CreateSubject($input: CreateSubjectInput!) {
    createSubject(input: $input) {
      id
      name
      teachers {
        id
        name
        surname
      }
      class {
        id
        name
      }
    }
  }
`;

export const updateSubject = gql`
  mutation updateSubject($subjectId: String!, $input: UpdateSubjectInput!) {
    updateSubject(subjectId: $subjectId, input: $input) {
      id
      name
      teachers {
        id
        name
        surname
      }
      class {
        id
        name
      }
    }
  }
`;

export const deleteSubject = gql`
  mutation deleteSubject($subjectId: String!) {
    deleteSubject(subjectId: $subjectId) {
      success
      message
    }
  }
`;

export const assignAdminRole = gql`
  mutation assignAdminRole($role: String!, $targetId: String!) {
    assignAdminRole(role: $role, targetId: $targetId) {
      id
     email
     img
     role
     username
    }
  }
`;



export const updateAdminProfile = gql`
  mutation UpdateAdminProfile($input: UpdateProfileInput!) {
    updateAdminProfile(input: $input) {
      id
      name
      surname
      username
      img
      email
      dateOfBirth
    }
  }
`;

export const updateTeacherProfile = gql`
  mutation UpdateTeacherProfile($input: UpdateProfileInput!) {
    updateTeacherProfile(input: $input) {
      id
      name
      surname
      username
      email
      address
      bloodType
      dateOfBirth
      phone
      img
      sex
    }
  }
`;

export const updateStudentProfile = gql`
  mutation UpdateStudentProfile($input: UpdateProfileInput!) {
    updateStudentProfile(input: $input) {
      id
      name
      surname
      email
      address
      bloodType
      dateOfBirth
      img
      phone
      sex
    }
  }
`;

export const updateParentProfile = gql`
  mutation UpdateParentProfile($input: UpdateProfileInput!) {
    updateParentProfile(input: $input) {
      id
      name
      surname
      email
      img
      dateOfBirth
    }
  }
`;


