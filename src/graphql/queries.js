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

export const validateInvitationTokenQuery = gql`
  query ValidateInvitationToken($token: String!) {
    validateInvitationToken(token: $token) {
      email
      role
      status
      expiresAt
    }
  }
`;

export const validatePasswordSetupTokenQuery = gql`
  query ValidatePasswordSetupToken($token: String!) {
    validatePasswordSetupToken(token: $token) {
      role
      username
      name
      surname
      expiresAt
    }
  }
`;

export const invitationsQuery = gql`
  query Invitations(
    $params: PaginationInput
    $status: InviteStatus
    $role: Roles
  ) {
    invitations(params: $params, status: $status, role: $role) {
      items {
        id
        name
        email
        role
        status
        sentAt
        sentCount
        lastSentAt
        reminderCount
        lastReminderSentAt
        expiresAt
        acceptedAt
        revokedAt
        createdAt
      }
      pageInfo {
        page
        limit
        totalCount
        totalPages
        hasMore
      }
    }
  }
`;

export const invitationSummaryQuery = gql`
  query InvitationSummary($role: Roles) {
    invitationSummary(role: $role) {
      totalSent
      accepted
      pending
      expired
      revoked
      activationRate
      activationLabel
      roleBreakdown {
        role
        totalSent
        accepted
        pending
        expired
        revoked
        activationRate
        activationLabel
      }
    }
  }
`;

export const getSetupStateQuery = gql`
  query GetSetupState {
    getSetupState {
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
      createdAt
      updatedAt
    }
  }
`;

export const getSetupProgressQuery = gql`
  query GetSetupProgress {
    getSetupProgress {
      completedSteps
      totalSteps
      completionPercentage
      state {
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
        createdAt
        updatedAt
      }
      steps {
        key
        label
        completed
        value
      }
    }
  }
`;

export const getOnboardingChecklistQuery = gql`
  query GetOnboardingChecklist {
    getOnboardingChecklist {
      completedSteps
      totalSteps
      completionPercentage
      steps {
        key
        label
        complete
        summary
        meta {
          count
          total
          accepted
          pending
          expired
        }
      }
    }
  }
`;

export const invoicesDueThisWeekQuery = gql`
  query InvoicesDueThisWeek {
    invoicesDueThisWeek {
      id
      invoiceNumber
      parentId
      feeStructureId
      totalAmount
      paidAmount
      status
      dueDate
      createdAt
      updatedAt
    }
  }
`;

export const getAllAdminsQuery = gql`
  query getAllAdmins {
    getAllAdmins {
      id
      adminId
      username
      email
      name
      surname
      role
      image
      dateOfBirth
      aboutMe
      isActive
      deactivatedAt
    }
  }
`;

