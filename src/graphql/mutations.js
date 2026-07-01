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
      adminId
      role
      email
      username
      name
      surname
      dateOfBirth
      image
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
      teacherId
      institutionalEmail
      role
      email
      username
      name
      surname
      image
      dateOfBirth
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
      studentId
      institutionalEmail
      role
      email
      username
      name
      surname
      dateOfBirth
      image
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
      dateOfBirth
      image
    }
  }
`;

export const createInvitationMutation = gql`
  mutation CreateInvitation($input: CreateInvitationInput!) {
    createInvitation(input: $input) {
      id
      name
      email
      role
      status
      sentAt
      sentCount
      lastSentAt
      expiresAt
      revokedAt
    }
  }
`;

export const acceptInvitationMutation = gql`
  mutation AcceptInvitation($input: AcceptInvitationInput!) {
    acceptInvitation(input: $input) {
      token
      refreshToken
      userId
      adminId
      teacherId
      studentId
      institutionalEmail
      role
      email
      username
      name
      surname
      dateOfBirth
      image
      address
      phone
      bloodType
      sex
    }
  }
`;

export const resendInvitationMutation = gql`
  mutation ResendInvitation($id: String!) {
    resendInvitation(id: $id) {
      id
      name
      email
      role
      status
      sentAt
      sentCount
      expiresAt
      lastSentAt
      revokedAt
    }
  }
`;

export const revokeInvitationMutation = gql`
  mutation RevokeInvitation($id: String!) {
    revokeInvitation(id: $id) {
      id
      name
      email
      role
      status
      sentAt
      sentCount
      expiresAt
      lastSentAt
      acceptedAt
      revokedAt
    }
  }
`;

export const updateSetupStateMutation = gql`
  mutation UpdateSetupState($input: UpdateSetupStateInput!) {
    updateSetupState(input: $input) {
      id
      schoolName
      schoolDomain
      schoolAddress
      schoolLogo
      schoolContactName
      schoolEmail
      schoolPhone
      schoolTimezone
      academicYearCurrent
      academicYearNext
      currentTerm
      weeklyDigestEnabled
      weeklyDigestDayOfWeek
      weeklyDigestSendHour
      weeklyDigestSendMinute
      attendanceReasonCodes
      createdAt
      updatedAt
    }
  }
