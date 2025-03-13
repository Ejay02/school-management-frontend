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

export const createAnnouncement = `
  mutation createAnnouncement($input: CreateAnnouncementInput!) {
    createAnnouncement(input: $input) {
      id
      title
      content
      createdAt
      classId
      creatorId
      creatorRole
      targetRoles
    }
  }
`;

export const updateAnnouncement = `
  mutation updateAnnouncement($id: ID!, $input: UpdateAnnouncementInput!) {
    updateAnnouncement(id: $id, input: $input) {
      id
      title
      content
      updatedAt
      classId
      targetRoles
    }
  }
`;

export const deleteAnnouncement = `
  mutation deleteAnnouncement($id: ID!) {
    deleteAnnouncement(id: $id)
  }
`;

export const markAnnouncementAsRead = `
  mutation markAnnouncementAsRead($id: ID!) {
    markAnnouncementAsRead(id: $id) {
      id
      isRead
    }
  }
`;

export const archiveAnnouncement = `
  mutation archiveAnnouncement($id: ID!) {
    archiveAnnouncement(id: $id) {
      id
      archivedAt
    }
  }
`;

export const restoreAnnouncement = `
  mutation restoreAnnouncement($id: ID!) {
    restoreAnnouncement(id: $id) {
      id
    }
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

