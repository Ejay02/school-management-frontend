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

export const currentUserQuery = gql`
  query CurrentUser {
    currentUser {
      id
      username
      email
    }
  }
`;

export const getAllAdminsQuery = gql`
  query getAllAdmins {
    getAllAdmins {
      id
      username
      email
      role
      img
      dateOfBirth
    }
  }
`;

export const getAllTeachers = gql`
  query getAllTeachers($pagination: PaginationInput) {
    getAllTeachers(params: $pagination) {
      id
      username
      name
      surname
      email
      role
      address
      img
      phone
      dateOfBirth
      subjects {
        id
        name
      }
    }
  }
`;

export const getAllStudents = gql`
  query getAllStudents($pagination: PaginationInput) {
    getAllStudents(params: $pagination) {
      id
      username
      role
      name
      surname
      email
      phone
      address
      dateOfBirth
      img
      sex
      parent {
        name
        surname
      }
      class {
        id
        name
        lessons {
          name
          attendances {
            date
            present
          }
        }
      }
      attendances {
        date
        present
      }

      createdAt
    }
  }
`;

export const getAllParents = gql`
  query getAllParents($pagination: PaginationInput) {
    getAllParents(params: $pagination) {
      id
      username
      name
      surname
      email
      role
      address
      dateOfBirth
      phone
      img
      students {
        id
        username
        name
        surname
        img
      }
    }
  }
`;

export const getStudentGenderStats = gql`
  query getStudentGenderStats($classId: String) {
    getStudentsByGender(classId: $classId) {
      totalStudents
      maleCount
      femaleCount
      malePercentage
      femalePercentage
      totalCapacity
    }
  }
`;

export const getDashboardUserCardSummary = gql`
  query getDashboardUserCardSummary {
    getDashboardUserCardSummary {
      role
      academicYear {
        current
        next
      }
      counts {
        students
        parents
        teachers
        admins
      }
    }
  }
`;

export const getIncomeGraphData = gql`
  query getIncomeGraphData {
    getIncomeGraphData {
      revenue
    }
  }
`;

export const getTeacherById = gql`
  query getTeacherById($teacherId: String!) {
    getTeacherById(teacherId: $teacherId) {
      id
      username
      role
      name
      surname
      email
      phone
      address
      img
      bloodType
      sex
      createdAt
      subjects {
        id
        name
      }
      lessons {
        id
        name
      }
      classes {
        id
        name
      }
    }
  }
`;

export const getStudentById = gql`
  query getStudentById($studentId: String!) {
    getStudentById(studentId: $studentId) {
      id
      username
      role
      name
      surname
      email
      phone
      address
      img
      bloodType
      sex
      createdAt
      class {
        id
        name
        lessons {
          name
          attendances {
            date
            present
          }
        }
      }
      attendances {
        date
        present
      }
      parent {
        id
        name
        surname
      }
    }
  }
`;

export const getAllSubjects = gql`
  query geAllStudents($pagination: PaginationInput) {
    getAllSubjects(params: $pagination) {
      id
      name
      teachers {
        id
        name
        surname
        username
      }
      lessons {
        id
        name
      }
      class {
        id
        name
      }
    }
  }
`;

export const getAllClasses = gql`
  query geAllClasses($pagination: PaginationInput) {
    getAllClasses(params: $pagination) {
      id
      name
      capacity
      students {
        id
        name
        surname
      }
      supervisor {
        id
        name
        surname
      }
      subjects {
        id
        name
        lessons {
          id
          name
          startTime
          endTime
        }
      }
      feeStructure {
        academicYear
        totalAmount
      }
    }
  }
`;

export const getAllLessons = gql`
  query geAllLessons($pagination: PaginationInput) {
    getAllLessons(params: $pagination) {
      id
      name
      day
      content
      description
      startTime
      endTime
      teacher {
        id
        name
        surname
      }
      class {
        id
        name
      }
      subject {
        id
        name
      }
    }
  }
`;

export const getLessonById = gql`
  query getLessonById($id: String!) {
    getLessonById(id: $id) {
      id
      name
      day
      content
      description
      startTime
      endTime
      teacher {
        id
        name
        surname
      }
      class {
        id
        name
      }
      subject {
        id
        name
      }
    }
  }
`;

