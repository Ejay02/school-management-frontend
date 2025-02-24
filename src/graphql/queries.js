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
      img
      sex
      parent {
        name
        surname
      }
      class {
        id
        name
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