`;

export const loginMutation = gql`
  mutation Login($input: BaseLoginInput!) {
    login(input: $input) {
      token
      refreshToken
      userId
      adminId
      teacherId
      studentId
      institutionalEmail
      passwordChangeRequired
      role
      email
      username
      name
      surname
      dateOfBirth
      image
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

export const completePasswordSetupMutation = gql`
  mutation CompletePasswordSetup($input: CompletePasswordSetupInput!) {
    completePasswordSetup(input: $input)
  }
`;

export const changePasswordMutation = gql`
  mutation ChangePassword($input: ChangePasswordInput!) {
    changePassword(input: $input)
  }
`;

export const assignAdminRole = gql`
  mutation assignAdminRole($role: String!, $targetId: String!) {
    assignAdminRole(role: $role, targetId: $targetId) {
      id
      email
      image
      role
      username
    }
  }
`;

export const setUserActiveStatus = gql`
  mutation setUserActiveStatus(
    $targetId: String!
    $isActive: Boolean!
    $reason: String
  ) {
    setUserActiveStatus(
      targetId: $targetId
      isActive: $isActive
      reason: $reason
    ) {
      ... on Admin {
        id
        adminRole: role
        isActive
        deactivatedAt
      }
      ... on Teacher {
        id
        teacherRole: role
        isActive
        deactivatedAt
      }
      ... on Student {
        id
        studentRole: role
        isActive
        deactivatedAt
      }
      ... on Parent {
        id
        parentRole: role
        isActive
        deactivatedAt
      }
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
      aboutMe
      image
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
      aboutMe
      phone
      image
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
      aboutMe
      image
      phone
      sex
    }
  }
`;

export const adminUpdateStudent = gql`
  mutation AdminUpdateStudent(
    $studentId: String!
    $input: UpdateStudentAdminInput!
  ) {
    adminUpdateStudent(studentId: $studentId, input: $input) {
      id
      studentId
      name
      surname
      phone
      address
      parentId
      classId
      parent {
        id
        name
        surname
        email
        phone
      }
      class {
        id
        name
      }
    }
  }
`;

export const adminCreateStudent = gql`
  mutation AdminCreateStudent($input: CreateStudentAdminInput!) {
    adminCreateStudent(input: $input) {
      temporaryPassword
      student {
        id
        studentId
        username
        name
        surname
        email
        phone
        address
        parentId
        classId
        parent {
          id
          name
          surname
          email
          phone
        }
        class {
          id
          name
        }
      }
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
      address
      image
      dateOfBirth
      aboutMe
      phone
      weeklyDigestOptOut
    }
  }
`;

export const updateWeeklyDigestPreference = gql`
  mutation UpdateWeeklyDigestPreference($optOut: Boolean!) {
    updateWeeklyDigestPreference(optOut: $optOut) {
      id
      weeklyDigestOptOut
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
      status
      reason
      reasonCode
      note
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

export const createAttendanceSession = gql`
  mutation CreateAttendanceSession($lessonId: String!, $date: DateTime!) {
    createAttendanceSession(lessonId: $lessonId, date: $date) {
      token
      expiresAt
      qrPayload
    }
  }
`;

export const createAttendanceSessionBySubject = gql`
  mutation CreateAttendanceSessionBySubject(
    $classId: String!
    $subjectId: String!
    $date: DateTime!
  ) {
    createAttendanceSessionBySubject(
      classId: $classId
      subjectId: $subjectId
      date: $date
    ) {
      token
      expiresAt
      qrPayload
    }
  }
`;

export const checkInAttendance = gql`
  mutation CheckInAttendance($token: String!) {
    checkInAttendance(token: $token) {
      id
      date
      present
      status
      reason
      reasonCode
      note
      studentId
      lessonId
      classId
    }
  }
`;

export const markAttendanceBySubject = gql`
  mutation MarkAttendanceBySubject(
    $classId: String!
    $subjectId: String!
    $date: DateTime!
    $attendanceData: [MarkAttendanceInput!]!
  ) {
    markAttendanceBySubject(
      classId: $classId
      subjectId: $subjectId
      date: $date
      attendanceData: $attendanceData
    ) {
      id
      date
      present
      status
      reason
      reasonCode
      note
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

//  might want to assign an exam to only certain students in a class (for example, makeup exams, special assessments)
export const assignExamToStudent = gql`
  mutation assignExamToStudent($input: AssignExamToStudentInput) {
    assignExamToStudent(input: $input) {
      id
      completedAt
      createdAt
      hasTaken
      startedAt
      student {
        id
        name
        surname
      }
      exam {
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
  }
`;

export const startExam = gql`
  mutation startExam($input: StartExamInput) {
    startExam(input: $input) {
      id
      completedAt
      createdAt
      examId
      hasTaken
      startedAt
      studentId
      exam {
        id
        title
      }
    }
  }
`;

export const completeExam = gql`
  mutation completeExam($input: CompleteExamInput!) {
    completeExam(input: $input) {
      completedAt
      createdAt
      examId
      hasTaken
      startedAt
      studentId
      exam {
        id
        title
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

export const deleteAssignment = gql`
  mutation deleteAssignment($assignmentId: String!) {
    deleteAssignment(assignmentId: $assignmentId) {
      message
      success
    }
  }
`;

export const deleteUser = gql`
  mutation deleteUser($targetId: String!) {
    deleteUser(targetId: $targetId)
  }
`;

export const gradeSubmissionMutation = gql`
  mutation GradeSubmission($input: GradeSubmissionInput!) {
    gradeSubmission(input: $input) {
      id
      status
      submissionDate
      content
      student {
        id
        name
        surname
        image
      }
      assignment {
        id
        title
        dueDate
        class {
          id
          name
        }
        subject {
          id
          name
        }
      }
      result {
        id
        score
        comments
        academicPeriod
        term
        isOfficialResult
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

export const deleteResult = gql`
  mutation deleteResult($id: String!) {
    deleteResult(id: $id) {
      success
      message
    }
  }
`;

export const cancelEvent = gql`
  mutation cancelEvent($id: String!, $reason: String!) {
    cancelEvent(id: $id, reason: $reason) {
      id
      title
      startTime
      endTime
      status
      description
      classId
      class {
        id
        name
      }
      targetRoles
    }
  }
`;

export const createFeeStructure = gql`
  mutation createFeeStructure($input: CreateFeeStructureInput!) {
    createFeeStructure(input: $input) {
      id
      academicYear
      term
      type
      classes {
        name
      }
      description
      totalAmount
      components {
        id
        name
        description
        amount
      }
    }
  }
`;

export const updateFeeStructure = gql`
  mutation updateFeeStructure($id: String!, $input: UpdateFeeStructureInput!) {
    updateFeeStructure(id: $id, input: $input) {
      id
      academicYear
      term
      type
      totalAmount
      classes {
        id
        name
      }
      components {
        id
        name
        description
        amount
      }
    }
  }
`;

export const deleteFeeStructure = gql`
  mutation deleteFeeStructure($feeStructureId: String!) {
    deleteFeeStructure(feeStructureId: $feeStructureId) {
      success
      message
    }
  }
`;

export const generateInvoice = gql`
  mutation generateInvoice($feeStructureId: String!) {
    generateInvoice(feeStructureId: $feeStructureId) {
      id
      invoiceNumber
      totalAmount
      paidAmount
      dueDate
      status
      createdAt
      feeStructure {
        id
        academicYear
        term
        type
        totalAmount
      }
      payments {
        id
        amount
        status
        createdAt
      }
    }
  }
`;

export const initiatePayment = gql`
  mutation initiatePayment($invoiceId: String!, $amount: Float!) {
    initiatePayment(invoiceId: $invoiceId, amount: $amount)
  }
`;

export const findOrCreateDirectConversation = gql`
  mutation FindOrCreateDirectConversation($participantId: String!) {
    findOrCreateDirectConversation(participantId: $participantId) {
      id
      type
      unreadCount
      createdAt
      updatedAt
      participants {
        id
        role
        displayName
        name
        surname
        image
        email
        subtitle
      }
      lastMessage {
        id
        conversationId
        content
        attachments {
          name
          mimeType
          size
          url
          kind
        }
        createdAt
        updatedAt
        sender {
          id
          role
          displayName
          name
          surname
          image
          email
          subtitle
        }
      }
    }
  }
`;

export const sendChatMessage = gql`
  mutation SendChatMessage(
    $conversationId: String!
    $content: String
    $attachments: [ChatAttachmentInput!]
  ) {
    sendChatMessage(
      conversationId: $conversationId
      content: $content
      attachments: $attachments
    ) {
      id
      conversationId
      content
      attachments {
        name
        mimeType
        size
        url
        kind
      }
      createdAt
      updatedAt
      sender {
        id
        role
        displayName
        name
        surname
        image
        email
        subtitle
      }
    }
  }
`;

export const markChatConversationAsRead = gql`
  mutation MarkChatConversationAsRead($conversationId: String!) {
    markChatConversationAsRead(conversationId: $conversationId)
  }
`;

export const deleteChatMessage = gql`
  mutation DeleteChatMessage($messageId: String!) {
    deleteChatMessage(messageId: $messageId)
  }
`;