export const getAllTeachers = gql`
  query getAllTeachers($pagination: PaginationInput) {
    getAllTeachers(params: $pagination) {
      id
      teacherId
      username
      name
      surname
      email
      institutionalEmail
      role
      address
      image
      phone
      dateOfBirth
      aboutMe
      isActive
      deactivatedAt
      subjects {
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

export const getAllStudents = gql`
  query getAllStudents($pagination: PaginationInput) {
    getAllStudents(params: $pagination) {
      id
      studentId
      parentId
      classId
      username
      role
      name
      surname
      email
      institutionalEmail
      phone
      address
      aboutMe
      dateOfBirth
      image
      sex
      isActive
      deactivatedAt
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

export const securityLogsQuery = gql`
  query SecurityLogs(
    $params: PaginationInput
    $action: String
    $username: String
    $ipAddress: String
  ) {
    securityLogs(
      params: $params
      action: $action
      username: $username
      ipAddress: $ipAddress
    ) {
      items {
        id
        action
        username
        ipAddress
        timestamp
        details
      }
      pageInfo {
        page
        limit
        totalCount
        totalPages
        hasMore
      }
    }
  }
`;

export const auditLogsQuery = gql`
  query AuditLogs(
    $params: PaginationInput
    $entityType: String
    $actor: String
    $startDate: DateTime
    $endDate: DateTime
  ) {
    auditLogs(
      params: $params
      entityType: $entityType
      actor: $actor
      startDate: $startDate
      endDate: $endDate
    ) {
      items {
        id
        action
        entityType
        entityId
        entityLabel
        actorId
        actorUsername
        actorName
        actorSurname
        actorEmail
        actorRole
        ipAddress
        timestamp
        changes {
          field
          before
          after
        }
      }
      pageInfo {
        page
        limit
        totalCount
        totalPages
        hasMore
      }
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
      image
      aboutMe
      isActive
      deactivatedAt
      students {
        id
        username
        name
        surname
        image
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

export const getAdminDashboardOverview = gql`
  query getAdminDashboardOverview {
    getAdminDashboardOverview {
      dashboardSummary {
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
      onboardingChecklist {
        completedSteps
        totalSteps
        completionPercentage
        steps {
          key
          label
          complete
          summary
          meta {
            count
            total
            accepted
            pending
            expired
          }
        }
      }
      invitationSummary {
        totalSent
        accepted
        pending
        expired
        revoked
        activationRate
        activationLabel
        roleBreakdown {
          role
          totalSent
          accepted
          pending
          expired
          revoked
          activationRate
          activationLabel
        }
      }
      invoicesDueThisWeek {
        id
        totalAmount
        paidAmount
        dueDate
        status
      }
      financeOverview {
        months
        income
        outstanding
        totalIncome
        totalOutstanding
      }
    }
  }
`;

export const getTeacherTodayOverview = gql`
  query getTeacherTodayOverview {
    getTeacherTodayOverview {
      nextClasses {
        id
        name
        className
        subjectName
        startTime
        endTime
      }
      attendanceDueCount
      assignmentsToGradeCount
    }
  }
`;

export const getTeacherPendingSubmissions = gql`
  query getTeacherPendingSubmissions($params: PaginationInput) {
    getTeacherPendingSubmissions(params: $params) {
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
    }
  }
`;

export const getTeacherSubmissions = gql`
  query getTeacherSubmissions($params: PaginationInput) {
    getTeacherSubmissions(params: $params) {
      id
      status
      submissionDate
      content
      updatedAt
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

export const getIncomeGraphData = gql`
  query getIncomeGraphData {
    getIncomeGraphData {
      revenue
    }
  }
`;

export const getFinanceOverview = gql`
  query getFinanceOverview {
    getFinanceOverview {
      months
      income
      outstanding
      totalIncome
      totalOutstanding
    }
  }
`;

export const getTeacherById = gql`
  query getTeacherById($teacherId: String!) {
    getTeacherById(teacherId: $teacherId) {
      id
      teacherId
      username
      role
      name
      surname
      email
      institutionalEmail
      phone
      address
      image
      bloodType
      sex
      aboutMe
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
      studentId
      username
      role
      name
      surname
      email
      institutionalEmail
      phone
      address
      image
      bloodType
      sex
      aboutMe
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
  query geAllStudents($pagination: PaginationInput, $studentId: String) {
    getAllSubjects(params: $pagination, studentId: $studentId) {
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
        teachers {
          id
          name
          surname
        }
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
  query geAllLessons($pagination: PaginationInput, $studentId: String) {
    getAllLessons(params: $pagination, studentId: $studentId) {
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
  query getAllExams($params: PaginationInput) {
    getAllExams(params: $params) {
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
        image
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

export const getClassExams = gql`
  query getClassExams($classId: String!, $params: PaginationInput) {
    getClassExams(classId: $classId, params: $params) {
      id
      class {
        id
        name
      }
      classId
      content
      date
      description
      startTime
      endTime
      instructions
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
      title
      teacherId
      createdAt
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

export const getStudentExams = gql`
  query getStudentExams($studentId: String!) {
    getStudentExams(studentId: $studentId) {
      completedAt
      createdAt
      exam {
        class {
          id
          name
        }
        content
        description
        endTime
        id

        instructions
        questions {
          content
          correctAnswer
          id
          options
          points
          type
        }
        startTime
        title
      }
    }
  }
`;

export const getAllAssignments = gql`
  query getAllAssignments($params: PaginationInput, $studentId: String) {
    getAllAssignments(params: $params, studentId: $studentId) {
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
      classId
      teacherId
      subjectId
      lessonId
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

export const getClassResults = gql`
  query getClassResults(
    $classId: String!
    $academicPeriod: String!
    $params: PaginationInput
  ) {
    getClassResults(
      classId: $classId
      academicPeriod: $academicPeriod
      params: $params
    ) {
      # These fields don't exist in the GraphQL schema but are returned by the resolver
      # We need to use @client directive to tell Apollo this is client-side only
      data @client {
        id
        name
        surname
        image
        termResults @client {
          FIRST @client {
            exams @client {
              id
              examId
              examTitle
              score
              comments
              createdAt
            }
            assignments @client {
              id
              assignmentId
              assignmentTitle
              score
              comments
              createdAt
            }
            averageScore
          }
          SECOND @client {
            exams @client {
              id
              examId
              examTitle
              score
              comments
              createdAt
            }
            assignments @client {
              id
              assignmentId
              assignmentTitle
              score
              comments
              createdAt
            }
            averageScore
          }
          THIRD @client {
            exams @client {
              id
              examId
              examTitle
              score
              comments
              createdAt
            }
            assignments @client {
              id
              assignmentId
              assignmentTitle
              score
              comments
              createdAt
            }
            averageScore
          }
          OVERALL @client {
            score
          }
        }
      }
      meta @client {
        total
        page
        lastPage
        limit
      }
    }
  }
`;

export const getStudentResults = gql`
  query getStudentResults($studentId: String!) {
    getStudentResults(studentId: $studentId) {
      id
      score
      academicPeriod
      term
      type
      comments
      isOfficialResult
      createdAt
      exam {
        id
        title
        subject {
          id
          name
        }
      }
      assignment {
        id
        title
        subject {
          id
          name
        }
      }
      student {
        id
        name
        surname
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
  query getAttendances($studentId: String) {
    getAttendances(studentId: $studentId) {
      id
      date
      present
      status
      reason
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
        adminId
        username
        # name
        # surname
        email
        image
        dateOfBirth
        adminRole: role
        isActive
        deactivatedAt
      }
      ... on Student {
        id
        studentId
        classId
        username
        name
        surname
        dateOfBirth
        email
        institutionalEmail
        image
        studentRole: role
        isActive
        deactivatedAt
      }
      ... on Parent {
        id
        username
        name
        surname
        email
        image
        parentRole: role
        isActive
        deactivatedAt
        weeklyDigestOptOut
        students {
          id
          classId
          name
          surname
        }
      }
      ... on Teacher {
        id
        teacherId
        username
        name
        surname
        email
        institutionalEmail
        image
        teacherRole: role
        isActive
        deactivatedAt
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
        image
        username
        email
        role
        dateOfBirth
        name
        surname
        isActive
        deactivatedAt
      }
      teachers {
        id
        image
        username
        dateOfBirth
        name
        surname
        email
        role
        isActive
        deactivatedAt
      }
    }
  }
`;

export const getAllFeeStructures = gql`
  query getAllFeeStructures($params: PaginationInput) {
    getAllFeeStructures(params: $params) {
      id
      academicYear
      term
      type
      totalAmount
      description
      classes {
        id
        name
      }
      components {
        id
        name
        description
        amount
        feeStructureId
      }
    }
  }
`;

export const getFeeStructureById = gql`
  query getFeeStructureById($feeStructureId: String!) {
    getFeeStructureById(feeStructureId: $feeStructureId) {
      id
      academicYear
      term
      type
      totalAmount
      description
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

export const getMyInvoices = gql`
  query getMyInvoices($params: PaginationInput) {
    getMyInvoices(params: $params) {
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

export const getAllPayments = gql`
  query getAllPayments($params: PaginationInput) {
    getAllPayments(params: $params) {
      id
      amount
      classId
      className
      createdAt
      description
      feeType
      invoiceId
      parentId
      paymentMethod
      status
      studentId
      studentImage
      studentName
      studentSurname
    }
  }
`;

export const getPaymentById = gql`
  query getPaymentById($paymentId: String!) {
    getPaymentById(paymentId: $paymentId) {
      id
      amount
      classId
      className
      createdAt
      description
      feeType
      invoiceId
      parentId
      status
      studentId
      studentImage
      studentName
      studentSurname
    }
  }
`;

export const getBillingReportDashboard = gql`
  query getBillingReportDashboard {
    getBillingReportDashboard {
      totalRevenue {
        amount
        growthPercentage
      }
      outstandingPayments {
        amount
        overdueCount
        overduePercentage
      }
      collectionRate {
        rate
        targetRate
      }
      revenueTrend {
        months
        data
      }
      paymentStatusDistribution {
        labels
        data
      }
      topClassesByRevenue {
        id
        name
        revenue
      }
    }
  }
`;

export const calculateFinalGrade = gql`
  query calculateFinalGrade($classId: String!, $studentId: String!) {
    calculateFinalGrade(classId: $classId, studentId: $studentId)
  }
`;

export const getChatContacts = gql`
  query getChatContacts($search: String) {
    getChatContacts(search: $search) {
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
`;

export const getChatConversations = gql`
  query getChatConversations {
    getChatConversations {
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

export const getChatMessages = gql`
  query getChatMessages($conversationId: String!) {
    getChatMessages(conversationId: $conversationId) {
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