export const getAllExams = gql`
  query getAllExams($pagination: PaginationInput) {
    getAllExams(params: $pagination) {
      id
      title
      startTime
      endTime
      createdAt
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
      teacher {
        id
        name
        surname
      }
      class {
        id
        name
      }

      subject {
        id
        name
      }
    }
  }
`;

export const getExamById = gql`
  query getExamById($examId: String!) {
    getExamById(examId: $examId) {
      id
      title
      startTime
      endTime
      createdAt
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
      teacher {
        id
        name
        surname
      }
      class {
        id
        name
      }

      subject {
        id
        name
      }
    }
  }
`;

export const getAllAssignments = gql`
  query getAllAssignments($params: PaginationInput) {
    getAllAssignments(params: $params) {
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
      createdAt
      lesson {
        id
        name
      }
      teacher {
        id
        name
        surname
      }
      class {
        id
        name
      }

      subject {
        id
        name
      }
    }
  }
`;

export const getAssignmentById = gql`
  query getAssignmentById($assignmentId: String!) {
    getAssignmentById(assignmentId: $assignmentId) {
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
      createdAt
      lesson {
        id
        name
      }
      teacher {
        id
        name
        surname
      }
      class {
        id
        name
      }

      subject {
        id
        name
      }
    }
  }
`;

export const getResultStatistics = gql`
  query getResultStatistics($className: String!) {
    getResultStatistics(className: $className) {
      average
      highest
      lowest
      totalStudents
      distribution {
        above90
        above80
        above70
        below50
      }
    }
  }
`;

export const getSchoolAttendanceStats = gql`
  query getSchoolAttendanceStats($startDate: DateTime!, $endDate: DateTime!) {
    getSchoolAttendanceStats(startDate: $startDate, endDate: $endDate) {
      labels
      present
      absent
      studentCount
    }
  }
`;

export const getAttendances = gql`
  query getAttendances {
    getAttendances {
      id
      date
      present
      studentId
      createdAt
      updatedAt
      student {
        name
        surname
      }
      lesson {
        id
        name
      }
      class {
        id
        name
      }
    }
  }
`;

export const getEvents = gql`
  query getEvents($params: PaginationInput, $filter: EventFilter!) {
    getEvents(params: $params, filter: $filter) {
      id
      title
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

export const getEventById = gql`
  query getEventById($id: String!) {
    getEventById(id: $id) {
      id
      title
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

export const getUserById = gql`
  query getUserById($id: String!) {
    getUserById(id: $id) {
      ... on Admin {
        id
        username
        # name
        # surname
        email
        img
        adminRole: role
      }
      ... on Student {
        id
        classId
        username
        name
        surname
        email
        img
        studentRole: role
      }
      ... on Parent {
        id
        username
        name
        surname
        email
        img
        parentRole: role
        students {
          id
          name
          surname
        }
      }
      ... on Teacher {
        id
        username
        name
        surname
        email
        img
        teacherRole: role
      }
    }
  }
`;

export const getAllAnnouncements = gql`
  query getAllAnnouncements($params: AnnouncementQueryInput) {
    getAllAnnouncements(params: $params) {
      id
      title
      content
      classId
      class {
        id
        name
      }
      creatorId
      creatorRole
      targetRoles
      isArchived
      archivedAt
      createdAt
    }
  }
`;

export const getAnnouncementById = gql`
  query getAnnouncementById($announcementId: String!) {
    getAnnouncementById(announcementId: $announcementId) {
      id
      title
      content
      classId
      class {
        id
        name
      }
      creatorId
      creatorRole
      targetRoles
      isArchived
      archivedAt
      createdAt
    }
  }
`;

export const getUnreadAnnouncementsCount = gql`
  query getUnreadAnnouncementsCount {
    getUnreadAnnouncementsCount
  }
`;

export const getAllAdminUsers = gql`
  query getAllAdminUsers {
    getAllAdminUsers {
      admins {
        id
        img
        username
        email
        role
      }
      teachers {
        id
        img
        username
        name
        surname
        email
        role
      }
    }
  }
`;
